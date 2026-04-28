import { OtherItem, ProductItem, ServiceItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const productItems: ProductItem[] = [
    {
        title: 'Kelas Online',
        href: '/course',
    },
    {
        title: 'Bootcamp',
        href: '/bootcamp',
    },
    // {
    //     title: 'Webinar',
    //     href: '/webinar',
    // },
    {
        title: 'Bundling',
        href: '/bundle',
    },
    {
        title: 'Sertifikasi',
        href: '/certification',
    },
];

const serviceItems: ServiceItem[] = [
    {
        title: 'Pusat Bantuan',
        href: 'https://wa.me/+6281252683108',
    },
];

const otherItems: OtherItem[] = [
    {
        title: 'Artikel & Blog',
        href: '/article',
    },
    {
        title: 'Syarat & Ketentuan',
        href: '/terms-and-conditions',
    },
    {
        title: 'Kebijakan Privasi',
        href: '/privacy-policy',
    },
];

export default function AppFooter() {
    return (
        <footer className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-primary to-primary-foreground text-black">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            <div className="absolute left-0 bottom-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/5 blur-3xl" />

            {/* Footer Image - Bottom Right */}
            <img 
                src="/assets/images/footer.png" 
                alt="Footer Decoration" 
                className="absolute bottom-0 right-0 hidden h-64 w-auto object-contain lg:block lg:h-80 z-20"
            />

            <div className="relative">
                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
                    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                        {/* Brand Section - 5 columns */}
                        <div className="lg:col-span-5">
                            {/* Logo */}
                            <div className="mb-4">
                                <img 
                                    src="/assets/images/logo-primary2.png" 
                                    alt="Logo Sekolah Pajak" 
                                    className="block h-16 w-auto dark:hidden" 
                                />
                                <img 
                                    src="/assets/images/logo-secondary2.png" 
                                    alt="Logo Sekolah Pajak" 
                                    className="hidden h-10 w-auto dark:block" 
                                />
                            </div>

                            {/* Tagline */}
                            <p className="mb-6 text-base font-semibold">
                                Pay Tax With More Confidence 👌
                            </p>

                            {/* Company Info */}
                            <div className="mb-6 space-y-4">
                                <h5 className="font-bold text-lg">Biinspira Group</h5>
                                
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 opacity-70" />
                                        <p className="leading-relaxed">
                                            Perumahan Permata Permadani, Blok B1.<br />
                                            Kel. Pendem Kec. Junrejo<br />
                                            Kota Batu, Jawa Timur 65324
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 opacity-70" />
                                        <a 
                                            href="https://wa.me/6281252683108?text=Halo%20Admin%20Sekolah%20Pajak,%20saya%20ingin%20bertanya%20tentang%20program%20pelatihan."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="transition-opacity hover:opacity-70"
                                        >
                                            +62 812-5268-3108
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h4 className="mb-4 font-semibold">Ikuti Kami</h4>
                                <div className="flex items-center gap-3">
                                    <a 
                                        href="https://www.instagram.com/sekolahpajak.id/" 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/10 backdrop-blur-sm transition-all hover:bg-black/20 hover:scale-110"
                                        aria-label="Instagram"
                                    >
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                    <a 
                                        href="https://www.linkedin.com/company/sekolahpajak/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/10 backdrop-blur-sm transition-all hover:bg-black/20 hover:scale-110"
                                        aria-label="LinkedIn"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                </div>
                                <p className="mt-4 text-xs opacity-70">
                                    Dapatkan update terbaru, tips, dan konten menarik seputar perpajakan.
                                </p>
                            </div>
                        </div>

                        {/* Links Section - 7 columns */}
                        <div className="grid gap-8 sm:grid-cols-3 lg:col-span-7">
                            {/* Produk */}
                            <div>
                                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-90">
                                    Produk
                                </h4>
                                <ul className="space-y-3">
                                    {productItems.map((item) => (
                                        <li key={item.title}>
                                            <Link 
                                                href={item.href} 
                                                className="text-sm transition-all hover:translate-x-1 hover:opacity-70 inline-block"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Layanan */}
                            <div>
                                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-90">
                                    Layanan
                                </h4>
                                <ul className="space-y-3">
                                    {serviceItems.map((item) => (
                                        <li key={item.title}>
                                            <a 
                                                href={item.href} 
                                                className="text-sm transition-all hover:translate-x-1 hover:opacity-70 inline-block" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                {item.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Lainnya */}
                            <div>
                                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider opacity-90">
                                    Lainnya
                                </h4>
                                <ul className="space-y-3">
                                    {otherItems.map((item) => (
                                        <li key={item.title}>
                                            <Link 
                                                href={item.href} 
                                                className="text-sm transition-all hover:translate-x-1 hover:opacity-70 inline-block"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-black/10 relative z-0">
                    <div className="mx-auto max-w-7xl px-4 py-6">
                        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                            <p className="text-sm opacity-70">
                                &copy; {new Date().getFullYear()} Biinspira Group. All rights reserved.
                            </p>
                            <div className="flex items-center gap-2 text-xs opacity-60">
                                <span>Made with</span>
                                <span className="text-red-600">❤️</span>
                                <span>By Sekolah Pajak</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom spacing for mobile navigation */}
                <div className="h-20 lg:h-0" />
            </div>
        </footer>
    );
}