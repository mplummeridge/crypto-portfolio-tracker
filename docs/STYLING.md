# Styling Guide

This document outlines the approach to styling used in the Crypto Portfolio Tracker application.

## Core Technology: Tailwind CSS

- **Utility-First:** The primary styling method is [Tailwind CSS](https://tailwindcss.com/). Styles are applied directly in the component JSX using utility classes.
- **Configuration:** Tailwind is configured in `tailwind.config.ts`.
- **Theme:**
  - **Colors:** Uses CSS variables defined in `app/globals.css` (likely following shadcn/ui conventions) mapped in the `theme.extend.colors` section (e.g., `border: "hsl(var(--border))"`). Includes semantic color names like `primary`, `secondary`, `destructive`, `accent`, `card`, `popover`. Also includes custom `chart` colors (`chart-1` to `chart-5`).
  - **Border Radius:** Uses CSS variable `--radius` for consistent corner rounding (`lg`, `md`, `sm` variants).
  - **Animations:** Defines `accordion-down` and `accordion-up` keyframes and animations, likely used by shadcn/ui Accordion component. Uses `tailwindcss-animate` plugin.
  - **Container:** Defines container centering and padding defaults.

## Global Styles (`app/globals.css`)

- **Purpose:** Contains base styles, CSS variable definitions (especially for colors and border radius used by Tailwind and shadcn/ui), and potentially global resets.
- **Usage:** Avoid adding component-specific styles here; keep it for truly global definitions.

## shadcn/ui Integration

- **Component Styling:** [shadcn/ui](https://ui.shadcn.com/) components (`components/ui/`) apply Tailwind utility classes internally, often using `class-variance-authority` (CVA) to manage variants (e.g., button styles, sizes).
- **Consistency:** Using shadcn/ui ensures a consistent look and feel based on the shared Tailwind theme configuration.

## Class Merging (`cn` Utility)

- **Purpose:** To reliably merge default component classes, variant classes, and custom classes passed via props.
- **Implementation:** Uses the `cn` utility function (defined in `lib/utils.ts`), which combines `clsx` (for conditional classes) and `tailwind-merge` (to intelligently merge conflicting Tailwind utilities).
- **Usage:** Commonly seen in components, especially shared UI components: `className={cn(defaultClasses, variantClasses, props.className)}`.

## Animations

- **Framer Motion:** Used for more complex component animations and interactions (e.g., the bottom sheet transition and drag in `ResponsiveDialog`).
- **Tailwind CSS Animations:** Basic animations (like the accordion) are handled via Tailwind's animation utilities and the `tailwindcss-animate` plugin. The `animate-spin` utility is used for loading indicators. `animate-in fade-in` used in `MainContainer`.

## Best Practices

- Prefer Tailwind utility classes over inline styles or separate CSS files for component-specific styling.
- Leverage the theme defined in `tailwind.config.ts` for consistency (colors, spacing, border radius).
- Use the `cn` utility when composing classes, especially in reusable components accepting a `className` prop.
- Keep `globals.css` minimal and focused on base styles and CSS variables.