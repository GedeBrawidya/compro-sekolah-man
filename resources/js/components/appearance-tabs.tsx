import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Terang' },
        { value: 'dark', icon: Moon, label: 'Gelap' },
        { value: 'system', icon: Monitor, label: 'Sistem' },
    ];

    return (
        <div
            style={{ backgroundColor: '#eef4eb', borderColor: '#b8ceb0' }}
            className={cn(
                'inline-flex gap-1.5 rounded-xl border p-1.5 shadow-xs',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => {
                const isActive = appearance === value;
                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => updateAppearance(value)}
                        style={{
                            backgroundColor: isActive ? '#265243' : 'transparent',
                            color: isActive ? '#ffffff' : '#142921',
                        }}
                        className={cn(
                            'flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all',
                            !isActive && 'hover:bg-[#dce8d7]',
                        )}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{label}</span>
                    </button>
                );
            })}
        </div>
    );
}
