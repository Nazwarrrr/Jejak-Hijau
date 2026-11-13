import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Card = forwardRef(function Card(
  { children, className = '', hover = false, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'motion-card rounded-3xl border border-white/70 bg-white/65 shadow-xl shadow-emerald-900/[0.06] backdrop-blur-xl',
        hover && 'cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
