import type { ReactNode } from "react";

// Props for the GridTemplate component
interface GridTemplateProps {
  header?: ReactNode; // Optional header content
  children: ReactNode; // Grid items (e.g., cards, sections)
  columns?: number; // Number of columns on medium screens and up (default: 2)
}

// A grid-based layout for displaying multiple items
export function GridTemplate({
  header,
  children,
  columns = 2,
}: GridTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Optional header: Sticky at the top */}
      {header && (
        <header className="sticky top-0 z-10 bg-background border-b p-4">
          {header}
        </header>
      )}
      {/* Main content: Grid layout with responsive columns */}
      <main className="flex-1 p-6">
        <div className={`grid gap-6 grid-cols-1 md:grid-cols-${columns}`}>
          {children}
        </div>
      </main>
    </div>
  );
}

/* 
  WHAT: A flexible grid layout for displaying multiple items in columns.
  HOW TO USE: Pass children as grid items (e.g., cards); optionally include a header
              and set the number of columns.
  WHEN TO USE: Use for galleries, product listings, dashboards with widgets, or any
               layout needing a multi-column arrangement.
  EXAMPLE:
  <GridTemplate header={<h1>Products</h1>} columns={3}>
    <div className="p-4 bg-muted/20">Item 1</div>
    <div className="p-4 bg-muted/20">Item 2</div>
    <div className="p-4 bg-muted/20">Item 3</div>
  </GridTemplate>
*/
