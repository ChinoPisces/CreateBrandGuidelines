import { useState } from "react";

const CDN = "https://cdn.prod.website-files.com/6553caa42be844f2b3c45e3f";

const assets = {
  wordmarkEgypt: `${CDN}/6aac551a8b83400598a702e1_c3990ae0a_brownversion.svg`,
  wordmarkAnime: `${CDN}/6aac551bf2b85351a2a53ef1_ce104ae76_tr_wordmark_orange.svg`,
  heroEgypt: `${CDN}/6ab482de387d388ab2fcc287_media-generation-tutenramen-two-bowls-0-05a00bbd-f079-4bc7-9807-f159ef71eaf2-p-1600.webp`,
  heroAnime: `${CDN}/6ab492c7fb1e0a368702ecbb_social-09-photo-wall-p-1080.webp`,
  packagingEgypt: `${CDN}/6ab47b8cd96f51e497efe57d_13fe870b-0caa-480d-8ce7-d792fa5173f0-p-1080.webp`,
  packagingAnime: `${CDN}/6ab492c2fc8cbd991d51af7b_social-01-tabletop-packaging-p-1080.webp`,
  storefrontEgypt: `${CDN}/6aaf997ff97f052a1e295366_tutenramen-modern-egyptian-storefront-p-1080.png`,
  detailsEgypt: `${CDN}/6aaf997e0cbf210b6ba52321_tutenramen-modern-egyptian-table-p-1080.png`,
  storefront: `${CDN}/6ab492c5fc8cbd991d51b16c_social-05-storefront-p-1080.webp`,
  menu: `${CDN}/6ab492c8ad09408dad7910b4_social-10-printed-menu-p-1080.webp`,
  egyptCharacter: `${CDN}/6ab355c2d30b7d7b4f747af5_NinjaMummy_TE_footer.svg`,
  animeCharacter: `${CDN}/6ab355c278494f2cf0cca3ce_NinjaMummy_CA_footer.svg`,
};

type Direction = "egypt" | "anime";

const nav = [
  ["01", "Foundation", "foundation"],
  ["02", "Logo", "logo"],
  ["03", "Color", "color"],
  ["04", "Type", "type"],
  ["05", "Imagery", "imagery"],
  ["06", "Voice", "voice"],
];

const palettes = {
  egypt: [
    { name: "Papyrus", value: "#D7CDBE", className: "bg-[#D7CDBE] text-[#1C1408]" },
    { name: "Desert Sand", value: "#C8B9A6", className: "bg-[#C8B9A6] text-[#1C1408]" },
    { name: "Obsidian", value: "#1C1408", className: "bg-[#1C1408] text-[#F4EAD3]" },
    { name: "Antique Gold", value: "#B8860B", className: "bg-[#B8860B] text-white" },
  ],
  anime: [
    { name: "Sunlit Papyrus", value: "#F2E3C6", className: "bg-[#F2E3C6] text-[#0A0A0A]" },
    { name: "Sunset", value: "#F3903F", className: "bg-[#F3903F] text-[#0A0A0A]" },
    { name: "Lapis Lazuli", value: "#183B82", className: "bg-[#183B82] text-white" },
    { name: "Neo Carnelian", value: "#FF2D55", className: "bg-[#FF2D55] text-white" },
  ],
};

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
            className="h-10 w-[clamp(90px,24vw,160px)] object-contain object-left"
            src={egypt ? assets.wordmarkEgypt : assets.wordmarkAnime}
            alt="Tutenramen"
          />
        </a>
        <div className="hidden text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 md:block">
          Brand standards · v1.0
        </div>
        <DirectionSwitch direction={direction} onChange={setDirection} />
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
            <div className="eyebrow">One brand · Two flavors</div>
            <h1>
              Ancient roots.
              <br />
              <em>Fresh energy.</em>
            </h1>
            <p>
              A living identity system where the prestige of Modern Egypt meets
              the expressive charm of Chibi Anime.
            </p>
            <a className="text-link" href="#foundation">
              Explore the system <span>↓</span>
            </a>
          </div>
          <div className="hero-image">
            <img
              alt={egypt ? "Two steaming bowls of Tutenramen" : "Guests at the Tutenramen character photo wall"}
              src={egypt ? assets.heroEgypt : assets.heroAnime}
            />
            <div className="image-tag">{egypt ? "Ceremonial / Refined" : "Playful / Expressive"}</div>
          </div>
          <div className="hero-index">BG—01</div>
        </section>

        <section className="section intro-section" id="foundation">
          <SectionLabel number="01">Foundation</SectionLabel>
          <div className="intro-grid">
            <h2>Built on contrast.<br />United by appetite.</h2>
            <div>
              <p className="lead">
                Tutenramen is a warm-spiced ramen brand inspired by North African tradition.
                The identity carries two distinct expressions without losing one recognizable soul.
              </p>
              <div className="pillars">
                {[
                  ["01", "Unexpected", "A bold cultural fusion that feels natural, never novelty."],
                  ["02", "Generous", "Warm, abundant and inviting in every guest interaction."],
                  ["03", "Characterful", "Full of wit and personality, with craft at the center."],
                ].map(([num, title, copy]) => (
                  <article key={title}>
                    <span>{num}</span>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section logo-section" id="logo">
          <SectionLabel number="02">Logo system</SectionLabel>
          <div className="section-heading">
            <h2>One name.<br />Two signatures.</h2>
            <p>Choose a signature by context. Never combine both treatments in a single lockup.</p>
          </div>
          <div className="logo-grid">
            <div className="logo-card logo-card-light">
              <span className="card-kicker">Primary · Modern Egyptian</span>
              <img alt="Tutenramen Modern Egyptian wordmark" src={assets.wordmarkEgypt} />
              <span className="card-note">Use for premium, culinary and heritage-led moments.</span>
            </div>
            <div className="logo-card logo-card-dark">
              <span className="card-kicker">Primary · Chibi Anime</span>
              <img alt="Tutenramen Chibi Anime wordmark" src={assets.wordmarkAnime} />
              <span className="card-note">Use for social, guest participation and high-energy moments.</span>
            </div>
          </div>
          <div className="clearspace">
            <div className="clearspace-mark"><span>x</span>TUTENRAMEN<span>x</span></div>
            <p><strong>Clear space</strong><br />Protect the mark on every side by at least one cap-height (x).</p>
          </div>
        </section>

        <section className="section color-section" id="color">
          <SectionLabel number="03">Color</SectionLabel>
          <div className="section-heading">
            <h2>From sandstone<br />to sunset.</h2>
            <p>The palette begins in warm earth and expands into electric character color.</p>
          </div>
          <div className="palette">
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
        </section>

        <section className="section type-section" id="type">
          <SectionLabel number="04">Typography</SectionLabel>
          <div className="type-grid">
            <div className="type-display">
              <span className="font-name">Georgia · Traditional</span>
              <div className="glyph">Aa</div>
              <p>Traditional, authoritative and enduring. Use for Modern Egyptian headlines and storytelling.</p>
            </div>
            <div className="type-ui">
              <span className="font-name">Montserrat · Utility</span>
              <div className="glyph">Aa</div>
              <p>Clean and confident. Use for navigation, labels, data and practical information.</p>
            </div>
          </div>
          <div className="type-scale">
            <span>Display 01</span><strong>Flavor with a story.</strong><small>64 / 0.94</small>
            <span>Heading 02</span><b>Warm spices. Deep broth.</b><small>34 / 1.05</small>
            <span>Body</span><p>Made for curious appetites and shared tables.</p><small>16 / 1.65</small>
          </div>
        </section>

        <section className="section imagery-section" id="imagery">
          <SectionLabel number="05">Imagery</SectionLabel>
          <div className="section-heading">
            <h2>Warmth you<br />can almost taste.</h2>
            <p>Photography is cinematic but human—rich light, honest texture and food at its most inviting.</p>
          </div>
          <div className="image-mosaic">
            <figure className="mosaic-main">
              <img alt="Tutenramen branded ramen packaging" src={egypt ? assets.packagingEgypt : assets.packagingAnime} />
              <figcaption>01 · Product in context</figcaption>
            </figure>
            <figure>
              <img
                alt={egypt ? "Tutenramen restaurant exterior with Modern Egyptian signage" : "Tutenramen restaurant exterior at dusk"}
                src={egypt ? assets.storefrontEgypt : assets.storefront}
              />
              <figcaption>{egypt ? "02 · Branded environments" : "02 · Golden-hour environments"}</figcaption>
            </figure>
            <figure>
              <img
                alt={egypt ? "Ramen served alongside Modern Egyptian Tutenramen packaging" : "Tutenramen illustrated printed menu"}
                src={egypt ? assets.detailsEgypt : assets.menu}
              />
              <figcaption>03 · Crafted details</figcaption>
            </figure>
          </div>
          <div className="photo-rules">
            <div><span>Do</span> Favor amber light, tactile details, generous crops and candid energy.</div>
            <div><span>Don’t</span> Use cold lighting, sterile overheads or generic stock-food styling.</div>
          </div>
        </section>

        <section className="section voice-section" id="voice">
          <SectionLabel number="06">Voice</SectionLabel>
          <div className="voice-grid">
            <div>
              <h2>Speak with<br /><em>warm confidence.</em></h2>
              <p>Our voice is inviting, vivid and lightly playful. We know our craft, but never lecture.</p>
            </div>
            <div className="voice-examples">
              <article><span>Menu</span><p>Slow-simmered. Spice-warmed. Worth the wait.</p></article>
              <article><span>Social</span><p>Your rainy-day bowl has entered the chat.</p></article>
              <article><span>Service</span><p>Come hungry. We’ll take it from here.</p></article>
            </div>
          </div>
        </section>

        <footer>
          <div>
            <span className="footer-kicker">That’s the spirit.</span>
            <h2>Make it memorable.<br />Make it Tutenramen.</h2>
          </div>
          <img alt="" src={egypt ? assets.egyptCharacter : assets.animeCharacter} />
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </main>
  );
}
