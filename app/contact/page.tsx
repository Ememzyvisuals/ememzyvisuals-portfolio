import type { Metadata } from "next";
import { profile, socials } from "@/content/site";
import { SectionHead } from "@/components/ui";
import ContactForm from "@/components/work/ContactForm";
import { SocialRow } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Hire Emmanuel Ariyo for speech AI, machine learning, full-stack products or automation. Remote, worldwide.",
};

export default function Contact() {
  return (
    <div className="pb-10 pt-28 sm:pt-36">
      <div className="page grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHead kicker="Contact" title={<>Tell me what<br />you are building.</>} sub={profile.available} />
          <a href={`mailto:${profile.email}`} className="font-display text-2xl font-extrabold hover:underline sm:text-3xl">{profile.email}</a>
          <p className="mt-3 text-sm text-muted">I usually reply within a day or two.</p>
          <div className="mt-10"><SocialRow /></div>
          <p className="sr-only">Profiles: {socials.map((s) => s.label).join(", ")}</p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
