import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Pizza, ChevronRight, Star, Clock, MapPin } from 'lucide-react';
import { getSettings } from './Admin/SiteSettings';

export default function Home() {
  const settings = getSettings();

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={settings.heroImageUrl}
            alt="Delicious Pizza"
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Aahar Pizza <br />
              <span className="text-brand-yellow">Parlour</span>
            </h1>
            <p className="text-lg text-stone-200 leading-relaxed">
              Experience the perfect blend of crispy crust, rich tomato sauce,
              and premium toppings. Handcrafted with love since 2010.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/menu" className="px-8 py-4 bg-brand-red hover:bg-red-900 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-brand-red/20">
                Explore Menu <ChevronRight className="w-5 h-5" />
              </Link>
              <Link to="/gallery" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-xl transition-all">
                View Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Pizza, title: "Fresh Ingredients", desc: "We source our vegetables and meats daily from local organic farms." },
            { icon: Clock, title: "Fast Delivery", desc: "Hot and fresh pizza delivered to your doorstep within 30 minutes." },
            { icon: Star, title: "Award Winning", desc: "Voted the best pizza parlour in the city for three consecutive years." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-brand-cream rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-red transition-colors">
                <feature.icon className="w-7 h-7 text-brand-red group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-stone-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-yellow/10 rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 border border-brand-yellow/20">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-4xl font-bold tracking-tight">Your Opinion Matters</h2>
            <p className="text-stone-600 text-lg">
              We strive for perfection in every slice. Tell us about your experience
              and help us make Aahar Pizza even better.
            </p>
            <Link to="/review" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red text-white font-bold rounded-2xl hover:bg-red-900 transition-all shadow-lg shadow-brand-red/20">
              Leave a Review <Star className="w-5 h-5 fill-white" />
            </Link>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-32 bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-center items-center text-center">
                <Star className="w-6 h-6 text-brand-yellow fill-brand-yellow mb-2" />
                <span className="text-2xl font-bold">4.9/5</span>
                <span className="text-[10px] text-stone-400 uppercase font-bold">Average Rating</span>
              </div>
              <div className="h-48 bg-stone-900 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1574129624864-387bb975583e?auto=format&fit=crop&q=80&w=400" alt="Happy Customer" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-48 bg-orange-200 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=400" alt="Pizza Party" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="h-32 bg-white rounded-2xl p-4 shadow-sm flex flex-col justify-center items-center text-center">
                <span className="text-2xl font-bold">10k+</span>
                <span className="text-[10px] text-stone-400 uppercase font-bold">Happy Foodies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-stone-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
            <img src="https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=1000" alt="Pizza Background" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="relative z-10 max-w-xl space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Ready to taste the <br />
              <span className="text-brand-yellow">Best Pizza</span> in Town?
            </h2>
            <p className="text-stone-400 text-lg">Visit us today or order online for a truly unforgettable dining experience.</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 text-white">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                <span className="text-sm font-medium">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-yellow flex-shrink-0" />
                <span className="text-sm font-medium">{settings.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
