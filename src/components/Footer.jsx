import { ArrowUp, Github, Linkedin, Mail } from "lucide-react"

export const Footer = () => {
    return (
        <footer className="border-t border-border py-10 px-4">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Viktor Blais. Built with
                    React &amp; Tailwind.
                </p>

                <div className="flex items-center gap-1">
                    <a
                        href="https://github.com/vblais12"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                    >
                        <Github size={18} />
                    </a>
                    <a
                        href="https://linkedin.com/in/viktor-blais-a957a2378"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="LinkedIn"
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                    >
                        <Linkedin size={18} />
                    </a>
                    <a
                        href="mailto:viktor.blais.tech@gmail.com"
                        aria-label="Email"
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                    >
                        <Mail size={18} />
                    </a>
                    <a
                        href="#hero"
                        aria-label="Back to top"
                        className="ml-2 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        <ArrowUp size={18} />
                    </a>
                </div>
            </div>
        </footer>
    )
}
