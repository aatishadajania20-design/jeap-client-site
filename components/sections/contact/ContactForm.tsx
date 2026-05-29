"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FIELDS = [
  { id: "name", label: "Your name", type: "text", placeholder: "Jean Dupont" },
  { id: "email", label: "Email", type: "email", placeholder: "you@studio.com" },
  { id: "company", label: "House / Brand", type: "text", placeholder: "Maison —" },
] as const;

const BUDGETS = ["< 25k", "25–75k", "75–150k", "150k +"];

export default function ContactForm() {
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [budget, setBudget] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="py-10"
          >
            <span className="kicker">Transmission received</span>
            <p className="display mt-6 text-4xl leading-tight text-bone md:text-6xl">
              Thank you.<br />
              <span className="gilt italic">We'll be in touch shortly.</span>
            </p>
            <p className="mt-6 max-w-md text-ash">
              Every enquiry is read by a director, not a bot. Expect a considered
              reply within two working days.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-10"
          >
            {FIELDS.map((f) => (
              <div key={f.id} className="relative">
                <label
                  htmlFor={f.id}
                  className="mb-3 block text-xs uppercase tracking-[0.25em] text-ash"
                >
                  {f.label}
                </label>
                <input
                  id={f.id}
                  name={f.id}
                  type={f.type}
                  required
                  placeholder={f.placeholder}
                  onFocus={() => setFocused(f.id)}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent pb-4 font-display text-2xl text-bone placeholder:text-ash/40 focus:outline-none md:text-3xl"
                />
                <span className="relative block h-px w-full bg-white/15">
                  <motion.span
                    initial={false}
                    animate={{ scaleX: focused === f.id ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 origin-left bg-gold"
                  />
                </span>
              </div>
            ))}

            {/* Budget chips */}
            <div>
              <span className="mb-4 block text-xs uppercase tracking-[0.25em] text-ash">
                Indicative budget
              </span>
              <div className="flex flex-wrap gap-3">
                {BUDGETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    data-cursor="select"
                    onClick={() => setBudget(b)}
                    className={`rounded-full border px-5 py-2 text-sm transition-all duration-500 ${
                      budget === b
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-white/15 text-ash hover:border-white/40 hover:text-bone"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="brief"
                className="mb-3 block text-xs uppercase tracking-[0.25em] text-ash"
              >
                The brief
              </label>
              <textarea
                id="brief"
                name="brief"
                rows={3}
                onFocus={() => setFocused("brief")}
                onBlur={() => setFocused(null)}
                placeholder="Tell us what you want the world to feel…"
                className="w-full resize-none bg-transparent pb-4 font-display text-2xl text-bone placeholder:text-ash/40 focus:outline-none md:text-3xl"
              />
              <span className="relative block h-px w-full bg-white/15">
                <motion.span
                  initial={false}
                  animate={{ scaleX: focused === "brief" ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 origin-left bg-gold"
                />
              </span>
            </div>

            <button
              type="submit"
              data-cursor="send"
              className="group relative mt-4 flex w-fit items-center gap-4 overflow-hidden rounded-full border border-gold/40 px-10 py-5"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-700 ease-luxe group-hover:translate-x-0" />
              <span className="relative z-10 text-sm uppercase tracking-[0.25em] text-bone transition-colors duration-500 group-hover:text-noir">
                Send enquiry
              </span>
              <span className="relative z-10 text-gold transition-colors duration-500 group-hover:text-noir">
                ↗
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
