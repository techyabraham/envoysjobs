"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const stewardDepartments = [
  "CHOIR",
  "MEDIA",
  "PROTOCOL",
  "USHERING",
  "CHILDREN",
  "OTHER"
];

const envoySchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().min(6),
  location: z.string().min(2),
  skills: z.string().min(2),
  steward: z.enum(["yes", "no"]),
  stewardDepartment: z.string().optional(),
  stewardMatricNumber: z.string().optional()
});

type EnvoyValues = z.infer<typeof envoySchema>;

export default function EnvoyOnboardingForm() {
  const [step, setStep] = useState(0);
  const form = useForm<EnvoyValues>({
    resolver: zodResolver(envoySchema),
    defaultValues: {
      steward: "no"
    }
  });

  const steward = form.watch("steward") === "yes";

  const next = async () => {
    const valid = await form.trigger();
    if (!valid) return;
    setStep((s) => Math.min(s + 1, 2));
  };

  return (
    <form className="space-y-6">
      {step === 0 && (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label>First name</label>
            <input className="input" {...form.register("firstName")} />
          </div>
          <div className="grid gap-2">
            <label>Last name</label>
            <input className="input" {...form.register("lastName")} />
          </div>
          <div className="grid gap-2">
            <label>Phone number</label>
            <input className="input" {...form.register("phone")} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label>Location</label>
            <input className="input" {...form.register("location")} />
          </div>
          <div className="grid gap-2">
            <label>Core skills</label>
            <input className="input" {...form.register("skills")} />
          </div>
          <div className="grid gap-2">
            <label>Are you a Steward at RCCG The Envoys?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" value="yes" {...form.register("steward")} /> Yes
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="no" {...form.register("steward")} /> No
              </label>
            </div>
          </div>
          {steward && (
            <div className="grid gap-4 animate-slide-up">
              <div className="grid gap-2">
                <label>Department</label>
                <select className="input" {...form.register("stewardDepartment")}>
                  {stewardDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label>Matric Number</label>
                <input className="input" {...form.register("stewardMatricNumber")} />
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-foreground-secondary">
            Review your details and complete onboarding.
          </p>
          <div className="bg-background-secondary rounded-xl p-4">
            <pre className="text-sm">{JSON.stringify(form.getValues(), null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="ghost">
            Back
          </button>
        )}
        {step < 2 ? (
          <button type="button" onClick={next} className="cta">
            Continue
          </button>
        ) : (
          <button type="submit" className="cta">
            Complete onboarding
          </button>
        )}
      </div>
    </form>
  );
}
