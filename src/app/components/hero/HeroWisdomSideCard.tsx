import { Sparkles, ChevronLeft, ChevronRight, Quote, Play, Film, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ISLAMIC_TEXTS } from "./types";

interface HeroWisdomSideCardProps {
  readonly setCurrentPage: (page: string) => void;
  readonly onOpenVideo?: () => void;
}

export function HeroWisdomSideCard({ setCurrentPage, onOpenVideo }: HeroWisdomSideCardProps) {
  const [verseIndex, setVerseIndex] = useState(0);

  const nextVerse = () => {
    setVerseIndex((prev) => (prev + 1) % ISLAMIC_TEXTS.length);
  };
  const prevVerse = () => {
    setVerseIndex((prev) => (prev - 1 + ISLAMIC_TEXTS.length) % ISLAMIC_TEXTS.length);
  };

  const current = ISLAMIC_TEXTS[verseIndex];

  return (
    <aside
      className="w-full flex flex-col gap-4"
      aria-label="??? ?? ????? ?????? ???????? ??????? ???????? ????????"
    >
      {/* 1. Pure Quranic & Hadith Card */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-3xl p-6 sm:p-7 bg-slate-950 text-white shadow-xl shadow-slate-900/20 flex flex-col justify-between overflow-hidden text-right border border-emerald-500/30 group transition-all duration-500 hover:border-[#C69E5A]/60"
      >
        {/* Soft Background Radial & Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C3A]/90 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C69E5A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 pattern-islamic-stars opacity-[0.05] mix-blend-overlay pointer-events-none" />

        {/* Background Quote Watermark */}
        <div className="absolute -bottom-6 -left-6 opacity-[0.06] text-white pointer-events-none">
          <Quote className="w-40 h-40" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col h-full justify-between space-y-5">
          {/* Pure Quranic Header Bar */}
          <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-white/15">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-[#E6C875] text-xs font-black font-cairo shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E6C875]" aria-hidden="true" />
              <span>{current.type === "ayah" ? "??? ????? ????" : "??? ???? ????"}</span>
            </div>

            <span className="text-emerald-100/90 text-xs font-extrabold font-cairo bg-white/10 px-3 py-1 rounded-lg border border-white/15 backdrop-blur-md">
              {current.reference}
            </span>
          </div>

          {/* Core Verse/Hadith Content */}
          <div className="my-auto py-2 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={verseIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <p className="font-amiri text-xl sm:text-2xl text-amber-50 leading-[2.2] font-extrabold text-center drop-shadow-md">
                  � {current.arabic} �
                </p>
                {current.meaning && (
                  <p className="text-xs sm:text-sm text-emerald-100/90 font-cairo leading-relaxed text-center font-medium max-w-xl mx-auto">
                    {current.meaning}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation & Clean Action Footer */}
          <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-3">
            {/* Prev/Next Verse Controls */}
            <div className="flex items-center gap-1.5" aria-label="?????? ??? ?????? ????????">
              <button
                onClick={prevVerse}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                title="??????"
                aria-label="???? ??????"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-emerald-100/80 font-mono font-bold px-1.5">
                {verseIndex + 1}/{ISLAMIC_TEXTS.length}
              </span>
              <button
                onClick={nextVerse}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
                title="??????"
                aria-label="???? ??????"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Dignified CTA */}
            <button
              onClick={() => setCurrentPage("donate")}
              aria-label="??? ??????? ????????? ????????? ???????"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C69E5A] hover:bg-[#B38B47] text-slate-950 text-xs font-black font-cairo shadow-md transition-all cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-slate-950" />
              <span>??? ??????? ?????????</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. Intelligent Dedicated Video & Documentary Showcase Card */}
      {onOpenVideo && (
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3 }}
          onClick={onOpenVideo}
          className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-[#0F4C3A] text-white border border-emerald-500/20 hover:border-amber-400/50 shadow-md cursor-pointer overflow-hidden group transition-all"
          role="button"
          tabIndex={0}
          aria-label="?????? ?????? ???????? ????????? ???????? ?????? ????? ?????"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenVideo();
            }
          }}
        >
          {/* Ambient Video Background Layer */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-500">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/images/defaults/about-hero.svg"
              className="w-full h-full object-cover scale-105 filter brightness-[0.5] contrast-[1.1] transition-all duration-700 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-[#0F4C3A]/80" />
          </div>

          {/* Interactive Media Card Content */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Animated Play Button Pulse */}
              <div className="w-11 h-11 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Film className="w-3.5 h-3.5 text-[#E6C875]" />
                  <span className="font-extrabold text-sm sm:text-base font-cairo text-white group-hover:text-amber-200 transition-colors">
                    ?????? ???????? ????????
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-cairo mt-0.5">
                  ???? ??????? ???????? ?????? ??????? ????? ?????
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-bold font-cairo text-amber-300 group-hover:-translate-x-1 transition-transform shrink-0">
              <span>??? ???????</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      )}
    </aside>
  );
}

export default HeroWisdomSideCard;
