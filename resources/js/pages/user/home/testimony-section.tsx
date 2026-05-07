import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselIndicator, CarouselItem, CarouselNavigation } from '@/components/ui/carousel';
import { Quote } from 'lucide-react';

export default function TestimonySection() {
  const testimonies = [
    {
      name: "Nihayatul Maulasari",
      role: "Mentor Akuntan",
      avatar: "/assets/images/mentor-dummy.jpg",
      text: "Saya sangat terbantu dengan materi yang disampaikan di Level Up Accounting. Instruktur yang berpengalaman dan metode pembelajaran yang interaktif membuat saya lebih memahami konsep perpajakan dengan mudah."
    },
    {
      name: "Budi Santoso",
      role: "Konsultan Pajak",
      avatar: "/assets/images/mentor-dummy.jpg",
      text: "Program pelatihan yang sangat membantu dalam pengembangan karir saya di bidang perpajakan. Materi yang diberikan sangat applicable dan mentor sangat berpengalaman."
    },
    {
      name: "Rina Kartika",
      role: "Tax Specialist",
      avatar: "/assets/images/mentor-dummy.jpg",
      text: "Level Up Accounting memberikan pembelajaran yang komprehensif dan mudah dipahami. Sangat recommended untuk yang ingin mendalami ilmu perpajakan secara profesional."
    },
    {
      name: "Ahmad Rizky",
      role: "Financial Advisor",
      avatar: "/assets/images/mentor-dummy.jpg",
      text: "Kualitas pengajaran yang luar biasa dengan praktik langsung yang sangat membantu pemahaman. Investasi terbaik untuk karir di bidang keuangan dan perpajakan."
    },
    {
      name: "Maya Sari",
      role: "Accounting Manager",
      avatar: "/assets/images/mentor-dummy.jpg",
      text: "Instruktur yang profesional dan materi yang up to date dengan regulasi terbaru. Sangat puas dengan hasil pembelajaran yang didapat dari Level Up Accounting."
    },
  ];

  const [index, setIndex] = useState(0);
  const TOTAL_ITEMS = testimonies.length;

  // Create infinite loop by duplicating testimonies array
  const infiniteTestimonies = [...testimonies, ...testimonies, ...testimonies];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = prev + 1;
        // Reset to middle section when reaching end
        if (next >= TOTAL_ITEMS * 2) {
          return TOTAL_ITEMS;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [TOTAL_ITEMS]);

  // Start from middle section for seamless loop
  useEffect(() => {
    setIndex(TOTAL_ITEMS);
  }, [TOTAL_ITEMS]);

  const handleIndexChange = (newIndex: number) => {
    // Handle wrap-around for manual navigation
    if (newIndex < 0) {
      setIndex(TOTAL_ITEMS * 2 - 1);
    } else if (newIndex >= TOTAL_ITEMS * 3) {
      setIndex(TOTAL_ITEMS);
    } else {
      setIndex(newIndex);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16">
      <div className="mx-auto text-center mb-4">
        <div className='flex justify-center'>
        <h3 className="text-lg md:text-xl bg-muted-foreground font-av-estiana mb-6 border w-32 rounded-full py-1 items-center text-white dark:text-white">Testimoni</h3>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold font-av-estiana dark:text-white">Trusted by leaders </h2>
        <h2 className="text-2xl md:text-3xl font-semibold font-av-estiana text-muted-foreground dark:text-white">From Various Industries </h2>
      </div>
      
      <Carousel index={index} onIndexChange={handleIndexChange} disableDrag className="relative">
        <CarouselContent>
          {infiniteTestimonies.map((testimony, idx) => (
            <CarouselItem key={`testimony-${idx}`} className="px-4 md:basis-1/2 lg:basis-1/3 group  ">
              <div className="flex justify-center py-6">
                <div className="bg-card rounded-2xl p-8 w-full flex flex-col min-h-[350px] transition-all duration-300 group hover:-translate-y-2 hover:scale-105 hover:ring-2 hover:ring-primary/40">
                  {/* Quote Icon */}
                  <Quote className="h-10 w-10 text-primary mb-4" strokeWidth={3} />
                  
                  {/* Testimony Text */}
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 text-justify flex-grow line-clamp-6">
                    {testimony.text}
                  </p>
                  
                  {/* Separator */}
                  <div className="w-full h-0.5 bg-primary/80 mb-6" />
                  
                  {/* Profile */}
                  <div className="flex items-center gap-3">
                    <img
                      src={testimony.avatar}
                      alt={testimony.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"%3E%3Ccircle cx="12" cy="8" r="4"/%3E%3Cpath d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/%3E%3C/svg%3E';
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{testimony.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimony.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation />
        <div className="mx-auto max-w-7xl px-4 mt-8">
          {/* Custom Indicator - only show original count */}
          <div className="flex justify-center gap-2">
            {testimonies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(TOTAL_ITEMS + idx)}
                className={`h-2 rounded-full transition-all ${
                  (index % TOTAL_ITEMS) === idx
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-primary/30 hover:bg-primary/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </Carousel>
    </section>
  );
}