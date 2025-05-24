import type { ReactNode } from "react";

// Props for the TwoColumnTemplate component
interface TwoColumnTemplateProps {
  leftColumn: ReactNode; // Content for the left column (e.g., sidebar, navigation)
  rightColumn: ReactNode; // Content for the right column (e.g., main content)
  leftWidth?: string; // Optional Tailwind class for left column width (default: "w-1/3")
}

// A simple two-column layout with a sidebar and main content
export function TwoColumnTemplate({
  leftColumn,
  rightColumn,
  leftWidth = "w-1/2",
}: TwoColumnTemplateProps) {
  return (
    <main className="min-h-screen flex">
      {/* Left column: Hidden on mobile, visible on medium screens and up */}
      <div className={`hidden md:block ${leftWidth} border-r bg-muted/20 p-4`}>
        {leftColumn}
      </div>
      {/* Right column: Takes remaining space, always visible */}
      <div className="flex-1 p-6 ">{rightColumn}</div>
    </main>
  );
}

/* 
  WHAT: A basic two-column layout with a fixed-width left column and flexible right column.
  HOW TO USE: Pass content for leftColumn (e.g., navigation) and rightColumn (e.g., main content).
              Optionally specify leftWidth with a Tailwind class (e.g., "w-1/4").
  WHEN TO USE: Use for simple apps needing a sidebar and main content area, like a blog with categories
               on the left and posts on the right, or an admin panel with a menu.
  EXAMPLE:
  <TwoColumnTemplate
    leftColumn={<nav>Menu Items</nav>}
    rightColumn={<article>Blog Post</article>}
    leftWidth="w-1/4"
  />
*/
