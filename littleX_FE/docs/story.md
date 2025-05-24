# Storybook Documentation

## Overview

This document explains the Storybook implementation in the application, covering what Storybook is, how it's used, and best practices for creating and maintaining stories.

## What is Storybook?

Storybook is an open-source tool for developing UI components in isolation. It provides:
- A sandbox to build components outside your application
- A living documentation of your UI components
- A testing environment for components
- A way to visually test component states and variations

## Storybook Structure

In this application, stories are organized in the `/stories` directory:

```
├── stories
│   ├── badge.stories.tsx
│   ├── card.stories.tsx
│   ├── checkbox.stories.tsx
│   ├── dashboard-template.stories.tsx
│   ├── input.stories.tsx
│   ├── login-from.stories.tsx
│   ├── register-form.stories.tsx
│   ├── select.stories.tsx
│   ├── task-form.stories.tsx
│   ├── task-header.stories.tsx
│   ├── task-item.stories.tsx
│   ├── task-manager-page.stories.tsx
│   ├── task-sidebar.stories.tsx
│   └── textarea.stories.tsx
```

The stories cover components from all levels of the design system:
- Atom components (badge, input, checkbox, etc.)
- Molecule components (task-header, task-item, etc.)
- Organism components (login-form, register-form, task-form, etc.)
- Templates (dashboard-template)
- Pages (task-manager-page)

## How to Create Stories

### Basic Story Structure

Each story file follows a common pattern:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '@/path/to/component';

// Metadata for the component
const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Default state
export const Default: Story = {
  args: {
    // Default props
  },
};

// Additional variants
export const Variant: Story = {
  args: {
    // Variant-specific props
  },
};
```

### Story Categories

Stories are organized into categories based on the atomic design hierarchy:
- **Atoms**: Basic UI components
- **Molecules**: Combinations of atoms
- **Organisms**: Complex UI components
- **Templates**: Page layouts
- **Pages**: Full application pages

## Best Practices

1. **Story Per State**: Create separate stories for different component states (default, hover, active, disabled, etc.)

2. **Use Args**: Use the args pattern to define props, making stories configurable via the Storybook UI:
   ```tsx
   export const Primary: Story = {
     args: {
       variant: 'primary',
       children: 'Primary Button',
     },
   };
   ```

3. **Mock Dependencies**: When a component has dependencies (like Redux), use decorators to provide context:
   ```tsx
   const meta: Meta<typeof ComponentWithStore> = {
     decorators: [
       (Story) => (
         <Provider store={mockStore}>
           <Story />
         </Provider>
       ),
     ],
   };
   ```

4. **Document Props**: Use JSDoc comments or the `argTypes` configuration to document component props:
   ```tsx
   const meta: Meta<typeof Button> = {
     argTypes: {
       variant: {
         description: 'Button style variant',
         options: ['primary', 'secondary', 'outline'],
         control: { type: 'select' },
       },
     },
   };
   ```

5. **Test Interactions**: Use the `play` function to test component interactions:
   ```tsx
   export const ClickInteraction: Story = {
     play: async ({ canvasElement }) => {
       const canvas = within(canvasElement);
       await userEvent.click(canvas.getByRole('button'));
     },
   };
   ```

## Adding New Stories

To add a new story:

1. Create a new file in the `/stories` directory with the naming convention `[component-name].stories.tsx`
2. Import the component and define the meta information
3. Create stories for different states of the component
4. Add controls and documentation

## Running Storybook

To run Storybook locally:

```bash
npm run storybook
# or
yarn storybook
# or
pnpm storybook
```

The Storybook interface will be available at http://localhost:6006 by default.