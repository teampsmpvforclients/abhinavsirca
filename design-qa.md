# ASCA design QA

**Final result: passed**

This result applies to the ASCA adaptation of the observed public desktop discovery interface and tested catalogue/enquiry workflows. It is not an exact-pixel, mobile, private Coursera-backend or complete LMS certification. Brand, content, photography, available products and conversion semantics intentionally differ according to the user's ASCA brief.

## Comparison target and evidence

- Source: `https://www.coursera.org/`, anonymous desktop, page top, initial carousel position, menu/search closed.
- Source visual truth: `/workspace/scratch/coursera-home-final.jpg`.
- First implementation capture: `/workspace/scratch/asca-home-v1.jpg`.
- Final browser-rendered implementation: `/workspace/scratch/asca-home-final.jpg`.
- Implementation URL: `http://terminal.local:4173/`.
- Course implementation capture: `/workspace/scratch/asca-course-final.jpg` (provider mini-mark subsequently changed to the extracted logo emblem).
- Source detail-page capture: `/workspace/scratch/coursera-04-course.jpg`.
- Full comparison input: `/workspace/scratch/asca-comparison-final.jpg`.
- Focused comparison input: `/workspace/scratch/asca-comparison-focused-final.jpg`.

Both pages report a 1363 × 936 CSS-pixel viewport. The source captured raster was 1341 × 921 px; the implementation raster was 1348 × 926 px. The implementation reports devicePixelRatio=1. Because the capture service returned different raster dimensions, both images were normalised to 1363 × 936 for comparison, preserving the complete page area without adding browser chrome. This is a small raster normalisation, not a claim that the raw screenshot output had exactly the same density. Combined full-view dimensions are 2726 × 964, including a 28 px label band. The focused comparison is 2726 × 410 and combines header and compact-course-panel crops from the same normalised captures.

The source and implementation were opened in the browser and then placed together in each comparison image. Separate images were not treated as a side-by-side comparison. Screenshots were used as working QA evidence, not packaged as user-requested deliverables. Paths refer to this session's internal captures.

## Findings and iteration history

### First comparison — blocked

1. **[P1] Hero surface treatment differed.** The initial ASCA first promo had a white surface; the reference first promo has a near-black text region with a light CTA. This changes the dominant above-the-fold colour balance. Fix: `.hero-promo.white` now uses `#0d0f12`, white foreground and a white/blue CTA. The user-requested academy image remains intentional.
2. **[P2] Compact discovery was too tall.** Initial 98 px mini-card minimums and a separate bottom action made the three-panel section taller than the reference. Fix: 84 px card minimum, 8 px card padding, collection navigation in the heading, and removal of the separate bottom link. This restores nine choices and brings the following promotion pair towards the first fold.
3. **[P2] Persistent header and vertical rhythm drifted.** The initial header was 72 px, and carousel/collection spacing pushed the first collection down. Fix: desktop header 64 px, 20 px top collection margin, 16 px heading bottom margin, and left-aligned carousel indicators. The collection heading now measures y=459 CSS px, matching the observed source measurement.
4. **[P1] Wrong branded imagery on two course cards.** Foundation-labelled artwork was reused for Final and entrance-labelled artwork for Executive. Fix: matching academy photography for those courses, plus the actual CS Professional/IPMAT/UGC-NET assets where appropriate. No contradictory course name remains on those card images.

The first and intermediate captures document these differences. The dark hero/card-height/header fixes are visible in `/workspace/scratch/asca-comparison-latest.jpg` and its focused crop.

### Second comparison — blocked

5. **[P2] Collection tint and lower spacing still differed.** The intermediate compact panels used `#f0f6ff`, visibly lighter than the reference's stronger pale-blue collection surface. A large margin below the panels delayed the next promotion region. Fix: collection background `#e3eeff`, 16 px outer padding, no bottom margin on the last mini-card, and 20 px spacing before the promotion pair.
6. **[P2] Provider identity used a text shorthand.** Card provider marks initially used a generic letter. Fix: provider marks now use CSS crops of the actual downloaded academy logo, with size-specific crop regions. Standard interface icons come from Phosphor; specific branding uses source pixels.

### Final comparison — passed within the stated scope

The final full and focused combined images were reopened after these changes. Both show the dark/pale hero pair, compact search header, three pale-blue card groups with nine options, matching semibold type treatment, fine borders and the blue/navy promotion pair at a similar fold position. Computed checks confirm Source Sans Pro family, 600 promo weight, panel `rgb(227,238,255)`, no broken loaded images and no page-width overflow at the tested desktop viewport.

No actionable P0/P1/P2 issue remains in the reviewed desktop adaptation. Minor line-wrap, provider-metadata and surface-height differences are expected from the substituted ASCA copy and omission of unsupported ratings. They are not represented as exact-pixel equality.

## Required fidelity surfaces

| Surface | Evidence and conclusion |
|---|---|
| Fonts/typography | Actual optimised Source Sans font self-hosted; computed family and 600 weight confirmed. Promo headings 28/32 px, collection heading 20/24 px, course title 44/52 px. ASCA copy wraps differently because its length differs. No fallback-font or clipped desktop headline issue observed. |
| Spacing/layout rhythm | Header and collection heading position corrected. Two promo cards, three collection tracks and compact square images match the source composition. 24 px hero radius, 8 px card radius and restrained elevation retained. No desktop horizontal overflow. |
| Colours/tokens | Dark first hero, `#0056d2` actions, `#002457` navy banner and `#e3eeff` collection tint confirmed. Card interiors remain white and borders subtle. Error/saved states communicate through text/shape as well as colour. |
| Image quality/asset fidelity | Real extracted academy emblem, photos, programme artwork, mentor, scholarship and rank posters are used. No placeholder portraits, fabricated partner logos or handmade decorative hero SVG. Course-name/artwork mismatch fixed. Original embedded academy branding is intentionally retained. |
| Copy/content | Interface stands on its own as ASCA. No build instructions, source-analysis language, invented ratings, free-course entitlement or fake payment success appears in product flow. Preview-only form success explicitly discloses that it was not sent to the academy. |

## Primary interactions tested in the browser

- Explore opens a four-column menu and dims the background; closes through its control.
- Header search returns actual Tally programme suggestions through the local API.
- Initial search failure caused by development-origin handling was corrected; retest returned live course rows.
- Course link opens the distinct CA Foundation detail page.
- Save action changes the label and bookmark state; state survived a reload; the QA bookmark was removed afterwards.
- Business Laws syllabus disclosure opens through its summary text. Native summary controls appear as buttons in the AX tree but as generic summary nodes in the available Playwright snapshot; the semantic native element itself functions.
- Counselling dialog opens with the correct course selected and labelled fields.
- Synthetic preview enquiry returns a UUID and an explicit preview-only success message.
- Homepage CS tab displays CSEET, Executive and Professional cards in its associated panel.
- Catalogue shows 26 course records; selecting CA returns three course cards and a matching result count.
- A nonexistent query renders the no-results state with recovery actions.

Browser console logs were checked. The observed error entries belong to the browser automation extension's metadata transport (`chrome-extension://.../content-script.bundle.js`), not the ASCA origin. No application-origin console error was observed in the checked states. This is not a claim of exhaustive browser/device coverage.

## Backend and deployment verification

- Production build succeeds.
- Six meaningful automated content/API tests pass.
- Cloudflare deploy dry-run bundles the Worker and resolves static/D1 bindings.
- D1 local migration succeeds.
- A local workerd/Wrangler integration run serves all 34 requested routes with HTTP 200 and correct encoded page titles.
- Real local D1 enquiry insertion returns 201, and authenticated local SQL inspection confirms five synthetic rows with consent recorded.
- Five hourly enquiries succeed; the sixth receives 429.
- GraphQL category query returns the three CA programmes.
- Enquiries are not exposed through the public GraphQL schema.
- Missing production storage returns 503 rather than false success.

See `docs/verification.json` for the recorded integration result. Synthetic database state is excluded from the package.

## Open questions and remaining coverage

- Mobile viewport resizing was unavailable. Responsive rules are implemented, but phone/tablet screenshots and real-device tests remain outstanding.
- No signed-in Coursera, checkout, private recommendation, learning-player or assistant contract was inspected. These are outside the recoverable public reference scope.
- ASCA has not supplied current fees, batch dates or approved regulatory admission rules. Those require content-owner updates rather than fabricated UI values.
- Browser/API form testing covered synthetic input only. Production deployment requires the operator's D1 binding and post-deployment smoke test.

## Implementation checklist

- [x] Match font family/weight and main desktop composition.
- [x] Correct hero contrast, card height, group colour and section rhythm.
- [x] Use actual academy assets and correct course-image associations.
- [x] Check search, filtering, saved state, disclosures, tabs and enquiry feedback.
- [x] Build, test and validate local Cloudflare/D1 behavior.
- [x] Package source, built routes, inventories, report, migration and deployment guide.
- [ ] Perform phone/tablet, enlarged-text and screen-reader checks before public launch.
- [ ] Configure the real Cloudflare database/domain and verify production behavior.

## Follow-up polish

- **[P3]** Full roving-tabindex and arrow-key semantics for the career tab set would improve keyboard efficiency; all controls are currently reachable with Tab.
- **[P3]** Add accessible long descriptions for original achievement/scholarship posters if their embedded details must be available without seeing the raster image.
- **[P3]** Tune line wraps after ASCA approves final marketing copy, rather than forcing unrelated source text lengths into the new product.

final result: passed
