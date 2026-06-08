import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Mail, Phone } from 'lucide-react';

export default function CtaSection() {
    return (
        <section className="mx-auto mb-4 w-full max-w-7xl px-4 sm:mb-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a1e5e] to-[#1a56db] px-8 py-12 sm:px-12 sm:py-8">
                {/* Three column layout */}
                <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-between">
                    {/* Left column - CTA Text */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="mb-4 font-av-estiana text-3xl font-bold text-white sm:text-3xl lg:text-4xl">
                            Let's Redefine
                            <br />
                            Profit Together
                        </h2>
                        <p className="mb-6 text-base text-white/80 sm:text-lg">
                            Connect with us to your
                            <br />
                            financial journey today.
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full border-2 bg-primary hover:bg-secondary hover:text-white"
                        >
                            <Link
                                href="https://wa.me/+6287775764475?text=Halo%20Admin%20Level%20Up%20Accounting,%20saya%20ingin%20bertanya%20tentang%20Bootcamp%20online."
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Contact Us
                            </Link>
                        </Button>
                    </div>

                    {/* Center column - Phone Image */}
                    <div className="flex-shrink-0 self-center md:self-end -mb-4 sm:-mb-8 md:-mb-12">
                        <img
                            src="/assets/images/phone.svg"
                            alt="Level Up Accounting Mobile App"
                            className="h-[200px] sm:h-[240px] md:h-[280px] w-auto object-contain lg:h-[320px]"
                            draggable={false}
                        />
                    </div>

                    {/* Right column - Address & Contact Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="mb-6">
                            <h3 className="mb-2 text-xl font-bold text-white">Adress</h3>
                            <p className="text-base leading-relaxed text-white/80">
                                Perumahan Permata Permadani, Blok B1.
                                <br />
                                Kel. Pendem Kec. Junrejo
                                <br />
                                Kota Batu, Jawa Timur 65324
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-3 text-xl font-bold text-white">Contact Info</h3>
                            <div className="flex flex-col items-center gap-2 md:items-start">
                                <a
                                    href="tel:087754764475"
                                    className="inline-flex items-center gap-3 text-base text-white/80 transition-colors hover:text-white"
                                >
                                    <Phone className="h-5 w-5 flex-shrink-0 text-white" />
                                    0877-7576-4475
                                </a>
                                <a
                                    href="mailto:levelupacc4@gmail.com"
                                    className="inline-flex items-center gap-3 text-base text-white/80 transition-colors hover:text-white"
                                >
                                    <Mail className="h-5 w-5 flex-shrink-0 text-white" />
                                    levelupacc4@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}