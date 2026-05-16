import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const navItems = [
    { name: "Home", href: "#hero", id: "hero" },
    { name: "About", href: "#about", id: "about" },
    { name: "Skills", href: "#skills", id: "skills" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Contact", href: "#contact", id: "contact" },
]

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeSection, setActiveSection] = useState("hero")

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)

            const offset = window.scrollY + 120
            for (const item of [...navItems].reverse()) {
                const el = document.getElementById(item.id)
                if (el && el.offsetTop <= offset) {
                    setActiveSection(item.id)
                    break
                }
            }
        }

        handleScroll()
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={cn(
                "fixed w-full z-50 transition-all duration-300",
                isScrolled
                    ? "py-3 bg-background/80 backdrop-blur-md border-b border-border"
                    : "py-5 border-b border-transparent"
            )}
        >
            <div className="container flex items-center justify-between">
                <a
                    href="#hero"
                    className="font-bold text-lg flex items-center gap-2"
                >
                    <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground font-mono text-sm">
                        VB
                    </span>
                    <span className="text-foreground">Viktor Blais</span>
                </a>

                {/* Desktop */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200",
                                activeSection === item.id
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {item.name}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        className="ml-2 px-4 py-1.5 rounded-md text-sm font-semibold border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                    >
                        Let's talk
                    </a>
                </div>

                {/* Mobile toggle */}
                <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="md:hidden p-2 text-foreground z-50"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile menu */}
                <div
                    className={cn(
                        "fixed inset-0 bg-background/95 backdrop-blur-md z-40 flex flex-col items-center justify-center",
                        "transition-all duration-300 md:hidden",
                        isMenuOpen
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                    )}
                >
                    <div className="flex flex-col items-center space-y-8 text-xl">
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={item.href}
                                className={cn(
                                    "transition-colors duration-200",
                                    activeSection === item.id
                                        ? "text-primary"
                                        : "text-foreground/80 hover:text-primary"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}
