import { cn } from "@/_core/utils";
import Image from "next/image";
import React from "react";

function AppLogo({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src="/placeholder-logo.png"
      alt="little x logo"
      width={`${width}`}
      height={`${height}`}
      priority={true}
    />
  );
}

export default AppLogo;
