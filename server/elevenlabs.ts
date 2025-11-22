import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

if (!process.env.ELEVENLABS_API_KEY) {
  console.warn("Warning: ELEVENLABS_API_KEY not configured. Voice features will use browser TTS.");
}

const client = process.env.ELEVENLABS_API_KEY 
  ? new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY })
  : null;

// Recommended voice IDs for spiritual/calming content:
// - Rachel (calm, clear): "21m00Tcm4TlvDq8ikWAM"
// - Bella (soothing): "EXAVITQu4vr4xnSDxMaL"
// - Charlotte (warm): "XB0fDUnXU5powFXDhCwa"
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel - calm and clear

export async function generateSpeech(text: string, voiceId?: string): Promise<Buffer | null> {
  if (!client) {
    console.warn("ElevenLabs client not initialized - API key missing");
    return null;
  }

  try {
    const audio = await client.textToSpeech.convert(voiceId || DEFAULT_VOICE_ID, {
      text,
      model_id: "eleven_flash_v2_5", // Fast, low-latency model
      output_format: "mp3_44100_128",
      voice_settings: {
        stability: 0.6,           // Slightly more consistent for spiritual content
        similarity_boost: 0.75,   // Good balance
        style: 0.2,              // Subtle expressiveness
        use_speaker_boost: true, // Enhance clarity
      },
    });

    let buffer: Buffer | null = null;

    if (audio instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of audio) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      buffer = Buffer.concat(chunks);
    } else if (audio && typeof (audio as any).arrayBuffer === "function") {
      buffer = Buffer.from(await (audio as any).arrayBuffer());
    }

    return buffer && buffer.length ? buffer : null;
  } catch (error) {
    console.error("ElevenLabs TTS error:", error);
    return null;
  }
}

export async function getAvailableVoices() {
  if (!client) {
    return [];
  }

  try {
    const voicesResponse = await client.voices.getAll();
    return voicesResponse.voices || [];
  } catch (error) {
    console.error("Error fetching ElevenLabs voices:", error);
    return [];
  }
}
