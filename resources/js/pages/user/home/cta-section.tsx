import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
    return (
        <section className="mx-auto mb-4 w-full max-w-7xl px-4 sm:mb-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary-foreground px-8 py-16 sm:px-16 sm:py-24">
                <img 
                    src="/assets/images/circle_cta.png" 
                    alt="" 
                    className="hidden md:block pointer-events-none absolute top-1/2 right-[-15%] h-[150%] w-auto -translate-y-1/2 object-contain select-none"
                    draggable={false}
                />
                <div className="relative z-10 max-w-2xl">
                    <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                        Let's Get In Touch.
                    </h2>
                    <p className="mb-8 text-lg text-white/90 sm:text-xl">
                        Kami hadir untuk memudahkan proses belajar online Anda. Kami siap membantu Anda.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Button 
                            asChild 
                            size="lg"
                            className="rounded-full bg-black text-white hover:bg-black/90 px-8"
                        >
                            <Link href="https://wa.me/+6281252683108?text=Halo%20Admin%20Sekolah%20Pajak,%20saya%20ingin%20bertanya%20tentang%20Bootcamp%20online."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2">
                                Get in Touch
                                <span className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Link>
                        </Button>
                        <Button 
                            asChild 
                            size="lg"
                            className="rounded-full bg-black text-white hover:bg-black/90 px-8"
                        >
                            <Link href="/bootcamp" className="flex items-center gap-2">
                                Explore Our Bootcamp
                                <span className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}