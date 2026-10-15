import { useEffect, useLayoutEffect, useState } from "react"
import { PhoneMockup } from "@/components/work/PhoneMockup"
import "./sorn.css"

// The app's screens are 393pt wide; the phone's screen is 232px
const SCALE = 232 / 393

// Loop (ms): countdown · press and hold · ring completes → reflection · back to the start
const HOLD = 3000
const END = 4400
const REFLECT_TICK = 5400
const LOOP = 6200

const START_SECONDS = 59 * 60 + 58
const REFLECT_SECONDS = 2 * 60 + 58

// Hold-to-end ring: 380pt across, centred on the hourglass card
const RING_R = 190
const RING_LEN = 2 * Math.PI * RING_R
const RING_CX = 196.5
const RING_CY = 339

// Hourglass geometry (local units, 126×233)
const BULB = "M20,9 C20,55 58,92 61,117 C58,142 20,180 20,224 L106,224 C106,180 68,142 65,117 C68,92 106,55 106,9 Z"
const TOP_BULB = "M20,9 C20,55 58,92 61,117 L65,117 C68,92 106,55 106,9 Z"
const BOTTOM_BULB = "M61,117 C58,142 20,180 20,224 L106,224 C106,180 68,142 65,117 Z"

const Hourglass = ({ id, level, pile, flowing, animate, width = 126 }) => (
    <svg width={width} height={(width * 233) / 126} viewBox="0 0 126 233" aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
        <defs>
            <clipPath id={`${id}-top`}>
                <path d={TOP_BULB} />
            </clipPath>
            <clipPath id={`${id}-bottom`}>
                <path d={BOTTOM_BULB} />
            </clipPath>
        </defs>
        <path d="M9.5 8v217M116.5 8v217" stroke="#4A4A47" strokeWidth="1.6" />
        <g clipPath={`url(#${id}-top)`}>
            <rect width="126" height="126" fill="#F4F4F1" style={{ transform: `translateY(${level}px)`, transition: animate ? "transform 1s linear" : "none" }} />
        </g>
        <g clipPath={`url(#${id}-bottom)`}>
            <rect width="126" height="240" fill="#F4F4F1" style={{ transform: `translateY(${224 - pile}px)`, transition: animate ? "transform 1s linear" : "none" }} />
        </g>
        {flowing && <line className="stream" x1="63" y1="119" x2="63" y2="222" stroke="#F4F4F1" strokeWidth="1.8" strokeDasharray="3 4" />}
        <path d={BULB} fill="none" stroke="#D5D5D0" strokeWidth="1.3" />
        <rect width="126" height="8" rx="4" fill="#F4F4F1" />
        <rect y="225" width="126" height="8" rx="4" fill="#F4F4F1" />
    </svg>
)

const pad = (n) => String(n).padStart(2, "0")
const clock = (s) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`

/**
 * Sorn's signature interaction: the hourglass counts down, a press-and-hold draws a ring
 * around the screen over 1.4s, the block ends, and a minute of reflection follows.
 */
export const SornDemo = ({ running }) => {
    const [phase, setPhase] = useState(0) // 0 counting · 1 holding · 2 reflection
    const [secs, setSecs] = useState(0)
    const [reflectSecs, setReflectSecs] = useState(0)

    useLayoutEffect(() => {
        if (!running) return
        setPhase(0)
        setSecs(0)
        setReflectSecs(0)
    }, [running])

    useEffect(() => {
        if (!running) return
        let timers = []
        const loop = () => {
            setPhase(0)
            timers = [
                ...[1, 2, 3, 4].map((s) => setTimeout(() => setSecs(s), s * 1000)),
                setTimeout(() => setPhase(1), HOLD),
                setTimeout(() => {
                    // Block ends: show the reflection and quietly reset the block screen behind it
                    setPhase(2)
                    setSecs(0)
                    setReflectSecs(0)
                }, END),
                setTimeout(() => setReflectSecs(1), REFLECT_TICK),
                setTimeout(loop, LOOP),
            ]
        }
        loop()
        return () => timers.forEach(clearTimeout)
    }, [running])

    const reflecting = phase === 2
    const holding = phase === 1
    const left = START_SECONDS - secs

    return (
        <PhoneMockup running={running} screenBg="#000">
            <div className="absolute inset-0 overflow-hidden">
                <div className="sorn" style={{ transform: `scale(${SCALE})` }}>
                    {/* Deep Block */}
                    <div className="layer" style={{ opacity: reflecting ? 0 : 1 }}>
                        <div className="glow" />
                        <div className="glass-card" style={{ transform: holding ? "scale(.985)" : "none" }}>
                            <div className="hourglass">
                                <Hourglass id="sorn-main" level={34 + secs * 0.9} pile={2 + secs * 0.35} flowing animate={!reflecting} />
                            </div>
                        </div>

                        <div className="digit" style={{ left: 71.5 }}>
                            <span className="mono">Min</span>
                            <span className="num">{pad(Math.floor(left / 60))}</span>
                        </div>
                        <div className="digit" style={{ left: 202 }}>
                            <span className="mono">Sec</span>
                            <span className="num">{pad(left % 60)}</span>
                        </div>

                        <div className="mono" style={{ position: "absolute", top: 652, width: "100%", textAlign: "center", opacity: holding ? 1 : 0, transition: "opacity .25s" }}>
                            Hold to end
                        </div>
                        <div className="mono" style={{ position: "absolute", top: 782, width: "100%", textAlign: "center" }}>
                            Tap to pause · Hold to end
                        </div>

                        <div className="press" style={{ opacity: holding ? 1 : 0, transform: `scale(${holding ? 1 : 0.6})` }} />
                        <svg className="ring" width="393" height="852" viewBox="0 0 393 852" aria-hidden="true">
                            <circle
                                cx={RING_CX}
                                cy={RING_CY}
                                r={RING_R}
                                fill="none"
                                stroke="#F4F4F1"
                                strokeWidth="2"
                                strokeDasharray={RING_LEN}
                                strokeDashoffset={holding ? 0 : RING_LEN}
                                transform={`rotate(-90 ${RING_CX} ${RING_CY})`}
                                style={{ transition: holding ? "stroke-dashoffset 1.4s linear" : "none" }}
                            />
                        </svg>
                    </div>

                    {/* Reflection */}
                    <div
                        className="layer"
                        style={{ opacity: reflecting ? 1 : 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, padding: "0 30px" }}
                    >
                        <Hourglass id="sorn-small" level={12} pile={2} flowing animate={false} width={40} />
                        <span className="timer-pill">
                            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                                <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            {clock(REFLECT_SECONDS - reflectSecs)}
                        </span>
                        <p className="question">What did you actually finish?</p>
                    </div>
                </div>
            </div>
        </PhoneMockup>
    )
}
