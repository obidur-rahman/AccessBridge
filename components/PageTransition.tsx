"use client";

import { usePathname } from "next/navigation";

/**
 * Route changes replay the same 420ms rise used on first paint, so one page
 * settles into the next instead of cutting. Keyed by pathname: the subtree
 * remounts on navigation and reverts with it.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="soft-in">
      {children}
    </div>
  );
}
