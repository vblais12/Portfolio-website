import { useRef } from "react"
import { useFrame } from "@/lib/frameLoop"
import { useSlidingPill } from "@/hooks/useSlidingPill"
import { SECTIONS, SPRING, useStage } from "@/lib/stage"

export const Navbar = ({ onToggleTheme }) => {
    const { section, go, theme } = useStage()
    const tabsRef = useRef(null)
    const pillRef = useRef(null)
    const shimmerRef = useRef(null)

    useSlidingPill(tabsRef, pillRef, `[data-tab="${section}"]`)

    // Slow scroll of the brand gradient through the "AI"
    useFrame((now, t) => {
        if (shimmerRef.current) shimmerRef.current.style.backgroundPosition = `${(t * 14) % 300}% 0`
    })

    return (
        <nav className="absolute top-[18px] inset-x-0 mx-auto w-fit max-w-[calc(100vw-24px)] box-border z-50 flex items-center gap-1 py-1.5 pr-1.5 pl-5 max-sm:pl-1.5 rounded-full glass backdrop-blur-[24px] backdrop-saturate-[1.6] shadow-nav text-[14px] max-sm:text-[13px] whitespace-nowrap overflow-x-auto [scrollbar-width:none]">
            <button
                onClick={(e) => go(0, e.currentTarget)}
                className="text-[17px] font-semibold tracking-[-0.02em] mr-3 text-fg cursor-pointer whitespace-nowrap max-sm:hidden"
            >
                viktor bl
                <span
                    ref={shimmerRef}
                    className="bg-clip-text text-transparent"
                    style={{
                        backgroundImage: "linear-gradient(90deg,#7c3aed,#2563eb,#0d9488,#a855f7,#7c3aed)",
                        backgroundSize: "300% 100%",
                    }}
                >
                    AI
                </span>
                s
            </button>

            <div ref={tabsRef} className="relative flex gap-0.5">
                <div
                    ref={pillRef}
                    className="absolute left-0 top-0 h-full rounded-full bg-fg"
                    style={{ transition: `transform .6s ${SPRING}, width .6s ${SPRING}` }}
                />
                {SECTIONS.map((name, i) => (
                    <button
                        key={name}
                        data-tab={i}
                        onClick={(e) => go(i, e.currentTarget)}
                        aria-current={section === i ? "page" : undefined}
                        className="relative z-1 font-medium cursor-pointer px-[15px] max-sm:px-2.5 py-[9px] rounded-full"
                        style={{ color: section === i ? "var(--bg)" : "var(--mut2)", transition: "color .45s" }}
                    >
                        {name}
                    </button>
                ))}
            </div>

            <button
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                className="w-9 h-9 shrink-0 rounded-full border border-line text-fg cursor-pointer flex items-center justify-center ml-1 text-[14px]"
            >
                {theme === "dark" ? "☀" : "☾"}
            </button>
        </nav>
    )
}
