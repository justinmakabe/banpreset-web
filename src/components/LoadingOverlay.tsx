'use client';

import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
    message?: string;
    fullScreen?: boolean;
}

export default function LoadingOverlay({ message = 'Loading...', fullScreen = true }: LoadingOverlayProps) {
    return (
        <div
            className={`${fullScreen ? 'fixed inset-0' : 'absolute inset-0'
                } bg-black/80 backdrop-blur-md z-50 flex items-center justify-center`}
        >
            <div className="flex flex-col items-center gap-4 p-8 bg-surface/90 rounded-2xl border border-white/10 shadow-2xl">
                <Loader2
                    className="w-12 h-12 text-primary animate-spin"
                    strokeWidth={2.5}
                />
                {message && (
                    <p className="text-white font-medium text-lg animate-pulse">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
