import { Suspense } from "react";
import type { CSSProperties } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ScanSpinner } from "@/components/scan/ScanSpinner";
import { ScanView } from "@/components/scan/ScanView";

/**
 * Server shell for /scan. Wraps the client <ScanView /> in <Suspense> because
 * Next 16 requires `useSearchParams()` to live inside a suspense boundary so
 * the route can still be prerendered as static HTML during build.
 */
function ScanFallback() {
  const heroStyle: CSSProperties = {
    fontSize: "var(--text-headline)",
    fontWeight: 800,
    color: "var(--color-ink)",
    textAlign: "center",
    marginTop: "var(--space-4)",
  };

  const subStyle: CSSProperties = {
    fontSize: "var(--text-body)",
    color: "var(--color-ink-soft)",
    textAlign: "center",
    marginTop: "var(--space-2)",
  };

  return (
    <PageShell>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "var(--space-5)",
        }}
      >
        <ScanSpinner accent="neutral" />
        <h1 style={heroStyle}>正在看…</h1>
        <p style={subStyle}>稍等几秒,我帮您看懂</p>
      </section>
    </PageShell>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<ScanFallback />}>
      <ScanView />
    </Suspense>
  );
}
