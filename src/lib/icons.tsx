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
export const SOCIAL_ICONS: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
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

export function getSocialIcon(name: string): LucideIcon {
  return SOCIAL_ICONS[name] || Link2;
}

export const SOCIAL_ICON_NAMES = Object.keys(SOCIAL_ICONS);
