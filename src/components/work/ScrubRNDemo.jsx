import { useEffect, useLayoutEffect, useState } from "react"
import { ArrowUp, Bookmark, Check, Flame, List, Monitor, User } from "lucide-react"
import { PhoneMockup } from "@/components/work/PhoneMockup"
import { EASE } from "@/lib/stage"

// ScrubRN brand palette
const C = {
    teal: "#0E8C8C",
    tint: "#DCEEEA",
    bg: "#F2F6F5",
    ink: "#0F1C1B",
    slate: "#52635F",
    muted: "#869390",
    success: "#1FA85C",
    successInk: "#168A4A",
    successFill: "#E8F6EE",
    flame: "#FB7A3C",
    rowLine: "#DDE9E6",
}

const QUESTIONS = [
    {
        topic: "Digoxin",
        category: "Pharmacology",
        question: "Heart-failure client is due for digoxin. Which finding must the nurse act on first?",
        options: ["Apical pulse 68/min", "Mild ankle edema", "Potassium 3.1 mEq/L", "Weight up 0.5 lb"],
        answer: 2,
        rationale: "Low potassium raises digoxin-toxicity risk — correct it before dosing.",
    },
    {
        topic: "Maintaining sterile field",
        category: "Maintaining sterile field",
        question: "The nurse prepares a sterile field for urinary catheter insertion. Which observation requires the nurse to restart the setup?",
        options: ["The package border remains untouched", "Supplies are arranged within reach", "The sterile towel becomes wet", "A second glove pair is available"],
        answer: 2,
        rationale: "Moisture contaminates a sterile field and requires corrective action.",
    },
    {
        topic: "Chest palpation findings",
        category: "Chest palpation findings",
        question: "A nurse palpates near a recently removed chest tube and feels a crackling sensation under the skin. Which interpretation is most appropriate?",
        options: ["Symmetric chest expansion finding", "Tenderness from light palpation", "Air trapped beneath subcutaneous tissue", "Expected scar tissue from healing"],
        answer: 2,
        rationale: "Crepitus near a chest tube site suggests subcutaneous air.",
    },
]

// Beat sheet (ms from the card arriving): sit · tap · green · rationale + streak pulse · swipe up
const TAP = 900
const GREEN = 1150
const RATIONALE = 1450
const SWIPE = 2950
const RING_R = 12
const RING_LEN = 2 * Math.PI * RING_R
const DAILY_GOAL = 20

const QuestionCard = ({ q, answered, tapping, showRationale }) => (
    <div className="relative h-full rounded-[18px] bg-white p-3 flex flex-col gap-[9px] overflow-hidden shadow-[0_1px_2px_rgba(15,28,27,.05)]">
        <div className="flex items-center gap-2">
            <span className="rounded-full px-2 py-[3px] text-[9px] font-bold" style={{ background: C.tint, color: C.teal }}>
                {q.topic}
            </span>
            <span className="flex gap-[3px]">
                {[1, 0.4, 0.4].map((o, i) => (
                    <span key={i} className="w-[4px] h-[4px] rounded-full" style={{ background: C.teal, opacity: o }} />
                ))}
            </span>
            <Bookmark size={12} strokeWidth={1.8} className="ml-auto" style={{ color: C.muted }} />
        </div>

        <p className="m-0 text-[12.5px] font-extrabold leading-[1.25] tracking-[-0.01em]" style={{ color: C.ink }}>
            {q.question}
        </p>

        <div className="flex flex-col gap-[6px]">
            {q.options.map((opt, i) => {
                const correct = i === q.answer
                const green = answered && correct
                return (
                    <div
                        key={opt}
                        className="relative flex items-center gap-2 rounded-full border-[1.5px] bg-white px-2 py-[6px] text-[9.5px] leading-[1.25]"
                        style={{
                            borderColor: green ? C.success : C.rowLine,
                            background: green ? C.successFill : "#fff",
                            color: C.ink,
                            opacity: answered && !correct ? 0.55 : 1,
                            transition: "all .3s",
                        }}
                    >
                        <span
                            className="w-[17px] h-[17px] shrink-0 rounded-full border-[1.2px] flex items-center justify-center text-[8px] font-bold"
                            style={{
                                borderColor: green ? C.success : C.tint,
                                background: green ? C.success : "transparent",
                                color: green ? "#fff" : C.teal,
                                transition: "all .3s",
                            }}
                        >
                            {"ABCD"[i]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {green && <Check size={12} strokeWidth={3} style={{ color: C.success }} className="shrink-0" />}
                        {tapping && correct && (
                            <span
                                className="absolute left-1/2 top-1/2 -ml-5 -mt-5 w-10 h-10 rounded-full animate-tap pointer-events-none"
                                style={{ background: "rgba(14,140,140,.35)" }}
                            />
                        )}
                    </div>
                )
            })}
        </div>

        {/* Rationale sheet slides up over the bottom of the card */}
        <div
            className="absolute inset-x-0 bottom-0 rounded-t-[18px] bg-white px-3 pt-3 pb-3 shadow-[0_-10px_22px_-10px_rgba(15,28,27,.18)]"
            style={{ transform: `translateY(${showRationale ? 0 : 105}%)`, transition: `transform .5s ${EASE}` }}
        >
            <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: C.success }}>
                    <Check size={10} strokeWidth={3.5} color="#fff" />
                </span>
                <span className="text-[12px] font-black tracking-[-0.02em]" style={{ color: C.successInk }}>
                    Correct
                </span>
                <span className="ml-auto text-[6.5px] font-bold uppercase tracking-[.1em] truncate max-w-[55%]" style={{ color: C.muted }}>
                    {q.category}
                </span>
            </div>
            <p className="m-0 mt-2 text-[9.5px] leading-[1.4]" style={{ color: C.slate }}>
                {q.rationale}
            </p>
            <div className="mt-2.5 flex gap-1.5">
                <span
                    className="flex-1 h-[26px] rounded-[10px] border flex items-center justify-center text-[9.5px] font-bold"
                    style={{ background: C.bg, borderColor: C.rowLine, color: C.teal }}
                >
                    Go deeper ›
                </span>
                <span className="w-[34px] h-[26px] rounded-[10px] flex items-center justify-center" style={{ background: C.teal }}>
                    <ArrowUp size={13} strokeWidth={2.6} color="#fff" />
                </span>
            </div>
        </div>
    </div>
)

const TABS = [
    { label: "Feed", Icon: Monitor, active: true },
    { label: "Practice", Icon: List },
    { label: "Profile", Icon: User },
]

/**
 * ScrubRN's vertical feed: tap the right answer, it turns green, the rationale slides
 * up, the streak pulses, then the card swipes up to the next question.
 */
export const ScrubRNDemo = ({ running }) => {
    const [q, setQ] = useState(0)
    const [phase, setPhase] = useState(0) // 0 sitting · 1 tap · 2 green · 3 rationale
    const [today, setToday] = useState(9)

    useLayoutEffect(() => {
        if (!running) return
        setQ(0)
        setPhase(0)
        setToday(9)
    }, [running])

    useEffect(() => {
        if (!running) return
        let timers = []
        const runQuestion = () => {
            timers = [
                setTimeout(() => setPhase(1), TAP),
                setTimeout(() => setPhase(2), GREEN),
                setTimeout(() => {
                    setPhase(3)
                    setToday((n) => n + 1)
                }, RATIONALE),
                setTimeout(() => {
                    setPhase(0)
                    setQ((v) => (v + 1) % QUESTIONS.length)
                    runQuestion()
                }, SWIPE),
            ]
        }
        runQuestion()
        return () => timers.forEach(clearTimeout)
    }, [running])

    const n = QUESTIONS.length

    return (
        <PhoneMockup running={running} screenBg={C.bg} light>
            <div className="absolute inset-0 font-['Figtree',sans-serif]" style={{ color: C.ink }}>
                {/* Header: streak · FOR YOU · today ring */}
                <div className="absolute top-[50px] inset-x-[10px] h-[30px] flex items-center justify-between">
                    <span
                        key={today}
                        className={`h-[26px] px-2.5 rounded-full bg-white flex items-center gap-1 shadow-[0_1px_2px_rgba(15,28,27,.06)] ${phase === 3 ? "animate-pop" : ""}`}
                    >
                        <Flame size={12} fill={C.flame} stroke={C.flame} />
                        <span className="text-[12px] font-extrabold">7</span>
                    </span>
                    <span className="text-[8.5px] font-bold tracking-[.14em]" style={{ color: C.muted }}>
                        FOR YOU
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="text-[8.5px] font-bold tracking-[.14em]" style={{ color: C.muted }}>
                            TODAY
                        </span>
                        <span className="relative w-[30px] h-[30px]">
                            <svg width="30" height="30" viewBox="0 0 30 30">
                                <circle cx="15" cy="15" r={RING_R} fill="#fff" stroke="#E4ECEA" strokeWidth="3" />
                                <circle
                                    cx="15"
                                    cy="15"
                                    r={RING_R}
                                    fill="none"
                                    stroke={C.teal}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray={RING_LEN}
                                    strokeDashoffset={RING_LEN * (1 - Math.min(1, today / DAILY_GOAL))}
                                    transform="rotate(-90 15 15)"
                                    style={{ transition: `stroke-dashoffset .6s ${EASE}` }}
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold">{today}</span>
                        </span>
                    </span>
                </div>

                {/* Vertical feed: current card at 0, next waiting below, previous swiped above */}
                <div className="absolute top-[86px] bottom-[62px] inset-x-[8px] overflow-hidden rounded-[18px]">
                    {QUESTIONS.map((question, i) => {
                        const offset = (i - q + n) % n
                        const current = offset === 0
                        const previous = offset === n - 1
                        return (
                            <div
                                key={question.topic}
                                className="absolute inset-0"
                                style={{
                                    transform: `translateY(${current ? 0 : previous ? -106 : 106}%)`,
                                    // The card that wraps from "previous" to "next" jumps instantly, off-screen
                                    transition: offset === 1 ? "none" : `transform .45s ${EASE}`,
                                }}
                            >
                                <QuestionCard
                                    q={question}
                                    answered={previous || (current && phase >= 2)}
                                    tapping={current && phase === 1}
                                    showRationale={previous || (current && phase >= 3)}
                                />
                            </div>
                        )
                    })}
                </div>

                {/* Tab bar */}
                <div className="absolute bottom-0 inset-x-0 h-[58px] bg-white/95 border-t border-[#E6EEEC] flex justify-around pt-2">
                    {TABS.map((tab) => {
                        const { label, Icon, active } = tab
                        return (
                            <span key={label} className="flex flex-col items-center gap-[3px] text-[8.5px] font-bold" style={{ color: active ? C.teal : C.muted }}>
                                <Icon size={15} strokeWidth={2} />
                                {label}
                            </span>
                        )
                    })}
                </div>
            </div>
        </PhoneMockup>
    )
}
