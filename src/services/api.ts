import { MenuItem, GalleryImage, Review } from '../types';
 
const API_BASE = '/api';
 
export const api = {
  async getMenu(): Promise<MenuItem[]> {
    const res = await fetch(`${API_BASE}/menu`);
    return res.json();
  },
  async saveMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    const res = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },
  async deleteMenuItem(id: string): Promise<void> {
    await fetch(`${API_BASE}/menu/${id}`, { method: 'DELETE' });
  },
 
  async getGallery(): Promise<GalleryImage[]> {
    const res = await fetch(`${API_BASE}/gallery`);
    return res.json();
  },
  async addGalleryImage(image: Partial<GalleryImage>): Promise<GalleryImage> {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(image),
    });
    return res.json();
  },
  async deleteGalleryImage(id: string): Promise<void> {
    await fetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
  },
 
  async getReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews`);
    return res.json();
  },
  async addReview(review: Partial<Review>): Promise<Review> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    return res.json();
  },
  async deleteReview(id: string): Promise<void> {
    await fetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' });
  },
 
  async uploadPhoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.url;
  }
};