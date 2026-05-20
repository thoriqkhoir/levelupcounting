import { OtherItem, ProductItem, ServiceItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Instagram, Mail } from 'lucide-react';

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
        href: '/certification-programs',
    },
];

const serviceItems: ServiceItem[] = [
    {
        title: 'Pusat Bantuan',
        href: 'https://wa.me/+6287754764475',
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
        <footer className="relative rounded-t-3xl text-black">
            {/* Decorative blobs for continuity with CTA section */}
            <div className="pointer-events-none absolute -top-20 left-1/4 z-0 h-[350px] w-[350px] rounded-full bg-violet-400/10 blur-3xl" />
            <div className="pointer-events-none absolute top-10 right-0 z-0 h-[300px] w-[300px] rounded-full bg-pink-300/10 blur-3xl" />

            <div className="relative z-10">
                {/* Main Content */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
                    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                        {/* Brand Section - 5 columns */}
                        <div className="lg:col-span-5">
                            {/* Logo */}
                            <div className="mb-4">
                                <img src="/assets/images/logo-footer.svg" alt="Logo Level Up Accounting" className="block h-16 w-auto dark:hidden" />
                                <img
                                    src="/assets/images/logo-secondary2.png"
                                    alt="Logo Level Up Accounting"
                                    className="hidden h-10 w-auto dark:block"
                                />
                            </div>

                            {/* Tagline */}
                            <p className="mb-6 text-base font-semibold">Learn Without Limits Grow Without Boundaries</p>
                        </div>

                        {/* Links Section - 7 columns */}
                        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-4">
                            {/* Produk */}
                            <div>
                                <h4 className="mb-4 text-sm font-bold tracking-wider uppercase opacity-90">Produk</h4>
                                <ul className="space-y-3">
                                    {productItems.map((item) => (
                                        <li key={item.title}>
                                            <Link
                                                href={item.href}
                                                className="inline-block text-sm transition-all hover:translate-x-1 hover:opacity-70"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Layanan */}
                            <div>
                                <h4 className="mb-4 text-sm font-bold tracking-wider uppercase opacity-90">Layanan</h4>
                                <ul className="space-y-3">
                                    {serviceItems.map((item) => (
                                        <li key={item.title}>
                                            <a
                                                href={item.href}
                                                className="inline-block text-sm transition-all hover:translate-x-1 hover:opacity-70"
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
                                <h4 className="mb-4 text-sm font-bold tracking-wider uppercase opacity-90">Lainnya</h4>
                                <ul className="space-y-3">
                                    {otherItems.map((item) => (
                                        <li key={item.title}>
                                            <Link
                                                href={item.href}
                                                className="inline-block text-sm transition-all hover:translate-x-1 hover:opacity-70"
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 text-sm font-bold tracking-wider uppercase opacity-90">Sosial Media</h4>
                                <div className="flex items-center gap-3">
                                    <a href="mailto:levelupacc4@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
                                        <Mail className="h-5 w-5" />
                                    </a>
                                    <a href="https://wa.me/+6287754764475" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.tiktok.com/@levelup.accounting?"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="TikTok"
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.17a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.6z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="https://www.instagram.com/levelup.accounting/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                    >
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="relative z-0 mx-auto max-w-7xl border-t border-black">
                    <div className="mx-auto max-w-7xl px-4 py-6">
                        <div className="flex items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
                            <p className="text-sm opacity-70">&copy; {new Date().getFullYear()} LevelUpAccounting. All rights reserved.</p>
                        </div>
                    </div>
                </div>

                {/* Bottom spacing for mobile navigation */}
                <div className="h-20 lg:h-0" />
            </div>
        </footer>
    );
}
