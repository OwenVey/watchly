import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface Props {
  checked: boolean;
  className?: string;
  onCheckedChange: (checked: boolean) => void;
}

export function CardNameToggle({ checked, className, onCheckedChange }: Props) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Switch id="show-card-names" checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor="show-card-names" className="whitespace-nowrap">
        Show names
      </Label>
    </div>
  );
}
