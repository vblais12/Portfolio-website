import { useEffect, useState } from "react"

const ROW_H = 52
const INITIAL = [["Python", 86], ["SQL", 72], ["AWS", 63], ["React", 55], ["Docker", 47], ["PyTorch", 41]]

/** Skill-demand bars that random-walk every 2.4s and spring into their new rank. */
export const JobMarketDemo = ({ running }) => {
    const [rows, setRows] = useState(INITIAL)
    const [week, setWeek] = useState(41)

    useEffect(() => {
        if (!running) return
        const id = setInterval(() => {
            setWeek((w) => w + 1)
            setRows((rs) => rs.map(([n, v]) => [n, Math.max(18, Math.min(95, Math.round(v + (Math.random() - 0.5) * 26)))]))
        }, 2400)
        return () => clearInterval(id)
    }, [running])

    const ranked = [...rows].sort((a, b) => b[1] - a[1])

    return (
        <div className="absolute inset-0 flex flex-col justify-center p-11 gap-[22px]">
            <div className="flex justify-between items-baseline">
                <span className="text-[24px] font-bold tracking-[-0.03em]">In-demand skills</span>
                <span className="text-[13px] text-mut">Week {week}</span>
            </div>
            <div className="relative" style={{ height: rows.length * ROW_H }}>
                {rows.map(([name, value]) => {
                    const rank = ranked.findIndex((r) => r[0] === name)
                    return (
                        <div
                            key={name}
                            className="absolute inset-x-0 h-10 grid grid-cols-[90px_minmax(0,1fr)_46px] gap-3.5 items-center text-[15px]"
                            style={{ top: rank * ROW_H, transition: "top .9s cubic-bezier(.3,1.25,.4,1)" }}
                        >
                            <span className="font-semibold">{name}</span>
                            <div className="h-3 rounded-full bg-line overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${value}%`,
                                        background: rank === 0 ? "linear-gradient(90deg,#7c3aed,#2563eb)" : "var(--mut)",
                                        transition: "width .9s cubic-bezier(.3,1.2,.4,1)",
                                    }}
                                />
                            </div>
                            <span className="text-right text-mut">{value}%</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
