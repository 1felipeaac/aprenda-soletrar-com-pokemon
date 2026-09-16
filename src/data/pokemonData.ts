import type { World } from '../types/pokemon';

export const WORLDS_DATA: World[] = [
  {
    id: 1,
    title: 'Mundo 1: Treinador Novato',
    subtitle: '8 Pokémon de 2 sílabas simples e transparentes',
    icon: '🌱',
    themeColor: 'from-emerald-400 to-green-600',
    badge: 'Insígnia da Folha',
    pokemon: [
      {
        id: 177, // Natu
        name: 'natu',
        displayName: 'NATU',
        syllables: ['NA', 'TU'],
        distractors: ['PO', 'LA'],
        worldId: 1,
        phoneticDescription: '2 sílabas diretas (N e T)',
        color: 'bg-emerald-100 border-emerald-400',
        hint: 'Começa com o som NA!'
      },
      {
        id: 132, // Ditto
        name: 'ditto',
        displayName: 'DITTO',
        syllables: ['DI', 'TO'],
        distractors: ['BA', 'RU'],
        worldId: 1,
        phoneticDescription: '2 sílabas clássicas',
        color: 'bg-purple-100 border-purple-400',
        hint: 'DÍ no início, TÓ no fim!'
      },
      {
        id: 46, // Paras
        name: 'paras',
        displayName: 'PARAS',
        syllables: ['PA', 'RAS'],
        distractors: ['MI', 'TO'],
        worldId: 1,
        phoneticDescription: 'O R tremidinho entre duas vogais: PA-RAS',
        color: 'bg-orange-100 border-orange-400',
        hint: 'P com A faz PÁ... e entre as vogais o R treme suave: PA... RAS!',
      },
      {
        id: 371, // Bagon
        name: 'bagon',
        displayName: 'BAGON',
        syllables: ['BA', 'GON'],
        distractors: ['DO', 'LA'],
        worldId: 1,
        phoneticDescription: 'O clássico B com A!',
        color: 'bg-blue-100 border-blue-400',
        hint: 'B com A faz BÁ... e termina com GON!'
      },
      {
        id: 41, // Zubat
        name: 'zubat',
        displayName: 'ZUBAT',
        syllables: ['ZU', 'BAT'],
        distractors: ['LE', 'CO'],
        worldId: 1,
        phoneticDescription: 'Z com som de abelha',
        color: 'bg-indigo-100 border-indigo-400',
        hint: 'Zzzz com U faz ZÚ!'
      },
      {
        id: 479, // Rotom
        name: 'rotom',
        displayName: 'ROTOM',
        syllables: ['RO', 'TOM'],
        distractors: ['NA', 'CA'],
        worldId: 1,
        phoneticDescription: 'R forte no começo da palavra (som da garganta!)',
        color: 'bg-red-100 border-red-400',
        hint: 'No começo da palavra, o R sai forte lá do fundo da garganta: RÓ... TOM!',
      },
      {
        id: 304, // Aron
        name: 'aron',
        displayName: 'ARON',
        syllables: ['A', 'RON'],
        distractors: ['TU', 'BE'],
        worldId: 1,
        phoneticDescription: 'O R tremidinho no meio da palavra (língua no céu da boca!)',
        color: 'bg-slate-200 border-slate-400',
        hint: 'No meio da palavra, o R treme a pontinha da língua no céu da boca: A... ron!',
      },
      {
        id: 94, // Gengar
        name: 'gengar',
        displayName: 'GENGAR',
        syllables: ['GEN', 'GAR'],
        distractors: ['MO', 'TI'],
        worldId: 1,
        phoneticDescription: 'Pronúncia direta: GEN e GAR',
        color: 'bg-violet-100 border-violet-400',
        hint: 'GEN no começo e GÁR no fim!'
      }
    ]
  },
  {
    id: 2,
    title: 'Mundo 2: Caminho da Floresta',
    subtitle: '8 Pokémon de 3 sílabas simples e cadenciadas',
    icon: '🍃',
    themeColor: 'from-amber-400 to-orange-500',
    badge: 'Insígnia do Trovão',
    pokemon: [
      {
        id: 175, // Togepi
        name: 'togepi',
        displayName: 'TOGEPI',
        syllables: ['TO', 'GE', 'PI'],
        distractors: ['CA', 'BO'],
        worldId: 2,
        phoneticDescription: '3 sílabas super sonoras',
        color: 'bg-rose-100 border-rose-400',
        hint: 'TÓ, depois GÊ, depois PÍ!'
      },
      {
        id: 14, // Kakuna
        name: 'kakuna',
        displayName: 'KAKUNA',
        syllables: ['KA', 'KU', 'NA'],
        distractors: ['DE', 'MO'],
        worldId: 2,
        phoneticDescription: '3 pedacinhos com som forte',
        color: 'bg-lime-100 border-lime-400',
        hint: 'KÁ, depois KÚ, depois NÁ!'
      },
      {
        id: 19, // Rattata
        name: 'rattata',
        displayName: 'RATTATA',
        syllables: ['RA', 'TA', 'TA'],
        distractors: ['MI', 'FO'],
        worldId: 2,
        phoneticDescription: 'Pronúncia idêntica em português!',
        color: 'bg-purple-100 border-purple-400',
        hint: 'RÁ - TÁ - TÁ!'
      },
      {
        id: 251, // Celebi
        name: 'celebi',
        displayName: 'CELEBI',
        syllables: ['CE', 'LE', 'BI'],
        distractors: ['DU', 'PA'],
        worldId: 2,
        phoneticDescription: 'A fada guardiã da floresta',
        color: 'bg-emerald-100 border-emerald-400',
        hint: 'CÊ - LÉ - BÍ!'
      },
      {
        id: 114, // Tangela
        name: 'tangela',
        displayName: 'TANGELA',
        syllables: ['TAN', 'GE', 'LA'],
        distractors: ['SO', 'VU'],
        worldId: 2,
        phoneticDescription: 'Sons suaves e diretos',
        color: 'bg-blue-100 border-blue-400',
        hint: 'TÁN - GÊ - LÁ!'
      },
      {
        id: 222, // Corsola
        name: 'corsola',
        displayName: 'CORSOLA',
        syllables: ['COR', 'SO', 'LA'],
        distractors: ['BE', 'TI'],
        worldId: 2,
        phoneticDescription: 'O coralzinho marinho cor-de-rosa',
        color: 'bg-pink-100 border-pink-400',
        hint: 'CÓR - SÓ - LÁ!'
      },
      {
        id: 11, // Metapod
        name: 'metapod',
        displayName: 'METAPOD',
        syllables: ['ME', 'TA', 'POD'],
        distractors: ['ZU', 'NA'],
        worldId: 2,
        phoneticDescription: 'O casulo resistente',
        color: 'bg-green-100 border-green-400',
        hint: 'MÉ - TÁ - PÓD!'
      },
      {
        id: 77, // Ponyta
        name: 'ponyta',
        displayName: 'PONYTA',
        syllables: ['PO', 'NY', 'TA'],
        distractors: ['ME', 'SU'],
        worldId: 2,
        phoneticDescription: 'O cavalo com crina de fogo',
        color: 'bg-orange-100 border-orange-400',
        hint: 'PÓ - NI - TÁ!'
      }
    ]
  },
  {
    id: 3,
    title: 'Mundo 3: Jardim dos Ditongos',
    subtitle: '8 Pokémon com encontros vocálicos suaves (AU, AI, UI, IA)',
    icon: '🌸',
    themeColor: 'from-teal-400 to-cyan-600',
    badge: 'Insígnia da Harmonia',
    pokemon: [
      {
        id: 128, // Tauros
        name: 'tauros',
        displayName: 'TAUROS',
        syllables: ['TAU', 'ROS'],
        distractors: ['ME', 'CO'],
        worldId: 3,
        phoneticDescription: 'Encontro vocálico AU!',
        color: 'bg-amber-100 border-amber-400',
        hint: 'TÁU com som de AU... e termina com ROS!'
      },
      {
        id: 190, // Aipom
        name: 'aipom',
        displayName: 'AIPOM',
        syllables: ['AI', 'POM'],
        distractors: ['LU', 'TE'],
        worldId: 3,
        phoneticDescription: 'Encontro vocálico AI!',
        color: 'bg-purple-100 border-purple-400',
        hint: 'ÁI no começo e POM no fim!'
      },
      {
        id: 418, // Buizel
        name: 'buizel',
        displayName: 'BUIZEL',
        syllables: ['BUI', 'ZEL'],
        distractors: ['FA', 'RO'],
        worldId: 3,
        phoneticDescription: 'Encontro vocálico UI!',
        color: 'bg-orange-100 border-orange-400',
        hint: 'BÚI com som de UI... e ZEL!'
      },
      {
        id: 104, // Cubone
        name: 'cubone',
        displayName: 'CUBONE',
        syllables: ['CU', 'BO', 'NE'],
        distractors: ['DA', 'TI'],
        worldId: 3,
        phoneticDescription: '3 sílabas bem cadenciadas',
        color: 'bg-amber-100 border-amber-500',
        hint: 'CÚ - BÓ - NÉ!'
      },
      {
        id: 315, // Roselia
        name: 'roselia',
        displayName: 'ROSELIA',
        syllables: ['RO', 'SE', 'LIA'],
        distractors: ['PA', 'VU'],
        worldId: 3,
        phoneticDescription: 'Terminação melódica LIA',
        color: 'bg-rose-100 border-rose-400',
        hint: 'RÓ - SÉ - LIA!'
      },
      {
        id: 334, // Altaria
        name: 'altaria',
        displayName: 'ALTARIA',
        syllables: ['AL', 'TA', 'RIA'],
        distractors: ['BO', 'NE'],
        worldId: 3,
        phoneticDescription: 'O pássaro nuvem com som RIA',
        color: 'bg-sky-100 border-sky-400',
        hint: 'ÁL - TÁ - RIA!'
      },
      {
        id: 354, // Banette
        name: 'banette',
        displayName: 'BANETTE',
        syllables: ['BA', 'NE', 'TE'],
        distractors: ['SU', 'MI'],
        worldId: 3,
        phoneticDescription: '3 sílabas suaves: BA - NE - TE',
        color: 'bg-slate-200 border-slate-400',
        hint: 'BÁ - NÉ - TÉ!'
      },
      {
        id: 448, // Lucario
        name: 'lucario',
        displayName: 'LUCARIO',
        syllables: ['LU', 'CA', 'RIO'],
        distractors: ['VI', 'TE'],
        worldId: 3,
        phoneticDescription: 'Terminação com encontro RIO',
        color: 'bg-sky-100 border-sky-400',
        hint: 'LÚ - CA - RIO!'
      }
    ]
  },
  {
    id: 4,
    title: 'Mundo 4: Montanha dos Desafios',
    subtitle: '8 Líderes dos Encontros Consonantais (BR, CR, DR, PR, TR, CL)',
    icon: '⛰️',
    themeColor: 'from-sky-500 to-indigo-600',
    badge: 'Insígnia do Dragão',
    pokemon: [
      {
        id: 131, // Lapras
        name: 'lapras',
        displayName: 'LAPRAS',
        syllables: ['LA', 'PRAS'],
        distractors: ['FE', 'TU'],
        worldId: 4,
        phoneticDescription: 'Encontro consonantal PR',
        color: 'bg-cyan-100 border-cyan-400',
        hint: 'LÁ... e no final o som PRAS (com P e R)!'
      },
      {
        id: 147, // Dratini
        name: 'dratini',
        displayName: 'DRATINI',
        syllables: ['DRA', 'TI', 'NI'],
        distractors: ['BO', 'SA'],
        worldId: 4,
        phoneticDescription: 'Encontro DRA (D e R)',
        color: 'bg-blue-100 border-blue-400',
        hint: 'DRÁ (como dragão!), TÍ e NÍ!'
      },
      {
        id: 169, // Crobat
        name: 'crobat',
        displayName: 'CROBAT',
        syllables: ['CRO', 'BAT'],
        distractors: ['PI', 'DU'],
        worldId: 4,
        phoneticDescription: 'Encontro CRO (C e R)',
        color: 'bg-violet-100 border-violet-400',
        hint: 'CRÓ (com C e R juntinhos) e BÁT!'
      },
      {
        id: 408, // Cranidos
        name: 'cranidos',
        displayName: 'CRANIDOS',
        syllables: ['CRA', 'NI', 'DOS'],
        distractors: ['TE', 'ME'],
        worldId: 4,
        phoneticDescription: 'Encontro CRA e final DOS',
        color: 'bg-slate-200 border-slate-400',
        hint: 'CRÁ - NÍ - DOS!'
      },
      {
        id: 63, // Abra
        name: 'abra',
        displayName: 'ABRA',
        syllables: ['A', 'BRA'],
        distractors: ['VO', 'QU'],
        worldId: 4,
        phoneticDescription: 'Encontro BRA (B e R)',
        color: 'bg-amber-100 border-amber-400',
        hint: 'Á no começo e BRÁ no final!'
      },
      {
        id: 149, // Dragonite
        name: 'dragonite',
        displayName: 'DRAGONITE',
        syllables: ['DRA', 'GO', 'NI', 'TE'],
        distractors: ['LA', 'MU'],
        worldId: 4,
        phoneticDescription: 'O grande dragão bondoso',
        color: 'bg-orange-100 border-orange-400',
        hint: 'DRÁ - GÓ - NÍ - TÉ!'
      },
      {
        id: 173, // Cleffa
        name: 'cleffa',
        displayName: 'CLEFFA',
        syllables: ['CLE', 'FA'],
        distractors: ['DO', 'PA'],
        worldId: 4,
        phoneticDescription: 'Encontro CL (C e L) e som FÁ',
        color: 'bg-pink-100 border-pink-400',
        hint: 'CLÉ (com C e L juntinhos!) e FÁ!'
      },
      {
        id: 146, // Moltres
        name: 'moltres',
        displayName: 'MOLTRES',
        syllables: ['MOL', 'TRES'],
        distractors: ['SI', 'BO'],
        worldId: 4,
        phoneticDescription: 'Encontro TR (T e R)',
        color: 'bg-amber-200 border-amber-500',
        hint: 'MÓL no começo e TRÊS no final!'
      }
    ]
  },
  {
    id: 5,
    title: 'Mundo 5: Ilhas Misteriosas',
    subtitle: '8 Campeões do Pós-Game (Letras Secretas e Dígrafos)',
    icon: '⭐',
    themeColor: 'from-fuchsia-500 to-rose-600',
    badge: 'Insígnia dos Campeões',
    pokemon: [
      {
        id: 25, // Pikachu
        name: 'pikachu',
        displayName: 'PIKACHU',
        syllables: ['PI', 'KA', 'CHU'],
        distractors: ['LU', 'RA'],
        worldId: 5,
        phoneticDescription: 'O líder supremo com CHU!',
        color: 'bg-amber-100 border-amber-400',
        hint: 'PÍ - KA - CHU!'
      },
      {
        id: 172, // Pichu
        name: 'pichu',
        displayName: 'PICHU',
        syllables: ['PI', 'CHU'],
        distractors: ['MA', 'TO'],
        worldId: 5,
        phoneticDescription: 'O bebê com CHU!',
        color: 'bg-yellow-100 border-yellow-400',
        hint: 'PÍ no começo e CHU no final!'
      },
      {
        id: 133, // Eevee
        name: 'eevee',
        displayName: 'EEVEE',
        syllables: ['EE', 'VEE'],
        distractors: ['TO', 'LA'],
        worldId: 5,
        phoneticDescription: 'Segredo: E-E tem som de I!',
        color: 'bg-amber-100 border-amber-400',
        hint: 'As letras EE têm som de I: Í - VÍ!',
        isBonus: true,
        bonusExplanation: 'Na região da Eevee, duas letras E juntinhas fazem o som de I! Í-VÍ!'
      },
      {
        id: 7, // Squirtle
        name: 'squirtle',
        displayName: 'SQUIRTLE',
        syllables: ['SQUIR', 'TLE'],
        distractors: ['PA', 'MU'],
        worldId: 5,
        phoneticDescription: 'Segredo: Tartaruga de água',
        color: 'bg-teal-100 border-teal-400',
        hint: 'SQUIR - TLE!',
        isBonus: true,
        bonusExplanation: 'O famoso tartaruguinha de água com escrita especial!'
      },
      {
        id: 54, // Psyduck
        name: 'psyduck',
        displayName: 'PSYDUCK',
        syllables: ['PSY', 'DUCK'],
        distractors: ['RO', 'FE'],
        worldId: 5,
        phoneticDescription: 'Segredo: P silencioso!',
        color: 'bg-yellow-100 border-yellow-400',
        hint: 'PSY - DUCK!',
        isBonus: true,
        bonusExplanation: 'O patinho com dor de cabeça tem um P secreto no começo!'
      },
      {
        id: 143, // Snorlax
        name: 'snorlax',
        displayName: 'SNORLAX',
        syllables: ['SNOR', 'LAX'],
        distractors: ['VI', 'ME'],
        worldId: 5,
        phoneticDescription: 'O grandalhão dorminhoco',
        color: 'bg-slate-200 border-slate-400',
        hint: 'SNOR - LÁX!',
        isBonus: true,
        bonusExplanation: 'Snorlax dorme o dia todo e tem o som SNOR!'
      },
      {
        id: 1, // Bulbasaur
        name: 'bulbasaur',
        displayName: 'BULBASAUR',
        syllables: ['BUL', 'BA', 'SAUR'],
        distractors: ['CO', 'TI'],
        worldId: 5,
        phoneticDescription: 'O Pokémon inicial número 001',
        color: 'bg-emerald-100 border-emerald-400',
        hint: 'BUL - BA - SAUR!',
        isBonus: true,
        bonusExplanation: 'O primeiro da Pokédex com final SAUR!'
      },
      {
        id: 4, // Charmander
        name: 'charmander',
        displayName: 'CHARMANDER',
        syllables: ['CHAR', 'MAN', 'DER'],
        distractors: ['PO', 'SU'],
        worldId: 5,
        phoneticDescription: 'O lagartinho de fogo com cauda acesa',
        color: 'bg-orange-100 border-orange-400',
        hint: 'CHAR - MAN - DER!',
        isBonus: true,
        bonusExplanation: 'Charmander tem o famoso som CHAR!'
      }
    ]
  }
];

export const ALL_POKEMON = WORLDS_DATA.flatMap((w) => w.pokemon);

export function getPokemonArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getPokemonCryUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
}
