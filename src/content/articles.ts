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
 *   - "Got an HOA letter about your driveway or siding? Start here"
 *   - "A five-minute checklist before your cleaning appointment"
 *   - "What lake humidity does to a house, and how often it needs washing"
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
      "Using the wrong one is how siding gets scarred and wood gets furred. A surface-by-surface breakdown of which method belongs where, and why.",
    date: "2026-05-22",
    updated: "2026-07-30",
    author: "Ray",
    category: "How it works",
    readMinutes: 7,
    relatedServices: ["house-washing", "window-cleaning", "deck-patio"],
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
          "Concrete, pavers and brick flatwork can take real pressure. Siding, stucco, wood, screens and anything painted or porous need soft washing. When in doubt, the rule that almost never fails: if the surface can be scratched or dented, or has something living on it, it gets chemistry rather than force.",
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
        heading: "What does high pressure actually do to siding?",
        answer:
          "It forces water where water is not supposed to go. Lap siding is designed to shed rain falling downward, not a jet aimed upward underneath it. Pressure drives water behind the boards and into the wall cavity, and the damage happens inside, months later, where nobody is looking.",
        body: [
          "This is the most expensive mistake in exterior cleaning, and it is expensive precisely because it does not look like a mistake. A pressure-washed wall looks excellent the day it is done. The green is gone, the siding is uniform, and the homeowner is happy. The water is in the sheathing.",
          "What follows is not dramatic either. Trapped moisture in a wall cavity does not run out, it sits. Insulation stays damp, sheathing softens, and on a house near open water where humidity never really drops, it stays damp long enough to matter. Nobody connects a soft spot found during a repaint to a wash three summers earlier.",
          "The visible damage is its own list. Pressure lifts the edges of painted trim and takes the paint with it on the next pass. It furs the grain on cedar and leaves it rough for good. It cracks the finish coat on stucco and EIFS, which are porous by design and were never meant to take force. And it blows the seals on older window units, which is how a wash turns into a glazing bill.",
        ],
      },
      {
        heading: "Why does soft washing last longer on anything living?",
        answer:
          "Because it kills the organism instead of removing the visible part of it. Algae and mildew have root structures that survive being blasted off, and regrowth from an intact root system is typically visible within a few months. A chemical treatment kills what it touches, so regrowth has to start over from airborne spores.",
        body: [
          "The practical difference, in our experience, is roughly three to four times the interval. A pressure-washed north wall in the Midlands can be visibly green again inside a single humid season. The same wall soft washed generally holds twelve to eighteen months, and closer to the low end of that on a lake lot where the humidity never lets go.",
          "There is a second, less obvious benefit. Because soft washing does not rely on force to do the work, it does not rely on the operator getting the force exactly right — and force is the variable that causes damage. A soft wash applied slightly too generously does nothing worse than use more solution than it needed. Pressure applied slightly too close leaves a permanent mark. One method has a forgiving failure mode and the other does not.",
        ],
      },
      {
        heading: "How can you tell which method a contractor is actually using?",
        answer:
          "Ask what pressure they will run on your siding, and what they are applying. A soft-wash answer sounds like a number under 200 PSI plus a named cleaning solution. If the answer is only about pressure, or is some version of “as much as it takes,” they are pressure washing everything and calling it whatever you called it.",
        body: [
          "Three more questions separate the two quickly. What happens to the plants — a soft-wash operation saturates beds and shrubs before starting and rinses again afterwards, because dilution is the entire safety margin. What are you putting on the painted trim — anyone happy to run a pressure wand along painted wood has told you everything you need to know. And how long do you expect it to last — a contractor who kills growth will quote you a year or more, because they know what their own method does.",
          "You can also read the previous job. Wand striping on concrete, those overlapping arcs of clean and less-clean surface, means someone cleaned a driveway with a straight nozzle instead of a rotary surface cleaner. It is a reliable sign of a crew working fast with force rather than matching the tool to the surface. It is also correctable: re-cleaning the whole slab evenly with a surface cleaner brings it back to uniform.",
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
    relatedServices: ["house-washing", "gutter-cleaning", "window-cleaning"],
    relatedCities: ["lexington", "chapin"],
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
          "Tree cover. Overhanging canopy blocks the sun that would dry your walls and drops organic debris that feeds growth. A mature oak over the house can halve your interval on its own.",
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
          "There is a genuine threshold here, and it is worth naming plainly because it is where a maintenance cost turns into a repair cost. Algae and mildew are surface organisms; cleaned at any point, they leave nothing behind. Moss and lichen are not. Lichen anchors into the surface with root-like structures, and removing it takes some of the surface with it. On painted wood that means paint. On stucco it means the finish coat.",
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
