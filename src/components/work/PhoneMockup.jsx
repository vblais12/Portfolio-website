import { useRef } from "react"
import { useFrame } from "@/lib/frameLoop"
import { hasPointer, useStage } from "@/lib/stage"

// Device geometry (px). Proportions follow a 6.1" phone.
const W = 250
const H = 520
const DEPTH = 22 // body thickness
const EDGE_LAYERS = 12 // stacked slices that read as a solid side wall in 3D
const RADIUS = 44
const BAND = 3 // titanium band visible from the front
const BEZEL = 6

const TITANIUM = "linear-gradient(135deg,#a6a6ac,#4c4c51 28%,#9a9aa0 52%,#3d3d41 76%,#8a8a90)"
const TITANIUM_EDGE = "linear-gradient(90deg,#5a5a5f,#8d8d93 50%,#55555a)"

const SignalIcon = () => (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden="true">
        <rect x="0" y="7" width="3" height="4" rx="1" />
        <rect x="4.5" y="5" width="3" height="6" rx="1" />
        <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
        <rect x="13.5" y="0" width="3" height="11" rx="1" />
    </svg>
)

const WifiIcon = () => (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor" aria-hidden="true">
        <path d="M7.5 2.2c2.1 0 4 .8 5.5 2.1l1.1-1.2A9.6 9.6 0 0 0 7.5.6 9.6 9.6 0 0 0 .9 3.1L2 4.3a8 8 0 0 1 5.5-2.1Z" />
        <path d="M7.5 5.4c1.2 0 2.4.5 3.2 1.2l1.1-1.2a6.3 6.3 0 0 0-8.6 0l1.1 1.2c.8-.7 2-1.2 3.2-1.2Z" />
        <path d="M7.5 8.4c.4 0 .8.2 1.1.4L7.5 10 6.4 8.8c.3-.2.7-.4 1.1-.4Z" />
    </svg>
)

const BatteryIcon = () => (
    <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
        <rect x=".5" y=".5" width="21" height="11" rx="3.5" fill="none" stroke="currentColor" strokeOpacity=".4" />
        <rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor" />
        <path d="M23 4v4a2 2 0 0 0 0-4Z" fill="currentColor" fillOpacity=".4" />
    </svg>
)

const Lens = ({ x, y, size = 30 }) => (
    <div
        className="absolute rounded-full"
        style={{
            left: x,
            top: y,
            width: size,
            height: size,
            background: "radial-gradient(circle at 50% 50%, #1b2235 0 22%, #05070c 34%, #2a2a2e 56%, #121214 68%, #6b6b70 72%, #2a2a2d 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.08)",
        }}
    >
        <div className="absolute rounded-full bg-white/40" style={{ left: "30%", top: "28%", width: 3, height: 3 }} />
    </div>
)

// Thin bar sticking out of the side wall (volume, action, power)
const SideButton = ({ side, top, height }) => (
    <div
        className="absolute rounded-[2px]"
        style={{
            [side]: -2.5,
            top,
            width: 3,
            height,
            background: TITANIUM_EDGE,
            boxShadow: "inset 0 0 0 .5px rgba(0,0,0,.35)",
        }}
    />
)

/**
 * Realistic phone with real thickness. Tilts toward the cursor, and can be dragged
 * (mouse or touch) to spin it around; it coasts, then settles back face-forward.
 * `children` render inside the screen, under the status bar; `light` switches the
 * status bar and home indicator to dark ink for light app UIs; `indicator` overrides
 * the home indicator alone ("dark" | "light") when the top and bottom of the app differ.
 */
export const PhoneMockup = ({ running, screenBg = "#0b0b0d", light = false, indicator = light ? "dark" : "light", children }) => {
    const { pointer } = useStage()
    const wrapRef = useRef(null)
    const scaleRef = useRef(null)
    const bodyRef = useRef(null)
    const glareRef = useRef(null)
    const shadowRef = useRef(null)
    const motion = useRef({ rx: 0, ry: 0, tx: 0, ty: 0, spin: 0, v: 0, dragging: false, lastX: 0 })

    useFrame((now, t) => {
        const wrap = wrapRef.current
        const body = bodyRef.current
        if (!wrap || !body) return
        const s = motion.current
        scaleRef.current.style.transform = `scale(${Math.min(1, (wrap.offsetHeight - 50) / (H + 14)).toFixed(3)})`

        // Cursor tilt (held while dragging; rests flat without a mouse)
        const m = pointer.current
        if (!s.dragging) {
            s.tx = 0
            s.ty = 0
            if (hasPointer(m)) {
                const r = wrap.getBoundingClientRect()
                s.ty = Math.max(-1, Math.min(1, ((m.x - (r.left + r.width / 2)) / window.innerWidth) * 2.4)) * 26
                s.tx = Math.max(-1, Math.min(1, ((m.y - (r.top + r.height / 2)) / window.innerHeight) * 2.4)) * -12
            }
        }
        s.rx += (s.tx - s.rx) * 0.07
        s.ry += (s.ty - s.ry) * 0.07

        // Drag spin: coast with friction, then spring to the nearest full turn
        if (!s.dragging) {
            if (Math.abs(s.v) > 0.25) {
                s.spin += s.v
                s.v *= 0.94
            } else {
                s.v = 0
                const rest = Math.round(s.spin / 360) * 360
                s.spin += (rest - s.spin) * 0.08
                if (Math.abs(rest - s.spin) < 0.05) s.spin = 0
            }
        }

        const yaw = s.ry + s.spin
        const bob = Math.sin(t * 1.1) * 7
        body.style.transform = `translateY(${bob.toFixed(1)}px) rotateX(${s.rx.toFixed(2)}deg) rotateY(${yaw.toFixed(2)}deg)`

        // Glare slides across the glass as it turns; the floor shadow shifts and narrows
        const facing = Math.cos((yaw * Math.PI) / 180)
        if (glareRef.current) glareRef.current.style.backgroundPosition = `${(50 - yaw * 2.2).toFixed(1)}% 0`
        if (shadowRef.current) {
            shadowRef.current.style.transform = `translateX(${(-s.ry * 2.2).toFixed(1)}px) scaleX(${(0.45 + 0.55 * Math.abs(facing)).toFixed(3)})`
            shadowRef.current.style.opacity = (0.55 - bob / 40).toFixed(3)
        }
    }, running)

    const onPointerDown = (e) => {
        const s = motion.current
        s.dragging = true
        s.lastX = e.clientX
        s.v = 0
        e.currentTarget.setPointerCapture(e.pointerId)
    }
    const onPointerMove = (e) => {
        const s = motion.current
        if (!s.dragging) return
        const dx = (e.clientX - s.lastX) * 0.6
        s.lastX = e.clientX
        s.spin += dx
        s.v = dx
    }
    const endDrag = () => {
        motion.current.dragging = false
    }

    const face = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }

    return (
        <div ref={wrapRef} className="absolute inset-0 flex items-center justify-center">
            <div ref={scaleRef} className="relative origin-center perspective-[1400px]">
                <div
                    ref={shadowRef}
                    aria-hidden="true"
                    className="absolute left-1/2 -ml-[110px] w-[220px] h-9 rounded-full pointer-events-none"
                    style={{ top: H + 4, background: "radial-gradient(closest-side, rgba(20,12,60,.45), rgba(20,12,60,0))" }}
                />
                <div
                    ref={bodyRef}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    className="relative cursor-grab active:cursor-grabbing touch-pan-y select-none will-change-transform transform-3d"
                    style={{ width: W, height: H }}
                >
                    {/* Side wall: stacked slices between the front and back faces */}
                    {Array.from({ length: EDGE_LAYERS }, (_, i) => {
                        const z = -DEPTH / 2 + 1 + (i * (DEPTH - 2)) / (EDGE_LAYERS - 1)
                        return (
                            <div
                                key={i}
                                aria-hidden="true"
                                className="absolute inset-0"
                                style={{ borderRadius: RADIUS, background: TITANIUM_EDGE, transform: `translateZ(${z.toFixed(2)}px)` }}
                            />
                        )
                    })}
                    <div className="absolute inset-0" style={{ transform: "translateZ(0)" }} aria-hidden="true">
                        <SideButton side="left" top={96} height={22} />
                        <SideButton side="left" top={138} height={40} />
                        <SideButton side="left" top={188} height={40} />
                        <SideButton side="right" top={150} height={64} />
                    </div>

                    {/* Back: frosted glass with the camera plateau */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 overflow-hidden"
                        style={{
                            ...face,
                            borderRadius: RADIUS,
                            transform: `rotateY(180deg) translateZ(${DEPTH / 2}px)`,
                            background: TITANIUM,
                            padding: BAND,
                        }}
                    >
                        <div
                            className="relative w-full h-full"
                            style={{
                                borderRadius: RADIUS - BAND,
                                background: "linear-gradient(160deg,#3a3a3f,#202024 60%,#2b2b30)",
                                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.06)",
                            }}
                        >
                            <div
                                className="absolute left-3 top-3 w-[104px] h-[104px] rounded-[30px]"
                                style={{
                                    background: "linear-gradient(150deg,#4a4a50,#2a2a2f)",
                                    boxShadow: "0 2px 6px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.12)",
                                }}
                            >
                                <Lens x={10} y={10} />
                                <Lens x={10} y={62} />
                                <Lens x={60} y={36} />
                                <div className="absolute rounded-full" style={{ left: 70, top: 12, width: 11, height: 11, background: "radial-gradient(circle,#fff6d8,#d8c890 60%,#8d8466)" }} />
                                <div className="absolute rounded-full bg-black/70" style={{ left: 72, top: 78, width: 7, height: 7 }} />
                            </div>
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ borderRadius: RADIUS - BAND, background: "linear-gradient(115deg,rgba(255,255,255,0) 35%,rgba(255,255,255,.07) 50%,rgba(255,255,255,0) 65%)" }}
                            />
                        </div>
                    </div>

                    {/* Front: titanium band, black bezel, screen */}
                    <div
                        className="absolute inset-0"
                        style={{
                            ...face,
                            borderRadius: RADIUS,
                            transform: `translateZ(${DEPTH / 2}px)`,
                            background: TITANIUM,
                            padding: BAND,
                            boxShadow: "inset 0 0 0 .5px rgba(255,255,255,.35)",
                        }}
                    >
                        <div className="w-full h-full bg-[#050505]" style={{ borderRadius: RADIUS - BAND, padding: BEZEL }}>
                            <div
                                className={`relative w-full h-full overflow-hidden ${light ? "text-[#0f1c1b]" : "text-[#f5f5f7]"}`}
                                style={{ borderRadius: RADIUS - BAND - BEZEL, background: screenBg }}
                            >
                                {children}

                                {/* Status bar + Dynamic Island */}
                                <div className="absolute inset-x-0 top-0 h-11 z-10 flex items-center justify-between pl-[26px] pr-[18px] text-[13px] font-semibold pointer-events-none">
                                    <span className="tracking-[-0.01em]">9:41</span>
                                    <span className="flex items-center gap-[5px]">
                                        <SignalIcon />
                                        <WifiIcon />
                                        <BatteryIcon />
                                    </span>
                                </div>
                                <div className="absolute top-[11px] left-1/2 -ml-10 w-20 h-6 rounded-full bg-black z-20">
                                    <div
                                        className="absolute right-[9px] top-1/2 -mt-[4.5px] w-[9px] h-[9px] rounded-full"
                                        style={{ background: "radial-gradient(circle at 40% 35%,#2b3550,#0a0c14 60%)" }}
                                    />
                                </div>

                                {/* Home indicator */}
                                <div className={`absolute bottom-[7px] left-1/2 -ml-[50px] w-[100px] h-1 rounded-full z-10 ${indicator === "dark" ? "bg-black/80" : "bg-white/60"}`} />

                                {/* Glass glare */}
                                <div
                                    ref={glareRef}
                                    aria-hidden="true"
                                    className="absolute inset-0 z-30 pointer-events-none"
                                    style={{
                                        background: "linear-gradient(115deg,rgba(255,255,255,0) 38%,rgba(255,255,255,.13) 47%,rgba(255,255,255,.03) 54%,rgba(255,255,255,0) 62%)",
                                        backgroundSize: "260% 100%",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
