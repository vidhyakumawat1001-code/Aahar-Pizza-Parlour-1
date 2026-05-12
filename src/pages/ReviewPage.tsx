import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await api.addReview({
        customerName: name || 'Anonymous',
        rating,
        comment
      });
      setIsSubmitted(true);
    } catch (error) {
      alert("Failed to submit review. " + error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Share Your Experience</h1>
        <p className="text-stone-500">
          Your feedback helps us grow. Please let us know how we did!
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/50"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Rating */}
              <div className="space-y-4 text-center">
                <label className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                  Rate your pizza
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          (hover || rating) >= star 
                            ? 'fill-brand-yellow text-brand-yellow' 
                            : 'text-stone-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">Your Name (Optional)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-red transition-all outline-none"
                />
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-stone-700 ml-1">Your Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you liked or how we can improve..."
                  className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-red transition-all outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="w-full py-5 bg-brand-red hover:bg-red-900 disabled:bg-stone-200 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Submit Review <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-xl text-center space-y-6"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Thank You!</h2>
              <p className="text-stone-500 text-lg">
                Your review has been submitted successfully. We appreciate your time and feedback!
              </p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setRating(0);
                setComment('');
                setName('');
              }}
              className="px-8 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-all"
            >
              Submit Another Review
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center pt-12 border-t border-stone-100">
        <div className="inline-flex items-center gap-2 text-stone-400 text-sm">
          <MessageSquare className="w-4 h-4" />
          <span>Reviews are private and visible only to the admin.</span>
        </div>
      </div>
    </div>
  );
}
