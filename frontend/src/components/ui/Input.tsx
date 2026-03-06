import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 border rounded-lg shadow-sm text-zinc-100 placeholder-zinc-500 bg-zinc-900',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
          'transition-colors duration-200',
          error ? 'border-red-500 bg-red-950/20' : 'border-zinc-700',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
