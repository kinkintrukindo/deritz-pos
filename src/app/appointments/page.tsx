"use client";

import { useState } from "react";

export default function AppointmentsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", date: "", time: "", notes: "" });

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-6 py-28 text-center">
        <p className="text-xs tracking-wide-label uppercase text-graphite mb-3">
          Request Sent
        </p>
        <h1 className="text-3xl font-medium tracking-tight text-ink mb-4">See You Soon</h1>
        <p className="text-graphite">
          We&apos;ve received your fitting request for {form.date} at {form.time}.
          Our team will confirm by email shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-20">
      <p className="text-xs tracking-wide-label uppercase text-graphite mb-3 text-center">
        De Ritz Atelier
      </p>
      <h1 className="text-3xl font-medium tracking-tight text-ink mb-8 text-center">Book a Fitting</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-4"
      >
        <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Preferred date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
          <Field label="Preferred time" type="time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} />
        </div>
        <label className="block">
          <span className="text-xs tracking-wide-label uppercase text-graphite">
            Notes (optional)
          </span>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="mt-1.5 w-full border border-mist px-3 py-2 text-sm bg-paper focus:outline-none focus:border-ink"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-ink text-white text-xs tracking-wide-label uppercase py-3.5 hover:bg-gold transition-colors"
        >
          Request Fitting
        </button>
        <p className="text-xs text-graphite text-center">
          This is a placeholder request form — confirmation and calendar sync
          are a fast-follow.
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs tracking-wide-label uppercase text-graphite">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full border border-mist px-3 py-2.5 text-sm bg-paper focus:outline-none focus:border-ink"
      />
    </label>
  );
}
