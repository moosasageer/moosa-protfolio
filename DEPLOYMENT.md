# Deploying to AWS (EC2 + RDS Postgres)

This guide takes the project from your laptop to a live EC2 server backed by
a managed Postgres database on RDS.

Local dev and production both run Postgres — locally in Docker
(`docker-compose.yml`), in production on RDS. Same `prisma/schema.prisma`,
same connection string format, just a different `DATABASE_URL`.

---

## 0. What you'll end up with

```
Browser → EC2 (Nginx :80/443 → Node/Next.js :3000) → RDS Postgres (private)
```

One EC2 instance runs the app with PM2 (keeps it alive, restarts on crash/reboot).
Nginx sits in front for SSL and to serve on port 80/443. RDS is a separate,
private database instance — the app is the only thing that can reach it.

---

## 1. Create the RDS Postgres database

1. AWS Console → **RDS** → **Create database**.
2. Engine: **PostgreSQL** (latest stable, e.g. 16.x).
3. Templates: **Free tier** (if eligible) or **Dev/Test**.
4. Settings: DB instance identifier `moosa-portfolio-db`, master username
   `postgres`, set a strong master password (save it — you'll need it below).
5. Instance size: `db.t4g.micro` / `db.t3.micro` is plenty for a portfolio site.
6. Storage: 20 GB gp3 is fine to start.
7. **Connectivity**:
   - VPC: same VPC you'll launch the EC2 instance in.
   - Public access: **No** (the app on EC2 will reach it privately — more secure).
   - VPC security group: create a new one, e.g. `moosa-db-sg`.
8. Initial database name: `moosa_portfolio`.
9. Create the database. Wait ~5–10 minutes for status **Available**.
10. Copy the RDS **endpoint** (Console → your DB → Connectivity & security),
    e.g. `moosa-portfolio-db.xxxxxxxxxx.us-east-1.rds.amazonaws.com`.

Your production connection string will be:

```
postgresql://postgres:YOUR_PASSWORD@YOUR_RDS_ENDPOINT:5432/moosa_portfolio?schema=public
```

---

## 2. Launch the EC2 instance

1. AWS Console → **EC2** → **Launch instance**.
2. Name: `moosa-portfolio-app`.
3. AMI: **Ubuntu Server 24.04 LTS**.
4. Instance type: `t3.small` (t2/t3.micro can work but Next.js builds are
   memory-hungry — `t3.small` avoids out-of-memory build failures).
5. Key pair: create/download one (`.pem`) — you need this to SSH in.
6. Network settings — **same VPC as RDS**. Create/attach a security group
   `moosa-app-sg` allowing inbound:
   - SSH (22) from **your IP only**
   - HTTP (80) from anywhere
   - HTTPS (443) from anywhere
7. Storage: 20 GB gp3.
8. Launch.

### Let the app reach the database

Go to the RDS security group (`moosa-db-sg`) → **Inbound rules** → add a rule:
- Type: PostgreSQL (port 5432)
- Source: the **EC2 security group** (`moosa-app-sg`), not an IP.

This is what makes "public access: No" work — only traffic from instances in
`moosa-app-sg` can reach the database.

---

## 3. SSH in and install dependencies

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

On the server:

```bash
sudo apt update && sudo apt upgrade -y

# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 (process manager) and Nginx
sudo npm install -g pm2
sudo apt install -y nginx
```

---

## 4. Deploy the code

From your **local machine**, push the project to a GitHub repo (or use `scp`
to copy the zip directly — GitHub is easier for future updates).

On the **server**:

```bash
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/moosa-portfolio.git
cd moosa-portfolio
npm ci
```

Create the production `.env`:

```bash
nano .env
```

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_RDS_ENDPOINT:5432/moosa_portfolio?schema=public"
NEXTAUTH_SECRET="paste output of: openssl rand -base64 32"
NEXTAUTH_URL="https://yourdomain.com"
ADMIN_EMAIL="you@yourdomain.com"
ADMIN_PASSWORD="a-strong-password"
```

Push the Postgres schema to RDS and seed your admin user:

```bash
npm run db:push    # creates all tables on RDS, using DATABASE_URL from .env
npm run db:seed    # creates your admin login
```

Build and start:

```bash
npm run build
pm2 start npm --name moosa-portfolio -- start
pm2 save
pm2 startup                 # follow the printed command so PM2 survives reboots
```

The app is now running on `localhost:3000` on the server.

---

## 5. Put Nginx in front (and add SSL)

```bash
sudo nano /etc/nginx/sites-available/moosa-portfolio
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/moosa-portfolio /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

**Point your domain's DNS A record** at the EC2 instance's public IP (or,
better, an Elastic IP — see §7 below) before running certbot.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot edits the Nginx config to redirect HTTP → HTTPS and auto-renews the
certificate. Your site is now live at `https://yourdomain.com`.

---

## 6. Uploads (read this before relying on the admin media library)

By default this app writes uploaded images to `/public/uploads` **on the
EC2 instance's own disk**. That's fine for a single always-on server (unlike
serverless hosts, EC2 doesn't wipe the filesystem between deploys) — but it
means:

- Uploaded files are **not backed up** unless you back up the instance/volume.
- If you ever scale to more than one EC2 instance, uploads won't be shared
  between them.

For a single-server setup like this guide, it's fine to leave as-is. If you
want durability independent of the instance, see README §8 for swapping to
S3 — since every part of the app just stores a URL string, it's a small,
isolated change in `src/app/api/upload/route.ts`.

---

## 7. Recommended hardening (do these once things are working)

- **Elastic IP**: attach one to the EC2 instance so the public IP never
  changes on stop/start (EC2 console → Elastic IPs → Allocate → Associate).
- **Automated RDS backups**: RDS enables daily automated backups by default
  (check retention under your DB → Maintenance & backups).
- **EC2 instance backups**: enable an AWS Backup plan or periodic EBS
  snapshots for the instance volume (covers uploaded images + the app code).
- **Firewall**: double check the EC2 security group only allows SSH from
  your IP, not `0.0.0.0/0`.
- **Deploys**: for future updates, `git pull`, `npm ci`, `npm run build`,
  `pm2 restart moosa-portfolio`. Consider a small deploy script or GitHub
  Actions workflow once this becomes routine.

---

## Quick reference

| Task | Command |
|---|---|
| Push schema to prod DB | `npm run db:push` (with `DATABASE_URL` set to RDS) |
| Start local Postgres | `npm run db:up` |
| Stop local Postgres | `npm run db:down` |
| Seed admin user | `npm run db:seed` |
| View/edit prod data | `npx prisma studio` (run from the server, or via SSH tunnel) |
| Restart app after a deploy | `pm2 restart moosa-portfolio` |
| Tail app logs | `pm2 logs moosa-portfolio` |
