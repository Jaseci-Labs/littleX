# Adding UI Components as Atoms

This document explains how to add shadcn UI components as atoms in the Task Manager application.

## Overview

In this project, we follow atomic design principles and install shadcn UI components directly into the `ds/atoms` directory. This approach allows us to:

1. Keep all our atomic components in a single directory
2. Maintain a clear separation between atoms, molecules, and organisms
3. Use shadcn UI components as building blocks for more complex components

## Installing shadcn UI Components

To add a new shadcn UI component:

\`\`\`bash
npx shadcn@latest add [component-name]
\`\`\`

This will install the component directly to the `ds/atoms` directory, as configured in `components.json`.

## Using shadcn UI Components

After installation, you can import the component from the atoms directory:

\`\`\`tsx
import { Button } from "@/ds/atoms/button"
\`\`\`

## Example: Creating a Molecule with Atom Components

Here's an example of how to create a molecule using shadcn UI atom components:

\`\`\`tsx
import { Button } from "@/ds/atoms/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/ds/atoms/card"

export function ExampleCard() {
  return (
    <Card>
      <CardHeader>
        <h3>Example Card</h3>
      </CardHeader>
      <CardContent>
        <p>This is an example of using shadcn UI components as atoms.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  )
}
\`\`\`

