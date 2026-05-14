import React, { useState, useEffect } from 'react';
import { GalleryImage } from '../types';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2 } from 'lucide-react';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await api.getGallery();
        setImages(data);
      } catch (error) {
        console.error("Failed to load gallery", error);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="aspect-square bg-stone-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Our <span className="text-brand-red">Gallery</span></h1>
        <p className="text-stone-500 max-w-2xl mx-auto">
          A visual journey through our kitchen and the delicious moments we share.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative group cursor-pointer rounded-3xl overflow-hidden bg-stone-100 border border-stone-100 shadow-sm hover:shadow-xl transition-all"
            onClick={() => setSelectedImage(img)}
          >
            <img
              src={img.imageUrl}
              alt={img.caption || "Gallery Image"}
              className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-red/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                <Maximize2 className="text-white w-6 h-6" />
              </div>
            </div>
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-red/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-bold tracking-wide">{img.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-stone-200">
          <p className="text-stone-500">Our gallery is currently empty. Check back soon!</p>
        </div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.caption}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
              {selectedImage.caption && (
                <p className="text-white text-lg font-medium text-center">{selectedImage.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
