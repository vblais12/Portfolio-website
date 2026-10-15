import { useEffect, useRef } from "react"

// One shared requestAnimationFrame loop for every continuous effect on the page.
// Subscribers write styles straight to DOM refs; nothing calls setState per frame.
const subscribers = new Set()
const T0 = performance.now()
let raf = 0

const tick = (now) => {
    raf = requestAnimationFrame(tick)
    const t = (now - T0) / 1000
    subscribers.forEach((fn) => fn(now, t))
}

/** Run `callback(now, t)` every frame while `enabled`. `t` is seconds since page load. */
export const useFrame = (callback, enabled = true) => {
    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current = callback
    })

    useEffect(() => {
        if (!enabled) return
        const fn = (now, t) => callbackRef.current(now, t)
        subscribers.add(fn)
        if (!raf) raf = requestAnimationFrame(tick)
        return () => {
            subscribers.delete(fn)
            if (!subscribers.size) {
                cancelAnimationFrame(raf)
                raf = 0
            }
        }
    }, [enabled])
}

/** Size a canvas's backing store to its CSS box at `res` device pixels; returns [ctx, w, h] in CSS px. */
export const fitCanvas = (canvas, res) => {
    const d = res || Math.min(2, window.devicePixelRatio || 1)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    const W = Math.max(1, Math.round(w * d))
    const H = Math.max(1, Math.round(h * d))
    if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W
        canvas.height = H
    }
    const ctx = canvas.getContext("2d")
    ctx.setTransform(d, 0, 0, d, 0, 0)
    return [ctx, w, h]
}
