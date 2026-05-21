import { Github, ExternalLink, ArrowRight } from "lucide-react"

const projects = [
    {
        id: 1,
        title: "Vektor AI",
        description:
            "An identity-driven AI habit coaching app, live on the App Store. Cross-platform React Native build with personalized onboarding, multi-auth, and a push-notification system with configurable delivery windows.",
        image: "/projects/vektor.jpg",
        tags: ["React Native", "TypeScript", "Expo", "Supabase"],
        githubUrl: null,
        liveUrl: "https://www.vektorai.app/",
    },
    {
        id: 2,
        title: "FolioPrep",
        description:
            "A college-prep dashboard where students track activities, awards, volunteer hours, test scores, and essays from freshman year on — every field maps to Common App, UC, or Coalition. Includes AI profile analysis that flags strengths, gaps, and next steps.",
        image: "/projects/folioprep.jpg",
        tags: ["React", "AI", "Web App"],
        githubUrl: "GITHUB_URL_PLACEHOLDER",
        liveUrl: "https://folio-prep.com/",
    },
    {
        id: 3,
        title: "TaPRO",
        description:
            "An AI-powered virtual teaching assistant that supports university office hours for students and professors. Data pipelines store assignments, course materials, and interaction summaries in Supabase for fast retrieval and reuse.",
        image: "/projects/tapro.jpg",
        tags: ["Gemini API", "Next.js", "Node.js", "Supabase"],
        githubUrl: "https://github.com/austinluk/ta_pro",
        liveUrl: "https://www.youtube.com/watch?v=Qb1FNeKKBsg",
    },
    {
        id: 4,
        title: "Job Market Intelligence Tracker",
        description:
            "Analyzes job-market trends and in-demand skills using NLP, with a FastAPI backend and a TypeScript dashboard.",
        image: "/projects/JMIT_png.jpg",
        tags: ["NLP", "FastAPI", "Python", "TypeScript", "PostgreSQL", "AWS"],
        githubUrl: "https://github.com/vblais12/job_m_tracker",
        liveUrl: null,
    },
    {
        id: 5,
        title: "NHL Outcome Predictor",
        description:
            "An ML pipeline predicting NHL game outcomes — data scraping, feature engineering, and model training.",
        image: "/projects/NHL.jpg",
        tags: ["Python", "Scikit-learn", "Pandas"],
        githubUrl: "https://github.com/vblais12/NHL_stats_predictor",
        liveUrl: null,
    },
]

export const ProjectsSection = () => {
    return (
        <section id="projects" className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-14 text-center">
                    <p className="section-label mb-3">03 — Projects</p>
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Featured <span className="text-primary">work</span>
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                        A selection of recent projects. More on my GitHub.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project) => (
                        <article
                            key={project.id}
                            className="group card-base card-hover overflow-hidden flex flex-col"
                        >
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs font-mono rounded bg-secondary text-primary/90 px-2 py-0.5"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="text-xl font-bold mb-2">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                    {project.description}
                                </p>

                                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Github size={16} /> Code
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <ExternalLink size={16} /> Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        href="https://github.com/vblais12"
                        target="_blank"
                        rel="noreferrer"
                        className="ghost-button gap-2"
                    >
                        See more on GitHub <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    )
}
