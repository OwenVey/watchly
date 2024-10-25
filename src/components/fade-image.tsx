import { cn } from '@/lib/utils';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function FadeImage({ src, alt, className, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  const onLoad = () => {
    setLoaded(true);
  };

  useEffect(() => {
    if (ref.current?.complete) {
      onLoad();
    }
  });

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      onLoad={onLoad}
      className={cn('transition-opacity duration-500', loaded ? 'opacity-100' : 'opacity-0', className)}
      {...props}
    />
  );
}
