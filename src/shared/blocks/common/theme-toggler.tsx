'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, SunDim } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { AnimatedThemeToggler } from '@/shared/components/magicui/animated-theme-toggler';
import { Button } from '@/shared/components/ui/button';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/shared/components/ui/toggle-group';

export function ThemeToggler({
  type = 'icon',
  className,
}: {
  type?: 'icon' | 'button' | 'toggle';
  className?: string;
}) {
  const t = useTranslations('desk.nav');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  if (!mounted) {
    return null;
  }

  if (type === 'button') {
    return (
      <Button variant="outline" size="sm" className="hover:bg-primary/10">
        <SunDim />
      </Button>
    );
  } else if (type === 'toggle') {
    return (
      <ToggleGroup
        type="single"
        className={` ${className}`}
        value={theme}
        onValueChange={handleThemeChange}
        variant="outline"
      >
        <ToggleGroupItem
          value="light"
          onClick={() => setTheme('light')}
          aria-label={t('light')}
        >
          <SunDim />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="dark"
          onClick={() => setTheme('dark')}
          aria-label={t('dark')}
        >
          <Moon />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="system"
          onClick={() => setTheme('system')}
          aria-label={t('system')}
        >
          <Monitor />
        </ToggleGroupItem>
      </ToggleGroup>
    );
  }

  return <AnimatedThemeToggler className={className} />;
}
