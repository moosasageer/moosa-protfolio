import type { SVGProps, ComponentType } from "react";
import {
  Code2,
  Palette,
  FileCode,
  FileType,
  Atom,
  Layers,
  Server,
  Plug,
  Terminal,
  Coffee,
  Hash,
  BrainCircuit,
  ScanEye,
  Database,
  DatabaseZap,
  GitBranch,
  Github,
  Code,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Twitch,
  Dribbble,
  Slack,
  Gitlab,
  Figma,
  Globe,
  Mail,
  MessageCircle,
  Send,
  Music2,
  Rss,
  AtSign,
  Link2,
  type LucideIcon,
} from "lucide-react";
function WhatsApp({ size = 24, className, ...props }: SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 21l1.65-4.95A9 9 0 1 1 8.05 19.35L3 21z" />
      <path d="M8.5 9.5c0-.5.5-1 1-1h.5c.3 0 .55.2.65.5l.5 1.5c.08.24.04.5-.1.7l-.5.7a5.5 5.5 0 0 0 2.5 2.5l.7-.5c.2-.14.46-.18.7-.1l1.5.5c.3.1.5.35.5.65v.5c0 .5-.5 1-1 1-3.31 0-7-3.69-7-7z" />
    </svg>
  );
}
export const ICONS: Record<string, LucideIcon> = {
  "code-2": Code2,
  palette: Palette,
  "file-code": FileCode,
  "file-type": FileType,
  atom: Atom,
  layers: Layers,
  server: Server,
  plug: Plug,
  terminal: Terminal,
  coffee: Coffee,
  hash: Hash,
  "brain-circuit": BrainCircuit,
  "scan-eye": ScanEye,
  database: Database,
  "database-zap": DatabaseZap,
  "git-branch": GitBranch,
  github: Github,
  code: Code,
};

export function getIcon(name: string): LucideIcon {
  return ICONS[name] || Code;
}

export const ICON_NAMES = Object.keys(ICONS);

// ---------------------------------------------------------------------------
// Social link icons — a curated set of brand-ish icons for the "Social
// Links" list on the Profile page (LinkedIn, Instagram, GitHub, etc). Kept
// separate from ICONS above since skills and socials are picked from
// different palettes in the admin UI.
// ---------------------------------------------------------------------------
export const SOCIAL_ICONS: Record<string, React.ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  whatsapp: WhatsApp,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitch: Twitch,
  dribbble: Dribbble,
  slack: Slack,
  gitlab: Gitlab,
  figma: Figma,
  globe: Globe,
  mail: Mail,
  "message-circle": MessageCircle,
  send: Send,
  music: Music2,
  rss: Rss,
  "at-sign": AtSign,
  link: Link2,
};

export function getSocialIcon(name: string): React.ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }> {
  return SOCIAL_ICONS[name] || Link2;
}

export const SOCIAL_ICON_NAMES = Object.keys(SOCIAL_ICONS);
