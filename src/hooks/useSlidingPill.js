import { useLayoutEffect } from "react"

/**
 * Positions `pillRef` behind the button in `containerRef` matching `selector`.
 * Re-measures when the selector changes, on resize, and once web fonts are ready.
 */
export const useSlidingPill = (containerRef, pillRef, selector) => {
    useLayoutEffect(() => {
        const place = () => {
            const btn = containerRef.current?.querySelector(selector)
            const pill = pillRef.current
            if (!btn || !pill || !btn.offsetWidth) return
            pill.style.width = btn.offsetWidth + "px"
            pill.style.height = btn.offsetHeight + "px"
            pill.style.top = btn.offsetTop + "px"
            pill.style.transform = `translateX(${btn.offsetLeft}px)`
        }
        let live = true
        place()
        document.fonts?.ready.then(() => live && place())
        window.addEventListener("resize", place)
        return () => {
            live = false
            window.removeEventListener("resize", place)
        }
    }, [containerRef, pillRef, selector])
}
