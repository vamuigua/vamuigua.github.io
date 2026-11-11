/**
 * Single source of truth for personal details.
 * Facts come from Victor's CV (Nov 2026), GitHub profile and the original site.
 * Copy is paraphrased; nothing here should be invented.
 */
export const profile = {
  name: 'Victor Allen Muigua',
  shortName: 'Victor Allen',
  role: 'Senior Full Stack Engineer',
  location: 'Nairobi, Kenya',
  currentGuild: 'Solutech Limited',
  professionalSince: 2021,
  tagline: 'Software engineer. Problem solver. Lifelong gamer.',
  intro:
    'I design and build the backend systems, integrations and interfaces that real businesses run on, from enterprise platforms to the small games I make for fun.',
  bio: [
    'I’m a full stack engineer based in Nairobi with a strong lean towards the backend: API architecture, caching, integrations and the CI/CD plumbing that gets code safely to production. Since 2021 I’ve shipped ERP, learning, fintech and logistics platforms across three engineering teams.',
    'Today I own the technical direction of Solutech’s core enterprise platform, connecting it to SAP and other systems and keeping it fast, secure and maintainable. I enjoy the unglamorous wins: a migration that lands cleanly, a cache that removes 40% of the wait, or a script that gives a team its afternoons back.',
    'I grew up on video games, and they still shape how I build: clear feedback, satisfying progression, and a lot of care for the person on the other side of the screen. When I’m off duty I make small games in Unity and draw pixel art in Aseprite.',
  ],
  email: 'vamuigua@gmail.com',
  phone: '+254 718 458 311',
  phoneHref: 'tel:+254718458311',
  cv: 'Victor_Allen_Muigua_CV.pdf',
  links: {
    github: 'https://github.com/vamuigua',
    linkedin: 'https://www.linkedin.com/in/victor-allen-muigua/',
    x: 'https://x.com/VictorAllen22',
    itch: 'https://vocastgames.itch.io/',
  },
  certification: {
    name: 'Kubernetes and Cloud Native Associate (KCNA)',
    issuer: 'CNCF / The Linux Foundation',
    url: 'https://www.credly.com/badges/c0dbadcb-cd47-4a6e-bef5-c53f033a4fe3/public_url' as string,
  },
  /**
   * "Current quest" card in the Character profile section.
   * Set `show: false` to hide the whole card; nothing else depends on it.
   */
  currentObjective: {
    show: true,
    label: 'Current quest · AI crafting',
    title: 'Tinkering with AI to build products people can trust',
    intro:
      'Every good RPG has a crafting system. Mine is AI: I take a tedious, real-world chore, combine a language model with solid engineering, and see whether it can become a product people would actually rely on.',
    houseRule: 'The AI never invents a fact. If it doesn’t know, it says so.',
    steps: [
      {
        state: 'done',
        text: 'Automated ~80% of manual transcript clean-up at Zydii with OpenAI-powered scripts',
        mission: 'zydii',
      },
      {
        state: 'done',
        text: 'Shipped Meeting Minutes: recordings in, editable minutes out, with no made-up owners or deadlines',
        mission: 'meeting-minutes',
      },
      {
        state: 'active',
        text: 'Experimenting with guardrails and provider-agnostic designs that keep AI output honest and testable',
      },
      {
        state: 'next',
        text: 'Find the next everyday chore worth handing to a well-behaved model',
      },
    ],
    loadout: ['LLM APIs', 'Speech-to-text', 'Prompt guardrails', 'Provider interfaces', 'Fixture-driven tests'],
  },
  traits: [
    {
      icon: 'server',
      title: 'Backend architect',
      text: 'API contracts, async processing, Protobuf schemas and resilient services with retries and circuit breakers.',
    },
    {
      icon: 'workflow',
      title: 'Integration specialist',
      text: 'SAP, QuickBooks, M-Pesa, PayPal, SMS and email providers: making separate systems talk reliably.',
    },
    {
      icon: 'gauge',
      title: 'Performance tuner',
      text: 'Redis caching strategy, query optimisation and lean architecture changes that users actually feel.',
    },
    {
      icon: 'users',
      title: 'Team multiplier',
      text: 'Code review standards, API conventions, mentoring and pair programming that raise the whole party’s level.',
    },
  ],
} as const;

export type Profile = typeof profile;
