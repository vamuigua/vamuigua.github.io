import { profile } from './profile';

/**
 * Verified milestones (CV, GitHub, itch.io). Titles are playful; descriptions are factual.
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Certification' | 'Engineering' | 'Leadership' | 'Game dev' | 'Education';
  source: string;
  href?: string;
}

export const achievements: Achievement[] = [
  {
    id: 'kcna',
    title: 'Cloud Native',
    description: 'Earned the Kubernetes and Cloud Native Associate (KCNA) certification.',
    icon: 'shield-check',
    category: 'Certification',
    source: 'CNCF / Linux Foundation',
    href: profile.certification.url || undefined,
  },
  {
    id: 'keeper',
    title: 'Keeper of the Core',
    description: 'Took full technical ownership of Solutech’s SAT platform and led its end-to-end upgrade.',
    icon: 'crown',
    category: 'Leadership',
    source: 'Solutech',
  },
  {
    id: 'bridge',
    title: 'Bridge Builder',
    description: 'Connected SAT and SAP with a secure, bidirectional integration that automates operational workflows.',
    icon: 'git-merge',
    category: 'Engineering',
    source: 'Solutech',
  },
  {
    id: 'migration',
    title: 'The Great Migration',
    description: 'Led Zydii’s move from a legacy CakePHP monolith to Laravel, about 25% faster overall.',
    icon: 'route',
    category: 'Engineering',
    source: 'Zydii',
  },
  {
    id: 'speedrun',
    title: 'Speedrunner',
    description: 'Cut application latency by 40% with a Redis caching strategy on critical read paths.',
    icon: 'zap',
    category: 'Engineering',
    source: 'Zydii',
  },
  {
    id: 'automaton',
    title: 'Automaton',
    description: 'Removed ~80% of manual transcript clean-up with OpenAI-powered scripting.',
    icon: 'bot',
    category: 'Engineering',
    source: 'Zydii',
  },
  {
    id: 'party',
    title: 'Party Leader',
    description: 'Mentored junior engineers through structured reviews and pairing, raising PR quality within three months.',
    icon: 'users',
    category: 'Leadership',
    source: 'Zydii',
  },
  {
    id: 'shipped',
    title: 'Game Shipped',
    description: 'Published Ninja Danger, a Unity top-down shooter, on itch.io.',
    icon: 'gamepad-2',
    category: 'Game dev',
    source: 'itch.io',
    href: 'https://vocastgames.itch.io/ninja-danger',
  },
  {
    id: 'graduate',
    title: 'Scholar',
    description: 'Graduated with a BSc in Applied Computer Science from Chuka University (2020).',
    icon: 'graduation-cap',
    category: 'Education',
    source: 'Chuka University',
  },
  {
    id: 'origin',
    title: 'Origin Story',
    description: 'Completed Moringa School’s full stack software development program (2017).',
    icon: 'flag',
    category: 'Education',
    source: 'Moringa School',
  },
];

/** Optional secret achievements: purely for fun, stored in the visitor's browser. */
export const secrets = [
  { id: 'konami', title: 'Old School', hint: 'A classic code still works here.', icon: 'keyboard' },
  { id: 'slime', title: 'Slime Whisperer', hint: 'Someone at the camp wants attention.', icon: 'heart' },
  { id: 'explorer', title: 'Cartographer', hint: 'Visit every region of the map.', icon: 'map' },
] as const;
