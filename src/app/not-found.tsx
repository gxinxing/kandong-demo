import type { CSSProperties } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { BigButton } from "@/components/ui/BigButton";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import { NOT_FOUND_VOICE_SCRIPT } from "@/components/voice/useVoiceScript";

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

export default function NotFound() {
  return (
    <PageShell>
      <section style={{ paddingTop: "var(--space-4)" }}>
        <p style={captionStyle}>404</p>
        <h1 style={heroStyle}>没找到这一页</h1>
        <p style={subStyle}>
          可能是链接旧了。点下面的大按钮,我带您回到首页。
        </p>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <BigButton as="a" href="/" fullWidth>
          回到首页
        </BigButton>
      </section>

      <section style={{ marginTop: "var(--space-2)" }}>
        <AutoSpeech script={NOT_FOUND_VOICE_SCRIPT} />
      </section>
    </PageShell>
  );
}
