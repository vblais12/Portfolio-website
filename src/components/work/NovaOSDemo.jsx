import { useEffect, useLayoutEffect, useState } from "react"
import "./novaos.css"

const EASE_OUT = "cubic-bezier(.2,.8,.2,1)"
const EASE_IN = "cubic-bezier(.55,0,.8,.2)"

// Real 1440×900 frames from the demo galaxy. `click` is the target in % of the frame;
// a "dive" exit warps the camera into that point.
const FRAMES = [
    { src: "01-ignition", alt: "Cinematic intro: the sun ignites", hold: 1700, exit: "fade" },
    { src: "02-drift", alt: "Cinematic intro: what you ignore begins to drift", hold: 1900, exit: "fade" },
    { src: "03-welcome", alt: "NovaOS welcome card", hold: 2000, click: [50, 58.3], exit: "dive" },
    { src: "04-galaxy", alt: "The demo galaxy: life areas orbiting a sun", hold: 2300, click: [70.5, 54.4], exit: "dive" },
    { src: "05-health", alt: "Inside the Health planet: metrics, habits and tasks", hold: 2300, click: [66, 47.8], exit: "dive" },
    { src: "06-goal", alt: "Run a marathon goal: progress ring and waypoints", hold: 2700, exit: "fade" },
]
const N = FRAMES.length

// Warp streaks radiating from the dive point (deterministic spread)
const STREAKS = Array.from({ length: 26 }, (_, i) => ({
    angle: i * (360 / 26) + ((i * 37) % 11),
    length: 70 + ((i * 53) % 90),
    delay: (i * 29) % 140,
}))

const frameStyle = (j, i) => {
    const prev = (i - 1 + N) % N
    const enteredByDive = FRAMES[(j - 1 + N) % N].exit === "dive"
    if (j === i) {
        return {
            opacity: 1,
            transform: "scale(1)",
            filter: "none",
            zIndex: 2,
            transition: enteredByDive
                ? `opacity .7s .25s, transform 1s ${EASE_OUT} .2s, filter .7s .2s`
                : "opacity .8s",
        }
    }
    if (j === prev) {
        const f = FRAMES[j]
        return f.exit === "dive"
            ? {
                  opacity: 0,
                  transform: "scale(2.6)",
                  filter: "blur(6px)",
                  transformOrigin: `${f.click[0]}% ${f.click[1]}%`,
                  zIndex: 1,
                  transition: `transform .9s ${EASE_IN}, opacity .7s .2s, filter .6s`,
              }
            : { opacity: 0, zIndex: 1, transition: "opacity .8s" }
    }
    // Waiting off-stage: frames reached by a dive start small and blurred, then grow in
    return {
        opacity: 0,
        transform: enteredByDive ? "scale(.72)" : "none",
        filter: enteredByDive ? "blur(6px)" : "none",
        zIndex: 0,
        transition: "none",
    }
}

const Cursor = () => (
    <svg width="14" height="20" viewBox="0 0 14 20" aria-hidden="true">
        <path d="M1 1v15.5l4.2-3.9 2.9 6.4 2.6-1.1-2.9-6.3h5.6Z" fill="#fff" stroke="#111" strokeWidth="1" strokeLinejoin="round" />
    </svg>
)

/**
 * NovaOS in a browser window: the cinematic intro, then click through and warp-dive
 * from the welcome card to the galaxy, into the Health planet, into a goal.
 */
export const NovaOSDemo = ({ running }) => {
    const [i, setI] = useState(0)
    const [phase, setPhase] = useState("idle") // idle · aim · click

    useLayoutEffect(() => {
        if (!running) return
        setI(0)
        setPhase("idle")
    }, [running])

    useEffect(() => {
        if (!running) return
        let timers = []
        const show = (k) => {
            const f = FRAMES[k]
            setI(k)
            setPhase("idle")
            timers = [setTimeout(() => show((k + 1) % N), f.hold)]
            if (f.click) {
                timers.push(setTimeout(() => setPhase("aim"), f.hold - 1150))
                timers.push(setTimeout(() => setPhase("click"), f.hold - 380))
            }
        }
        show(0)
        return () => timers.forEach(clearTimeout)
    }, [running])

    const current = FRAMES[i]
    const prev = FRAMES[(i - 1 + N) % N]
    const target = current.click

    return (
        <div className="absolute inset-0 flex items-center justify-center p-9">
            <div className="w-full rounded-2xl overflow-hidden bg-card shadow-[0_0_0_1px_var(--line),0_40px_80px_-40px_var(--shadow)]">
                <div className="h-[34px] flex items-center gap-[7px] px-3.5 border-b border-line">
                    <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                    <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
                    <span className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
                    <span className="mx-auto text-[12px] text-mut">mynovaos.com</span>
                </div>
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-black">
                    {FRAMES.map((f, j) => (
                        <img
                            key={f.src}
                            src={`/projects/novaos/${f.src}.webp`}
                            alt={f.alt}
                            draggable="false"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover"
                            style={frameStyle(j, i)}
                        />
                    ))}

                    {prev.exit === "dive" && (
                        <div key={i} className="nova-warp" style={{ left: `${prev.click[0]}%`, top: `${prev.click[1]}%` }}>
                            {STREAKS.map((s, k) => (
                                <i key={k} style={{ transform: `rotate(${s.angle}deg)` }}>
                                    <b style={{ width: s.length, animationDelay: `${s.delay}ms` }} />
                                </i>
                            ))}
                        </div>
                    )}

                    {target && (
                        <div
                            key={`cursor-${i}`}
                            className="nova-cursor"
                            style={{
                                left: `${phase === "idle" ? Math.min(92, target[0] + 14) : target[0]}%`,
                                top: `${phase === "idle" ? Math.min(90, target[1] + 20) : target[1]}%`,
                                opacity: phase === "idle" ? 0 : 1,
                            }}
                        >
                            {phase === "click" && <span className="nova-click" />}
                            <Cursor />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
