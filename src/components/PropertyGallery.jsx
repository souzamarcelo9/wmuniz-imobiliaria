import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PropertyGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Imagem Principal */}
      <div className="md:col-span-3 h-[500px] overflow-hidden rounded-3xl bg-gray-200">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[500px] no-scrollbar">
        {images.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`relative flex-shrink-0 w-24 h-24 md:w-full md:h-32 rounded-2xl overflow-hidden border-4 transition-all ${
              selectedImage === img ? 'border-amber-500' : 'border-transparent'
            }`}
          >
            <img src={img} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}