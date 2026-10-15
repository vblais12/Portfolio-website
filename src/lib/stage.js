import { createContext, useContext } from "react"

export const SECTIONS = ["Home", "About", "Skills", "Work", "Contact"]

// Canvas-side copies of the theme tokens (CSS reads the vars in index.css).
export const CANVAS_THEME = {
    light: { bg: "#fbfbfd" },
    dark: { bg: "#000000" },
}

export const AURORA_BLOBS = {
    light: ["#b9a7ff", "#7fd3ff", "#ffc4a3", "#9ff0d2", "#f0a8ff"],
    dark: ["#4b2fd6", "#1747d1", "#0a8f84", "#7a2ad0", "#c23b7d"],
}

export const EASE = "cubic-bezier(.2,.8,.2,1)"
export const SPRING = "cubic-bezier(.3,1.25,.4,1)"

/**
 * Shared page state:
 *  section / prevSection / go(index, fromEl) / theme,
 *  plus mutable refs read inside the frame loop:
 *  pointer {x,y} (-9999 when no mouse), surge (0–1, decays), sectionStart (ms), motion (multiplier).
 */
export const StageContext = createContext(null)

export const useStage = () => useContext(StageContext)

/** True when the pointer ref holds a real mouse position. */
export const hasPointer = (pointer) => pointer.x > -9000
