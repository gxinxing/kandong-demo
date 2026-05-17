import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Bubble } from "@/components/bubble/Bubble";
import { BigButton } from "@/components/ui/BigButton";
import { FamilyCard } from "@/components/family-card/FamilyCard";
import { AutoSpeech } from "@/components/voice/AutoSpeech";
import { CARD_VOICE_SCRIPT } from "@/components/voice/useVoiceScript";
import { getCase } from "@/lib/demo-data";

interface CardPageProps {
  params: Promise<{ id: string }>;
}

export default async function CardPage({ params }: CardPageProps) {
  const { id } = await params;
  const caseData = await getCase(id);
  if (!caseData) {
    notFound();
  }

  return (
    <PageShell title="告诉家人" backHref={`/result/${caseData.id}`}>
      <Bubble tone="emphasis" avatar speak={CARD_VOICE_SCRIPT}>
        我帮您做好了一张图,长按可以保存到相册,再发到家人群里。
      </Bubble>
      <Bubble tone="default">
        分三步:1️⃣ 长按下面这张图 2️⃣ 选「保存图片」 3️⃣ 打开微信发到家人群
      </Bubble>

      <FamilyCard caseData={caseData} />

      <BigButton as="a" href="/" variant="secondary" size="md">
        看下一个
      </BigButton>

      <AutoSpeech script={CARD_VOICE_SCRIPT} />
    </PageShell>
  );
}
