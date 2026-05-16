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
  params: Promise<{ id: string }>;
}

const LEVEL_ACCENT: Record<DemoCase["level"], string> = {
  red: "var(--color-red)",
  yellow: "var(--color-yellow)",
  green: "var(--color-green)",
};

const LEVEL_INK: Record<DemoCase["level"], string> = {
  red: "var(--color-red-ink)",
  yellow: "var(--color-yellow-ink)",
  green: "var(--color-green-ink)",
};

const LEVEL_ON_ACCENT: Record<DemoCase["level"], string> = {
  red: "#fff5f0",
  yellow: "#1a1000",
  green: "#f0fff5",
};

const HANGING_NUMERAL = ["一", "二", "三", "四", "五"] as const;

const LEVEL_EYEBROW: Record<DemoCase["level"], string> = {
  red: "RED ALERT · 高风险",
  yellow: "CAUTION · 要警惕",
  green: "OK · 安全",
};

function formatToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}·${m}·${day}`;
}

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
  const ink = LEVEL_INK[caseData.level];
  const onAccent = LEVEL_ON_ACCENT[caseData.level];

  const eyebrowStyle: CSSProperties = {
    fontSize: "var(--text-eyebrow)",
    fontWeight: 800,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: ink,
  };

  const headlineStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-hero)",
    lineHeight: 0.95,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    color: "var(--color-fg)",
    textWrap: "balance",
    margin: 0,
  };

  const whyCalloutStyle: CSSProperties = {
    background: "var(--color-paper)",
    color: "var(--color-fg)",
    border: "var(--rule-medium) solid var(--color-rule)",
    borderLeft: `12px solid ${accent}`,
    padding: "var(--space-3)",
    fontSize: "var(--text-body)",
    fontWeight: 600,
    lineHeight: 1.45,
    boxShadow: "var(--shadow-card)",
  };

  const whyLabelStyle: CSSProperties = {
    display: "block",
    fontSize: "var(--text-eyebrow)",
    fontWeight: 800,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: ink,
    marginBottom: "var(--space-2)",
  };

  const pointsListStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    listStyle: "none",
    margin: 0,
    padding: 0,
  };

  const pointItemStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "var(--space-3)",
    alignItems: "start",
    padding: "var(--space-3) 0",
    borderTop: "var(--rule-hair) solid var(--color-rule)",
  };

  const pointNumeralStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-numeral)",
    fontWeight: 900,
    lineHeight: 0.85,
    color: accent,
    letterSpacing: "-0.02em",
    minWidth: "1.2em",
  };

  const pointTextStyle: CSSProperties = {
    fontSize: "var(--text-body)",
    fontWeight: 600,
    lineHeight: 1.45,
    color: "var(--color-fg)",
    margin: 0,
    paddingTop: "0.4em",
  };

  const actionBandStyle: CSSProperties = {
    background: "var(--color-fg)",
    color: "var(--color-bg)",
    padding: "var(--space-4) var(--space-3)",
    boxShadow: "0 1px 0 var(--color-rule), 6px 6px 0 var(--color-rule)",
    border: "var(--rule-medium) solid var(--color-rule)",
  };

  const actionLabelStyle: CSSProperties = {
    fontSize: "var(--text-eyebrow)",
    fontWeight: 800,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    opacity: 0.85,
  };

  const actionTextStyle: CSSProperties = {
    marginTop: "var(--space-2)",
    fontFamily: "var(--font-display)",
    fontSize: "var(--text-title)",
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
  };

  const ctaRowStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  };

  const issueLabel = `No.${caseData.id.slice(-3).padStart(3, "0").toUpperCase()}`;

  return (
    <PageShell
      masthead={{ kicker: "KANDONG · 反诈助手", issue: issueLabel, date: formatToday() }}
      title={caseData.title}
      backHref="/"
      backLabel="返回首页"
    >
      {/* Risk poster block */}
      <section aria-label="风险等级">
        <p
          style={{
            fontSize: "var(--text-eyebrow)",
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--color-muted)",
            marginBottom: "var(--space-2)",
          }}
        >
          {LEVEL_EYEBROW[caseData.level]}
        </p>
        <RiskBadge level={caseData.level} size="poster" />
      </section>

      {/* Headline + dropcap callout */}
      <section>
        <p style={eyebrowStyle}>一句话 · the verdict</p>
        <h2
          style={{
            ...headlineStyle,
            marginTop: "var(--space-2)",
          }}
        >
          {caseData.summary}
        </h2>
        <hr
          aria-hidden="true"
          style={{
            border: 0,
            height: "var(--rule-hair)",
            background: "var(--color-rule)",
            margin: "var(--space-3) 0",
          }}
        />
        <aside style={whyCalloutStyle} aria-label="为什么">
          <span style={whyLabelStyle}>为什么</span>
          <p
            className="kd-dropcap"
            style={{
              margin: 0,
              fontSize: "var(--text-body)",
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            {caseData.why}
          </p>
        </aside>
      </section>

      {/* Three numbered points */}
      <section aria-label="三件事您要记住">
        <p style={{ ...eyebrowStyle, color: "var(--color-muted)" }}>
          您要记住 · three rules
        </p>
        <h3
          style={{
            ...headlineStyle,
            fontSize: "var(--text-title)",
            marginTop: "var(--space-2)",
            marginBottom: "var(--space-2)",
          }}
        >
          记住这三件事
        </h3>
        <ol style={pointsListStyle}>
          {caseData.points.map((point, i) => (
            <li
              key={i}
              style={{
                ...pointItemStyle,
                borderBottom:
                  i === caseData.points.length - 1
                    ? "var(--rule-hair) solid var(--color-rule)"
                    : undefined,
              }}
            >
              <span aria-hidden="true" style={pointNumeralStyle}>
                {HANGING_NUMERAL[i] ?? String(i + 1)}
              </span>
              <p style={pointTextStyle}>{point}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Action band — black */}
      <section style={actionBandStyle} aria-label="现在该怎么办">
        <span style={actionLabelStyle}>现在该怎么办 · next step</span>
        <p style={actionTextStyle}>
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              background: accent,
              color: onAccent,
              padding: "0 0.25em",
              marginRight: "0.2em",
              fontFamily: "var(--font-display)",
            }}
          >
            ▶
          </span>
          {caseData.action}
        </p>
      </section>

      {/* CTAs */}
      <section style={ctaRowStyle}>
        <BigButton as="a" href={`/card/${caseData.id}`}>
          告诉家人
        </BigButton>
        <BigButton as="a" href="/" variant="secondary">
          再看一遍
        </BigButton>
      </section>

      <section style={{ marginTop: "var(--space-2)" }}>
        <AutoSpeech script={voiceScript} />
      </section>
    </PageShell>
  );
}
