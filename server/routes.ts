import { Router } from "express";
import { Anthropic } from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const router = Router();
const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// naive auth helper reading req.userId & tier from session or cookie you already set server-side
function getAuth(req: any) {
  const userId = req.cookies?.uid || null; // adapt to your session
  const tier = req.cookies?.tier || "guest"; // "guest" | "free" | "paid"
  return { userId, tier: tier as "guest" | "free" | "paid" };
}

// who am I
router.get("/me", async (req, res) => {
  const { userId, tier } = getAuth(req);
  res.json({ isAuthenticated: !!userId, tier });
});

// 7-day window messages
router.get("/chats/current", async (req, res) => {
  const { userId } = getAuth(req);
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const messages = await prisma.message.findMany({
    where: { userId: userId || "guest", createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, content: true, createdAt: true },
  });
  res.json({ messages });
});

// export
router.post("/chats/export", async (req, res) => {
  const { userId } = getAuth(req);
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const messages = await prisma.message.findMany({
    where: { userId: userId || "guest", createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });
  const txt = messages.map(m => `[${m.createdAt.toISOString()}] ${m.role.toUpperCase()}:\n${m.content}`).join("\n\n");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="rapha-lumina-chat-${new Date().toISOString().slice(0,10)}.txt"`);
  res.send(txt);
});

// clear
router.delete("/messages", async (req, res) => {
  const { userId } = getAuth(req);
  await prisma.message.deleteMany({ where: { userId: userId || "guest" } });
  res.json({ ok: true });
});

// chat with limits + short structured style (4 open Qs + action step)
router.post("/chat", async (req, res) => {
  try {
    const { userId, tier } = getAuth(req);
    const today = new Date(); today.setHours(0,0,0,0);

    // enforce per-tier daily limits
    const limit = tier === "guest" ? 2 : tier === "free" ? 5 : 999999;
    const used = await prisma.message.count({
      where: { userId: userId || "guest", role: "user", createdAt: { gte: today } },
    });
    if (used >= limit) {
      return res.status(429).json({
        message:
          tier === "guest"
            ? "You’ve reached the 2-chat preview. Create a free account to continue."
            : "You’ve reached your 5 chats for today on the free plan. Upgrade for unlimited.",
      });
    }

    const content: string = String(req.body?.content || "").slice(0, 4000);
    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    // store user message
    const urec = await prisma.message.create({
      data: { userId: userId || "guest", role: "user", content, createdAt: new Date() },
    });

    const systemStyle =
      "You are Rapha Lumina, a calm, practical, non-religious spiritual guide. " +
      "Reply in at most two short paragraphs. Include exactly four open-ended questions, then one actionable next step as a closing line starting with 'Next:'.";

    const messages = [
      { role: "system", content: systemStyle },
      ...history.slice(-15).map((m: any) => ({ role: m.role, content: m.content })),
      { role: "user", content },
    ] as any;

    const resp = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 400,
      temperature: 0.6,
      messages,
    });

    const text = resp.content?.[0]?.type === "text" ? resp.content[0].text : (resp as any).content?.[0]?.text || "…";

    const arec = await prisma.message.create({
      data: { userId: userId || "guest", role: "assistant", content: text, createdAt: new Date() },
    });

    res.json({ id: String(arec.id), content: text, createdAt: arec.createdAt });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ message: "Failed to connect to the assistant. Check ANTHROPIC_API_KEY." });
  }
});

// ElevenLabs TTS for last assistant message
router.post("/tts/last-assistant", async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const voiceId = req.body?.voiceId || "NDTYOmYEjbDIVCKB35i3";
    const last = await prisma.message.findFirst({
      where: { userId: userId || "guest", role: "assistant" },
      orderBy: { createdAt: "desc" },
    });
    if (!last) return res.status(404).end();

    const ev = process.env.ELEVENLABS_API_KEY;
    if (!ev) return res.status(400).json({ message: "ELEVENLABS_API_KEY not configured" });

    const tts = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { "xi-api-key": ev, "Content-Type": "application/json" },
      body: JSON.stringify({ text: last.content, model_id: "eleven_multilingual_v2" }),
    });

    if (!tts.ok) return res.status(400).end();
    const buf = await tts.arrayBuffer();
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(buf));
  } catch (e) {
    res.status(500).end();
  }
});

export default router;
