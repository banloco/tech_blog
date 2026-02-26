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
    <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-2xl">
      <div className="text-center mb-8 sm:mb-12">
        <h1
          className="text-2xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
        >
          Nous contacter
        </h1>
        <p className="mt-3" style={{ color: "#888" }}>
          Une question, une suggestion ou une proposition de collaboration ?
          Écrivez-nous.
        </p>
      </div>

      <ContactForm />
    </main>
  );
}
