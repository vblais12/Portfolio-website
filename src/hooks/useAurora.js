import { useRef } from "react"
import { fitCanvas, useFrame } from "@/lib/frameLoop"
import { AURORA_BLOBS, CANVAS_THEME, hasPointer, useStage } from "@/lib/stage"

const BLOB_BASES = [[.22, .3], [.72, .25], [.55, .72], [.18, .78], [.88, .62]]

/**
 * Soft animated gradient filling the viewport. Drawn at 0.12x device pixels and
 * stretched by the browser — the upscale gives the blur for free (no CSS filter).
 */
export const useAurora = (canvasRef) => {
    const { theme, section, pointer, surge, motion } = useStage()
    const sim = useRef({ T: 0, p: 0, stir: { x: .3, y: .3 } })

    useFrame((now, t) => {
        const cv = canvasRef.current
        if (!cv) return
        const s = sim.current
        const dark = theme === "dark"
        const palette = AURORA_BLOBS[theme]

        s.T += (1 / 60) * motion * (1 + surge.current * 5)
        s.p += (section / 4 - s.p) * 0.04

        const [x, W, H] = fitCanvas(cv, 0.12)
        x.globalCompositeOperation = "source-over"
        x.fillStyle = CANVAS_THEME[theme].bg
        x.fillRect(0, 0, W, H)
        x.globalCompositeOperation = dark ? "lighter" : "source-over"

        const mouse = hasPointer(pointer.current)
        if (mouse) {
            s.stir.x += (pointer.current.x / window.innerWidth - s.stir.x) * 0.025
            s.stir.y += (pointer.current.y / window.innerHeight - s.stir.y) * 0.025
        }

        BLOB_BASES.forEach(([baseX, baseY], i) => {
            const ph = i * 1.7
            let bx = baseX + Math.sin(s.T * 0.21 + ph + s.p * 5) * 0.16
            let by = baseY + Math.cos(s.T * 0.17 + ph * 1.3 + s.p * 6) * 0.16
            if (i === 0 && mouse) {
                bx = s.stir.x
                by = s.stir.y
            }
            const R = Math.max(W, H) * (0.36 + 0.06 * Math.sin(t * 0.5 + i) + surge.current * 0.08)
            const X = bx * W
            const Y = by * H
            const col = palette[(i + section) % palette.length]
            const g = x.createRadialGradient(X, Y, 0, X, Y, R)
            g.addColorStop(0, col + (dark ? "aa" : "d0"))
            g.addColorStop(1, col + "00")
            x.fillStyle = g
            x.beginPath()
            x.arc(X, Y, R, 0, 6.28)
            x.fill()
        })
    })
}
