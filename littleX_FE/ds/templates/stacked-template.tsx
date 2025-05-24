import type { ReactNode } from "react";

// Props for the StackedTemplate component
interface StackedTemplateProps {
  header: ReactNode; // Header content (e.g., title, navigation)
  main: ReactNode; // Main content area
  footer?: ReactNode; // Optional footer content (e.g., copyright)
}

// A vertical layout with header, main content, and optional footer
export function StackedTemplate({
  header,
  main,
  footer,
}: StackedTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky header: Stays at the top */}
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        {header}
      </header>
      {/* Main content: Expands to fill available space */}
      <main className="flex-1 p-6">{main}</main>
      {/* Footer: Optional, appears at the bottom */}
      {footer && <footer className="bg-muted/20 border-t p-4">{footer}</footer>}
    </div>
  );
}

/* 
  WHAT: A simple stacked layout with a header, main content, and optional footer.
  HOW TO USE: Pass header and main content; optionally include footer.
  WHEN TO USE: Use for single-page layouts like landing pages, about pages, or simple
               content-heavy pages where a sidebar isn't needed.
  EXAMPLE:
  <StackedTemplate
    header={<nav>Site Nav</nav>}
    main={<section>Page Content</section>}
    footer={<p>© 2025 Company</p>}
  />
*/
