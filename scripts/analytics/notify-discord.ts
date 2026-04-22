/**
 * Posts a summary message to a Discord channel via incoming webhook.
 *
 * Discord webhook docs:
 * https://discord.com/developers/docs/resources/webhook#execute-webhook
 *
 * Message length limit: 2000 characters for `content`, 6000 across embeds.
 * We stay in the `content` field for simplicity and trim if needed.
 */

const MAX_CONTENT_LENGTH = 1900; // leave headroom for Discord server markers

interface DiscordPayload {
  readonly content: string;
  readonly username?: string;
  readonly avatar_url?: string;
}

function truncate(content: string): string {
  if (content.length <= MAX_CONTENT_LENGTH) return content;
  return `${content.slice(0, MAX_CONTENT_LENGTH - 20)}\n...[truncated]`;
}

export async function notifyDiscord(
  webhookUrl: string,
  content: string,
  username = "Claude Codex Analytics",
): Promise<void> {
  if (!webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
    throw new Error("DISCORD_WEBHOOK_URL must point to a discord.com webhook endpoint");
  }
  const payload: DiscordPayload = {
    content: truncate(content),
    username,
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
