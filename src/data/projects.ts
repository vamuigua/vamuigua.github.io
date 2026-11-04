/**
 * Missions (projects). Descriptions are based on the original portfolio pages,
 * repository READMEs and Victor's CV. Dates are deliberately not shown (removed
 * from the original UI by Victor in b1c9650).
 *
 * Images live in src/assets/missions/<slug>/<slug>-<n>.(png|jpg) and are optimised at build time.
 */
export type MissionTier = 'main' | 'side' | 'game' | 'archive';
export type MissionCategory = 'professional' | 'web' | 'mobile' | 'game' | 'api';
export type MissionStatus = 'live' | 'published' | 'code' | 'private' | 'in-dev' | 'offline' | 'archived';

export interface Mission {
  slug: string;
  title: string;
  tier: MissionTier;
  categories: MissionCategory[];
  status: MissionStatus;
  /** One line for cards. */
  summary: string;
  /** Who it was for and Victor's role. */
  role: string;
  context: string;
  problem: string;
  contribution: string[];
  stack: { name: string; use: string }[];
  links: { github?: string; live?: string; docs?: string; itch?: string };
  /** Source lives in a private repository: show 'walkthrough on request' instead of a link. */
  privateRepo?: boolean;
  /** Former or alternative name. */
  aka?: string;
  /** Lucide icon used for the generated cover when there are no screenshots. */
  emblem?: string;
  /** Alt text per screenshot, in file order. Empty array = no screenshots. */
  shots: string[];
  /** Index into shots used for the card cover. */
  cover?: number;
  /** Optional demo video in /public/media. */
  video?: string;
  /** Note shown on the dossier (e.g. why a demo is offline). */
  note?: string;
  /** Previous URL on the original site, kept working via redirect. */
  legacyPath?: string;
}

export const missions: Mission[] = [
  {
    slug: 'zydii',
    title: 'Zydii',
    tier: 'main',
    categories: ['professional', 'web', 'api'],
    status: 'live',
    summary: 'Localised digital-learning platform for African businesses, migrated and scaled from the inside.',
    role: 'Full Stack Engineer on the product team (Dec 2022 to Oct 2024)',
    context:
      'Zydii offers businesses a catalogue of localised African courses co-created with vetted instructors, delivered through the web, WhatsApp, USSD and SMS, with points, certificates and leaderboards to keep learners engaged.',
    problem:
      'The platform ran on an ageing CakePHP monolith that was slow to change and slow to load, while finance and content operations still leaned on manual work.',
    contribution: [
      'Led the migration from CakePHP to Laravel: roughly 25% faster overall and a codebase the team could test and extend.',
      'Added Redis caching to the hottest data paths, cutting latency by 40%.',
      'Integrated QuickBooks for invoicing and payment history, automating finance reconciliation.',
      'Worked across the platform’s third-party integrations, including Africa’s Talking (SMS) and Brevo (email).',
      'Automated course-transcript clean-up with OpenAI-powered scripts, removing about 80% of the manual effort.',
      'Owned REST API contracts for analytics, finance and learning, and ran CI/CD on Bitbucket, Envoyer and GCP.',
    ],
    stack: [
      { name: 'Laravel', use: 'core backend after the migration' },
      { name: 'Livewire + Alpine.js', use: 'reactive server-driven UI' },
      { name: 'MySQL + Redis', use: 'storage and caching' },
      { name: 'QuickBooks API', use: 'invoices and payment history' },
      { name: 'Africa’s Talking', use: 'SMS notifications' },
      { name: 'Brevo', use: 'transactional email' },
      { name: 'GCP · Envoyer · Bitbucket', use: 'CI/CD and hosting' },
    ],
    links: { live: 'https://zydii.com/' },
    shots: [
      'Zydii marketing homepage: “Improve performance through shared knowledge”',
      'Zydii learner login screen',
      'Learner dashboard with continue-learning carousel, certificates and leaderboard position',
      'Course catalogue grid with personal development courses',
      'Course listing with ratings and progress',
      'Learner achievements page showing points earned and certificates',
    ],
    legacyPath: 'zydii.html',
  },
  {
    slug: 'sat-platform',
    title: 'SAT Platform Upgrade',
    tier: 'main',
    categories: ['professional', 'api'],
    status: 'private',
    summary: 'Technical ownership of Solutech’s core enterprise platform: upgrade, SAP integration and Protobuf contracts.',
    role: 'Senior Full Stack Engineer and technical owner (Oct 2024 to present)',
    context:
      'SAT is the enterprise platform behind Solutech’s connected business applications, including the fleet-management and logistics workflows used across several regional markets.',
    problem:
      'A business-critical platform had to keep running while it was modernised. It also needed to exchange data reliably with SAP and other services, and many of its integration payloads were unstructured.',
    contribution: [
      'Led the end-to-end upgrade: reduced technical debt, improved security posture and set the platform up to keep scaling.',
      'Architected a Protocol Buffers serialisation layer so services communicate through strict, compact schemas.',
      'Built secure, bidirectional SAT ↔ SAP integration that automates operational workflows.',
      'Added retries, circuit breakers, structured error handling and observability hooks to production services.',
      'Contributed to fleet-management, trip-allocation and route-optimisation workflows.',
      'Introduced GitHub Actions release automation and team standards for reviews, API design and tests.',
    ],
    stack: [
      { name: 'Laravel / PHP', use: 'platform backend' },
      { name: 'Protocol Buffers', use: 'inter-service contracts' },
      { name: 'SAP integration', use: 'ERP data exchange' },
      { name: 'Redis', use: 'caching' },
      { name: 'GitHub Actions', use: 'CI/CD' },
    ],
    links: {},
    emblem: 'building-2',
    shots: [],
    note: 'Proprietary client work, so there are no screenshots or code. The details here match what is public on my CV.',
  },
  {
    slug: 'powerwatch',
    title: 'PowerWatch',
    tier: 'main',
    categories: ['api', 'mobile'],
    status: 'private',
    privateRepo: true,
    emblem: 'plug-zap',
    summary: 'Know whether your home has power from anywhere: heartbeats, MQTT Last Will and instant push alerts.',
    role: 'Solo project: architecture, backend, mobile app and device clients',
    context:
      'A small device at home (a router, an ESP32 dongle or an old Android phone) sends a heartbeat to the PowerWatch server every minute. When the heartbeats stop, the server marks the home offline and notifies you; when power returns, it tells you how long the outage lasted.',
    problem:
      'Power cuts at home are invisible while you’re away. The solution has to work behind any NAT or CGNAT with nothing exposed to the internet, and it must tell a real power outage apart from an internet outage without crying wolf.',
    contribution: [
      'Designed outbound-only heartbeats over HTTPS, so homes need no open ports or port forwarding.',
      'Built a hysteresis state machine (online → suspected → offline) that absorbs router reboots and blips without false alarms.',
      'Added “dying gasp” reports from battery-backed devices to distinguish power loss from internet loss.',
      'Ran a parallel MQTT connection with Last Will & Testament for faster dead-connection detection.',
      'Added a mass-failure guard: if most homes go stale at once, it suppresses alerts and raises an ops alarm instead.',
      'Stored device tokens only as SHA-256 hashes, used Sanctum auth for users and sent FCM push to a Flutter monitor app.',
      'Wrote heartbeat clients for MikroTik (RouterOS), OpenWrt and ESP32 firmware.',
    ],
    stack: [
      { name: 'Laravel 13 · PHP 8.3', use: 'API, sweeper and notifications' },
      { name: 'PostgreSQL + Redis', use: 'state history and last-seen cache' },
      { name: 'Mosquitto (MQTT)', use: 'Last-Will connection monitoring' },
      { name: 'Flutter', use: 'monitor and beacon app' },
      { name: 'Firebase Cloud Messaging', use: 'push alerts' },
      { name: 'ESP32 · RouterOS · OpenWrt', use: 'device heartbeats' },
    ],
    links: {},
    shots: [],
  },
  {
    slug: 'meeting-minutes',
    title: 'Meeting Minutes',
    tier: 'main',
    categories: ['web', 'api'],
    status: 'private',
    privateRepo: true,
    emblem: 'audio-lines',
    summary: 'Upload a meeting recording, get trustworthy, editable minutes, with an AI that is told never to invent facts.',
    role: 'Solo project: product, architecture and full-stack build',
    context:
      'A pipeline that turns recordings into minutes: upload, normalise audio, transcribe with speaker separation, analyse with an LLM, edit, then export to PDF, DOCX, Markdown or plain text.',
    problem:
      'People act on minutes: an owner’s name starts work, and a deadline gets planned around. An AI summary that invents a plausible owner or date is worse than a visible gap, so trustworthiness had to shape every design decision.',
    contribution: [
      'Constrained the LLM analysis to never invent names, owners, deadlines or decisions: it says “Not specified” instead.',
      'Streamed uploads up to 2 GB straight to disk, detecting formats from magic bytes rather than filenames.',
      'Normalised audio with ffmpeg (invoked safely, never through a shell string) to small mono Opus files.',
      'Built a preparation step to trim, order and stitch several recordings before anything reaches a paid API.',
      'Streamed live, stage-by-stage progress to the UI over server-sent events.',
      'Put speech-to-text and LLM providers behind interfaces with fixture implementations, so the full app and test suite run with no API keys.',
    ],
    stack: [
      { name: 'Nuxt 4 · Vue 3 · TypeScript', use: 'app and Nitro server' },
      { name: 'Prisma + SQLite', use: 'data and job queue' },
      { name: 'ffmpeg', use: 'audio normalisation' },
      { name: 'AssemblyAI', use: 'transcription with diarisation' },
      { name: 'Anthropic Claude', use: 'meeting analysis' },
      { name: 'Vitest', use: 'unit and end-to-end tests' },
    ],
    links: {},
    shots: [],
  },
  {
    slug: 'remss',
    title: 'REMSS',
    tier: 'main',
    categories: ['web'],
    status: 'offline',
    summary: 'Real-estate management system with M-Pesa and PayPal payments, invoicing, reporting and scheduling.',
    role: 'Solo project: product design, backend and frontend',
    context:
      'REMSS (Real Estate Management & Service System) helps property managers run commercial and rental properties: tenants, invoices, payments, notices and events in one place.',
    problem:
      'Property managers juggle rent collection, invoicing, expenditure tracking and tenant communication across spreadsheets, phone calls and paper.',
    contribution: [
      'Designed the data model and built the Laravel backend for properties, tenants, invoices and payments.',
      'Integrated M-Pesa and PayPal for online rent payments.',
      'Built dynamic invoice forms in Vue.js.',
      'Added Chart.js expenditure reports by month and year, plus FullCalendar event scheduling.',
      'Delivered tenant notifications and a public property-listing site.',
    ],
    stack: [
      { name: 'Laravel / PHP', use: 'backend and admin' },
      { name: 'Vue.js', use: 'dynamic invoice forms' },
      { name: 'M-Pesa + PayPal APIs', use: 'online payments' },
      { name: 'Chart.js', use: 'expenditure reporting' },
      { name: 'FullCalendar', use: 'event scheduling' },
    ],
    links: { github: 'https://github.com/vamuigua/remss' },
    shots: [
      'REMSS public site hero: “Find your place with our local life style”',
      'Admin dashboard with tenant, invoice and payment tiles above an expenditure bar chart',
      'Invoice detail with line items and totals',
      'Tenant notifications feed',
      'Scheduled events calendar',
      'Featured property listings',
    ],
    note: 'The live demo domain has lapsed, so the code is on GitHub for now.',
    legacyPath: 'remss.html',
  },
  {
    slug: 'myparking',
    title: 'myParking',
    tier: 'main',
    categories: ['web', 'api'],
    status: 'offline',
    summary: 'Parking-management SPA in Vue 3, backed by a documented Laravel REST API secured with Sanctum.',
    role: 'Solo project: API design, backend and frontend',
    context:
      'myParking lets drivers register vehicles, start and stop parking sessions in priced zones, and review their parking history and costs.',
    problem:
      'A deliberately decoupled exercise: a clean, documented API that any client could consume, with a modern SPA on top of it.',
    contribution: [
      'Designed and documented a versioned REST API (registration, auth, profiles, vehicles, parking sessions).',
      'Protected endpoints with Laravel Sanctum token authentication.',
      'Built the Vue 3 + Vite frontend with Pinia state management and Tailwind CSS.',
      'Priced parking sessions by zone, showing running and total costs.',
    ],
    stack: [
      { name: 'Laravel + Sanctum', use: 'REST API and auth' },
      { name: 'Vue 3 + Vite', use: 'single-page app' },
      { name: 'Pinia', use: 'client state' },
      { name: 'Tailwind CSS', use: 'styling' },
      { name: 'MySQL', use: 'database' },
    ],
    links: { github: 'https://github.com/vamuigua/car_parking_app' },
    shots: [
      'Active parkings list showing two vehicles with running costs',
      'My vehicles list with edit and delete actions',
      'Parking history entry with total cost',
      'Parking order detail: zone, price per hour, start, stop and total',
      'Generated API documentation for the register endpoint',
    ],
    note: 'The live demo and API docs domain has lapsed, so the code is on GitHub for now.',
    legacyPath: 'myparking.html',
  },
  {
    slug: 'gemvist-motors',
    title: 'Gemvist Motors',
    tier: 'main',
    categories: ['web'],
    status: 'offline',
    summary: 'Vehicle marketplace with price-range search, galleries and an admin CMS, tested in CI against MySQL and SQLite.',
    role: 'Solo project: design, backend and frontend',
    context: 'An online marketplace for buying and selling vehicles with a straightforward, hassle-free experience.',
    problem:
      'Car buyers need to filter listings quickly by make, model and budget, and sellers need a simple way to publish vehicles with many photos.',
    contribution: [
      'Built the Laravel marketplace and admin area for managing vehicle listings.',
      'Used Vue.js for dynamic listing forms and Dropzone for drag-and-drop multi-image uploads.',
      'Added price-range filtering with Ion.RangeSlider and lightbox galleries.',
      'Set up GitHub Actions test workflows against both MySQL and SQLite.',
    ],
    stack: [
      { name: 'Laravel / PHP', use: 'backend and admin' },
      { name: 'Vue.js', use: 'dynamic forms' },
      { name: 'Dropzone.js', use: 'image uploads' },
      { name: 'GitHub Actions', use: 'automated tests' },
    ],
    links: { github: 'https://github.com/vamuigua/motorshop' },
    shots: [
      'Gemvist Motors homepage hero with a sports car',
      'Search filters with price-range slider above vehicle results',
      'Vehicle detail page with photo gallery and specifications',
      'Admin table of vehicle listings',
      'Admin vehicle detail with photos',
    ],
    note: 'The live demo domain has lapsed, so the code is on GitHub for now.',
    legacyPath: 'motorshop.html',
  },
  {
    slug: 'restock',
    title: 'REstock',
    tier: 'main',
    categories: ['mobile'],
    status: 'code',
    summary: 'Flutter shopping-list app with categories and real-time sync across devices via Firebase.',
    role: 'Solo project: design and development',
    context: 'REstock helps households build and manage shopping lists for groceries and pantry items.',
    problem: 'Shopping lists get lost between phones and family members. They need to sync instantly and stay organised.',
    contribution: [
      'Built the cross-platform app in Flutter and Dart.',
      'Stored and synced items through Firebase Realtime Database over HTTP.',
      'Added categories (vegetables, dairy, carbs, meat…) and edit/delete flows.',
    ],
    stack: [
      { name: 'Flutter + Dart', use: 'cross-platform UI and logic' },
      { name: 'Firebase Realtime Database', use: 'storage and sync' },
    ],
    links: { github: 'https://github.com/vamuigua/REstock' },
    shots: ['REstock app icon: a shopping cart with a tick on a phone'],
    video: 'restock-demo.mp4',
    legacyPath: 'restock.html',
  },
  {
    slug: 'ninja-danger',
    title: 'Ninja Danger',
    tier: 'game',
    categories: ['game'],
    status: 'published',
    summary: 'Top-down survival shooter: a ninja lost in a haunted forest, fighting through the night.',
    role: 'Solo developer: design, code and art',
    context:
      'A top-down shooter in which you defend a lost ninja against the creatures of a haunted forest and survive until morning.',
    problem: 'My first complete game: take an idea from prototype to a published, playable build.',
    contribution: [
      'Programmed movement, shooting, enemies and weapon pick-ups in C# with Unity.',
      'Created the art in Photoshop.',
      'Published the game on itch.io under Vocast Games.',
    ],
    stack: [
      { name: 'Unity', use: 'game engine' },
      { name: 'C#', use: 'gameplay code' },
      { name: 'Photoshop', use: 'art' },
    ],
    links: { github: 'https://github.com/vamuigua/Ninja-Danger', itch: 'https://vocastgames.itch.io/ninja-danger' },
    shots: [
      'Ninja Danger title card',
      'Main menu with Play, Rules and Quit and the control scheme',
      'Gameplay: the ninja among weapon pick-ups',
      'Gameplay: fighting off a swarm of bat creatures',
      'Gameplay: a ghost and bats closing in',
    ],
    cover: 1,
    legacyPath: 'ninja_danger.html',
  },
  {
    slug: 'never-nigh',
    title: 'GravityPoint',
    aka: 'Never Nigh',
    tier: 'game',
    categories: ['game'],
    status: 'in-dev',
    privateRepo: true,
    summary: 'Rogue-like 2D platformer where you flip gravity to escape procedurally generated dungeons.',
    role: 'Solo developer: design, code and pixel art',
    context:
      'A 2D rogue-like platformer built around one mechanic: manipulate gravity to find your way out of each level. I started it in 2020 as Never Nigh and picked it back up in 2026, working through a milestone roadmap.',
    problem:
      'Making a single mechanic, gravity flipping, feel fresh room after room, and making combat feel snappy and readable.',
    contribution: [
      'Built procedural generation of rooms, keys, doors and player spawns in C# with Unity.',
      'Wrote gravity-flip movement, melee combat with damage tiers and a configurable attack dash.',
      'Added game feel: Cinemachine camera shake, sprite flashes, hit-stop, plus death and flip effects.',
      'Shipped depth progression, score, pickups and a minimap.',
      'Built pause, options and controls menus with gamepad support, plus an audio manager for SFX and music.',
      'Drew the pixel-art tiles, torches and characters in Aseprite.',
    ],
    stack: [
      { name: 'Unity', use: 'engine, Cinemachine camera' },
      { name: 'C#', use: 'gameplay systems' },
      { name: 'Aseprite', use: 'pixel art' },
    ],
    links: {},
    shots: [
      'Never Nigh title screen with torches and Begin / Options buttons',
      'Gameplay in a torch-lit dungeon level',
      'Gameplay: platforms and spikes in a wider room',
      'Gameplay: a long dungeon corridor',
      'Gameplay: a lower dungeon chamber',
    ],
    note: 'Screenshots are from the original 2020 build; the 2026 revival is in active development.',
    legacyPath: 'never-nigh.html',
  },
  {
    slug: 'rgbs',
    title: 'The RGBs Game',
    tier: 'game',
    categories: ['game', 'web'],
    status: 'live',
    summary: 'Endless colour-guessing PWA: read the RGB value, pick the matching swatch.',
    role: 'Solo project',
    context: 'A quick, endless browser game that tests how well you can read RGB colour values.',
    problem: 'A playful way to train an eye for colour codes, and a hands-on lesson in vanilla JavaScript and PWAs.',
    contribution: [
      'Wrote the game logic in vanilla JavaScript with easy and hard modes.',
      'Made it installable and offline-capable as a PWA.',
    ],
    stack: [
      { name: 'HTML · CSS · JavaScript', use: 'game' },
      { name: 'Progressier', use: 'PWA setup' },
    ],
    links: { github: 'https://github.com/vamuigua/RGBs-Color-Game', live: 'https://rgbs.netlify.app/' },
    shots: [
      'RGB colour game board with six swatches',
      'Correct answer: every swatch turns the target green',
      'A wrong guess removes swatches',
      'Correct answer in magenta',
    ],
    legacyPath: 'rgbs.html',
  },
  {
    slug: 'webhook-machine',
    title: 'Webhook Machine',
    tier: 'side',
    categories: ['api'],
    status: 'code',
    summary: 'Two Laravel apps exchanging signed webhooks, processed through queued jobs and notifications.',
    role: 'Solo project',
    context:
      'A server app schedules jobs that send data to a client app over webhooks. The client verifies each request and processes it with a queued job that sends a notification.',
    problem: 'A reference implementation of reliable, asynchronous app-to-app communication with webhooks.',
    contribution: [
      'Built the server (sender) and client (receiver) Laravel apps.',
      'Used Spatie’s webhook server and client packages with queued processing.',
    ],
    stack: [
      { name: 'Laravel', use: 'both apps' },
      { name: 'Spatie webhook packages', use: 'signing and delivery' },
      { name: 'Queues', use: 'async processing' },
    ],
    links: { github: 'https://github.com/vamuigua/webhook-machine' },
    emblem: 'webhook',
    shots: [],
  },
  {
    slug: 'tdd-journey',
    title: 'TDD Journey',
    tier: 'side',
    categories: ['api'],
    status: 'code',
    summary: 'Laravel REST API built test-first, with JWT authentication and CI test runs.',
    role: 'Solo project',
    context: 'A recipes CRUD API where users own their recipes, built entirely through test-driven development.',
    problem: 'Practising red-green-refactor on a real API surface, including auth and relationships.',
    contribution: [
      'Wrote PHPUnit feature tests first, then the endpoints.',
      'Secured routes with JSON Web Token authentication.',
      'Ran the test suite against MySQL in GitHub Actions.',
    ],
    stack: [
      { name: 'Laravel', use: 'API' },
      { name: 'PHPUnit', use: 'tests' },
      { name: 'JWT', use: 'auth' },
    ],
    links: { github: 'https://github.com/vamuigua/tdd-journey' },
    emblem: 'flask-conical',
    shots: [],
  },
  {
    slug: 'tours-booking',
    title: 'Tours Booking',
    tier: 'side',
    categories: ['web', 'api'],
    status: 'code',
    summary: 'Laravel API and Vue frontend for booking tours, issuing tickets and admin management.',
    role: 'Coding challenge, solo',
    context: 'Users browse and book tours and receive tickets. Admins create tours and review bookings and tickets.',
    problem: 'Deliver a complete CRUD API and its consuming frontend against a fixed brief and schema.',
    contribution: [
      'Built the REST API and data model in Laravel.',
      'Built the Vue.js frontend for both user and admin flows.',
    ],
    stack: [
      { name: 'Laravel', use: 'REST API' },
      { name: 'Vue.js', use: 'frontend' },
    ],
    links: { github: 'https://github.com/vamuigua/tours_booking_app' },
    emblem: 'ticket',
    shots: [],
  },
  {
    slug: 'reaction-time',
    title: 'Reaction Time',
    tier: 'side',
    categories: ['web', 'game'],
    status: 'live',
    summary: 'Vue 3 PWA that measures how fast you react, on desktop or mobile.',
    role: 'Solo project',
    context: 'Wait for the block to appear, click it as fast as you can, and get a rank for your reflexes.',
    problem: 'A small, installable app for learning Vue 3 component lifecycles and PWA tooling.',
    contribution: [
      'Built the timing game with Vue 3.',
      'Made it an installable PWA with generated icons for every device.',
    ],
    stack: [
      { name: 'Vue 3', use: 'app' },
      { name: 'Vue PWA plugin', use: 'offline and install' },
    ],
    links: { github: 'https://github.com/vamuigua/reaction-time', live: 'https://reaction-time-game.netlify.app/' },
    shots: [
      'Reaction Time logo',
      'Start screen with Play button',
      'Get ready: the click target appears',
      'Result: 320 ms, rank “Rapid Reflexes”',
    ],
    cover: 3,
    legacyPath: 'reaction-time.html',
  },
  {
    slug: 'vue-weather',
    title: 'Vue Weather',
    tier: 'side',
    categories: ['web'],
    status: 'live',
    summary: 'Vue 3 weather app pulling live conditions for any city from the OpenWeather API.',
    role: 'Solo project',
    context: 'Search any city or town and get its current temperature and conditions.',
    problem: 'Practising API consumption and reactive UI in Vue 3.',
    contribution: ['Built the Vue 3 app and integrated the OpenWeather API.'],
    stack: [
      { name: 'Vue 3', use: 'app' },
      { name: 'OpenWeather API', use: 'weather data' },
    ],
    links: { github: 'https://github.com/vamuigua/vue-weather', live: 'https://vue-getweather.netlify.app/' },
    shots: [
      'Nairobi: 26°C, broken clouds',
      'California: 0°C, overcast clouds',
      'Pop, Uzbekistan: 13°C, clear sky',
      'Cairns: 24°C, scattered clouds',
    ],
    legacyPath: 'vue-weather.html',
  },
  {
    slug: 'stick-it',
    title: 'Stick-it',
    tier: 'side',
    categories: ['web'],
    status: 'live',
    summary: 'Sticky-notes PWA that keeps your notes with you on any device.',
    role: 'Solo project',
    context: 'Create colourful sticky notes and keep them on mobile, laptop or desktop.',
    problem: 'A simple, offline-friendly note board built with vanilla web tech.',
    contribution: ['Built the note board in vanilla JavaScript as a progressive web app.'],
    stack: [{ name: 'HTML · CSS · JavaScript', use: 'PWA' }],
    links: { github: 'https://github.com/vamuigua/stick-it', live: 'https://stick-it-notes.netlify.app/' },
    shots: [
      'Board with four coloured sticky notes',
      'Note form with title and content fields',
      'Empty board',
      'Two notes on the board',
    ],
    legacyPath: 'stick-it.html',
  },
  {
    slug: 'e-mall',
    title: 'e-MALL',
    tier: 'archive',
    categories: ['web', 'api'],
    status: 'archived',
    summary: 'Group project: discover the shops and services inside malls, with a public API.',
    role: 'Group project, Ruby on Rails',
    context:
      'A platform for finding detailed information about the businesses inside shopping malls, remotely, with an API for third parties.',
    problem: 'Finding what a mall offers usually means walking it.',
    contribution: ['Built as part of a team using Ruby on Rails, with Google Maps for mall locations.'],
    stack: [
      { name: 'Ruby on Rails', use: 'app and API' },
      { name: 'Google Maps', use: 'mall locations' },
    ],
    links: {},
    shots: ['e-MALL landing page over an aerial mall photo', 'All malls listing', 'Mall detail with a map'],
    note: 'Archived: the Heroku free tier that hosted the demo was retired.',
    legacyPath: 'emall.html',
  },
];

export const tierLabel: Record<MissionTier, string> = {
  main: 'Main quest',
  side: 'Side quest',
  game: 'Game dev',
  archive: 'Archive',
};

export const statusLabel: Record<MissionStatus, string> = {
  live: 'Live',
  published: 'Published',
  code: 'Source on GitHub',
  private: 'Private repo',
  'in-dev': 'In development',
  offline: 'Demo offline',
  archived: 'Archived',
};

export const categoryLabel: Record<MissionCategory, string> = {
  professional: 'Professional',
  web: 'Web',
  mobile: 'Mobile',
  game: 'Games',
  api: 'APIs & backend',
};
