import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

const SYLLABLES = {
  NA: 'Ná',
  TU: 'Tú',
  PO: 'Pó',
  LA: 'Lá',
  PI: 'Pí',
  CHU: 'Chú',
  MA: 'Má',
  TO: 'Tó',
  DI: 'Dí',
  BA: 'Bá',
  RU: 'Rú',
  DO: 'Dó',
  DU: 'Dú',
  O: 'Ó',
  FA: 'Fá',
  MI: 'Mí',
  ZU: 'Zú',
  BAT: 'Bát',
  LE: 'Lé',
  CO: 'Có',
  GE: 'Gê',
  CA: 'Cá',
  BO: 'Bó',
  KA: 'Ká',
  KU: 'Kú',
  LU: 'Lú',
  RA: 'Rá',
  DE: 'Dé',
  MO: 'Mó',
  RIO: 'Rio',
  VI: 'Ví',
  TE: 'Té',
  PRAS: 'Prás',
  FE: 'Fé',
  DRA: 'Drá',
  TI: 'Tí',
  NI: 'Ní',
  SA: 'Sá',
  CRO: 'Cró',
  CRA: 'Crá',
  DOS: 'Dós',
  ME: 'Mé',
  EE: 'Í',
  VEE: 'Ví',
  SQUIR: 'Esquír',
  TLE: 'Tol',
  PA: 'Pá',
  MU: 'Mú',
  PSY: 'Psái',
  DUCK: 'Dáque',
  RO: 'Ró'
};

const POKEMON_NAMES = {
  natu: 'Ná... Tú... Natu!',
  pichu: 'Pí... Chú... Pichu!',
  ditto: 'Dí... Tó... Ditto!',
  doduo: 'Dó... Dú... Ó... Doduo!',
  zubat: 'Zú... Bát... Zubat!',
  togepi: 'Tó... Gê... Pí... Togepi!',
  pikachu: 'Pí... Ká... Chú... Pikachu!',
  kakuna: 'Ká... Kú... Ná... Kakuna!',
  lucario: 'Lú... Cá... Rio... Lucario!',
  lapras: 'Lá... Prás... Lapras!',
  dratini: 'Drá... Tí... Ní... Dratini!',
  crobat: 'Cró... Bát... Crobat!',
  cranidos: 'Crá... Ní... Dós... Cranidos!',
  eevee: 'Í... Ví... Eevee!',
  squirtle: 'Esquír... Tol... Squirtle!',
  psyduck: 'Psái... Dáque... Psyduck!'
};

const FEEDBACKS = {
  gotcha: 'Muito bem! Você conseguiu! Pokémon capturado!',
  welcome: 'Um Pokémon selvagem apareceu! Vamos soletrar para capturar?',
  almost: 'Quase lá! Escute com atenção o som da palavra!',
  inverted: 'Ih, as sílabas ficaram invertidas! Que engraçado! Vamos trocar de lugar?'
};

async function generateClip(tts, text, filePath) {
  const { audioStream } = tts.toStream(text);
  await pipeline(audioStream, fs.createWriteStream(filePath));
}

async function main() {
  console.log('Iniciando geração de áudios neurais em Português (pt-BR-FranciscaNeural)...');

  const syllablesDir = path.join(process.cwd(), 'public', 'audio', 'syllables');
  const pokemonDir = path.join(process.cwd(), 'public', 'audio', 'pokemon');
  const feedbackDir = path.join(process.cwd(), 'public', 'audio', 'feedback');

  fs.mkdirSync(syllablesDir, { recursive: true });
  fs.mkdirSync(pokemonDir, { recursive: true });
  fs.mkdirSync(feedbackDir, { recursive: true });

  const tts = new MsEdgeTTS();
  await tts.setMetadata('pt-BR-FranciscaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  // 1. Gerar Sílabas
  console.log('Gerando áudios de sílabas...');
  for (const [key, text] of Object.entries(SYLLABLES)) {
    const dest = path.join(syllablesDir, `${key}.mp3`);
    process.stdout.write(`  - Sílaba ${key} ("${text}")... `);
    await generateClip(tts, text, dest);
    console.log('OK');
  }

  // 2. Gerar Nomes dos Pokémon
  console.log('\nGerando áudios de nomes de Pokémon...');
  for (const [key, text] of Object.entries(POKEMON_NAMES)) {
    const dest = path.join(pokemonDir, `${key}.mp3`);
    process.stdout.write(`  - Pokémon ${key}... `);
    await generateClip(tts, text, dest);
    console.log('OK');
  }

  // 3. Gerar Frases de Feedback
  console.log('\nGerando feedbacks afetivos...');
  for (const [key, text] of Object.entries(FEEDBACKS)) {
    const dest = path.join(feedbackDir, `${key}.mp3`);
    process.stdout.write(`  - Feedback ${key}... `);
    await generateClip(tts, text, dest);
    console.log('OK');
  }

  tts.close();
  console.log('\n🎉 Todos os áudios neurais foram gerados com sucesso na pasta public/audio!');
}

main().catch((err) => {
  console.error('Erro na geração de áudios:', err);
  process.exit(1);
});
