/**
 * Career chapters, newest first. Dates and outcomes come from Victor's CV (Nov 2026);
 * wording is paraphrased. Metrics are as reported on the CV.
 */
export interface Chapter {
  id: string;
  chapter: string;
  kind: 'work' | 'education';
  title: string;
  org: string;
  orgUrl?: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  quests: string[];
  stack: string[];
  /** Optional mission slugs that relate to this chapter. */
  missions?: string[];
}

export const chapters: Chapter[] = [
  {
    id: 'solutech',
    chapter: 'Chapter V',
    kind: 'work',
    title: 'Senior Full Stack Engineer',
    org: 'Solutech Limited',
    location: 'Nairobi, Kenya',
    start: 'Oct 2024',
    end: 'Present',
    current: true,
    summary:
      'Technical owner of SAT, the enterprise platform at the centre of Solutech’s product ecosystem, which spans fleet management, logistics and operational workflows.',
    quests: [
      'Led an end-to-end upgrade of the SAT platform: paid down technical debt, hardened security and set it up to keep scaling.',
      'Designed a Protocol Buffers layer for service-to-service messages, replacing loose payloads with strict, smaller schemas.',
      'Built the bidirectional SAT ↔ SAP integration that automates business-critical operational workflows.',
      'Hardened production services with structured error handling, retries, circuit breakers and observability hooks.',
      'Automated releases with GitHub Actions and set team-wide standards for code review, API design and testing.',
    ],
    stack: ['Laravel', 'PHP', 'Vue.js', 'Protobuf', 'SAP', 'Redis', 'GitHub Actions'],
  },
  {
    id: 'zydii',
    chapter: 'Chapter IV',
    kind: 'work',
    title: 'Full Stack Engineer',
    org: 'Zydii',
    orgUrl: 'https://zydii.com/',
    location: 'Nairobi, Kenya',
    start: 'Dec 2022',
    end: 'Oct 2024',
    summary:
      'Engineered a localised digital-learning platform for African businesses, spanning its learning, analytics and finance operations.',
    quests: [
      'Led the migration from a legacy CakePHP monolith to Laravel, a ~25% performance gain and a far more testable codebase.',
      'Introduced Redis caching on critical read paths, cutting application latency by 40%.',
      'Integrated QuickBooks into the finance module, automating reconciliation that used to be manual.',
      'Wrote OpenAI-powered scripts that removed roughly 80% of manual transcript clean-up work.',
      'Ran CI/CD on Bitbucket, Envoyer and GCP, and mentored junior engineers through reviews and pairing.',
    ],
    stack: ['Laravel', 'Livewire', 'Alpine.js', 'MySQL', 'Redis', 'QuickBooks API', 'GCP'],
    missions: ['zydii'],
  },
  {
    id: 'stepwise',
    chapter: 'Chapter III',
    kind: 'work',
    title: 'Software Developer',
    org: 'StepWise Inc.',
    location: 'Nairobi, Kenya',
    start: 'Jun 2021',
    end: 'Dec 2022',
    summary:
      'First professional campaign: building ERP and learning-management platforms with integrated payments.',
    quests: [
      'Optimised payment-processing workflows in the ERP and LMS platforms, improving transaction efficiency by 15%.',
      'Built backend APIs in Laravel and frontend components in Vue.js, including third-party integrations.',
      'Configured and ran cloud environments on AWS and Vultr for staging and production.',
      'Turned UI/UX designs into production features and led delivery across several product modules.',
    ],
    stack: ['Laravel', 'Vue.js', 'MySQL', 'AWS', 'Vultr'],
  },
  {
    id: 'chuka',
    chapter: 'Chapter II',
    kind: 'education',
    title: 'BSc Applied Computer Science',
    org: 'Chuka University',
    location: 'Kenya',
    start: 'Sep 2016',
    end: 'Dec 2020',
    summary:
      'Computer science fundamentals, plus the side quests that became a habit: Laravel systems, PWAs and my first Unity games.',
    quests: [
      'Built REMSS, a real-estate management system with M-Pesa and PayPal payments.',
      'Shipped Ninja Danger, a top-down Unity shooter published on itch.io.',
      'Started Never Nigh, a gravity-flipping pixel-art platformer.',
      'Co-built e-MALL, a Rails platform for discovering what businesses inside shopping malls offer.',
    ],
    stack: ['PHP', 'Laravel', 'JavaScript', 'C#', 'Unity', 'Rails'],
    missions: ['remss', 'ninja-danger', 'never-nigh', 'e-mall'],
  },
  {
    id: 'moringa',
    chapter: 'Chapter I',
    kind: 'education',
    title: 'Full Stack Software Development Program',
    org: 'Moringa School',
    location: 'Nairobi, Kenya',
    start: 'Apr 2016',
    end: 'Sep 2017',
    summary:
      'Where the journey started. An intensive bootcamp in test-driven Ruby, Rails, JavaScript and Ember, building something new almost every day.',
    quests: [
      'Shipped a steady stream of small Ruby, Rails and Ember apps, test-first.',
      'Deployed my first web apps: a GitHub user lookup, an Ember.js blog and a Q&A board.',
    ],
    stack: ['Ruby', 'Rails', 'JavaScript', 'Ember.js'],
  },
];
