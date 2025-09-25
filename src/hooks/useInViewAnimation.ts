// src/hooks/useInViewAnimation.ts
import { useEffect, useRef, useState } from 'react';

export function useInViewAnimation<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      options
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView] as const;
}
