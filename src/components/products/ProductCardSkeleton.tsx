import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 animate-pulse flex flex-col justify-between">
      <div>
        {/* Image skeleton */}
        <div className="aspect-4/3 bg-slate-200 rounded-xl mb-4 w-full" />

        {/* Badges skeleton */}
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 bg-slate-200 rounded w-16" />
          <div className="h-4 bg-slate-200 rounded w-12" />
        </div>

        {/* Title skeleton */}
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />

        {/* Description skeleton */}
        <div className="h-3 bg-slate-100 rounded w-full mb-1" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
      </div>

      {/* Price & button skeleton */}
      <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <div className="h-2.5 bg-slate-200 rounded w-10 mb-1.5" />
          <div className="h-5 bg-slate-200 rounded w-20" />
        </div>
        <div className="h-9 w-20 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
