import PageShell from "@/components/PageShell";
import EnvoyOnboardingForm from "@/components/onboarding/EnvoyOnboardingForm";

export default function Page() {
  return (
    <PageShell title="Envoy onboarding" description="Tell us about your skills and availability.">
      <EnvoyOnboardingForm />
    </PageShell>
  );
}
