import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { BangBangAvatar } from "@/components/bangbang/BangBangAvatar";
import { BubbleStream, type BubbleItem } from "@/components/bubble/BubbleStream";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { BigButton } from "@/components/ui/BigButton";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import {
  RESULT_VOICE_TEMPLATE,
  buildResultVoiceSlots,
  resolveVoiceScript,
} from "@/components/voice/useVoiceScript";
import { getCase } from "@/lib/demo-data";
import type { BubbleTone } from "@/components/bubble/Bubble";

interface ResultPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ scene?: string }>;
}

const SCAM_SCENES = new Set<string>(["微信引流", "假公检法"]);

export default async function ResultPage({
  params,
  searchParams,
}: ResultPageProps) {
  const { id } = await params;
  const { scene } = await searchParams;
  const demo = await getCase(id);
  if (!demo) {
    notFound();
  }

  const showRisk = typeof scene === "string" && SCAM_SCENES.has(scene);
  const isRedScam = showRisk && demo.level === "red";

  const voiceScript = resolveVoiceScript(
    RESULT_VOICE_TEMPLATE,
    buildResultVoiceSlots({
      title: demo.title,
      summary: demo.summary,
      action: demo.action,
      points: demo.points,
    }),
  );

  const verdictTone: BubbleTone =
    demo.level === "red"
      ? "danger"
      : demo.level === "yellow"
        ? "warn"
        : "emphasis";

  const items: BubbleItem[] = [
    {
      key: "summary",
      tone: verdictTone,
      avatar: true,
      speak: demo.summary,
      content: demo.summary,
    },
    ...demo.points.map((point, i) => ({
      key: `point-${i}`,
      tone: "default" as const,
      speak: point,
      content: point,
    })),
    {
      key: "action",
      tone: "strong" as const,
      speak: demo.action,
      content: demo.action,
    },
  ];

  return (
    <PageShell title="看完了" backHref="/" backLabel="返回首页">
      {showRisk ? (
        <section aria-label="风险等级">
          <RiskBadge level={demo.level} size="xl" />
        </section>
      ) : null}

      <section
        aria-label="帮帮告诉您"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
        }}
      >
        <BangBangAvatar
          size="md"
          mood={demo.level === "red" ? "reassure" : "idle"}
        />
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-title)",
            fontWeight: 800,
            color: "var(--color-ink)",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          帮帮告诉您
        </h2>
      </section>

      <BubbleStream items={items} />

      <section
        aria-label="下一步"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          marginTop: "var(--space-3)",
        }}
      >
        {isRedScam ? (
          <BigButton as="a" href="/chaperone" variant="danger" size="xl">
            先别动，叫民警
          </BigButton>
        ) : null}
        <BigButton as="a" href={`/card/${demo.id}`} variant="primary" size="lg">
          告诉家人
        </BigButton>
        <BigButton as="a" href="/" variant="ghost" size="lg">
          再问帮帮
        </BigButton>
      </section>

      <section style={{ marginTop: "var(--space-2)" }}>
        <AutoSpeech script={voiceScript} />
      </section>
    </PageShell>
  );
}
