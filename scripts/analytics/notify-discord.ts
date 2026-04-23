/**
 * Posts a summary message to a Discord channel via incoming webhook.
 *
 * Discord webhook docs:
 * https://discord.com/developers/docs/resources/webhook#execute-webhook
 *
 * We send a rich embed (title, fields, color) so the report stands out in
 * the channel. The webhook allows up to 10 embeds per message and 6000
 * characters total across all embed fields.
 */

export interface DiscordEmbedField {
  readonly name: string;
  readonly value: string;
  readonly inline?: boolean;
}

export interface DiscordEmbed {
  readonly title?: string;
  readonly description?: string;
  readonly url?: string;
  readonly color?: number;
  readonly fields?: readonly DiscordEmbedField[];
  readonly footer?: { readonly text: string };
  readonly timestamp?: string;
}

interface DiscordPayload {
  readonly username?: string;
  readonly content?: string;
  readonly embeds?: readonly DiscordEmbed[];
}

const MAX_FIELD_VALUE = 1024;
const MAX_DESCRIPTION = 4096;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 12)}\n...[trunc]`;
}

function normalizeEmbed(embed: DiscordEmbed): DiscordEmbed {
  const description = embed.description
    ? truncate(embed.description, MAX_DESCRIPTION)
    : undefined;
  const fields = embed.fields?.map(
    (f): DiscordEmbedField => ({
      name: f.name,
      value: truncate(f.value, MAX_FIELD_VALUE),
      ...(f.inline !== undefined ? { inline: f.inline } : {}),
    }),
  );
  return {
    ...embed,
    ...(description !== undefined ? { description } : {}),
    ...(fields !== undefined ? { fields } : {}),
  };
}

export async function notifyDiscord(
  webhookUrl: string,
  embed: DiscordEmbed,
  username = "Claude Codex Analytics",
): Promise<void> {
  if (!webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
    throw new Error("DISCORD_WEBHOOK_URL must point to a discord.com webhook endpoint");
  }
  const payload: DiscordPayload = {
    username,
    embeds: [normalizeEmbed(embed)],
  };
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Discord webhook failed: ${res.status} ${await res.text()}`);
  }
}
