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
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-surface-800 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
    
    const variants = {
      primary: 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-sm focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]',
      secondary: 'bg-surface-100 hover:bg-surface-200 active:bg-surface-300 text-surface-900 shadow-sm focus:ring-surface-500 dark:bg-surface-800 dark:hover:bg-surface-700 dark:active:bg-surface-600 dark:text-surface-100 hover:shadow-md',
      outline: 'border border-surface-300 hover:bg-surface-50 active:bg-surface-100 text-surface-700 focus:ring-surface-500 dark:border-surface-600 dark:hover:bg-surface-800 dark:active:bg-surface-700 dark:text-surface-300 hover:shadow-sm',
      ghost: 'hover:bg-surface-100 active:bg-surface-200 text-surface-700 focus:ring-surface-500 dark:hover:bg-surface-800 dark:active:bg-surface-700 dark:text-surface-300',
      danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm focus:ring-red-500 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5 h-8',
      md: 'px-4 py-2 text-sm gap-2 h-10',
      lg: 'px-6 py-3 text-base gap-2.5 h-12',
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
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children && <span className="ml-2">{children}</span>}
          </div>
        ) : (
          <>
            {leftIcon && (
              <span className="flex-shrink-0">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && !loading && (
              <span className="flex-shrink-0">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
