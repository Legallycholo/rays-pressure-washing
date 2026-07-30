/**
 * Articles / resource hub, served at /articles.
 *
 * Renamed from `posts.ts` when the route moved from /blog to /articles, so the
 * content module and the URL it feeds match.
 *
 * ── The section shape is built for AEO ──────────────────────────────────────
 *
 * `heading` is a question, and `answer` is the direct reply in 40–60 words,
 * rendered immediately under it. That is not a stylistic preference: it is the
 * block that AI Overviews, Perplexity and ChatGPT extract when they answer a
 * question, and a heading whose answer arrives in paragraph three does not get
 * quoted. Making `answer` a required field rather than a writing convention
 * means it cannot be quietly dropped by whoever edits this next.
 *
 * `body` is the supporting detail for the human who kept reading. `table` is the
 * highest-value block of the three — comparison tables get lifted verbatim into
 * AI answers more reliably than prose does, so where a comparison is the honest
 * shape of the answer, build the table.
 *
 * Every article here is complete. This array previously held six entries whose
 * every section body was the literal string "DRAFT: …", rendered straight to the
 * page inside `Article` schema claiming a real article — roughly 200 words each,
 * which is the thin content Google's helpful-content system demotes. Three were
 * written out in full during the SEO pass; three were cut. See
 * implementation/SEO_AEO_GEO.md §5.3.
 *
 * Backlog, cut but worth writing:
 *   - "What pressure washing costs, and what makes the number move" — gated on
 *     real figures in services.ts, which are still PLACEHOLDER. Do not publish
 *     invented price ranges.
 *   - "Got an HOA letter about your roof or driveway? Start here"
 *   - "A five-minute checklist before your cleaning appointment"
 *
 * Migration note: this is a plain array so the scaffold has zero content-pipeline
 * dependencies. When the article count passes ~15, move to MDX files in
 * /content/articles with a loader; the `Article` shape survives that unchanged.
 */

export type ArticleTable = {
  caption: string;
  columns: string[];
  rows: string[][];
};

export type ArticleSection = {
  /** Phrase as a question wherever the content honestly is one. */
  heading: string;
  /** The direct answer, 40–60 words, first thing under the heading. Required. */
  answer: string;
  /** Supporting paragraphs. */
  body?: string[];
  table?: ArticleTable;
  list?: string[];
};

export type Article = {
  slug: string;
  title: string;
  /**
   * Shorter title for the `<title>` tag, when `title` is too long for one.
   *
   * The budget is about 60 characters including the " | Ray's" suffix the layout
   * template appends, so roughly 50 for the title itself. An on-page H1 can
   * afford to be longer and more conversational than a search result can, and
   * forcing them to be the same string makes one of them worse. Set this only
   * when needed; `title` is the fallback.
   */
  metaTitle?: string;
  excerpt: string;
  /** ISO date. */
  date: string;
  updated?: string;
  author: string;
  category: "Maintenance" | "How it works" | "Cost" | "Seasonal";
  readMinutes: number;
  /** Internal linking targets, keeps the SEO graph tight. */
  relatedServices: string[];
  relatedCities?: string[];
  sections: ArticleSection[];
  featured?: boolean;
};

export const articles: Article[] = [
  {
    slug: "soft-washing-vs-pressure-washing",
    title: "Soft washing vs pressure washing: which does your surface need?",
    metaTitle: "Soft Washing vs Pressure Washing: Which Do You Need?",
    excerpt:
      "Using the wrong one is how siding gets scarred and roofs lose their granules. A surface-by-surface breakdown of which method belongs where, and why.",
    date: "2026-05-22",
    updated: "2026-07-29",
    author: "Ray",
    category: "How it works",
    readMinutes: 8,
    relatedServices: ["house-washing", "roof-cleaning", "deck-patio"],
    relatedCities: ["lexington", "chapin"],
    featured: true,
    sections: [
      {
        heading: "What is the difference between soft washing and pressure washing?",
        answer:
          "Pressure washing removes dirt with force. Soft washing removes it with chemistry, at roughly garden-hose pressure. Force works on hard, non-porous flatwork like concrete. Chemistry is what you need for anything alive — algae, mildew, lichen — because force only knocks growth off the surface and leaves it to regrow.",
        body: [
          "The confusion is understandable, because both jobs arrive on the same truck and use the same pump. The difference is what the pump is set to and what is going through it. A pressure washer cleaning concrete might run at 3,000 PSI through a rotating surface cleaner. The same machine soft washing siding runs closer to 100 PSI — less than most garden hoses — with a cleaning solution doing the actual work.",
          "The reason this distinction matters more in exterior cleaning than it does almost anywhere else is that most of what makes a house look dirty is not dirt. It is biological growth feeding on the surface: algae, mildew, moss and lichen. Dirt sits on top of a surface and can be knocked off. Growth has a root structure in the surface, and knocking the visible part off is the cleaning equivalent of mowing a weed.",
          "That is why two houses cleaned on the same day can look identical in the photographs and completely different eight months later. One was washed. The other was treated.",
        ],
      },
      {
        heading: "Which surfaces need which method?",
        answer:
          "Concrete, pavers and brick flatwork can take real pressure. Siding, roofs, wood, screens and anything painted or porous need soft washing. When in doubt, the rule that almost never fails: if the surface can be scratched or dented, or has something living on it, it gets chemistry rather than force.",
        body: [
          "Here is the whole picture on one table. The pressure figures are the ranges we actually run, not manufacturer maximums.",
        ],
        table: {
          caption: "Correct cleaning method by exterior surface",
          columns: ["Surface", "Method", "Typical pressure", "Why"],
          rows: [
            [
              "Vinyl siding",
              "Soft wash",
              "Under 200 PSI",
              "Force drives water behind the panels and into the wall cavity",
            ],
            [
              "Painted wood siding",
              "Soft wash",
              "Under 150 PSI",
              "Pressure lifts paint edges and furs the grain underneath",
            ],
            [
              "Brick walls",
              "Soft wash",
              "Under 500 PSI",
              "Old mortar joints erode long before the brick face does",
            ],
            [
              "Stucco and EIFS",
              "Soft wash",
              "Under 150 PSI",
              "Porous by design; force cracks the finish coat and traps water",
            ],
            [
              "Asphalt shingle roof",
              "Soft wash only",
              "No pressure",
              "Pressure strips the granules that are the shingle's UV protection",
            ],
            [
              "Metal roof",
              "Soft wash",
              "Under 500 PSI",
              "Seals and fastener gaskets fail under direct pressure",
            ],
            [
              "Concrete driveway or walkway",
              "Surface clean",
              "2,500–3,500 PSI",
              "Hard and non-porous; needs even coverage from a rotary cleaner",
            ],
            [
              "Pavers",
              "Surface clean",
              "1,500–2,500 PSI",
              "Higher pressure blows out the joint sand and destabilises the field",
            ],
            [
              "Wood deck",
              "Soft wash",
              "Under 500 PSI, with the grain",
              "Force raises and tears the fibres, permanently roughening the boards",
            ],
            [
              "Composite deck",
              "Soft wash",
              "Under 1,000 PSI",
              "Pressure marks the cap layer and voids most manufacturer warranties",
            ],
            [
              "Vinyl fence",
              "Soft wash",
              "Under 500 PSI",
              "Thin panels flex and crack, and the growth needs treating anyway",
            ],
            [
              "Screen enclosure or pool cage",
              "Soft wash",
              "Under 100 PSI",
              "Screen mesh tears and spline pops out of the frame channel",
            ],
            [
              "Glass and window frames",
              "Hand or pure water",
              "No pressure",
              "Pressure forces water past the seals and can etch the glass surface",
            ],
          ],
        },
      },
      {
        heading: "What does high pressure actually do to a roof?",
        answer:
          "It removes the granules. Asphalt shingles are protected by a layer of mineral granules embedded in the surface, and that layer is what blocks UV and gives the shingle its rated lifespan. Pressure dislodges them. The damage is invisible from the ground and it is permanent.",
        body: [
          "This is the most expensive mistake in exterior cleaning, and it is expensive precisely because it does not look like a mistake. A pressure-washed roof looks excellent the day it is done. The streaks are gone, the shingles are uniformly dark, and the homeowner is happy. The granules are in the gutters.",
          "What follows is not dramatic. The shingle now absorbs more UV than it was designed to, so it dries out, gets brittle, and starts curling at the edges years earlier than it should. A roof with fifteen years left in it becomes a roof with six. Nobody connects that to the wash, because the wash was three years earlier and looked fine at the time.",
          "It is also worth knowing what your shingle manufacturer thinks about this, because it is unambiguous. Most warranties specifically prohibit pressure washing, and most also require that algae be removed periodically. The method that satisfies both is the low-pressure chemical treatment recommended by the Asphalt Roofing Manufacturers Association, which is the standard those warranties are written against. Cleaning your roof correctly protects the warranty. Cleaning it with pressure voids it.",
        ],
      },
      {
        heading: "Why does soft washing last longer on anything living?",
        answer:
          "Because it kills the organism instead of removing the visible part of it. Algae and mildew have root structures that survive being blasted off, and regrowth from an intact root system is typically visible within a few months. A chemical treatment kills what it touches, so regrowth has to start over from airborne spores.",
        body: [
          "The practical difference, in our experience, is roughly three to four times the interval. A pressure-washed north wall in the Midlands can be visibly green again inside a single humid season. The same wall soft washed generally holds twelve to eighteen months, and a roof treatment holds two to three years.",
          "There is a second, less obvious benefit. Because soft washing does not rely on force to do the work, it does not rely on the operator getting the force exactly right — and force is the variable that causes damage. A soft wash applied slightly too generously does nothing worse than use more solution than it needed. Pressure applied slightly too close leaves a permanent mark. One method has a forgiving failure mode and the other does not.",
        ],
      },
      {
        heading: "How can you tell which method a contractor is actually using?",
        answer:
          "Ask what pressure they will run on your siding, and what they are applying. A soft-wash answer sounds like a number under 200 PSI plus a named cleaning solution. If the answer is only about pressure, or is some version of “as much as it takes,” they are pressure washing everything and calling it whatever you called it.",
        body: [
          "Three more questions separate the two quickly. What happens to the plants — a soft-wash operation saturates beds and shrubs before starting and rinses again afterwards, because dilution is the entire safety margin. What are you doing about the roof — anyone offering to pressure wash asphalt shingles has told you everything you need to know. And how long do you expect it to last — a contractor who kills growth will quote you a year or more, because they know what their own method does.",
          "You can also read the previous job. Wand striping on concrete, those overlapping arcs of clean and less-clean surface, means someone cleaned a driveway with a straight nozzle instead of a rotary surface cleaner. It is a reliable sign of a crew working fast with force rather than matching the tool to the surface. It is also correctable: re-cleaning the whole slab evenly with a surface cleaner brings it back to uniform.",
        ],
      },
    ],
  },
  {
    slug: "black-streaks-on-roof-explained",
    title: "Those black streaks on your roof are alive",
    excerpt:
      "Gloeocapsa magma is an algae that eats the limestone filler in asphalt shingles. Here's what it's doing to your roof, and how it's actually removed.",
    date: "2026-03-18",
    updated: "2026-07-29",
    author: "Ray",
    category: "How it works",
    readMinutes: 6,
    relatedServices: ["roof-cleaning", "gutter-cleaning"],
    relatedCities: ["irmo", "lexington"],
    featured: true,
    sections: [
      {
        heading: "What are the black streaks on my roof?",
        answer:
          "They are a living organism: a blue-green algae called Gloeocapsa magma. Not dirt, not mildew, and not staining running off your gutters. It feeds on the limestone filler used in asphalt shingles, and the black colour is a protective pigment the colony produces to shield itself from UV.",
        body: [
          "This surprises most people, and it changes what you should do about it. Dirt gets washed off. An organism gets treated, or it comes back — and because it spreads by airborne spores, it will find your roof again regardless of what your neighbours do about theirs.",
          "Modern asphalt shingles use crushed limestone as a filler to add weight and fire resistance. That limestone is a food source. Which is why this is largely a modern problem: shingles from several decades ago contained less of it, and the algae had less reason to settle in.",
          "The dark colour is the part that catches people out. Gloeocapsa magma is blue-green, and on a permanently shaded, damp roof you sometimes see it that way. What you usually see is the dark sheath the colony builds over itself as UV protection, which is why the streaks read as soot or water staining rather than as something growing.",
        ],
      },
      {
        heading: "Why do the streaks always run downward?",
        answer:
          "Because the colony spreads the way water moves. Spores land high on the roof, establish, and then every rainfall carries cells down the slope to colonise below. You get vertical streaks rather than random patches, and they widen as they descend — which is also why the streaking usually starts near the ridge.",
        body: [
          "Two other patterns are worth recognising. Streaking is almost always worse on the north-facing slope, because that side gets the least direct sun and stays damp longest after rain or overnight dew. In the Midlands, with our humidity, a north slope can hold moisture most of the morning.",
          "And you will often see a clean stripe running down from any metal on the roof — flashing, a chimney cap, a roof vent. That is not coincidence. Metal, particularly galvanised or copper, releases trace amounts of metal ions when rain runs over it, and those ions are toxic to the algae. The clean stripe is a small accidental demonstration of exactly how the streaks are prevented.",
        ],
      },
      {
        heading: "Is it just cosmetic, or is it damaging the roof?",
        answer:
          "It starts cosmetic and becomes structural. The algae holds moisture against the shingle, loosens the granule layer as it feeds, and darkens the roof so it absorbs more heat. Left long enough it also gives moss and lichen — which are genuinely destructive — a surface they can establish on.",
        body: [
          "The heat point is the one homeowners feel first, in the summer bill rather than on the roof. A dark, streaked roof absorbs meaningfully more solar heat than a clean one, which pushes attic temperatures up and makes the air conditioning work harder for the same result.",
          "The granule loss is slower and more consequential. Those mineral granules are the shingle's UV shield, and the algae's feeding action gradually undermines their bond to the asphalt beneath. Fewer granules means more UV reaching the asphalt, which dries out and turns brittle. That is how a cosmetic problem becomes a shortened roof life.",
          "The sequence that genuinely damages roofs is what comes next. Algae is a pioneer organism: it establishes on a clean surface and holds moisture, which makes that surface hospitable to moss and lichen. Lichen is the one to worry about — it anchors into the shingle with root-like structures and cannot be removed without taking granules with it. There is a real window here. Algae treated early leaves no trace at all. Lichen left for years leaves damage no cleaning method reverses.",
        ],
      },
      {
        heading: "Why is pressure washing the wrong tool for this?",
        answer:
          "Two reasons. It strips the granule layer that protects the shingle, permanently shortening the roof's life. And it removes only the visible growth, not the organism — so the streaks return, usually within a year, on a roof that now has less protection than it had before.",
        body: [
          "It is worth being blunt about the trade being made. A pressure-washed roof looks clean immediately and is worse off than before. The homeowner pays for a job that shortens the life of the most expensive surface on the building, and nobody discovers it until the roof fails early.",
          "Your shingle manufacturer almost certainly prohibits it in writing. Most asphalt shingle warranties specifically exclude damage from pressure washing while separately requiring that algae be removed periodically. Both conditions are satisfied by the low-pressure chemical method recommended by the Asphalt Roofing Manufacturers Association — which is the standard those warranties are written against in the first place.",
        ],
      },
      {
        heading: "How is it actually removed?",
        answer:
          "With a chemical treatment applied at no pressure and allowed to dwell, then rinsed gently. The solution kills the organism where it sits. The dead colony either rinses away or weathers off over the following weeks. Nothing scrubs, and nothing touches the shingle with force at any point.",
        body: [
          "The practical sequence on a roof: cover and pre-wet the landscaping below, apply the treatment to the affected slopes at low volume, allow the dwell time the solution needs, then rinse at a pressure closer to rainfall than to a pressure washer. Gutters get flushed afterwards, because everything that came off the roof is now sitting in them.",
          "One thing to expect: on a heavily streaked roof, it does not all disappear the same day. The organism dies on contact, but the dark sheath it built can take a few weeks of sun and rain to break down and wash clear. A roof that looks 80 percent better on the day usually looks completely clear a month later. Anyone promising instant total clearance on a badly streaked roof is either using far more aggressive chemistry than the shingle should ever see, or using pressure.",
        ],
      },
      {
        heading: "How long does a roof stay clean after treatment?",
        answer:
          "Typically two to three years in our climate, and less on a heavily shaded north slope. The spores are airborne, so recolonisation is a question of when rather than whether. What changes the interval is sun exposure, overhanging tree cover, and how long the roof stays damp after rain.",
        body: [
          "You can extend it. Trimming branches back off the roofline is the highest-value thing most homeowners can do, because it buys both more sun and less debris at once. Keeping gutters clear matters more than it sounds: a blocked gutter holds water against the lowest course of shingles, which is exactly the damp foothold the algae is looking for.",
          "Zinc or copper strips installed near the ridge work on the same principle as that clean stripe under your flashing — rain carries metal ions down the slope and suppresses growth. They are not a substitute for treating a roof that is already streaked, and they are noticeably more effective on the upper slope than down at the eaves, but on a roof that has just been cleaned they meaningfully slow the return.",
        ],
      },
    ],
  },
  {
    slug: "how-often-should-you-pressure-wash-your-house",
    title: "How often should you actually wash your house?",
    excerpt:
      "The honest answer isn't a fixed number. It depends on shade, humidity and what your walls are made of. Here's how to read your own house instead of guessing.",
    date: "2026-06-12",
    updated: "2026-07-29",
    author: "Ray",
    category: "Maintenance",
    readMinutes: 7,
    relatedServices: ["house-washing", "roof-cleaning", "gutter-cleaning"],
    relatedCities: ["lexington", "hopkins"],
    featured: true,
    sections: [
      {
        heading: "How often should you wash your house?",
        answer:
          "Every 12 to 18 months for most homes in the Midlands. Heavily shaded properties and anything near open water need it closer to annually; an exposed house on an open lot can stretch past two years. The interval is set by how long your walls stay damp, not by the calendar.",
        body: [
          "That range is a starting point, not a rule, and the reason it is a range matters. Two identical houses on the same street can genuinely need different schedules if one sits under an oak canopy and the other does not. Anyone who gives you a single number without looking at your property is quoting you an average.",
          "The good news is that a house tells you when it is ready, reliably, and well before it becomes a problem. Once you know which signals to read you can stop guessing — and stop paying for washes a year earlier than you needed them.",
        ],
      },
      {
        heading: "Why does the north side always go first?",
        answer:
          "Because it gets the least direct sun, so it stays wet the longest. Algae and mildew need moisture to establish, and drying time is the only variable that consistently limits them. A north wall can hold overnight dew until mid-morning while the south wall dried an hour after sunrise.",
        body: [
          "This is the most useful thing to understand about exterior cleaning, because it explains almost every pattern you will notice on your own house. The north elevation goes green first. The shaded corner behind the garage goes next. Under the eaves, where rain never quite reaches to rinse and the surface stays damp, growth holds on longest of all.",
          "It also explains something that confuses a lot of homeowners: why one wall can look years older than the rest of the same house. It is not uneven paint or a bad batch of siding. It is drying time, compounding season after season.",
          "In practice this means the north side is your gauge. If you want one place to look to decide whether it is time, look there — the rest of the house is running behind it.",
        ],
      },
      {
        heading: "What actually changes your interval?",
        answer:
          "Four things, in rough order of impact: tree cover and shade, proximity to open water, what your walls are made of, and which direction they face. Everything else — how new the house is, how much it rains, what colour the siding is — matters far less than these four.",
        list: [
          "Tree cover. Overhanging canopy blocks the sun that would dry your walls and drops organic debris that feeds growth. A mature oak over the roofline can halve your interval on its own.",
          "Proximity to water. On a lake or river lot, humidity and overnight condensation never fully release. Waterfront properties around Lake Murray routinely need attention about twice as often as a house a mile inland.",
          "Wall material. Porous surfaces hold moisture in the surface itself, so stucco, unsealed brick and older painted wood stay hospitable longer than smooth vinyl does.",
          "Orientation. North and north-east elevations dry slowest. A house whose long side faces north effectively has more vulnerable wall area than one whose long side faces south.",
        ],
        body: [
          "What is not on that list is worth noting too. Rainfall barely moves the interval, because rain both wets the wall and rinses it, and those roughly cancel out. Siding colour affects whether you notice growth, not whether you have it — green algae is simply more visible on cream siding than on grey. And a newer house is not more resistant; it has just not had time yet.",
        ],
      },
      {
        heading: "How do you read your own siding?",
        answer:
          "Look at the north wall in good light. A faint uniform dulling means you have months of margin. Visible green or grey patching means schedule it. Dark streaking under the eaves, or growth you can feel with a fingertip, means it is overdue — the organism is established rather than just present.",
        body: [
          "The fingertip test is the most useful and least known. Run a finger down a clean-looking section of shaded siding and look at it. If it comes away with a grey or greenish film, you have a colony that has not yet become visible from the street. That is the ideal moment to wash: the growth has not had time to work into the surface, and it comes off completely.",
          "Three other signals are worth checking. Look at the gutter faces — those black vertical tiger stripes are the earliest visible sign on most houses, because gutters stay damp longest. Check the lowest course of siding, where soil splash keeps a permanent damp line. And look at the north-facing window frames and sills, which collect and hold moisture in a way flat wall does not.",
          "If you want a single habit that keeps you ahead of it: look at the north wall each spring, after the pollen has washed off but before summer humidity settles in. That is the point in the Midlands year when what you see is what you actually have.",
        ],
      },
      {
        heading: "What happens if you leave it too long?",
        answer:
          "Growth moves from sitting on the surface to working into it. On painted wood it lifts and fails the paint film. On stucco and brick it holds moisture in the surface, accelerating deterioration. And once moss or lichen establish, cleaning stops being enough — the damage underneath them is already done.",
        body: [
          "There is a genuine threshold here, and it is worth naming plainly because it is where a maintenance cost turns into a repair cost. Algae and mildew are surface organisms; cleaned at any point, they leave nothing behind. Moss and lichen are not. Lichen anchors into the surface with root-like structures, and removing it takes some of the surface with it. On a roof that means granules. On painted wood it means paint.",
          "The other cost is the one people discover when they finally call. A house left long enough often cannot be brought back to clean in a single visit, because what is left after the growth comes off is a surface that has weathered unevenly underneath it for years. We are straight about that when we see it — you will hear what we expect to achieve before we start rather than after.",
          "None of which is an argument for washing more often than you need to. Over-washing is a real thing, particularly on painted surfaces, and paying for an annual wash on a house that needs one every two years is money spent for no result. Read the north wall. It will tell you.",
        ],
      },
    ],
  },
];

export const featuredArticles = articles.filter((a) => a.featured);
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const articleSlugs = articles.map((a) => a.slug);
export const articleCategories = [...new Set(articles.map((a) => a.category))];

/**
 * Rough word count for schema.org `wordCount`. Counts the prose a reader
 * actually gets — headings, answers, body paragraphs and list items — and skips
 * table cells, which are data rather than sentences.
 */
export const articleWordCount = (article: Article) =>
  article.sections
    .flatMap((s) => [s.heading, s.answer, ...(s.body ?? []), ...(s.list ?? [])])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
