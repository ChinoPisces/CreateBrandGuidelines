import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import ScrollMural from "./ScrollMural";
import LoopAnimation from "./LoopAnimation";

const CDN = "https://cdn.prod.website-files.com/6553caa42be844f2b3c45e3f";

const assets = {
  wordmarkEgypt: `${CDN}/6aac551a8b83400598a702e1_c3990ae0a_brownversion.svg`,
  wordmarkAnime: `${import.meta.env.BASE_URL}media/TR_wordmark_carnelian_sunset.svg`,
  heroEgypt: `${import.meta.env.BASE_URL}media/modern-egyptian-ramen-logo.jpg`,
  heroAnime: `${CDN}/6ab492c7fb1e0a368702ecbb_social-09-photo-wall-p-1080.webp`,
  packagingEgypt: `${import.meta.env.BASE_URL}media/modern-egyptian-table-scene.webp`,
  packagingAnime: `${CDN}/6ab492c2fc8cbd991d51af7b_social-01-tabletop-packaging-p-1080.webp`,
  interiorEgypt: `${import.meta.env.BASE_URL}media/modern-egyptian-restaurant-interior.png`,
  detailsEgypt: `${import.meta.env.BASE_URL}media/TE_sc_05.png`,
  storefront: `${CDN}/6ab492c5fc8cbd991d51b16c_social-05-storefront-p-1080.webp`,
  menu: `${CDN}/6ab492c8ad09408dad7910b4_social-10-printed-menu-p-1080.webp`,
  egyptCharacter: `${CDN}/6ab355c2d30b7d7b4f747af5_NinjaMummy_TE_footer.svg`,
  animeCharacter: `${CDN}/6ab355c278494f2cf0cca3ce_NinjaMummy_CA_footer.svg`,
};

type Direction = "egypt" | "anime";

const illustrationSets = {
  egypt: [
    { label: "Pyramid", file: "pyramid_ME.svg" },
    { label: "Sphinx", file: "6abcbdfd30fa67f98c83191f_Sphinx_ME_updated.svg" },
    { label: "Obelisk", file: "Obelisk_ME.svg" },
    { label: "Characters", file: "6ab0d5d8b063e14a3003ce09_Characters_TE_standard.svg" },
    { label: "Gold mask", file: "gold-mask-ME.png" },
  ],
  anime: [
    { label: "Pyramid", file: "Pyramid_CA.svg" },
    { label: "Sphinx", file: "6ab5bbf37ae8620f992af2f5_Sphynx_CA.svg" },
    { label: "Obelisk", file: "6ab0d5da2664b24bb566be58_Obelisk_CA_standard.svg" },
    { label: "Characters", file: "6ab0d5d8b063e14a3003cd86_Characters_CA_standard.svg" },
    { label: "Ninja mummy", file: "6ab355c278494f2cf0cca3ce_NinjaMummy_CA_footer.svg" },
  ],
};

const motionSets = {
  egypt: [
    { label: "Chariot delivery", id: "1183563431", square: false },
    { label: "Date night", id: "1183563437", square: true },
    { label: "Animated monogram", id: "1183563482", square: true },
  ],
  anime: [
    { label: "Chariot delivery", id: "1183563451", square: false },
    { label: "Date night", id: "1183563415", square: true },
    { label: "Animated monogram", id: "1183563470", square: true },
  ],
};


const nav = [
  ["01", "Foundation", "foundation"],
  ["02", "Logo", "logo"],
  ["03", "Color", "color"],
  ["04", "Type", "type"],
  ["05", "Imagery", "imagery"],
  ["06", "Illustration", "illustration"],
  ["07", "Motion", "motion"],
  ["08", "Voice", "voice"],
];

const palettes = {
  egypt: [
    { name: "Papyrus", value: "#D7CDBE", className: "bg-[#D7CDBE] text-[#1C1408]" },
    { name: "Desert Sand", value: "#C8B9A6", className: "bg-[#C8B9A6] text-[#1C1408]" },
    { name: "Obsidian", value: "#1C1408", className: "bg-[#1C1408] text-[#F4EAD3]" },
    { name: "Antique Gold", value: "#B8860B", className: "bg-[#B8860B] text-white" },
    { name: "Lapis Lazuli", value: "#183B82", className: "bg-[#183B82] text-white" },
    { name: "Carnelian Red", value: "#B33A2B", className: "bg-[#B33A2B] text-white" },
  ],
  anime: [
    { name: "Sunlit Papyrus", value: "#F2E3C6", className: "bg-[#F2E3C6] text-[#0A0A0A]" },
    { name: "Sunset", value: "#F3903F", className: "bg-[#F3903F] text-[#0A0A0A]" },
    { name: "Lapis Lazuli", value: "#183B82", className: "bg-[#183B82] text-white" },
    { name: "Carnelian Red", value: "#B33A2B", className: "bg-[#B33A2B] text-white" },
  ],
};

const gradients = {
  egypt: [
    { name: "Gold to Carnelian", from: "#B8860B", to: "#B33A2B", note: "Antique Gold → Carnelian Red" },
    { name: "Lapis to Obsidian", from: "#183B82", to: "#1C1408", note: "Lapis Lazuli → Obsidian" },
    { name: "Gold to Sand", from: "#B8860B", to: "#C8B9A6", note: "Antique Gold → Desert Sand" },
  ],
  anime: [
    { name: "Carnelian to Sunset", from: "#B33A2B", to: "#F3903F", note: "Carnelian Red → Sunset" },
    { name: "Lapis to Obsidian", from: "#183B82", to: "#1C1408", note: "Lapis Lazuli → Obsidian" },
    { name: "Ancient Gold", from: "#FFF0A6", to: "#D4A017", note: "Light Gold → Ancient Gold" },
  ],
};

const brandCopy = {
  "egypt": {
    "hero": "Inspired by Egyptian heritage, made for a contemporary table. Tutenramen brings the comfort of Japanese ramen into a world of sandstone, lapis and gold, with rich symbolism and gracious hospitality shaping the fusion dining experience.",
    "foundation": "Tutenramen brings Japanese ramen and Egyptian imagination to the same table. This fusion dining experience pairs generous bowls with a considered setting, drawing on the richness of Egyptian visual heritage. Stone, precious color and ancient forms lend a sense of ceremony; attentive hospitality makes it welcoming.",
    "foundationNote": "Prestige lives in the care of the experience, from the first impression to the final spoonful. This guide translates that spirit into a consistent system of marks, color, type, imagery and movement.",
    "pillars": [
      "Let the bowl command attention through texture, warmth and generous presentation.",
      "Offer an unhurried welcome, with thoughtful details and hospitality that puts guests at ease.",
      "Draw on Egyptian symbols with purpose, giving guests something meaningful to notice."
    ],
    "logo": "The monogram draws Egyptian symbolism into a contemporary seal; the wordmark gives that seal a name. Let both carry the assurance of a gracious host. Use the approved artwork, preserve its proportions and give it clear space on a calm, contrasting background.",
    "color": "Papyrus, Desert Sand and Obsidian create a composed foundation. Antique Gold recalls precious ornament, Lapis Lazuli lends depth and Carnelian Red brings warmth. Use these accents with restraint, allowing each to earn its place.",
    "gradient": "Let a gradual blend suggest the warmth of metal or the depth of stone. Use only the approved two-color pairings, with one clear direction and no extra color stops.",
    "typeDisplay": "Use Georgia to give headlines the composure of an inscription. Let scale, measured spacing and a clear hierarchy convey distinction.",
    "typeUtility": "Use Montserrat for menus, prices, ingredients and navigation. Practical information deserves the same care as the headline: clear, legible and easy to find.",
    "display": "Heritage at the table",
    "heading": "Rich spices, quiet ceremony",
    "body": "Japanese comfort, Egyptian splendor, a generous bowl to savor.",
    "imagery": "Frame ramen within an Egyptian-inspired setting. Warm light, sandstone tones and rich material details should convey the pleasure of dining here. Use approved photography with consistent branding.",
    "product": "Let steam, broth and noodle texture lead. Give Egyptian motifs on approved packaging room to be seen.",
    "environment": "Show how murals, materials and signage bring Egyptian heritage into the dining experience.",
    "detail": "Look closely at gold details, Egyptian motifs and the branded objects guests touch.",
    "illustration": "Draw on the visual language of Egyptian heritage with clarity and respect. Landmarks establish scale; figures bring ceremony and human connection. Give each element a purpose rather than filling space with symbols.",
    "motion": "Let movement unfold with quiet assurance. Measured gestures and graceful transitions should reveal the scene, invite attention and leave room to appreciate the detail.",
    "voice": "Write with the assurance of a gracious host. Bring Egyptian heritage into focus through materials, symbols and a sense of occasion; describe Japanese ramen through the pleasure of the bowl. Keep the language warm and precise, with menus, prices and service information plain and useful.",
    "menu": "Ramen at the heart, Egyptian inspiration in every detail.",
    "social": "An evening of ramen, warm light and Egyptian imagination.",
    "service": "Welcome to Tutenramen. Allow us to help you choose a bowl to savor.",
    "footerKicker": "Egyptian inspiration, Japanese ramen",
    "footerFirst": "Gold in the details",
    "footerLast": "Warmth in the bowl",
    "rules": {
      "foundation": {
        "do": "Choose the expression for the occasion, then carry its character through the complete experience.",
        "dont": "Choose solely by country or age, or mix expressions without a clear purpose."
      },
      "logo": {
        "do": "Use the approved signature for the background, preserve its proportions and leave at least one cap-height of clear space.",
        "dont": "Redraw, stretch, add effects or combine the two signatures in one lockup."
      },
      "color": {
        "do": "Establish a calm foundation, use accents selectively and preserve readable contrast.",
        "dont": "Give every color equal weight or let decoration make practical information difficult to read."
      },
      "gradient": {
        "do": "Use approved two-stop blends with a gradual transition. Keep one direction within an application and check text contrast across the entire blend.",
        "dont": "Add extra color stops, abrupt bands or drastic shifts between unrelated colors. Avoid stacked gradients that compete with the food, signature or essential information."
      },
      "type": {
        "do": "Give storytelling and practical information distinct roles. Check prices, ingredients and navigation at their actual viewing size.",
        "dont": "Let decorative treatments or tight spacing undermine essential information."
      },
      "imagery": {
        "do": "Use approved photography with consistent branding. Let food, light and materials carry the atmosphere, and compose crops intentionally.",
        "dont": "Introduce conflicting logos, unapproved photography or heavy treatments that obscure the food and setting."
      },
      "illustration": {
        "do": "Use approved artwork, preserve its proportions and give defining details room to be seen.",
        "dont": "Mix illustration styles, distort symbols or crop away defining features and artwork edges."
      },
      "motion": {
        "do": "Use measured movement to reveal detail, create depth or guide attention. Review every frame of the sequence.",
        "dont": "Expose cropped edges, disrupt the composition or compete with essential information."
      },
      "voice": {
        "do": "Connect Egyptian heritage and Japanese ramen through specific details. Keep the welcome warm and assured.",
        "dont": "Invent provenance or let elaborate lore and exaggerated grandeur hide the useful message."
      }
    }
  },
  "anime": {
    "hero": "Pharaohs meet ramen, and chopsticks take center stage. Tutenramen brings Egyptian imagination and Japanese comfort together for fusion dining with big flavor and a cast of characters who take their noodles very seriously.",
    "foundation": "Egyptian imagination meets Japanese ramen. Tutenramen turns fusion dining into a world of generous bowls, expressive pharaohs and warm welcomes. Our characters may have royal titles, but they still have to decide what to order.",
    "foundationNote": "Bring Egyptian tales to life with the expressive charm of Japanese character art. Keep the world recognizable, the welcome generous and every touchpoint easy to enjoy, from the first look at a menu to the last noodle.",
    "pillars": [
      "Make the ramen irresistible. Even a pharaoh should pause before reaching for the last noodle.",
      "Welcome everyone, from first-time ramen guests to chopstick regulars. There is room at this table.",
      "Reward a closer look with Egyptian landmarks, expressive characters and small noodle adventures."
    ],
    "logo": "A little Egyptian drama, a lot of Japanese character charm. The monogram makes an entrance; the wordmark handles introductions. Use the approved artwork and background pairing, keep the proportions intact and leave clear space. Even a character with a royal appetite needs breathing room.",
    "color": "Sunlit Papyrus gives the colors room to play. Sunset brings warmth, Lapis Lazuli adds punch and Carnelian Red draws the eye. Give one color the lead; the others can be its enthusiastic supporting cast.",
    "gradient": "Give the approved color pairs a smooth handoff. Two colors, one direction, no surprise guests. Keep text readable from one end of the blend to the other.",
    "typeDisplay": "Use bold Montserrat for headlines with something to say. Keep them short, give them space, and let the words do the work. A good punchline needs room to land.",
    "typeUtility": "Use Montserrat for menus, prices, ingredients and navigation. Bring personality to the invitation; keep the practical details delightfully obvious.",
    "display": "Ramen, meet Egypt",
    "heading": "Royal appetite, extra noodles",
    "body": "A pharaoh’s appetite, a ramen lover’s happy place.",
    "imagery": "Show a world where Egyptian characters and Japanese ramen feel at home together. Let approved packaging, playful motifs and warm settings bring the personality. Keep the branding consistent and the bowl easy to spot.",
    "product": "Give ramen and approved packaging the spotlight. The pharaoh can share the frame.",
    "environment": "Show how Egyptian landmarks and character details make the restaurant a world guests want to enter.",
    "detail": "Give menus, signs and everyday objects a little of the cast’s personality. Keep their purpose clear.",
    "illustration": "Give pharaohs, queens and the ninja mummy big appetites and readable expressions. Bring Egyptian landmarks into the expressive world of Japanese character art. Let gestures and relationships tell the story; a raised eyebrow can say more than a wall of hieroglyphs.",
    "motion": "Give the cast a little comic timing: a pharaoh reaching for ramen, a queen enjoying a noodle, a ninja mummy making an entrance. Let characters anticipate, react and settle into a clear pose. Keep the loops comfortable and every important feature inside the frame.",
    "voice": "Borrow the cast’s personality: a pharaoh with a ramen craving, a queen negotiating the last noodle, a ninja mummy arriving just in time for lunch. Keep the lines short, warm and appetizing. Menus, ingredients, allergens and prices should be easy to understand.",
    "menu": "Ramen so good, your chopsticks may ask for seconds.",
    "social": "Your ramen is ready. The pyramid can wait.",
    "service": "First ramen with us? Let’s find your favorite bowl.",
    "footerKicker": "Egyptian tales, Japanese ramen",
    "footerFirst": "Pass the ramen",
    "footerLast": "Keep it coming",
    "rules": {
      "foundation": {
        "do": "Choose the expression for the occasion and carry it through the whole application, from the first hello to the last noodle.",
        "dont": "Choose solely by country or age, or turn the two expressions into an accidental mash-up."
      },
      "logo": {
        "do": "Choose the approved signature for the background, keep its proportions and leave at least one cap-height of breathing room.",
        "dont": "Stretch, redraw or add effects to the signature, or squeeze both signatures into one lockup."
      },
      "color": {
        "do": "Give one color the lead, use accents for energy and keep every useful word easy to read.",
        "dont": "Make every color shout at once or put practical information on a background that hides it."
      },
      "gradient": {
        "do": "Use approved two-stop blends with a smooth transition. Keep one direction within an application and check text contrast from end to end.",
        "dont": "Pile on extra color stops, abrupt bands or unrelated colors. Avoid stacked gradients that compete with the ramen, signature or useful information."
      },
      "type": {
        "do": "Keep headlines expressive and practical details clear. Check prices, ingredients and navigation at their actual viewing size.",
        "dont": "Make guests decipher decorative type or crowded spacing before they can order."
      },
      "imagery": {
        "do": "Use approved photography with consistent branding. Give the food top billing and compose crops intentionally.",
        "dont": "Introduce conflicting logos or unapproved photography, or let props and heavy effects steal the bowl’s spotlight."
      },
      "illustration": {
        "do": "Use approved artwork and preserve the proportions, expressions and gestures that make the characters recognizable.",
        "dont": "Mix illustration styles, stretch characters or crop away a face, gesture or defining edge."
      },
      "motion": {
        "do": "Use timing to reveal character, create depth or guide attention. Watch every frame to make sure the joke and the composition land.",
        "dont": "Cut off defining features, expose artwork edges or let movement distract from what guests need to know."
      },
      "voice": {
        "do": "Use the Egyptian cast and its love of ramen for warm, playful lines. Make the useful part easy to find.",
        "dont": "Mock guests, force a joke into every line or make ingredients, allergens and prices part of the punchline."
      }
    }
  }
};

function UsageRules({ doText, dontText }: { doText: string; dontText: string }) {
  return (
    <div className="usage-rules" aria-label="Usage guidance">
      <div><h3>Do</h3><p>{doText}</p></div>
      <div><h3>Don’t</h3><p>{dontText}</p></div>
    </div>
  );
}

function SectionLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em]">
      <span className="opacity-45">{number}</span>
      <span className="h-px w-8 bg-current opacity-30" />
      <span>{children}</span>
    </div>
  );
}

function DirectionSwitch({
  direction,
  onChange,
}: {
  direction: Direction;
  onChange: (direction: Direction) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-current/20 p-1 text-[10px] font-bold uppercase tracking-[0.18em]">
      {(["egypt", "anime"] as const).map((item) => (
        <button
          className={`rounded-full px-4 py-2.5 transition ${
            direction === item ? "bg-current shadow-sm" : "opacity-55 hover:opacity-100"
          }`}
          key={item}
          aria-pressed={direction === item}
          onClick={() => onChange(item)}
          type="button"
        >
          <span className={direction === item ? (item === "egypt" ? "text-[#F4EAD3]" : "text-white") : ""}>
            {item === "egypt" ? "Modern Egyptian" : "Chibi Anime"}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [direction, setDirection] = useState<Direction>("egypt");
  const [copied, setCopied] = useState("");
  const egypt = direction === "egypt";
  const copy = brandCopy[direction];

  useLayoutEffect(() => {
    document.querySelectorAll(".page-content h2, .page-content h3, .page-content p, .page-content figcaption, .page-content li, .expression-card > strong, .voice-examples > article").forEach(group => {
      const walker = document.createTreeWalker(group, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      const copy = nodes.map(node => node.data).join("");
      // Keep only the final pair together; earlier words remain free to wrap.
      const ending = /[ \t\r\n]+(?=\S+\s*$)/.exec(copy);
      if (!ending) return;
      let offset = 0;
      for (const node of nodes) {
        const length = node.length;
        const start = Math.max(0, ending.index - offset);
        const end = Math.min(node.length, ending.index + ending[0].length - offset);
        if (start < end) {
          node.replaceData(start, end - start, offset <= ending.index ? "\u00a0" : "");
        }
        offset += length;
      }
    });
  }, [direction]);
  const styleChange = useRef(0);
  const activeTransition = useRef<{ skipTransition: () => void } | null>(null);

  const changeDirection = async (next: Direction) => {
    if (next === direction) return;
    const change = ++styleChange.current;
    activeTransition.current?.skipTransition();
    const update = () => flushSync(() => setDirection(next));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      update();
      return;
    }
    const transitionDocument = document as Document & {
      startViewTransition?: (callback: () => void) => { skipTransition: () => void };
    };
    if (transitionDocument.startViewTransition) {
      activeTransition.current = transitionDocument.startViewTransition(update);
      return;
    }
    const content = document.querySelector<HTMLElement>(".page-content");
    if (!content) { update(); return; }
    const fade = content.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: "ease", fill: "forwards" });
    await fade.finished;
    if (change !== styleChange.current) { fade.cancel(); return; }
    update();
    fade.cancel();
    content.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "ease" });
  };



  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target;
      if (target instanceof Element && target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="slider"], [role="spinbutton"]')) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      void changeDirection(event.key === "ArrowLeft" ? "egypt" : "anime");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);


  useEffect(() => {
    if (direction !== "anime") return;
    const hero = document.querySelector<HTMLElement>(".hero");
    const accent = hero?.querySelector<HTMLElement>("h1 em");
    if (!hero || !accent) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let request = 0;
    const update = () => {
      request = 0;
      const bounds = hero.getBoundingClientRect();
      const progress = reduced.matches ? 0 : Math.max(0, Math.min(1, (74 - bounds.top) / Math.max(1, Math.min(220, bounds.height * 0.25))));
      const mix = (from: number, to: number) => Math.round(from + (to - from) * progress);
      accent.style.setProperty("--hero-scroll-start", `rgb(${mix(179, 243)}, ${mix(58, 144)}, ${mix(43, 63)})`);
      accent.style.setProperty("--hero-scroll-end", `rgb(${mix(243, 243)}, ${mix(144, 144)}, ${mix(63, 63)})`);
    };
    const schedule = () => { if (!request) request = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(request);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      accent.style.removeProperty("--hero-scroll-start");
      accent.style.removeProperty("--hero-scroll-end");
    };
  }, [direction]);


  useLayoutEffect(() => {
    const textureImages = new Map<string, HTMLImageElement>();
    const targets = [...document.querySelectorAll<HTMLElement>(".intro-section, .type-section, .illustration-section, .texture-preview")];
    let disposed = false;
    const update = (element: HTMLElement) => {
      const texture = element.classList.contains("texture-preview")
        ? (element.getAttribute("aria-label")?.toLowerCase().includes("sandstone") ? "sandstone" : "papyrus")
        : (direction === "egypt" ? "sandstone" : "papyrus");
      const image = textureImages.get(texture);
      if (!image?.naturalWidth || disposed) return;
      const width = Math.max(element.clientWidth, element.clientHeight * image.naturalWidth / image.naturalHeight) / 2;
      const tile = `${width}px auto`;
      element.style.backgroundSize = element.classList.contains("texture-preview") ? tile : `100% 100%, ${tile}`;
      element.style.backgroundRepeat = element.classList.contains("texture-preview") ? "repeat" : "no-repeat, repeat";
    };
    const observer = new ResizeObserver(entries => entries.forEach(entry => update(entry.target as HTMLElement)));
    for (const texture of ["sandstone", "papyrus"]) {
      const image = new Image();
      textureImages.set(texture, image);
      image.onload = () => targets.forEach(update);
      image.src = `${import.meta.env.BASE_URL}media/${texture}-texture.jpg`;
    }
    targets.forEach(element => { observer.observe(element); update(element); });
    return () => { disposed = true; observer.disconnect(); textureImages.forEach(image => { image.onload = null; }); };
  }, [direction]);

  const copyColor = async (value: string) => {
    await navigator.clipboard?.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(""), 1200);
  };

  return (
    <main className={egypt ? "theme-egypt" : "theme-anime"}>
      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="Tutenramen brand guide home">
          <img
            className="h-14 w-[clamp(126px,33.6vw,224px)] object-contain object-left"
            src={egypt ? assets.wordmarkEgypt : assets.wordmarkAnime}
            alt="Tutenramen"
          />
        </a>
        <div className="hidden text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 md:block">
          Brand standards · v1.0
        </div>
        <DirectionSwitch direction={direction} onChange={changeDirection} />
      </header>

      <aside className="sidebar" aria-label="Brand guide navigation">
        <div className="vertical-title">Tutenramen® · Brand Guidelines</div>
        <nav className="side-links">
          {nav.map(([number, label, id]) => (
            <a href={`#${id}`} key={id}>
              <span>{number}</span>
              {label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="page-content" id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">One brand · Two expressions</div>
            <h1>
              Ancient roots
              <br />
              <em>Fresh energy</em>
            </h1>
            <p>{copy.hero}</p>
            <a className="text-link" href="#foundation">
              Explore the system <span>↓</span>
            </a>
          </div>
          <div className="hero-image">
            <img
              alt={egypt ? "Steaming Tutenramen noodles lifted above a bowl with the gold Tutenramen logo in the background" : "Guests at the Tutenramen character photo wall"}
              src={egypt ? assets.heroEgypt : assets.heroAnime}
            />
            <div className="image-tag">{egypt ? "Ceremonial / Refined" : "Playful / Expressive"}</div>
          </div>
          <div className="hero-index">BG—01</div>
        </section>

        <section className="section intro-section" id="foundation" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--paper) 50%, transparent), color-mix(in srgb, var(--paper) 50%, transparent)), url(${import.meta.env.BASE_URL}media/${egypt ? "sandstone" : "papyrus"}-texture.jpg)` }}>
          <SectionLabel number="01">Foundation</SectionLabel>
          <div className="intro-grid">
            <div className="foundation-heading">
              <h2>Two expressions<br />One spirit</h2>
              <img className="foundation-couple" src={`${import.meta.env.BASE_URL}media/${egypt ? "TR_couple_ME_complete.svg" : "TR_couple_CA.svg"}`} alt={`${egypt ? "Modern Egyptian" : "Chibi Anime"} couple sharing ramen`} />
            </div>
            <div>
              <p className="lead">{copy.foundation}</p>
              <p className="foundation-note">{copy.foundationNote}</p>
              <div className="pillars">
                {[
                  ["Appetite", copy.pillars[0]],
                  ["Generosity", copy.pillars[1]],
                  ["Discovery", copy.pillars[2]],
                ].map(([title, copy]) => (
                  <article key={title}>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <UsageRules doText={copy.rules.foundation.do} dontText={copy.rules.foundation.dont} />
        </section>

        <section className="section logo-section" id="logo">
          <SectionLabel number="02">Logo system</SectionLabel>
          <div className="section-heading">
            <h2>{egypt ? <>A mark of<br />distinction</> : <>Small&nbsp;mark<br />Big spirit</>}</h2>
            <p>{copy.logo}</p>
          </div>
          <div className="logo-grid logo-showcase">
            <div className="logo-wordmarks">
              <div className="logo-card logo-card-light">
                <span className="card-kicker">Wordmark-on light backgrounds</span>
                <img alt={`Tutenramen ${egypt ? "Modern Egyptian" : "Chibi Anime"} wordmark on light backgrounds`} src={egypt ? assets.wordmarkEgypt : `${import.meta.env.BASE_URL}media/TR_wordmark_carnelian.svg`} />
              </div>
              <div className="logo-card logo-card-dark">
                <span className="card-kicker">Wordmark-on dark backgrounds</span>
                <img alt={`Tutenramen ${egypt ? "Modern Egyptian" : "Chibi Anime"} wordmark on dark backgrounds`} src={`${import.meta.env.BASE_URL}media/${egypt ? "TR_wordmark_golden.svg" : "TR_wordmark_carnelian_sunset.svg"}`} />
              </div>
            </div>
            <div className="logo-symbol">
              <span className="card-kicker">Monogram</span>
              <img
                src={`${import.meta.env.BASE_URL}media/${egypt ? "TR_logo_ME_current.svg" : "TR_logo_CA_updated.svg"}`}
                alt={`Tutenramen ${egypt ? "Modern Egyptian" : "Chibi Anime"} logo`}
              />
            </div>
          </div>
          <div className="clearspace">
            <div className="clearspace-diagram" role="img" aria-label="Wordmark with a minimum clear space of one capital-letter height on all four sides">
              <span className="clearspace-x clearspace-x-top" aria-hidden="true">x</span>
              <span className="clearspace-x clearspace-x-left" aria-hidden="true">x</span>
              <img src={`${import.meta.env.BASE_URL}media/wordmark-obsidian-${egypt ? "ME" : "CA"}.svg`} alt="" />
              <span className="clearspace-x clearspace-x-right" aria-hidden="true">x</span>
              <span className="clearspace-x clearspace-x-bottom" aria-hidden="true">x</span>
            </div>
            <p><strong>Clear space</strong><br />Let x equal the height of a capital letter in the wordmark. Leave at least x of empty space above, below and on both sides. Keep text, images and edges outside this area.</p>
          </div>
          <UsageRules doText={copy.rules.logo.do} dontText={copy.rules.logo.dont} />
        </section>

        <section className="section color-section" id="color">
          <SectionLabel number="03">Color</SectionLabel>
          <div className="section-heading">
            <h2>{egypt ? <>Earth, stone<br />and gold</> : <>Papyrus<br />after sunset</>}</h2>
            <p>{copy.color}</p>
          </div>
          <div className={egypt ? "palette palette-modern" : "palette"}>
            {palettes[direction].map((color, index) => (
              <button
                className={`swatch ${color.className} ${index === 0 ? "swatch-large" : ""}`}
                key={color.name}
                onClick={() => copyColor(color.value)}
                type="button"
              >
                <span>{color.name}</span>
                <span>{copied === color.value ? "Copied" : color.value}</span>
              </button>
            ))}
          </div>
          <p className="micro-note">Select any swatch to copy its hex value.</p>
          <div className="texture-swatches">
            {["Sandstone", "Papyrus"].map((texture) => (
              <figure className="texture-swatch" key={texture}>
                <div
                  className="texture-preview"
                  role="img"
                  aria-label={`${texture} repeating texture`}
                  style={{ backgroundImage: `url(${import.meta.env.BASE_URL}media/${texture.toLowerCase()}-texture.jpg)` }}
                />
                <figcaption>{texture}</figcaption>
              </figure>
            ))}
          </div>
          <UsageRules doText={copy.rules.color.do} dontText={copy.rules.color.dont} />
          <div className="gradient-guidance">
            <div className="guidance-heading">
              <h3>Approved gradients</h3>
              <p>{copy.gradient}</p>
            </div>
            <div className="gradient-swatches">
              {gradients[direction].map((gradient) => (
                <figure className="gradient-swatch" key={gradient.name}>
                  <div className="gradient-preview" role="img" aria-label={`${gradient.name} gradient from ${gradient.from} to ${gradient.to}`} style={{ backgroundImage: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)` }} />
                  <figcaption><strong>{gradient.name}</strong><span>{gradient.note}</span><span>{gradient.from} → {gradient.to}</span></figcaption>
                </figure>
              ))}
            </div>
            <UsageRules doText={copy.rules.gradient.do} dontText={copy.rules.gradient.dont} />
          </div>
        </section>

        <section className="section type-section" id="type" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--paper) 50%, transparent), color-mix(in srgb, var(--paper) 50%, transparent)), url(${import.meta.env.BASE_URL}media/${egypt ? "sandstone" : "papyrus"}-texture.jpg)`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
          <SectionLabel number="04">Typography</SectionLabel>
          <div className="type-grid">
            <div className={egypt ? "type-display" : "type-display type-display-anime"}>
              <span className="font-name">{egypt ? "Georgia · Storytelling" : "Montserrat · Expressive"}</span>
              <div className="glyph">Aa</div>
              <p>{copy.typeDisplay}</p>
            </div>
            <div className="type-ui">
              <span className="font-name">Montserrat · Utility</span>
              <div className="glyph">Aa</div>
              <p>{copy.typeUtility}</p>
            </div>
          </div>
          <div className="type-scale">
            <span>Display 01</span><strong>{copy.display}</strong><small>64 / 0.94</small>
            <span>Heading 02</span><b>{copy.heading}</b><small>34 / 1.05</small>
            <span>Body</span><p>{copy.body}</p><small>16 / 1.65</small>
          </div>
          <UsageRules doText={copy.rules.type.do} dontText={copy.rules.type.dont} />
        </section>

        <section className="section imagery-section" id="imagery">
          <SectionLabel number="05">Imagery</SectionLabel>
          <div className="section-heading">
            <h2>{egypt ? <>An invitation<br />to linger</> : <>A feast<br />for the eyes</>}</h2>
            <p>{copy.imagery}</p>
          </div>
          <div className="image-mosaic">
            <figure className="mosaic-main">
              <img alt={egypt ? "A steaming Tutenramen ramen bowl served at an Egyptian-inspired table" : "Tutenramen branded ramen packaging"} src={egypt ? assets.packagingEgypt : assets.packagingAnime} />
              <figcaption>01 · Product in context</figcaption>
            </figure>
            <figure>
              <img
                alt={egypt ? "Tutenramen restaurant interior with Modern Egyptian branding" : "Tutenramen restaurant exterior at dusk"}
                src={egypt ? assets.interiorEgypt : assets.storefront}
              />
              <figcaption>{egypt ? "02 · Branded environments" : "02 · Golden-hour environments"}</figcaption>
            </figure>
            <figure>
              <img
                alt={egypt ? "Black Tutenramen delivery bag with gold Modern Egyptian branding" : "Tutenramen illustrated printed menu"}
                src={egypt ? assets.detailsEgypt : assets.menu}
              />
              <figcaption>03 · Crafted details</figcaption>
            </figure>
          </div>
          <div className="application-notes">
            <p><strong>Product</strong> {copy.product}</p>
            <p><strong>Environment</strong> {copy.environment}</p>
            <p><strong>Detail</strong> {copy.detail}</p>
          </div>
          <UsageRules doText={copy.rules.imagery.do} dontText={copy.rules.imagery.dont} />
        </section>

        <section className="section illustration-section" id="illustration" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--paper) 50%, transparent), color-mix(in srgb, var(--paper) 50%, transparent)), url(${import.meta.env.BASE_URL}media/${egypt ? "sandstone" : "papyrus"}-texture.jpg)`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
          <SectionLabel number="06">Illustration</SectionLabel>
          <div className="section-heading">
            <h2>{egypt ? <>Heritage<br />in every line</> : <>Drawn from<br />the Nile</>}</h2>
            <p>{copy.illustration}</p>
          </div>
          <div className="illustration-grid">
            {illustrationSets[direction].map((art) => (
              <figure className={art.label === "Characters" ? "illustration-card illustration-card-wide" : art.label === "Gold mask" ? "illustration-card illustration-card-gold-mask" : art.label === "Ninja mummy" ? "illustration-card illustration-card-mummy" : "illustration-card"} key={art.file}>
                <div className={art.label === "Ninja mummy" ? "illustration-art illustration-art-mummy" : "illustration-art"}>
                  <img src={["pyramid_ME.svg", "Obelisk_ME.svg", "gold-mask-ME.png", "Pyramid_CA.svg"].includes(art.file) ? `${import.meta.env.BASE_URL}media/${art.file}` : `${CDN}/${art.file}`} alt={`${egypt ? "Modern Egyptian" : "Chibi Anime"} Tutenramen ${art.label.toLowerCase()} illustration`} loading="lazy" decoding="async" />
                </div>
                <figcaption>{art.label}</figcaption>
              </figure>
            ))}
          </div>
          <UsageRules doText={copy.rules.illustration.do} dontText={copy.rules.illustration.dont} />
        </section>

        <section className="section motion-section" id="motion">
          <SectionLabel number="07">Motion</SectionLabel>
          <div className="section-heading">
            <h2>{egypt ? <>Grace in<br />every gesture</> : <>Chopsticks<br />and chariots</>}</h2>
            <p>{copy.motion}</p>
          </div>
          <div className="motion-grid">
            {motionSets[direction].filter(video => video.label !== "Animated monogram").map((video) => (
              <figure className={video.label === "Animated monogram" ? "motion-card motion-card-monogram" : "motion-card"} key={video.id}>
                <div className={video.square ? "motion-player motion-player-square" : "motion-player"}>
                  {egypt && video.label === "Date night" ? (
                    <video
                      key={direction}
                      src={`${import.meta.env.BASE_URL}media/${egypt ? "Tutenramen_KeyArt_B2.mp4" : "Tutenramen_KeyArt_A2.mp4"}`}
                      aria-label={`${egypt ? "Modern Egyptian" : "Chibi Anime"} key art animation`}
                      autoPlay muted loop playsInline preload="auto"
                    />
                  ) : <iframe
                    src={`https://player.vimeo.com/video/${video.id}?background=1&controls=0&title=0&byline=0&portrait=0&autoplay=1&muted=1&loop=1&playsinline=1&autopause=0`}
                    title={`${egypt ? "Modern Egyptian" : "Chibi Anime"} Tutenramen — ${video.label}`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="origin-when-cross-origin"
                  />}
                </div>
                <figcaption>{video.label}</figcaption>
              </figure>
            ))}
          </div>
          <div className="motion-animation-grid">
            <figure className="motion-card motion-card-monogram">
              <div className="motion-player motion-player-square">
                <video src={`${import.meta.env.BASE_URL}media/${egypt ? "tutenramenTurnaround_B3.mp4" : "tutenramenTurnaround_A0.mp4"}`} aria-label="Animated monogram" autoPlay muted loop playsInline preload="auto" />
              </div>
              <figcaption>Animated monogram</figcaption>
            </figure>
            <figure className="motion-card motion-card-sun">
              <div className="motion-player motion-player-square">
                <LoopAnimation source={`media/sun_${egypt ? "ModernEgyptian" : "ChibiAnime"}.json`} label="Animated sun" pingPong={egypt} scale={egypt ? 1 : 0.65} />
              </div>
              <figcaption>Animated sun</figcaption>
            </figure>
            <figure className="motion-card motion-card-bowl">
              <div className="motion-player motion-player-square">
                <LoopAnimation source={`media/RamenBowl_${egypt ? "ME" : "CA"}.json`} label="Steaming ramen bowl" frameByFrame />
              </div>
              <figcaption>Steaming bowl</figcaption>
            </figure>
          </div>
          <UsageRules doText={copy.rules.motion.do} dontText={copy.rules.motion.dont} />
        </section>

        <section className="mural-section" aria-label={egypt ? "Modern Egyptian mural" : "Chibi Anime mural"}>
          {egypt ? (
            <ScrollMural
              source="media/Tutenramen_Mural_ME_updated.json"
              renderer="svg"
              ambientSmoke
              label="Modern Egyptian Tutenramen mural animated by scrolling"
              aspectRatio="1920 / 1080"
              reverse={false}
              startOffset={0}
              scrollSpeed={1}
            />
          ) : <ScrollMural />}
        </section>

        <section className="section voice-section" id="voice">
          <SectionLabel number="08">Voice</SectionLabel>
          <div className="voice-grid">
            <div>
              <h2>Speak with<br /><em>warm confidence</em></h2>
              <p>{copy.voice}</p>
            </div>
            <div className="voice-examples">
              <article><span>Menu</span><p>{copy.menu}</p></article>
              <article><span>Social</span><p>{copy.social}</p></article>
              <article><span>Service</span><p>{copy.service}</p></article>
            </div>
          </div>
          <UsageRules doText={copy.rules.voice.do} dontText={copy.rules.voice.dont} />
          <div className="approval-checklist">
            <div className="guidance-heading">
              <h3>Before it goes out</h3>
              <p>Review the complete experience, including its smallest screen and every animated frame.</p>
            </div>
            <ul>
              <li>The expression suits the occasion and stays consistent.</li>
              <li>Logos, photographs and illustrations come from the approved assets.</li>
              <li>The signature, hierarchy and practical information are easy to read.</li>
              <li>Crops are intentional and motion stays composed throughout.</li>
              <li>The writing makes the food and hospitality feel inviting.</li>
              <li>Any transition between expressions has a clear purpose.</li>
            </ul>
          </div>
        </section>

        <footer>
          <div>
            <span className="footer-kicker">{copy.footerKicker}</span>
            <h2>{copy.footerFirst}<br />{copy.footerLast}</h2>
          </div>
          <a className="portfolio-return" href="https://www.chinopisces.com/tutenramen">Back to portfolio ↗</a>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </main>
  );
}
