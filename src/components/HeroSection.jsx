import { ArrowDown, ArrowRight, Github, Linkedin, Mail } from "lucide-react"

const techStack = ["Python", "C++", "React", "PyTorch", "AWS", "PostgreSQL"]

export const HeroSection = () => {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center px-4 py-28 dot-grid"
        >
            {/* soft teal glow */}
            <div className="absolute top-1/3 left-1/4 -z-0 h-72 w-72 rounded-full bg-primary/15 blur-[120px]" />

            <div className="container mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
                {/* Left: text */}
                <div className="lg:col-span-7 text-left space-y-7">
                    <p className="opacity-0 animate-fade-in inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/30 rounded-full px-4 py-1.5">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse-subtle" />
                        Open to internships — Summer 2026
                    </p>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
                        <span className="opacity-0 animate-fade-in block text-muted-foreground text-2xl md:text-3xl font-medium mb-2">
                            Hi, I'm
                        </span>
                        <span className="opacity-0 animate-fade-in-delay-1 block">
                            Viktor{" "}
                            <span className="text-primary">Blais</span>
                        </span>
                    </h1>

                    <p className="opacity-0 animate-fade-in-delay-2 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                        Computer Science &amp; Math student at UBC — building
                        data-driven software and applying machine learning to
                        real-world problems.
                    </p>

                    <div className="opacity-0 animate-fade-in-delay-3 flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                            <span
                                key={tech}
                                className="text-xs font-mono rounded-md bg-secondary text-foreground/70 px-2.5 py-1"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    <div className="opacity-0 animate-fade-in-delay-4 flex flex-wrap items-center gap-4 pt-2">
                        <a href="#projects" className="cosmic-button gap-2">
                            View My Work <ArrowRight size={16} />
                        </a>
                        <a href="#contact" className="ghost-button gap-2">
                            Get in Touch
                        </a>
                        <div className="flex items-center gap-1 sm:ml-2">
                            {[
                                {
                                    icon: Github,
                                    href: "https://github.com/vblais12",
                                    label: "GitHub",
                                },
                                {
                                    icon: Linkedin,
                                    href: "https://linkedin.com/in/viktor-blais-a957a2378",
                                    label: "LinkedIn",
                                },
                                {
                                    icon: Mail,
                                    href: "mailto:viktor.blais.tech@gmail.com",
                                    label: "Email",
                                },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                                >
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: portrait */}
                <div className="lg:col-span-5 opacity-0 animate-fade-in-delay-3 flex justify-center">
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-2xl" />
                        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden border border-primary/30 bg-card animate-float">
                            <img
                                src="/logo_img.png"
                                alt="Viktor Blais"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <a
                href="#about"
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-muted-foreground hover:text-primary transition-colors animate-bounce"
            >
                <span className="text-xs font-mono uppercase tracking-widest mb-1">
                    Scroll
                </span>
                <ArrowDown className="h-4 w-4" />
            </a>
        </section>
    )
}
