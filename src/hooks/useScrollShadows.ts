import { useEffect, useRef, useState } from 'react';

export function useScrollShadows() {
  const [showTopShadow, setShowTopShadow] = useState<boolean>(false);
  const [showBottomShadow, setShowBottomShadow] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

        // Determine if shadows should be shown
        setShowTopShadow(scrollTop > 0);
        setShowBottomShadow(scrollTop + clientHeight < scrollHeight);
      }
    };

    const containerElement = containerRef.current;
    if (containerElement) {
      containerElement.addEventListener('scroll', handleScroll);

      // Initial check
      handleScroll();

      // Cleanup function to remove the event listener
      return () => {
        containerElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return { containerRef, showTopShadow, showBottomShadow };
}
