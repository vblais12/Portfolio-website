import { useEffect, useRef, useState } from "react"
import { Section } from "@/components/Section"

const ROW = "flex justify-between gap-4 py-3 border-t border-line"
const LINK_ROW = `${ROW} transition-[color,padding] duration-[250ms,350ms] ease-soft hover:text-acc hover:pl-2`
const FIELD =
    "text-[17px] text-fg bg-glass2 border border-line rounded-2xl py-[15px] px-[18px] outline-none transition-[border-color,box-shadow] duration-300 focus:border-acc focus:shadow-[0_0_0_4px_rgba(0,113,227,.15)]"

export const ContactSection = () => {
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const timer = useRef(0)

    useEffect(() => () => clearTimeout(timer.current), [])

    // No backend: simulate the send, then swap the form for a success state
    const handleSubmit = (e) => {
        e.preventDefault()
        setSending(true)
        timer.current = setTimeout(() => {
            setSending(false)
            setSent(true)
        }, 1300)
    }

    return (
        <Section
            index={4}
            className="flex items-center-safe pt-24 pb-[92px] px-[max(24px,calc((100vw-1140px)/2))] overflow-auto"
        >
            <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-14 items-center">
                <div className="flex flex-col gap-[22px]">
                    <h2 data-st className="m-0 text-[clamp(52px,min(7vw,10vh),104px)] font-bold tracking-[-0.055em] leading-[.95]">
                        Let's build
                        <br />
                        something.
                    </h2>
                    <p data-st className="m-0 text-[20px] text-mut2 max-w-[460px] leading-[1.45]">
                        An internship, a collaboration, or just a question. I'll get back to you.
                    </p>
                    <div data-st className="flex flex-col text-[16px]">
                        <a href="mailto:viktor.blais.tech@gmail.com" className={LINK_ROW}>
                            <span className="text-mut">Email</span>
                            viktor.blais.tech@gmail.com
                        </a>
                        <a href="tel:+17073646441" className={LINK_ROW}>
                            <span className="text-mut">Phone</span>
                            +1 (707) 364-6441
                        </a>
                        <div className={ROW}>
                            <span className="text-mut">Location</span>
                            Vancouver, BC
                        </div>
                        <div className={`${ROW} border-b`}>
                            <span className="text-mut">Elsewhere</span>
                            <span className="flex gap-[18px]">
                                <a href="https://github.com/vblais12" target="_blank" rel="noopener noreferrer" className="text-acc">
                                    GitHub ›
                                </a>
                                <a
                                    href="https://linkedin.com/in/viktor-blais-a957a2378"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-acc"
                                >
                                    LinkedIn ›
                                </a>
                            </span>
                        </div>
                    </div>
                </div>

                <div data-st>
                    <div className="p-[clamp(22px,3vw,32px)] rounded-[32px] glass backdrop-blur-[30px] backdrop-saturate-150 shadow-panel">
                        {sent ? (
                            <div className="flex flex-col items-center text-center gap-3 py-[50px] px-2.5">
                                <span className="w-16 h-16 rounded-full bg-[#34c759] text-white flex items-center justify-center text-[30px] font-bold">
                                    ✓
                                </span>
                                <span className="text-[34px] font-bold tracking-[-0.04em]">Message sent.</span>
                                <span className="text-[17px] text-mut2">Thanks for reaching out. I'll get back to you shortly.</span>
                                <button onClick={() => setSent(false)} className="mt-1.5 text-[16px] cursor-pointer text-acc">
                                    Send another ›
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <input required name="name" placeholder="Name" aria-label="Name" className={FIELD} />
                                <input required type="email" name="email" placeholder="Email" aria-label="Email" className={FIELD} />
                                <textarea
                                    required
                                    name="message"
                                    rows={5}
                                    placeholder="Hi Viktor, I'd like to talk about…"
                                    aria-label="Message"
                                    className={`${FIELD} resize-none`}
                                />
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="text-[17px] font-medium cursor-pointer rounded-full p-4 bg-acc text-white transition-[scale,opacity] duration-300 ease-soft hover:scale-[1.015]"
                                    style={{ opacity: sending ? 0.6 : 1 }}
                                >
                                    {sending ? "Sending…" : "Send message"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </Section>
    )
}
