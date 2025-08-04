
import { useState } from 'react'
import { cn } from "@/lib/utils"

const skills = [
    {name: "Python", level: 100, category: "Languages"},
    {name: "C++", level: 100, category: "Languages"},
    {name: "JavaScript", level: 100, category: "Languages"},
    {name: "Assembly Language", level: 100, category: "Languages"},
    {name: "Java", level: 100, category: "Languages"},

    {name: "TensorFlow", level: 100, category: "Libraries/Frameworks"},
    {name: "Scikit-learn", level: 100, category: "Libraries/Frameworks"},
    {name: "Pandas", level: 100, category: "Libraries/Frameworks"},
    {name: "Matplotlib", level: 100, category: "Libraries/Frameworks"},
    {name: "NumPy", level: 100, category: "Libraries/Frameworks"},
    {name: "Seaborn", level: 100, category: "Libraries/Frameworks"},
    {name: "React", level: 100, category: "Libraries/Frameworks"},
    {name: "Tailwind CSS", level: 100, category: "Libraries/Frameworks"},

    {name: "Git", level: 100, category: "Developer Tools"},
    {name: "Github", level: 100, category: "Developer Tools"},
    {name: "Jupyter Notebooks", level: 100, category: "Developer Tools"},
    {name: "Selenium", level: 100, category: "Developer Tools"}

]

const categories = ['All', 'Languages', 'Libraries/Frameworks', 'Developer Tools']


export const SkillsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "All" || skill.category === activeCategory
  );
  return (
    <section id="skills" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          My <span className="text-primary"> Skills</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category, key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-5 py-2 rounded-full transition-colors duration-300 capitalize",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/70 text-forefround hover:bd-secondary"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, key) => (
            <div
              key={key}
              className="bg-card p-6 rounded-lg shadow-xs card-hover"
            >
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg"> {skill.name}</h3>
              </div>
              <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full origin-left animate-[grow_1.5s_ease-out]"
                  style={{ width: skill.level + "%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};