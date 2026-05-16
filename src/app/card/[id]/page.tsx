import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { BigButton } from "@/components/ui/BigButton";
import { FamilyCard } from "@/components/family-card/FamilyCard";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import { CARD_VOICE_SCRIPT } from "@/components/voice/useVoiceScript";
import { getCase } from "@/lib/demo-data";

interface CardPageProps {
  // Next.js 16: dynamic route `params` is a Promise and must be awaited.
  params: Promise<{ id: string }>;
}

export default async function CardPage({ params }: CardPageProps) {
  const { id } = await params;
  const caseData = await getCase(id);
  if (!caseData) {
    notFound();
  }

  const tipStyle: CSSProperties = {
    fontSize: "var(--text-body)",
    color: "var(--color-fg)",
    background: "var(--color-surface)",
    borderRadius: "var(--radius-card)",
    padding: "var(--space-3)",
    boxShadow: "var(--shadow-card)",
    lineHeight: 1.5,
    fontWeight: 600,
  };

  const tipLabelStyle: CSSProperties = {
    display: "block",
    fontSize: "var(--text-caption)",
    fontWeight: 800,
    letterSpacing: "0.08em",
    color: "var(--color-muted)",
    marginBottom: "var(--space-1)",
  };

  return (
    <PageShell title="告诉家人" backHref={`/result/${caseData.id}`} backLabel="返回结果">
      <section aria-label="给家人的提醒卡片">
        <FamilyCard caseData={caseData} />
      </section>

      <section style={tipStyle}>
        <span style={tipLabelStyle}>怎么发给家人</span>
        长按上面这张大图,点「保存图片」。
        然后打开微信,发到您和孩子的群里。
      </section>

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          marginTop: "var(--space-2)",
        }}
      >
        <BigButton as="a" href={`/result/${caseData.id}`} variant="secondary" fullWidth>
          回到结果页
        </BigButton>
        <BigButton as="a" href="/" variant="ghost" fullWidth>
          回到首页
        </BigButton>
      </section>

      <section style={{ marginTop: "var(--space-2)" }}>
        <AutoSpeech script={CARD_VOICE_SCRIPT} />
      </section>
    </PageShell>
  );
}
