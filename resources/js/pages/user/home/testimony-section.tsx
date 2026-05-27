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

  const [imagesState, setImagesState] = useState({
    active: [
      '/assets/images/lead1.png',
      '/assets/images/lead2.png',
      '/assets/images/lead3.png',
      '/assets/images/lead4.png',
      '/assets/images/lead5.png',
      '/assets/images/lead6.png',
      '/assets/images/lead7.png',
      '/assets/images/lead8.png',
      '/assets/images/lead9.png',
      '/assets/images/lead10.png',
      '/assets/images/lead11.png',
    ],
    unused: [
      '/assets/images/lead12.png',
      '/assets/images/lead13.png',
      '/assets/images/lead14.png',
      '/assets/images/lead15.png',
      '/assets/images/lead16.png',
      '/assets/images/lead17.png',
      '/assets/images/lead18.png',
      '/assets/images/lead19.png',
      '/assets/images/lead20.png',
      '/assets/images/lead21.png',
      '/assets/images/lead22.png',
      '/assets/images/lead23.png',
      '/assets/images/lead24.png',
      '/assets/images/lead25.png',
      '/assets/images/lead26.png',
      '/assets/images/lead27.png',
      '/assets/images/lead28.png',
      '/assets/images/lead29.png',
      '/assets/images/lead30.png',
      ...Array.from({ length: 11 }, (_, i) => `/assets/images/lead${i + 1}.svg`)
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setImagesState(prev => {
        const numToSwap = Math.floor(Math.random() * 2) + 2; // 2 to 3 photos
        
        // Shuffle and pick indices
        const activeIndices = [...Array(11).keys()].sort(() => 0.5 - Math.random()).slice(0, numToSwap);
        const unusedIndices = [...Array(prev.unused.length).keys()].sort(() => 0.5 - Math.random()).slice(0, numToSwap);
        
        const newActive = [...prev.active];
        const newUnused = [...prev.unused];
        
        for (let i = 0; i < numToSwap; i++) {
          const activeIdx = activeIndices[i];
          const unusedIdx = unusedIndices[i];
          const temp = newActive[activeIdx];
          newActive[activeIdx] = newUnused[unusedIdx];
          newUnused[unusedIdx] = temp;
        }
        
        return { active: newActive, unused: newUnused };
      });
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, []);

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
        <style>{`
          @keyframes imageFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-image-fade {
            animation: imageFadeIn 0.8s ease-out forwards;
          }
        `}</style>
        {/* Gallery Collage */}
        <div className="mb-12 flex w-full flex-nowrap items-center justify-center gap-2 overflow-hidden px-2 py-8 sm:gap-4 md:gap-5 lg:gap-6 sm:py-16">
          {/* Col 1 */}
          <div className="flex flex-col gap-2 sm:gap-4 -translate-y-2 sm:-translate-y-4">
            <div className="relative h-14 w-12 overflow-hidden rounded-lg bg-yellow-400 sm:h-32 sm:w-28 md:h-40 md:w-32 sm:rounded-2xl shadow-lg">
              <img key={imagesState.active[0]} src={imagesState.active[0]} alt="Testimonial" className="h-full w-full object-cover animate-image-fade" />
            </div>
            <img key={imagesState.active[1]} src={imagesState.active[1]} alt="Testimonial" className="h-12 w-12 rounded-lg object-cover sm:h-28 sm:w-28 md:h-32 md:w-32 sm:rounded-xl shadow-md animate-image-fade" />
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-2 sm:gap-4 translate-y-3 sm:translate-y-6">
            <img key={imagesState.active[2]} src={imagesState.active[2]} alt="Testimonial" className="h-16 w-12 rounded-lg object-cover sm:h-36 sm:w-28 md:h-44 md:w-32 sm:rounded-2xl shadow-md animate-image-fade" />
            <img key={imagesState.active[3]} src={imagesState.active[3]} alt="Testimonial" className="h-14 w-12 rounded-lg object-cover sm:h-32 sm:w-28 md:h-40 md:w-32 sm:rounded-2xl shadow-md animate-image-fade" />
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-2 sm:gap-4 -translate-y-1 sm:-translate-y-2">
            <div className="relative h-14 w-12 overflow-hidden rounded-lg bg-blue-500 sm:h-32 sm:w-32 md:h-40 md:w-40 sm:rounded-2xl shadow-lg">
              <img key={imagesState.active[4]} src={imagesState.active[4]} alt="Testimonial" className="h-full w-full object-cover animate-image-fade" />
            </div>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col gap-2 sm:gap-4 translate-y-[-0.5rem] sm:translate-y-[-1rem]">
            <img key={imagesState.active[5]} src={imagesState.active[5]} alt="Testimonial" className="h-14 w-12 rounded-lg object-cover sm:h-32 sm:w-32 md:h-36 md:w-36 sm:rounded-2xl shadow-md animate-image-fade" />
          </div>

          {/* Col 5 */}
          <div className="flex flex-col gap-2 sm:gap-4 translate-y-2 sm:translate-y-4">
            <div className="relative h-20 w-12 overflow-hidden rounded-lg bg-pink-300 sm:h-40 sm:w-32 md:h-48 md:w-36 sm:rounded-2xl shadow-lg">
              <img key={imagesState.active[6]} src={imagesState.active[6]} alt="Testimonial" className="h-full w-full object-cover animate-image-fade" />
            </div>
          </div>

          {/* Col 6 */}
          <div className="flex flex-col gap-2 sm:gap-4 translate-y-3 sm:translate-y-6">
            <img key={imagesState.active[7]} src={imagesState.active[7]} alt="Testimonial" className="h-14 w-14 rounded-lg object-cover sm:h-32 sm:w-32 md:h-36 md:w-36 sm:rounded-2xl shadow-md animate-image-fade" />
            <img key={imagesState.active[8]} src={imagesState.active[8]} alt="Testimonial" className="h-14 w-14 rounded-lg object-cover sm:h-32 sm:w-32 md:h-40 md:w-36 sm:rounded-2xl shadow-md animate-image-fade" />
          </div>

          {/* Col 7 */}
          <div className="flex flex-col gap-2 sm:gap-4 -translate-y-2 sm:-translate-y-4">
            <div className="relative h-14 w-12 overflow-hidden rounded-lg bg-yellow-400 sm:h-32 sm:w-28 md:h-40 md:w-32 sm:rounded-2xl shadow-lg">
              <img key={imagesState.active[9]} src={imagesState.active[9]} alt="Testimonial" className="h-full w-full object-cover animate-image-fade" />
            </div>
            <img key={imagesState.active[10]} src={imagesState.active[10]} alt="Testimonial" className="h-12 w-12 rounded-lg object-cover sm:h-28 sm:w-28 md:h-32 md:w-32 sm:rounded-xl shadow-md animate-image-fade" />
          </div>
        </div>

        {/* Text Headers */}
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
            ⭐ Testimonials
          </span>
        </div>
        <h2 className="font-av-estiana text-2xl font-extrabold dark:text-white md:text-3xl leading-tight">
          Trusted by leaders{' '}
          <span className="relative inline-block">
            <span className="relative z-10">from various industries</span>
            <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-secondary/20" />
          </span>
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-sm text-gray-600 dark:text-gray-400 md:text-base">
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
                className={`h-2 rounded-full transition-all ${(index % TOTAL_ITEMS) === idx
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