'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, User } from 'lucide-react';

export default function ReviewSection({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Form
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
        checkUser();
    }, [productId]);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
    };

    const fetchReviews = async () => {
        const { data } = await supabase
            .from('reviews')
            .select('*, profiles(full_name, avatar_url)')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });

        setReviews(data || []);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('reviews')
                .insert({
                    user_id: user.id,
                    product_id: productId,
                    rating,
                    comment
                });

            if (error) throw error;

            setComment('');
            setRating(5);
            fetchReviews();
            alert('Review posted successfully!');
        } catch (error: any) {
            alert('Error posting review: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-20 border-t border-white/10 pt-10">
            <h2 className="text-2xl font-bold text-white mb-8">Customer Reviews</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Reviews List */}
                <div className="space-y-6">
                    {loading ? (
                        <p className="text-gray-400">Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="bg-surface border border-white/5 p-6 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                                            {review.profiles?.avatar_url ? (
                                                <img src={review.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={20} className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{review.profiles?.full_name || 'Anonymous'}</h4>
                                            <div className="flex text-yellow-400 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Review Form */}
                <div className="bg-surface border border-white/10 p-6 rounded-xl h-fit">
                    <h3 className="text-lg font-bold text-white mb-4">Write a Review</h3>
                    {user ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                        >
                                            <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Comment</label>
                                <textarea
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary transition-colors h-32 resize-none"
                                    placeholder="Share your thoughts..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                            >
                                {submitting ? 'Posting...' : 'Post Review'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400 mb-4">Please log in to write a review.</p>
                            <a href="/login" className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
                                Log In
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
