/**
 * useVoiceScript — resolve a `{{slot}}`-style template against a slot map.
 *
 * Used by /scan and /result pages to fill the TTS scripts in
 * `docs/voice-scripts.md` with values from `demo-data.json`.
 *
 * Pure function (not actually a hook) so it can be called from server
 * components too, but kept in the `voice/` folder for discoverability.
 */

export type VoiceSlots = Readonly<Record<string, string>>;

const SLOT_PATTERN = /\{\{\s*([\w.]+)\s*\}\}/g;

export function resolveVoiceScript(
  template: string,
  slots: VoiceSlots,
): string {
  if (!template) {
    return "";
  }
  return template.replace(SLOT_PATTERN, (_match, key: string) => {
    const value = slots[key];
    return typeof value === "string" ? value : "";
  });
}

/**
 * Build the slot map for a result-page TTS script from a demo case.
 * Keeps the shape stable so future demos slot in without page edits.
 */
export interface ResultVoiceSource {
  title: string;
  summary: string;
  action: string;
  points: readonly [string, string, string];
}

export function buildResultVoiceSlots(source: ResultVoiceSource): VoiceSlots {
  return {
    title: source.title,
    summary: source.summary,
    action: source.action,
    "points.0": source.points[0],
    "points.1": source.points[1],
    "points.2": source.points[2],
  };
}

export const RESULT_VOICE_TEMPLATE =
  "看完了。这是「{{title}}」。{{summary}}。我跟您说三点:第一,{{points.0}};第二,{{points.1}};第三,{{points.2}}。现在您该怎么办呢——{{action}}。如果还是拿不准,点屏幕下面那个「告诉家人」,我帮您发一张图给孩子。";

export const HOME_VOICE_SCRIPT =
  "您好,这里是看懂一下。看到不放心的截图,点下面的大按钮,拍一张,或者从相册里挑一张。如果只是想试试,就点「试一下」,我先给您演示一遍。";

export const SCAN_VOICE_SCRIPT =
  "我在帮您看,稍等一下,大概再过几秒。看完之后,我会用大字告诉您,这是不是骗子,要不要紧,该怎么办。您先放轻松。";

export const CARD_VOICE_SCRIPT =
  "这是给孩子的家人卡。您长按屏幕中间这张大图,选「保存图片」,然后发到您和孩子的微信群里。孩子扫一下卡上的小方块,就能看到我刚才跟您说的全部内容。这样您和孩子,看的是同一件事。";

export const ERROR_VOICE_SCRIPT =
  "出了点小问题,别担心。您按下面的大按钮,我们重新来一遍就好。";

export const NOT_FOUND_VOICE_SCRIPT =
  "没找到这一页,可能是链接旧了。您点下面的大按钮,我带您回到首页。";

export const CHAPERONE_VOICE_SCRIPT =
  "别慌,我先陪着您。这种事我们碰到过很多次,96110 是反诈专线,工作人员会一步步教您。点屏幕上那个大红色的「拨打 96110」就行。";

export function SCENE_VOICE_SCRIPT(label: string): string {
  return `好,我看到您选了「${label}」。请拍一张清楚的照片,把字朝上、灯光别太暗,我会用大字告诉您这是什么、要注意什么。`;
}
