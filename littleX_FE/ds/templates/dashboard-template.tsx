import type { ReactNode } from "react"

interface DashboardTemplateProps {
  header: ReactNode
  sidebar?: ReactNode
  children: ReactNode
}

export function DashboardTemplate({ header, sidebar, children }: DashboardTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-background border-b">{header}</div>
      <div className="flex flex-1">
        {sidebar && <div className="hidden md:block w-64 border-r p-4 bg-muted/20">{sidebar}</div>}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

