import { useEffect, useState } from "react"
import { PhoneMockup } from "@/components/work/PhoneMockup"
import { EASE } from "@/lib/stage"

const HABITS = ["Morning run", "Read 20 pages", "Deep work"]
const RING_LEN = 421
const BOUNCE = "cubic-bezier(.3,1.6,.5,1)"

/** Vektor app: habits tick off, the ring fills, then a nudge notification drops in. */
export const VektorDemo = ({ running }) => {
    const [tick, setTick] = useState(0)

    useEffect(() => {
        if (!running) return
        const id = setInterval(() => setTick((n) => n + 1), 1500)
        return () => clearInterval(id)
    }, [running])

    const phase = tick % 5
    const done = Math.min(3, phase)
    const pct = 0.18 + done * 0.273

    return (
        <PhoneMockup running={running}>
            <div className="absolute inset-0 flex flex-col pt-[56px] px-[18px] gap-[18px]">
                <div
                    className="absolute left-2 right-2 z-4 bg-[rgba(50,50,54,.92)] rounded-[18px] py-2.5 px-3 flex gap-2.5 items-center"
                    style={{ top: phase === 4 ? 44 : -90, transition: "top .7s cubic-bezier(.3,1.3,.5,1)" }}
                >
                    <img src="/projects/vektor.jpg" alt="" draggable="false" className="w-[30px] h-[30px] rounded-lg object-cover" />
                    <div className="flex flex-col text-[11.5px] leading-[1.3]">
                        <b>Vektor</b>
                        <span className="opacity-75">You said you're a runner. Prove it tonight.</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-[13px] text-[#86868b]">Tuesday</span>
                    <span className="text-[23px] font-bold tracking-[-0.03em] leading-[1.1]">I am someone who shows up.</span>
                </div>

                <div className="self-center relative w-[150px] h-[150px]">
                    <svg width="150" height="150" viewBox="0 0 160 160">
                        <defs>
                            <linearGradient id="vektor-ring" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#a78bfa" />
                                <stop offset="1" stopColor="#5eead4" />
                            </linearGradient>
                        </defs>
                        <circle cx="80" cy="80" r="67" fill="none" stroke="#1c1c1e" strokeWidth="13" />
                        <circle
                            cx="80"
                            cy="80"
                            r="67"
                            fill="none"
                            stroke="url(#vektor-ring)"
                            strokeWidth="13"
                            strokeLinecap="round"
                            strokeDasharray={RING_LEN}
                            strokeDashoffset={(RING_LEN * (1 - pct)).toFixed(1)}
                            transform="rotate(-90 80 80)"
                            style={{ transition: `stroke-dashoffset 1.2s ${EASE}` }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[36px] font-bold tracking-[-0.04em]">{Math.round(pct * 100)}%</span>
                        <span className="text-[12px] text-[#86868b]">of today</span>
                    </div>
                </div>

                <div className="flex flex-col">
                    {HABITS.map((h, i) => {
                        const on = i < done
                        return (
                            <div key={h} className="flex justify-between items-center py-[11px] border-b border-[#1c1c1e] text-[15px]">
                                <span style={{ color: on ? "#86868b" : "#f5f5f7", transition: "color .5s" }}>{h}</span>
                                <span
                                    className="w-[22px] h-[22px] rounded-full"
                                    style={{
                                        background: on ? "#5eead4" : "transparent",
                                        border: `1.5px solid ${on ? "#5eead4" : "#48484a"}`,
                                        transform: `scale(${on ? 1 : 0.85})`,
                                        transition: `all .5s ${BOUNCE}`,
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </PhoneMockup>
    )
}
