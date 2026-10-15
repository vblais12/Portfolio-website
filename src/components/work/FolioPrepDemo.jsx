import { useRef } from "react"
import { useFrame } from "@/lib/frameLoop"

/** Browser window with the FolioPrep screenshot slowly panning under a light sheen. */
export const FolioPrepDemo = ({ running }) => {
    const imgRef = useRef(null)
    const sheenRef = useRef(null)

    useFrame((now, t) => {
        const img = imgRef.current
        if (img?.naturalHeight) {
            const overflow = Math.max(0, img.offsetHeight - img.parentElement.offsetHeight)
            img.style.transform = `translateY(${(-(0.5 - 0.5 * Math.cos(t * 0.4)) * overflow).toFixed(1)}px)`
        }
        if (sheenRef.current) {
            sheenRef.current.style.transform = `translateX(${(((t * 0.35) % 1.6) * 1100 - 260).toFixed(0)}px)`
        }
    }, running)

    return (
        <div className="absolute inset-0 flex items-center justify-center p-9">
            <div className="w-full rounded-2xl overflow-hidden bg-card shadow-[0_0_0_1px_var(--line),0_40px_80px_-40px_var(--shadow)]">
                <div className="h-[34px] flex items-center gap-[7px] px-3.5 border-b border-line">
                    <span className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                    <span className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
                    <span className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
                    <span className="mx-auto text-[12px] text-mut">folio-prep.com</span>
                </div>
                <div className="relative h-[min(360px,calc(100vh-330px))] min-h-[240px] overflow-hidden">
                    <img
                        ref={imgRef}
                        src="/projects/folioprep.jpg"
                        alt="FolioPrep dashboard"
                        className="w-full block will-change-transform"
                    />
                    <div
                        ref={sheenRef}
                        className="absolute top-0 bottom-0 left-0 w-[220px] will-change-transform"
                        style={{ background: "linear-gradient(100deg,transparent,rgba(255,255,255,.5),transparent)" }}
                    />
                </div>
            </div>
        </div>
    )
}
