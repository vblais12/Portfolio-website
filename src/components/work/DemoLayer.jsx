import { EASE } from "@/lib/stage"

/** One demo in the Work stage; inactive demos sit above / below the active one, blurred. */
export const DemoLayer = ({ index, active, className = "", children }) => {
    const on = index === active
    return (
        <div
            aria-hidden={!on}
            className={`absolute inset-0 ${className}`}
            style={{
                opacity: on ? 1 : 0,
                transform: `translateY(${on ? 0 : index < active ? -40 : 40}px) scale(${on ? 1 : 0.94})`,
                filter: `blur(${on ? 0 : 12}px)`,
                pointerEvents: on ? "auto" : "none",
                transition: `opacity .8s, transform .9s ${EASE}, filter .8s`,
            }}
        >
            {children}
        </div>
    )
}
