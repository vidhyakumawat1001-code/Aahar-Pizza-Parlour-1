import React, { useState, useEffect } from 'react';
import { Review } from '../../types';
import { api } from '../../services/api';
import { Star, Trash2, Calendar, User as UserIcon, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function ReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      const data = await api.getReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.deleteReview(id);
      await loadReviews();
    } catch (error) {
      alert("Failed to delete review: " + error);
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-8 w-48 bg-stone-100 rounded-lg" /><div className="h-64 bg-stone-50 rounded-2xl" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="px-4 py-1.5 bg-stone-100 rounded-full text-xs font-bold text-stone-500 uppercase tracking-wider">
          {reviews.length} Total Reviews
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-stone-50 p-8 rounded-3xl border border-stone-100 relative group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <UserIcon className="w-6 h-6 text-stone-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{review.customerName}</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{review.timestamp ? new Date(review.timestamp).toLocaleDateString() : 'N/A'}</span>
                    <span>•</span>
                    <span>{review.timestamp ? new Date(review.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= review.rating ? 'fill-orange-500 text-orange-500' : 'text-stone-200'}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-100 text-stone-600 leading-relaxed italic">
              "{review.comment}"
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleDelete(review.id!)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Review
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-24 bg-stone-50 rounded-[2.5rem] border border-dashed border-stone-200">
          <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">No reviews submitted yet.</p>
        </div>
      )}
    </div>
  );
}
