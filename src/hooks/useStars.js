import { useEffect, useRef } from "react"
import { fitCanvas, useFrame } from "@/lib/frameLoop"
import { hasPointer, useStage } from "@/lib/stage"

const REACH = 170

/** Dark-mode starfield: twinkles, parallaxes with the cursor and draws constellation lines to it. */
export const useStars = (canvasRef) => {
    const { theme, section, pointer } = useStage()
    const stars = useRef(null)
    const progress = useRef(0)
    const dark = theme === "dark"

    if (!stars.current) {
        stars.current = Array.from({ length: 200 }, () => ({
            x: Math.random(),
            y: Math.random(),
            z: Math.random(),
            tw: Math.random() * 6.28,
        }))
    }

    useEffect(() => {
        if (dark) return
        const cv = canvasRef.current
        if (cv) cv.getContext("2d").clearRect(0, 0, cv.width, cv.height)
    }, [dark, canvasRef])

    useFrame((now, t) => {
        const cv = canvasRef.current
        if (!cv) return
        progress.current += (section / 4 - progress.current) * 0.04
        const p = progress.current
        const [x, W, H] = fitCanvas(cv)
        x.clearRect(0, 0, W, H)

        const m = pointer.current
        const mouse = hasPointer(m)
        const pts = stars.current.map((s) => [
            (((s.x - p * s.z * 0.25) % 1) + 1) % 1 * W - (mouse ? (m.x - W / 2) * s.z * 0.02 : 0),
            s.y * H,
            s,
        ])

        const near = pts
            .map((q) => [q, Math.hypot(q[0] - m.x, q[1] - m.y)])
            .filter((a) => a[1] < REACH)
            .sort((a, b) => a[1] - b[1])
            .slice(0, 6)
        x.lineWidth = 1
        near.forEach(([q, d], i) => {
            x.strokeStyle = `rgba(200,215,255,${(0.45 * (1 - d / REACH)).toFixed(3)})`
            x.beginPath()
            x.moveTo(m.x, m.y)
            x.lineTo(q[0], q[1])
            x.stroke()
            if (i) {
                const r = near[i - 1][0]
                x.strokeStyle = `rgba(200,215,255,${(0.18 * (1 - d / REACH)).toFixed(3)})`
                x.beginPath()
                x.moveTo(r[0], r[1])
                x.lineTo(q[0], q[1])
                x.stroke()
            }
        })

        pts.forEach(([px, py, s]) => {
            const tw = 0.45 + 0.55 * Math.sin(t * (1 + s.z * 2) + s.tw)
            const n = Math.max(0, 1 - Math.hypot(px - m.x, py - m.y) / REACH)
            x.fillStyle = `rgba(235,240,255,${(0.12 + s.z * 0.5 * tw + n * 0.5).toFixed(3)})`
            x.beginPath()
            x.arc(px, py, 0.5 + s.z * 1.2 + n, 0, 6.28)
            x.fill()
        })
    }, dark)
}
