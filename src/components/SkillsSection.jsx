import { useCallback, useEffect, useRef, useState } from "react"
import { Section } from "@/components/Section"
import { useSlidingPill } from "@/hooks/useSlidingPill"
import { SPRING, useStage } from "@/lib/stage"

const SKILLS = {
    Languages: ["Python", "C++", "JavaScript", "TypeScript", "Java", "SQL (Postgres)", "Assembly"],
    Libraries: ["TensorFlow", "Scikit-learn", "HuggingFace", "Pandas", "NumPy", "Matplotlib", "Seaborn", "React", "Tailwind CSS"],
    Tools: ["Git", "GitHub", "Jupyter", "Selenium"],
    Cloud: ["AWS", "Render", "Vercel"],
}
const CATEGORIES = ["All", ...Object.keys(SKILLS)]
const ALL = Object.values(SKILLS).flat()

const POP = "cubic-bezier(.2,.9,.25,1.15)"

export const SkillsSection = () => {
    const { section } = useStage()
    const active = section === 2

    const [cat, setCat] = useState("All")
    const [shownCat, setShownCat] = useState("All")
    const [pillsIn, setPillsIn] = useState(true)

    const segRef = useRef(null)
    const segPillRef = useRef(null)
    const swapTimer = useRef(0)
    const frames = useRef([])

    useSlidingPill(segRef, segPillRef, `[data-seg="${CATEGORIES.indexOf(cat)}"]`)

    // Pills fly out, the list swaps, then they pop back in
    const pickCat = useCallback((c, delay = 380) => {
        setCat(c)
        setPillsIn(false)
        clearTimeout(swapTimer.current)
        frames.current.forEach(cancelAnimationFrame)
        swapTimer.current = setTimeout(() => {
            setShownCat(c)
            frames.current = [
                requestAnimationFrame(() => {
                    frames.current.push(requestAnimationFrame(() => setPillsIn(true)))
                }),
            ]
        }, delay)
    }, [])

    useEffect(
        () => () => {
            clearTimeout(swapTimer.current)
            frames.current.forEach(cancelAnimationFrame)
        },
        []
    )

    // Replay the pop-in every time Skills is entered
    const catRef = useRef(cat)
    useEffect(() => {
        catRef.current = cat
    }, [cat])
    useEffect(() => {
        if (active) pickCat(catRef.current, 300)
    }, [active, pickCat])

    const list = shownCat === "All" ? ALL : SKILLS[shownCat]

    return (
        <Section
            index={2}
            className="flex flex-col items-center justify-center-safe text-center pt-[100px] px-6 pb-[92px] gap-[clamp(18px,3.4vh,34px)] overflow-auto"
        >
            <h2 data-st className="m-0 text-[clamp(48px,min(7vw,10vh),96px)] font-bold tracking-[-0.05em] leading-[.95]">
                The toolkit.
            </h2>

            <div data-st>
                <div
                    ref={segRef}
                    role="tablist"
                    className="relative flex flex-wrap justify-center p-[5px] rounded-full glass backdrop-blur-[20px] backdrop-saturate-150"
                >
                    <div
                        ref={segPillRef}
                        className="absolute top-[5px] left-0 rounded-full bg-fg shadow-[0_6px_18px_-8px_var(--shadow)]"
                        style={{ transition: `transform .6s ${SPRING}, width .6s ${SPRING}` }}
                    />
                    {CATEGORIES.map((c, i) => (
                        <button
                            key={c}
                            data-seg={i}
                            role="tab"
                            aria-selected={cat === c}
                            onClick={() => c !== cat && pickCat(c)}
                            className="relative z-1 text-[15px] font-medium cursor-pointer py-2.5 px-5 rounded-full"
                            style={{ color: cat === c ? "var(--bg)" : "var(--fg)", transition: "color .4s" }}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5 max-w-[960px] min-h-[150px] content-start flex-none">
                {list.map((name, i) => {
                    const d = pillsIn ? i * 35 : i * 12
                    return (
                        <span
                            key={name}
                            className="text-[clamp(17px,min(2vw,2.6vh),26px)] font-semibold tracking-[-0.025em] py-3 px-[22px] rounded-full glass backdrop-blur-[18px] backdrop-saturate-150 hover:bg-glass2"
                            style={{
                                transform: pillsIn ? "translateY(0) scale(1)" : "translateY(24px) scale(.9)",
                                opacity: pillsIn ? 1 : 0,
                                filter: `blur(${pillsIn ? 0 : 8}px)`,
                                transition: `transform .7s ${POP} ${d}ms, opacity .5s ${d}ms, filter .5s ${d}ms, background .3s`,
                            }}
                        >
                            {name}
                        </span>
                    )
                })}
            </div>

            <span className="text-[14px] text-mut">
                {shownCat === "All" ? `${list.length} tools across ${CATEGORIES.length - 1} categories` : `${list.length} in ${shownCat}`}
            </span>
        </Section>
    )
}
