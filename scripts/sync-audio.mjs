import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

// 1. BANCO UNIVERSAL DE FAMÍLIAS SILÁBICAS DO PORTUGUÊS (B-A-BA até Z)
const FAMILIES = [
  'B', 'C', 'D', 'F', 'G', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'X', 'Z',
  'CH', 'NH', 'LH',
  'BR', 'CR', 'DR', 'FR', 'GR', 'PR', 'TR',
  'BL', 'CL', 'FL', 'GL', 'PL'
];

const VOWEL_SOUNDS = [
  { key: 'A', spoken: 'á' },
  { key: 'E', spoken: 'é' },
  { key: 'I', spoken: 'í' },
  { key: 'O', spoken: 'ó' },
  { key: 'U', spoken: 'ú' },
];

// Vogais isoladas
const UNIVERSAL_SYLLABLES = {
  A: 'Á',
  E: 'É',
  I: 'Í',
  O: 'Ó',
  U: 'Ú',
};

// Gera as combinações de Consoante + Vogal
for (const prefix of FAMILIES) {
  for (const v of VOWEL_SOUNDS) {
    const syllableKey = `${prefix}${v.key}`;
    // Ajuste fonético suave
    let spoken = `${prefix.charAt(0) + prefix.slice(1).toLowerCase()}${v.spoken}`;
    if (syllableKey === 'GE') spoken = 'Gê';
    UNIVERSAL_SYLLABLES[syllableKey] = spoken;
  }
}

// Sílabas especiais / fechadas comuns em nomes de Pokémon
const SPECIAL_SYLLABLES = {
  BAT: 'Bát',
  GON: 'Gón',
  DOS: 'Dós',
  RIO: 'Rio',
  PRAS: 'Prás',
  KANS: 'Kans',
  NIX: 'Níx',
  SIR: 'Sír',
  LAX: 'Láx',
  EE: 'Í',
  VEE: 'Ví',
  SQUIR: 'Esquír',
  TLE: 'Tol',
  PSY: 'Psái',
  DUCK: 'Dáque',
  CHOP: 'Chóp',
  RILL: 'Ril',
  NY: 'Ni',
  POD: 'Pód',
  FAI: 'Fái',
  RY: 'Rí',
  PINCH: 'Pínch',
  SNOR: 'Snór',
  MEW: 'Miu',
  TWO: 'Tú',
  BUL: 'Bul',
  SAUR: 'Sáur',
  CHAR: 'Chár',
  MAN: 'Mán',
  DER: 'Dér',
  GEN: 'Gên',
  GAR: 'Gár',
  RAI: 'Rái',
  GIA: 'Gia',
  RAS: 'Rás',
  RON: 'Rón',
  TOM: 'Tóm',
  TTA: 'Ta',
  TAN: 'Tán',
  COR: 'Cór',
  TAU: 'Táu',
  ROS: 'Rós',
  AI: 'Ái',
  POM: 'Póm',
  BUI: 'Búi',
  ZEL: 'Zél',
  LIA: 'Lia',
  AL: 'Ál',
  RIA: 'Ria',
  TTE: 'Te',
  FFA: 'Fa',
  MOL: 'Mól',
  TRES: 'Três',
};

Object.assign(UNIVERSAL_SYLLABLES, SPECIAL_SYLLABLES);

// Extrai dinamicamente Pokémon do pokemonData.ts
function extractPokemonFromData() {
  const dataPath = path.join(process.cwd(), 'src', 'data', 'pokemonData.ts');
  const content = fs.readFileSync(dataPath, 'utf-8');
  
  const pokemonList = [];
  const regex = /name:\s*['"]([^'"]+)['"],\s*displayName:\s*['"]([^'"]+)['"],\s*syllables:\s*\[([^\]]+)\]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const name = match[1].toLowerCase();
    const displayName = match[2];
    const syllables = match[3]
      .split(',')
      .map((s) => s.replace(/['"\s]/g, ''))
      .filter(Boolean);

    pokemonList.push({ name, displayName, syllables });
  }
  return pokemonList;
}

const FEEDBACKS = {
  gotcha: 'Muito bem! Você conseguiu! Pokémon capturado!',
  welcome: 'Um Pokémon selvagem apareceu! Vamos soletrar para capturar?',
  almost: 'Quase lá! Escute com atenção o som da palavra!',
  inverted: 'Ih, as sílabas ficaram invertidas! Que engraçado! Vamos trocar de lugar?',
};

async function generateClip(tts, text, filePath) {
  const { audioStream } = tts.toStream(text);
  await pipeline(audioStream, fs.createWriteStream(filePath));
}

async function main() {
  console.log('⚡ SINCRONIZADOR INTELIGENTE DE ÁUDIOS NEURAIS (pt-BR-FranciscaNeural)');

  const syllablesDir = path.join(process.cwd(), 'public', 'audio', 'syllables');
  const pokemonDir = path.join(process.cwd(), 'public', 'audio', 'pokemon');
  const feedbackDir = path.join(process.cwd(), 'public', 'audio', 'feedback');

  fs.mkdirSync(syllablesDir, { recursive: true });
  fs.mkdirSync(pokemonDir, { recursive: true });
  fs.mkdirSync(feedbackDir, { recursive: true });

  let tts = null;
  const getTTS = async () => {
    if (!tts) {
      tts = new MsEdgeTTS();
      await tts.setMetadata('pt-BR-FranciscaNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    }
    return tts;
  };

  let generatedCount = 0;
  let skippedCount = 0;

  // 1. Sincroniza o Banco Universal de Sílabas
  console.log('\n📖 Verificando Banco Universal de Sílabas...');
  for (const [key, text] of Object.entries(UNIVERSAL_SYLLABLES)) {
    const dest = path.join(syllablesDir, `${key}.mp3`);
    if (fs.existsSync(dest)) {
      skippedCount++;
    } else {
      process.stdout.write(`  + Baixando nova sílaba: ${key} ("${text}")... `);
      const activeTTS = await getTTS();
      await generateClip(activeTTS, text, dest);
      console.log('OK');
      generatedCount++;
    }
  }

  // 2. Sincroniza Pokémon cadastrados no pokemonData.ts
  console.log('\n🐾 Verificando Pokémon cadastrados no código...');
  const pokemonList = extractPokemonFromData();

  function getSpokenSyllable(syl) {
    const clean = syl.trim().toUpperCase();
    if (UNIVERSAL_SYLLABLES[clean]) {
      return UNIVERSAL_SYLLABLES[clean];
    }
    return clean.charAt(0) + clean.slice(1).toLowerCase();
  }

  for (const poke of pokemonList) {
    const dest = path.join(pokemonDir, `${poke.name}.mp3`);
    if (fs.existsSync(dest)) {
      skippedCount++;
    } else {
      const spokenSyllables = poke.syllables.map(getSpokenSyllable);
      const cadenceText = `${spokenSyllables.join('... ')}! ${poke.displayName}!`;
      process.stdout.write(`  + Baixando áudio do Pokémon: ${poke.name} ("${cadenceText}")... `);
      const activeTTS = await getTTS();
      await generateClip(activeTTS, cadenceText, dest);
      console.log('OK');
      generatedCount++;
    }
  }

  // 3. Sincroniza Feedbacks
  for (const [key, text] of Object.entries(FEEDBACKS)) {
    const dest = path.join(feedbackDir, `${key}.mp3`);
    if (fs.existsSync(dest)) {
      skippedCount++;
    } else {
      process.stdout.write(`  + Baixando feedback: ${key}... `);
      const activeTTS = await getTTS();
      await generateClip(activeTTS, text, dest);
      console.log('OK');
      generatedCount++;
    }
  }

  if (tts) {
    tts.close();
  }

  console.log('\n=============================================');
  console.log(`✨ Sincronização concluída!`);
  console.log(`  - Novos áudios gerados: ${generatedCount}`);
  console.log(`  - Áudios já existentes preservados: ${skippedCount}`);
  console.log('=============================================\n');
}

main().catch((err) => {
  console.error('Erro na sincronização:', err);
  process.exit(1);
});
