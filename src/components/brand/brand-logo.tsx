"use client";

import { useId } from "react";
import { useTheme } from "@/components/theme/theme-provider";

const WORDMARK = "/brand/acal-logo-blue-alt.png";

export function BrandLogo() {
  const theme = useTheme().theme;
  const filterId = useId().replaceAll(":", "");
  const whiteOnBlue = theme === "acal";

  return (
    <svg className="h-9 w-[148px]" viewBox="0 0 531 376" role="img" aria-label="acal">
      <filter id={filterId} colorInterpolationFilters="sRGB">
        {whiteOnBlue ? (
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0.12 0.42 0.92 0 0"
          />
        ) : (
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0.12 0.42 0.92 0 0"
          />
        )}
      </filter>
      <image href={WORDMARK} width="531" height="376" filter={`url(#${filterId})`} />
    </svg>
  );
}
