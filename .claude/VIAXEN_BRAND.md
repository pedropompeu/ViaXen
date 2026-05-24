# VIAXEN — Brand Identity System
> Version 1.0 · Enterprise Design Language · Confidential

---

## 01. Brand Overview

### Identity Statement
VIAXEN is an enterprise B2B SaaS platform for intelligent route calculation, logistics optimization, and freight management. The brand communicates precision, operational intelligence, and technological sophistication.

### Brand Positioning
- **Category:** Enterprise Logistics Technology
- **Segment:** B2B Premium / Unicorn-tier SaaS
- **Tone:** Sophisticated · Technical · Reliable · Fast
- **Comparable Brands:** Stripe, Linear, Uber Freight, SAP, Flexport

### Brand Personality
| Trait | Expression |
|---|---|
| Intelligent | Data-driven UI, smart micro-interactions |
| Precise | Exact typography, tight grids, pixel-perfect icons |
| Fast | Minimal animation duration, snappy transitions |
| Reliable | Consistent system, no visual noise |
| Enterprise | Dense information architecture, professional palette |

---

## 02. Logo System

### Primary Logomark
The VIAXEN logo consists of two elements:

**Symbol — The V-Node:**
- A geometric bold V-shape rendered as a continuous stroke path
- A circular node (dot) placed at the inner vertex of the V
- The node represents a route waypoint — the core product concept
- Optional speed lines extending to the right of the V (used in icon contexts)
- Never use a literal truck, road, globe, or arrow as a symbol

**Wordmark:**
- The letter "V" is rendered in Cyan `#00E5FF`
- The remaining letters "IAXEN" are rendered in Off-White `#E8EDF5`
- Font: Space Grotesk 700
- Letter-spacing: −0.02em (tight tracking for premium feel)
- The V and the wordmark are visually unified — never separate them

### SVG Source (Primary Icon — 52×52)
```svg
<svg width="52" height="52" viewBox="0 0 52 52" fill="none">
  <rect x="1" y="1" width="50" height="50" rx="14"
        fill="#0D1117" stroke="rgba(0,229,255,0.3)" stroke-width="1"/>
  <path d="M12 14 L22 38 L26 30 L30 38 L40 14"
        stroke="#00E5FF" stroke-width="3.5"
        stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="26" cy="30" r="3" fill="#00E5FF"/>
  <line x1="34" y1="23" x2="44" y2="23"
        stroke="rgba(0,229,255,0.3)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="36" y1="27" x2="44" y2="27"
        stroke="rgba(0,229,255,0.2)" stroke-width="1" stroke-linecap="round"/>
</svg>
```

### Logo Variants

| Variant | Background | V Color | Wordmark Color | Use Case |
|---|---|---|---|---|
| Primary Dark | `#0D1117` | `#00E5FF` | `#E8EDF5` | App, website, dark contexts |
| Light | White / `#F0F4F8` | `#1A6BFF` | `#0D1117` | Print, light mode, documents |
| Monochrome | Any light | `#1A2A3E` | `#1A2A3E` | Single-color printing, stamps |
| Reversed | Any dark | `#00E5FF` | `#FFFFFF` | Vehicle decals, presentations |
| Icon Only | `#0D1117` | `#00E5FF` | — | Favicon, app icon, avatar |

### Logo Clear Space
Minimum clear space around the full lockup = height of the "X" character in the wordmark on all sides. Never place other visual elements within this zone.

### Logo Don'ts
- Never rotate, skew, or distort the logo
- Never apply drop shadows or glows to the logo
- Never place on busy photographic backgrounds without an overlay
- Never change the cyan V to any other color
- Never separate the symbol from the wordmark (except icon-only contexts)
- Never use a wordmark smaller than 14px cap height

---

## 03. Color System

### Foundation Palette — Dark Backgrounds

```css
/* Background Hierarchy — always use in this order, dark to light */
--vx-black:    #080C10;  /* Page background, deepest layer */
--vx-dark:     #0D1117;  /* Primary container, main panels */
--vx-surface:  #111823;  /* Elevated surfaces, sidebars, headers */
--vx-card:     #161E2A;  /* Cards, modals, dialogs */
--vx-graphite: #1F2B3A;  /* Hover states, active items */
--vx-subtle:   #2A3A4E;  /* Borders (opaque), dividers */
--vx-muted:    #5A6F8A;  /* Placeholder text, disabled labels */
```

### Accent Palette — Use Sparingly

```css
/* Primary Accent — Electric Cyan */
--vx-cyan:         #00E5FF;  /* CTAs, active states, logo V, highlights */
--vx-cyan-dark:    #00B5CC;  /* Hover state of cyan elements */
--vx-cyan-dim:     rgba(0, 229, 255, 0.15);  /* Cyan tinted backgrounds */
--vx-cyan-glow:    rgba(0, 229, 255, 0.08);  /* Active sidebar items, subtle fills */
--vx-cyan-border:  rgba(0, 229, 255, 0.12);  /* Card borders on dark bg */

/* Secondary Accent — Electric Blue */
--vx-blue:         #1A6BFF;  /* Secondary actions, links, chart series 2 */
--vx-blue-deep:    #0A2D6B;  /* Blue tinted fills, badges */
```

### Semantic Colors

```css
--vx-success:  #00D68F;  /* On-time delivery, positive delta */
--vx-warning:  #FF9B21;  /* Delay alerts, caution states */
--vx-danger:   #FF4D4D;  /* Route failure, critical errors */
--vx-info:     #4DA6FF;  /* Informational, neutral highlights */
```

### Text Colors

```css
--vx-text-primary:   #E8EDF5;  /* Primary content, headings */
--vx-text-secondary: #9BADC5;  /* Supporting content, metadata */
--vx-text-muted:     #5A6F8A;  /* Placeholders, disabled, overlines */
--vx-text-inverse:   #080C10;  /* Text on cyan/light backgrounds */
```

### Color Usage Rules
1. **Cyan is precious** — use only on one focal element per screen section. It directs the eye.
2. **Never use cyan as a fill** for large areas — only for strokes, labels, small accents, and active indicators.
3. **Background layering** — always follow the depth hierarchy: `--vx-black` → `--vx-dark` → `--vx-surface` → `--vx-card`. Never skip levels.
4. **Semantic colors** — always paired with an icon. Never rely on color alone to convey state.
5. **Borders** — use `--vx-cyan-border` (`rgba(0,229,255,0.12)`) for card borders on dark backgrounds. Use `--vx-subtle` for dividers between sections.

---

## 04. Background & Surface System

This section defines the exact visual treatment for every surface type in the product. This is critical for maintaining the premium dark-tech aesthetic.

### 04.1 — Page Background (Deepest Layer)
**Usage:** Main page/body background, behind all containers.

```css
background-color: #080C10;
```

**Optional Grid Overlay** (used on hero sections, landing pages, empty states):
```css
background-image:
  linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px);
background-size: 48px 48px;
```
> Grid lines are cyan at 4% opacity — barely visible. They reinforce the "precision grid" aesthetic without competing with content.

**Optional Radial Glow** (hero/marketing contexts only, never in product UI):
```css
background-image: radial-gradient(
  ellipse 60% 50% at 50% 0%,
  rgba(0, 229, 255, 0.07) 0%,
  transparent 70%
);
```
> A soft cyan halo at the top center, simulating a light source from above. Adds depth and warmth to otherwise flat dark backgrounds.

---

### 04.2 — Primary Container Background
**Usage:** Main content panels, dashboard body, page sections.

```css
background-color: #0D1117;
```

No additional effects. This surface must be clean and neutral — content is the focus.

---

### 04.3 — Elevated Surface (Sidebar, Topbar, Panel Headers)
**Usage:** Navigation sidebar, top header bar, command palettes.

```css
background-color: #111823;
border-right: 1px solid rgba(0, 229, 255, 0.12);  /* or border-bottom for topbar */
```

**Optional subtle top-edge glow** (only for top header bar):
```css
box-shadow: 0 1px 0 0 rgba(0, 229, 255, 0.08);
```

---

### 04.4 — Card Surface
**Usage:** KPI cards, data cards, form containers, list items.

```css
background-color: #161E2A;
border: 1px solid rgba(0, 229, 255, 0.12);
border-radius: 10px;
```

**Active / Hovered Card:**
```css
background-color: #1F2B3A;
border-color: rgba(0, 229, 255, 0.25);
transition: background 180ms ease-out, border-color 180ms ease-out;
```

**Featured / Highlighted Card** (e.g. primary plan, selected route):
```css
background-color: #161E2A;
border: 1px solid rgba(0, 229, 255, 0.40);
box-shadow: 0 0 0 1px rgba(0, 229, 255, 0.08) inset;
```
> No hard glow — a subtle inner shadow simulates selection depth.

---

### 04.5 — Modal / Dialog Surface
**Usage:** Modals, overlays, drawers.

```css
/* Backdrop */
background-color: rgba(8, 12, 16, 0.85);
backdrop-filter: blur(8px);

/* Dialog box */
background-color: #161E2A;
border: 1px solid rgba(0, 229, 255, 0.18);
border-radius: 14px;
box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0,229,255,0.06);
```

---

### 04.6 — Map / Geo Background
**Usage:** Route map areas, geographic visualization panels.

```css
background: linear-gradient(
  135deg,
  rgba(10, 45, 107, 0.8) 0%,
  rgba(8, 12, 16, 0.95) 60%,
  rgba(13, 17, 23, 1) 100%
);
border: 1px solid rgba(0, 229, 255, 0.12);
border-radius: 10px;
```

Map grid overlay (simulates geographic coordinates):
```css
background-image:
  linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px);
background-size: 32px 32px;
```

---

### 04.7 — Code / Terminal Surface
**Usage:** Code snippets, API responses, log viewers, route data outputs.

```css
background-color: #080C10;
border: 1px solid rgba(0, 229, 255, 0.10);
border-left: 3px solid #00E5FF;
border-radius: 8px;
font-family: 'JetBrains Mono', 'Fira Code', monospace;
font-size: 13px;
color: #9BADC5;
padding: 16px 20px;
```

---

### 04.8 — Toast / Notification Surface
**Usage:** Real-time alerts, route updates, system messages.

```css
/* Base toast */
background-color: #1F2B3A;
border: 1px solid rgba(0, 229, 255, 0.18);
border-radius: 8px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

/* Success toast — left accent stripe */
border-left: 3px solid #00D68F;

/* Warning toast */
border-left: 3px solid #FF9B21;

/* Error toast */
border-left: 3px solid #FF4D4D;
```

---

### 04.9 — Data Table Surface
**Usage:** Route tables, fleet lists, freight records.

```css
/* Table container */
background-color: #0D1117;
border: 1px solid rgba(0, 229, 255, 0.10);
border-radius: 10px;
overflow: hidden;

/* Table header row */
background-color: #111823;
border-bottom: 1px solid rgba(0, 229, 255, 0.12);

/* Table row — default */
background-color: transparent;
border-bottom: 1px solid rgba(255, 255, 255, 0.04);

/* Table row — hover */
background-color: rgba(0, 229, 255, 0.03);

/* Table row — selected */
background-color: rgba(0, 229, 255, 0.07);
border-left: 2px solid #00E5FF;
```

---

### 04.10 — Scanning / Live Data Effect
**Usage:** Map panels, live telemetry areas, real-time data zones. Conveys "the system is watching."

```css
/* Parent container must have overflow: hidden and position: relative */
.scan-overlay {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 229, 255, 0.6) 50%,
    transparent 100%
  );
  animation: scanLine 2.4s ease-in-out infinite;
  pointer-events: none;
  z-index: 10;
}

@keyframes scanLine {
  from { transform: translateY(0); }
  to   { transform: translateY(var(--container-height, 200px)); }
}
```

---

## 05. Typography System

### Font Families

```css
/* Headings, KPIs, Labels, Logo, Navigation */
--font-display: 'Space Grotesk', sans-serif;

/* Body text, descriptions, long-form content */
--font-body: 'DM Sans', sans-serif;

/* Code, API keys, route IDs, terminal output */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale

| Token | Font | Weight | Size | Line-height | Letter-spacing | Usage |
|---|---|---|---|---|---|---|
| `--type-hero` | Space Grotesk | 700 | 56px | 1.05 | −0.03em | Landing hero, brand moments |
| `--type-h1` | Space Grotesk | 700 | 36px | 1.1 | −0.025em | Page titles |
| `--type-h2` | Space Grotesk | 600 | 24px | 1.2 | −0.02em | Section headings |
| `--type-h3` | Space Grotesk | 600 | 18px | 1.3 | −0.01em | Card titles, panel headers |
| `--type-h4` | Space Grotesk | 500 | 14px | 1.4 | 0 | Subsection labels |
| `--type-kpi` | Space Grotesk | 700 | 32px | 1.0 | −0.03em | KPI numbers, metrics |
| `--type-kpi-sm` | Space Grotesk | 700 | 20px | 1.0 | −0.02em | Secondary metrics |
| `--type-body` | DM Sans | 400 | 15px | 1.65 | 0 | Paragraphs, descriptions |
| `--type-body-sm` | DM Sans | 400 | 13px | 1.55 | 0 | Supporting text, metadata |
| `--type-label` | Space Grotesk | 600 | 11px | 1.4 | +0.05em | UI labels, nav items |
| `--type-overline` | DM Sans | 600 | 10px | 1.2 | +0.15em | Section overlines (uppercase) |
| `--type-code` | JetBrains Mono | 400 | 13px | 1.6 | 0 | Code, IDs, API responses |

### Typography Rules
- Overlines are always `text-transform: uppercase`
- KPI numbers must use `font-variant-numeric: tabular-nums` to prevent layout shift
- Never mix Space Grotesk and DM Sans in the same line of text
- Headings over 24px: always letter-spacing negative
- Body text max-width: `65ch` for readability

---

## 06. Spacing & Grid System

```css
/* Base unit: 4px */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;

/* Border radius */
--radius-sm:   6px;   /* Badges, tags, small chips */
--radius-md:   8px;   /* Buttons, inputs, small cards */
--radius-lg:   12px;  /* Standard cards, panels */
--radius-xl:   16px;  /* Modal dialogs, large containers */
--radius-full: 9999px; /* Pills, avatar circles */

/* Layout Grid */
--sidebar-width:     220px;
--sidebar-collapsed: 60px;
--topbar-height:     52px;
--content-max-width: 1280px;
--content-padding:   32px;
```

---

## 07. Component Specifications

### Button System

```css
/* Primary Button — Cyan */
.btn-primary {
  background: #00E5FF;
  color: #080C10;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: none;
  transition: background 150ms ease-out, transform 100ms ease-out;
}
.btn-primary:hover  { background: #00B5CC; }
.btn-primary:active { transform: scale(0.98); }

/* Secondary Button — Ghost */
.btn-secondary {
  background: transparent;
  color: #E8EDF5;
  border: 1px solid rgba(0, 229, 255, 0.25);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  transition: border-color 150ms, background 150ms;
}
.btn-secondary:hover {
  background: rgba(0, 229, 255, 0.06);
  border-color: rgba(0, 229, 255, 0.4);
}

/* Destructive Button */
.btn-danger {
  background: rgba(255, 77, 77, 0.12);
  color: #FF4D4D;
  border: 1px solid rgba(255, 77, 77, 0.25);
}
```

### Badge / Status Chip

```css
/* Base */
.badge {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Variants */
.badge-active   { color: #00D68F; background: rgba(0, 214, 143, 0.12); }
.badge-warning  { color: #FF9B21; background: rgba(255, 155, 33, 0.12); }
.badge-danger   { color: #FF4D4D; background: rgba(255, 77, 77, 0.12);  }
.badge-cyan     { color: #00E5FF; background: rgba(0, 229, 255, 0.12);  }
.badge-neutral  { color: #9BADC5; background: rgba(155, 173, 197, 0.10); }
```

### Input Fields

```css
.input {
  background: #111823;
  border: 1px solid rgba(0, 229, 255, 0.15);
  border-radius: var(--radius-md);
  color: #E8EDF5;
  font-family: var(--font-body);
  font-size: 14px;
  padding: 10px 14px;
  height: 40px;
  transition: border-color 150ms;
  outline: none;
}
.input::placeholder { color: #5A6F8A; }
.input:focus        { border-color: rgba(0, 229, 255, 0.5); }
```

---

## 08. Iconography System

### Style Rules
- **Style:** Outline only — never solid/filled
- **Stroke width:** 1.5px at 24px size, 1.25px at 20px, 1px at 16px
- **Corner style:** Rounded caps and joins (`stroke-linecap: round; stroke-linejoin: round`)
- **Size scale:** 16px (inline), 20px (UI standard), 24px (feature icons), 32px (empty states)
- **Color:** Inherits from parent — never hardcoded inside SVG icons

### Recommended Library
**Lucide Icons** (primary) — matches the geometric, clean aesthetic perfectly.
**Tabler Icons** (secondary) — for additional coverage.

### Domain-specific Icon Guidelines
| Concept | Use | Avoid |
|---|---|---|
| Route | path/flow line with nodes | literal road/highway |
| Fleet | small truck outline (side view) | 3D truck illustration |
| Location | pin or circle-dot | globes, maps with country borders |
| Speed | diagonal arrow, lightning bolt | speedometer illustration |
| Analytics | bar chart, line chart | pie chart (avoid entirely) |
| Settings | sliders/equalizer | gear/cog (too generic) |

---

## 09. Motion & Animation System

### Principles
- **Fast is smart:** Default interactions complete under 200ms. Only page transitions go to 320ms.
- **Purpose over decoration:** Every animation must communicate state change or guide attention.
- **Ease out for entries:** Elements appear quickly and settle gently.
- **No bounce:** No spring or elastic easing — they feel playful, not enterprise.

### Easing Tokens

```css
--ease-fast:       cubic-bezier(0.4, 0, 0.2, 1);  /* Standard UI — 150ms */
--ease-smooth:     cubic-bezier(0.16, 1, 0.3, 1); /* Page transitions — 320ms */
--ease-out:        cubic-bezier(0, 0, 0.2, 1);    /* Entries — 240ms */
--ease-linear:     linear;                         /* Continuous loops — route lines */
```

### Duration Tokens

```css
--dur-instant:    80ms;   /* Hover state changes */
--dur-fast:       150ms;  /* Button states, badge appearance */
--dur-standard:   240ms;  /* Panel slides, card reveals */
--dur-slow:       320ms;  /* Page transitions, modal open */
--dur-xslow:      600ms;  /* Complex route draw animations */
--dur-loop-fast:  1000ms; /* Spinner, pulsing nodes */
--dur-loop-std:   1400ms; /* Route dash-path animation */
--dur-loop-slow:  2400ms; /* Scan line, ambient effects */
```

### Defined Animations

**Route Path Draw:**
```css
@keyframes routeDash {
  to { stroke-dashoffset: -48; }
}
.route-animated {
  stroke-dasharray: 12 8;
  animation: routeDash 1.4s linear infinite;
}
```

**Node Pulse (active waypoint):**
```css
@keyframes nodePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.55; transform: scale(0.82); }
}
.node-active {
  animation: nodePulse 2s ease-in-out infinite;
}
```

**Scan Line (live data panels):**
```css
@keyframes scanLine {
  from { transform: translateY(-100%); }
  to   { transform: translateY(300%); }
}
.scan-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0,229,255,0.6), transparent);
  animation: scanLine 2.4s ease-in-out infinite;
}
```

**Loading Spinner:**
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
/* Applied to a partial arc SVG path with transform-origin at center */
```

**Fade + Slide In (UI entries):**
```css
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.enter { animation: fadeSlideIn 240ms var(--ease-out) both; }
```

**Staggered list entry** (for table rows, card grids):
```css
/* Apply animation-delay: calc(index * 40ms) to each item */
```

### Accessibility
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 10. Data Visualization System

### Chart Color Sequence
When using multiple data series in charts, use this order:
1. `#00E5FF` — Electric Cyan (primary series)
2. `#1A6BFF` — Electric Blue (secondary series)
3. `#00D68F` — Success Green (positive/on-time)
4. `#FF9B21` — Warning Amber (delayed/at-risk)
5. `#FF4D4D` — Danger Red (failed/overdue)
6. `#9BADC5` — Muted Blue-gray (neutral/forecast)

### Chart Styling Rules
- Background: transparent (inherits card bg `#161E2A`)
- Grid lines: `rgba(255, 255, 255, 0.04)` — barely visible horizontal lines only
- Axis labels: DM Sans 11px, color `#5A6F8A`
- Tooltip: `#1F2B3A` bg, `rgba(0,229,255,0.25)` border, Space Grotesk values
- Active data point: solid dot with outer ring `rgba(0,229,255,0.2)` at 8px radius
- Area charts: gradient fill from 25% opacity at top to 0% at baseline
- Never use pie or donut charts — use bar or line charts

---

## 11. Imagery & Photography Guidelines

### Photography Style
- **Color treatment:** Dark, desaturated. High contrast. Blue-tinted shadows.
- **Subject matter:** Aerial logistics shots, urban intersections at night, warehouse operations, truck convoys
- **Composition:** Wide shots, geometric overhead views, motion blur for speed
- **Avoid:** Stock photo smiling people, generic handshakes, maps with country borders, daytime suburban roads

### Overlay Treatment
When placing photography behind UI or text:
```css
/* Darken + tint photo */
background-blend-mode: multiply;
filter: brightness(0.4) contrast(1.1) saturate(0.6);

/* Then layer a gradient overlay */
background-image:
  linear-gradient(to bottom, rgba(8,12,16,0.3) 0%, rgba(8,12,16,0.95) 100%),
  url('photo.jpg');
```

---

## 12. Voice & Messaging

### Brand Voice Attributes
| Attribute | In Practice |
|---|---|
| **Precise** | Use exact numbers. "97.3% on-time" not "almost all deliveries" |
| **Technical** | Use domain language: "route optimization," "telemetry," "ETA accuracy" |
| **Efficient** | Short sentences. No filler. Get to the point. |
| **Confident** | Statements, not suggestions. "VIAXEN calculates..." not "VIAXEN can help you..." |

### Tagline Options
- "Route Intelligence at Scale" *(primary)*
- "Every Route. Optimized."
- "Logistics, Engineered."
- "Precision Logistics Platform"

### Messaging Hierarchy
1. **Hero:** Intelligence that moves your fleet forward.
2. **Sub-headline:** Real-time route optimization, freight management, and operational analytics for enterprise logistics.
3. **CTA Primary:** Request a Demo
4. **CTA Secondary:** See How It Works

---

## 13. Application Examples

### How to Use This File with Claude Code

Paste this file into your project and use the following prompt:

```
Read VIAXEN_BRAND.md and scaffold a Next.js 14 app with:
- Tailwind config with all color tokens
- CSS variables for the full design system
- shadcn/ui customized to the VIAXEN theme
- Dashboard layout: sidebar (220px) + topbar (52px) + content area
- KPICard, RouteCard, StatusBadge, DataTable components
- Page backgrounds with the grid overlay from section 04.1
- Card surfaces from section 04.4
- Scan-line animation from section 04.10 on map panels
- All typography from section 05
```

---

## 14. File & Asset Naming Conventions

```
/brand/
  logo/
    viaxen-logo-dark.svg
    viaxen-logo-light.svg
    viaxen-logo-mono.svg
    viaxen-icon-96.svg
    viaxen-icon-32.svg
    viaxen-favicon.ico
  fonts/
    SpaceGrotesk-Variable.woff2
    DMSans-Variable.woff2
    JetBrainsMono-Regular.woff2
  colors/
    viaxen-palette.ase    (Adobe Swatch Exchange)
    viaxen-palette.clr    (Figma / Sketch)
  docs/
    VIAXEN_BRAND.md       (this file)
    brand-guidelines.pdf
```

---

*VIAXEN Brand Identity System — v1.0*
*For internal use and licensed implementation only.*
*Update this document whenever the design system evolves.*
