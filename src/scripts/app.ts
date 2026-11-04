/**
 * Site-wide interactions. Everything here is progressive enhancement: all
 * content and links work without JavaScript.
 */
import { blip, isSoundOn, setSound } from './sound';

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------ storage */
const store = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, val: string) {
    try {
      localStorage.setItem(key, val);
    } catch {
      /* ignore */
    }
  },
};

/* ------------------------------------------------------------ toasts */
function toast(label: string, title: string, iconSvg = '') {
  const host = $('#toasts');
  if (!host) return;
  const el = document.createElement('div');
  el.className = 'toast pixel-frame';
  el.innerHTML = `<span class="toast__icon">${iconSvg}</span><span><span class="toast__label"></span><br><span class="toast__title"></span></span>`;
  $('.toast__label', el)!.textContent = label;
  $('.toast__title', el)!.textContent = title;
  host.append(el);
  setTimeout(() => {
    el.classList.add('is-leaving');
    setTimeout(() => el.remove(), 340);
  }, 3600);
}

/* ------------------------------------------------------------ HUD */
function initHud() {
  const hud = $('[data-hud]');
  const xp = $('[data-xp]');
  if (!hud) return;

  const onScroll = () => {
    const y = window.scrollY;
    hud.classList.toggle('is-solid', y > 24);
    if (xp) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      xp.style.setProperty('--xp', String(max > 0 ? Math.min(1, y / max) : 0));
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active section in nav + "Cartographer" secret
  const links = $$<HTMLAnchorElement>('[data-nav]');
  const regions = $$('[data-region]');
  const seen = new Set<string>();
  if (links.length && regions.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = e.target.id;
          seen.add(id);
          links.forEach((a) => a.setAttribute('aria-current', String(a.dataset.nav === id)));
          if (seen.size === regions.length) unlockSecret('explorer');
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    regions.forEach((r) => io.observe(r));
  }

  // Sound toggle
  const sound = $$<HTMLButtonElement>('[data-sound-toggle]');
  const syncSound = () => sound.forEach((b) => b.setAttribute('aria-pressed', String(isSoundOn())));
  syncSound();
  sound.forEach((b) =>
    b.addEventListener('click', () => {
      setSound(!isSoundOn());
      syncSound();
    }),
  );

  // Mobile pause menu
  const menu = $('[data-menu]');
  const openBtn = $<HTMLButtonElement>('[data-menu-open]');
  if (menu && openBtn) {
    const panel = $('[role="dialog"]', menu)!;
    const open = () => {
      menu.hidden = false;
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      $<HTMLElement>('a, button', panel)?.focus();
      blip('confirm');
    };
    const close = (restore = true) => {
      menu.hidden = true;
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (restore) openBtn.focus();
    };
    openBtn.addEventListener('click', open);
    $$('[data-menu-close]', menu).forEach((el) => el.addEventListener('click', () => close()));
    $$('[data-menu-link]', menu).forEach((el) => el.addEventListener('click', () => close(false)));
    $$('[data-quickview-open]', menu).forEach((el) => el.addEventListener('click', () => close(false)));
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = $$<HTMLElement>('a, button', panel);
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
}

/* ------------------------------------------------------------ Quick view */
function initQuickView() {
  const dlg = $<HTMLDialogElement>('#quickview');
  if (!dlg) return;
  let opener: HTMLElement | null = null;
  const open = () => {
    if (dlg.open) return;
    opener = document.activeElement as HTMLElement;
    dlg.showModal();
    blip('confirm');
  };
  $$('[data-quickview-open]').forEach((b) => b.addEventListener('click', open));
  $$('[data-quickview-close]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close(); // backdrop
  });
  dlg.addEventListener('close', () => {
    blip('back');
    opener?.focus?.();
  });
  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, select, [contenteditable]')) return;
    if ((e.key === 'q' || e.key === 'Q') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      dlg.open ? dlg.close() : open();
    }
  });
}

/* ------------------------------------------------------------ Title menu */
function initTitleMenu() {
  const menu = $('[data-title-menu]');
  if (!menu) return;
  const items = $$<HTMLAnchorElement>('[data-menu-item]', menu);
  let idx = 0;
  const setActive = (i: number, focus = true) => {
    idx = (i + items.length) % items.length;
    items.forEach((a, j) => a.classList.toggle('is-active', j === idx));
    if (focus) items[idx].focus();
  };
  items.forEach((a, i) => {
    a.addEventListener('mouseenter', () => {
      if (idx !== i) blip('move');
      setActive(i, false);
    });
    a.addEventListener('focus', () => setActive(i, false));
    a.addEventListener('click', () => blip('confirm'));
  });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(idx + 1);
      blip('move');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(idx - 1);
      blip('move');
    }
  });
  menu.addEventListener('mouseleave', () => items.forEach((a) => a.classList.remove('is-active')));
}

/* ------------------------------------------------------------ Reveal */
function initReveal() {
  const els = $$('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  els.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------ Missions */
function initMissionFilters() {
  const buttons = $$<HTMLButtonElement>('[data-filter]');
  if (!buttons.length) return;
  const cards = $$('[data-mission]');
  const groups = $$('[data-group]');
  const status = $('[data-filter-status]');
  buttons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter!;
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      let shown = 0;
      cards.forEach((c) => {
        const match = f === 'all' || (c.dataset.categories ?? '').split(' ').includes(f);
        c.hidden = !match;
        if (match) {
          shown++;
          c.classList.add('is-visible');
        }
      });
      groups.forEach((g) => (g.hidden = !$$('[data-mission]:not([hidden])', g).length));
      if (status) status.textContent = `${shown} mission${shown === 1 ? '' : 's'} shown`;
      blip('move');
    }),
  );
}

/* ------------------------------------------------------------ Skill tree */
function initSkillTree() {
  const tree = $('[data-tree]');
  if (!tree) return;
  const nodes = $$<HTMLButtonElement>('[data-skill]', tree);
  const body = $('[data-inspector-body]');
  const base = $('[data-mission-base]')?.textContent ?? '/missions/';
  const tierLabel: Record<string, string> = {
    pro: 'Professional: used in a professional role',
    shipped: 'Shipped in projects',
    training: 'In training: actively levelling up',
  };

  const show = (n: HTMLButtonElement) => {
    nodes.forEach((x) => x.classList.toggle('is-selected', x === n));
    if (!body) return;
    const d = n.dataset;
    body.innerHTML = '';
    const h = document.createElement('h3');
    h.className = 'inspector__name';
    h.textContent = d.name ?? '';
    body.append(h);
    const row = (k: string, v: string | Node) => {
      const r = document.createElement('div');
      r.className = 'inspector__row';
      const kk = document.createElement('span');
      kk.className = 'inspector__k';
      kk.textContent = k;
      r.append(kk);
      if (typeof v === 'string') {
        const vv = document.createElement('span');
        vv.textContent = v;
        r.append(vv);
      } else r.append(v);
      body.append(r);
    };
    row('Branch', d.branch ?? '');
    row('Tier', tierLabel[d.tier ?? ''] ?? '');
    row('Evidence', d.evidence ?? '');
    if (d.missions) {
      const wrap = document.createElement('div');
      const tpl = $<HTMLTemplateElement>('[data-mission-link]');
      for (const pair of d.missions.split(',')) {
        const [slug, title] = pair.split('|');
        if (!tpl) continue;
        const a = tpl.content.firstElementChild!.cloneNode(true) as HTMLAnchorElement;
        a.href = `${base}${slug}/`;
        a.querySelector('span')!.textContent = title;
        wrap.append(a);
      }
      row('Proof', wrap);
    }
    blip('move');
  };
  nodes.forEach((n) => n.addEventListener('click', () => show(n)));

  // Phones: show the first four skills per branch, with a "show all" toggle.
  if (window.matchMedia('(max-width: 640px)').matches) {
    $$<HTMLButtonElement>('[data-branch-more]', tree).forEach((btn) => {
      const branch = btn.closest('.branch')!;
      const label = btn.firstChild!;
      const full = label.textContent ?? '';
      branch.classList.add('is-collapsed');
      btn.hidden = false;
      btn.addEventListener('click', () => {
        const open = branch.classList.toggle('is-collapsed') === false;
        btn.setAttribute('aria-expanded', String(open));
        label.textContent = open ? 'Show fewer ' : full;
      });
    });
  }

  // tier highlighting
  const toggles = $$<HTMLButtonElement>('[data-tier-toggle]');
  toggles.forEach((t) =>
    t.addEventListener('click', () => {
      const on = t.getAttribute('aria-pressed') !== 'true';
      toggles.forEach((x) => x.setAttribute('aria-pressed', String(x === t && on)));
      tree.classList.toggle('is-filtered', on);
      nodes.forEach((n) => n.classList.toggle('is-match', on && n.dataset.tier === t.dataset.tierToggle));
      blip('move');
    }),
  );
}

/* ------------------------------------------------------------ Achievements */
const SECRET_KEY = 'va:secrets';
function foundSecrets(): Set<string> {
  return new Set((store.get(SECRET_KEY) ?? '').split(',').filter(Boolean));
}

function updateAchProgress() {
  const all = $$('[data-ach], [data-secret]');
  if (!all.length) return;
  const unlocked = all.filter((a) => !a.classList.contains('is-locked') && (!a.dataset.secret || a.classList.contains('is-found')));
  const bar = $('[data-ach-bar]');
  const count = $('[data-ach-count]');
  if (bar) bar.style.setProperty('--p', `${(unlocked.length / all.length) * 100}%`);
  if (count) count.textContent = `${unlocked.length}/${all.length}`;
}

function unlockSecret(id: string) {
  const found = foundSecrets();
  const el = $(`[data-secret="${id}"]`);
  if (found.has(id)) return;
  found.add(id);
  store.set(SECRET_KEY, [...found].join(','));
  if (el) {
    el.classList.add('is-found', 'is-unlocking');
    const title = $('.ach__shown', el)?.textContent ?? 'Secret found';
    const icon = $('.ach__gem', el)?.innerHTML ?? '';
    toast('Secret achievement', title, icon);
  } else {
    toast('Secret achievement', 'Secret found');
  }
  blip('unlock');
  updateAchProgress();
}

function initAchievements() {
  const items = $$('[data-ach]');
  const found = foundSecrets();
  $$('[data-secret]').forEach((el) => el.classList.toggle('is-found', found.has(el.dataset.secret!)));

  if (!items.length) return;
  if (reduced || !('IntersectionObserver' in window)) {
    updateAchProgress();
    return;
  }
  items.forEach((el) => el.classList.add('is-locked'));
  updateAchProgress();
  let queue = 0;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const delay = 140 * queue++;
        setTimeout(() => {
          el.classList.remove('is-locked');
          el.classList.add('is-unlocking');
          queue = Math.max(0, queue - 1);
          updateAchProgress();
          if (queue === 0) blip('unlock');
        }, 250 + delay);
      }
    },
    { threshold: 0.6 },
  );
  items.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------ Copy email */
function initCopy() {
  $$<HTMLButtonElement>('[data-copy]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy!;
      const label = $('[data-copy-label]', btn);
      const status = $('[data-copy-status]');
      try {
        await navigator.clipboard.writeText(value);
        if (label) label.textContent = 'Copied!';
        if (status) status.textContent = 'Email address copied to clipboard';
        blip('confirm');
      } catch {
        if (label) label.textContent = 'Press Ctrl+C';
        const r = document.createRange();
        const span = document.createElement('span');
        span.textContent = value;
        btn.append(span);
        r.selectNodeContents(span);
        getSelection()?.removeAllRanges();
        getSelection()?.addRange(r);
        setTimeout(() => span.remove(), 4000);
      }
      setTimeout(() => label && (label.textContent = 'Copy email'), 2200);
    }),
  );
}

/* ------------------------------------------------------------ Worlds */
async function initWorlds() {
  const start = $<HTMLCanvasElement>('[data-world]');
  const end = $<HTMLCanvasElement>('[data-world-end]');
  if (!start && !end) return;
  const { PixelScene } = await import('./scene');
  const scenes: InstanceType<typeof PixelScene>[] = [];
  if (start) {
    scenes.push(new PixelScene(start, { seed: 7, campX: 0.7, campXNarrow: 0.55, onSlime: () => unlockSecret('slime') }));
  }
  if (end) {
    scenes.push(new PixelScene(end, { seed: 21, campX: 0.78, campXNarrow: 0.6, onSlime: () => unlockSecret('slime') }));
  }

  // Konami code → meteor shower
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  document.addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = k === code[pos] ? pos + 1 : k === code[0] ? 1 : 0;
    if (pos === code.length) {
      pos = 0;
      scenes.forEach((s) => s.meteorShower(7));
      unlockSecret('konami');
    }
  });
}

/* ------------------------------------------------------------ Gallery (dossier pages) */
function initGallery() {
  const dlg = $<HTMLDialogElement>('[data-lightbox]');
  if (!dlg) return;
  const img = $<HTMLImageElement>('img', dlg)!;
  const cap = $('[data-lightbox-caption]', dlg);
  const thumbs = $$<HTMLAnchorElement>('[data-shot]');
  let i = 0;
  const show = (n: number) => {
    i = (n + thumbs.length) % thumbs.length;
    const t = thumbs[i];
    img.src = t.href;
    img.alt = t.dataset.alt ?? '';
    if (cap) cap.textContent = `${i + 1} / ${thumbs.length} · ${t.dataset.alt ?? ''}`;
  };
  thumbs.forEach((t, n) =>
    t.addEventListener('click', (e) => {
      e.preventDefault();
      show(n);
      dlg.showModal();
    }),
  );
  $('[data-lightbox-prev]', dlg)?.addEventListener('click', () => show(i - 1));
  $('[data-lightbox-next]', dlg)?.addEventListener('click', () => show(i + 1));
  $('[data-lightbox-close]', dlg)?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => e.target === dlg && dlg.close());
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
}

/* ------------------------------------------------------------ Journey (phones) */
function initJourney() {
  if (!window.matchMedia('(max-width: 640px)').matches) return;
  $$<HTMLDetailsElement>('.node__quests').forEach((d, i) => {
    if (i > 0) d.open = false;
  });
}

initHud();
initJourney();
initQuickView();
initTitleMenu();
initReveal();
initMissionFilters();
initSkillTree();
initAchievements();
initCopy();
initGallery();
void initWorlds();
