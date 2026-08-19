import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  href?: string;
  theme?: "light" | "dark";
  variant?: "full" | "icon" | "text";
}

export function Logo({
  className = "",
  size = "md",
  showTagline = false,
  href = "/",
  theme = "light",
  variant = "full",
}: LogoProps) {
  // Dimensions configurations for the icon and text wordmark
  const config = {
    sm: {
      iconSize: 32,
      textWidth: 100,
      textHeight: 26,
      gap: "gap-2",
      taglineSize: "text-[9px]",
    },
    md: {
      iconSize: 42,
      textWidth: 130,
      textHeight: 34,
      gap: "gap-2.5",
      taglineSize: "text-[10px]",
    },
    lg: {
      iconSize: 52,
      textWidth: 160,
      textHeight: 42,
      gap: "gap-3",
      taglineSize: "text-[11px]",
    },
    xl: {
      iconSize: 68,
      textWidth: 200,
      textHeight: 52,
      gap: "gap-3.5",
      taglineSize: "text-xs",
    },
  }[size];

  const content = (
    <div
      className={`inline-flex items-center ${config.gap} group select-none ${className}`}
    >
      {/* 1. Official PASARLORE Shop Canopy & PL Emblem Icon */}
      {(variant === "full" || variant === "icon") && (
        <div
          className="relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
          style={{ width: config.iconSize, height: config.iconSize }}
        >
          <Image
            src="/images/pasarlore-icon.png"
            alt="Logo PASARLORE"
            width={config.iconSize}
            height={config.iconSize}
            className="object-contain drop-shadow-xs"
            priority
          />
        </div>
      )}

      {/* 2. Official PASARLORE Typography Wordmark */}
      {(variant === "full" || variant === "text") && (
        <div className="flex flex-col justify-center">
          <div
            className="relative flex items-center"
            style={{ width: config.textWidth, height: config.textHeight }}
          >
            <Image
              src="/images/pasarlore-text.png"
              alt="PASARLORE"
              width={config.textWidth}
              height={config.textHeight}
              className={`object-contain transition-opacity duration-200 ${
                theme === "dark" || className.includes("text-white")
                  ? "brightness-0 invert drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                  : ""
              }`}
              priority
            />
          </div>

          {showTagline && (
            <span
              className={`${config.taglineSize} font-bold tracking-wider uppercase -mt-0.5 ${
                theme === "dark" || className.includes("text-white")
                  ? "text-amber-400"
                  : "text-amber-600"
              }`}
            >
              Toko Serba Ada Terlengkap
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
