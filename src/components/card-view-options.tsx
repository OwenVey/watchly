import { Columns2Icon, Columns3Icon, Columns4Icon, EyeIcon } from 'lucide-react';
import { useId } from 'react';
import { CardNameToggle } from '@/components/card-name-toggle';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { CardSize } from '@/lib/constants';

const CARD_SIZE_OPTIONS = [
  { icon: Columns4Icon, label: 'Small', value: 'small' },
  { icon: Columns3Icon, label: 'Medium', value: 'medium' },
  { icon: Columns2Icon, label: 'Large', value: 'large' },
] satisfies Array<{ icon: typeof Columns2Icon; label: string; value: CardSize }>;

const isCardSize = (value: string): value is CardSize => value === 'small' || value === 'medium' || value === 'large';

interface Props {
  cardSize: CardSize;
  onCardSizeChange: (cardSize: CardSize) => void;
  onShowNamesChange: (showNames: boolean) => void;
  onShowRatingsChange: (showRatings: boolean) => void;
  onShowYearsChange: (showYears: boolean) => void;
  showNames: boolean;
  showRatings: boolean;
  showYears: boolean;
}

export function CardViewOptions({
  cardSize,
  onCardSizeChange,
  onShowNamesChange,
  onShowRatingsChange,
  onShowYearsChange,
  showNames,
  showRatings,
  showYears,
}: Props) {
  const ratingsId = useId();
  const yearsId = useId();
  const cardSizeId = useId();

  return (
    <section className="flex flex-col gap-3 border-b p-4" aria-labelledby={`${cardSizeId}-heading`}>
      <h3 id={`${cardSizeId}-heading`} className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <EyeIcon className="size-5" />
        View
      </h3>

      <div className="flex flex-col gap-1.5">
        <Label id={`${cardSizeId}-label`}>Card size</Label>
        <ToggleGroup
          aria-labelledby={`${cardSizeId}-label`}
          className="w-full"
          spacing={0}
          value={[cardSize]}
          variant="outline"
          onValueChange={(values) => {
            const nextCardSize = values.at(-1);
            if (nextCardSize && isCardSize(nextCardSize)) {
              onCardSizeChange(nextCardSize);
            }
          }}
        >
          {CARD_SIZE_OPTIONS.map(({ icon: Icon, label, value }) => (
            <Tooltip key={value}>
              <TooltipTrigger
                render={
                  <ToggleGroupItem value={value} aria-label={label} className="flex-1">
                    <Icon />
                  </ToggleGroupItem>
                }
              />
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>
      </div>

      <CardNameToggle checked={showNames} onCheckedChange={onShowNamesChange} />

      <div className="flex items-center gap-2">
        <Switch id={ratingsId} checked={showRatings} onCheckedChange={onShowRatingsChange} />
        <Label htmlFor={ratingsId}>Show ratings</Label>
      </div>

      <div className="flex items-center gap-2">
        <Switch id={yearsId} checked={showYears} onCheckedChange={onShowYearsChange} />
        <Label htmlFor={yearsId}>Show years</Label>
      </div>
    </section>
  );
}
