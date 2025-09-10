import { cn } from '../../utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className,
  padding = 'md',
  shadow = 'md',
  hover = false,
}) => {
  const baseClasses = 'bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700';
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-soft',
    lg: 'shadow-medium',
  };

  return (
    <div
      className={cn(
        baseClasses,
        paddings[padding],
        shadows[shadow],
        hover && 'transition-all duration-200 hover:shadow-large hover:scale-[1.02]',
        className
      )}
    >
      {children}
    </div>
  );
};

export { Card };
