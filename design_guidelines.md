# Rapha Lumina Design Guidelines

## Design Approach
**Reference Inspiration**: Calm app's serenity + Apple Fitness+ meditation modules + Headspace's playful minimalism, adapted for mystical/cosmic aesthetic with contemplative depth.

**Core Philosophy**: Create sacred digital space through generous whitespace, deliberate pacing, and cosmic visual metaphors. Balance professional credibility with spiritual warmth.

---

## Typography System

**Primary Font**: Inter or IBM Plex Sans (Google Fonts CDN)
- Display/Hero: 48-72px, weight 300 (light, ethereal)
- H1: 36-42px, weight 400
- H2: 28-32px, weight 500
- H3: 20-24px, weight 500
- Body: 16-18px, weight 400, line-height 1.7
- Small/Meta: 14px, weight 400

**Accent Font**: Crimson Text or Cormorant (serif for wisdom quotes)
- Quote blocks: 24-28px, italic, weight 400
- Section subtitles: 18px, weight 400

**Text Treatment**: 
- Slight letter-spacing (0.02em) on headings for spacious feel
- Generous line-height (1.7-1.8) for meditative reading rhythm
- Soft text shadows on cosmic backgrounds for legibility

---

## Layout & Spacing System

**Spacing Scale**: Tailwind units of 4, 8, 12, 16, 24, 32 (p-4, m-8, gap-12, py-16, etc.)

**Section Rhythm**:
- Hero: 100vh immersive experience
- Content sections: py-24 desktop, py-16 mobile
- Component internal padding: p-8 cards, p-12 feature blocks
- Grid gaps: gap-8 standard, gap-12 generous

**Container Strategy**:
- Max-width: 1280px for content sections
- Reading content: max-w-3xl (optimal for course text)
- Full-bleed cosmic backgrounds with contained content

---

## Hero Section
**Large Hero Image**: YES - Cosmic/nebula photography with subtle particle overlay
- Full viewport height (100vh)
- Gradient overlay from transparent to cosmic indigo-black (bottom 40%)
- Centered content with vertical rhythm
- Headline + subheadline + dual CTA buttons (blurred glass backgrounds)
- Floating meditation timer widget (top-right, glass morphism)
- Subtle scroll indicator at bottom

---

## Core Components

### Navigation
**Fixed Header** (backdrop-blur-md, translucent):
- Left: Rapha Lumina wordmark with small amethyst star glyph
- Center: Main nav (Home, Courses, Meditate, Chat, Community)
- Right: Search icon, profile avatar, notification bell
- Height: 72px, subtle bottom border with cosmic glow

### Chatbot Interface
**Floating Chat Widget**:
- Bottom-right corner, 64px circular button with pulsing amethyst glow
- Opens to 400px × 600px card with glass morphism
- Header: "Spiritual Guide AI" with breathing dot indicator
- Message bubbles: User (amethyst), AI (cosmic indigo with stars)
- Input: Glass-effect textbox with send icon

### Course Cards
**Grid Layout** (3 columns desktop, 2 tablet, 1 mobile):
- Card structure: Aspect ratio 4:3 cosmic image top, content below
- Title + instructor + duration metadata
- Progress bar (amethyst fill on cosmic track)
- Hover: Gentle lift (4px) + amethyst glow
- Badge overlays: "New," "Featured" with glass backgrounds

### Meditation Library
**Masonry Grid** for variety:
- Mixed card sizes (1x1, 1x2, 2x1 grid units)
- Each card: Meditation theme image + title + duration + category tag
- Play button overlay (glass morphism, appears on hover)
- Filter tags at top (All, Sleep, Focus, Anxiety, Gratitude)

### Feature Sections
**Staggered Two-Column Layouts**:
- Alternating image-text, text-image rhythm
- Images: Rounded corners (12px), subtle cosmic glow borders
- Text blocks: max-w-xl with generous padding
- Icon integration: Heroicons with amethyst tint

---

## Unique Elements

### Cosmic Progress Indicators
- Circular progress rings with constellation patterns
- Linear bars with shooting star animation on completion
- Milestone markers as celestial bodies (planets, moons)

### Quote Blocks
- Large serif typography (Crimson Text)
- Decorative cosmic ornaments (top/bottom)
- Background: Subtle cosmic nebula in card shape
- Author attribution with small amethyst divider line

### Statistics Dashboard
- 4-column grid (meditation minutes, courses completed, streak days, community rank)
- Large numbers (48px) with glowing amethyst underlines
- Small labels beneath
- Subtle particle background animation

---

## Footer Design
**Comprehensive Multi-Column** (cosmic gradient background):
- Column 1: Logo + mission statement (max-w-xs)
- Column 2: Quick Links (Courses, Meditate, Community, About)
- Column 3: Resources (Blog, Support, Press, Careers)
- Column 4: Newsletter signup (input with glass effect + amethyst button)
- Bottom bar: Social icons (circular with cosmic glow) + legal links
- Height: ~400px with generous py-16

---

## Images Section

**Hero Image**: Cosmic nebula/deep space photography (purple-indigo tones), high-resolution, full viewport
**Course Cards**: Thematic abstract images (chakras, mandalas, nature macros, zen gardens)
**Meditation Thumbnails**: Serene landscapes, cosmic scenes, abstract meditative visuals
**Feature Section Images**: People meditating in ethereal settings, spiritual symbols, cosmic elements
**Background Textures**: Subtle star fields, particle systems, gradient nebulas (used sparingly)

---

## Animation Guidelines
**Minimal & Purposeful**:
- Page load: Gentle fade-in content stagger (100ms delays)
- Buttons: Smooth amethyst glow pulse on hover (2s cycle)
- Cards: Gentle 4px lift on hover (300ms ease)
- Chatbot: Breathing pulse on icon (3s cycle)
- Progress bars: Smooth fill animations (800ms ease-out)
- Particles: Very subtle drift in hero background (optional)

**Forbidden**: Excessive parallax, distracting scroll animations, spinning elements

---

## Accessibility & Interaction
- Focus states: 2px amethyst outline with cosmic glow
- Keyboard navigation: Clear visible indicators throughout
- Screen reader: Proper ARIA labels for all interactive elements
- Form inputs: Glass morphism backgrounds with amethyst focus rings
- Touch targets: Minimum 44×44px on all interactive elements