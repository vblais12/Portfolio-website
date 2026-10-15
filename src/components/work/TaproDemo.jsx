import { useLayoutEffect, useState } from "react"

const QUESTION = "Why does my recursion never hit the base case?"
const ANSWER =
    "Look at the call on line 12. You pass solve(n) instead of solve(n - 1), so n never shrinks. Trace n = 3 by hand and you'll see it."

const TypingDot = ({ delay }) => (
    <span
        className="w-[7px] h-[7px] rounded-full bg-mut"
        style={{ animation: `dot 1s ${delay}s infinite` }}
    />
)

/**
 * Office-hours chat. Replays whenever it becomes active (or `runKey` changes):
 * question at 500ms, typing at 1300ms, answer streams in from 2300ms.
 */
export const TaproDemo = ({ running, runKey }) => {
    const [step, setStep] = useState(0)
    const [chars, setChars] = useState(0)

    useLayoutEffect(() => {
        if (!running) return
        setStep(0)
        setChars(0)
        let stream = 0
        const timers = [
            setTimeout(() => setStep(1), 500),
            setTimeout(() => setStep(2), 1300),
            setTimeout(() => {
                setStep(3)
                let n = 0
                stream = setInterval(() => {
                    n = Math.min(ANSWER.length, n + 2)
                    setChars(n)
                    if (n >= ANSWER.length) {
                        clearInterval(stream)
                        setStep(4)
                    }
                }, 24)
            }, 2300),
        ]
        return () => {
            timers.forEach(clearTimeout)
            clearInterval(stream)
        }
    }, [running, runKey])

    return (
        <div className="absolute inset-0 flex flex-col justify-center p-10 gap-3.5">
            <div className="flex justify-between text-[13px] text-mut pb-3 border-b border-line">
                <span>CPSC 110 · Office hours</span>
                <span className="text-[#34c759]">● TaPRO online</span>
            </div>
            <div className="flex flex-col gap-3 min-h-[280px]">
                {step >= 1 && (
                    <div className="self-end max-w-[78%] bg-acc text-white py-[13px] px-[17px] rounded-[22px_22px_6px_22px] text-[16px] leading-[1.45]">
                        {QUESTION}
                    </div>
                )}
                {step === 2 && (
                    <div className="self-start flex gap-[5px] py-[15px] px-[17px] rounded-[22px] bg-card shadow-[0_0_0_1px_var(--line)]">
                        <TypingDot delay={0} />
                        <TypingDot delay={0.2} />
                        <TypingDot delay={0.4} />
                    </div>
                )}
                {step >= 3 && (
                    <div className="self-start max-w-[86%] bg-card shadow-[0_0_0_1px_var(--line)] py-[13px] px-[17px] rounded-[22px_22px_22px_6px] text-[16px] leading-normal">
                        {ANSWER.slice(0, chars)}
                    </div>
                )}
            </div>
        </div>
    )
}
