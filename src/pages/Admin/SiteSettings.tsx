import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Image as ImageIcon, Save, Check, Upload, Loader2 } from 'lucide-react';

const SETTINGS_KEY = 'aahar_site_settings';

export interface SiteSettingsData {
  address: string;
  phone: string;
  email: string;
  hours: string;
  heroImageUrl: string;
}

export function getSettings(): SiteSettingsData {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    address: '123 Pizza Lane, Foodie City',
    phone: '(555) 123-4567',
    email: 'hello@aaharpizza.com',
    hours: 'Open 11 AM - 11 PM',
    heroImageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000',
  };
}

export default function SiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsData>(getSettings());
  const [saved, setSaved] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setSettings(s => ({ ...s, heroImageUrl: base64 }));
      setPreviewUrl(base64);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const fields = [
    { key: 'address', label: 'Address', icon: MapPin, placeholder: '123 Pizza Lane, Foodie City' },
    { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '(555) 123-4567' },
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'hello@aaharpizza.com' },
    { key: 'hours', label: 'Opening Hours', icon: Clock, placeholder: 'Open 11 AM - 11 PM' },
  ] as const;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-brand-red text-white font-bold rounded-xl flex items-center gap-2 hover:bg-red-900 transition-all shadow-lg shadow-brand-red/20"
        >
          {saved ? <><Check className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Changes</>}
        </button>
      </div>

      {/* Hero Image */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
          Main Website Photo (Hero Image)
        </label>
        <div className="relative rounded-3xl overflow-hidden border-2 border-dashed border-stone-200 hover:border-brand-red transition-colors cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}>
          <img
            src={previewUrl || settings.heroImageUrl}
            alt="Hero"
            className="w-full h-56 object-cover group-hover:brightness-75 transition-all"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-2">
            {isUploading
              ? <Loader2 className="w-8 h-8 text-white animate-spin" />
              : <>
                  <Upload className="w-8 h-8 text-white" />
                  <span className="text-white text-sm font-bold">Click to change photo</span>
                </>
            }
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <p className="text-xs text-stone-400">This photo appears as the big background image on the home page.</p>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5" /> {label}
            </label>
            <input
              type="text"
              value={settings[key]}
              onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full px-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-brand-red outline-none text-sm transition-all"
            />
          </div>
        ))}
      </div>

      <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 text-sm text-stone-500">
        💡 Changes are saved to this browser. They will show on the Home page and Footer immediately after saving.
      </div>
    </div>
  );
}
