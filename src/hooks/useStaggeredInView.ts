// src/hooks/useStaggeredInView.ts
import { useEffect, useRef, useState } from 'react';

export function useStaggeredInView<T extends HTMLElement>(count: number, options?: IntersectionObserverInit) {
  const refs = useRef<(T | null)[]>([]);
  const [inViewArr, setInViewArr] = useState(Array(count).fill(false));

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.staggerIdx);
          if (entry.isIntersecting && !inViewArr[idx]) {
            setInViewArr((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      options
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line
  }, []);

  return [refs, inViewArr] as const;
}
