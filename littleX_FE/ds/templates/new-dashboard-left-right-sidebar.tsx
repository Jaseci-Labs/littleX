import React from "react";

type DashboardLeftRightSidebarTemplateProps = {
  rightSidebar: React.ReactNode;
  leftSidebar: React.ReactNode;
  main: React.ReactNode;
  mobileNavBar?: React.ReactNode; // New
  mobileBottomNav?: React.ReactNode; // New
  mobileRightSidebar?: React.ReactNode; // New
  sidebarWidth?: string;
  maxWidth?: boolean;
};

const NewDashboardLeftRightSidebar = (
  props: DashboardLeftRightSidebarTemplateProps
) => {
  const {
    rightSidebar,
    leftSidebar,
    main,
    mobileNavBar,
    mobileBottomNav,
    mobileRightSidebar,
    sidebarWidth = "w-72",
  } = props;

  return (
    <>
      {/* Mobile navigation bar - only visible on small screens */}
      {mobileNavBar}

      <div className="min-h-screen flex max-w-[1366px] mx-auto">
        {/* Left sidebar - hidden on mobile */}
        <aside
          className={`${sidebarWidth} hidden md:block border-x border-border bg-sidebar-background`}
        >
          {leftSidebar}
        </aside>

        {/* Main content - adjusted for mobile */}
        <main className="flex-1 pb-16 md:pb-0">{main}</main>

        {/* Right sidebar - hidden on mobile/tablet */}
        <aside
          className={`${sidebarWidth} hidden lg:block border-x border-border bg-sidebar-background`}
        >
          {rightSidebar}
        </aside>
      </div>

      {/* Mobile-only components that appear at the bottom or floating */}
      {mobileBottomNav}
      {mobileRightSidebar}
    </>
  );
};

export default NewDashboardLeftRightSidebar;
