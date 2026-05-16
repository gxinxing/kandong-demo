import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { BigButton } from "@/components/ui/BigButton";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import {
  RESULT_VOICE_TEMPLATE,
  buildResultVoiceSlots,
  resolveVoiceScript,
} from "@/components/voice/useVoiceScript";
import { getCase } from "@/lib/demo-data";
import type { DemoCase } from "@/lib/demo-data";

interface ResultPageProps {
  // Next.js 16: dynamic route `params` is a Promise and must be awaited.
  params: Promise<{ id: string }>;
}

const LEVEL_ACCENT: Record<DemoCase["level"], string> = {
  red: "var(--color-red)",
  yellow: "var(--color-yellow)",
  green: "var(--color-green)",
};

const LEVEL_SOFT: Record<DemoCase["level"], string> = {
  red: "var(--color-red-soft)",
  yellow: "var(--color-yellow-soft)",
  green: "var(--color-green-soft)",
};

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  const caseData = await getCase(id);
  if (!caseData) {
    notFound();
  }

  const voiceScript = resolveVoiceScript(
    RESULT_VOICE_TEMPLATE,
    buildResultVoiceSlots({
      title: caseData.title,
      summary: caseData.summary,
      action: caseData.action,
      points: caseData.points,
    }),
  );

  const accent = LEVEL_ACCENT[caseData.level];
  const soft = LEVEL_SOFT[caseData.level];

  const summaryStyle: CSSProperties = {
    marginTop: "var(--space-3)",
    fontSize: "var(--text-hero)",
    lineHeight: 1.15,
    fontWeight: 800,
    color: "var(--color-fg)",
    textWrap: "balance",
  };

  const whyCalloutStyle: CSSProperties = {
    marginTop: "var(--space-3)",
    background: soft,
    color: "var(--color-fg)",
    border: `3px solid ${accent}`,
    borderRadius: "var(--radius-card)",
    padding: "var(--space-3)",
    fontSize: "var(--text-body)",
    fontWeight: 600,
    boxShadow: "var(--shadow-card)",
  };

  const whyLabelStyle: CSSProperties = {
    display: "block",
    fontSize: "var(--text-caption)",
    fontWeight: 800,
    letterSpacing: "0.08em",
    color: accent,
    marginBottom: "var(--space-1)",
  };

  const pointsListStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-3)",
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const pointItemStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--space-3)",
    background: "var(--color-surface)",
    borderRadius: "var(--radius-card)",
    padding: "var(--space-3)",
    boxShadow: "var(--shadow-card)",
    borderLeft: `8px solid ${accent}`,
  };

  const pointNumberStyle: CSSProperties = {
    flexShrink: 0,
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: accent,
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "var(--text-button)",
    fontWeight: 800,
  };

  const pointTextStyle: CSSProperties = {
    fontSize: "var(--text-body)",
    fontWeight: 600,
    lineHeight: 1.4,
    color: "var(--color-fg)",
    margin: 0,
  };

  const actionCardStyle: CSSProperties = {
    marginTop: "var(--space-4)",
    background: "var(--color-fg)",
    color: "var(--color-bg)",
    borderRadius: "var(--radius-card)",
    padding: "var(--space-4)",
    boxShadow: "var(--shadow-card)",
  };

  const actionLabelStyle: CSSProperties = {
    fontSize: "var(--text-caption)",
    fontWeight: 800,
    letterSpacing: "0.08em",
    opacity: 0.8,
  };

  const actionTextStyle: CSSProperties = {
    marginTop: "var(--space-2)",
    fontSize: "var(--text-title)",
    fontWeight: 800,
    lineHeight: 1.3,
  };

  const ctaRowStyle: CSSProperties = {
    marginTop: "var(--space-4)",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-3)",
  };

  return (
    <PageShell title={caseData.title} backHref="/" backLabel="返回首页">
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-3)",
        }}
      >
        <RiskBadge level={caseData.level} size="xl" />
      </section>

      <section>
        <p style={summaryStyle}>{caseData.summary}</p>
        <div style={whyCalloutStyle} aria-label="为什么">
          <span style={whyLabelStyle}>为什么</span>
          {caseData.why}
        </div>
      </section>

      <section aria-label="三件事您要记住">
        <h2
          style={{
            fontSize: "var(--text-title)",
            fontWeight: 800,
            marginBottom: "var(--space-3)",
          }}
        >
          您要记住这三件事
        </h2>
        <ol style={pointsListStyle}>
          {caseData.points.map((point, i) => (
            <li key={i} style={pointItemStyle}>
              <span aria-hidden="true" style={pointNumberStyle}>
                {i + 1}
              </span>
              <p style={pointTextStyle}>{point}</p>
            </li>
          ))}
        </ol>
      </section>

      <section style={actionCardStyle} aria-label="现在该怎么办">
        <span style={actionLabelStyle}>现在该怎么办</span>
        <p style={actionTextStyle}>{caseData.action}</p>
      </section>

      <section style={ctaRowStyle}>
        <BigButton as="a" href={`/card/${caseData.id}`} fullWidth>
          告诉家人 →
        </BigButton>
        <BigButton as="a" href="/" variant="secondary" fullWidth>
          再看一遍
        </BigButton>
      </section>

      <section style={{ marginTop: "var(--space-2)" }}>
        <AutoSpeech script={voiceScript} />
      </section>
    </PageShell>
  );
}
