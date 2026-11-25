"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

export function FooterVisibility({ children, hideOnContact = false }: { children: ReactNode; hideOnContact?: boolean }) {
  const pathname = usePathname();

  if (pathname.startsWith("/learn/") || (hideOnContact && pathname === "/contact")) return null;

  return children;
}
