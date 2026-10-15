import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Section } from "@/components/Section"
import { useFrame } from "@/lib/frameLoop"
import { EASE, hasPointer, useStage } from "@/lib/stage"

const NAME = "Viktor Blais"
const NAME_WORDS = NAME.split(/(?<= )/).map((word, w, all) => ({
    chars: word.split(""),
    start: all.slice(0, w).join("").length,
}))
const ROTATING = ["learns", "ships", "scales", "predicts"]
const ORBIT = ["React", "JavaScript", "SQL", "React Native", "Expo", "Python", "PyTorch", "React", "TypeScript", "AWS", "C++", "Supabase", "Next.js", "PostgreSQL", "TensorFlow"]
const BUBBLES = [
    { x: 9, y: 18, size: 110, depth: 1.4 },
    { x: 85, y: 60, size: 140, depth: 0.9 },
    { x: 14, y: 72, size: 60, depth: 2.6 },
]

// Padded bounding box of an element (or its children), relative to `origin`
const blockRect = (el, origin) => {
    const kids = el.children.length ? [...el.children] : [el]
    let l = 1e9, r = -1e9, t = 1e9, b = -1e9
    kids.forEach((k) => {
        const q = k.getBoundingClientRect()
        if (!q.width) return
        l = Math.min(l, q.left)
        r = Math.max(r, q.right)
        t = Math.min(t, q.top)
        b = Math.max(b, q.bottom)
    })
    return { l: l - origin.left - 24, r: r - origin.left + 24, t: t - origin.top - 12, b: b - origin.top + 12 }
}

export const HeroSection = () => {
    const { section, go, theme, pointer, surge, sectionStart, motion } = useStage()
    const active = section === 0

    const [risen, setRisen] = useState(false)
    const [rot, setRot] = useState(0)

    const heroRef = useRef(null)
    const nameRef = useRef(null)
    const orbitRef = useRef(null)
    const rotBoxRef = useRef(null)
    const firstEntry = useRef(true)
    const fx = useRef({ angle: 0, tilt: { a: 0, b: 0 }, blocks: null, blocksAt: 0 })

    // Letter rise: on first load after 250ms, on every return after 80ms
    useEffect(() => {
        if (!active) return
        setRisen(false)
        const id = setTimeout(() => setRisen(true), firstEntry.current ? 250 : 80)
        firstEntry.current = false
        return () => clearTimeout(id)
    }, [active])

    useEffect(() => {
        const id = setInterval(() => setRot((r) => (r + 1) % ROTATING.length), 2600)
        return () => clearInterval(id)
    }, [])

    // The rotating word's box animates to the current word's width
    useLayoutEffect(() => {
        const size = () => {
            const box = rotBoxRef.current
            const el = box?.querySelector(`[data-rot="${rot}"]`)
            if (el) box.style.width = el.offsetWidth + "px"
        }
        let live = true
        size()
        document.fonts?.ready.then(() => live && size())
        window.addEventListener("resize", size)
        return () => {
            live = false
            window.removeEventListener("resize", size)
        }
    }, [rot])

    useFrame((now, t) => {
        const hero = heroRef.current
        const nm = nameRef.current
        const ob = orbitRef.current
        if (!hero || !nm || !ob) return
        const s = fx.current
        const m = pointer.current
        const mouse = hasPointer(m)
        const hr = hero.getBoundingClientRect()
        const nr = nm.getBoundingClientRect()
        const cx = nr.left + nr.width / 2 - hr.left
        const cy = nr.top + nr.height / 2 - hr.top

        // Orbit plane follows the cursor, subtly
        const ta = mouse ? (m.x / window.innerWidth - 0.5) * 2 * 0.16 : -0.06
        const tb = mouse ? 0.55 + (m.y / window.innerHeight - 0.5) * 0.3 : 0.55
        s.tilt.a += (ta - s.tilt.a) * 0.03
        s.tilt.b += (tb - s.tilt.b) * 0.03
        s.angle += 0.0035 * motion * (1 + surge.current * 4)

        const ent = Math.max(0, Math.min(1, (now - sectionStart.current - 500) / 1400))
        const rx = Math.min(nr.width / 2 + 230, window.innerWidth * 0.48)
        const ry = nr.height * 0.55 * s.tilt.b
        const rotA = s.tilt.a

        if (!s.blocks || now - s.blocksAt > 500) {
            s.blocksAt = now
            s.blocks = [...hero.querySelectorAll("[data-st]"), nm].map((el) => blockRect(el, hr))
        }

        const items = ob.children
        const n = items.length
        for (let i = 0; i < n; i++) {
            const el = items[i]
            const th = s.angle + (i * 6.2832) / n
            const ex = Math.cos(th) * rx
            const ey = Math.sin(th) * ry
            const X = ex * Math.cos(rotA) - ey * Math.sin(rotA)
            const Y = ex * Math.sin(rotA) + ey * Math.cos(rotA)
            const z = (Math.sin(th) + 1) / 2
            const sc = 0.72 + z * 0.38
            const px = cx + X
            const py = cy + Y
            // Legibility guard: fade pills that pass behind text
            const hit = s.blocks.some((q) => px > q.l && px < q.r && py > q.t && py < q.b)
            el._f = (el._f ?? 1) + ((hit ? 0.12 : 1) - (el._f ?? 1)) * 0.12
            el.style.opacity = ((0.28 + z * 0.72) * ent * el._f).toFixed(3)
            el.style.zIndex = z > 0.5 ? "2" : "0"
            el.style.transform = `translate(${(px - el.offsetWidth / 2).toFixed(1)}px,${(py - el.offsetHeight / 2).toFixed(1)}px) scale(${(sc * (0.8 + 0.2 * ent)).toFixed(3)})`
        }

        // Magnetic letters
        nm.querySelectorAll("[data-mag]").forEach((el) => {
            const r = el.getBoundingClientRect()
            const st = el._m || (el._m = { y: 0, s: 1 })
            const d = mouse ? Math.hypot(m.x - (r.left + r.width / 2), m.y - (r.top + r.height / 2 - st.y)) : 999
            const f = Math.max(0, 1 - d / 180)
            st.y += (-f * f * 18 - st.y) * 0.15
            st.s += (1 + f * 0.05 - st.s) * 0.15
            el.style.transform = `translateY(${st.y.toFixed(2)}px) scale(${st.s.toFixed(3)})`
        })

        // Glass bubbles drift with the cursor and bob
        hero.querySelectorAll("[data-bubble]").forEach((o, i) => {
            const d = +o.dataset.bubble
            const tx = mouse ? (m.x - window.innerWidth / 2) * d * 0.04 : 0
            const ty = mouse ? (m.y - window.innerHeight / 2) * d * 0.04 : 0
            o._x = (o._x || 0) + (tx - (o._x || 0)) * 0.05
            o._y = (o._y || 0) + (ty - (o._y || 0)) * 0.05
            o.style.transform = `translate(${o._x.toFixed(1)}px,${(o._y + Math.sin(t * 0.8 + i * 1.9) * 14).toFixed(1)}px)`
        })
    }, active)

    return (
        <Section
            ref={heroRef}
            index={0}
            className="flex flex-col items-center justify-center text-center pt-[90px] px-6 pb-[110px] gap-[clamp(14px,2.6vh,26px)]"
        >
            {BUBBLES.map((b) => (
                <div
                    key={b.depth}
                    aria-hidden="true"
                    data-bubble={b.depth}
                    className="absolute rounded-full pointer-events-none will-change-transform backdrop-blur-[5px]"
                    style={{
                        left: `${b.x}%`,
                        top: `${b.y}%`,
                        width: b.size,
                        height: b.size,
                        background:
                            "radial-gradient(circle at 30% 28%, rgba(255,255,255,.95), rgba(255,255,255,.3) 22%, rgba(255,255,255,.06) 60%, rgba(255,255,255,.22) 100%)",
                        boxShadow:
                            "inset -8px -12px 30px rgba(120,100,255,.2), inset 6px 8px 18px rgba(255,255,255,.6), 0 30px 60px -20px var(--shadow)",
                        opacity: theme === "dark" ? 0.35 : 1,
                        transition: "opacity .6s",
                    }}
                />
            ))}

            <div ref={orbitRef} className="absolute inset-0 pointer-events-none z-1" aria-hidden="true">
                {ORBIT.map((tag) => (
                    <span
                        key={tag}
                        className="absolute left-0 top-0 text-[15px] font-medium tracking-[-0.01em] py-[9px] px-4 rounded-full bg-glass2 border border-gb whitespace-nowrap will-change-[transform,opacity] opacity-0"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div data-st className="relative z-2">
                <span className="text-[14px] font-medium py-[7px] px-3.5 rounded-full glass backdrop-blur-[12px] flex gap-2 items-center">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#34c759] animate-dot" />
                    Open to internships · Spring 2027
                </span>
            </div>

            <h1
                ref={nameRef}
                aria-label="Viktor Blais."
                className="relative z-2 m-0 text-[clamp(64px,min(12vw,18vh),168px)] leading-[.95] font-bold tracking-[-0.055em] flex flex-wrap justify-center"
            >
                {NAME_WORDS.map(({ chars, start }) => (
                    // Letters grouped per word so narrow screens wrap between words, not mid-name
                    <span key={start} aria-hidden="true" className="flex">
                        {chars.map((c, k) => {
                            const i = start + k
                            return (
                                <span
                                    key={i}
                                    className="inline-block whitespace-pre"
                                    style={{
                                        transform: `translateY(${risen ? 0 : 90}px)`,
                                        opacity: risen ? 1 : 0,
                                        filter: `blur(${risen ? 0 : 14}px)`,
                                        transition: risen
                                            ? `transform 1.2s ${EASE} ${i * 55}ms, opacity 1.2s ${i * 55}ms, filter 1.2s ${i * 55}ms`
                                            : "none",
                                    }}
                                >
                                    <span data-mag className="inline-block whitespace-pre will-change-transform">
                                        {c}
                                    </span>
                                </span>
                            )
                        })}
                    </span>
                ))}
            </h1>

            <p
                data-st
                className="relative z-2 m-0 text-[clamp(26px,min(4.2vw,5.6vh),54px)] leading-[1.1] font-semibold tracking-[-0.035em] text-mut flex flex-wrap justify-center gap-x-[.26em]"
            >
                <span>Building software that</span>
                <span
                    ref={rotBoxRef}
                    className="relative inline-block h-[1.15em] text-left"
                    style={{ transition: `width .7s ${EASE}` }}
                >
                    {ROTATING.map((word, i) => {
                        const current = i === rot
                        const previous = i === (rot + ROTATING.length - 1) % ROTATING.length
                        return (
                            <span
                                key={word}
                                data-rot={i}
                                aria-hidden={!current}
                                className="absolute left-0 top-0 whitespace-nowrap text-brand"
                                style={{
                                    transform: `translateY(${current ? 0 : previous ? -1 : 1}em)`,
                                    opacity: current ? 1 : 0,
                                    filter: `blur(${current ? 0 : 8}px)`,
                                    transition: `transform .8s ${EASE}, opacity .8s, filter .8s`,
                                }}
                            >
                                {word}
                            </span>
                        )
                    })}
                </span>
            </p>

            <p data-st className="relative z-2 m-0 text-[clamp(16px,2.1vh,19px)] leading-[1.45] text-mut2">
                Computer Science + Math @ UBC, based in Vancouver
            </p>

            <div data-st className="relative z-2 flex gap-[22px] items-center mt-2 text-[17px] flex-wrap justify-center">
                <button
                    onClick={(e) => go(3, e.currentTarget)}
                    className="cursor-pointer bg-acc text-white py-[13px] px-[26px] rounded-full font-medium transition-transform duration-300 ease-soft hover:scale-[1.04]"
                >
                    See my work
                </button>
                <a href="/resume.pdf" download="Viktor_Blais_Resume.pdf" className="text-acc">
                    Download résumé ›
                </a>
            </div>
        </Section>
    )
}
