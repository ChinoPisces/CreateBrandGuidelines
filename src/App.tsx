import { useState } from "react";
import ScrollMural from "./ScrollMural";

const CDN = "https://cdn.prod.website-files.com/6553caa42be844f2b3c45e3f";

const assets = {
  wordmarkEgypt: `${CDN}/6aac551a8b83400598a702e1_c3990ae0a_brownversion.svg`,
  wordmarkAnime: `${CDN}/6aac551bf2b85351a2a53ef1_ce104ae76_tr_wordmark_orange.svg`,
  heroEgypt: `${import.meta.env.BASE_URL}media/modern-egyptian-ramen-logo.jpg`,
  heroAnime: `${CDN}/6ab492c7fb1e0a368702ecbb_social-09-photo-wall-p-1080.webp`,
  packagingEgypt: `${import.meta.env.BASE_URL}media/modern-egyptian-table-scene.webp`,
  packagingAnime: `${CDN}/6ab492c2fc8cbd991d51af7b_social-01-tabletop-packaging-p-1080.webp`,
  interiorEgypt: `${CDN}/6ab46b58b7fd433adfdffe14_TE_sc_02.png`,
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
    { label: "Ninja mummy", file: "6ab355c2d30b7d7b4f747af5_NinjaMummy_TE_footer.svg" },
  ],
  anime: [
    { label: "Pyramid", file: "6ab0d5da3a3089f25d3f122b_Pyramid_CA_standard.svg" },
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
  ],
  anime: [
    { name: "Sunlit Papyrus", value: "#F2E3C6", className: "bg-[#F2E3C6] text-[#0A0A0A]" },
    { name: "Sunset", value: "#F3903F", className: "bg-[#F3903F] text-[#0A0A0A]" },
    { name: "Lapis Lazuli", value: "#183B82", className: "bg-[#183B82] text-white" },
    { name: "Neo Carnelian", value: "#FF2D55", className: "bg-[#FF2D55] text-white" },
  ],
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
            <div className="eyebrow">One brand · Two expressions</div>
            <h1>
              Ancient roots
              <br />
              <em>Fresh energy</em>
            </h1>
            <p>
              Egyptian imagination. The pleasure of ramen. Two expressions
              that share one appetite, one welcome and one spirit of discovery.
            </p>
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

        <section className="section intro-section" id="foundation">
          <SectionLabel number="01">Foundation</SectionLabel>
          <div className="intro-grid">
            <h2>Built on contrast<br />United by appetite</h2>
            <div>
              <p className="lead">
                Tutenramen brings the pleasure of ramen into a world of Egyptian imagination.
                It is a place for generous bowls, warm welcomes and curious appetites,
                where every meal offers something to discover and every guest feels invited to stay.
              </p>
              <p className="foundation-note">The expression changes. The food, hospitality and spirit of discovery remain constant. This guide explains how to choose an expression and carry it consistently through an experience.</p>
              <div className="pillars">
                {[
                  ["01", "Appetite", "Keep the food compelling and the experience easy to enjoy."],
                  ["02", "Generosity", "Make every encounter feel welcoming, abundant and considered."],
                  ["03", "Discovery", "Give people something distinctive to notice, explore and remember."],
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
          <div className="expression-selector">
            <div className="guidance-heading">
              <h3>Choose the invitation</h3>
              <p>Begin with the feeling you want to create. Both expressions can work in any market; the occasion and purpose guide the choice.</p>
            </div>
            <div className="expression-cards">
              <button type="button" className="expression-card" aria-pressed={egypt} onClick={() => setDirection("egypt")}>
                <span className="card-kicker">Modern Egyptian</span>
                <strong>Ceremony, Craft, Discovery</strong>
                <p>Choose it when atmosphere, food presentation and considered detail should lead.</p>
                <span className="expression-context">Restaurant environments · Food storytelling · Considered packaging</span>
                <span className="expression-action">{egypt ? "Viewing this expression" : "View this expression →"}</span>
              </button>
              <button type="button" className="expression-card" aria-pressed={!egypt} onClick={() => setDirection("anime")}>
                <span className="card-kicker">Chibi Anime</span>
                <strong>Character, Connection, Play</strong>
                <p>Choose it when participation, personal connection and delight should lead.</p>
                <span className="expression-context">Character campaigns · Collectibles · Interactive moments</span>
                <span className="expression-action">{!egypt ? "Viewing this expression" : "View this expression →"}</span>
              </button>
            </div>
            <p className="foundation-note">These are starting points. Either expression can serve a menu, storefront or campaign. Choose one for a complete application and carry it through the logo, palette, type, imagery and motion. When a larger experience introduces both, give the transition a clear purpose and place.</p>
          </div>
          <div className="application-study">
            <div className="guidance-heading">
              <h3>One brief, Two expressions</h3>
              <p>A takeaway message welcoming guests to their next bowl. The same practical information, with a different invitation.</p>
            </div>
            <div className="application-pair">
              <figure>
                <div className="application-example application-egypt">
                  <img src={assets.wordmarkEgypt} alt="Modern Egyptian Tutenramen wordmark" />
                  <p className="application-headline">A bowl worth gathering around</p>
                  <p className="application-detail">Warm broth. Generous noodles.<br />Made to be enjoyed.</p>
                </div>
                <figcaption><strong>Modern Egyptian</strong> — A composed headline, generous space and a restrained accent make the welcome feel considered.</figcaption>
              </figure>
              <figure>
                <div className="application-example application-anime">
                  <img src={assets.wordmarkAnime} alt="Chibi Anime Tutenramen wordmark" />
                  <p className="application-headline">Your next favorite bowl</p>
                  <p className="application-detail">Warm broth. Generous noodles.<br />Made to be enjoyed.</p>
                </div>
                <figcaption><strong>Chibi Anime</strong> — Direct language, bold type and a bright accent make the welcome feel immediate.</figcaption>
              </figure>
            </div>
          </div>
          <UsageRules doText="Choose an expression for the feeling and occasion you want to create. Carry it through the complete application." dontText="Choose solely by country, age or personal taste, or combine styles simply because both are available." />
        </section>

        <section className="section logo-section" id="logo">
          <SectionLabel number="02">Logo system</SectionLabel>
          <div className="section-heading">
            <h2>One name<br />Two signatures</h2>
            <p>Use the signature belonging to your chosen expression. Keep its proportions, clear space and contrast consistent across the application.</p>
          </div>
          <div className="logo-grid logo-showcase">
            <div className="logo-wordmarks">
              <div className="logo-card logo-card-light">
                <span className="card-kicker">Wordmark-on light backgrounds</span>
                <img alt={`Tutenramen ${egypt ? "Modern Egyptian" : "Chibi Anime"} wordmark on light backgrounds`} src={egypt ? assets.wordmarkEgypt : `${import.meta.env.BASE_URL}media/tr_wordmark_orange_1.svg`} />
              </div>
              <div className="logo-card logo-card-dark">
                <span className="card-kicker">Wordmark-on dark backgrounds</span>
                <img alt={`Tutenramen ${egypt ? "Modern Egyptian" : "Chibi Anime"} wordmark on dark backgrounds`} src={egypt ? `${import.meta.env.BASE_URL}media/tr_wordmark_orange_1.svg` : assets.wordmarkAnime} />
              </div>
            </div>
            <div className="logo-symbol">
              <span className="card-kicker">Logo</span>
              <img
                src={`${import.meta.env.BASE_URL}media/${egypt ? "TR_logo_ME.svg" : "TR_logo_CA.svg"}`}
                alt={`Tutenramen ${egypt ? "Modern Egyptian" : "Chibi Anime"} logo`}
              />
            </div>
          </div>
          <div className="clearspace">
            <div className="clearspace-mark"><span>x</span>TUTENRAMEN<span>x</span></div>
            <p><strong>Clear space</strong><br />Protect the mark on every side by at least one cap-height (x).</p>
          </div>
          <UsageRules doText="Use the approved signature, preserve its proportions and protect at least one cap-height of clear space." dontText="Redraw, stretch, add effects or combine the two signatures in one lockup." />
        </section>

        <section className="section color-section" id="color">
          <SectionLabel number="03">Color</SectionLabel>
          <div className="section-heading">
            <h2>From sandstone<br />to sunset</h2>
            <p>{egypt ? "Let papyrus, sand and obsidian establish the atmosphere. Use antique gold to draw attention to a considered detail." : "Let sunlit papyrus give the composition room to breathe. Use sunset, lapis and carnelian to give character and emphasis."}</p>
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
          <UsageRules doText="Establish a dominant color within the selected palette. Use accents for emphasis and preserve readable contrast." dontText="Give every color equal weight or place practical information on a background that makes it hard to read." />
        </section>

        <section className="section type-section" id="type">
          <SectionLabel number="04">Typography</SectionLabel>
          <div className="type-grid">
            <div className={egypt ? "type-display" : "type-display type-display-anime"}>
              <span className="font-name">{egypt ? "Georgia · Storytelling" : "Montserrat · Expressive"}</span>
              <div className="glyph">Aa</div>
              <p>{egypt ? "Use Georgia for composed headlines and storytelling. Let scale and space give each message presence." : "Use bold Montserrat for direct, expressive headlines. Keep messages short and give the words room to read."}</p>
            </div>
            <div className="type-ui">
              <span className="font-name">Montserrat · Utility</span>
              <div className="glyph">Aa</div>
              <p>Shared functional type for both expressions. Use Montserrat for navigation, labels, prices and practical information, with a clear hierarchy.</p>
            </div>
          </div>
          <div className="type-scale">
            <span>Display 01</span><strong>Flavor with a story</strong><small>64 / 0.94</small>
            <span>Heading 02</span><b>Warm spices, Deep broth</b><small>34 / 1.05</small>
            <span>Body</span><p>Made for curious appetites and shared tables.</p><small>16 / 1.65</small>
          </div>
          <UsageRules doText="Give headlines and practical information distinct jobs. Check prices, ingredients and navigation at their actual viewing size." dontText="Use decorative treatments or tight spacing that make essential information difficult to read." />
        </section>

        <section className="section imagery-section" id="imagery">
          <SectionLabel number="05">Imagery</SectionLabel>
          <div className="section-heading">
            <h2>Warmth you<br />can almost taste</h2>
            <p>Make the food inviting and the experience recognizable. Choose approved photographs whose light, setting and branding support the selected expression.</p>
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
            <p><strong>Product.</strong> Let the bowl or packaging lead; use the setting to support its appeal.</p>
            <p><strong>Environment.</strong> Carry the chosen expression through the space, signage and guest experience.</p>
            <p><strong>Detail.</strong> Make everyday objects feel like part of the same considered world.</p>
          </div>
          <UsageRules doText="Use approved photography with consistent branding. Preserve the food’s appeal and compose crops intentionally." dontText="Introduce conflicting logos, unapproved photography or a visual treatment that clashes with the application." />
        </section>

        <section className="section illustration-section" id="illustration">
          <SectionLabel number="06">Illustration</SectionLabel>
          <div className="section-heading">
            <h2>{egypt ? <>Symbols with<br />a story</> : <>Characters with<br />personality</>}</h2>
            <p>{egypt
              ? "Use geometric landmarks and expressive figures to create a sense of ceremony and discovery. Give each symbol a role in the story."
              : "Use rounded landmarks and expressive characters to invite connection and play. Let gestures and relationships carry the story."}</p>
          </div>
          <div className="illustration-grid">
            {illustrationSets[direction].map((art) => (
              <figure className={art.label === "Characters" ? "illustration-card illustration-card-wide" : art.label === "Ninja mummy" ? "illustration-card illustration-card-mummy" : "illustration-card"} key={art.file}>
                <div className={art.label === "Ninja mummy" ? "illustration-art illustration-art-mummy" : "illustration-art"}>
                  <img src={["pyramid_ME.svg", "Obelisk_ME.svg"].includes(art.file) ? `${import.meta.env.BASE_URL}media/${art.file}` : `${CDN}/${art.file}`} alt={`${egypt ? "Modern Egyptian" : "Chibi Anime"} Tutenramen ${art.label.toLowerCase()} illustration`} loading="lazy" decoding="async" />
                </div>
                <figcaption>{art.label}</figcaption>
              </figure>
            ))}
          </div>
          <UsageRules doText="Use the approved artwork, preserve proportions and plan crops around the composition." dontText="Mix illustration styles within an application, distort characters or accidentally cut defining features and artwork edges." />
        </section>

        <section className="section motion-section" id="motion">
          <SectionLabel number="07">Motion</SectionLabel>
          <div className="section-heading">
            <h2>Bring the<br />brand to life</h2>
            <p>{egypt
              ? "Let measured gestures and composed pacing reveal the story. Movement should give the scene presence and direct attention."
              : "Let expressive gestures and playful rhythm reveal personality. Give each action a clear focus and room to land."}</p>
          </div>
          <div className="motion-grid">
            {motionSets[direction].map((video) => (
              <figure className={video.label === "Animated monogram" ? "motion-card motion-card-monogram" : "motion-card"} key={video.id}>
                <div className={video.square ? "motion-player motion-player-square" : "motion-player"}>
                  <iframe
                    src={`https://player.vimeo.com/video/${video.id}?background=1&controls=0&title=0&byline=0&portrait=0&autoplay=1&muted=1&loop=1&playsinline=1&autopause=0`}
                    title={`${egypt ? "Modern Egyptian" : "Chibi Anime"} Tutenramen — ${video.label}`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="origin-when-cross-origin"
                  />
                </div>
                <figcaption>{egypt ? "Modern Egyptian" : "Chibi Anime"} · {video.label}</figcaption>
              </figure>
            ))}
          </div>
          <UsageRules doText="Give movement a purpose: reveal character, create depth or guide attention. Review the entire sequence in its frame." dontText="Let motion expose cropped edges, break the composition or compete with essential information." />
        </section>

        <section className="mural-section" aria-label={egypt ? "Modern Egyptian mural" : "Chibi Anime mural"}>
          {egypt ? (
            <ScrollMural
              source="media/Tutenramen_Mural_ME.json"
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
              <p>Both expressions share a welcoming, specific and appetizing voice. Modern Egyptian can linger on craft and discovery; Chibi Anime can lead with wit and personality. Keep the useful message clear.</p>
            </div>
            <div className="voice-examples">
              <article><span>Menu</span><p>Slow-simmered. Spice-warmed. Worth the wait.</p></article>
              <article><span>Social</span><p>{egypt ? "A little warmth for your rainy evening." : "Your rainy-day bowl has entered the chat."}</p></article>
              <article><span>Service</span><p>Come hungry. We’ll take it from here.</p></article>
            </div>
          </div>
          <UsageRules doText="Be welcoming, specific and appetizing. Let personality help people understand the message." dontText="Let elaborate lore, exaggerated grandeur or repeated jokes hide what people need to know." />
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
            <span className="footer-kicker">That’s the spirit.</span>
            <h2>Make it memorable<br />Make it Tutenramen</h2>
          </div>
          <img alt="" src={egypt ? assets.egyptCharacter : assets.animeCharacter} />
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </main>
  );
}
