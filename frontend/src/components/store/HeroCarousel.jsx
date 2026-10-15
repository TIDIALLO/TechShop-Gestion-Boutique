import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"

const TILT = [-5, 3, -2]
const LIFT = [8, -10, 12]

function Slide({ slide }) {
  const centered = slide.align === "center"

  return (
    <div
      className="relative h-[210px] min-w-full sm:h-[260px] md:h-[320px]"
      style={{ background: slide.background }}
    >
      {/* Toute la bannière est cliquable */}
      <Link
        to={slide.to || "/client/products"}
        className="absolute inset-0 z-0"
        aria-label={slide.title.replace(/\n/g, " ")}
      />

      <div
        className={`pointer-events-none absolute inset-y-0 z-[1] flex flex-col justify-center gap-2.5 sm:gap-3 ${
          centered
            ? "inset-x-0 items-center px-6 text-center"
            : "left-0 w-[62%] pl-10 pr-2 sm:pl-14 md:w-[55%] md:pl-20"
        }`}
      >
        {slide.tag && (
          <span className="w-fit rounded bg-[#ffd33d] px-2.5 py-1 text-[10px] font-bold uppercase text-[#5a3b00] sm:text-[11px]">
            • {slide.tag}
          </span>
        )}

        <h2 className="whitespace-pre-line font-['Ubuntu',sans-serif] text-[22px] font-bold leading-[1.15] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.2)] sm:text-4xl md:text-[46px]">
          {slide.title}
        </h2>

        {slide.pill && (
          <span
            className={`w-fit rounded-md px-3 py-1 text-xs font-bold sm:text-sm ${
              slide.theme === "dark"
                ? "bg-transparent text-[#f68b1e] text-base sm:text-xl"
                : "bg-white text-[#e8730c]"
            }`}
          >
            {slide.pill}
          </span>
        )}

        {slide.logos && (
          <div className="mt-1 flex items-center gap-2">
            {slide.logos.map(logo => (
              <span
                key={logo.label}
                className="flex h-8 items-center rounded bg-white px-2.5 sm:h-9"
              >
                <img src={logo.src} alt={logo.label} className="h-5 w-auto max-w-[64px] object-contain sm:h-6" />
              </span>
            ))}
          </div>
        )}
      </div>

      {slide.images?.length > 0 && (
        <div className="pointer-events-none absolute inset-y-0 right-3 z-[1] flex w-[40%] items-center justify-end md:right-12 md:w-[42%]">
          {slide.images.slice(0, 3).map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="-ml-6 rounded-xl bg-white p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.25)] first:ml-0 md:p-2"
              style={{
                transform: `rotate(${TILT[i]}deg) translateY(${LIFT[i]}px)`,
                zIndex: i === 1 ? 3 : 1,
              }}
            >
              <img
                src={src}
                alt=""
                className="h-20 w-20 object-contain sm:h-28 sm:w-28 md:h-40 md:w-40"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Carrousel de bannières (flèches, points, défilement automatique).
export default function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    if (index >= count) setIndex(0)
  }, [count, index])

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return
    const timer = setInterval(() => setIndex(i => (i + 1) % count), 5000)
    return () => clearInterval(timer)
  }, [paused, reduceMotion, count])

  const go = step => setIndex(i => (i + step + count) % count)

  if (count === 0) return null

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Offres du moment"
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map(slide => (
          <Slide key={slide.key} slide={slide} />
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Bannière précédente"
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#313133] shadow transition hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Bannière suivante"
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#313133] shadow transition hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.key}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Bannière ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-5 bg-[#313133]" : "w-2 bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
