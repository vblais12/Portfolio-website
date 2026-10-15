import { useEffect, useRef } from "react"
import { Section } from "@/components/Section"
import { useFrame } from "@/lib/frameLoop"
import { useStage } from "@/lib/stage"

const STATEMENT =
    "I like problems that come with data attached. Most of my projects start as a question and end as software people actually use. A model in a notebook is a hypothesis. Shipped, it's a product."
const WORDS = STATEMENT.split(" ")

const FOCUS = [
    {
        n: "01",
        title: "AI & Machine Learning",
        body: "From data pipelines to deployed models. I study the architectures, then wire them into real products.",
    },
    {
        n: "02",
        title: "Mobile apps",
        body: "Responsive, intuitive apps with clean UX that hold up on every device. One is live on the App Store.",
    },
    {
        n: "03",
        title: "Cybersecurity",
        body: "Hands-on labs, web vulnerabilities, and writing code that's harder to break.",
    },
]

export const AboutSection = () => {
    const { section, go, pointer, sectionStart } = useStage()
    const active = section === 1
    const revealRef = useRef(null)
    const cardsRef = useRef(null)

    // Dim the statement again once we leave, so it re-reveals next time
    useEffect(() => {
        if (active) return
        revealRef.current?.querySelectorAll("[data-w]").forEach((w) => {
            w.style.opacity = "0.18"
        })
    }, [active])

    useFrame((now) => {
        const rv = revealRef.current
        if (rv) {
            const prog = Math.min(1, Math.max(0, (now - sectionStart.current - 350) / 2600))
            const ws = rv.children
            const n = ws.length
            for (let i = 0; i < n; i++) {
                const a = Math.max(0, Math.min(1, prog * n * 1.15 - i))
                ws[i].style.opacity = (0.18 + 0.82 * a).toFixed(3)
                ws[i].style.transform = `translateY(${((1 - a) * 6).toFixed(1)}px)`
            }
        }

        // 3D tilt toward the cursor, easing back when it leaves
        const m = pointer.current
        cardsRef.current?.querySelectorAll("[data-tilt]").forEach((el) => {
            const r = el.getBoundingClientRect()
            const inside = m.x >= r.left && m.x <= r.right && m.y >= r.top && m.y <= r.bottom
            const rx = inside ? ((m.y - r.top) / r.height - 0.5) * -8 : 0
            const ry = inside ? ((m.x - r.left) / r.width - 0.5) * 10 : 0
            el._rx = (el._rx || 0) + (rx - (el._rx || 0)) * 0.1
            el._ry = (el._ry || 0) + (ry - (el._ry || 0)) * 0.1
            el.style.transform = `perspective(900px) rotateX(${el._rx.toFixed(2)}deg) rotateY(${el._ry.toFixed(2)}deg)`
        })
    }, active)

    return (
        <Section
            index={1}
            className="flex flex-col justify-center-safe pt-[100px] pb-[92px] px-[max(24px,calc((100vw-1100px)/2))] gap-[clamp(24px,5vh,56px)] overflow-auto"
        >
            <p
                ref={revealRef}
                aria-label={STATEMENT}
                className="m-0 text-[clamp(28px,min(4vw,5.6vh),54px)] leading-[1.12] font-semibold tracking-[-0.035em] text-pretty"
            >
                {WORDS.map((w, i) => (
                    <span key={i} data-w aria-hidden="true" className="text-fg opacity-[.18] inline-block whitespace-pre">
                        {w}{" "}
                    </span>
                ))}
            </p>

            <div ref={cardsRef} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
                {FOCUS.map((f) => (
                    <div key={f.n} data-st>
                        <div
                            data-tilt
                            className="h-full box-border p-[26px] rounded-[26px] glass backdrop-blur-[24px] backdrop-saturate-150 shadow-card flex flex-col gap-2.5 will-change-transform"
                        >
                            <span className="text-[13px] text-mut font-medium">{f.n}</span>
                            <span className="text-[26px] font-bold tracking-[-0.03em] leading-[1.05]">{f.title}</span>
                            <span className="text-[16px] leading-normal text-mut2">{f.body}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div data-st className="flex gap-[22px] items-center justify-center text-[17px] flex-wrap">
                <button
                    onClick={(e) => go(4, e.currentTarget)}
                    className="cursor-pointer bg-fg text-bg py-[13px] px-6 rounded-full font-medium"
                >
                    Get in touch
                </button>
                <a href="/resume.pdf" download="Viktor_Blais_Resume.pdf" className="text-acc">
                    Download résumé ›
                </a>
            </div>
        </Section>
    )
}
