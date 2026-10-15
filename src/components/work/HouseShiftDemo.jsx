import { useEffect, useLayoutEffect, useState } from "react"
import { PhoneMockup } from "@/components/work/PhoneMockup"
import "./houseshift.css"

// The app's screens are 393pt wide; the phone's screen is 232px
const SCALE = 232 / 393

// Loop timings (ms), from the app's Feedback component
const PRESS = 600
const SUCCESS = 800
const FADE = 2900
const LOOP = 4500
const BACK_EASE = "cubic-bezier(.34,1.56,.64,1)"
const TICK_LEN = 21

// Icons from the HouseShift sprite (24×24, stroked in currentColor)
const ICONS = {
    cart: [1.8, <path key="a" d="M3 4.6h2.6l2.2 10.2h9.6L19.6 7H7.2" />, <circle key="b" cx="9.4" cy="19.2" r="1.5" />, <circle key="c" cx="16.6" cy="19.2" r="1.5" />],
    trash: [1.7, <path key="a" d="M5 7.4h14" />, <path key="b" d="M9.4 7.4V5.2h5.2v2.2" />, <path key="c" d="M6.6 7.4l.9 12.2h9l.9-12.2" />, <path key="d" d="M10.4 11v5M13.6 11v5" />],
    dish: [1.7, <circle key="a" cx="12" cy="12" r="8" />, <circle key="b" cx="12" cy="12" r="3.4" />],
    shower: [
        1.7,
        <path key="a" d="M4 4h6.4v6.4" />,
        <path key="b" d="M14.4 6.2a4.2 4.2 0 0 1 4.2 4.2h-8.4a4.2 4.2 0 0 1 4.2-4.2Z" />,
        <path key="c" d="M11.6 14v1.6M14.4 14v3M17.2 14v1.6M11.6 19.4v.9M17.2 19.4v.9" />,
    ],
    vacuum: [1.7, <circle key="a" cx="13.4" cy="14.4" r="5.4" />, <circle key="b" cx="13.4" cy="14.4" r="1.6" />, <path key="c" d="M8.6 11.2 5.4 5.2h-2" />, <path key="d" d="M3.2 19.8h5" />],
    home: [1.9, <path key="a" d="M3.5 10.4 12 4l8.5 6.4V20h-17v-9.6Z" />, <path key="b" d="M9.6 20v-6h4.8v6" />],
    house: [
        1.9,
        <rect key="a" x="3.4" y="3.4" width="7.6" height="7.6" rx="1.8" />,
        <rect key="b" x="13" y="3.4" width="7.6" height="7.6" rx="1.8" />,
        <rect key="c" x="3.4" y="13" width="7.6" height="7.6" rx="1.8" />,
        <rect key="d" x="13" y="13" width="7.6" height="7.6" rx="1.8" />,
    ],
    activity: [1.9, <circle key="a" cx="12" cy="12" r="8.4" />, <path key="b" d="M12 7.2V12l3.4 2.2" />],
    settings: [1.9, <path key="a" d="M4 7.4h16M4 16.6h16" />, <circle key="b" cx="9.2" cy="7.4" r="2.5" />, <circle key="c" cx="15.4" cy="16.6" r="2.5" />],
}

const Icon = ({ name, bold }) => {
    const [width, ...shapes] = ICONS[name]
    return (
        <svg className="i" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={bold ? 2.2 : width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {shapes}
        </svg>
    )
}

// Block-print still life from the app's onboarding illustration
const StillLife = () => (
    <svg viewBox="0 0 346 240" width="100%" aria-hidden="true" style={{ display: "block" }}>
        <defs>
            <clipPath id="hs-still-life">
                <rect width="346" height="240" rx="18" />
            </clipPath>
        </defs>
        <g clipPath="url(#hs-still-life)">
            <rect width="346" height="240" fill="#EFE3CB" />
            <rect width="346" height="100.5" fill="#1F5E5B" />
            <circle cx="76.5" cy="98.5" r="44.75" fill="#D97A22" stroke="#1C1712" strokeWidth="2.5" />
            <rect x="248.75" y="29.75" width="63.5" height="63.5" rx="14.75" fill="#F6DFAE" stroke="#1C1712" strokeWidth="2.5" />
            <g transform="translate(-0.91 29.66) scale(1.1594)" fill="none" stroke="#1C1712" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 104h264M18 150h264" />
                <path d="M34 104V80c0-5 3-8 8-8h12c5 0 8 3 8 8v24Z" fill="#F7EFDF" />
                <path d="M40 72V62h10" />
                <path d="M74 104V68h26v36Z" fill="#F7EFDF" />
                <path d="M74 84h26" />
                <circle cx="126" cy="88" r="16" fill="#F7EFDF" />
                <circle cx="126" cy="88" r="6" />
                <path d="M156 104V74c0-4 3-6 7-6h8c4 0 7 2 7 6v30Z" fill="#F7EFDF" />
                <path d="M160 68V58h11l9-6" />
                <path d="M198 104V62h22v42Z" fill="#F7EFDF" />
                <path d="M198 76h22" />
                <path d="M240 104V78c0-4 3-7 7-7h10c4 0 7 3 7 7v26Z" fill="#F7EFDF" />
                <path d="M44 150v-28h22v28Z" fill="#F6DFAE" />
                <path d="M44 132h22" />
                <path d="M86 150c0-12 6-20 16-20s16 8 16 20Z" fill="#F6DFAE" />
                <path d="M140 150v-24h30v24Z" fill="#F6DFAE" />
                <path d="M148 126v-8h14v8" />
                <circle cx="204" cy="136" r="13" fill="#F6DFAE" />
                <path d="M191 150h26" />
                <path d="M238 150v-22c0-4 3-7 7-7h9c4 0 7 3 7 7v22Z" fill="#F6DFAE" />
            </g>
        </g>
        <rect x="1.25" y="1.25" width="343.5" height="237.5" rx="16.75" fill="none" stroke="#1C1712" strokeWidth="2.5" />
    </svg>
)

const OTHERS = [
    { icon: "dish", name: "Dish soap", sub: "Out · Jack is up next", who: "J" },
    { icon: "shower", name: "Clean bathroom", sub: "Asked for cover · Today", who: "M" },
    { icon: "vacuum", name: "Vacuum", sub: "Tomorrow · Sam", who: "S" },
]

const TABS = [
    { icon: "home", label: "Home", on: true },
    { icon: "house", label: "House" },
    { icon: "activity", label: "Activity" },
    { icon: "settings", label: "Settings" },
]

/**
 * HouseShift's turn handoff: Mark done → the check draws itself → the turn passes
 * to the next roommate → Home says you're all caught up.
 */
export const HouseShiftDemo = ({ running }) => {
    const [step, setStep] = useState(0) // 0 home · 1 press · 2 success · 3 caught up

    useLayoutEffect(() => {
        if (running) setStep(0)
    }, [running])

    useEffect(() => {
        if (!running) return
        let timers = []
        const loop = () => {
            setStep(0)
            timers = [
                setTimeout(() => setStep(1), PRESS),
                setTimeout(() => setStep(2), SUCCESS),
                setTimeout(() => setStep(3), FADE),
                setTimeout(loop, LOOP),
            ]
        }
        loop()
        return () => timers.forEach(clearTimeout)
    }, [running])

    const caught = step === 3
    const shown = step >= 2 // success contents stay put while the scrim fades out
    const enter = step === 2 // only animate on the way in; reset invisibly afterwards
    const t = (css) => (enter ? css : "none")

    return (
        <PhoneMockup running={running} screenBg="#F7EFDF" indicator="dark">
            <div className="absolute inset-0 overflow-hidden">
                <div className="hs" style={{ transform: `scale(${SCALE})` }}>
                    <div className="band">
                        <div>
                            <div className="eyebrow">Wednesday, Oct 7</div>
                            <div className="tab-title">{caught ? "You're all caught up." : "1 thing on your list"}</div>
                        </div>
                        <div className="cart">
                            <Icon name="cart" />
                            <span className="count">1</span>
                        </div>
                    </div>

                    <div className="scroll">
                        {caught ? (
                            <div key="caught" className="caught swap-in">
                                <StillLife />
                                <div className="sub">Nothing needs your attention right now.</div>
                            </div>
                        ) : (
                            <div key="turn" className="swap-in" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div className="sec-head">
                                    <h3>Your turn</h3>
                                    <span>1 item</span>
                                </div>
                                <div className="card">
                                    <div className="att-top">
                                        <div className="tile chore t44">
                                            <Icon name="trash" />
                                        </div>
                                        <div className="t">
                                            <div className="att-title">Take out trash</div>
                                            <div className="sub">You're up next</div>
                                        </div>
                                        <span className="badge">Today</span>
                                    </div>
                                    <div className="att-actions">
                                        <div className="act primary" style={{ transform: step === 1 ? "scale(.97)" : "none" }}>
                                            Mark done
                                        </div>
                                        <div className="act secondary">Can't</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div className="eyebrow">Others are handling</div>
                            <div className="quiet-list">
                                {OTHERS.map((o) => (
                                    <div key={o.name} className="qrow">
                                        <div className="tile quiet t34">
                                            <Icon name={o.icon} />
                                        </div>
                                        <div className="t">
                                            <div className="qname">{o.name}</div>
                                            <div className="sub-sm">{o.sub}</div>
                                        </div>
                                        <div className={`av av26 ${o.who}`}>{o.who}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="tabbar">
                        {TABS.map((tab) => (
                            <div key={tab.label} className={`tab${tab.on ? " on" : ""}`}>
                                <div className="chip">
                                    <Icon name={tab.icon} bold={tab.on} />
                                </div>
                                {tab.label}
                            </div>
                        ))}
                    </div>

                    {/* Success moment */}
                    <div className="scrim" style={{ opacity: step === 2 ? 1 : 0, transition: step === 3 ? "opacity .18s" : undefined }}>
                        <div
                            className="success"
                            style={{ transform: `scale(${shown ? 1 : 0.94})`, transition: t(`transform .34s ${BACK_EASE}`) }}
                        >
                            <div
                                className="ring"
                                style={{ transform: `scale(${shown ? 1 : 0.6})`, transition: t(`transform .34s ${BACK_EASE}`) }}
                            >
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                        d="M5 12.5l4.5 4.5L19 7"
                                        stroke="#1C1712"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeDasharray={TICK_LEN}
                                        strokeDashoffset={shown ? 0 : TICK_LEN}
                                        style={{ transition: t("stroke-dashoffset .42s ease-out .1s") }}
                                    />
                                </svg>
                            </div>
                            <div style={{ opacity: shown ? 1 : 0, transition: t("opacity .3s .18s") }}>
                                <h2>Take out trash done</h2>
                                <p>Next due Oct 14.</p>
                            </div>
                            <div
                                className="handoff"
                                style={{
                                    opacity: shown ? 1 : 0,
                                    transform: `translateX(${shown ? 0 : -14}px)`,
                                    transition: t("opacity .4s .18s, transform .4s ease-out .18s"),
                                }}
                            >
                                <div className="av av28 V">V</div>
                                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                                    <path d="M1 5h13M10 1l4 4-4 4" stroke="#6B5F4C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="av av28 J">J</div>
                                <div className="rowsub">Jack is up next</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PhoneMockup>
    )
}
