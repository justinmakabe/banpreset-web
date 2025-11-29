'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LoadingBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Start loading
        setLoading(true);
        setProgress(20);

        // Simulate progress
        const timer1 = setTimeout(() => setProgress(40), 100);
        const timer2 = setTimeout(() => setProgress(60), 300);
        const timer3 = setTimeout(() => setProgress(80), 600);

        // Complete loading
        const completeTimer = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setLoading(false);
                setProgress(0);
            }, 200);
        }, 800);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(completeTimer);
        };
    }, [pathname, searchParams]);

    if (!loading && progress === 0) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent"
            style={{ pointerEvents: 'none' }}
        >
            <div
                className="h-full bg-gradient-to-r from-primary via-purple-400 to-primary transition-all duration-300 ease-out shadow-lg shadow-primary/50"
                style={{
                    width: `${progress}%`,
                    transition: 'width 0.3s ease-out',
                }}
            />
        </div>
    );
}
