import { useState } from "react"
import { cn } from "@/lib/utils"

const skills = [
    { name: "Python", category: "Languages" },
    { name: "C++", category: "Languages" },
    { name: "JavaScript", category: "Languages" },
    { name: "TypeScript", category: "Languages" },
    { name: "Java", category: "Languages" },
    { name: "SQL (Postgres)", category: "Languages" },
    { name: "Assembly", category: "Languages" },

    { name: "TensorFlow", category: "Libraries / Frameworks" },
    { name: "Scikit-learn", category: "Libraries / Frameworks" },
    { name: "HuggingFace", category: "Libraries / Frameworks" },
    { name: "Pandas", category: "Libraries / Frameworks" },
    { name: "NumPy", category: "Libraries / Frameworks" },
    { name: "Matplotlib", category: "Libraries / Frameworks" },
    { name: "Seaborn", category: "Libraries / Frameworks" },
    { name: "React", category: "Libraries / Frameworks" },
    { name: "Tailwind CSS", category: "Libraries / Frameworks" },

    { name: "Git", category: "Tools" },
    { name: "GitHub", category: "Tools" },
    { name: "Jupyter", category: "Tools" },
    { name: "Selenium", category: "Tools" },

    { name: "AWS", category: "Cloud" },
    { name: "Render", category: "Cloud" },
    { name: "Vercel", category: "Cloud" },
]

const categories = ["All", "Languages", "Libraries / Frameworks", "Tools", "Cloud"]

export const SkillsSection = () => {
    const [activeCategory, setActiveCategory] = useState("All")

    const filteredSkills = skills.filter(
        (skill) =>
            activeCategory === "All" || skill.category === activeCategory
    )

    return (
        <section id="skills" className="py-24 px-4 relative dot-grid">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-14 text-center">
                    <p className="section-label mb-3">02 — Skills</p>
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Tools I <span className="text-primary">work with</span>
                    </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
                                activeCategory === category
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {filteredSkills.map((skill) => (
                        <span
                            key={skill.name}
                            className="card-base card-hover px-4 py-2 text-sm font-medium cursor-default"
                        >
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}
