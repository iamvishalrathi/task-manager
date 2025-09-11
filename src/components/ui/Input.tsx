import { forwardRef } from 'react';
import { cn } from '../../utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 dark:text-surface-500 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              'block w-full rounded-lg border border-surface-300 bg-white px-3 py-2.5 text-surface-900 placeholder-surface-500 transition-all duration-200',
              'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:shadow-sm',
              'hover:border-surface-400 focus:hover:border-primary-500',
              'dark:border-surface-600 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-400',
              'dark:focus:border-primary-400 dark:focus:ring-primary-400/20 dark:hover:border-surface-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20 hover:border-red-500',
              'disabled:bg-surface-100 disabled:text-surface-500 disabled:cursor-not-allowed dark:disabled:bg-surface-700',
              // Date picker icon styling for light and dark modes
              props.type === 'date' && '[&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 dark:text-surface-500 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
