import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
  lines?: number;
  width?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  lines = 1,
  width = 'w-full',
}) => {
  if (lines === 1) {
    return (
      <div
        className={cn(
          'animate-pulse bg-surface-200 dark:bg-surface-700 rounded-md h-4',
          width,
          className
        )}
      />
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse bg-surface-200 dark:bg-surface-700 rounded-md h-4',
            index === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
};

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton width="w-32" />
        <Skeleton width="w-16" />
      </div>
      <Skeleton lines={2} />
      <div className="flex items-center justify-between">
        <Skeleton width="w-24" />
        <Skeleton width="w-20" />
      </div>
    </div>
  );
};

export { Skeleton, SkeletonCard };
