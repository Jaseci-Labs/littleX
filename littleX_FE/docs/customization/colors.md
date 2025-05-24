# Color Customization

This document explains how to customize the colors in the Task Manager application.

## Default Theme

The Task Manager uses a custom theme based on the Jac-Lang brand colors, with an orange primary color that matches the Jac-Lang logo.

## Modifying Colors

The application uses Tailwind CSS for styling, with a custom color palette defined in `tailwind.config.ts`. To modify the theme colors:

1. Open `tailwind.config.ts` in the root directory
2. Locate the `theme.extend.colors` section
3. Modify the color values as needed

### Color Structure

The color system uses HSL (Hue, Saturation, Lightness) values for better control over the color scheme:

```typescript
colors: {
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(22, 89%, 52%)', // Jac-Lang orange
    foreground: 'hsl(0, 0%, 98%)',
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  // ... other colors
}

