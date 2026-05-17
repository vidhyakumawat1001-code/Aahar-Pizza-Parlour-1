import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu as MenuIcon, Image as ImageIcon, MessageSquare, LayoutDashboard, ChevronRight, Settings } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import MenuManager from './MenuManager';
import GalleryManager from './GalleryManager';
import ReviewManager from './ReviewManager';
import SiteSettings from './SiteSettings';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminDashboard() {
  const location = useLocation();

  const sidebarLinks = [
    { name: 'Menu Items', path: '/admin/menu', icon: MenuIcon },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-2">
          <div className="p-4 bg-brand-red rounded-2xl text-white mb-6">
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-4 h-4 text-brand-yellow" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-200">Dashboard</span>
            </div>
            <h2 className="text-lg font-bold">Admin Panel</h2>
          </div>

          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl font-bold transition-all group",
                location.pathname === link.path
                  ? "bg-brand-red text-white shadow-lg shadow-brand-red/20"
                  : "bg-white text-stone-600 hover:bg-red-50 hover:text-brand-red border border-stone-100"
              )}
            >
              <div className="flex items-center gap-3">
                <link.icon className="w-5 h-5" />
                {link.name}
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform group-hover:translate-x-1",
                location.pathname === link.path ? "opacity-100" : "opacity-0"
              )} />
            </Link>
          ))}
        </aside>

        <main className="flex-1 min-h-[60vh] bg-white rounded-[2.5rem] border border-stone-100 shadow-sm p-8 md:p-12">
          <Routes>
            <Route path="/" element={<WelcomeAdmin />} />
            <Route path="/menu" element={<MenuManager />} />
            <Route path="/gallery" element={<GalleryManager />} />
            <Route path="/reviews" element={<ReviewManager />} />
            <Route path="/settings" element={<SiteSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function WelcomeAdmin() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-12">
      <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center">
        <LayoutDashboard className="w-12 h-12 text-brand-red" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Welcome back, Admin!</h2>
        <p className="text-stone-500 max-w-md">Manage your restaurant's presence with these quick actions.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <Link to="/admin/menu" className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group">
          <div className="p-3 bg-brand-cream rounded-2xl group-hover:bg-brand-red transition-colors">
            <MenuIcon className="w-6 h-6 text-brand-red group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold text-stone-700">Add Menu Item</span>
        </Link>
        <Link to="/admin/gallery" className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group">
          <div className="p-3 bg-brand-cream rounded-2xl group-hover:bg-brand-yellow transition-colors">
            <ImageIcon className="w-6 h-6 text-brand-yellow group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold text-stone-700">Upload Photo</span>
        </Link>
        <Link to="/admin/settings" className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group">
          <div className="p-3 bg-brand-cream rounded-2xl group-hover:bg-stone-800 transition-colors">
            <Settings className="w-6 h-6 text-stone-600 group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold text-stone-700">Site Settings</span>
        </Link>
        <Link to="/admin/reviews" className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 group">
          <div className="p-3 bg-brand-cream rounded-2xl group-hover:bg-orange-400 transition-colors">
            <MessageSquare className="w-6 h-6 text-orange-400 group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold text-stone-700">View Reviews</span>
        </Link>
      </div>
    </div>
  );
}
