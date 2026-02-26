# Design System — Sales Management Platform

Version: 1.0
Status: Production-ready specification

---

## 1. Design Philosophy

### Core Principles

1. **Clarity over decoration** — Every element exists to help the user complete a task. No ornamental UI. No gratuitous gradients, glows, or animations.
2. **Density without clutter** — Business software demands information density. Achieve it through deliberate whitespace and typographic hierarchy, not by cramming elements together.
3. **Consistency as trust** — Identical patterns behave identically everywhere. The owner should never wonder "what does this button do here?"
4. **Speed of use** — Optimize for repeat usage. The owner enters sales dozens of times a day; every unnecessary click or confirmation is a cost.
5. **Quiet confidence** — The UI should feel like a reliable tool, not a marketing page. Muted palette, restrained motion, solid typography.

### UX Priorities (Ordered)

1. Data entry speed (sales form).
2. At-a-glance comprehension (dashboard, reports).
3. Error prevention over error correction.
4. Mobile usability (not a separate experience — same patterns, adapted layout).

### Emotional Tone

- **Trust**: Clean lines, consistent spacing, professional palette. No playful illustrations or emoji.
- **Clarity**: Strong typographic hierarchy. One primary action per screen. Obvious feedback.
- **Efficiency**: Minimal navigation depth. Keyboard-friendly forms. Fast transitions (or none).

---

## 2. Design Tokens

All tokens are defined as a structured JSON object. Frontend implementation should consume these via CSS custom properties or a theme provider.

```json
{
  "color": {
    "primitive": {
      "slate50": "#f8fafc",
      "slate100": "#f1f5f9",
      "slate200": "#e2e8f0",
      "slate300": "#cbd5e1",
      "slate400": "#94a3b8",
      "slate500": "#64748b",
      "slate600": "#475569",
      "slate700": "#334155",
      "slate800": "#1e293b",
      "slate900": "#0f172a",
      "blue500": "#3b82f6",
      "blue600": "#2563eb",
      "blue700": "#1d4ed8",
      "green500": "#22c55e",
      "green600": "#16a34a",
      "green700": "#15803d",
      "red500": "#ef4444",
      "red600": "#dc2626",
      "amber500": "#f59e0b",
      "amber600": "#d97706",
      "white": "#ffffff"
    },
    "semantic": {
      "background": {
        "primary": "{slate50}",
        "secondary": "{white}",
        "tertiary": "{slate100}",
        "inverse": "{slate900}"
      },
      "text": {
        "primary": "{slate900}",
        "secondary": "{slate600}",
        "tertiary": "{slate400}",
        "inverse": "{white}",
        "link": "{blue600}"
      },
      "border": {
        "default": "{slate200}",
        "strong": "{slate300}",
        "focus": "{blue500}"
      },
      "interactive": {
        "primary": "{blue600}",
        "primaryHover": "{blue700}",
        "secondary": "{slate100}",
        "secondaryHover": "{slate200}",
        "danger": "{red600}",
        "dangerHover": "{red500}"
      },
      "status": {
        "success": "{green600}",
        "successBg": "#f0fdf4",
        "warning": "{amber600}",
        "warningBg": "#fffbeb",
        "error": "{red600}",
        "errorBg": "#fef2f2",
        "info": "{blue600}",
        "infoBg": "#eff6ff"
      }
    }
  },

  "typography": {
    "fontFamily": {
      "sans": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "mono": "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem"
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.625"
    },
    "fontWeight": {
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    }
  },

  "spacing": {
    "_comment": "4pt base grid",
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "8": "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem"
  },

  "radius": {
    "none": "0",
    "sm": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },

  "shadow": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)"
  },

  "border": {
    "width": {
      "thin": "1px",
      "medium": "2px"
    },
    "style": "solid"
  },

  "zIndex": {
    "base": 0,
    "dropdown": 100,
    "sticky": 200,
    "overlay": 300,
    "modal": 400,
    "toast": 500
  },

  "motion": {
    "duration": {
      "instant": "50ms",
      "fast": "150ms",
      "normal": "250ms",
      "slow": "350ms"
    },
    "easing": {
      "default": "cubic-bezier(0.4, 0, 0.2, 1)",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)"
    }
  }
}
```

### Token Usage Rules

- Never use raw hex values in component code; always reference semantic tokens.
- Spacing must land on the 4pt grid. If a value falls between steps, round to the nearest token.
- Shadows increase with visual elevation: cards use `sm`, dropdowns use `md`, modals use `lg`.
- Motion is reserved for feedback (toasts, state changes). No decorative animations.

---

## 3. Component Standards

### 3.1 Button

| Variant       | Background              | Text           | Border           | Use case                                           |
| ------------- | ----------------------- | -------------- | ---------------- | -------------------------------------------------- |
| **Primary**   | `interactive.primary`   | `text.inverse` | none             | Single main CTA per view (e.g., "Complete Sale").  |
| **Secondary** | `interactive.secondary` | `text.primary` | `border.default` | Supporting actions (e.g., "Cancel", "Export CSV"). |
| **Danger**    | `interactive.danger`    | `text.inverse` | none             | Destructive actions (e.g., "Void Sale").           |
| **Ghost**     | transparent             | `text.link`    | none             | Inline or tertiary actions (e.g., "View Receipt"). |

**States**: default, hover (+darker bg), focus (2px focus ring `border.focus`), active (scale 0.98), disabled (opacity 0.5, cursor not-allowed).

**Rules**:

- One primary button per visible area.
- Minimum tap target: 44×44px on mobile.
- Always use a verb label ("Save", "Export"), never vague labels ("Submit", "OK").
- Icons allowed only when paired with text, except in icon-button variant (requires `aria-label`).

**Accessibility**:

- Contrast ratio ≥ 4.5:1 for text on button background.
- Visible focus ring on keyboard navigation.
- `disabled` buttons must not be focusable (use `aria-disabled` if focus is needed for tooltip).

---

### 3.2 Input

**Variants**: Text, Number, Email, Date, Select, Textarea.

**States**:

- **Default**: `border.default`, `background.secondary`.
- **Focus**: `border.focus` (2px), subtle shadow.
- **Error**: `status.error` border, error message below.
- **Disabled**: `background.tertiary`, `text.tertiary`, cursor not-allowed.
- **Read-only**: No border change, `background.tertiary`.

**Rules**:

- Label always visible above the field. No placeholder-only labels.
- Error messages appear below the field, prefixed with an icon, in `status.error` color.
- Helper text (if needed) appears below the label in `text.secondary`.
- Monetary inputs: right-aligned value, currency symbol outside the field or as a prefix addon.

**Accessibility**:

- Every input must have an associated `<label>` or `aria-label`.
- Error messages linked via `aria-describedby`.

---

### 3.3 Card

- Background: `background.secondary`.
- Border: `border.default`, 1px.
- Radius: `radius.lg`.
- Shadow: `shadow.sm`.
- Padding: `spacing.5` (desktop), `spacing.4` (mobile).

**Rules**:

- Cards group related content (e.g., a KPI, a sale summary, a settings section).
- No nested cards.
- If a card is clickable, it must have `cursor: pointer`, a hover state (`shadow.md`), and keyboard focus support.

---

### 3.4 Modal

- Overlay: `slate900` at 50% opacity.
- Container: `background.secondary`, `radius.xl`, `shadow.xl`.
- Max width: 480px (small), 640px (medium).
- Padding: `spacing.6`.
- Close: "X" button top-right, also closeable via Escape key.

**Rules**:

- Used sparingly: only for confirmations, receipt preview, or focused forms that block context.
- Never stack modals (no modal-over-modal).
- Focus is trapped inside the modal while open.
- On close, focus returns to the element that triggered the modal.

**Accessibility**:

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to modal title.
- Focus trap with Tab/Shift+Tab cycling within modal content.

---

### 3.5 Table

- Header row: `background.tertiary`, `text.secondary`, `fontSize.sm`, `fontWeight.semibold`, uppercase.
- Body rows: `background.secondary`, alternating row stripe optional (`background.primary`).
- Row hover: `background.tertiary`.
- Cell padding: `spacing.3` vertical, `spacing.4` horizontal.
- Borders: horizontal only (`border.default`).

**Rules**:

- Numeric columns (price, quantity, total) right-aligned.
- Text columns left-aligned.
- Action columns (view, delete) right-aligned.
- Always include a "no data" empty state row when the table has zero rows.
- On mobile: convert to stacked card layout (each row becomes a card) for tables wider than viewport.

**Accessibility**:

- Use semantic `<table>`, `<thead>`, `<th scope="col">`.
- Sortable columns announced via `aria-sort`.

---

### 3.6 Badge

- Small label inside a pill shape (`radius.full`).
- Padding: `spacing.1` vertical, `spacing.2` horizontal.
- Font: `fontSize.xs`, `fontWeight.medium`.

**Variants**:

- **Success** (green): "Completed" status.
- **Warning** (amber): "Pending" or attention.
- **Error** (red): "Void", "Failed".
- **Neutral** (slate): default/informational.

**Rules**: Badges are read-only indicators, never interactive.

---

### 3.7 Toast / Notification

- Position: top-right (desktop), top-center (mobile).
- Duration: 4 seconds auto-dismiss for success/info; persistent until dismissed for errors.
- Shadow: `shadow.lg`.
- Left accent border (4px) in status color.
- Includes close button.
- Z-index: `zIndex.toast`.

**Variants**: success, error, warning, info.

**Accessibility**:

- `role="alert"` for errors, `role="status"` for info/success.
- Should not steal focus; announced by screen readers automatically via live region.

---

### 3.8 Navbar

- Height: 56px (desktop), 48px (mobile).
- Background: `background.secondary`.
- Bottom border: `border.default`.
- Contents: Logo/business name (left), navigation links (center or left), user menu (right).
- Sticky (`position: sticky`, `zIndex.sticky`).

**Rules**:

- Max 4–5 top-level nav items for this product (Dashboard, New Sale, History, Settings).
- Active link indicated by bottom border accent (`interactive.primary`, 2px) and `fontWeight.semibold`.
- On mobile: collapse to a hamburger menu or bottom tab bar.

---

### 3.9 Sidebar (Optional / Future)

- Width: 240px expanded, 64px collapsed (icon-only).
- Background: `background.secondary` or `background.inverse` for contrast.
- Used only if navigation complexity warrants it (e.g., multi-branch with sub-sections).
- For Phase 1: prefer top navbar; sidebar is a scaling consideration.

---

### 3.10 KPI Metric Card

- Extends Card component.
- Layout:
  - Label (`fontSize.sm`, `text.secondary`): e.g., "Today's Revenue".
  - Value (`fontSize.2xl` or `3xl`, `fontWeight.bold`, `text.primary`): e.g., "£1,245.00".
  - Optional trend indicator: small text + arrow icon showing change direction, colored green (positive) or red (negative).
- Fixed height within dashboard grid for visual alignment.

**Rules**:

- Max 4 KPI cards per row on desktop; stack vertically on mobile.
- Value is the visual anchor; label is secondary.

---

## 4. Layout System

### 4.1 Grid

- **System**: 12-column CSS Grid on desktop, collapsing to single column on mobile.
- **Gutter**: `spacing.6` (24px) on desktop, `spacing.4` (16px) on mobile.

### 4.2 Container Widths

| Token          | Value  | Use                          |
| -------------- | ------ | ---------------------------- |
| `container.sm` | 640px  | Login, narrow forms.         |
| `container.md` | 768px  | Settings, receipt preview.   |
| `container.lg` | 1024px | Sales form, reports.         |
| `container.xl` | 1280px | Dashboard, full-width views. |

- All containers centered with auto margins.
- No content stretches to full viewport width.

### 4.3 Responsive Breakpoints

| Name      | Min-width | Target                             |
| --------- | --------- | ---------------------------------- |
| `mobile`  | 0         | Phones (portrait).                 |
| `tablet`  | 640px     | Tablets, large phones (landscape). |
| `desktop` | 1024px    | Laptops, desktops.                 |
| `wide`    | 1280px    | Large monitors.                    |

- Design mobile-first: base styles target mobile, then override upward with `min-width` media queries.

### 4.4 Page Layout Templates

**Authenticated pages**:

```
┌────────────────────────────────┐
│          Navbar (sticky)       │
├────────────────────────────────┤
│                                │
│     Container (max-width)      │
│     ┌────────────────────┐     │
│     │   Page Content     │     │
│     │                    │     │
│     └────────────────────┘     │
│                                │
└────────────────────────────────┘
```

**Dashboard layout**:

```
┌────────────────────────────────┐
│            Navbar              │
├────────────────────────────────┤
│  KPI Cards (4-col grid)       │
│  ┌──────┐┌──────┐┌──────┐┌──┐│
│  │ Rev  ││ Sales││ Avg  ││Tax││
│  └──────┘└──────┘└──────┘└──┘│
├────────────────────────────────┤
│  Charts row (2-col grid)      │
│  ┌──────────────┐┌──────────┐ │
│  │ Weekly Trend  ││Top Items │ │
│  └──────────────┘└──────────┘ │
└────────────────────────────────┘
```

**Login page**:

```
┌────────────────────────────────┐
│          Centered card         │
│      container.sm (640px)      │
│     ┌────────────────────┐     │
│     │  Logo / Title      │     │
│     │  Email input       │     │
│     │  Password input    │     │
│     │  [Login button]    │     │
│     └────────────────────┘     │
└────────────────────────────────┘
```

---

## 5. Accessibility Guidelines

### 5.1 Contrast Ratios

- **Normal text** (< 18px): minimum 4.5:1 against background.
- **Large text** (≥ 18px bold or ≥ 24px): minimum 3:1.
- **Interactive elements** (buttons, links): minimum 3:1 for non-text contrast (borders, icons against background).
- Validate with tooling (e.g., axe, Lighthouse) before each release.

### 5.2 Focus States

- Every interactive element must have a visible focus indicator.
- Default: 2px solid ring using `border.focus` color with 2px offset.
- Never remove `outline` without replacing it with an equally visible alternative.

### 5.3 Keyboard Navigation

- All features must be operable via keyboard alone.
- Tab order follows logical reading order (top-to-bottom, left-to-right).
- Modals trap focus; Escape closes them.
- Dropdown menus navigable via Arrow keys; Enter/Space to select.
- Skip-to-content link on every page (hidden until focused).

### 5.4 ARIA Considerations

- Use semantic HTML first (`<button>`, `<nav>`, `<main>`, `<table>`). Only add ARIA when semantics are insufficient.
- All images and icons that convey meaning must have `alt` text or `aria-label`.
- Decorative icons use `aria-hidden="true"`.
- Form errors announced via `aria-live="polite"` regions or `aria-describedby` on fields.
- Loading states announced: `aria-busy="true"` on the container, or a live region with "Loading…" text.

---

## 6. Interaction & UX Guidelines

### 6.1 Loading States

- **Inline loaders**: Use a subtle skeleton placeholder (pulsing `background.tertiary` blocks) matching the shape of expected content. No spinners on initial page loads.
- **Button loading**: Replace label with a small spinner + "Processing…" text. Disable the button to prevent double-submit.
- **Table loading**: Skeleton rows (3–5 rows of grey bars).

### 6.2 Error Handling UI

- **Form validation errors**: Inline, per-field, appearing on blur or on submit. Red border + message below the field.
- **API/server errors**: Toast notification (error variant, persistent). Include a short human-readable message; never show raw error codes or stack traces.
- **Network failure**: Banner at top of page: "Connection lost. Retrying…" with auto-retry logic.

### 6.3 Empty States

Every data view must have a designed empty state:

- **Sales history (no sales yet)**: Illustration-free message: "No sales recorded yet. Create your first sale to get started." with a CTA button linking to New Sale.
- **Dashboard (no data for period)**: "No sales data for this period." — KPI cards show £0.00 / 0, not blank.
- **Reports (no data)**: "No data available for the selected week."

Rules:

- Empty states must never be a blank white screen.
- Always provide a next-action hint or link.

### 6.4 Confirmation Patterns

- **Destructive actions** (Void Sale): Require an explicit confirmation modal with:
  - Clear description of what will happen.
  - Danger-styled confirm button with specific label ("Void This Sale", not "Yes").
  - Secondary cancel button.
- **Non-destructive actions** (Create Sale): No confirmation modal. Use optimistic feedback (toast: "Sale recorded successfully").

### 6.5 Form Validation Feedback

- Validate on blur for individual fields (immediate feedback).
- Validate on submit for cross-field rules (e.g., "at least one item required").
- Show all errors at once on submit; do not reveal them one-by-one.
- Success state: brief green checkmark or border transition, then revert to default.

---

## 7. Anti-Patterns to Avoid ("AI-Generated" Aesthetic)

### What makes a UI feel AI-generated

1. **Excessive symmetry and uniformity** — Every card the same size, every section the same padding, robotic grid perfection with no visual variety.
2. **Overly rounded, bubbly elements** — Giant border-radius on everything, oversized padding, "friendly" to the point of looking like a toy.
3. **Gratuitous gradients and glassmorphism** — Frosted glass cards, rainbow gradients, glowing borders.
4. **Generic stock illustrations** — Undraw-style SVG people waving.
5. **Too many colors** — Using 6+ accent colors without hierarchy.
6. **Decorative motion** — Elements bouncing in on page load, parallax, hover animations on data.
7. **Vague, cheerful microcopy** — "Yay! You did it!" instead of "Sale completed."
8. **Drop shadows on everything** — Every element floating above the page.

### How to avoid it

- **Introduce subtle asymmetry**: KPI cards can have different content heights; not everything needs to be pixel-identical.
- **Use restraint**: One accent color (blue). Shadows only where elevation is meaningful (cards, modals, dropdowns — not buttons or badges).
- **Professional tone in copy**: Direct, factual microcopy. "Sale #1042 recorded — £84.50" not "Great job! Sale saved!"
- **Minimal decoration**: No illustrations on empty states; use text and a CTA. No background patterns.
- **Flat over floating**: Prefer bordered cards (`shadow.sm` or none) over heavy lifted shadows.
- **Static over animated**: Data appears; it does not slide, fade, or bounce in. Reserve motion for toasts and route transitions (fast, ≤150ms).
- **Whitespace is intentional**: Let dense areas breathe, but don't pad every element equally. Data tables are compact; settings forms are spacious.

---

## 8. Scaling Strategy

### Phase 1 (Current — Single Branch)

- Implement tokens as CSS custom properties (`:root` variables).
- Build components as plain React components with props for variant/state.
- No component library publishing; components live in `frontend/src/core/components/`.

### Phase 2 (Growth — Multi-Branch, Staff Users)

- Extract shared components into an internal package (e.g., `packages/ui`) if the repo becomes a monorepo.
- Add dark-mode token layer (swap semantic token values; primitives remain the same).
- Introduce Storybook for component documentation if a second developer joins.

### Phase 3 (Scale — SaaS / White-Label)

- Tokenize brand colors for per-tenant theming (swap `interactive.primary`, logo, fonts).
- Publish design tokens as a standalone JSON/CSS package consumed by multiple frontends.
- Formalize the component library with versioned releases.

### Token Architecture for Theming

```
Primitive tokens  →  Semantic tokens  →  Component tokens
(raw colors)         (intent-based)       (button.bg, input.border)
```

This three-tier structure ensures that changing a brand color propagates correctly without touching component code.

---

This design system is the single source of truth for all UI decisions. Deviations require explicit justification and must be recorded as design debt.
