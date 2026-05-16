import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { BigButton } from "@/components/ui/BigButton";
import { FamilyCard } from "@/components/family-card/FamilyCard";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import { CARD_VOICE_SCRIPT } from "@/components/voice/useVoiceScript";
import { getCase } from "@/lib/demo-data";

interface CardPageProps {
  params: Promise<{ id: string }>;
}

const STEP_NUMERAL = ["一", "二", "三"] as const;
const STEP_LABEL: readonly { kicker: string; body: string }[] = [
  { kicker: "STEP · 01", body: "长按上面这张大图。" },
  { kicker: "STEP · 02", body: "点「保存图片」。" },
  { kicker: "STEP · 03", body: "打开微信,发到家人群里。" },
];

function formatToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}·${m}·${day}`;
}

export default async function CardPage({ params }: CardPageProps) {
  const { id } = await params;
  const caseData = await getCase(id);
  if (!caseData) {
    notFound();
  }

  const stepHeadStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(32px, 9vw, 44px)",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: 1.05,
    margin: 0,
    color: "var(--color-ink)",
  };

  return (
    <PageShell
      masthead={{ kicker: "KANDONG · 发布卡片", issue: "BROADSIDE", date: formatToday() }}
      title="告诉家人"
      backHref={`/result/${caseData.id}`}
      backLabel="返回结果"
    >
      <section
        aria-label="给家人的提醒卡片"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <span className="kd-section-eyebrow">告诉家人 · Share With Family</span>
        <FamilyCard caseData={caseData} />
      </section>

      <section
        aria-label="使用提示"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <span className="kd-section-eyebrow">怎么发 · How To Send</span>
        <h2 style={stepHeadStyle}>三步搞定</h2>
        <ol className="kd-ruled-list" aria-label="发送步骤">
          {STEP_LABEL.map((step, i) => (
            <li key={i}>
              <span aria-hidden="true" className="kd-numeral">
                {STEP_NUMERAL[i]}
                <span className="kd-numeral-sub">{step.kicker}</span>
              </span>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(20px, 5.5vw, 26px)",
                  fontWeight: 400,
                  lineHeight: 1.32,
                  letterSpacing: "-0.01em",
                  color: "var(--color-ink)",
                  margin: 0,
                }}
              >
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <BigButton as="a" href={`/result/${caseData.id}`} variant="secondary">
          回到结果页
        </BigButton>
        <BigButton as="a" href="/" variant="ghost" trailingArrow={false}>
          回到首页
        </BigButton>
      </section>

      <section style={{ marginTop: "var(--space-2)" }}>
        <AutoSpeech script={CARD_VOICE_SCRIPT} />
      </section>
    </PageShell>
  );
}
