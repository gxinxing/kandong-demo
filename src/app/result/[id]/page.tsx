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

const HANGING_NUMERAL = ["一", "二", "三", "四", "五"] as const;

const LEVEL_INK: Record<DemoCase["level"], string> = {
  red: "var(--color-red)",
  yellow: "#8a5a00",
  green: "var(--color-green)",
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

  const ink = LEVEL_INK[caseData.level];

  // Verdict — giant Fraunces summary, no rounded frame. Sits on page atmosphere
  // between the risk poster above and the ruled list below.
  const verdictStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(40px, 11vw, 56px)",
    lineHeight: 1.02,
    fontWeight: 400,
    letterSpacing: "-0.025em",
    color: "var(--color-ink)",
    textWrap: "balance",
    margin: 0,
  };

  // Why callout — hair-rule aside, no tinted rounded box. Title set in the
  // level's color so the chromatic signal persists without plastic surfaces.
  const whyAsideStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
    paddingTop: "var(--space-4)",
    borderTop: "1px solid var(--color-border)",
  };

  const whyLabelStyle: CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: ink,
  };

  const whyBodyStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontStyle: "italic",
    fontSize: "clamp(20px, 5.5vw, 26px)",
    fontWeight: 400,
    lineHeight: 1.32,
    color: "var(--color-fg)",
    margin: 0,
  };

  // Action band — full-bleed sky field, no rounded shadow box. Uses a top ink
  // rule + eyebrow + Fraunces directive. Reads like a back-cover broadside.
  const actionWrapStyle: CSSProperties = {
    position: "relative",
    background: "var(--color-sky)",
    color: "var(--color-sky-ink)",
    padding: "var(--space-6) var(--space-5)",
    marginInline: "calc(var(--space-5) * -1)",
    borderTop: "2px solid var(--color-ink)",
    borderBottom: "1px solid var(--color-ink)",
  };

  const actionEyebrowStyle: CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--color-sky-ink)",
    display: "block",
    marginBottom: "var(--space-3)",
  };

  const actionDirectiveStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(28px, 8vw, 38px)",
    fontWeight: 400,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    color: "var(--color-ink)",
    margin: 0,
    textWrap: "balance",
  };

  const ISSUE_LABEL: Record<string, string> = {
    "demo-black": "No.001",
    "demo-gray": "No.002",
    "demo-white": "No.003",
  };
  const issueLabel = ISSUE_LABEL[caseData.id] ?? "No.000";

  return (
    <PageShell
      masthead={{ kicker: "KANDONG · 反诈助手", issue: issueLabel, date: formatToday() }}
      title={caseData.title}
      backHref="/"
      backLabel="返回首页"
    >
      {/* Risk poster — typographic watermark, full-bleed rule */}
      <section aria-label="风险等级">
        <RiskBadge level={caseData.level} size="poster" />
      </section>

      {/* Verdict + why */}
      <section
        aria-label="一句话总结"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
        }}
      >
        <span className="kd-section-eyebrow">一句话 · The Verdict</span>
        <h2 style={verdictStyle}>{caseData.summary}</h2>
        <aside style={whyAsideStyle} aria-label="为什么">
          <span style={whyLabelStyle}>为什么 · Why</span>
          <p style={whyBodyStyle}>{caseData.why}</p>
        </aside>
      </section>

      {/* Three rules — ruled list, hanging Fraunces numerals */}
      <section
        aria-label="三件事您要记住"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <span className="kd-section-eyebrow">您要记住 · Three Rules</span>
        <ol className="kd-ruled-list" aria-label="三条原则">
          {caseData.points.map((point, i) => (
            <li key={i}>
              <span aria-hidden="true" className="kd-numeral">
                {HANGING_NUMERAL[i] ?? String(i + 1)}
                <span className="kd-numeral-sub">
                  RULE · {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(20px, 5.5vw, 26px)",
                  fontWeight: 400,
                  lineHeight: 1.32,
                  color: "var(--color-ink)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {point}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Action — full-bleed sky broadside */}
      <section style={actionWrapStyle} aria-label="现在该怎么办">
        <span style={actionEyebrowStyle}>现在该怎么办 · Next Step</span>
        <p style={actionDirectiveStyle}>{caseData.action}</p>
      </section>

      {/* CTAs */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
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
