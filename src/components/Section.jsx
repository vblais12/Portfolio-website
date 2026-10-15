import { EASE, SECTIONS, useStage } from "@/lib/stage"

/**
 * One full-viewport layer. Only the active section is visible and interactive;
 * the one just left drifts further and blurs more than the rest.
 * Children marked `data-st` get the staggered entrance (driven by Home's go()).
 */
export const Section = ({ index, className = "", children, ref }) => {
    const { section, prevSection } = useStage()
    const active = index === section
    const dir = index < section ? -1 : 1
    const wasPrev = index === prevSection

    const vis = active
        ? { opacity: 1, transform: "none", filter: "none", pointerEvents: "auto" }
        : {
              opacity: 0,
              transform: `translateX(${dir * (wasPrev ? 60 : 30)}px) scale(${wasPrev ? 0.94 : 0.97})`,
              filter: `blur(${wasPrev ? 16 : 10}px)`,
              pointerEvents: "none",
          }

    return (
        <section
            ref={ref}
            data-sec={index}
            aria-label={SECTIONS[index]}
            inert={!active}
            className={`absolute inset-0 box-border ${className}`}
            style={{ ...vis, transition: `opacity .7s, transform 1s ${EASE}, filter .7s` }}
        >
            {children}
        </section>
    )
}
