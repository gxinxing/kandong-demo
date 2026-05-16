"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { BigButton } from "@/components/ui/BigButton";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import { ERROR_VOICE_SCRIPT } from "@/components/voice/useVoiceScript";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  // Next.js 16 renamed `reset` to `unstable_retry` for the file-based error
  // boundary. Calling it re-renders the segment from scratch.
  unstable_retry: () => void;
}

const captionStyle: CSSProperties = {
  fontSize: "var(--text-caption)",
  color: "var(--color-muted)",
  fontWeight: 700,
  letterSpacing: "0.08em",
};

const heroStyle: CSSProperties = {
  fontSize: "var(--text-hero)",
  marginTop: "var(--space-2)",
  lineHeight: 1.15,
};

const subStyle: CSSProperties = {
  marginTop: "var(--space-3)",
  fontSize: "var(--text-body)",
  color: "var(--color-muted)",
  lineHeight: 1.5,
};

const detailStyle: CSSProperties = {
  marginTop: "var(--space-3)",
  fontSize: "var(--text-caption)",
  color: "var(--color-muted)",
  background: "var(--color-surface)",
  borderRadius: "var(--radius-card)",
  padding: "var(--space-3)",
  wordBreak: "break-word",
};

export default function GlobalError({ error, unstable_retry }: ErrorBoundaryProps) {
  useEffect(() => {
    // Errors should be surfaced loudly during the demo so the 审核 Agent can
    // see what broke — production wiring would forward to Sentry or similar.
    console.error("Kandong page error", error);
  }, [error]);

  return (
    <PageShell>
      <section style={{ paddingTop: "var(--space-4)" }}>
        <p style={captionStyle}>出了点小问题</p>
        <h1 style={heroStyle}>没事,咱们重来一次</h1>
        <p style={subStyle}>
          点下面的大按钮,我们再试一遍就好。
        </p>
        {error.digest ? (
          <p style={detailStyle}>
            <span style={{ fontWeight: 800 }}>错误编号:</span> {error.digest}
          </p>
        ) : null}
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <BigButton onClick={() => unstable_retry()} fullWidth>
          重来一次
        </BigButton>
        <BigButton as="a" href="/" variant="secondary" fullWidth>
          回到首页
        </BigButton>
      </section>

      <section style={{ marginTop: "var(--space-2)" }}>
        <AutoSpeech script={ERROR_VOICE_SCRIPT} />
      </section>
    </PageShell>
  );
}
