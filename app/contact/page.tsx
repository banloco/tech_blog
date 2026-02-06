import type { Metadata } from "next";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact | IA & Capital",
  description:
    "Contactez l'équipe IA & Capital pour toute question, suggestion ou collaboration.",
  openGraph: {
    title: "Contact | IA & Capital",
    description:
      "Contactez l'équipe IA & Capital pour toute question, suggestion ou collaboration.",
  },
};

export default function ContactPage() {
  return (
    <main className="container mx-auto px-6 py-20 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
          Nous contacter
        </h1>
        <p className="mt-3 text-zinc-400">
          Une question, une suggestion ou une proposition de collaboration ?
          Écrivez-nous.
        </p>
      </div>

      <ContactForm />
    </main>
  );
}
