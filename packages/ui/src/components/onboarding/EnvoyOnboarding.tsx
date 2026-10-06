"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Check, MapPin, Sparkles, User } from "lucide-react";
import { Button } from "../Button";
import { Input } from "../Input";

export type MemberGoal = "FIND_WORK" | "FIND_GIGS" | "OFFER_SERVICES" | "SHARE_DEALS";

export interface EnvoyOnboardingData {
  phone: string;
  steward: "yes" | "no";
  stewardDepartment: string;
  stewardDepartmentOther: string;
  stewardMatricNumber: string;
  memberGoals: MemberGoal[];
  selectedSkills: string[];
  state: string;
  city: string;
  availabilityType: "full-time" | "part-time" | "freelance" | "any";
}

interface EnvoyOnboardingProps {
  onNavigate?: (page: string) => void;
  onComplete?: (data: EnvoyOnboardingData) => void;
  initialData?: Partial<Pick<EnvoyOnboardingData, "phone">>;
}

type Step = "about" | "focus" | "location" | "review";

const goals: { id: MemberGoal; title: string; description: string }[] = [
  { id: "FIND_WORK", title: "Find jobs", description: "Explore full-time and part-time roles." },
  { id: "FIND_GIGS", title: "Find gigs", description: "Take on short projects and flexible work." },
  { id: "OFFER_SERVICES", title: "Offer services", description: "Show members the work you do." },
  { id: "SHARE_DEALS", title: "Share deals", description: "Let the community know about your offers." }
];

const skills = [
  "Web Development", "Mobile Development", "UI/UX Design", "Graphic Design", "Content Writing",
  "Digital Marketing", "Photography", "Videography", "Accounting", "Bookkeeping",
  "Project Management", "Consulting", "Teaching & Tutoring", "Catering", "Event Planning",
  "Tailoring & Fashion", "Barbering & Hair Styling", "Makeup Artistry", "Baking & Pastry",
  "Plumbing", "Electrical Work", "Carpentry", "Painting", "Welding", "Masonry",
  "Auto Repair", "Cleaning", "Laundry", "Landscaping", "Driving & Logistics", "Other"
];

const steps: { id: Step; label: string }[] = [
  { id: "about", label: "About you" },
  { id: "focus", label: "Your focus" },
  { id: "location", label: "Your area" },
  { id: "review", label: "Review" }
];

export function EnvoyOnboarding({ onNavigate, onComplete, initialData }: EnvoyOnboardingProps) {
  const [step, setStep] = useState<Step>("about");
  const [form, setForm] = useState<EnvoyOnboardingData>({
    phone: initialData?.phone ?? "",
    steward: "no",
    stewardDepartment: "",
    stewardDepartmentOther: "",
    stewardMatricNumber: "",
    memberGoals: [],
    selectedSkills: [],
    state: "",
    city: "",
    availabilityType: "any"
  });
  const stepIndex = steps.findIndex((item) => item.id === step);
  const update = <K extends keyof EnvoyOnboardingData>(key: K, value: EnvoyOnboardingData[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const toggle = <T extends string>(key: "memberGoals" | "selectedSkills", value: T) => {
    setForm((current) => {
      const values = current[key] as T[];
      const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
      return { ...current, [key]: next };
    });
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
          {steps.map((item, index) => (
            <div key={item.id} className="flex flex-1 flex-col gap-2">
              <div className={`h-1.5 rounded-full ${index <= stepIndex ? "bg-deep-blue" : "bg-border"}`} />
              <span className={`text-xs ${index === stepIndex ? "font-semibold text-foreground" : "text-foreground-tertiary"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
        {step === "about" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-deep-blue/10 text-deep-blue"><User /></span>
              <div>
                <h1 className="text-2xl font-semibold">A few details about you</h1>
                <p className="mt-1 text-sm text-foreground-secondary">Your name and email are already saved. Add a phone number if you want members to reach you.</p>
              </div>
            </div>
            <Input label="Phone number (optional)" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Do you serve as a steward at RCCG The Envoys? <span className="font-normal text-foreground-tertiary">Optional</span></legend>
              <div className="flex flex-wrap gap-3">
                {(["no", "yes"] as const).map((answer) => (
                  <label key={answer} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 ${form.steward === answer ? "border-deep-blue bg-deep-blue/5" : "border-border"}`}>
                    <input type="radio" name="steward" value={answer} checked={form.steward === answer} onChange={() => update("steward", answer)} />
                    {answer === "yes" ? "Yes" : "No"}
                  </label>
                ))}
              </div>
              {form.steward === "yes" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">Department
                    <select className="input" value={form.stewardDepartment} onChange={(event) => update("stewardDepartment", event.target.value)}>
                      <option value="">Choose a department</option>
                      {["CHOIR", "MEDIA", "PROTOCOL", "USHERING", "CHILDREN", "OTHER"].map((department) => <option key={department}>{department}</option>)}
                    </select>
                  </label>
                  {form.stewardDepartment === "OTHER" && <Input label="Department name" value={form.stewardDepartmentOther} onChange={(event) => update("stewardDepartmentOther", event.target.value)} />}
                  <Input label="Steward number" placeholder="e.g. RCCG-001" value={form.stewardMatricNumber} onChange={(event) => update("stewardMatricNumber", event.target.value)} />
                </div>
              )}
            </fieldset>
          </div>
        )}

        {step === "focus" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-green/10 text-emerald-green"><Sparkles /></span>
              <div>
                <h2 className="text-2xl font-semibold">How would you like to take part?</h2>
                <p className="mt-1 text-sm text-foreground-secondary">Choose any that fit. You can change these later from your profile.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {goals.map((goal) => {
                const selected = form.memberGoals.includes(goal.id);
                return (
                  <button key={goal.id} type="button" aria-pressed={selected} onClick={() => toggle("memberGoals", goal.id)} className={`min-h-24 rounded-xl border p-4 text-left transition-colors ${selected ? "border-deep-blue bg-deep-blue/5" : "border-border hover:border-deep-blue/50"}`}>
                    <span className="flex items-center justify-between font-semibold">{goal.title}{selected && <Check className="h-4 w-4 text-deep-blue" />}</span>
                    <span className="mt-1 block text-sm text-foreground-secondary">{goal.description}</span>
                  </button>
                );
              })}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Skills, trades, and services you offer <span className="font-normal text-foreground-tertiary">Optional, choose any</span></label>
              <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto rounded-xl border border-border p-3">
                {skills.map((skill) => {
                  const selected = form.selectedSkills.includes(skill);
                  return <button key={skill} type="button" aria-pressed={selected} onClick={() => toggle("selectedSkills", skill)} className={`min-h-9 rounded-full border px-3 py-1.5 text-sm ${selected ? "border-deep-blue bg-deep-blue text-white" : "border-border text-foreground-secondary hover:border-deep-blue"}`}>{skill}</button>;
                })}
              </div>
            </div>
          </div>
        )}

        {step === "location" && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-soft-gold/15 text-soft-gold"><MapPin /></span>
              <div>
                <h2 className="text-2xl font-semibold">Where and when?</h2>
                <p className="mt-1 text-sm text-foreground-secondary">Optional details help members find opportunities and services nearby.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="City (optional)" placeholder="e.g. Lagos" value={form.city} onChange={(event) => update("city", event.target.value)} />
              <Input label="State or region (optional)" placeholder="e.g. Lagos State" value={form.state} onChange={(event) => update("state", event.target.value)} />
            </div>
            <label className="grid gap-2 text-sm font-medium">Availability
              <select className="input" value={form.availabilityType} onChange={(event) => update("availabilityType", event.target.value as EnvoyOnboardingData["availabilityType"])}>
                <option value="any">Flexible / not sure yet</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="freelance">Freelance / project based</option>
              </select>
            </label>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">You’re ready to go</h2>
              <p className="mt-1 text-sm text-foreground-secondary">You can add a bio, work samples, and more from your dashboard whenever you’re ready.</p>
            </div>
            <div className="space-y-4 rounded-xl bg-background-secondary p-4">
              <div><p className="text-xs font-semibold uppercase text-foreground-tertiary">Your focus</p><p className="mt-1">{form.memberGoals.length ? goals.filter((goal) => form.memberGoals.includes(goal.id)).map((goal) => goal.title).join(" · ") : "I’ll decide later"}</p></div>
              <div><p className="text-xs font-semibold uppercase text-foreground-tertiary">Skills and services</p><p className="mt-1">{form.selectedSkills.length ? form.selectedSkills.join(" · ") : "Not added yet"}</p></div>
              <div><p className="text-xs font-semibold uppercase text-foreground-tertiary">Location</p><p className="mt-1">{[form.city, form.state].filter(Boolean).join(", ") || "Not added yet"}</p></div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
          <Button type="button" variant="ghost" onClick={stepIndex === 0 ? () => onNavigate?.("home") : () => setStep(steps[stepIndex - 1].id)}>
            <ArrowLeft className="mr-2 h-4 w-4" />{stepIndex === 0 ? "Back" : "Previous"}
          </Button>
          {step === "review" ? (
            <Button type="button" variant="success" onClick={() => onComplete?.(form)}>Go to dashboard<Check className="ml-2 h-4 w-4" /></Button>
          ) : (
            <Button type="button" variant="primary" onClick={() => setStep(steps[stepIndex + 1].id)}>Continue<ArrowRight className="ml-2 h-4 w-4" /></Button>
          )}
        </div>
      </section>
    </div>
  );
}
