"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: string;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  fill = true,
  width,
  height,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 ${className}`}>
        <ImageOff className="w-8 h-8 mb-1 opacity-50" />
        <span className="text-[10px]">Gambar tidak tersedia</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden w-full h-full bg-slate-100 ${className}`}>
      {/* Shimmer loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}

      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 300}
          height={height || 300}
          sizes={sizes}
          priority={priority}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
    </div>
  );
}
