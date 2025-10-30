# Rapha Lumina - Design Guidelines

## Design Approach: Contemplative Minimalism

**Reference-Based Approach**: Drawing inspiration from meditation apps (Calm, Insight Timer) and thoughtful communication platforms (Linear, Notion), creating a serene digital sanctuary for philosophical dialogue.

**Core Design Principles**:
- Sacred simplicity: Remove distractions, honor the conversation
- Timeless elegance: Ancient wisdom meets modern interface
- Contemplative spacing: Generous breathing room for reflection
- Intentional typography: Each word carries weight and meaning

---

## Color Palette

**Dark Mode Primary** (Default):
- Background: 220 15% 8% (deep cosmic indigo-black)
- Surface: 220 12% 12% (elevated card surface)
- Border: 220 10% 18% (subtle divisions)
- Primary: 280 55% 68% (luminous amethyst - spiritual wisdom)
- Secondary: 200 65% 62% (celestial cyan - clarity)
- Text Primary: 220 8% 95% (warm white)
- Text Secondary: 220 8% 70% (gentle gray)
- Accent: 45 85% 65% (golden wisdom - use sparingly for highlights)

**Light Mode** (Optional toggle):
- Background: 40 20% 97% (warm pearl)
- Surface: 0 0% 100% (pure white)
- Primary: 280 60% 55% (deeper amethyst)
- Text: 220 15% 20% (charcoal)

---

## Typography

**Font Families**:
- Display/Headers: "Cormorant Garamond" (serif - ancient wisdom aesthetic)
- Body/Chat: "Inter" (sans-serif - clarity and readability)
- Optional accent: "Spectral" for quotes/wisdom highlights

**Hierarchy**:
- H1 (Brand): text-4xl md:text-5xl, font-light, Cormorant
- H2 (Section): text-2xl md:text-3xl, font-normal, Cormorant
- Body (Chat): text-base md:text-lg, font-normal, Inter
- Wisdom Quotes: text-lg md:text-xl, italic, font-light, Spectral
- Small text: text-sm, Inter

---

## Layout System

**Spacing Scale**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistency
- Message padding: p-6
- Component spacing: space-y-4 or space-y-6
- Section margins: my-12 or my-16
- Container padding: px-4 md:px-8

**Container Strategy**:
- Chat container: max-w-4xl mx-auto (optimal reading width)
- Messages: max-w-prose for text content
- Full-width header/footer: w-full with inner max-w-7xl

---

## Component Library

### Chat Interface (Primary)
**Message Bubbles**:
- User messages: Right-aligned, primary color background with soft glow
- Rapha Lumina responses: Left-aligned, elevated surface (220 12% 14%), subtle border
- Padding: p-6, rounded-2xl
- Typography: Leading-relaxed for contemplative reading
- Gentle fade-in animation on new messages (300ms)

**Input Area**:
- Fixed bottom position with backdrop blur
- Rounded-xl input field with focus ring in primary color
- Send button with primary gradient or solid primary color
- Microphone icon for voice option (outline style)
- Padding: p-4 md:p-6

### Navigation Header
- Minimal top bar with logo/name "Rapha Lumina"
- Centered or left-aligned title with Cormorant font
- Settings icon (theme toggle, voice options)
- Subtle divider below header
- Sticky positioning with backdrop blur

### Wisdom Cards (for multi-tradition responses)
- Bordered cards with philosophy tradition labels
- Icon or small visual marker for each tradition
- Subtle gradient left border (Greek: blue, Eastern: green, Mystical: purple)
- Padding: p-6, space-y-3
- Soft shadow on hover

### Reflection Prompts
- Distinct styling from regular messages
- Italic text with quote-style visual treatment
- Golden accent border-left-4
- Background: slightly lighter than surface
- Icon: small lotus, star, or contemplative symbol

### Session History Sidebar (Optional)
- Collapsible left panel
- List of past sessions with timestamps
- Gentle hover states
- Search/filter capability

---

## Visual Elements

**Icons**: Use Heroicons (outline style) for spiritual, minimal aesthetic
- Lotus, star, moon for decorative accents
- Chat, microphone, settings for functional UI
- Philosophical tradition symbols (subtle, tasteful)

**Images**: 
- Hero section: Cosmic/nebula background with gradient overlay (abstract, spiritual)
- Image description: "Ethereal cosmic nebula with deep purples and blues, suggesting infinite wisdom and universal consciousness"
- Placement: Full-width hero with 60vh height, text overlay with subtle glow
- Alternative: Abstract geometric sacred geometry pattern as background texture

**Dividers**:
- Hairline borders with low opacity
- Gradient fades between major sections
- Ornamental subtle dots or small symbols for special transitions

---

## Interaction Patterns

**Focus States**: Soft glow in primary color (ring-2 ring-primary/50)

**Hover States**: 
- Gentle background lightening (hover:bg-surface-lighter)
- Subtle scale on interactive cards (hover:scale-[1.02])
- No aggressive animations

**Loading States**:
- Gentle pulsing dots in primary color
- "Rapha is contemplating..." message
- Breathing animation (slow, meditative)

**Transitions**: All transitions 200-300ms with ease-in-out

---

## Accessibility

- Maintain WCAG AAA contrast ratios for all text
- Dark mode as default with seamless light mode toggle
- Focus indicators visible and beautiful
- Keyboard navigation throughout
- Screen reader friendly labels
- Generous tap targets (min 44px)

---

## Responsive Behavior

- Mobile-first approach
- Single column chat on mobile, optimal width on desktop
- Collapsible sidebar on tablet/mobile
- Adjust text sizes: base on mobile, md:text-lg on desktop
- Maintain generous padding on all viewports
- Bottom input bar remains accessible on mobile keyboards

---

## Unique Spiritual Touches

- Subtle particle effects in background (stars, light motes) - very minimal
- Soft gradient overlays suggesting cosmic connection
- Border glow on active conversation with primary color
- Wisdom quotes render with special serif typography and indent
- Session greeting with personalized spiritual acknowledgment
- Breathing room: Never cramped, always spacious and meditative