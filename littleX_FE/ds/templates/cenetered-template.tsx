import type { ReactNode } from "react";

// Props for the CenteredContentTemplate component
interface CenteredContentTemplateProps {
  header?: ReactNode; // Optional header content
  content: ReactNode; // Centered main content
  footer?: ReactNode; // Optional footer content
  maxWidth?: string; // Optional Tailwind class for max width (default: "max-w-2xl")
}

// A layout for centered content with optional header and footer
export function CenteredContentTemplate({
  header,
  content,
  footer,
  maxWidth = "max-w-2xl",
}: CenteredContentTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Optional header: Appears at the top */}
      {header && (
        <header className="bg-background border-b p-4">{header}</header>
      )}
      {/* Main content: Centered vertically and horizontally */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className={`w-full ${maxWidth}`}>{content}</div>
      </main>
      {/* Optional footer: Appears at the bottom */}
      {footer && <footer className="bg-muted/20 border-t p-4">{footer}</footer>}
    </div>
  );
}

/* 
  WHAT: A layout that centers content vertically and horizontally, with optional header/footer.
  HOW TO USE: Pass content to be centered; optionally include header, footer, and set maxWidth.
  WHEN TO USE: Use for forms (e.g., login/signup), landing page hero sections, error pages,
               or any focused content that benefits from centering.
  EXAMPLE:
  <CenteredContentTemplate
    header={<h1>Sign In</h1>}
    content={<form>Login Form</form>}
    footer={<p>Need help?</p>}
    maxWidth="max-w-md"
  />
*/
