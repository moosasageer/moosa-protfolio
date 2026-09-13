import { z } from "zod";

// All admin write-routes run their payload through one of these before
// touching the database — never trust client-submitted data.

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  shortDescription: z.string().min(1).max(280),
  fullDescription: z.string().min(1),
  coverImageUrl: z.string().nullish().or(z.literal("")),
  technologies: z.string().default(""),
  githubUrl: z.string().url().nullish().or(z.literal("")),
  liveUrl: z.string().url().nullish().or(z.literal("")),
  category: z.string().default("Web"),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().int().default(0),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  ogImageUrl: z.string().nullish(),
  images: z.array(z.object({ url: z.string(), alt: z.string().optional() })).optional(),
});

export const skillSchema = z.object({
  name: z.string().min(1).max(60),
  category: z.enum(["FRONTEND", "BACKEND", "PROGRAMMING", "AI_ML", "DATABASE", "TOOLS"]),
  icon: z.string().default("code"),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const experienceSchema = z.object({
  position: z.string().min(1).max(120),
  organization: z.string().min(1).max(120),
  description: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional().or(z.literal("")),
  current: z.boolean().default(false),
  technologies: z.string().default(""),
  logoUrl: z.string().nullish(),
  order: z.number().int().default(0),
});

export const messageSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
  // Honeypot field — bots fill it, humans never see it (see ContactForm.tsx)
  company: z.string().max(0).optional().or(z.literal("")),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  jobTitle: z.string().min(1),
  heroGreeting: z.string().min(1),
  heroSubtitle: z.string().min(1),
  heroStatement: z.string().min(1),
  aboutHeading: z.string().min(1),
  bio: z.string().default(""),
  shortBio: z.string().default(""),
  location: z.string().default(""),
  avatarUrl: z.string().nullish(),
  resumeUrl: z.string().nullish(),
  email: z.string().email(),
  phone: z.string().nullish(),
  currentlyBuilding: z.string().default(""),
  stats: z
    .array(z.object({ value: z.string(), label: z.string(), order: z.number().default(0) }))
    .optional(),
  socialLinks: z
    .array(
      z.object({
        label: z.string().min(1, "Label is required"),
        url: z.string().min(1, "URL is required"),
        icon: z.string().default("link"),
        order: z.number().default(0),
      })
    )
    .optional(),
});

export const settingsSchema = z.object({
  siteTitle: z.string().min(1),
  siteDescription: z.string().min(1),
  faviconUrl: z.string().nullish(),
  accentColor: z.string().default("#6E56CF"),
  footerText: z.string().default(""),
  contactEmail: z.string().email(),
  analyticsId: z.string().nullish(),
  maintenanceMode: z.boolean().default(false),
  keywords: z.string().nullish(),
});
