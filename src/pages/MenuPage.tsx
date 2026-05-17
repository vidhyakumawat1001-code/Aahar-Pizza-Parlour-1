import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { api } from '../services/api';
import { motion } from 'motion/react';
import { Pizza, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await api.getMenu();
        setItems(data);
      } catch (error) {
        console.error("Failed to load menu", error);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const categories = ['All', ...new Set(items.map(item => item.category))];
  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-stone-200 mx-auto rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-stone-200 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our Delicious Menu</h1>
        <p className="text-stone-500 max-w-2xl mx-auto">
          From classic Margheritas to our signature Aahar specials, 
          every pizza is a masterpiece.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeCategory === cat 
                ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' 
                : 'bg-white text-stone-600 border border-stone-200 hover:border-brand-red'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[2rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="relative h-56 overflow-hidden">
              <img 
                src={item.imageUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800"} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-brand-red uppercase tracking-wider">
                {item.category}
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold group-hover:text-brand-red transition-colors">{item.name}</h3>
                <span className="text-xl font-black text-stone-900">₹${item.price.toFixed(2)}</span>
              </div>
              <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">
                {item.description}
              </p>
              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <Info className="w-3.5 h-3.5" />
                  <span>Freshly Baked</span>
                </div>
                <button className="p-3 bg-stone-50 rounded-xl hover:bg-brand-red hover:text-white transition-colors">
                  <Pizza className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-stone-200">
          <Pizza className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">No items found in this category.</p>
        </div>
      )}
    </div>
  );
}
