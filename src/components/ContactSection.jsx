import { Mail, Phone, MapPin, Linkedin, Github, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const contactInfo = [
    {
        icon: Mail,
        label: "Email",
        value: "viktor.blais.tech@gmail.com",
        href: "mailto:viktor.blais.tech@gmail.com",
    },
    {
        icon: Phone,
        label: "Phone",
        value: "+1 (707) 364-6441",
        href: "tel:+17073646441",
    },
    {
        icon: MapPin,
        label: "Location",
        value: "Vancouver, BC, Canada",
        href: null,
    },
]

export const ContactSection = () => {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setTimeout(() => {
            toast({
                title: "Message sent!",
                description:
                    "Thanks for reaching out — I'll get back to you shortly.",
            })
            setIsSubmitting(false)
            e.target.reset()
        }, 1500)
    }

    return (
        <section id="contact" className="py-24 px-4 relative dot-grid">
            <div className="container mx-auto max-w-5xl">
                <div className="mb-14 text-center">
                    <p className="section-label mb-3">04 — Contact</p>
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Let's <span className="text-primary">connect</span>
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                        Have an opportunity, question, or just want to say hi?
                        Drop me a message.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Contact info */}
                    <div className="lg:col-span-2 space-y-4">
                        {contactInfo.map(({ icon: Icon, label, value, href }) => {
                            const content = (
                                <div className="card-base card-hover p-5 flex items-center gap-4">
                                    <div className="shrink-0 p-3 rounded-lg bg-primary/10">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                                            {label}
                                        </p>
                                        <p className="text-sm font-medium">
                                            {value}
                                        </p>
                                    </div>
                                </div>
                            )
                            return href ? (
                                <a key={label} href={href} className="block">
                                    {content}
                                </a>
                            ) : (
                                <div key={label}>{content}</div>
                            )
                        })}

                        <div className="card-base p-5 flex items-center justify-between">
                            <p className="text-sm font-medium">Find me online</p>
                            <div className="flex gap-1">
                                <a
                                    href="https://github.com/vblais12"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="GitHub"
                                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                                >
                                    <Github size={20} />
                                </a>
                                <a
                                    href="https://linkedin.com/in/viktor-blais-a957a2378"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn"
                                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
                                >
                                    <Linkedin size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-3 card-base p-8">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/60 transition-shadow"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/60 transition-shadow"
                                    placeholder="jane@example.com"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/60 transition-shadow resize-none"
                                    placeholder="Hi Viktor, I'd like to talk about..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="cosmic-button w-full gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
