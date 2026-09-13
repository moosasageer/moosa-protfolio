import { PrismaClient, SkillCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---------------------------------------------------------------------
  // Admin user — credentials come from env vars so they're never hardcoded.
  // Change these in `.env` before running `npm run db:seed`.
  // ---------------------------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL || "admin@moosasageer.dev";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: "Moosa Sageer" },
  });
  console.log(`✅ Admin user ready → ${adminEmail}`);

  // ---------------------------------------------------------------------
  // Profile (singleton)
  // ---------------------------------------------------------------------
  await prisma.profile.upsert({
    where: { id: "profile" },
    update: {},
    create: {
      id: "profile",
      name: "Moosa Sageer",
      jobTitle: "Full-Stack Developer",
      heroGreeting: "Hi, I'm Moosa.",
      heroSubtitle: "Full-Stack Developer • AI/ML Enthusiast • Creative Developer",
      heroStatement:
        "I build digital experiences, intelligent systems and things that people actually remember.",
      aboutHeading: "More than just code.",
      bio: "I'm a full-stack developer who spends as much time thinking about how software feels as how it works. My focus sits at the intersection of clean engineering and applied AI — computer vision systems that watch the road, e-commerce platforms that just work, and interfaces that don't need an instruction manual. I like problems with a real user on the other end of them.",
      shortBio: "Full-stack developer building intelligent, memorable digital experiences.",
      location: "Kerala, India",
      email: "hello@moosasageer.dev",
      currentlyBuilding: "Intelligent systems\nAI + Computer Vision\nBetter digital experiences",
      stats: {
        create: [
          { value: "10+", label: "Projects", order: 0 },
          { value: "Multiple", label: "Technologies", order: 1 },
          { value: "AI + ML", label: "Experience", order: 2 },
          { value: "100%", label: "Curiosity", order: 3 },
        ],
      },
      socialLinks: {
        create: [
          { label: "GitHub", url: "https://github.com/moosasageer", icon: "github", order: 0 },
          { label: "LinkedIn", url: "https://linkedin.com/in/moosasageer", icon: "linkedin", order: 1 },
        ],
      },
    },
  });
  console.log("✅ Profile seeded");

  // ---------------------------------------------------------------------
  // Site settings (singleton)
  // ---------------------------------------------------------------------
  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      siteTitle: "Moosa Sageer — Full-Stack Developer",
      siteDescription:
        "Full-stack developer & AI/ML enthusiast building intelligent, memorable digital experiences.",
      accentColor: "#6E56CF",
      footerText: "Designed & built by Moosa Sageer.",
      contactEmail: "hello@moosasageer.dev",
    },
  });
  console.log("✅ Site settings seeded");

  // ---------------------------------------------------------------------
  // Skills
  // ---------------------------------------------------------------------
  const skills: { name: string; category: SkillCategory; icon: string; order: number }[] = [
    { name: "HTML", category: "FRONTEND", icon: "code-2", order: 0 },
    { name: "CSS", category: "FRONTEND", icon: "palette", order: 1 },
    { name: "JavaScript", category: "FRONTEND", icon: "file-code", order: 2 },
    { name: "TypeScript", category: "FRONTEND", icon: "file-type", order: 3 },
    { name: "React", category: "FRONTEND", icon: "atom", order: 4 },
    { name: "Next.js", category: "FRONTEND", icon: "layers", order: 5 },
    { name: "Node.js", category: "BACKEND", icon: "server", order: 0 },
    { name: "REST APIs", category: "BACKEND", icon: "plug", order: 1 },
    { name: "Python", category: "PROGRAMMING", icon: "terminal", order: 0 },
    { name: "Java", category: "PROGRAMMING", icon: "coffee", order: 1 },
    { name: "C", category: "PROGRAMMING", icon: "hash", order: 2 },
    { name: "C++", category: "PROGRAMMING", icon: "hash", order: 3 },
    { name: "AI / ML", category: "AI_ML", icon: "brain-circuit", order: 0 },
    { name: "Computer Vision", category: "AI_ML", icon: "scan-eye", order: 1 },
    { name: "SQL", category: "DATABASE", icon: "database", order: 0 },
    { name: "PostgreSQL", category: "DATABASE", icon: "database-zap", order: 1 },
    { name: "Git", category: "TOOLS", icon: "git-branch", order: 0 },
    { name: "GitHub", category: "TOOLS", icon: "github", order: 1 },
  ];

  for (const s of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: s.name } });
    if (!existing) await prisma.skill.create({ data: s });
  }
  console.log("✅ Skills seeded");

  // ---------------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------------
  const projects = [
    {
      title: "Intelligent Driver Safety System",
      slug: "intelligent-driver-safety-system",
      shortDescription: "AI-powered driver drowsiness and distraction detection system.",
      fullDescription:
        "A real-time computer vision system that monitors driver alertness using facial landmark detection to identify signs of drowsiness and distraction, triggering audio alerts before a lapse becomes a hazard. Built for low-latency inference on modest hardware so it can run in-vehicle rather than in the cloud.",
      technologies: "Python, OpenCV, TensorFlow, Computer Vision",
      category: "AI / Computer Vision",
      featured: true,
      published: true,
      order: 0,
    },
    {
      title: "Grocery E-Commerce Platform",
      slug: "grocery-ecommerce-platform",
      shortDescription: "Modern grocery shopping platform with customer and admin interfaces.",
      fullDescription:
        "A full-stack grocery ordering platform with a customer-facing storefront and a separate admin console for inventory, orders and pricing. Built with an emphasis on fast search, cart persistence, and a checkout flow with as little friction as possible.",
      technologies: "React, Node.js, Express, SQL",
      category: "Web",
      featured: true,
      published: true,
      order: 1,
    },
    {
      title: "AI / Computer Vision Project",
      slug: "ai-computer-vision-project",
      shortDescription: "An intelligent computer-vision based system.",
      fullDescription:
        "A general-purpose computer vision pipeline exploring object detection and classification, built as a foundation for applied vision projects — replace this with your own case study from the admin panel.",
      technologies: "Python, OpenCV, AI/ML",
      category: "AI / Computer Vision",
      featured: false,
      published: true,
      order: 2,
    },
  ];

  for (const p of projects) {
    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (!existing) await prisma.project.create({ data: p });
  }
  console.log("✅ Projects seeded");

  // ---------------------------------------------------------------------
  // Experience
  // ---------------------------------------------------------------------
  const existingExp = await prisma.experience.count();
  if (existingExp === 0) {
    await prisma.experience.create({
      data: {
        position: "Full-Stack Developer",
        organization: "Freelance / Independent",
        description:
          "Designing and building full-stack web applications and applied AI/computer-vision systems end to end — from architecture through deployment.",
        startDate: new Date("2023-01-01"),
        current: true,
        technologies: "React, Next.js, Node.js, Python, PostgreSQL",
        order: 0,
      },
    });
  }
  console.log("✅ Experience seeded");

  console.log("\n🎉 Seed complete.");
  console.log(`   Admin login → ${adminEmail} / ${adminPassword}`);
  console.log("   Change the password immediately after first login.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
