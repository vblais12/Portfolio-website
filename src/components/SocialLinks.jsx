import { Github, Instagram, Linkedin, Mail } from "lucide-react"

const SOCIALS = [
    { label: "GitHub", href: "https://github.com/vblais12", Icon: Github },
    { label: "LinkedIn", href: "https://linkedin.com/in/viktor-blais-a957a2378", Icon: Linkedin },
    { label: "Instagram", href: "https://www.instagram.com/vik.talks.tech/", Icon: Instagram },
    { label: "Email", href: "mailto:viktor.blais.tech@gmail.com", Icon: Mail },
]

export const SocialLinks = ({ className = "" }) => (
    <nav aria-label="Social links" className={`flex items-center gap-1 ${className}`}>
        {SOCIALS.map((social) => {
            const { label, href, Icon } = social
            const external = href.startsWith("http")
            return (
                <a
                    key={label}
                    href={href}
                    aria-label={label}
                    title={label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-mut border border-transparent transition-[color,background-color,border-color,translate] duration-300 ease-soft hover:text-fg hover:bg-glass hover:border-gb hover:-translate-y-0.5"
                >
                    <Icon size={17} strokeWidth={1.75} />
                </a>
            )
        })}
    </nav>
)
