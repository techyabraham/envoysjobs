import PageShell from "@/components/PageShell";
import HirerOnboardingForm from "@/components/onboarding/HirerOnboardingForm";

export default function Page() {
  return (
    <PageShell title="Hirer onboarding" description="Set up your hiring profile.">
      <HirerOnboardingForm />
    </PageShell>
  );
}
