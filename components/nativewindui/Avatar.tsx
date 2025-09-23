import * as AvatarPrimitive from '@rn-primitives/avatar';

import { cn } from '@/lib/cn';

function Avatar({ className, ...props }: AvatarPrimitive.RootProps) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.ImageProps) {
  return (
    <AvatarPrimitive.Image className={cn('aspect-square h-full w-full', className)} {...props} />
  );
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.FallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
