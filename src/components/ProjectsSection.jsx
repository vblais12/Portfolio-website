import { useCallback, useEffect, useRef, useState } from "react"
import { Section } from "@/components/Section"
import { DemoLayer } from "@/components/work/DemoLayer"
import { ScrubRNDemo } from "@/components/work/ScrubRNDemo"
import { HouseShiftDemo } from "@/components/work/HouseShiftDemo"
import { SornDemo } from "@/components/work/SornDemo"
import { NovaOSDemo } from "@/components/work/NovaOSDemo"
import { VektorDemo } from "@/components/work/VektorDemo"
import { FolioPrepDemo } from "@/components/work/FolioPrepDemo"
import { TaproDemo } from "@/components/work/TaproDemo"
import { JobMarketDemo } from "@/components/work/JobMarketDemo"
import { NhlPredictorDemo } from "@/components/work/NhlPredictorDemo"
import { useFrame } from "@/lib/frameLoop"
import { EASE, useStage } from "@/lib/stage"

// Default time on each project before auto-advancing; a project can set `duration` to fit its demo loop
const DURATION = 7000

const PROJECTS = [
    {
        title: "ScrubRN",
        kind: "iOS",
        description:
            "An NCLEX-RN exam prep app that turns question practice into a TikTok-style vertical feed.",
        tags: ["React Native", "TypeScript", "Expo", "Supabase", "PostgreSQL", "RevenueCat"],
        links: [{ label: "App Store", href: "https://apps.apple.com/us/app/scrubrn-nclex-prep/id6781548989" }],
        Demo: ScrubRNDemo,
    },
    {
        title: "HouseShift",
        kind: "iOS",
        description:
            "Make your living situation better with HouseShift.",
        tags: ["React Native", "TypeScript", "Expo", "Expo Router", "Supabase", "PostgreSQL", "RevenueCat"],
        links: [{ label: "houseshift.app", href: "https://houseshift.app" }],
        Demo: HouseShiftDemo,
    },
    {
        title: "Sorn",
        kind: "iOS",
        description:
            "A calm daily system for deep work: plan three priorities and your focus blocks each morning, work behind a full-screen hourglass, and close the day in ten minutes. Designed and built solo, from the timing engine to release.",
        tags: ["React Native", "TypeScript", "Expo", "Supabase", "RevenueCat", "Reanimated", "Live Activities"],
        links: [{ label: "sornapp.com", href: "https://sornapp.com" }],
        Demo: SornDemo,
    },
    {
        title: "NovaOS",
        kind: "Web app",
        description:
            "Your life, seen from orbit: a personal dashboard rendered as a 3D galaxy you can fly through. Life areas orbit a sun as planets, goals orbit those planets with milestones as moons, and every level has its own HUD for habits, streaks, metrics and a drag-to-schedule day planner.",
        tags: ["React", "TypeScript", "Three.js", "React Three Fiber", "GLSL", "Supabase", "Stripe"],
        links: [{ label: "mynovaos.com", href: "https://mynovaos.com" }],
        Demo: NovaOSDemo,
        duration: 12600, // one full loop of the intro and the warp dives
    },
    {
        title: "FolioPrep",
        kind: "Web app",
        description:
            "A college-prep dashboard for high schoolers. Activities, awards, volunteer hours, test scores and essays, mapped to Common App, UC or Coalition. AI profile review flags strengths, gaps and next steps.",
        tags: ["React", "AI", "Web App"],
        links: [{ label: "folio-prep.com", href: "https://folio-prep.com/" }],
        Demo: FolioPrepDemo,
    },
    {
        title: "MonkOS",
        kind: "iOS",
        description:
            "A productivity app designed around the \"Monk mode\" ideology.",
        tags: ["React Native", "TypeScript", "Expo", "Supabase"],
        links: [{ label: "App Store Link", href: "https://apps.apple.com/us/app/monkos/id6760982523" }],
        Demo: VektorDemo, // TODO: MonkOS still shows the Vektor phone demo
    },
    {
        title: "TaPRO",
        kind: "AI agent",
        description:
            "An AI virtual teaching assistant platform for university office hours.",
        tags: ["Gemini API", "Next.js", "Node.js", "Supabase"],
        links: [
            { label: "Code", href: "https://github.com/austinluk/ta_pro" },
            { label: "Watch demo", href: "https://www.youtube.com/watch?v=Qb1FNeKKBsg" },
        ],
        Demo: TaproDemo,
    },
    {
        title: "Job Market Tracker",
        kind: "NLP",
        description:
            "Reads job postings and uses NLP to surface which skills are in demand right now.",
        tags: ["NLP", "FastAPI", "Python", "TypeScript", "PostgreSQL", "AWS"],
        links: [{ label: "Code", href: "https://github.com/vblais12/job_m_tracker" }],
        Demo: JobMarketDemo,
    },
    {
        title: "NHL Predictor",
        kind: "ML pipeline",
        description:
            "Data scraping, feature engineering, model training & tuning.",
        tags: ["Python", "Scikit-learn", "Pandas"],
        links: [{ label: "Code", href: "https://github.com/vblais12/NHL_stats_predictor" }],
        Demo: NhlPredictorDemo,
    },
]

export const ProjectsSection = () => {
    const { section } = useStage()
    const sectionActive = section === 3

    const [active, setActive] = useState(0)
    const [runKey, setRunKey] = useState(0)
    const activeStart = useRef(0)
    const listRef = useRef(null)

    const pick = useCallback((i) => {
        activeStart.current = performance.now()
        setActive(i)
        setRunKey((k) => k + 1)
    }, [])

    // Hovering the demo stage (e.g. to spin the phone) holds the auto-advance
    const paused = useRef(false)
    const lastFrame = useRef(0)

    // The auto-advance timer restarts every time Work is entered
    useEffect(() => {
        if (!sectionActive) return
        activeStart.current = lastFrame.current = performance.now()
        paused.current = false
    }, [sectionActive])

    useFrame((now) => {
        if (paused.current) activeStart.current += now - lastFrame.current
        lastFrame.current = now
        const elapsed = now - activeStart.current
        const duration = PROJECTS[active].duration ?? DURATION
        listRef.current?.querySelectorAll("[data-prog]").forEach((bar) => {
            bar.style.width = (+bar.dataset.prog === active ? Math.min(100, (elapsed / duration) * 100) : 0).toFixed(2) + "%"
        })
        if (elapsed > duration) pick((active + 1) % PROJECTS.length)
    }, sectionActive)

    return (
        <Section
            index={3}
            className="flex items-center-safe pt-24 pb-[92px] px-[max(24px,calc((100vw-1240px)/2))] overflow-auto"
        >
            <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(min(100%,330px),1fr))] gap-[clamp(24px,3.5vw,44px)] items-center">
                <div ref={listRef} className="flex flex-col">
                    <h2 data-st className="m-0 mb-[clamp(10px,1.8vh,18px)] text-[clamp(40px,min(5vw,7vh),68px)] font-bold tracking-[-0.05em] leading-[.95]">
                        Things I've shipped.
                    </h2>
                    {PROJECTS.map((p, i) => {
                        const on = i === active
                        return (
                            <div key={p.title} data-st>
                                <div
                                    onClick={() => pick(i)}
                                    className="cursor-pointer py-[clamp(6px,1vh,11px)] border-t border-line flex flex-col"
                                >
                                    <button
                                        type="button"
                                        aria-expanded={on}
                                        className="flex items-baseline justify-between gap-4 text-left cursor-pointer"
                                    >
                                        <span
                                            className="font-bold tracking-[-0.04em] leading-[1.15]"
                                            style={{
                                                fontSize: on ? "clamp(26px,min(2.6vw,3.8vh),36px)" : "clamp(18px,min(1.7vw,2.5vh),23px)",
                                                color: on ? "var(--fg)" : "var(--mut)",
                                                transition: `color .5s, font-size .6s ${EASE}`,
                                            }}
                                        >
                                            {p.title}
                                        </span>
                                        <span className="text-[13px] text-mut whitespace-nowrap">{p.kind}</span>
                                    </button>

                                    <div
                                        className="grid"
                                        style={{ gridTemplateRows: on ? "1fr" : "0fr", transition: `grid-template-rows .7s ${EASE}` }}
                                    >
                                        <div className="overflow-hidden min-h-0" inert={!on}>
                                            <div
                                                className="flex flex-col gap-3 pt-3"
                                                style={{
                                                    opacity: on ? 1 : 0,
                                                    transform: `translateY(${on ? 0 : -10}px)`,
                                                    transition: `opacity .6s .1s, transform .7s .1s ${EASE}`,
                                                }}
                                            >
                                                <p className="m-0 text-[16px] leading-normal text-mut2 text-pretty">{p.description}</p>
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {p.tags.map((tag) => (
                                                        <span key={tag} className="text-[12.5px] py-1 px-2.5 rounded-full glass">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-[22px] text-[15.5px]">
                                                    {p.links.map((l) => (
                                                        <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-acc">
                                                            {l.label} ›
                                                        </a>
                                                    ))}
                                                </div>
                                                <div className="h-0.5 rounded-sm bg-line overflow-hidden">
                                                    <div data-prog={i} className="h-full w-0 bg-fg" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div data-st>
                    <div
                        onPointerEnter={() => (paused.current = true)}
                        onPointerLeave={() => (paused.current = false)}
                        className="relative h-[min(600px,calc(100vh-210px))] min-h-[400px] rounded-[36px] glass backdrop-blur-[30px] backdrop-saturate-150 shadow-panel overflow-hidden">
                        {PROJECTS.map((p, i) => (
                            <DemoLayer key={p.title} index={i} active={active}>
                                <p.Demo running={sectionActive && i === active} runKey={runKey} />
                            </DemoLayer>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    )
}
