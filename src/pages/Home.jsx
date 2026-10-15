import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/HeroSection"
import { AboutSection } from "@/components/AboutSection"
import { SkillsSection } from "@/components/SkillsSection"
import { ProjectsSection } from "@/components/ProjectsSection"
import { ContactSection } from "@/components/ContactSection"
import { SocialLinks } from "@/components/SocialLinks"
import { useAurora } from "@/hooks/useAurora"
import { useStars } from "@/hooks/useStars"
import { useFrame } from "@/lib/frameLoop"
import { EASE, SECTIONS, StageContext, useStage } from "@/lib/stage"

const LAST = SECTIONS.length - 1
const WHEEL_THROTTLE_MS = 1100

const readTheme = () => {
    try {
        return localStorage.getItem("theme") === "dark" ? "dark" : "light"
    } catch {
        return "light"
    }
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"

const useReducedMotion = () => {
    const [reduced, setReduced] = useState(() => window.matchMedia(REDUCED_QUERY).matches)
    useEffect(() => {
        const mq = window.matchMedia(REDUCED_QUERY)
        const onChange = () => setReduced(mq.matches)
        mq.addEventListener("change", onChange)
        return () => mq.removeEventListener("change", onChange)
    }, [])
    return reduced
}

// Aurora + stars canvases; they read the stage context, so they live under the provider.
const Backdrop = () => {
    const auroraRef = useRef(null)
    const starsRef = useRef(null)
    const { theme } = useStage()
    useAurora(auroraRef)
    useStars(starsRef)
    return (
        <>
            <canvas
                ref={auroraRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ opacity: theme === "dark" ? 0.75 : 1, transition: "opacity .6s" }}
            />
            <canvas ref={starsRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        </>
    )
}

export const Home = () => {
    const [theme, setTheme] = useState(readTheme)
    const [nav, setNav] = useState({ section: 0, prevSection: 0 })
    const reduced = useReducedMotion()
    const motion = reduced ? 0.25 : 1

    const rootRef = useRef(null)
    const rippleRef = useRef(null)
    const sectionRef = useRef(0)
    const pointer = useRef({ x: -9999, y: -9999 })
    const surge = useRef(0)
    const sectionStart = useRef(0)
    const lastWheel = useRef(0)

    useEffect(() => {
        sectionStart.current = performance.now()
    }, [])

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        try {
            localStorage.setItem("theme", theme)
        } catch {
            // storage unavailable (private mode) — theme just won't persist
        }
    }, [theme])

    const go = useCallback(
        (i, fromEl) => {
            const from = sectionRef.current
            const root = rootRef.current
            if (i === from || !root) return
            sectionRef.current = i

            // Ripple from the clicked control (or the target tab for keys / wheel)
            const btn = fromEl || root.querySelector(`[data-tab="${i}"]`)
            const rp = rippleRef.current
            if (!reduced && btn && rp) {
                const b = btn.getBoundingClientRect()
                rp.style.left = b.left + b.width / 2 + "px"
                rp.style.top = b.top + b.height / 2 + "px"
                rp.style.transition = "none"
                rp.style.opacity = "0.7"
                rp.style.transform = "scale(0.2)"
                void rp.offsetWidth
                rp.style.transition = `transform 1.3s ${EASE}, opacity 1.3s ease-out`
                rp.style.transform = `scale(${Math.max(window.innerWidth, window.innerHeight) / 26})`
                rp.style.opacity = "0"
            }

            if (!reduced) surge.current = 1
            sectionStart.current = performance.now()
            setNav({ section: i, prevSection: from })

            // Staggered entrance for every [data-st] in the incoming section
            const sec = root.querySelector(`[data-sec="${i}"]`)
            if (!sec) return
            sec.scrollTop = 0
            if (reduced) return
            const els = sec.querySelectorAll("[data-st]")
            els.forEach((el) => {
                el.style.transition = "none"
                el.style.opacity = "0"
                el.style.transform = "translateY(34px)"
                el.style.filter = "blur(10px)"
            })
            void sec.offsetWidth
            els.forEach((el, k) => {
                const d = 180 + k * 70
                el.style.transition = `opacity .8s ${d}ms, transform 1s ${d}ms ${EASE}, filter .8s ${d}ms`
                el.style.opacity = "1"
                el.style.transform = "none"
                el.style.filter = "none"
            })
        },
        [reduced]
    )

    useEffect(() => {
        const onMove = (e) => {
            if (e.pointerType !== "mouse") return
            pointer.current.x = e.clientX
            pointer.current.y = e.clientY
        }
        const onKey = (e) => {
            if (/INPUT|TEXTAREA/.test(document.activeElement?.tagName || "")) return
            const cur = sectionRef.current
            if (e.key === "ArrowRight" || e.key === "ArrowDown") go(Math.min(LAST, cur + 1))
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(Math.max(0, cur - 1))
        }
        const onWheel = (e) => {
            // A section that scrolls internally only hands off at its top / bottom edge
            const sc = e.target.closest?.("[data-sec]")
            if (sc && sc.scrollHeight > sc.clientHeight + 4) {
                const atTop = sc.scrollTop <= 0
                const atBottom = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2
                if (!((e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop))) return
            }
            const now = performance.now()
            if (Math.abs(e.deltaY) < 14 || now - lastWheel.current < WHEEL_THROTTLE_MS) return
            lastWheel.current = now
            go(Math.max(0, Math.min(LAST, sectionRef.current + (e.deltaY > 0 ? 1 : -1))))
        }
        window.addEventListener("pointermove", onMove)
        window.addEventListener("keydown", onKey)
        window.addEventListener("wheel", onWheel, { passive: true })
        return () => {
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("keydown", onKey)
            window.removeEventListener("wheel", onWheel)
        }
    }, [go])

    useFrame(() => {
        surge.current *= 0.965
    })

    const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), [])

    const stage = useMemo(
        () => ({ ...nav, go, theme, pointer, surge, sectionStart, motion }),
        [nav, go, theme, motion]
    )

    return (
        <StageContext.Provider value={stage}>
            <div
                ref={rootRef}
                className="fixed inset-0 overflow-hidden bg-bg text-fg font-sans"
                style={{ transition: "background .6s, color .6s" }}
            >
                <Backdrop />
                <div
                    ref={rippleRef}
                    className="absolute left-0 top-0 w-20 h-20 -ml-10 -mt-10 rounded-full pointer-events-none opacity-0 z-40 will-change-[transform,opacity]"
                    style={{
                        border: "1.5px solid var(--fg)",
                        background: "radial-gradient(circle, rgba(255,255,255,0) 55%, rgba(160,140,255,.25) 100%)",
                    }}
                />

                <Navbar onToggleTheme={toggleTheme} />
                
                
                <SocialLinks className="absolute left-5 bottom-[14px] z-20 [@media(max-height:719px)]:hidden" />
                <div className="absolute right-7 bottom-[22px] z-20 text-[12.5px] text-mut max-sm:hidden [@media(max-height:719px)]:hidden">
                    © 2026 Viktor Blais
                </div>


                <HeroSection />
                <AboutSection />
                <SkillsSection />
                <ProjectsSection />
                <ContactSection />
            </div>
        </StageContext.Provider>
    )
}
