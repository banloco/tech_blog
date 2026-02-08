"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";
import { estimateReadTime, formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";
import { useLanguage } from "@/lib/i18n";

export default function FeaturedCarousel({ posts }: { posts: Post[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();
  const featuredPosts = posts.slice(0, 5); // Limit to top 5 recent posts

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);

  if (featuredPosts.length === 0) return null;

  return (
    <section className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden group">
      {/* Slides */}
      <div className="relative w-full h-full">
        {featuredPosts.map((post, index) => (
          <div
            key={post.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 bg-zinc-900">
              {post.cover_image && (
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover opacity-60"
                  priority={index === 0}
                  sizes="100vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 z-20 container mx-auto px-4 sm:px-6 pb-8 sm:pb-12 lg:pb-20">
              <div className="max-w-2xl lg:max-w-3xl space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs lg:text-sm text-emerald-400 font-medium flex-wrap">
                  <span className="bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    {t('featured')}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {formatDate(post.created_at)}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-300">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    {estimateReadTime(post.content || "")}
                  </span>
                </div>

                <Link href={`/posts/${post.id}`}>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight hover:text-emerald-400 transition-colors line-clamp-3">
                    {post.title}
                  </h1>
                </Link>

                <p className="text-sm sm:text-base lg:text-lg text-zinc-300 line-clamp-2 max-w-2xl hidden sm:block">
                  {post.excerpt}
                </p>

                <div className="pt-2 sm:pt-4">
                  <Link
                    href={`/posts/${post.id}`}
                    className="inline-flex h-9 sm:h-10 items-center justify-center rounded-full bg-emerald-500 px-4 sm:px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
                  >
                    {t('readArticle')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500"
        aria-label={t('previousArticle')}
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-1.5 sm:p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-500"
        aria-label={t('nextArticle')}
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
        {featuredPosts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
              index === currentIndex ? "w-6 sm:w-8 bg-emerald-500" : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`${t('goToSlide')} ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
