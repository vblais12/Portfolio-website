import { Brain, ShieldCheck, Headphones, ArrowRight, FileText } from "lucide-react"

const focusAreas = [
    {
        icon: Brain,
        title: "AI / Machine Learning",
        description:
            "Studying ML architectures and integrating them into real-world software — from data pipelines to model deployment.",
    },
    {
        icon: ShieldCheck,
        title: "Cybersecurity",
        description:
            "Exploring security fundamentals through hands-on labs, web vulnerabilities, and secure development practices.",
    },
    {
        icon: Headphones,
        title: "Beyond Code",
        description:
            "Working out, golfing, and following sports — staying balanced keeps me sharp when I'm back at the keyboard.",
    },
]

export const AboutSection = () => {
    return (
        <section id="about" className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-14 text-center">
                    <p className="section-label mb-3">01 — About</p>
                    <h2 className="text-3xl md:text-4xl font-bold">
                        A bit about <span className="text-primary">me</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: bio */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold">
                            Analytical problem-solver, focused on real-world
                            impact.
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            I build data-driven projects that apply machine
                            learning to meaningful challenges. I care about
                            shipping things that actually work — not just
                            notebooks, but deployed, maintainable software.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            Driven by a constant desire to learn, I'm committed
                            to continuous improvement and staying current in a
                            fast-moving field.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <a href="#contact" className="cosmic-button gap-2">
                                Get in touch <ArrowRight size={16} />
                            </a>
                            <a href="/resume.pdf" className="ghost-button gap-2">
                                <FileText size={16} /> Download Résumé
                            </a>
                        </div>
                    </div>

                    {/* Right: focus cards */}
                    <div className="space-y-4">
                        {focusAreas.map(({ icon: Icon, title, description }) => (
                            <div
                                key={title}
                                className="card-base card-hover p-6 flex items-start gap-4"
                            >
                                <div className="shrink-0 p-3 rounded-lg bg-primary/10">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-semibold mb-1">
                                        {title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
