import LinkButton from "../ui/link-button";

export default function Page() {
  return (
    <main className="landing-page">
      <h2>Welcome to dutycalc</h2>
      <LinkButton
        label="Generate return"
        type="accent"
        url="/guest-return/step1"
      />
    </main>
  );
}
