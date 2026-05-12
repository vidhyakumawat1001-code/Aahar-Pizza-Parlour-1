import React, { useState, useEffect } from 'react';
import { MenuItem, GalleryImage } from '../../types';
import { api } from '../../services/api';
import { Plus, Trash2, Edit2, X, Check, Search, Filter, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Veg',
    imageUrl: ''
  });

  const loadData = async () => {
    try {
      const [menuData, galleryData] = await Promise.all([
        api.getMenu(),
        api.getGallery()
      ]);
      setItems(menuData);
      setGalleryImages(galleryData);
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  useEffect(() => {
    loadData();
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
      let finalImageUrl = currentItem.imageUrl;

      if (file) {
        // Simulate progress for local upload (usually too fast to see)
        setUploadProgress(50);
        finalImageUrl = await api.uploadPhoto(file);
        setUploadProgress(100);
      }

      const itemData = { ...currentItem, imageUrl: finalImageUrl };
      await api.saveMenuItem(itemData);
      
      await loadData();
      setIsEditing(false);
      setFile(null);
      setUploadProgress(0);
      setCurrentItem({ name: '', description: '', price: 0, category: 'Veg', imageUrl: '' });
    } catch (error) {
      alert("Failed to save item: " + error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.deleteMenuItem(id);
      await loadData();
    } catch (error) {
      alert("Failed to delete item: " + error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <button
          onClick={() => {
            setCurrentItem({ name: '', description: '', price: 0, category: 'Veg', imageUrl: '' });
            setIsEditing(true);
          }}
          className="px-6 py-3 bg-brand-red text-white font-bold rounded-xl flex items-center gap-2 hover:bg-red-900 transition-all shadow-lg shadow-brand-red/20"
        >
          <Plus className="w-5 h-5" /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-6 p-6 bg-stone-50 rounded-2xl border border-stone-100 group">
            <img 
              src={item.imageUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200"} 
              alt={item.name}
              className="w-20 h-20 object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <span className="px-2 py-0.5 bg-white border border-stone-200 rounded-md text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  {item.category}
                </span>
              </div>
              <p className="text-sm text-stone-500 line-clamp-1">{item.description}</p>
              <p className="font-bold text-brand-red mt-1">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setCurrentItem(item);
                  setIsEditing(true);
                }}
                className="p-3 bg-white hover:bg-blue-50 text-stone-400 hover:text-blue-600 rounded-xl border border-stone-100 transition-all"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(item.id!)}
                className="p-3 bg-white hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-xl border border-stone-100 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">{currentItem.id ? 'Edit Menu Item' : 'Add New Item'}</h3>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-stone-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase">Item Name</label>
                    <input
                      required
                      type="text"
                      value={currentItem.name}
                      onChange={e => setCurrentItem({ ...currentItem, name: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase">Price ($)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={currentItem.price}
                      onChange={e => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase">Category</label>
                    <select
                      value={currentItem.category}
                      onChange={e => setCurrentItem({ ...currentItem, category: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl focus:ring-2 focus:ring-brand-red outline-none"
                    >
                      <option>Veg</option>
                      <option>Non-Veg</option>
                      <option>Sides</option>
                      <option>Drinks</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase">Item Image</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="menu-file-upload"
                        />
                        <label
                          htmlFor="menu-file-upload"
                          className={cn(
                            "w-full h-32 bg-stone-50 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                            file ? "border-orange-500 bg-orange-50" : "border-stone-200 hover:border-orange-300"
                          )}
                        >
                          {file ? (
                            <>
                              <Check className="w-6 h-6 text-orange-600" />
                              <span className="text-[10px] font-medium text-orange-900 truncate max-w-[150px]">{file.name}</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-stone-300" />
                              <span className="text-[10px] font-medium text-stone-500">Upload Image</span>
                            </>
                          )}
                        </label>
                        {isUploading && file && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4">
                            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mb-2">
                              <motion.div 
                                className="bg-orange-600 h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-orange-600">{Math.round(uploadProgress)}%</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-300 uppercase">OR Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={currentItem.imageUrl}
                            onChange={e => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
                            placeholder="https://..."
                            className="flex-1 px-4 py-3 bg-stone-50 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setIsGalleryOpen(true)}
                            className="px-4 py-3 bg-brand-cream hover:bg-brand-yellow/20 text-brand-red rounded-xl transition-colors flex items-center gap-2 text-xs font-bold border border-brand-red/10"
                          >
                            <ImageIcon className="w-4 h-4" /> Gallery
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-bold text-stone-400 uppercase">Description</label>
                    <textarea
                      rows={3}
                      value={currentItem.description}
                      onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 rounded-xl focus:ring-2 focus:ring-brand-red outline-none resize-none"
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
                      Saving...
                    </>
                  ) : (
                    currentItem.id ? 'Save Changes' : 'Add to Menu'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gallery Picker Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">Select from Gallery</h3>
                <button onClick={() => setIsGalleryOpen(false)} className="p-2 hover:bg-stone-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
                {galleryImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setCurrentItem({ ...currentItem, imageUrl: img.imageUrl });
                      setIsGalleryOpen(false);
                      setFile(null); // Clear file if picking from gallery
                    }}
                    className={cn(
                      "relative aspect-square rounded-2xl overflow-hidden border-4 transition-all",
                      currentItem.imageUrl === img.imageUrl ? "border-orange-600 scale-95" : "border-transparent hover:border-stone-200"
                    )}
                  >
                    <img 
                      src={img.imageUrl} 
                      alt={img.caption} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {currentItem.imageUrl === img.imageUrl && (
                      <div className="absolute inset-0 bg-orange-600/20 flex items-center justify-center">
                        <Check className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </button>
                ))}
                {galleryImages.length === 0 && (
                  <div className="col-span-full py-12 text-center text-stone-400">
                    No images in gallery yet.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
