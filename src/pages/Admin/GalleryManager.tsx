import React, { useState, useEffect } from 'react';
import { GalleryImage } from '../../types';
import { api } from '../../services/api';
import { Plus, Trash2, X, Image as ImageIcon, Upload, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newImage, setNewImage] = useState({ imageUrl: '', caption: '' });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const loadGallery = async () => {
    try {
      const data = await api.getGallery();
      setImages(data);
    } catch (error) {
      console.error("Failed to load gallery", error);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(0);

    try {
      let finalImageUrl = newImage.imageUrl;

      if (file) {
        setUploadProgress(50);
        finalImageUrl = await api.uploadPhoto(file);
        setUploadProgress(100);
      }

      if (!finalImageUrl) {
        alert("Please provide an image URL or upload a file.");
        setIsUploading(false);
        return;
      }

      await api.addGalleryImage({
        imageUrl: finalImageUrl,
        caption: newImage.caption
      });
      
      await loadGallery();
      setIsAdding(false);
      setNewImage({ imageUrl: '', caption: '' });
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      alert("Failed to save gallery image: " + error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image from gallery?')) return;
    try {
      await api.deleteGalleryImage(id);
      await loadGallery();
    } catch (error) {
      alert("Failed to delete gallery image: " + error);
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
            <img 
              src={img.imageUrl} 
              alt={img.caption}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => handleDelete(img.id!)}
                className="p-4 bg-white text-red-600 rounded-full hover:scale-110 transition-transform shadow-xl"
              >
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

      {/* Modal */}
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
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-stone-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase">Upload Image</label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="gallery-file-upload"
                      />
                      <label
                        htmlFor="gallery-file-upload"
                        className={cn(
                          "w-full px-4 py-8 bg-stone-50 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                          file ? "border-brand-red bg-red-50" : "border-stone-200 hover:border-brand-red"
                        )}
                      >
                        {file ? (
                          <>
                            <Check className="w-8 h-8 text-brand-red" />
                            <span className="text-sm font-medium text-red-900">{file.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-stone-300" />
                            <span className="text-sm font-medium text-stone-500">Click to upload image</span>
                          </>
                        )}
                      </label>
                      {isUploading && file && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4">
                          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden mb-2">
                            <motion.div 
                              className="bg-brand-red h-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-brand-red">{Math.round(uploadProgress)}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-stone-100" />
                    <span className="text-[10px] font-bold text-stone-300 uppercase">OR</span>
                    <div className="flex-1 h-px bg-stone-100" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase">Image URL</label>
                    <input
                      type="url"
                      value={newImage.imageUrl}
                      onChange={e => setNewImage({ ...newImage, imageUrl: e.target.value })}
                      placeholder="https://example.com/pizza.jpg"
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase">Caption (Optional)</label>
                    <input
                      type="text"
                      value={newImage.caption}
                      onChange={e => setNewImage({ ...newImage, caption: e.target.value })}
                      placeholder="e.g. Our Wood-Fired Oven"
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-4 bg-brand-red text-white font-bold rounded-2xl hover:bg-red-900 transition-all shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Add to Gallery'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
