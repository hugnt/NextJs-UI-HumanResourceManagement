// src/hooks/use-check-active-nav.tsx
'use client';

import { usePathname } from 'next/navigation'; // Use this for App Router

export default function useCheckActiveNav() {
  const pathname = usePathname(); // Get the current pathname

  const checkActiveNav = (nav: string): boolean => {
    const pathArray = pathname.split('/').filter((item) => item !== '');

    if (nav === '/' && pathArray.length < 1) return true;

    return pathArray.includes(nav.replace(/^\//, ''));
  };

  return { checkActiveNav };
}