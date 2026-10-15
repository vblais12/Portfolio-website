import { useEffect, useLayoutEffect, useState } from "react"
import { EASE } from "@/lib/stage"

const TEAM_COLORS = {
    BOS: "#fcb514", CAR: "#ce1126", CGY: "#d2001c", CHI: "#cf0a2c", COL: "#6f263d", DAL: "#006847",
    EDM: "#ff4c00", FLA: "#c8102e", LAK: "#a2aaad", MIN: "#154734", MTL: "#af1e2d", NJD: "#ce1126",
    NYR: "#0038a8", OTT: "#c52032", PIT: "#fcb514", SEA: "#68a2b9", STL: "#002f87", TBL: "#002868",
    TOR: "#00205b", VAN: "#00843d", VGK: "#b4975a", WPG: "#041e42",
}

// pick = model's pick, p = its win probability, xgf = pick's expected-goals share, l10 = pick's last 10
const SLATES = [
    {
        date: "Tue · Oct 14",
        games: [
            { away: "VAN", home: "EDM", pick: "EDM", p: 61, xgf: 54.8, l10: "7-2-1", final: "EDM 4–2", hit: true },
            { away: "TOR", home: "BOS", pick: "TOR", p: 53, xgf: 51.2, l10: "6-3-1", final: "BOS 3–2 OT", hit: false },
            { away: "COL", home: "DAL", pick: "DAL", p: 56, xgf: 53.9, l10: "6-4-0", final: "DAL 3–1", hit: true },
            { away: "NYR", home: "NJD", pick: "NJD", p: 55, xgf: 52.7, l10: "5-3-2", final: "NJD 5–3", hit: true },
            { away: "TBL", home: "FLA", pick: "FLA", p: 59, xgf: 55.6, l10: "8-1-1", final: "FLA 2–1", hit: true },
            { away: "VGK", home: "LAK", pick: "VGK", p: 52, xgf: 50.9, l10: "5-4-1", final: "LAK 4–3", hit: false },
        ],
    },
    {
        date: "Wed · Oct 15",
        games: [
            { away: "MTL", home: "OTT", pick: "OTT", p: 57, xgf: 53.1, l10: "6-3-1", final: "OTT 4–1", hit: true },
            { away: "CAR", home: "PIT", pick: "CAR", p: 62, xgf: 56.4, l10: "7-2-1", final: "CAR 5–2", hit: true },
            { away: "WPG", home: "MIN", pick: "WPG", p: 54, xgf: 52.0, l10: "6-2-2", final: "MIN 2–1 SO", hit: false },
            { away: "CHI", home: "STL", pick: "STL", p: 58, xgf: 53.8, l10: "5-4-1", final: "STL 3–2", hit: true },
            { away: "SEA", home: "CGY", pick: "CGY", p: 51, xgf: 50.4, l10: "4-4-2", final: "CGY 3–2", hit: true },
            { away: "EDM", home: "VAN", pick: "EDM", p: 55, xgf: 54.0, l10: "7-2-1", final: "EDM 6–3", hit: true },
        ],
    },
]

// Fast enough that the whole slate settles (~4.5s) well before the 7s auto-advance
const TICK_MS = 500
// Per slate: 0 mounted · 1 rows reveal · 3.. one game goes live per tick, settling a tick later · hold · 20 fade out
const REVEAL = 1
const FIRST_LIVE = 3
const LEAVE = 20
const CYCLE = 21
const START_TIMES = ["7:00 PM", "7:00 PM", "8:00 PM", "8:00 PM", "8:30 PM", "10:30 PM"]

const TeamDot = ({ team }) => (
    <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: TEAM_COLORS[team] }} />
)

const HEAD = "pb-2 text-left text-[11.5px] font-medium tracking-[.04em] uppercase text-mut"
const NARROW_HIDDEN = "@max-[470px]:hidden"

/** Tonight's slate: model picks with win probability, then games go live and settle as hits or misses. */
export const NhlPredictorDemo = ({ running }) => {
    const [n, setN] = useState(0)

    // Each time the demo opens, start from a fresh slate reveal
    useLayoutEffect(() => {
        if (running) setN(0)
    }, [running])

    useEffect(() => {
        if (!running) return
        const id = setInterval(() => setN((v) => v + 1), TICK_MS)
        return () => clearInterval(id)
    }, [running])

    const k = n % CYCLE
    const slateIndex = Math.floor(n / CYCLE) % SLATES.length
    const slate = SLATES[slateIndex]
    const revealed = k >= REVEAL && k < LEAVE
    const live = k - FIRST_LIVE
    const settled = Math.max(0, Math.min(slate.games.length, k - FIRST_LIVE))
    const hits = slate.games.slice(0, settled).filter((g) => g.hit).length

    return (
        <div className="@container absolute inset-0 flex flex-col justify-center p-11 max-sm:p-6 gap-5">
            <div className="flex justify-between items-end gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-[13px] text-mut">Model picks · {slate.date}</span>
                    <span className="text-[24px] font-bold tracking-[-0.03em] leading-none">Tonight's slate</span>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                    <span className="text-[13px] text-mut">Tonight</span>
                    <span className="text-[24px] font-bold tracking-[-0.03em] leading-none tabular-nums">
                        {hits}–{settled - hits}
                    </span>
                </div>
            </div>

            <table className="w-full table-fixed border-collapse text-[14px]">
                <colgroup>
                    <col className="w-[92px]" />
                    <col />
                    <col className={`w-[60px] ${NARROW_HIDDEN}`} />
                    <col className={`w-[58px] ${NARROW_HIDDEN}`} />
                    <col className="w-[92px]" />
                </colgroup>
                <thead>
                    <tr>
                        <th className={HEAD}>Matchup</th>
                        <th className={HEAD}>Pick · win prob</th>
                        <th className={`${HEAD} ${NARROW_HIDDEN}`}>xGF%</th>
                        <th className={`${HEAD} ${NARROW_HIDDEN}`}>L10</th>
                        <th className={`${HEAD} text-right`}>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {slate.games.map((g, i) => {
                        const isLive = live === i
                        const isFinal = i < settled
                        return (
                            <tr
                                key={`${slateIndex}-${i}`}
                                className="border-t border-line"
                                style={{
                                    opacity: revealed ? 1 : 0,
                                    transform: `translateY(${revealed ? 0 : 8}px)`,
                                    transition: `opacity .5s ${i * 70}ms, transform .7s ${EASE} ${i * 70}ms`,
                                }}
                            >
                                <td className="py-[11px] whitespace-nowrap">
                                    <span className="text-mut">{g.away}</span>
                                    <span className="text-mut mx-1">@</span>
                                    <span>{g.home}</span>
                                </td>
                                <td className="py-[11px] pr-3">
                                    <div className="flex items-center gap-2">
                                        <TeamDot team={g.pick} />
                                        <span className="font-semibold w-9">{g.pick}</span>
                                        <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${revealed ? g.p : 0}%`,
                                                    background: "linear-gradient(90deg,#7c3aed,#2563eb)",
                                                    transition: `width 1s ${EASE} ${200 + i * 70}ms`,
                                                }}
                                            />
                                        </div>
                                        <span className="tabular-nums w-8 text-right">{g.p}%</span>
                                    </div>
                                </td>
                                <td className={`py-[11px] tabular-nums text-mut2 ${NARROW_HIDDEN}`}>{g.xgf.toFixed(1)}</td>
                                <td className={`py-[11px] tabular-nums text-mut2 ${NARROW_HIDDEN}`}>{g.l10}</td>
                                <td className="py-[11px] text-right whitespace-nowrap text-[13px]">
                                    {isFinal ? (
                                        <span className="inline-flex items-center gap-1.5 tabular-nums">
                                            {g.final}
                                            <span
                                                className="w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px] font-bold text-white"
                                                style={{ background: g.hit ? "#34c759" : "#ff453a" }}
                                                aria-label={g.hit ? "Correct" : "Missed"}
                                            >
                                                {g.hit ? "✓" : "✕"}
                                            </span>
                                        </span>
                                    ) : isLive ? (
                                        <span className="inline-flex items-center gap-1.5 text-[#ff453a] font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-dot" />
                                            Live
                                        </span>
                                    ) : (
                                        <span className="text-mut tabular-nums">{START_TIMES[i]}</span>
                                    )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <div className="flex justify-between text-[12.5px] text-mut pt-1">
                <span>Gradient-boosted model · 42 features</span>
                <span className="tabular-nums">Season 63.4% · 812 games</span>
            </div>
        </div>
    )
}
