import { prisma } from "@/lib/prisma";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Skills from "@/components/site/Skills";
import Projects from "@/components/site/Projects";
import Experience from "@/components/site/Experience";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

export const revalidate = 0; // always read fresh content from the CMS

export default async function Home() {
  const [profile, skills, projects, experience, settings] = await Promise.all([
    prisma.profile.findUnique({
      where: { id: "profile" },
      include: {
        stats: { orderBy: { order: "asc" } },
        socialLinks: { orderBy: { order: "asc" } },
      },
    }),
    prisma.skill.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
    prisma.project.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.siteSettings.findUnique({ where: { id: "settings" } }),
  ]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-mist-400 font-mono text-sm">
        Run `npm run db:seed` to initialize the portfolio content.
      </div>
    );
  }

  return (
    <>
      <Nav />
      <main>
        <Hero
          greeting={profile.heroGreeting}
          subtitle={profile.heroSubtitle}
          statement={profile.heroStatement}
          avatarUrl={profile.avatarUrl}
          name={profile.name}
          currentlyBuilding={profile.currentlyBuilding}
          socialLinks={profile.socialLinks}
        />
        <About
          heading={profile.aboutHeading}
          bio={profile.bio}
          location={profile.location}
          jobTitle={profile.jobTitle}
          stats={profile.stats}
        />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Experience items={experience} />
        <Contact email={profile.email} socialLinks={profile.socialLinks} />
      </main>
      <Footer text={settings?.footerText || "Designed & built by Moosa Sageer."} />
    </>
  );
}
