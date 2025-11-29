import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number; // 0-5
    maxRating?: number;
    size?: number;
    showCount?: boolean;
    count?: number;
}

export default function StarRating({
    rating,
    maxRating = 5,
    size = 16,
    showCount = false,
    count = 0
}: StarRatingProps) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < maxRating; i++) {
        if (i < fullStars) {
            // Full star
            stars.push(
                <Star
                    key={i}
                    size={size}
                    className="fill-yellow-400 text-yellow-400"
                />
            );
        } else if (i === fullStars && hasHalfStar) {
            // Half star
            stars.push(
                <div key={i} className="relative" style={{ width: size, height: size }}>
                    <Star size={size} className="text-gray-600 absolute" />
                    <div className="absolute overflow-hidden" style={{ width: size / 2 }}>
                        <Star size={size} className="fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
            );
        } else {
            // Empty star
            stars.push(
                <Star
                    key={i}
                    size={size}
                    className="text-gray-600"
                />
            );
        }
    }

    return (
        <div className="flex items-center gap-1">
            {stars}
            {showCount && count > 0 && (
                <span className="text-sm text-gray-400 ml-1">
                    ({count})
                </span>
            )}
        </div>
    );
}
