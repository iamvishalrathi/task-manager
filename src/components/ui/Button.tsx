import { forwardRef } from 'react';
import { cn } from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600',
      secondary: 'bg-surface-100 hover:bg-surface-200 text-surface-900 shadow-sm focus:ring-surface-500 dark:bg-surface-800 dark:hover:bg-surface-700 dark:text-surface-100',
      outline: 'border border-surface-300 hover:bg-surface-50 text-surface-700 focus:ring-surface-500 dark:border-surface-600 dark:hover:bg-surface-800 dark:text-surface-300',
      ghost: 'hover:bg-surface-100 text-surface-700 focus:ring-surface-500 dark:hover:bg-surface-800 dark:text-surface-300',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : leftIcon ? (
          leftIcon
        ) : null}
        {children}
        {rightIcon && !loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
