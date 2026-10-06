"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Check, UserRound } from "lucide-react";
import { Button } from "../Button";
import { Input } from "../Input";

export interface HirerOnboardingData {
  hirerType: "individual" | "business";
  companyName: string;
  steward: "yes" | "no";
  stewardDepartment: string;
  stewardDepartmentOther: string;
  stewardMatricNumber: string;
  isRecruiter: "yes" | "no";
  recruiterIndustries: string[];
  recruiterSkillsInput: string;
}

interface HirerOnboardingProps {
  onNavigate?: (page: string) => void;
  onComplete?: (data: HirerOnboardingData) => void;
}

const industries = [
  "Technology", "Finance", "Healthcare", "Education", "Retail", "Manufacturing", "Construction",
  "Real Estate", "Hospitality", "Transportation", "Media & Entertainment", "Non-Profit", "Other"
];

export function HirerOnboarding({ onNavigate, onComplete }: HirerOnboardingProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<HirerOnboardingData>({
    hirerType: "individual",
    companyName: "",
    steward: "no",
    stewardDepartment: "",
    stewardDepartmentOther: "",
    stewardMatricNumber: "",
    isRecruiter: "no",
    recruiterIndustries: [],
    recruiterSkillsInput: ""
  });
  const update = <K extends keyof HirerOnboardingData>(key: K, value: HirerOnboardingData[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const toggleIndustry = (industry: string) => {
    setForm((current) => ({
      ...current,
      recruiterIndustries: current.recruiterIndustries.includes(industry)
        ? current.recruiterIndustries.filter((item) => item !== industry)
        : [...current.recruiterIndustries, industry]
    }));
  };
  const steps = ["Account type", "Your details", "Recruiting", "Review"];
  const canContinue = step === 1
    ? form.hirerType !== "business" || Boolean(form.companyName.trim())
    : step !== 2 || form.isRecruiter !== "yes" || form.recruiterIndustries.length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 flex items-start gap-2" aria-label={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((label, index) => (
          <div key={label} className="flex flex-1 flex-col gap-2">
            <div className={`h-1.5 rounded-full ${index <= step ? "bg-emerald-green" : "bg-border"}`} />
            <span className={`text-xs ${index === step ? "font-semibold text-foreground" : "text-foreground-tertiary"}`}>{label}</span>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold">What are you setting up?</h1>
              <p className="mt-1 text-sm text-foreground-secondary">Your member name and email are already saved.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["individual", "business"] as const).map((type) => {
                const selected = form.hirerType === type;
                const Icon = type === "individual" ? UserRound : Building2;
                return (
                  <button key={type} type="button" aria-pressed={selected} onClick={() => update("hirerType", type)} className={`min-h-40 rounded-2xl border p-5 text-left ${selected ? "border-emerald-green bg-emerald-green/5 ring-1 ring-emerald-green" : "border-border hover:border-emerald-green/50"}`}>
                    <Icon className="mb-4 h-7 w-7 text-emerald-green" />
                    <span className="block font-semibold">{type === "individual" ? "Individual or household" : "Business or organisation"}</span>
                    <span className="mt-1 block text-sm text-foreground-secondary">{type === "individual" ? "Find help for a project, service, or role." : "Hire people or source services for your organisation."}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">A little context</h2>
              <p className="mt-1 text-sm text-foreground-secondary">Only information used to set up your hiring profile is requested here.</p>
            </div>
            {form.hirerType === "business" && (
              <Input label="Business or organisation name" required placeholder="e.g. Envoys Community Centre" value={form.companyName} onChange={(event) => update("companyName", event.target.value)} />
            )}
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Do you serve as a steward at RCCG The Envoys? <span className="font-normal text-foreground-tertiary">Optional</span></legend>
              <div className="flex gap-3">
                {(["no", "yes"] as const).map((answer) => <label key={answer} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 ${form.steward === answer ? "border-deep-blue bg-deep-blue/5" : "border-border"}`}><input type="radio" name="hirer-steward" checked={form.steward === answer} onChange={() => update("steward", answer)} />{answer === "yes" ? "Yes" : "No"}</label>)}
              </div>
              {form.steward === "yes" && <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">Department
                  <select className="input" value={form.stewardDepartment} onChange={(event) => update("stewardDepartment", event.target.value)}><option value="">Choose a department</option>{["HOSPITALITY", "MEDIA", "PROTOCOL", "USHERING", "OTHER"].map((item) => <option key={item}>{item}</option>)}</select>
                </label>
                {form.stewardDepartment === "OTHER" && <Input label="Department name" value={form.stewardDepartmentOther} onChange={(event) => update("stewardDepartmentOther", event.target.value)} />}
                <Input label="Steward number" placeholder="e.g. RCCG-001" value={form.stewardMatricNumber} onChange={(event) => update("stewardMatricNumber", event.target.value)} />
              </div>}
            </fieldset>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Will you recruit for roles?</h2>
              <p className="mt-1 text-sm text-foreground-secondary">You can still hire for one-off projects or find services if you skip this.</p>
            </div>
            <div className="flex gap-3">
              {(["no", "yes"] as const).map((answer) => <label key={answer} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 ${form.isRecruiter === answer ? "border-deep-blue bg-deep-blue/5" : "border-border"}`}><input type="radio" name="is-recruiter" checked={form.isRecruiter === answer} onChange={() => update("isRecruiter", answer)} />{answer === "yes" ? "Yes, I recruit" : "Not right now"}</label>)}
            </div>
            {form.isRecruiter === "yes" && <>
              <div>
                <p className="mb-3 text-sm font-medium">Which industries are you recruiting for?</p>
                <div className="flex flex-wrap gap-2">{industries.map((industry) => <button key={industry} type="button" aria-pressed={form.recruiterIndustries.includes(industry)} onClick={() => toggleIndustry(industry)} className={`min-h-10 rounded-full border px-3 text-sm ${form.recruiterIndustries.includes(industry) ? "border-deep-blue bg-deep-blue text-white" : "border-border text-foreground-secondary hover:border-deep-blue"}`}>{industry}</button>)}</div>
                {!form.recruiterIndustries.length && <p className="mt-2 text-sm text-foreground-tertiary">Choose at least one industry to set up recruiting.</p>}
              </div>
              <Input label="Skills or roles you often recruit for (optional)" placeholder="e.g. Sales, Product Design, Plumbing" value={form.recruiterSkillsInput} onChange={(event) => update("recruiterSkillsInput", event.target.value)} />
            </>}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div><h2 className="text-2xl font-semibold">Your account is ready</h2><p className="mt-1 text-sm text-foreground-secondary">You can update these choices later from your dashboard.</p></div>
            <div className="space-y-3 rounded-xl bg-background-secondary p-4 text-sm">
              <p><span className="font-medium">Account:</span> {form.hirerType === "business" ? form.companyName : "Individual or household"}</p>
              <p><span className="font-medium">Recruiting:</span> {form.isRecruiter === "yes" ? form.recruiterIndustries.join(", ") || "Enabled; focus areas can be added later" : "Not enabled yet"}</p>
            </div>
            <p className="text-sm text-foreground-secondary">Business details and recruiting preferences can be completed later. You can also browse member services and deals from your dashboard.</p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
          <Button type="button" variant="ghost" onClick={step === 0 ? () => onNavigate?.("home") : () => setStep((current) => current - 1)}><ArrowLeft className="mr-2 h-4 w-4" />{step === 0 ? "Back" : "Previous"}</Button>
          {step === 3 ? <Button type="button" variant="success" onClick={() => onComplete?.(form)}>Go to dashboard<Check className="ml-2 h-4 w-4" /></Button> : <Button type="button" variant="primary" disabled={!canContinue} onClick={() => setStep((current) => Math.min(current + 1, 3))}>Continue<ArrowRight className="ml-2 h-4 w-4" /></Button>}
        </div>
      </section>
    </div>
  );
}
