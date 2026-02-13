import { Link } from '@tanstack/react-router';
import { CircleArrowRightIcon } from 'lucide-react';
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

type Props = {
  title: string;
  children: React.ReactNode;
  link: string;
};

export function CardCarousel({ title, children, link }: Props) {
  return (
    <Carousel
      opts={{
        align: 'start',
        slidesToScroll: 1,
        breakpoints: {
          '(min-width: 380px)': { slidesToScroll: 2 },
          '(min-width: 560px)': { slidesToScroll: 3 },
          '(min-width: 740px)': { slidesToScroll: 4 },
          '(min-width: 920px)': { slidesToScroll: 5 },
          '(min-width: 1080px)': { slidesToScroll: 6 },
        },
      }}
    >
      <div className="flex items-end justify-between">
        <Link className="group -m-1 flex items-center gap-1.5 rounded-md p-1" to={link}>
          <h2 className="text-2xl leading-5 font-semibold text-foreground">{title}</h2>
          <CircleArrowRightIcon className="size-6 text-muted-foreground transition-colors group-hover:text-foreground" />
        </Link>
        <div className="flex gap-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
      <CarouselContent className="mt-3 grid shrink-0 auto-cols-[160px] grid-flow-col gap-4">{children}</CarouselContent>
    </Carousel>
  );
}
