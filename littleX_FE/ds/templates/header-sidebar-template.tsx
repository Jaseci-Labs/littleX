import type { ReactNode } from "react";

// Props for the HeaderSidebarMainTemplate component
interface HeaderSidebarMainTemplateProps {
  header: ReactNode; // Header content (e.g., title, navigation bar)
  sidebar: ReactNode; // Sidebar content (e.g., menu, filters)
  main: ReactNode; // Main content area
  sidebarWidth?: string; // Optional Tailwind class for sidebar width (default: "w-64")
}

// A layout with a sticky header, sidebar, and main content
export function HeaderSidebarMainTemplate({
  header,
  sidebar,
  main,
  sidebarWidth = "w-64",
}: HeaderSidebarMainTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky header: Always visible at the top */}
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        {header}
      </header>
      <div className="flex flex-1">
        {/* Sidebar: Hidden on mobile, fixed width on desktop */}
        <aside
          className={`hidden md:block ${sidebarWidth} border-r bg-muted/20 p-4`}
        >
          {sidebar}
        </aside>
        {/* Main content: Takes remaining space */}
        <main className="flex-1 p-6">{main}</main>
      </div>
    </div>
  );
}

/* 
  WHAT: A complete layout with a sticky header, sidebar, and main content area.
  HOW TO USE: Provide header (e.g., navbar), sidebar (e.g., menu), and main content.
              Optionally set sidebarWidth with a Tailwind class.
  WHEN TO USE: Ideal for dashboard-style applications, admin panels, or any app needing
               persistent navigation and a content area, like a CRM or project management tool.
  EXAMPLE:
  <HeaderSidebarMainTemplate
    header={<h1>Dashboard</h1>}
    sidebar={<ul>Nav Links</ul>}
    main={<div>Dashboard Content</div>}
    sidebarWidth="w-72"
  />
*/
