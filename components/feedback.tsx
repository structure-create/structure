"use client"

import { useState } from "react"

export function Feedback() {
  // State variables
  const [form, setForm] = useState({
    name: '',
    email: '',
    qualityRating: '3',
    easeRating: '3',
    speedRating: '3',
    comments: '',
  })
  const [formSent, setFormSent] = useState(false)

  // On change event listener
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // On submit event listener
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted:', form)

    const response = await fetch('https://formspree.io/f/xldjzyle', {
      method: "POST",
      headers: { 'Accept': 'application/json' },
      body: new FormData(e.target as HTMLFormElement),
    })

    if (response.ok) {
      setForm({
        name: '',
        email: '',
        qualityRating: '3',
        easeRating: '3',
        speedRating: '3',
        comments: '',
      })
      setFormSent(true)
    }
  }

  return (
    <section id="feedback" className="max-w-xl mx-auto px-6 py-16">
      <h2 className="text-center">Feedback</h2>
      <p className="text-center text-[#121A30] mb-10">
        We’d love your feedback!
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 flex flex-col items-center justify-center"
      >
        {/* Name + Email */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full">
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


        <p className="text-center text-gray-500 text-sm">
          (1 being the lowest, and 5 being the highest)
        </p>

        {/* Ratings */}
        <div className="space-y-4 w-full">
          <label className="block text-sm font-medium">
            Rate the quality of violation flags (1–5):
          </label>
          <select
            name="qualityRating"
            value={form.qualityRating}
            onChange={handleChange}
            className="w-full border-[0.4px] border-[var(--accent)] bg-[var(--card)] text-sm px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <label className="block text-sm font-medium">
            Rate the demo’s ease of use (1–5):
          </label>
          <select
            name="easeRating"
            value={form.easeRating}
            onChange={handleChange}
            className="w-full border-[0.4px] border-[var(--accent)] bg-[var(--card)] text-sm px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <label className="block text-sm font-medium">
            Rate the demo’s speed & performance (1–5):
          </label>
          <select
            name="speedRating"
            value={form.speedRating}
            onChange={handleChange}
            className="w-full border-[0.4px] border-[var(--accent)] bg-[var(--card)] text-sm px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Additional Comments */}
        <textarea
          name="comments"
          rows={5}
          placeholder="Any additional comments or features you would like to see"
          value={form.comments}
          onChange={handleChange}
          className="w-full border-[0.4px] border-[var(--accent)] bg-[var(--card)] text-sm px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[var(--accent)] text-[var(--background)] font-bold py-2 rounded-md hover:bg-[var(--hovaccent)] transition"
        >
         <p className="text-[24px] text-white">Send Feedback</p>
        </button>

        {/* Submission sent */}
        {formSent && (
          <div className="w-fit flex items-center justify-center space-x-2 bg-[#E5F7E9] text-[#073312] px-3 py-4 rounded-md">
            <img
              src="/svgs/check.svg"
              alt="Checkmark"
              className="h-4 w-auto pr-2"
            />
            <p>Feedback submitted!</p>
          </div>
        )}
      </form>
    </section>
  )
}
