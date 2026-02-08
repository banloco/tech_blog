"use client";

import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import Image from "next/image";
import logo from "../public/ia_&_capital.png";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950/80">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src={logo} alt="IA & Capital" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
              <span className="text-base sm:text-lg font-bold text-white">
                IA<span className="text-emerald-400">&</span>Capital
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {t('brandDescription')}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-white">{t('navigation')}</h3>
            <nav className="flex flex-col gap-2 text-xs sm:text-sm text-zinc-400">
              <Link href="/" className="hover:text-white transition-colors">{t('home')}</Link>
              <Link href="/about" className="hover:text-white transition-colors">{t('about')}</Link>
              <Link href="/contact" className="hover:text-white transition-colors">{t('contact')}</Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-white">{t('information')}</h3>
            <nav className="flex flex-col gap-2 text-xs sm:text-sm text-zinc-400">
              <Link href="/privacy" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link>
              <Link href="/mentions-legales" className="hover:text-white transition-colors">{t('legalNotice')}</Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div id="newsletter" className="space-y-3 sm:space-y-4 scroll-mt-20 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs sm:text-sm font-semibold text-white">{t('newsletterFooter')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400">
              {t('newsletterDescription')}
            </p>
            <div className="relative max-w-sm">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 lg:mt-10 pt-6 sm:pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[10px] sm:text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} IA & Capital. {t('allRightsReserved')}</p>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">{t('privacy')}</Link>
            <Link href="/mentions-legales" className="hover:text-zinc-300 transition-colors">{t('legalNotice')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
