import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'fs';
import { pipeline } from 'stream/promises';

async function generate(text, file) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata('pt-BR-FranciscaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);
  await pipeline(audioStream, fs.createWriteStream(file));
  tts.close();
}

async function main() {
  console.log("Gerando áudios pedagógicos do R brando...");

  // Aron com R brando bem nítido:
  await generate("Á... ron! Aron!", "public/audio/pokemon/aron.mp3");
  console.log("✓ public/audio/pokemon/aron.mp3");

  // Paras com R brando bem nítido:
  await generate("Pá... ras! Paras!", "public/audio/pokemon/paras.mp3");
  console.log("✓ public/audio/pokemon/paras.mp3");

  // Tauros com R brando bem nítido:
  await generate("Táu... ros! Tauros!", "public/audio/pokemon/tauros.mp3");
  console.log("✓ public/audio/pokemon/tauros.mp3");

  // Dica pedagógica em áudio para o R brando:
  await generate(
    "Dica do R tremidinho! Quando a letrinha R está sozinha no meio da palavra, a pontinha da língua treme no céu da boca! Como em A... ron!",
    "public/audio/feedback/dica-r-brando.mp3"
  );
  console.log("✓ public/audio/feedback/dica-r-brando.mp3");

  // Banette com BA - NE - TE:
  await generate("Bá... né... té! Banette!", "public/audio/pokemon/banette.mp3");
  console.log("✓ public/audio/pokemon/banette.mp3");

  // Cleffa com CLE - FA:
  await generate("Clé... fá! Cleffa!", "public/audio/pokemon/cleffa.mp3");
  console.log("✓ public/audio/pokemon/cleffa.mp3");

  // Rattata com RA - TA - TA:
  await generate("Rá... tá... tá! Rattata!", "public/audio/pokemon/rattata.mp3");
  console.log("✓ public/audio/pokemon/rattata.mp3");
}

main().catch(console.error);
