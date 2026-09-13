import { Mail, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import ContactForm from "./ContactForm";
import { getSocialIcon } from "@/lib/icons";

type SocialLink = { label: string; url: string; icon: string };

export default function Contact({
  email,
  socialLinks = [],
}: {
  email: string;
  socialLinks?: SocialLink[];
}) {
  return (
    <section id="contact" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal>
          <p className="section-label mb-4">05 — Contact</p>
          <h2 className="font-display text-4xl md:text-6xl font-medium text-mist-100 text-balance">
            Let&rsquo;s build something great.
          </h2>
          <p className="mt-4 text-mist-400 text-lg">Have an idea, project, or just want to talk?</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-medium text-white hover:bg-signal-soft transition-colors">
              <MessageCircle size={16} /> Let&rsquo;s Talk
            </a>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-mist-200 hover:bg-white/5 transition-colors">
              <Mail size={16} /> Email Me
            </a>
            {socialLinks.map((link, i) => {
              const Icon = getSocialIcon(link.icon);
              return (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-mist-200 hover:bg-white/5 transition-colors"
                >
                  <Icon size={16} /> {link.label}
                </a>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
