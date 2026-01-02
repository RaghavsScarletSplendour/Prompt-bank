# Landing Page Design Plan
## Prompt Bank - AI Prompt Management Platform

**Designer:** Senior UI/UX Designer (20 years @ Google)
**Date:** January 2026
**Version:** 1.0

---

## Executive Summary

This plan outlines a conversion-focused landing page that maintains the application's dark, futuristic aesthetic while introducing marketing-specific patterns. The design leverages the existing particle system and glowing node aesthetic but extends it with gradient treatments, larger typography scales, and storytelling sections optimized for user acquisition.

---

## 1. Design Philosophy

### Core Principles

| Principle | Application |
|-----------|-------------|
| **Progressive Disclosure** | Reveal information as users scroll; don't overwhelm |
| **Social Proof Integration** | Build trust through numbers, testimonials, logos |
| **Clear Value Hierarchy** | Hero → Features → Proof → CTA flow |
| **Motion with Purpose** | Animate to guide attention, not distract |
| **Accessibility First** | WCAG 2.1 AA compliance, 4.5:1 contrast ratios |

### Differentiation from App UI

| App UI | Landing Page |
|--------|--------------|
| Utility-focused, dense | Marketing-focused, spacious |
| Consistent spacing (p-4, gap-4) | Generous whitespace (py-24, py-32) |
| Functional typography (14-18px) | Impact typography (48-96px) |
| Static cards | Animated reveals on scroll |
| Monochromatic accents | Gradient accents (cyan → violet) |
| Particles as background | Particles as interactive hero element |

---

## 2. Color System Extension

### Primary Palette (Inherited)
```css
--background: #0a0a0a          /* Pure dark */
--surface-primary: #1f2937     /* Card backgrounds */
--color-primary: #06b6d4       /* Cyan accent */
--color-text-primary: #f3f4f6  /* Light text */
--color-text-secondary: #9ca3af /* Muted text */
```

### Landing Page Extensions
```css
/* Gradient Accent (Hero & CTAs) */
--gradient-hero: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%);
--gradient-text: linear-gradient(90deg, #06b6d4 0%, #8b5cf6 100%);
--gradient-glow: radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%);

/* Section Backgrounds */
--section-alt: #0f1419          /* Slightly lighter for alternating sections */
--section-gradient: linear-gradient(180deg, #0a0a0a 0%, #0f1419 100%);

/* Feature Card Glow Colors */
--glow-cyan: rgba(6, 182, 212, 0.2)
--glow-violet: rgba(139, 92, 246, 0.2)
--glow-pink: rgba(236, 72, 153, 0.2)
```

---

## 3. Typography Scale

### Landing Page Type Scale
```css
/* Hero Headlines */
.hero-title {
  font-size: clamp(48px, 8vw, 96px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

/* Section Headlines */
.section-title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

/* Subheadlines */
.subheadline {
  font-size: clamp(18px, 2.5vw, 24px);
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

/* Feature Titles */
.feature-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
}

/* Body Text */
.body-text {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text-secondary);
}
```

---

## 4. Page Structure & Sections

### Section Overview

```
┌─────────────────────────────────────────────────┐
│  NAVIGATION BAR (Sticky)                        │
│  Logo | Features | Pricing | Sign In | Get Started
├─────────────────────────────────────────────────┤
│                                                 │
│  HERO SECTION                          [py-32] │
│  - Headline with gradient text                 │
│  - Subheadline (value proposition)             │
│  - CTA buttons (Primary + Secondary)           │
│  - Animated particles (enhanced)               │
│  - Floating UI preview mockup                  │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  SOCIAL PROOF BAR                      [py-12] │
│  - "Trusted by X+ prompt engineers"            │
│  - Company logos (if applicable)               │
│  - Star rating / review snippet                │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  FEATURES GRID                         [py-24] │
│  - 6 feature cards (2x3 grid)                  │
│  - Icon + Title + Description                  │
│  - Hover glow effect                           │
│  - Staggered scroll animations                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  PRODUCT SHOWCASE                      [py-24] │
│  - Large screenshot/mockup                     │
│  - Feature callouts with connecting lines      │
│  - Dark glass card overlay                     │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  HOW IT WORKS                          [py-24] │
│  - 3-step process (horizontal flow)            │
│  - Step number + Icon + Description            │
│  - Connecting line between steps               │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  TESTIMONIALS                          [py-24] │
│  - Carousel or 3-card grid                     │
│  - Avatar + Quote + Name/Role                  │
│  - Subtle card backgrounds                     │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  FINAL CTA SECTION                     [py-32] │
│  - Compelling headline                         │
│  - Single prominent CTA button                 │
│  - Gradient background with glow               │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  FOOTER                                [py-16] │
│  - Logo + tagline                              │
│  - Navigation links                            │
│  - Social links                                │
│  - Copyright                                   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 5. Component Specifications

### 5.1 Navigation Bar

```
Height: 64px (h-16)
Background: bg-black/80 backdrop-blur-md
Border: border-b border-white/5
Position: sticky top-0 z-50

Layout:
├── Logo (left)
├── Nav Links (center) - hidden on mobile
│   ├── Features (anchor link)
│   ├── How it Works (anchor link)
│   └── Pricing (if applicable)
├── Auth Actions (right)
│   ├── Sign In (ghost button)
│   └── Get Started (primary button, glowing)
└── Mobile Menu Trigger (hamburger, md:hidden)
```

**Tailwind Classes:**
```tsx
<nav className="sticky top-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-white/5">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
    {/* Content */}
  </div>
</nav>
```

### 5.2 Hero Section

```
Padding: py-24 md:py-32 lg:py-40
Max Width: max-w-4xl (text content)
Text Alignment: text-center

Structure:
├── Eyebrow Badge (optional)
│   "✨ Now with AI-powered search"
├── Headline (gradient text)
│   "Organize Your AI Prompts Like Never Before"
├── Subheadline
│   "Save, categorize, and find your best prompts instantly..."
├── CTA Button Group
│   ├── Primary: "Get Started Free" (cyan glow)
│   └── Secondary: "Watch Demo" (ghost + play icon)
└── Hero Visual
    └── Floating app screenshot with glow effect
```

**Headline Treatment:**
```tsx
<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
  Organize Your AI Prompts{' '}
  <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
    Like Never Before
  </span>
</h1>
```

**Primary CTA Button:**
```tsx
<button className="px-8 py-4 text-lg font-semibold bg-cyan-600 hover:bg-cyan-500
  text-white rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.4)]
  hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]
  transition-all duration-300 transform hover:scale-105">
  Get Started Free
</button>
```

### 5.3 Social Proof Bar

```
Background: bg-[#0f1419] or subtle gradient
Padding: py-12
Border: border-y border-white/5

Content Options:
├── User Count: "Trusted by 10,000+ prompt engineers"
├── Logo Cloud: Partner/customer logos (grayscale, hover:color)
└── Rating: "★★★★★ 4.9/5 from 500+ reviews"
```

**Tailwind Classes:**
```tsx
<section className="py-12 bg-gradient-to-b from-transparent to-[#0f1419] border-y border-white/5">
  <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 text-gray-400">
    {/* Logos in grayscale with hover effects */}
  </div>
</section>
```

### 5.4 Features Grid

```
Padding: py-24
Max Width: max-w-6xl
Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8

Feature Card:
├── Icon Container (48x48, rounded-xl, gradient bg)
├── Title (text-xl font-semibold, mt-4)
├── Description (text-gray-400, mt-2)
└── Hover State: translateY(-4px) + glow border
```

**Feature Card Component:**
```tsx
<div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5
  hover:border-cyan-500/30 hover:bg-white/[0.04]
  transition-all duration-300 hover:-translate-y-1
  hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20
    flex items-center justify-center text-cyan-400">
    {icon}
  </div>
  <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
  <p className="mt-2 text-gray-400 leading-relaxed">{description}</p>
</div>
```

**Feature List:**
1. **Smart Organization** - Categories with color coding
2. **Instant Search** - AI-powered semantic search
3. **Quick Copy** - One-click copy to clipboard
4. **Secure Storage** - Enterprise-grade security
5. **Cross-Platform** - Access from anywhere
6. **Team Sharing** - Collaborate on prompts (future)

### 5.5 Product Showcase

```
Padding: py-24
Background: Radial gradient glow behind screenshot
Layout: Full-width screenshot with floating annotation cards

Visual Treatment:
├── Screenshot Container
│   ├── border border-white/10 rounded-2xl
│   ├── shadow-2xl shadow-cyan-500/10
│   └── Subtle reflection effect below
└── Feature Callouts (absolute positioned)
    └── Glass cards with arrows pointing to features
```

**Screenshot Container:**
```tsx
<div className="relative max-w-5xl mx-auto">
  {/* Glow effect */}
  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-pink-500/20
    rounded-3xl blur-3xl opacity-30" />

  {/* Screenshot */}
  <div className="relative rounded-2xl border border-white/10 overflow-hidden
    shadow-2xl shadow-cyan-500/10">
    <img src="/landing/app-screenshot.png" alt="Prompt Bank Interface" />
  </div>
</div>
```

### 5.6 How It Works

```
Padding: py-24
Layout: 3 steps horizontal on desktop, vertical on mobile
Step Connection: Dashed line or gradient line between steps

Step Component:
├── Step Number (large, gradient text, opacity-30)
├── Icon (48x48, same style as features)
├── Title (text-xl font-semibold)
└── Description (text-gray-400)
```

**Steps:**
1. **Save** - "Paste any prompt and save it instantly"
2. **Organize** - "Categorize with smart color-coded tags"
3. **Find** - "Search semantically to find exactly what you need"

### 5.7 Testimonials

```
Padding: py-24
Layout: 3 cards in a row (lg) or carousel (sm/md)
Background: Alternating section bg-[#0f1419]

Testimonial Card:
├── Quote Icon (text-cyan-500/30, large)
├── Quote Text (text-lg, text-gray-300, italic)
├── Divider (w-12 h-px bg-white/10, my-4)
├── Avatar (40x40, rounded-full)
├── Name (font-semibold, text-white)
└── Role (text-sm, text-gray-500)
```

**Testimonial Card:**
```tsx
<div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
  <svg className="w-8 h-8 text-cyan-500/30 mb-4">{/* Quote icon */}</svg>
  <p className="text-lg text-gray-300 italic leading-relaxed">
    "{quote}"
  </p>
  <div className="mt-6 flex items-center gap-4">
    <img src={avatar} className="w-10 h-10 rounded-full" />
    <div>
      <p className="font-semibold text-white">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
</div>
```

### 5.8 Final CTA Section

```
Padding: py-32
Background: Gradient with radial glow
Text: Centered, max-w-2xl

Structure:
├── Headline: "Ready to organize your prompts?"
├── Subheadline: "Join thousands of AI professionals..."
└── CTA Button: Large, glowing, centered
```

**Background Treatment:**
```tsx
<section className="relative py-32 overflow-hidden">
  {/* Background glow */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent" />
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />

  {/* Content */}
  <div className="relative max-w-2xl mx-auto text-center px-4">
    {/* Headline, subheadline, CTA */}
  </div>
</section>
```

### 5.9 Footer

```
Padding: py-16
Background: bg-[#0a0a0a] border-t border-white/5
Layout: 4-column grid on lg, stacked on mobile

Columns:
├── Brand (logo + tagline)
├── Product (Features, Pricing, Changelog)
├── Resources (Documentation, Blog, Support)
└── Legal (Privacy, Terms, Security)

Bottom Bar:
├── Copyright
└── Social Links
```

---

## 6. Animation Specifications

### Scroll-Triggered Animations

Using CSS or Framer Motion, animate elements as they enter viewport:

| Element | Animation | Duration | Delay Pattern |
|---------|-----------|----------|---------------|
| Section titles | fadeInUp | 600ms | 0ms |
| Feature cards | fadeInUp | 500ms | stagger 100ms |
| Screenshots | fadeInScale | 800ms | 0ms |
| Testimonials | fadeInUp | 500ms | stagger 150ms |
| Stats numbers | countUp | 1500ms | 0ms |

### Micro-Interactions

| Element | Interaction | Effect |
|---------|-------------|--------|
| CTA Buttons | hover | scale(1.05) + intensify glow |
| Feature Cards | hover | translateY(-4px) + border glow |
| Nav Links | hover | color transition + underline |
| Social Icons | hover | scale(1.1) + color change |

### Particle System Modifications

For the hero section, enhance the existing particle config:
- Increase particle count slightly (150 vs 120)
- Add gradient-colored particles (cyan, violet, pink)
- Increase link opacity in hero area
- Add mouse attraction effect (particles follow cursor)

---

## 7. Responsive Breakpoints

Following Tailwind's defaults:

| Breakpoint | Width | Adaptations |
|------------|-------|-------------|
| sm | 640px | Stack layouts, reduce padding |
| md | 768px | 2-column grids, show nav |
| lg | 1024px | 3-column grids, full features |
| xl | 1280px | Max-width containers, optimal reading |

### Mobile-Specific Considerations

- Hero text: `text-4xl` → `text-6xl` → `text-8xl`
- Section padding: `py-16` → `py-24` → `py-32`
- Feature grid: 1-col → 2-col → 3-col
- Navigation: Hamburger menu with slide-out drawer
- CTAs: Full-width on mobile

---

## 8. Accessibility Requirements

### Color Contrast
- All text meets WCAG 2.1 AA (4.5:1 for normal, 3:1 for large)
- Focus indicators visible on all interactive elements
- Never rely on color alone to convey information

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Skip-to-content link
- Focus trapping in modals

### Screen Readers
- Semantic HTML structure (nav, main, section, footer)
- ARIA labels on icon-only buttons
- Alt text on all images
- Proper heading hierarchy (h1 → h2 → h3)

### Motion
- `prefers-reduced-motion` media query support
- Disable animations for users who prefer reduced motion

---

## 9. Performance Considerations

### Image Optimization
- Use Next.js Image component with lazy loading
- Serve WebP format with PNG fallback
- Responsive images with `srcset`
- Blur placeholder for hero images

### Code Splitting
- Dynamic import for below-fold sections
- Defer non-critical JavaScript
- Preload critical fonts (Geist)

### Core Web Vitals Targets
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

---

## 10. Implementation Checklist

### Phase 1: Structure (Priority: High)
- [ ] Create `/app/(landing)/page.tsx` route
- [ ] Build LandingNavbar component
- [ ] Build Hero section with particles
- [ ] Build Footer component

### Phase 2: Content Sections (Priority: High)
- [ ] Build SocialProofBar component
- [ ] Build FeatureGrid with FeatureCard components
- [ ] Build ProductShowcase with screenshot
- [ ] Build HowItWorks with step components

### Phase 3: Trust & Conversion (Priority: Medium)
- [ ] Build Testimonials carousel/grid
- [ ] Build FinalCTA section
- [ ] Add scroll animations (Intersection Observer)

### Phase 4: Polish (Priority: Medium)
- [ ] Mobile navigation drawer
- [ ] Micro-interactions and hover states
- [ ] Performance optimization
- [ ] Accessibility audit

### Phase 5: Assets (Priority: Low)
- [ ] Create/source product screenshots
- [ ] Design feature icons (or use Heroicons/Lucide)
- [ ] Collect testimonial content
- [ ] Create Open Graph images

---

## 11. File Structure

```
/app
  /(landing)
    /page.tsx              # Landing page
    /layout.tsx            # Landing-specific layout (no sidebar)
/components
  /landing
    /LandingNavbar.tsx
    /Hero.tsx
    /SocialProofBar.tsx
    /FeatureGrid.tsx
    /FeatureCard.tsx
    /ProductShowcase.tsx
    /HowItWorks.tsx
    /StepCard.tsx
    /Testimonials.tsx
    /TestimonialCard.tsx
    /FinalCTA.tsx
    /LandingFooter.tsx
/public
  /landing
    /app-screenshot.png
    /feature-icons/
    /testimonial-avatars/
```

---

## 12. Copy Recommendations

### Hero Headline Options
1. "Organize Your AI Prompts Like Never Before"
2. "Your Prompt Library, Perfected"
3. "Never Lose a Great Prompt Again"
4. "The Smart Way to Manage AI Prompts"

### Hero Subheadline
"Save, categorize, and instantly find your best prompts. Prompt Bank is the command center for AI professionals who take their prompts seriously."

### CTA Button Text
- Primary: "Get Started Free" / "Start Organizing"
- Secondary: "Watch Demo" / "See How It Works"

### Feature Headlines
1. **Smart Organization** - "Color-coded categories that make sense"
2. **Lightning Search** - "Find any prompt in milliseconds"
3. **One-Click Copy** - "From saved to clipboard instantly"
4. **Secure by Design** - "Enterprise-grade protection for your IP"
5. **Access Anywhere** - "Web, mobile, wherever you work"
6. **Team Ready** - "Collaborate without the chaos"

---

## Appendix: Design Tokens Summary

```css
/* Landing Page Specific Tokens */
:root {
  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899);
  --gradient-text: linear-gradient(90deg, #06b6d4, #8b5cf6);
  --gradient-glow: radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%);

  /* Section Spacing */
  --section-py-sm: 4rem;      /* py-16 */
  --section-py-md: 6rem;      /* py-24 */
  --section-py-lg: 8rem;      /* py-32 */

  /* Container Widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;

  /* Animation */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
}
```

---

*This plan provides a comprehensive blueprint for a high-converting landing page that maintains brand consistency while optimizing for user acquisition. The design leverages familiar patterns from the application while introducing marketing-specific treatments that create visual interest and guide users toward conversion.*
