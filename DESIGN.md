## Overview

The system uses a soft, approachable pastel palette centred on blue and pink accents over a warm cream canvas. The design feels calm, modern, and healthcare-appropriate โ€” clean enough for administrative workflows but warm enough to feel human. Gradients blend blue and pink throughout primary actions, sidebars, and decorative surfaces, while the cream base keeps the interface bright and readable.

What makes the system distinctive is the gradient-driven UI: buttons use blue-to-pink diagonal gradients with dark text for strong contrast, the admin sidebar uses a deep navy-to-plum vertical gradient, and section surfaces alternate between pale-blue and pale-pink washes. Cards are rounded but not cute. Type is large, tight, and measured, creating a professional cadence across administrative and clinical surfaces.

**Key Characteristics:**
- Pastel blue-pink gradient primary actions with dark text for excellent contrast.
- Warm cream canvas as the default surface; pale blue and pale pink washes for section variety.
- Rounded media cards and product cards, usually 8px to 22px.
- Pill CTAs using gradients instead of flat fills, with most secondary actions rendered as underlined text links.
- Dark gradient sidebar for admin navigation with subtle blue and pink undertones.
- Blue and pink status badges with soft matching backgrounds.
- Clean rule-separated tables with pale-blue hover states.

## Colors

**Theme: ฟ้า-ชมพู Pastel** — A soft, approachable pink-and-blue palette on a warm cream canvas. Gradients are used throughout the UI for primary actions, surfaces, and decorative accents. The palette emphasises blue (`#b0cfff`) and pink (`#ffb0d9`) as brand accents with a cream canvas (`#f9f8f2`).

### Brand & Accent

- **Dark Ink** (`#1a1a2e`): Highest-contrast text, dark UI panels, and the global brand anchor.
- **Blue** (`#b0cfff`): Primary action accent, button gradient start, link hover states.
- **Blue Hover** (`#8ba8e6`): Darker blue for hover/interaction feedback.
- **Light Blue** (`#c9dcf9`): Soft blue surface, gradient component, pale accent backgrounds.
- **Pink** (`#ffb0d9`): Primary warm accent, button gradient end, decorative markers.
- **Pink Hover** (`#e695b5`): Darker pink for hover/interaction feedback.
- **Light Pink** (`#f9c9e2`): Soft pink surface, gradient component, pale accent backgrounds.

### Surface & Background

- **Canvas Cream** (`#f9f8f2`): Dominant page background and form/card surface.
- **Soft Stone** (`#f0ede5`): Warm neutral surface blocks, disabled states.
- **Pale Blue Wash** (`#eaf1fc`): Blue-tinted section backdrop, approved badge background.
- **Pale Pink Wash** (`#fdeaf2`): Pink-tinted section backdrop, error badge background.
- **Card Border** (`#e8e4db`): Softest card containment line, warm neutral edge.

### Text & Rules

- **Ink** (`#212121`): Default body text and most link text on light backgrounds.
- **Muted Slate** (`#7a7a85`): Footer links, dates, metadata, and de-emphasized labels.
- **Slate** (`#6b6b77`): Research separators and tertiary text.
- **Hairline** (`#d5d0c7`): Standard list rules and section dividers.
- **Border Light** (`#e0dbd2`): Secondary divider and utility rule.

### Semantic

- **Focus Blue** (`#6b8fd1`): Keyboard focus and ring color.
- **Form Focus Pink** (`#d487aa`): Focus border for text inputs.
- **Error Red** (`#c23b3b`): Validation error states, danger actions.

### Gradient System

Gradients are a core part of the UI identity. They blend blue and pink across multiple contexts:

- **Primary CTA Gradient** (`#b0cfff → #ffb0d9`): Blue-to-pink diagonal gradient for primary buttons, with dark text for strong contrast.
- **Primary Hover Gradient** (`#8ba8e6 → #e695b5`): Darker blue-to-pink for hover states.
- **Hero Gradient** (`#c9dcf9 → #f9c9e2 → #ffb0d9`): Three-stop gradient for hero sections and large media panels.
- **Blue Gradient** (`#b0cfff → #c9dcf9`): Monochromatic blue gradient for info buttons and blue surfaces.
- **Pink Gradient** (`#ffb0d9 → #f9c9e2`): Monochromatic pink gradient for warm accents.
- **Sidebar Gradient** (`#c9dcf9 → #eaf1fc → #f9f8f2 → #fdeaf2 → #f9c9e2`): Soft pastel blue-to-pink vertical gradient for the admin sidebar, with dark text for readability.
- **Surface Gradient** (`#f9f8f2 → #eaf1fc`): Subtle cream-to-pale-blue backdrop for elevated surfaces.

### Status Colors

- **Draft** (`#7a7a85`): Muted slate, neutral pending state.
- **Submitted** (`#c9893b`): Warm amber, awaiting review.
- **Approved** (`#5b7ec4`): Medium blue, confirmed/active state.
- **Fulfilled** (`#4a8c5c`): Green, completed/satisfied state.
- **Rejected** (`#c23b3b`): Error red, declined state.

## Typography

### Font Family

- **Display**: `CohereText`, falling back to `Space Grotesk`, `Inter`, `ui-sans-serif`, and `system-ui`.
- **Body/UI**: `Unica77 Cohere Web`, falling back to `Inter`, `Arial`, `ui-sans-serif`, and `system-ui`.
- **Technical labels**: `CohereMono`, falling back to `Arial`, `ui-sans-serif`, and `system-ui`.
- **Icons**: Cohere uses custom icon fonts and thin-line geometric illustrations.

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---:|---:|---:|---:|---|
| Hero Display | CohereText | 96px | 400 | 1.00 | -1.92px | Home page declaration scale. |
| Product Display | CohereText | 72px | 400 | 1.00 | -1.44px | Product and research hero headlines. |
| Section Display | Unica77 | 60px | 400 | 1.00 | -1.2px | Large product-page headings. |
| Section Heading | Unica77 | 48px | 400 | 1.20 | -0.48px | Split hero and CTA headings. |
| Card Heading | Unica77 | 32px | 400 | 1.20 | -0.32px | Feature card and list section titles. |
| Feature Heading | Unica77 | 24px | 400 | 1.30 | 0 | Cards, filters, and article titles. |
| Body Large | Unica77 | 18px | 400 | 1.40 | 0 | Lead text and larger paragraphs. |
| Body | Unica77 | 16px | 400 | 1.50 | 0 | Default copy and link text. |
| Button | Unica77 | 14px | 500 | 1.71 | 0 | Compact CTA labels. |
| Caption | Unica77 | 14px | 400 | 1.40 | 0 | Metadata and small explanatory text. |
| Mono Label | CohereMono | 14px | 400 | 1.40 | 0.28px | Uppercase technical labels. |
| Micro | Unica77 | 12px | 400 | 1.40 | 0 | Footer, nav microcopy, and small links. |

### Principles

- Use massive type sparingly; Cohere pages often have one oversized headline and then settle into restrained 16px-24px UI copy.
- Keep display type tight. Hero copy should feel compact and carved, not airy.
- Avoid heavy bold weights. Size, spacing, and surface contrast do most of the hierarchy work.
- Use uppercase mono labels for category and system markers, especially on product and research pages.
- Editorial pages can use coral chips and blue links, but the base typography remains black and measured.

## Layout

### Spacing System

The system uses an 8px base with many one-off alignment values: `2px`, `6px`, `8px`, `10px`, `12px`, `16px`, `20px`, `22px`, `24px`, `28px`, `32px`, `36px`, `40px`, `56px`, `60px`, `64px`, and `80px`.

Large sections rely on dramatic vertical breathing room. The home page places a trust-logo strip far below the hero media. Product pages often hold dark panels inside fields of empty white space, then transition to dense forms or footers only near the end.

### Grid & Container

- Global nav uses a three-zone layout: logo left, menu centered, sign-in/CTA right.
- Home hero is centered text above a two-card media composition: a wide product mockup card beside a narrower photography card.
- Feature sections commonly use 3-column cards on desktop.
- Product pages alternate centered hero blocks, trust-logo strips, large single-feature bands, and 2- or 3-column card grids.
- Research pages use full-width lists with date and chip columns instead of decorative cards.
- Forms use two-column input rows inside a rounded white card on dark or stone section backgrounds.

### Whitespace Philosophy

Cohere uses whitespace as a trust signal. Large empty intervals separate the brand claim, customer proof, product proof, and CTA. Dense content appears only where it serves the information architecture: research paper rows, blog card grids, and contact form fields.

## Elevation & Depth

The system is mostly flat. Depth comes from surface alternation, gradient contrast, rounded corners, and thin borders rather than drop shadows.

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, cream or pale-blue/pink wash field | Hero copy, research lists, editorial surfaces |
| Bordered | 1px `#d5d0c7`, `#e0dbd2`, or dark translucent rules | Research rows, forms, pale cards, nav elements |
| Gradient Lift | Blue-to-pink gradient over contrasting section color | Primary buttons, sidebar, hero sections |
| Dark Gradient Field | Deep navy-to-plum full-width gradient band | Admin sidebar, dark feature sections |

## Shapes

### Radius Scale

| Token | Value | Role |
|---|---:|---|
| `xs` | 4px | Small images, search fields, article thumbnails, utility elements |
| `sm` | 8px | Blog chips, cards, small media, dialogs |
| `md` | 16px | Medium product cards and grouped blocks |
| `lg` | 22px | Signature media-card and soft placeholder radius |
| `xl` | 30px | Research/topic filter pills |
| `pill` | 32px | Primary CTA buttons |
| `full` | 9999px | Round status elements and fully pill-shaped controls |

### Image Treatment

Images are not decorative backdrops for text except in CTA bands. Most imagery sits as rounded cards with visible corners: product videos, enterprise photography, article thumbnails, and abstract 3D renders. The dominant radii are 8px and 22px.

## Components

### **`button-primary`**

Blue-to-pink gradient pill CTA with dark text. Uses 14px-15px Unica77, 12px 24px padding, and a 32px pill radius. This is the primary action style for "Submit", "Save", and hero CTAs. The gradient provides visual energy while dark text ensures strong contrast.

### **`button-secondary`**

Text-only action link, usually underlined or rule-aligned, with no filled background. Used for "Explore products", "Try the Playground", newsletter signup, and secondary hero actions.

### **`button-pill-outline`**

Outlined pill control with transparent fill, 1px dark border, and 30px radius. Used for research filters, topic tags, and lightweight taxonomy controls.

### **`announcement-bar`**

Full-width black strip above the nav, 36px tall, centered microcopy with an underlined "Learn more" link and a close control at the far right.

### **`hero-photo-card`**

Rounded media card used in the home hero and solution pages. It combines photography or abstract imagery with an overlaid dark agent-console module. Radius is usually 22px on large cards and 8px on smaller thumbnails.

### **`agent-console-card`**

Dark product mockup panel showing agent names, status chips, integration badges, prompt fields, and generated response cards. Background is near-black, text is white or muted, and small accent chips use product colors.

### **`trust-logo-strip`**

Centered copy above a row of monochrome customer logos. It is intentionally quiet: no cards, no borders, just large horizontal spacing and black or white logos depending on the background.

### **`capability-card`**

Content block with thin-line geometric illustration, 24px heading, body copy, and a text link. On light backgrounds, cards often have only a top rule or a subtle image/card relationship rather than full boxing.

### **`dark-feature-band`**

Dark navy-to-plum gradient full-width section used for the admin sidebar and dark feature bands. Text turns white; nav items use translucent white overlays with blue and pink undertones.

### **`product-card`**

Warm stone card used for product/model summaries. Typically 3-column on desktop, with 8px radius, generous padding, a small pill button, a divider line, and checkmark bullet rows.

### **`blog-filter-chip`**

Large coral taxonomy chip used on the blog index. Active chips invert to coral fill with dark text; inactive chips use coral outline and pale fill. Typography is oversized relative to typical filters, making the taxonomy a hero-level control.

### **`research-table`**

Rule-separated publication list with title left, topic pills centered, and date right. Rows are tall, white, and border-driven; filters above use many compact outlined pills.

### **`contact-form-card`**

Rounded white form panel set against dark green or warm stone sections. Inputs are rectangular with thin gray borders, 12px-16px padding, and compact labels/placeholders. Submit uses the same near-black pill style as primary CTAs.

### **`footer-newsletter`**

Dark footer subscription block with coral "AI moves fast" label, white headline, muted legal microcopy, a single-line email field, and arrow submit marker. Footer columns use white section labels and muted links.

## Do's and Don'ts

### Do

- Use cream canvas as the default surface; introduce pale-blue or pale-pink washes as section backgrounds.
- Keep primary CTAs using the blue-to-pink gradient with dark text for strong contrast.
- Use 22px radius on major media cards and placeholders.
- Use pink for editorial taxonomy and small warm accents.
- Use the dark gradient sidebar for admin navigation.
- Let gradient buttons and status badges carry color, while the UI shell stays restrained.

### Don't

- Do not use the gradient on non-interactive text or body copy.
- Do not add heavy drop shadows to cards.
- Do not make every section card-based; use unframed rows, rules, and open space between sections.
- Do not use rounded cards below 8px for major media.
- Do not replace the display/body type split with one generic sans-serif voice.
- Do not render undocumented interaction variants in documentation or previews.
- Do not use saturated solid fills as normal UI backgrounds; keep gradients as the primary visual treatment.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---:|---|
| Small Mobile | <425px | Single-column cards, compact nav, reduced hero headline scale |
| Mobile | 425-640px | Hero media stacks, card grids become one column, form rows stack |
| Large Mobile | 640-768px | Wider one-column layouts with larger media cards |
| Tablet | 768-1024px | Two-column cards begin, nav spacing tightens |
| Desktop | 1024-1440px | Full nav, 3-column card grids, split hero compositions |
| Large Desktop | 1440-2560px | Wide containers and large empty vertical intervals |

### Touch Targets

Primary CTAs and pills meet comfortable touch sizing through 12px-24px padding and pill radii. Research filter chips and blog category chips are larger than standard tags, making dense taxonomy surfaces usable on touch devices.

### Collapsing Strategy

- Nav collapses from full horizontal links to a compact mobile menu.
- Hero media moves from split cards to stacked cards.
- Product and capability grids collapse from 3 columns to 2 and then 1.
- Form fields collapse from paired rows to a single column.
- Research rows preserve their rule-separated structure but stack metadata below titles on smaller widths.

## Iteration Guide

1. Start from a cream canvas or a pale-blue/pale-pink wash; avoid mid-tone page backgrounds unless the design calls for a specific CTA/form section.
2. Use `button-primary` (gradient) for the single highest-priority action and `button-secondary` for the companion action.
3. Use the dark gradient sidebar for admin navigation panels.
4. For tabular data, use rule-separated rows with pale-blue hover states.
5. Keep component examples structurally honest: placeholder product frames are better than invented product content.

## Known Gaps

- Exact proprietary font files are not bundled; use the documented fallbacks when implementing externally.
- Mobile screenshots were not regenerated in this public update, so mobile behavior is documented from the desktop system and existing responsive patterns.
- Some live pages lazy-load content blocks late; blank testimonial placeholders are documented as placeholder skeleton surfaces rather than filled testimonial cards.
