---
name: Social Kinetic
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#3c4a3c'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#6c7b6a'
  outline-variant: '#bbcbb8'
  surface-tint: '#006e2a'
  primary: '#006e2a'
  on-primary: '#ffffff'
  primary-container: '#00c853'
  on-primary-container: '#004c1b'
  inverse-primary: '#3ce36a'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#5d5f5f'
  on-tertiary: '#ffffff'
  tertiary-container: '#acadad'
  on-tertiary-container: '#3f4142'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#69ff87'
  primary-fixed-dim: '#3ce36a'
  on-primary-fixed: '#002108'
  on-primary-fixed-variant: '#00531e'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system is built for a vibrant, high-energy social community. It captures the spirit of active friendships—whether on the soccer field or at a birthday dinner. The brand personality is **Modern, Tech-Forward, and Kinetic**. 

Drawing inspiration from high-end Webflow marketing templates, the system utilizes a **Bold High-Contrast** aesthetic. It blends deep "Ink" blacks with a signature "Electric Green" to create a sense of urgency and excitement. The UI is characterized by generous whitespace, oversized typography, and tactile, rounded surfaces that feel approachable yet premium. The emotional goal is to make organizing a mundane hangout feel like launching a professional project.

## Colors
The palette is hyper-focused to maintain high energy and visual clarity.

- **Electric Green (Primary):** Used for primary actions, success states, and key highlights. It should feel almost luminous against dark backgrounds.
- **Deep Ink (Secondary):** Used for primary text and high-contrast containers. This replaces standard grays to give the UI a "weighted," premium feel.
- **Pure White / Ghost Gray (Tertiary):** Provides the canvas for the app. The "Ghost Gray" is used for subtle card backgrounds to separate content from the pure white page.
- **Status Colors:** Use the Primary Green for success, a vibrant orange for "pending" hangouts, and a sharp red for cancellations.

## Typography
We use **Plus Jakarta Sans** across all levels to maintain a friendly yet geometric and modern look. 

The hierarchy relies on extreme weight variance. **Display** and **Headline** styles should use Bold or ExtraBold weights to command attention. For interactive labels, use the uppercase `label-bold` style to create a "technical" feel reminiscent of dashboard interfaces. Body text is kept spacious with a 1.6 line-height to ensure readability during quick mobile browsing.

## Layout & Spacing
The design system employs a **Fluid-to-Fixed Grid** model. On desktop, content is contained within a 1200px max-width, 12-column grid. On mobile, the layout shifts to a single-column flow with 16px side margins.

Spacing follows an 8px base unit. We prioritize "breathability"—large sections like "Soccer Matches" or "Birthdays" should be separated by at least 64px (spacing-8) of vertical whitespace to maintain the clean, Webflow-inspired aesthetic. Grouped elements within cards use tighter 12px or 16px gaps.

## Elevation & Depth
This design system avoids traditional blurry shadows in favor of **Tonal Layering** and **High-Contrast Outlines**.

- **Level 0 (Background):** Pure White (#FFFFFF).
- **Level 1 (Cards/Containers):** Ghost Gray (#F4F4F4) with no border.
- **Level 2 (Interaction/Popovers):** Deep Ink (#0A0A0A) background with White text, or White background with a crisp 2px solid Black border.
- **Tactile Depth:** Use "Soft" inner glows or subtle 1px borders in a slightly darker shade than the background to define edges without adding visual "mud" through shadows.

## Shapes
The shape language is extremely friendly and "bouncy." All primary containers, buttons, and input fields use a **1rem (16px) radius** as the base. 

For larger sections or featured hero cards, use **rounded-xl (24px)** to create a distinct, modern "app-like" feel. Profile avatars should always be perfectly circular (Pill-shaped) to contrast against the geometric grid of the layout.

## Components

- **Buttons:** Primary buttons are Deep Ink (#0A0A0A) with White text, featuring a subtle hover state that shifts to Electric Green. Secondary buttons use the 2px solid border style.
- **Event Chips:** Small, rounded labels for categories like "Soccer," "Dinner," or "Birthday." Use a light Green tint background with dark Green text for high legibility.
- **Activity Cards:** Use a Ghost Gray background with 24px internal padding. Title text should be `title-md`. Include a "Status Indicator" dot in the top right.
- **Input Fields:** Large, 16px rounded corners with a Ghost Gray background. On focus, the border should turn Electric Green with a 2px thickness.
- **Birthday Reminders:** Special list items featuring a circular avatar with a subtle Electric Green "ring" if the birthday is today.
- **Action Bar:** A floating bottom navigation bar (on mobile) using a Deep Ink background and vibrant green icons for a tech-forward look.