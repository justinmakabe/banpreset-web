import { formatCurrency } from '@/utils/format';

interface PriceDisplayProps {
    price: number;
    salePrice?: number | null;
    size?: 'sm' | 'md' | 'lg';
    showBadge?: boolean;
}

export default function PriceDisplay({
    price,
    salePrice,
    size = 'md',
    showBadge = true
}: PriceDisplayProps) {
    const isOnSale = salePrice && salePrice > 0 && salePrice < price;
    const discount = isOnSale ? Math.round(((price - salePrice) / price) * 100) : 0;

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-2xl'
    };

    const badgeSizeClasses = {
        sm: 'text-xs px-1.5 py-0.5',
        md: 'text-sm px-2 py-1',
        lg: 'text-base px-2.5 py-1'
    };

    // Free product
    if (price === 0) {
        return (
            <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-green-500 text-white font-bold rounded-full text-sm">
                    FREE
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {isOnSale ? (
                <>
                    <span className={`font-bold text-primary ${sizeClasses[size]}`}>
                        {formatCurrency(salePrice)}
                    </span>
                    <span className={`text-gray-500 line-through ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
                        {formatCurrency(price)}
                    </span>
                    {showBadge && discount > 0 && (
                        <span className={`bg-red-500 text-white font-bold rounded ${badgeSizeClasses[size]}`}>
                            -{discount}%
                        </span>
                    )}
                </>
            ) : (
                <span className={`font-bold text-primary ${sizeClasses[size]}`}>
                    {formatCurrency(price)}
                </span>
            )}
        </div>
    );
}
