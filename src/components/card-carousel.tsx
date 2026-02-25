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
      className="@container"
      opts={{
        align: 'start',
        slidesToScroll: 'auto',
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
      <CarouselContent className="mt-3 -ml-4 *:basis-1/1 @sm:*:basis-1/2 @xl:*:basis-1/3 @3xl:*:basis-1/4 @4xl:*:basis-1/5 @5xl:*:basis-1/6">
        {children}
      </CarouselContent>
    </Carousel>
  );
}
