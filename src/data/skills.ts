/**
 * Skill tree. Tiers are evidence-based, never percentages:
 *  - pro:      used in a professional role (per CV)
 *  - shipped:  used to ship personal / side projects
 *  - training: actively learning now
 */
export type SkillTier = 'pro' | 'shipped' | 'training';

export interface Skill {
  id: string;
  name: string;
  tier: SkillTier;
  /** Where it was used: roles or project names. */
  evidence: string;
  /** Mission slugs that demonstrate the skill. */
  missions?: string[];
  badge?: string;
}

export interface Branch {
  id: string;
  name: string;
  icon: string;
  blurb: string;
  skills: Skill[];
}

export const tierMeta: Record<SkillTier, { label: string; short: string; description: string }> = {
  pro: { label: 'Professional', short: 'Pro', description: 'Used daily in a professional engineering role' },
  shipped: { label: 'Shipped in projects', short: 'Shipped', description: 'Used to build and ship my own projects' },
  training: { label: 'In training', short: 'Training', description: 'Actively levelling up right now' },
};

export const branches: Branch[] = [
  {
    id: 'backend',
    name: 'Backend & APIs',
    icon: 'server',
    blurb: 'My main class. Laravel at the core, API design and resilient services around it.',
    skills: [
      { id: 'php', name: 'PHP', tier: 'pro', evidence: 'Solutech, Zydii, StepWise', missions: ['remss', 'gemvist-motors'] },
      { id: 'laravel', name: 'Laravel', tier: 'pro', evidence: 'Solutech, Zydii, StepWise, plus most of my side projects', missions: ['zydii', 'remss', 'myparking', 'webhook-machine'] },
      { id: 'rest', name: 'REST API design', tier: 'pro', evidence: 'Owned API contracts and versioning at Zydii; API conventions at Solutech', missions: ['myparking', 'tours-booking'] },
      { id: 'async', name: 'Queues & async jobs', tier: 'pro', evidence: 'Asynchronous processing in production at Solutech and Zydii', missions: ['webhook-machine'] },
      { id: 'protobuf', name: 'Protocol Buffers', tier: 'pro', evidence: 'Designed Solutech’s Protobuf inter-service layer', missions: ['sat-platform'] },
      { id: 'resilience', name: 'Retries & circuit breakers', tier: 'pro', evidence: 'Production hardening of Solutech services', missions: ['sat-platform'] },
      { id: 'tdd', name: 'Testing / TDD (PHPUnit)', tier: 'pro', evidence: 'Team testing standards at Solutech; TDD practice projects', missions: ['tdd-journey', 'gemvist-motors'] },
      { id: 'sanctum', name: 'Auth: Sanctum & JWT', tier: 'shipped', evidence: 'Token auth in myParking and TDD Journey', missions: ['myparking', 'tdd-journey'] },
      { id: 'rabbitmq', name: 'RabbitMQ', tier: 'shipped', evidence: 'Hands-on message-queue work' },
      { id: 'python', name: 'Python', tier: 'shipped', evidence: 'Flask experiments and scripting' },
      { id: 'rails', name: 'Ruby on Rails', tier: 'shipped', evidence: 'Moringa School and e-MALL', missions: ['e-mall'] },
      { id: 'dotnet', name: '.NET Core & ASP.NET Core', tier: 'training', evidence: 'Building Web APIs with ASP.NET Core and EF Core' },
    ],
  },
  {
    id: 'frontend',
    name: 'Frontend & Mobile',
    icon: 'layout-panel-left',
    blurb: 'Turning designs into fast, reactive interfaces, on the web and on phones.',
    skills: [
      { id: 'js', name: 'JavaScript', tier: 'pro', evidence: 'Every role since 2021', missions: ['rgbs', 'stick-it'] },
      { id: 'ts', name: 'TypeScript', tier: 'pro', evidence: 'Frontend toolkit at work; Meeting Minutes end to end', missions: ['meeting-minutes'] },
      { id: 'vue', name: 'Vue.js', tier: 'pro', evidence: 'Laravel + Vue builds at StepWise, plus many side projects', missions: ['myparking', 'reaction-time', 'vue-weather'] },
      { id: 'nuxt', name: 'Nuxt', tier: 'pro', evidence: 'Frontend toolkit at work; Nuxt 4 full-stack in Meeting Minutes', missions: ['meeting-minutes'] },
      { id: 'livewire', name: 'Livewire + Alpine.js', tier: 'pro', evidence: 'Zydii’s reactive server-driven UI', missions: ['zydii'] },
      { id: 'figma', name: 'Design → code', tier: 'pro', evidence: 'Converted Figma / UI designs into production features at StepWise' },
      { id: 'tailwind', name: 'Tailwind CSS', tier: 'shipped', evidence: 'myParking frontend', missions: ['myparking'] },
      { id: 'pwa', name: 'PWAs', tier: 'shipped', evidence: 'Reaction Time, RGBs, Stick-it', missions: ['reaction-time', 'rgbs', 'stick-it'] },
      { id: 'flutter', name: 'Flutter + Dart', tier: 'shipped', evidence: 'REstock and the PowerWatch monitor app', missions: ['restock', 'powerwatch'] },
      { id: 'angular', name: 'Angular', tier: 'training', evidence: 'Learning alongside .NET' },
    ],
  },
  {
    id: 'data',
    name: 'Data & Caching',
    icon: 'database',
    blurb: 'Where performance is won or lost.',
    skills: [
      { id: 'mysql', name: 'MySQL', tier: 'pro', evidence: 'Primary database across all three roles', missions: ['zydii', 'remss', 'myparking'] },
      { id: 'redis', name: 'Redis caching', tier: 'pro', evidence: '40% latency reduction at Zydii; TTL and eviction strategy', missions: ['zydii'] },
      { id: 'query', name: 'Query optimisation', tier: 'pro', evidence: 'Performance work at Zydii and Solutech' },
      { id: 'postgres', name: 'PostgreSQL', tier: 'shipped', evidence: 'PowerWatch state history', missions: ['powerwatch'] },
      { id: 'prisma', name: 'Prisma + SQLite', tier: 'shipped', evidence: 'Meeting Minutes data and job queue', missions: ['meeting-minutes'] },
      { id: 'firebase', name: 'Firebase', tier: 'shipped', evidence: 'REstock sync; ReeChat (Firestore + Auth)', missions: ['restock'] },
    ],
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: 'workflow',
    blurb: 'Making separate systems talk reliably, which is often where the real business value is.',
    skills: [
      { id: 'sap', name: 'SAP', tier: 'pro', evidence: 'Bidirectional SAT ↔ SAP integration at Solutech', missions: ['sat-platform'] },
      { id: 'quickbooks', name: 'QuickBooks', tier: 'pro', evidence: 'Zydii finance module', missions: ['zydii'] },
      { id: 'payments', name: 'Payments', tier: 'pro', evidence: 'ERP/LMS payment processing at StepWise; M-Pesa and PayPal in REMSS', missions: ['remss'] },
      { id: 'messaging', name: 'SMS & email APIs', tier: 'pro', evidence: 'Africa’s Talking and Brevo at Zydii', missions: ['zydii'] },
      { id: 'openai', name: 'OpenAI automation', tier: 'pro', evidence: 'Automated ~80% of transcript clean-up at Zydii', missions: ['zydii'] },
      { id: 'webhooks', name: 'Webhooks', tier: 'shipped', evidence: 'Webhook Machine', missions: ['webhook-machine'] },
      { id: 'llm', name: 'LLM & speech APIs', tier: 'shipped', evidence: 'Anthropic Claude + AssemblyAI behind provider interfaces', missions: ['meeting-minutes'] },
      { id: 'mqtt', name: 'MQTT & IoT devices', tier: 'shipped', evidence: 'Mosquitto, ESP32, RouterOS and OpenWrt clients', missions: ['powerwatch'] },
      { id: 'push', name: 'Push notifications (FCM)', tier: 'shipped', evidence: 'PowerWatch outage alerts', missions: ['powerwatch'] },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    icon: 'cloud',
    blurb: 'Getting code to production safely, and keeping it there.',
    skills: [
      { id: 'git', name: 'Git', tier: 'pro', evidence: 'Every project, every day' },
      { id: 'gha', name: 'GitHub Actions', tier: 'pro', evidence: 'Release automation at Solutech; CI on personal projects', missions: ['sat-platform', 'gemvist-motors'] },
      { id: 'bitbucket', name: 'Bitbucket + Envoyer', tier: 'pro', evidence: 'Zydii CI/CD and zero-downtime deploys', missions: ['zydii'] },
      { id: 'gcp', name: 'Google Cloud', tier: 'pro', evidence: 'Zydii hosting and pipelines', missions: ['zydii'] },
      { id: 'aws', name: 'AWS & Vultr', tier: 'pro', evidence: 'Managed staging and production at StepWise' },
      { id: 'docker', name: 'Docker', tier: 'shipped', evidence: 'Part of my Cloud & DevOps toolkit (CV)' },
      { id: 'nginx', name: 'Nginx', tier: 'shipped', evidence: 'Hands-on web server configuration' },
      { id: 'do', name: 'DigitalOcean', tier: 'shipped', evidence: 'Hosting and deployments (CV)' },
      { id: 'k8s', name: 'Kubernetes', tier: 'training', evidence: 'KCNA certified; deploying demo stacks on minikube', badge: 'KCNA' },
      { id: 'azure', name: 'Azure', tier: 'training', evidence: 'Fundamentals, alongside .NET' },
    ],
  },
  {
    id: 'gamedev',
    name: 'Game Dev',
    icon: 'gamepad-2',
    blurb: 'Where it all started. Building the kind of thing I grew up playing.',
    skills: [
      { id: 'unity', name: 'Unity', tier: 'shipped', evidence: 'Ninja Danger (published) and GravityPoint', missions: ['ninja-danger', 'never-nigh'] },
      { id: 'csharp', name: 'C#', tier: 'shipped', evidence: 'Gameplay systems: procedural levels, combat, menus', missions: ['ninja-danger', 'never-nigh'] },
      { id: 'pixel', name: 'Pixel art (Aseprite)', tier: 'shipped', evidence: 'GravityPoint tiles, torches and sprites', missions: ['never-nigh'] },
      { id: 'gamefeel', name: 'Game feel', tier: 'shipped', evidence: 'Hit-stop, camera shake (Cinemachine), sprite flashes', missions: ['never-nigh'] },
      { id: 'webgames', name: 'Browser games', tier: 'shipped', evidence: 'The RGBs Game, Reaction Time', missions: ['rgbs', 'reaction-time'] },
    ],
  },
];
