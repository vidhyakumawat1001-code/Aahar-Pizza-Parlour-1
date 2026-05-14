
import React, { useState, useEffect, useRef } from 'react';
import { GalleryImage } from '../../types';
import { api } from '../../services/api';
import { Plus, Trash2, X, Image as ImageIcon, Upload, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadGallery = async () => {
    try {
      const data = await api.getGallery();
      setImages(data);
    } catch (error) {
      console.error('Failed to load gallery', error);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(picked));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please choose a photo from your gallery first.');
      return;
    }
    setIsUploading(true);
    try {
      const finalImageUrl = await fileToBase64(file);
      await api.addGalleryImage({ imageUrl: finalImageUrl, caption });
      await loadGallery();
      handleClose();
    } catch (error) {
      alert('Failed to save image: ' + error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setIsAdding(false);
    setCaption('');
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image from gallery?')) return;
    try {
      await api.deleteGalleryImage(id);
      await loadGallery();
    } catch (error) {
      alert('Failed to delete image: ' + error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-brand-red text-white font-bold rounded-xl flex items-center gap-2 hover:bg-red-900 transition-all shadow-lg shadow-brand-red/20"
        >
          <Plus className="w-5 h-5" /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden bg-stone-50 border border-stone-100">
            <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => handleDelete(img.id!)} className="p-4 bg-white text-red-600 rounded-full hover:scale-110 transition-transform shadow-xl">
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 text-white text-[10px] font-medium truncate">
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-24 bg-stone-50 rounded-[2.5rem] border border-dashed border-stone-200">
          <ImageIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">No gallery images yet.</p>
        </div>
      )}

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">Add Gallery Image</h3>
                <button onClick={handleClose} className="p-2 hover:bg-stone-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase">Choose Photo from Your Gallery</label>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="gallery-file-upload" />
                  <label
                    htmlFor="gallery-file-upload"
                    className={cn(
                      'w-full flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden',
                      previewUrl ? 'border-brand-red p-0' : 'border-stone-200 hover:border-brand-red bg-stone-50 py-10'
                    )}
                  >
                    {previewUrl ? (
                      <div className="relative w-full">
                        <img src={previewUrl} alt="Preview" className="w-full h-52 object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-sm font-semibold">Tap to change photo</span>
                        </div>
                        <div className="absolute top-2 right-2 bg-brand-red text-white rounded-full p-1">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-stone-300" />
                        <div className="text-center px-4">
                          <span className="text-sm font-semibold text-stone-600 block">Tap to open your gallery</span>
                          <span className="text-xs text-stone-400 mt-1 block">Supports JPG, PNG, WEBP</span>
                        </div>
                      </>
                    )}
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-400 uppercase">Caption (Optional)</label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="e.g. Our Wood-Fired Oven"
                    className="w-full px-4 py-3 bg-stone-50 rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUploading || !file}
                  className="w-full py-4 bg-brand-red text-white font-bold rounded-2xl hover:bg-red-900 transition-all shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" />Saving...</> : 'Add to Gallery'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}