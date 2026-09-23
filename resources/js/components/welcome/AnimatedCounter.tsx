import { useEffect, useState } from 'react';

export function AnimatedCounter({ value }: { value: string | number }) {
    const [count, setCount] = useState(0);
    const strVal = String(value);
    const numericStr = strVal.replace(/[^0-9]/g, '');
    const targetNum = parseInt(numericStr, 10);
    const hasPlus = strVal.includes('+');
    const isNumeric = !isNaN(targetNum) && numericStr.length > 0;

    useEffect(() => {
        if (!isNumeric) return;
        let start = 0;
        const duration = 1600;
        const steps = 40;
        const stepTime = duration / steps;
        const increment = targetNum / steps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= targetNum) {
                setCount(targetNum);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [targetNum, isNumeric]);

    if (!isNumeric) {
        return <span>{strVal}</span>;
    }

    return (
        <span>
            {count.toLocaleString('id-ID')}
            {hasPlus ? '+' : ''}
        </span>
    );
}
