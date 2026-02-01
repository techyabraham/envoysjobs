import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <PageShell
      title="Verify your phone"
      description="Enter the 6-digit code we sent to confirm your account."
    >
      <div className="max-w-md space-y-4">
        <input className="input" placeholder="Enter OTP" />
        <button className="cta w-full">Verify</button>
      </div>
    </PageShell>
  );
}
