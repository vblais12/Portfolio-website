import { Code, Headphones, ShieldCheck } from "lucide-react"

export const AboutSection = () => {
    return <section id='about' className="py-25 px-4 relative">
        <div className="container mx-auto max-w-5xl"> 
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                About <span className="text-primary"> Me</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h4 className='text-xl font-semibold'>
                        Passionate software engineer
                    </h4>
                    <p className="text-muted-foreground">
                        Analytical problem-solver with a passion for building data-driven, real-world projects that 
                        apply machine learning to address meaningful challenges.
                    </p>

                    <p className="text-muted-foreground">
                        Driven by a constant desire to learn and grow, I'm committed 
                        to continuous improvement to stay at the forefront of the fast-moving field of software engineering.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                        <a href="#contact" className="cosmic-button">
                            Get in touch!
                        </a>
                        <a href="" className="cosmic-button"> 
                            Download Resume
                        </a>
                    </div>
                </div>

                <div className='grid grid-cols-1 gap-6'>
                    <div className="gradient-border p-6 card-hover">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Code className="h-6 w-6 text-primary"/>
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-lg">AI/ML</h4>
                                <p className="text-muted-foreground">Studying machine learning to understand the underlying architectures and 
                                    integrate AI into real-world software projects </p> 
                            </div>
                        </div>
                    </div>
                    <div className="gradient-border p-6 card-hover">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <ShieldCheck className="h-6 w-6 text-primary"/>
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-lg">Cybersecurity</h4>
                                <p className="text-muted-foreground">Exploring cyber fundamentals through hands-on labs to understand 
                                    web vulnerabilities and strengthen software security in development</p>
                            </div>
                        </div>
                    </div>
                    <div className="gradient-border p-6 card-hover">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-full bg-primary/10">
                                <Headphones className="h-6 w-6 text-primary"/>
                            </div>
                            <div className="text-left">
                                <h4 className="font-bold text-lg">Hobbies</h4>
                                <p className="text-muted-foreground">Working out, golfing, watching sports, coding :) </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </section>
}