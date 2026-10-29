"use client";

import Link from "next/link";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    title: "Your neighbourhood library, online",
    text: "Find a book that someone nearby already loved, and borrow it for a week.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=70",
  },
  {
    title: "Share the books on your shelf",
    text: "Add the books you have finished. Let other readers enjoy them too.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&q=70",
  },
  {
    title: "Borrow, read, return. Repeat.",
    text: "Seven days for every book. Return it with one click when you are done.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=70",
  },
];

export function Banner() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000 }}
      pagination={{ clickable: true }}
      loop
      className="h-[460px] [--swiper-pagination-bullet-inactive-color:white] [--swiper-theme-color:var(--accent)] md:h-[540px]"
    >
      {slides.map((s) => (
        <SwiperSlide key={s.title}>
          <div
            className="relative flex size-full items-center bg-cover bg-center"
            style={{ backgroundImage: `url(${s.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />
            <div className="container relative mx-auto px-4">
              <div className="max-w-xl space-y-5 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  BookNook
                </p>
                <h1 className="font-heading text-4xl font-semibold leading-tight md:text-6xl">
                  {s.title}
                </h1>
                <p className="text-lg text-white/85">{s.text}</p>
                <Button asChild size="lg">
                  <Link href="/books">Browse Books</Link>
                </Button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
