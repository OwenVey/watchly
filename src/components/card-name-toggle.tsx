import { useId } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface Props {
  checked: boolean;
  className?: string;
  onCheckedChange: (checked: boolean) => void;
}

export function CardNameToggle({ checked, className, onCheckedChange }: Props) {
  const id = useId();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className="whitespace-nowrap">
        Show names
      </Label>
    </div>
  );
}
