# Coursera public-interface analysis and ASCA implementation specification

**Capture date:** 11 October 2026. **Primary reference:** https://www.coursera.org/. **Additional inspected interface:** https://www.coursera.org/learn/foundations-data. **Content source:** the 34 unique requested pages on https://abhinavsirca.in/.

This is a reconstruction specification grounded in the public desktop interface, rendered DOM, computed styles, public stylesheet/font URLs and public engineering documentation. It describes what a developer can reproduce and which mechanisms are not observable. It is not a recovered Coursera source repository, private API specification or claim of access to its production infrastructure. The accompanying ASCA project implements the visual patterns and comparable public discovery interactions with its own data and backend.

## 1. Evidence, scope and confidence

| Evidence class | Meaning | Appropriate use |
|---|---|---|
| Observed | Visible state or DOM/computed value inspected in this session | Reproduce the specific captured layout or behavior |
| Inferred | An explanation supported by public output, without source-level verification | Architectural guidance, clearly labelled |
| Historical primary documentation | A published Coursera engineering account from a stated date | Explain historical choices; do not assume unchanged production versions |
| ASCA implementation choice | A concrete decision made for the supplied application | Implement and test the deliverable |
| Unknown | Not obtainable from the inspected public interface | Do not invent a package name, endpoint, algorithm, service or credential |

The browser viewport reported **1363 × 936 CSS pixels**. Captures cover an anonymous desktop homepage, the expanded catalogue menu, focused search with empty and populated queries, middle/lower homepage sections, and a public course detail page with the assistant drawer. These are snapshots of one session. Geography, cookies, experiment allocation, device, account status and future catalogue changes can change the page. No signed-in learning workspace, checkout, classroom video player, account management, gradebook or administrator application was accessed.

The homepage initially exposed several section containers before their cards finished appearing. Subsequent inspection showed the populated card groups. This is evidence of progressive content arrival, not proof of a particular cache, framework rendering mode or network protocol. The career category tab was inspected; its resulting source card replacement was not conclusively verified. Search returned different suggestions after a query was entered. No course enrolment, payment or assistant message was submitted to Coursera.

Mobile browser emulation and viewport resizing were not available through the active browser interface. Source CSS does contain `max-width:767px` and `min-width:768px` rules. This report separates that stylesheet evidence from unperformed mobile visual verification. ASCA has its own explicit responsive rules, but they should receive a real-device check before launch.

## 2. Experience model and information architecture

The homepage primarily supports **discovery before commitment**. It places a persistent search capability above several increasingly specific browsing modes. A visitor can start with a promoted opportunity, popularity, a subject, a job-oriented goal or a recognisable provider. The hierarchy reduces the need to understand Coursera’s complete product taxonomy before finding a programme.

The public navigation splits into two layers. A dark audience strip distinguishes learner, business, university and government contexts. The white main header contains the brand, Explore control, degree discovery, catalogue search and account/conversion actions. The main header stays visible during scrolling. The audience strip leaves the viewport. This gives search persistent priority while removing the extra audience row after the visitor starts consuming content.

The expanded Explore menu is a wide, multi-column directory rather than a small list under one button. It combines role-oriented navigation, subject categories, qualification/product families and trending skills. A lower row offers guidance and further navigation. The rest of the page is dimmed, increasing the menu’s visual prominence. The control exposes expanded state in the accessibility tree. This structure allows the same header to serve users who think in terms of careers, subjects, skills or credential types.

Course discovery routes lead into course/programme descriptions. A description page answers increasingly concrete questions: what the course covers, who teaches it, what a learner can achieve, how much effort it involves, which modules are included and what other learners report. Conversion is repeated close to supporting evidence. The live course page also contains a contextual assistant, but its reasoning, data access, model and service boundaries cannot be deduced from the drawer.

### Homepage sequence observed

| Order | Region | Visual construction | Job in the user journey |
|---|---|---|---|
| 1 | Audience strip | Near-black horizontal bar, compact white links, active underline | Choose the relevant customer context |
| 2 | Main header | White surface, brand left, pill search centrally, conversion actions right | Search and orient at any scroll position |
| 3 | Promotion carousel | Two visible large rounded cards; additional card extends the carousel | Introduce high-priority learning opportunities |
| 4 | Popular/new discovery | Three pale-blue columns, each holding three white horizontal course cards | Offer an immediate shortlist without a query |
| 5 | Product promotion pair | Broad bright-blue and navy panels | Cross-sell subscription/team products |
| 6 | Provider trust strip | Rounded container with provider names/logos | Establish the breadth and credibility of the catalogue |
| 7 | Dark series feature | Large dark container, four substantial course cards | Present a cohesive learning collection |
| 8 | Three journey tiles | Pale surfaces, pictograms, short proposition and directional action | Segment career, business and degree intents |
| 9 | Subject categories | Wrapped rounded chips with pictograms | Enable subject-first exploration |
| 10 | Trending search collections | Three grouped compact-card panels | Translate common interests into specific courses |
| 11 | Learning goal selection | Pale strip with four selectable goals | Gather explicit preference context |
| 12 | Career qualification section | Blue/green tinted panel, pill tabs, large cards | Connect learning options to career preparation |
| 13 | Career role cards | Four-column cards, images, role descriptions and labour-market facts | Help visitors reason from desired outcomes |
| 14 | Outcome proof banner | Navy surface, large statistic and explanation | Support confidence near the lower conversion funnel |
| 15 | Learner stories | Four bordered testimonial cards with portraits | Supply social proof |
| 16 | FAQ | Full-width rows separated by fine rules | Resolve repeated objections |
| 17 | Footer directory | Pale background, dense multi-column links, app badges/social links | Provide secondary navigation and organisational links |

Not every original commercial product maps meaningfully to ASCA. The implementation substitutes counselling for enrolment, practical accounting for the dark featured collection, ASCA’s actual mentor/achievement material for Coursera testimonials, and qualification categories for provider endorsements. These are explicit content adaptations. They do not imply ASCA offers Coursera subscriptions, degrees, corporate plans or the original partner relationships.

## 3. Geometry and layout reconstruction

The captured desktop page spans almost the full available viewport, with a consistent inset around the main content. A **48 px** left content position was measured for the homepage section heading. The large promo title occupied approximately **307 px** of width, beginning at x=64 in the first card. The second promo title began around x=726. The first hero card’s large radius and split text/image composition are major landmarks; flattening the image into a generic background or increasing the text region dramatically would change the visual identity.

The main header is about 64 px high below the approximately 40 px audience strip. The hero begins around y=119 in the captured default state. Promotional cards are approximately 293 px tall, separated by a narrow gutter, with a radius around 24 px. The carousel has three item controls. Its composition exposes two cards at a time rather than one centred full-width slide. A following item is reachable using the directional control. The captured source also displayed a horizontal overflow indicator at the viewport bottom; reproducing accidental page overflow is not a target for ASCA.

The compact discovery group is a three-track grid. Each track has a tinted outer panel, a small collection heading and three white mini-cards. A mini-card has a square image at the left, provider information above the title and course type/rating below. Approximately 64 px square images dominate those cards. The list conveys nine concrete choices while preserving room for the next large promotional region near the fold.

Large course cards use a top image and a lower information stack. Their image heights and typography establish a distinctly different reading mode from the mini-cards. The card grid aligns these media rectangles, while titles and provider labels create the informational hierarchy underneath. Cards are bordered; shadow is secondary. An excessively floating, deeply shadowed interface would be a poor reconstruction of the restrained source.

### ASCA layout tokens implemented

| Token | Value | Application |
|---|---|---|
| Main container | 1312 px maximum, including 24 px side padding | Header and main sections |
| Wide breakpoint container | 1400 px at viewport widths above 1500 px | Larger desktop displays |
| Mobile page inset | 16 px | Main content and header |
| Desktop section rhythm | 48 px | Vertical separation between major sections |
| Mobile section rhythm | 32 px | Reduce page length without crushing controls |
| Large grid gutter | 20–24 px | Full cards, tiles, footer groups |
| Compact grid gutter | 16 px | Three popularity columns |
| Compact card image | 64 × 64 px desktop | Provider/course preview |
| Regular card image | 168 px height desktop | Course-grid media |
| Main button radius | 8 px | Primary/secondary actions |
| Regular card radius | 8 px | Course cards and syllabuses |
| Hero/collection radius | 24 px desktop, 16 px mobile | Large feature containers |
| Search radius | 24 px | Header search field |
| Category radius | 28 px | Subject chips |

These are implementable ASCA values informed by the reference, not a declaration that every underlying Coursera spacing token has been discovered. Text lengths differ substantially between the two organisations; equal card widths do not guarantee equal line breaks.

## 4. Typography and font engineering

Sampled visible headings, body text and buttons report the CSS font stack **`"Source Sans Pro", Arial, sans-serif`**. The public inline font-face definitions associate that family name with optimised **Source Sans 3** WOFF2 files. This distinction matters: copying the CSS family label alone and loading an unrelated legacy font may produce different line breaks and weight distribution.

The normal font file is publicly served at:

`https://d3njjcbhbojbot.cloudfront.net/web/type/source-sans-3-optimized/ss3-latin-normal.woff2`

An italic face is also declared through `ss3-latin.woff2`. The observed font-face range is 400–700 and uses `font-display:swap`. Legacy Open Sans, Merriweather and Coursera icon-font declarations were also present, but their existence does not establish that they render the sampled contemporary homepage headings. The ASCA build self-hosts the normal Source Sans file and includes Adobe’s Source Sans licence from the official font repository. It does not depend on Coursera’s font CDN at runtime.

| Role | Observed size / line height | Weight | Reconstruction consequence |
|---|---|---|---|
| Homepage H1 in DOM | 48 / 56 px | 600 | The node exists, but it was not a visually dominant title in the captured hero state |
| Promo heading | 28 / 32 px | 600 | Compact display heading, several short lines |
| Homepage collection heading | 20 / 24 px | 600 | Strong but modest scale; do not make every section a 40 px display title |
| Public course title | 44 / 52 px | 600 | Main detail-page focal point |
| Body copy | 16 / 24 px in sampled text | Typically 400 | Relatively dense but readable supporting information |
| Header/button label | 14 / 20 px in sampled controls | Often 600 | Compact persistent interface |
| Provider/type metadata | Small body/UI scale | Mixed | De-emphasised information under the course title |

The typeface has an open, humanist character; the overall tone comes from the combination of that font and moderate semibold headings. Weight 600, rather than indiscriminate 700, helps keep dense card surfaces readable. ASCA uses real font weights rather than synthetic bolding, and preserves the same family across navigation, forms and body copy.

Font QA should check: whether the WOFF2 actually loaded; computed family; title line breaks; font weight; line height; provider label readability; longer course names such as payroll/income tax; whether clipping removes essential words; and initial font-swap layout movement. The ASCA font declaration disables font synthesis. Its normal face is sufficient for the authored interface because italic display typography is not needed. A future italic editorial component should load a licensed italic font instead of relying on faux italic.

## 5. Colour system and visual tokens

The interface uses blue for action and brand, dark navy for substantial commercial regions, and restrained pale blues for discovery backgrounds. Black or near-black surfaces provide a contrasting feature treatment. The supporting palette is cool and low-saturation, allowing programme photography and provider logos to carry colour variation.

| Computed/observed colour | Hex | Role or observation |
|---|---|---|
| Near-black | `#0D0F12` | Audience bar and dark feature areas |
| White | `#FFFFFF` | Main content, card interiors and header |
| Pale blue-white | `#F4FAFF` | Very light supporting surface |
| Primary blue | `#0056D2` | Dominant brand/action blue |
| Related action blue | `#0060EB` | Additional blue value found in the rendered style set |
| Dark navy | `#002457` | Deep feature/promotion surface |
| Muted slate | `#48546E` | Secondary copy |
| Medium blue-grey | `#8495B0` | Control/outline colour |
| Stronger pale blue | `#E3EEFF` | Discovery panel tint |
| Fine border | `#DAE1ED` | Separation between light surfaces |
| Pale neutral blue | `#F0F6FF` | Footer/supporting backgrounds |
| Additional near-blacks | `#0F1114`, `#1C2026` | Text/surface variations observed |
| Warm tint | `#FFF4E8` | A warm supporting value in the observed palette |

These are colours sampled from the live computed style inventory, not a verified complete semantic-token library. A value can appear in a component, experiment or hidden state without serving every stated role site-wide. ASCA maps a deliberately smaller palette to named custom properties: blue, navy, pale, border and muted. The primary foreground pairs are blue on white, white on blue, dark text on pale blue and muted slate on white.

Approximate WCAG luminance ratios can be calculated from the actual implementation values; checks should be based on the final background underneath each text node, not only token names. Focus rings are intentionally distinct from normal borders. Error messages use both text and a warm error surface. Saved-course state uses a filled bookmark plus a changed label, rather than colour alone. The original course ratings and outcome metrics are not recreated with fabricated ASCA values.

## 6. Component-level specification

### 6.1 Main header

Keep the header a continuous white band with a fine bottom rule. The logo is visually stronger than the adjacent navigation. Explore uses a compact label and downward indicator. Search is a wide rounded field with a right-aligned circular blue submit control. Account actions sit at the right without competing with the field’s width. On scroll, the same search surface remains reachable.

ASCA uses the extracted original emblem, displayed through a CSS crop of the unmodified raster logo, beside a blue ASCA wordmark. The source poster itself already includes the ASCA abbreviation. No Coursera logo is placed in the ASCA product. A separate student portal action links to the original academy’s public portal domain. It is not a simulated authentication screen.

### 6.2 Explore menu

The menu should align with the full content width and not appear as a tiny floating dropdown. Four headings introduce parallel columns; link rows are vertically consistent and easy to scan. The lower guidance row is divided by a horizontal rule. Opening the menu dims the body, and closing it restores the previous page.

ASCA implements four groups: professional qualifications, popular programmes, practical accounting skills, and entrance/other courses. The Explore button exposes `aria-expanded` and `aria-controls`. The menu closes through the button, backdrop or Escape. It contains actual internal route links. The mobile menu uses the same data rather than a separate, inconsistent category list.

### 6.3 Search and suggestions

The source search exposes a combobox, listbox, options and status information in the accessibility tree. Focusing an empty query surfaced trending searches and suggested courses. Entering a query produced an anchored, rounded suggestion panel with query suggestions and a course/provider result. The panel can be considerably wider than the input itself. Page dimming helps identify the active search context.

ASCA reproduces the anchored panel, backdrop, suggested course rows and full-results action. Its control is an explicitly labelled native search field with a suggestion region rather than falsely claiming a fully implemented ARIA combobox/listbox keyboard model. It debounces requests by 180 ms, cancels superseded requests, and displays loading, error and empty states. Results come from the project’s GraphQL catalogue endpoint. Search ranking is a bounded, case-insensitive substring match across course title, category, description and skill labels. It is not Coursera’s ranking, personalisation or semantic retrieval.

### 6.4 Promotion carousel

Use a large radius, a deliberate split between text and artwork, strong 28 px semibold display type and one clear action. The first source card is dark with a light action; the second is pale blue with a blue action. Avoid placing all promo copy directly over busy photography. Provide visibly selected pagination indicators and a directional next control.

ASCA provides three manually selectable promos. There is no automatic rotation, preventing unsolicited movement while reading. Desktop displays two adjacent promos and mobile displays one. Slide content stays in the DOM as ordinary text and links, rather than being baked into a single image. Source photography is extracted from the academy website. Text is newly authored for ASCA.

### 6.5 Mini-cards and regular cards

Mini-cards prioritise the course title while retaining provider recognition and qualification type. Regular cards add larger media, a description and a clear course exploration action. Make the full card a semantic link; do not nest independent link targets inside it. The ASCA cards meet that model. Images in catalogue cards are decorative because the title and category already communicate the destination. Larger descriptive course/mentor images have contextual alt text.

The source frequently presents rating stars and review counts. ASCA intentionally omits these where no verified rating data exists. Its metadata identifies level and subject family. The first visual QA pass detected misleading image reuse: a Foundation-branded banner appeared for Final, and an entrance-branded banner appeared for Executive. Those images were replaced with appropriate academy photography or a matching subject asset.

### 6.6 Chips, tabs and discovery sections

Subject chips are soft, rounded browsing links, not editable tags. Pill tabs select one programme group at a time. The active tab is blue with white text; inactive tabs use transparent/light surfaces with outlines. ASCA supplies associated tab-panel identifiers and updates the visible course list. Buttons remain individually keyboard focusable. A future refinement could add the complete roving-tabindex/arrow-key tab convention; the current controls are reachable with normal Tab navigation.

The darker collection panel should retain contrast around white cards and a clear collection heading/action. Three intent tiles add pictogram, title, description and a directional affordance. ASCA uses an established icon package for standard interface pictograms, rather than custom-drawn replacements for specific source artwork.

### 6.7 FAQ and syllabus accordions

The source FAQ is a low-decoration list of separators, disclosure arrows and bold questions. Expanded content belongs directly underneath the selected question. ASCA uses native `details`/`summary`, preserving keyboard activation and browser disclosure semantics without a private accordion library. Syllabus sections use the same disclosure model within bordered containers, with a small section index and a stronger subject label. The first syllabus section is open initially, exposing content immediately.

### 6.8 Footer

Treat the footer as a directory, not just a copyright strip. A pale surface holds compact link columns with repeated course families, organisation information and support. ASCA includes all 34 requested page destinations across its navigation/data, practical programme links, direct telephone/email actions, the original portal and academy social links. It does not copy Coursera’s native app-download badges because those would advertise an unrelated application.

## 7. Detail-page design and interaction

The inspected public course page uses a pale-blue hero with breadcrumb, provider identity, large course title, supporting summary, instructor information and a strong enrolment action. Course facts follow in a row: module/review/level/time-related information. Below, a section navigation supports the longer reading path. Learning outcomes, skill chips, modules, instructor/provider information, related courses, reviews and FAQs complete the page.

The assistant drawer occupies a substantial right-side column in the observed state, roughly 440 px wide. It includes an introduction/privacy notice, prompt suggestions and an input. This changes the available width for the underlying course layout. A drawer seen in a public capture does not reveal the assistant’s model, retrieval corpus, prompt, tool API or session policy. ASCA substitutes an enquiry sidebar because it has no supplied course-aware AI service or knowledge retrieval infrastructure.

The ASCA detail template has:

1. Breadcrumb linking back to the homepage and filtered catalogue.
2. Provider identity and a 44/52 px desktop title.
3. A short factual description written from the content inventory.
4. Enquiry action with fees/batches guidance, plus a saved-course action.
5. Matching academy artwork or photography.
6. A four-cell information row containing learning-section count, level, learning-format guidance and study support.
7. Sticky in-page navigation for about, syllabus, learning support and FAQ.
8. Topic chips and structured syllabus sections.
9. Educator introduction and related courses.
10. A sticky counselling card on desktop, flowing after content on small layouts.

No exact fees, current regulatory eligibility thresholds, exam dates, salary claims, guaranteed placements, ratings or student-success percentages are fabricated. The original inventory includes inconsistent and dated statements. The redesigned public pages retain core topic information, direct visitors to relevant official institutes where appropriate, and use enquiries for current commercial details. The inventory remains in the package as the auditable record of those source discrepancies.

## 8. Motion, timing and state transitions

Most of the visible identity is created by composition and state changes rather than elaborate animation. The inspected style samples frequently returned no active animation and zero/default transition duration. This is not sufficient to assert that the whole site has no animation, nor to attribute an animation framework.

| Interaction | Observed source behavior | ASCA behavior | Timing confidence |
|---|---|---|---|
| Open Explore | Large panel and dimmed page | Same structural pattern, closes on Escape/backdrop | Source easing/duration not measured |
| Focus search | Rounded suggestion surface appears | Anchored suggestion region and backdrop | ASCA 180 ms request debounce; not a source-derived duration |
| Change search text | Suggestions update asynchronously | Abort previous fetch, loading then result/error | Source request/debounce parameters unknown |
| Carousel navigation | Three items, navigation controls | Manual slide selection and next control | Source auto-advance policy not verified |
| FAQ disclosure | Collapsed/expanded controls observed | Native disclosure with rotated indicator | No invented height-animation specification |
| Course cards | Interactive link surfaces | 160 ms border/shadow transition | Implementation choice |
| In-page navigation | Long course reading sections | Smooth anchor scroll | Disabled with reduced-motion preference |
| Course saving | No source save workflow audited | Bookmark fill, text state, device-local persistence | ASCA feature, not a claimed source workflow |
| Form submission | No Coursera form submitted | Disabled submit while pending, success/error feedback | Real ASCA Worker API result |

ASCA respects `prefers-reduced-motion:reduce`, removes transitions and uses immediate anchor movement. It has no parallax, skeleton choreography, scroll hijacking, autoplay carousel or fabricated progress animation. A successful counselling form waits for an actual API acknowledgement before showing a reference. A locally simulated preview acknowledgement is visibly identified as a preview and is not described as an academy receipt.

## 9. Accessibility and interaction quality

The live interface includes useful semantic evidence: expanded controls, a search combobox/listbox/status pattern, selected tabs, heading structure and disclosure buttons. That evidence alone is not a full accessibility audit. No complete screen-reader journey, contrast sweep or assistive-technology compatibility matrix was performed on Coursera.

ASCA implements a skip link, labelled search and form inputs, native buttons/links, visible focus outlines, native dialogs, native disclosure controls, status text and error alerts. Dialogs use `showModal()`, giving browser-managed focus containment and inertness outside the modal. The dialog closes through its close control or Escape. Required consent is checked by both the browser and server. Saved courses disclose that storage is local to the current browser/device.

Remaining accessibility checks for launch include real screen-reader testing, mobile touch targets at the narrowest viewport, magnification to 200–400%, tab behavior at the career selector, focus visibility behind sticky navigation and meaningful reading order when the detail-page sidebar moves below the main content. Generic icons support labelled controls; decorative images do not redundantly announce the title. Original text-containing rank and scholarship posters retain their pixels, but their brief alt text does not transcribe all embedded promotional text. Accessible long descriptions are an editorial follow-up if those image-based details must be available to nonvisual users.

## 10. Public technology evidence versus unavailable internals

| Technology or mechanism | Evidence | Confidence and limit |
|---|---|---|
| React-related component system | Rendered IDs include `cds-react-aria` markers; 171 such markers were observed in one inspected state | Strong evidence of React/ARIA-associated UI output; exact React/library version is unknown |
| Coursera design-system component conventions | `cds`-prefixed accessible component IDs and consistent component styling | Inference about a shared design system; private implementation unavailable |
| Source Sans typography | Computed font family and public font-face URLs | Directly observed |
| Public CDN delivery | CSS and script URLs on a CloudFront domain | Directly observed asset delivery; does not identify every hosting/origin service |
| Split JavaScript bundles | Hashed app/chunk files under public `r2-builds` paths | Directly observed output; specific bundler/version not established |
| Google identity client | Google GSI script included | Public integration signal; full authentication flow not audited |
| Cookie consent tooling | OneTrust/CookieLaw scripts included | Public integration signal, not a verified consent-storage schema |
| Tag manager and pixels | GTM and public Meta, TikTok, Bing, Snap, Quora and Reddit tracking scripts appeared | Script presence, not proof of every event sent or user-specific consent outcome |
| Replay and error monitoring | Amplitude replay 1.31.1 and Sentry browser 7.116.0 visible in script paths | Versions of these visible resources only; not the entire application’s version inventory |
| GraphQL in Coursera engineering | Coursera’s 2019 engineering article describes a web/mobile GraphQL layer | Historical evidence; current endpoints/schema/client versions unverified |
| Internal REST/services | Historically discussed in the same engineering account | Not a recovered current service topology |
| Recommendation logic | Lists respond to context and expose popular/trending concepts | Ranking features, weights, models and experiments unknown |
| Payments and subscriptions | Commercial actions exist | Processor integration, tax, entitlements and checkout APIs unverified |
| Learning player/progress/grading | Not inspected in this audit | Unknown |
| Course-aware assistant | Public drawer and prompt suggestions observed | Model/vendor, retrieval, prompt and tool architecture unknown |

A currently observed stylesheet is:

`https://d3njjcbhbojbot.cloudfront.net/webapps/r2-builds/br/front-page/allStyles.1da19d4854c87960a79e.css`

The course page exposes a separate stylesheet under `consumer-description-page` and includes a Font Awesome stylesheet resource. That does not prove the modern interface exclusively uses Font Awesome. DOM output can contain dependencies left by a legacy component or a specific page template.

The primary historical article, [Evolving the Graph — Coursera Engineering, 28 August 2019](https://medium.com/coursera-engineering/evolving-the-graph-4c587a4ad9a8), describes GraphQL serving web/mobile clients and discusses REST-backed integration, Naptime/Sangria and evolving schema practices. This supports choosing a React plus GraphQL shape for an independent reconstruction. It does not justify claiming that Coursera today runs the exact versions pinned in this package, or that its private schemas can be reused.

“All the same technologies, APIs and logic” cannot be verified from public page output. The deliverable therefore matches directly observed design behavior, uses React and an independently implemented GraphQL catalogue, and documents its own Cloudflare runtime. It contains no invented Coursera endpoint credentials, proprietary schema or unverified machine-learning algorithm.

## 11. Concrete ASCA architecture

### 11.1 Stack and ownership

| Layer | Supplied choice | Relationship to the reference |
|---|---|---|
| UI | React 19.3.0, React DOM 19.3.0 | React-aligned implementation; not a discovered Coursera version |
| Build | Vite 7.1.7 | Our build tooling, not a verified source bundler |
| Catalogue API | GraphQL.js 16.11.0 | Independent schema informed by public GraphQL engineering evidence |
| Interface icons | `@phosphor-icons/react` 2.1.10 | Standard icons for the new product; not a recovered source icon library |
| Deployment tooling | Wrangler 4.42.0 | Cloudflare packaging choice |
| Compute | Cloudflare Worker with static assets | Meets the requested deployment platform |
| Persistence | Cloudflare D1 | Stores counselling enquiries and hourly counters |
| Font | Locally served optimised Source Sans | Matches the observed font face; no runtime dependency on Coursera CDN |
| Course/page data | Versioned JSON in `data/` | Facts and topic labels curated from the supplied inventory |
| Saved courses | Browser localStorage | Device-local convenience; no account/entitlement model implied |

The project uses static, independently addressable HTML for the 34 source routes plus a search route. Each generated page has a title, description, canonical URL and readable initial course content. React replaces the initial content after loading and supplies the dynamic interface. This is **not React server hydration or request-time SSR**. It provides a useful no-JavaScript/crawler baseline while keeping the interactive runtime simple. The shared catalogue also feeds the Worker, reducing duplicated page definitions.

### 11.2 API contract

`POST /api/graphql` accepts `{ "query": "...", "variables": { ... } }` and returns standard GraphQL results. The public schema has `courses(q,category)`, `page(path)` and `categories`. A page exposes its identifier, route, title, category, description, type, level, image, skills and module/topic lists. This API has no user, credential, payment, enquiry-list or learning-progress fields.

```graphql
query FindCourses($q: String, $category: String) {
  courses(q: $q, category: $category) {
    id
    title
    path
    category
    level
    description
    image
    skills
    modules { title topics }
  }
}
```

`POST /api/inquiries` accepts name, email, phone, a listed course or general guidance, optional message, explicit consent and an empty honeypot field. It validates type, length and format, rejects untrusted origins, and stores accepted enquiries with a UUID and timestamp. Production success is returned only after D1 storage succeeds. No database binding produces a 503 and a telephone fallback, rather than an invented success message.

The server limits enquiries to five per source IP/hour using an atomic SQLite upsert, hashing the IP with the hour before storing a rate-limit key. Old rate keys are removed after successful storage. Input is bound to parameterised SQL. Public responses never retrieve enquiry records. Operators can review records privately through their Cloudflare D1 account. There is no public administration endpoint. This basic limiter is not equivalent to a comprehensive anti-abuse service; a production campaign with significant bot pressure can add a challenge/WAF under the operator’s account.

`GET /api/health` returns service availability and storage mode without customer records. Unknown API routes return 404; wrong methods return 405. API responses disable caching. Static assets have a security header policy in `_headers`. No third-party analytics, replay or advertising pixels are installed merely because the reference page uses them.

### 11.3 State and failure logic

| Feature | State source | Loading/error behavior | Persistence |
|---|---|---|---|
| Explore | React boolean | Open/closed menu; no network dependency | None |
| Header suggestions | Input + GraphQL response | Debounced pending state; abort stale request; explicit failure/empty copy | None |
| Full search | URL query + category control + API response | Result count, filter, loading/error/no-results states | URL query supports sharing; changed filter is local state |
| Carousel | React index | Manual selection only | None |
| Career group | React category | Updates visible panel | None |
| Syllabus/FAQ | Native disclosure state | Immediate expand/collapse | None |
| Saved courses | Local IDs validated against catalogue | Empty drawer if no saved courses | Current browser localStorage |
| Enquiry form | Native dialog + React request state | Browser and server validation; pending disabled button; success reference/error | Accepted production submissions in D1 |
| Portal action | Original academy domain | Ordinary external link | Managed by that separate service |

Search is not offline: the Worker API is required for fresh results. The underlying catalogue links and course pages remain navigable independently. Local Vite previews use the same Worker request handler, with an explicitly flagged nonpersistent enquiry acknowledgement. Production never enables that flag.

## 12. ASCA content migration rules

The previous content inventory is included unchanged in `docs/AbhinavSirCA-Website-Content-Inventory.md`. It is a factual inventory with summaries, destinations, image references and source discrepancies, not a line-for-line republication of all original promotional prose. The supplied `data/catalog.json` is the content model used by both UI and API. `docs/source-page-notes.json` preserves per-page audit notes. `docs/asset-provenance.json` lists downloaded originals and their source references.

The request listed 37 entries but only 34 unique pages: CS Executive appeared twice; TallyEssential appeared twice; GCC VAT appeared twice. Each unique route is created once. Route spelling is preserved, while displayed course naming is reconciled with the actual page identity:

- `ca-executive-coaching` displays **CS Executive**.
- `csset-coaching` displays **CSEET**.
- The online-internship slug without `-2` displays **Office Automation**.
- The corresponding `-2` slug displays **Tally Certification with Online Internship**.
- The misspelled university slug displays **University Courses**, with guidance rather than invented programme listings.
- Foreign-course cards for US CPA, CFA, EA, CIA and CFP lead to guidance because detailed source pages for those courses were not among the requested 34; ACCA has its requested detail page.

The redesigned application uses original academy photos, mentor/rank/scholarship artwork and course images. It does not hotlink those assets. A total of 105 original images were downloaded and checked during preparation. The package contains their local files and source manifest. Reusing a banner with the wrong course name was corrected in QA. Original imagery can still contain the academy’s earlier full-name branding; the new interface identifies the company as ASCA without altering authentic achievement artwork.

The inventory’s stale or conflicting exam thresholds, paper counts, historic dates, fees, ages and pass rules are editorial review items. Repeating them as present-tense admission advice would be misleading. Current admission requirements should be maintained from the relevant official institute independently of this design reconstruction. Fees, dates and live availability can be added to the JSON only when the academy provides approved current information.

## 13. Responsive specification and visual verification limits

The ASCA CSS defines a primary responsive change at **767 px** and an intermediate change at **1100 px**. At narrow widths, the header becomes a compact brand/actions row plus a full-width search row; the menu changes to two columns and scrolls if required. The carousel presents one card. Course grids typically become two tracks, catalogue filters wrap above results, footer columns become two, and detail-page/sidebar content becomes one flow. Course navigation remains horizontally scrollable rather than forcing four labels into unreadable lines.

A deliberate distinction is necessary: these rules are implemented and inspected in CSS, but they have not been visually tested through a resized browser in this environment. Desktop screenshots and actual interaction tests are available. No statement that the complete mobile interface is pixel-identical to Coursera is supported. Before public deployment, inspect at 360, 390, 768, 1024 and 1440 px and at both normal and enlarged text sizes. Check the longest course title, modal height with the on-screen keyboard, hero artwork crop, sticky navigation and horizontal overflow.

## 14. Deployment, operations and handoff

The ZIP is a **Cloudflare Workers + Static Assets** project, with D1 for durable counselling enquiries. It is not a static-only upload pretending to have a backend. The included `README.md` gives installation, local preview, database creation/migrations, deployment and post-deployment checks. `wrangler.jsonc` contains a placeholder database UUID; the operator must create/bind their D1 database. Set the real `SITE_URL` when building so canonical URLs and the sitemap use the deployed domain.

The deliverable does not create a paid service, publish a domain or deploy into the user’s account. No production token or Cloudflare account identifier is embedded. Build artefacts are included for review, but the deployment command rebuilds the site. Do not deploy `dist` alone if working search/enquiry APIs are required. An API-backed deployment needs the Worker and D1 binding.

Operational checks are concrete: open the homepage and a nested course URL directly; search for a course; submit a synthetic enquiry; confirm its private D1 row; verify that failed storage produces a failure response; verify that the sixth hourly enquiry is limited; inspect actual security headers; confirm canonical/sitemap URLs; and keep enquiry records only as long as the operator’s student-support process requires. No automatic email/SMS notification is configured. A stored enquiry is available to the academy’s operator in D1, not automatically forwarded to the original email address.

## 15. Validation evidence and acceptance boundary

The project has a successful production build, six automated API/content tests and a successful Cloudflare deployment dry-run. The local D1 migration executes successfully. Browser QA covers the desktop homepage, Explore menu, live suggestions, course detail and the local counselling flow. The root `design-qa.md` records screenshot comparison, fixes and the final scoped result. The source and implementation were compared together at matched desktop geometry; exact copy, artwork, partner lists, AI chat and commercial product semantics differ intentionally for ASCA.

A genuine Coursera backend replica would additionally require authorised source/schema access, authentication and session specifications, payment/entitlement workflows, a learning-content and assessment system, recommendation services, assistant contracts, service-level requirements and production data governance. None is recoverable merely from the homepage. The supplied website is a working ASCA catalogue and enquiry application with a close visual reconstruction of the public discovery interface. It does not claim to be a complete private-platform clone.

## 16. Primary references

- [Coursera public homepage](https://www.coursera.org/) — direct visual/DOM observation in this session.
- [Inspected public course page](https://www.coursera.org/learn/foundations-data) — detail-page structure and assistant drawer observation.
- [Coursera Engineering: Evolving the Graph](https://medium.com/coursera-engineering/evolving-the-graph-4c587a4ad9a8) — dated historical account of GraphQL architecture.
- [React official documentation](https://react.dev/learn) — implementation model; no evidence of Coursera’s exact version.
- [GraphQL.js official documentation](https://www.graphql-js.org/docs/running-an-express-graphql-server/) — schema/execution concepts; the supplied runtime uses a Worker instead of Express.
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) — deployment architecture.
- [Cloudflare static asset binding](https://developers.cloudflare.com/workers/static-assets/binding/) — Worker asset delivery.
- [Cloudflare D1 getting started](https://developers.cloudflare.com/d1/get-started/) and [migrations](https://developers.cloudflare.com/d1/reference/migrations/) — durable enquiry storage.
- [Adobe Source Sans repository](https://github.com/adobe-fonts/source-sans) — font licence/provenance.
- [Original academy website](https://abhinavsirca.in/) — source content, branding and image provenance.

## 17. Exact 34-route implementation map

The following table is generated from the same catalogue consumed by the application and Worker. All paths are relative to the deployed ASCA domain.

| # | URL path | Displayed page | Template |
|---|---|---|---|
| 1 | `/` | Learn with ASCA | home |
| 2 | `/abhinavsirca-chartered-accountancy-coaching/` | Chartered Accountancy | family |
| 3 | `/courses/ca-foundation/` | CA Foundation | course |
| 4 | `/courses/ca-intermediate-coaching/` | CA Intermediate | course |
| 5 | `/courses/abhinasirca-ca-final-coaching/` | CA Final | course |
| 6 | `/company-secretarycs/` | Company Secretary | family |
| 7 | `/courses/csset-coaching/` | CSEET | course |
| 8 | `/courses/ca-executive-coaching/` | CS Executive | course |
| 9 | `/courses/cs-professional/` | CS Professional | course |
| 10 | `/cost-and-management-accountant-cma/` | Cost & Management Accounting | family |
| 11 | `/courses/cma-foundation/` | CMA Foundation | course |
| 12 | `/courses/tally-course/` | Tally & GST | family |
| 13 | `/courses/tally-certification-with-online-internship/` | Office Automation | course |
| 14 | `/courses/master-accountant-using-tally/` | Master Accountant using Tally | course |
| 15 | `/courses/tally-certification-with-gst-simulation/` | Tally Certification with GST Simulation | course |
| 16 | `/courses/complete-guide-to-payroll-income-tax/` | Complete Guide to Payroll & Income Tax | course |
| 17 | `/courses/complete-guide-to-inventory-management/` | Complete Guide to Inventory Management | course |
| 18 | `/courses/tallyessential/` | TallyEssential | course |
| 19 | `/courses/tallyprofessional/` | TallyProfessional | course |
| 20 | `/courses/tally-certification-with-online-internship-2/` | Tally Certification with Online Internship | course |
| 21 | `/courses/gst-using-tallyprime/` | GST using TallyPrime | course |
| 22 | `/courses/tds-using-tally/` | TDS using Tally | course |
| 23 | `/courses/gcc-vat-using-tallyprime/` | GCC VAT using TallyPrime | course |
| 24 | `/courses/tallyessential-international/` | TallyEssential International | course |
| 25 | `/courses/tallyace-international/` | TallyACE International | course |
| 26 | `/courses/tallyessential-oman/` | TallyEssential Oman | course |
| 27 | `/courses/acca/` | ACCA | course |
| 28 | `/courses/clat/` | CLAT | course |
| 29 | `/courses/cuet/` | CUET | course |
| 30 | `/courses/ipmat-coaching/` | IPMAT | course |
| 31 | `/courses/ugc-net-coaching/` | UGC-NET | course |
| 32 | `/courses/foreign-courses/` | Foreign Courses | foreign |
| 33 | `/courses/universitry-courses/` | University Courses | university |
| 34 | `/about-abhinavsirca/` | About ASCA | about |
