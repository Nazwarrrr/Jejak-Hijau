import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(function Input(
  {
    label,
    suffix,
    error,
    className = '',
    id,
    type = 'text',
    ...props
  },
  ref
) {
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </span>
      )}
      <div className="relative block">
        <input
          ref={ref}
          id={id}
          type={type}
          className={cn(
            'w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10',
            suffix && 'pr-14',
            error && 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-500" role="alert">
          {error}
        </p>
      )}
    </label>
  );
});

Input.displayName = 'Input';

export default Input;
