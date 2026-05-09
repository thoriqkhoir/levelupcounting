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
      <div className="mx-auto text-center mb-10">
        {/* Gallery Collage */}
        <div className="mb-12 flex w-full flex-nowrap items-center justify-center gap-3 overflow-hidden px-2 sm:gap-4 md:gap-5 lg:gap-6">
          {/* Col 1 */}
          <div className="hidden lg:flex flex-col gap-3 sm:gap-4 -translate-y-4">
            <div className="relative h-24 w-20 overflow-hidden rounded-2xl bg-yellow-400 sm:h-32 sm:w-28 md:h-40 md:w-32 shadow-lg">
              <img src="https://i.pravatar.cc/150?img=32" alt="Testimonial" className="h-full w-full object-cover mix-blend-multiply opacity-90 grayscale" />
            </div>
            <img src="https://i.pravatar.cc/150?img=11" alt="Testimonial" className="h-20 w-20 rounded-xl object-cover sm:h-28 sm:w-28 md:h-32 md:w-32 shadow-md" />
          </div>

          {/* Col 2 */}
          <div className="hidden md:flex flex-col gap-3 sm:gap-4 translate-y-6">
            <img src="https://i.pravatar.cc/150?img=12" alt="Testimonial" className="h-28 w-20 rounded-2xl object-cover sm:h-36 sm:w-28 md:h-44 md:w-32 shadow-md" />
            <img src="https://i.pravatar.cc/150?img=33" alt="Testimonial" className="h-24 w-20 rounded-2xl object-cover sm:h-32 sm:w-28 md:h-40 md:w-32 shadow-md" />
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-3 sm:gap-4 -translate-y-2">
            <div className="relative h-24 w-20 overflow-hidden rounded-2xl bg-blue-500 sm:h-32 sm:w-32 md:h-40 md:w-40 shadow-lg">
              <img src="https://i.pravatar.cc/150?img=5" alt="Testimonial" className="h-full w-full object-cover mix-blend-screen opacity-90 grayscale" />
            </div>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-3 sm:gap-4 translate-y-[-1rem]">
            <img src="https://i.pravatar.cc/150?img=34" alt="Testimonial" className="h-24 w-20 rounded-2xl object-cover sm:h-32 sm:w-32 md:h-36 md:w-36 shadow-md" />
          </div>

          {/* Col 5 */}
          <div className="flex flex-col gap-3 sm:gap-4 translate-y-4">
            <div className="relative h-32 w-20 overflow-hidden rounded-2xl bg-pink-300 sm:h-40 sm:w-32 md:h-48 md:w-36 shadow-lg">
              <img src="https://i.pravatar.cc/150?img=9" alt="Testimonial" className="h-full w-full object-cover mix-blend-multiply opacity-80 grayscale" />
            </div>
          </div>

          {/* Col 6... */}
          <div className="hidden md:flex flex-col gap-3 sm:gap-4 translate-y-6">
            <img src="https://i.pravatar.cc/150?img=10" alt="Testimonial" className="h-24 w-24 rounded-2xl object-cover sm:h-32 sm:w-32 md:h-36 md:w-36 shadow-md" />
            <img src="https://i.pravatar.cc/150?img=33" alt="Testimonial" className="h-24 w-24 rounded-2xl object-cover sm:h-32 sm:w-32 md:h-40 md:w-36 shadow-md" />
          </div>

          <div className="hidden lg:flex flex-col gap-3 sm:gap-4 -translate-y-4">
            <div className="relative h-24 w-20 overflow-hidden rounded-2xl bg-yellow-400 sm:h-32 sm:w-28 md:h-40 md:w-32 shadow-lg">
              <img src="https://i.pravatar.cc/150?img=41" alt="Testimonial" className="h-28 w-24 rounded-2xl object-cover sm:h-36 sm:w-32 md:h-44 md:w-36 shadow-md" />
            </div>
            <img src="https://i.pravatar.cc/150?img=11" alt="Testimonial" className="h-20 w-20 rounded-xl object-cover sm:h-28 sm:w-28 md:h-32 md:w-32 shadow-md" />
          </div>

        </div>

        {/* Text Headers */}
        <div className='flex justify-center'>
          <h3 className="text-sm md:text-base bg-muted-foreground font-semibold mb-6 border px-5 py-1.5 rounded-full items-center text-white dark:text-white shadow-sm">
            Testimonials
          </h3>
        </div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-av-estiana dark:text-white leading-tight">Trusted by leaders</h2>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-av-estiana text-muted-foreground dark:text-white/70 leading-tight">from various industries</h2>
        <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Learn why professionals trust our solutions to complete their customer journeys.
        </p>
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