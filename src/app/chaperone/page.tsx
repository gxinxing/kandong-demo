import { PageShell } from "@/components/layout/PageShell";
import { BangBangAvatar } from "@/components/bangbang/BangBangAvatar";
import { BubbleStream, type BubbleItem } from "@/components/bubble/BubbleStream";
import { BigButton } from "@/components/ui/BigButton";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import { CHAPERONE_VOICE_SCRIPT } from "@/components/voice/useVoiceScript";

const items: BubbleItem[] = [
  {
    key: "reassure",
    tone: "strong",
    avatar: true,
    speak: "别急，帮帮陪您。",
    content: "别急，帮帮陪您。",
  },
  {
    key: "dont-trust",
    tone: "default",
    speak: "这种电话，不用相信。",
    content: "这种电话，不用相信。",
  },
  {
    key: "call",
    tone: "default",
    speak: "咱们一起拨96110，让民警帮咱们看看。",
    content: "咱们一起拨 96110，让民警帮咱们看看。",
  },
];

export default function ChaperonePage() {
  return (
    <PageShell title="叫民警" backHref="/" backLabel="返回首页">
      <section
        aria-label="帮帮"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "var(--space-4)",
        }}
      >
        <BangBangAvatar size="lg" mood="reassure" />
      </section>

      <BubbleStream items={items} />

      <section
        aria-label="拨打反诈专线"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          marginTop: "var(--space-4)",
        }}
      >
        <BigButton as="a" href="tel:96110" variant="danger" size="xl">
          拨打 96110
        </BigButton>
        <BigButton as="a" href="/" variant="ghost" size="lg">
          我先不打
        </BigButton>
      </section>

      <section style={{ marginTop: "var(--space-2)" }}>
        <AutoSpeech script={CHAPERONE_VOICE_SCRIPT} />
      </section>
    </PageShell>
  );
}
