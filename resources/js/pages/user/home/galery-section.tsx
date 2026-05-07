import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface GalleryItem {
  id: number;
  title: string;
  image: string;
  size?: 'small' | 'medium' | 'large';
}

export default function GalerySection() {
  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: 'Pelatihan Coretax UIN Malang',
      image: '/assets/images/galery-1.jpg',
      size: 'small'
    },
    {
      id: 2,
      title: 'Pelatihan Coretax UIN Semarang',
      image: '/assets/images/galery-2.jpg',
      size: 'medium'
    },
    {
      id: 3,
      title: 'Pelatihan Coretax SMKN 1 Kota Malang',
      image: '/assets/images/galery-3.jpg',
      size: 'small'
    },
    {
      id: 4,
      title: 'Pelatihan Online',
      image: '/assets/images/galery-4.jpg',
      size: 'medium'
    },
    {
      id: 5,
      title: 'Pelatihan Online',
      image: '/assets/images/galery-5.jpg',
      size: 'large'
    },
    {
      id: 6,
      title: 'Pelatihan Online',
      image: '/assets/images/galery-6.jpg',
      size: 'small'
    },
  ];

  return (
  <section className="mx-auto mb-4 w-full max-w-7xl px-4 sm:mb-8">
    <div className="mx-auto text-center mb-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">Galeri Level Up Accounting</h2>
    </div>

    {/* Gallery Grid */}
    <div className="grid gap-4 grid-cols-1 md:grid-cols-[3fr_5fr_4fr] mb-4">
      <div className="group relative overflow-hidden rounded-lg shadow-lg">
        <img
          src={galleryItems[0].image}
          alt={galleryItems[0].title}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/30 group-hover:from-primary group-hover:via-30% group-hover:via-transparent group-hover:to-transparent transition-all duration-300 flex items-end p-4">
          <h3 className="text-white font-semibold text-lg">{galleryItems[0].title}</h3>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-lg shadow-lg">
        <img
          src={galleryItems[1].image}
          alt={galleryItems[1].title}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/30 group-hover:from-primary group-hover:via-30% group-hover:via-transparent group-hover:to-transparent transition-all duration-300 flex items-end p-4">
          <h3 className="text-white font-semibold text-lg">{galleryItems[1].title}</h3>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-lg shadow-lg">
        <img
          src={galleryItems[2].image}
          alt={galleryItems[2].title}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/30 group-hover:from-primary group-hover:via-30% group-hover:via-transparent group-hover:to-transparent transition-all duration-300 flex items-end p-4">
          <h3 className="text-white font-semibold text-lg">{galleryItems[2].title}</h3>
        </div>
      </div>
    </div>
    
    <div className="grid gap-4 grid-cols-1 md:grid-cols-[5fr_4fr_3fr]">
      <div className="group relative overflow-hidden rounded-lg shadow-lg">
        <img
          src={galleryItems[3].image}
          alt={galleryItems[3].title}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/30 group-hover:from-primary group-hover:via-30% group-hover:via-transparent group-hover:to-transparent transition-all duration-300 flex items-end p-4">
          <h3 className="text-white font-semibold text-lg">{galleryItems[3].title}</h3>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-lg shadow-lg">
        <img
          src={galleryItems[4].image}
          alt={galleryItems[4].title}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/30 group-hover:from-primary group-hover:via-30% group-hover:via-transparent group-hover:to-transparent transition-all duration-300 flex items-end p-4">
          <h3 className="text-white font-semibold text-lg">{galleryItems[4].title}</h3>
        </div>
      </div>
      <div className="group relative overflow-hidden rounded-lg shadow-lg">
        <img
          src={galleryItems[5].image}
          alt={galleryItems[5].title}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/30 group-hover:from-primary group-hover:via-30% group-hover:via-transparent group-hover:to-transparent transition-all duration-300 flex items-end p-4">
          <h3 className="text-white font-semibold text-lg">{galleryItems[5].title}</h3>
        </div>
      </div>
    </div>
  </section>
);
}
