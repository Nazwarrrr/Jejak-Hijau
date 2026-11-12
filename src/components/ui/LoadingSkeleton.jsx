import { cn } from '../../lib/utils';

const variantClasses = {
  text: 'h-4 w-full rounded-lg',
  title: 'h-7 w-3/4 rounded-lg',
  avatar: 'h-12 w-12 rounded-full',
  card: 'h-48 w-full rounded-3xl',
  chart: 'h-48 w-full rounded-2xl',
};

export default function LoadingSkeleton({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) {
  const customStyle = {};
  if (width !== undefined) customStyle.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) customStyle.height = typeof height === 'number' ? `${height}px` : height;

  const skeletonItem = (index) => (
    <div
      key={index}
      style={customStyle}
      className={cn(
        'animate-pulse bg-slate-200/60',
        variantClasses[variant] || variantClasses.text,
        className
      )}
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }, (_, i) => skeletonItem(i))}
      </div>
    );
  }

  return skeletonItem(0);
}
