import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleDarkMode } from '../../store/themeSlice';
import { Button } from './Button';

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDarkMode } = useAppSelector((state) => state.theme);

  const handleToggle = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2"
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </Button>
  );
};

export { ThemeToggle };
