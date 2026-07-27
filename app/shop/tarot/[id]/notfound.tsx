import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "6rem 4vw", textAlign: "center" }}>
      <h1
        style={{
          fontFamily: "var(--font-fraunces)",
          fontStyle: "italic",
          fontSize: "2rem",
        }}
      >
        This card isn&apos;t here.
      </h1>
      <p style={{ color: "var(--fg-dim)", marginTop: "1rem" }}>
        <Link href="/shop/tarot" style={{ color: "var(--fg)" }}>
          Back to tarot
        </Link>
      </p>
    </div>
  );
}
