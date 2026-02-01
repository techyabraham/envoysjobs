import PageShell from "@/components/PageShell";

export default function Page() {
  return (
    <PageShell
      title="Reset your password"
      description="We will send a reset link to your email."
    >
      <div className="max-w-md space-y-4">
        <input className="input" placeholder="Email address" />
        <button className="cta w-full">Send reset link</button>
      </div>
    </PageShell>
  );
}
