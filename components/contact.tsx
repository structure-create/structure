"use client"

import { useState } from "react"

export function Contact() {
    // State variables
    const [form, setForm] = useState({
        name: '',
        email: '',
        org: '',
        message: '',
    })
    const [formSent, setFormSent] = useState(false)

    // On change event listener
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // On submit event listener
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Submitted:', form)

        // Check external form response, set status 
        const response = await fetch('https://formspree.io/f/xldjzyle', {
            method: "POST",
            headers: {'Accept': 'application/json'},
            body: new FormData(e.target as HTMLFormElement),
        })

        if (response.ok) {
            // Reset form
            setForm({name: '', email: '', org: '', message: ''})
            setFormSent(true)
        }
    }

    return (
        <section id="contact" className="max-w-xl mx-auto px-6 py-16">
            <h2 className="text-center">Contact Us</h2>
            <p className="text-center text-[#121A30] mb-10">We’d love to hear from you!</p>

            {/* <form onSubmit={handleSubmit} className="space-y-6"> */}
            {/* Form with FormSpree endpoint */}
            <form
                // action="https://formspree.io/f/xldjzyle" 
                // method="POST"
                // target="_self"
                onSubmit={handleSubmit}
                className="space-y-6 flex flex-col items-center justify-center"
            >
                {/* Row: Full Name + Email */}
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <input
                    required
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="flex-1 border-[0.4px] border-[var(--accent)] bg-[var(--card)] text-sm px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <input
                    required
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="flex-1 border-[0.4px] border-[var(--accent)] bg-[var(--card)] text-sm px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                </div>

                {/* Organization */}
                <input
                    type="text"
                    name="org"
                    placeholder="Organization"
                    value={form.org}
                    onChange={handleChange}
                    className="w-full border-[0.4px] border-[var(--accent)] bg-[var(--card)] text-sm px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />

                {/* Message */}
                <textarea
                    required
                    name="message"
                    rows={5}
                    placeholder="Message"
                    value={form.message}
                    onChange={handleChange}
                    className="w-full border-[0.4px] border-[var(--accent)] bg-[var(--card)] text-sm px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />

                {/* Submit */}
                <button
                type="submit"
                className="w-full bg-[var(--accent)] text-[var(--background)] font-bold py-2 rounded-md hover:bg-[var(--hovaccent)] transition"
                >
                <p className="text-[24px]">Send</p>
                </button>

                {/* Submission sent */}
                {formSent && ( 
                    <div className='w-fit flex items-center justify-center space-x-2 bg-[#E5F7E9] text-[#073312] px-3 py-4 rounded-md'>
                        <img
                            src='/svgs/check.svg'
                            alt="Checkmark"
                            className='h-4 w-auto pr-2'
                        />
                        <p>Form Submitted!</p>
                    </div>
                )}
            </form>
        </section>
    )
}