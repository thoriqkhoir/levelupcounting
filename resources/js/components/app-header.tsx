import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Album, BookText, BriefcaseBusiness, FileText, Home, MonitorPlay, Presentation, Search, User, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SearchCommand } from './search-command';

const serviceItems = [
    {
        title: 'Kelas Online',
        href: '/course',
        icon: BookText,
        description: 'Belajar dengan video pembelajaran terstruktur',
    },
    {
        title: 'Bootcamp',
        href: '/bootcamp',
        icon: Presentation,
        description: 'Program intensif dengan mentor profesional',
    },
    {
        title: 'Webinar',
        href: '/webinar',
        icon: MonitorPlay,
        description: 'Seminar online dengan berbagai topik up to date',
    },
];

const activeItemStyles = 'text-primary bg-primary/10 dark:text-white dark:bg-primary/50';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

function ListItem({
    title,
    children,
    href,
    icon: IconComponent,
}: {
    title: string;
    children: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
}) {
    const page = usePage<SharedData>();
    const isActive = page.url.startsWith(href);

    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className={cn(
                        'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none',
                        isActive && 'bg-primary/10 text-primary',
                    )}
                >
                    <div className="flex items-center gap-2">
                        {IconComponent && <Icon iconNode={IconComponent} className="h-4 w-4" />}
                        <div className="text-sm leading-none font-medium">{title}</div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const [searchOpen, setSearchOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    const isServicesActive = serviceItems.some((item) => page.url.startsWith(item.href)) || page.url.startsWith('/bundle');

    const isHomepage = page.url === '/' || page.url === '';

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setSearchOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <>
            {/* ===== MOBILE HEADER (visible below lg) ===== */}
            <div className="bg-background fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between px-4 shadow-sm lg:hidden">
                <Link href="/" className="flex items-center">
                    <img src="/assets/images/logo-primary.png" alt="LevelUp Accounting" className="w-32" />
                </Link>
                <div className="flex items-center gap-2">
                    {auth.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-9 rounded-full p-1">
                                    <Avatar className="size-7 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.photo_url ? (auth.user.photo_url.startsWith('http') ? auth.user.photo_url : `/storage/${auth.user.photo_url}`) : (auth.user.avatar || undefined)} alt={auth.user.name} className="object-cover" />
                                        <AvatarFallback className="bg-primary/10 text-primary rounded-full text-xs">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="default" asChild className="rounded-full px-6 py-1.5 text-sm">
                            <Link href={route('login')}>Login</Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* ===== DESKTOP HEADER (visible at lg and above) ===== */}
            <div className="fixed top-0 right-0 left-0 z-40 hidden lg:flex">

                <div className="absolute inset-0 flex">
                    <div className="bg-background" style={{ flex: '0 0 calc(50% - 10px)' }} />
                    <div className="bg-primary flex-1" />
                </div>

                <div className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 pr-82 bg-background">
                        <Link href="/" className="flex items-center space-x-2">
                            <img src="/assets/images/logo-primary.png" alt="LevelUp Accounting" className="block w-40" />
                        </Link>
                    </div>

                    {/* Navigation Section */}
                    <div className="relative flex h-full flex-1 items-center justify-between bg-primary pl-8">
                        <div className="pointer-events-none absolute -left-2 top-0 h-full w-40 text-background">
                            <svg
                                viewBox="0 0 160 80"
                                preserveAspectRatio="none"
                                className="h-full w-full"
                                aria-hidden="true"
                            >
                                <path
                                    d="M0,0 H90 C70,0 45,80 0,80 Z"
                                    fill="currentColor"
                                    transform="scale(1,-1) translate(0,-80)"
                                />
                            </svg>
                        </div>

                        <NavigationMenu className="relative z-10 ml-16 flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {/* Home */}
                                <NavigationMenuItem className="relative flex h-full items-center">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/"
                                            className={cn(
                                                'rounded-full px-5 py-2 text-sm font-semibold transition-colors border border-white/50',
                                                isHomepage ? 'bg-white text-primary' : 'text-white hover:bg-white/20',
                                            )}
                                        >
                                            Home
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                {/* About */}
                                <NavigationMenuItem className="relative flex h-full items-center">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/about"
                                            className={cn(
                                                'rounded-full px-5 py-2 text-sm font-semibold transition-colors border border-white/50',
                                                page.url.startsWith('/about') ? 'bg-white text-primary' : 'text-white hover:bg-white/20',
                                            )}
                                        >
                                            About
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                {/* Program Mega Menu */}
                                <NavigationMenuItem className="relative flex h-full items-center">
                                    <NavigationMenuTrigger
                                        className={cn(
                                            'rounded-full px-5 py-2 text-sm font-semibold transition-colors border border-white/50 bg-transparent',
                                            isServicesActive ? 'bg-white !text-primary' : 'text-white hover:bg-white/20 hover:text-white',
                                        )}
                                    >
                                        Program
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-[.75fr_1fr]">
                                            <li className="row-span-3">
                                                <ListItem href="/course" title="Kelas Online" icon={BookText}>
                                                    Belajar dengan video pembelajaran terstruktur dan materi lengkap
                                                </ListItem>
                                                <ListItem href="/bootcamp" title="Bootcamp" icon={Presentation}>
                                                    Program intensif dengan mentor profesional dan project-based learning
                                                </ListItem>
                                                <ListItem href="/webinar" title="Webinar" icon={MonitorPlay}>
                                                    Seminar online dengan topik terkini dan expert speaker
                                                </ListItem>
                                            </li>
                                            <li className="row-span-3 relative overflow-hidden">
                                                <img
                                                    src="/assets/images/circle_cta.png"
                                                    alt=""
                                                    className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 object-contain select-none"
                                                    draggable={false}
                                                    style={{ zIndex: 1 }}
                                                />
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href="/bundle"
                                                        className={cn(
                                                            'from-primary-foreground to-primary flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-hidden transition-all duration-200 select-none hover:shadow-md',
                                                            page.url.startsWith('/bundle') && 'ring-primary ring-2',
                                                        )}
                                                    >
                                                        <Icon iconNode={Album} className="text-white mb-2 h-8 w-8" />
                                                        <div className="mb-2 text-lg text-white font-medium">Paket Bundling</div>
                                                        <p className="text-white text-sm leading-tight">
                                                            Hemat lebih banyak dengan paket bundling berbagai produk edukasi kami
                                                        </p>
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>

                                {/* Sertifikasi */}
                                <NavigationMenuItem className="relative flex h-full items-center">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/certification"
                                            className={cn(
                                                'rounded-full px-5 py-2 text-sm font-semibold transition-colors border border-white/50',
                                                page.url.startsWith('/certification') ? 'bg-white text-primary' : 'text-white hover:bg-white/20',
                                            )}
                                        >
                                            Sertifikasi
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                {/* Artikel */}
                                <NavigationMenuItem className="relative flex h-full items-center">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/article"
                                            className={cn(
                                                'rounded-full px-5 py-2 text-sm font-semibold transition-colors border border-white/50',
                                                page.url.startsWith('/article') ? 'bg-white text-primary' : 'text-white hover:bg-white/20',
                                            )}
                                        >
                                            Artikel
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        <div className="relative z-10 flex items-center">
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="size-10 rounded-full p-1">
                                            <Avatar className="size-8 overflow-hidden rounded-full">
                                                <AvatarImage src={auth.user.photo_url ? (auth.user.photo_url.startsWith('http') ? auth.user.photo_url : `/storage/${auth.user.photo_url}`) : (auth.user.avatar || undefined)} alt={auth.user.name} className="object-cover" />
                                                <AvatarFallback className="bg-background text-primary rounded-lg dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(auth.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button variant="default" asChild className="bg-secondary hover:bg-secondary/90 rounded-full px-8 py-2 text-base">
                                    <Link href={route('login')}>Login</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== MOBILE BOTTOM NAVIGATION DOCK ===== */}
            <div className="fixed right-0 bottom-0 left-0 z-50 lg:hidden">
                <div className="bg-background/95 border-border border-t pb-2 shadow-lg backdrop-blur-md">
                    <div className={`grid gap-1 px-2 py-2 ${auth.user ? 'grid-cols-5' : 'grid-cols-4'}`}>
                        <Link
                            href="/"
                            className={cn(
                                'flex flex-col items-center justify-center rounded-lg px-2 py-3 transition-colors duration-200',
                                page.url === '/' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                            )}
                        >
                            <Home className="mb-1 h-5 w-6" />
                            <span className="text-center text-xs leading-none font-medium">Beranda</span>
                        </Link>

                        <Popover open={servicesOpen} onOpenChange={setServicesOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    className={cn(
                                        'flex flex-col items-center justify-center rounded-lg px-2 py-3 transition-colors duration-200',
                                        isServicesActive
                                            ? 'text-primary bg-primary/10'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                                    )}
                                >
                                    <Album className="mb-1 h-5 w-6" />
                                    <span className="text-center text-xs leading-none font-medium">Layanan</span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent side="top" align="center" className="mb-2 w-80 p-3" sideOffset={8}>
                                <div className="space-y-1">
                                    <h4 className="mb-3 px-2 text-sm font-semibold">Layanan Kami</h4>
                                    {serviceItems.map((service) => {
                                        const isActive = page.url.startsWith(service.href);
                                        return (
                                            <Link
                                                key={service.href}
                                                href={service.href}
                                                onClick={() => setServicesOpen(false)}
                                                className={cn(
                                                    'flex items-start gap-3 rounded-lg p-3 transition-colors duration-200',
                                                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 hover:text-foreground',
                                                )}
                                            >
                                                <Icon
                                                    iconNode={service.icon}
                                                    className={cn(
                                                        'mt-0.5 h-5 w-5 flex-shrink-0',
                                                        isActive ? 'text-primary' : 'text-muted-foreground',
                                                    )}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="mb-1 text-sm leading-none font-medium">{service.title}</p>
                                                    <p className="text-muted-foreground line-clamp-2 text-xs">{service.description}</p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                    {/* Bundling di Mobile */}
                                    <Link
                                        href="/bundle"
                                        onClick={() => setServicesOpen(false)}
                                        className={cn(
                                            'flex items-start gap-3 rounded-lg p-3 transition-colors duration-200',
                                            page.url.startsWith('/bundle') ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50 hover:text-foreground',
                                        )}
                                    >
                                        <Icon
                                            iconNode={Album}
                                            className={cn(
                                                'mt-0.5 h-5 w-5 flex-shrink-0',
                                                page.url.startsWith('/bundle') ? 'text-primary' : 'text-muted-foreground',
                                            )}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="mb-1 text-sm leading-none font-medium">Paket Bundling</p>
                                            <p className="text-muted-foreground line-clamp-2 text-xs">
                                                Paket bundling dengan berbagai produk edukasi
                                            </p>
                                        </div>
                                    </Link>
                                    {/* Sertifikasi di Mobile */}
                                    <Link
                                        href="/certification"
                                        onClick={() => setServicesOpen(false)}
                                        className={cn(
                                            'flex items-start gap-3 rounded-lg p-3 transition-colors duration-200',
                                            page.url.startsWith('/certification')
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-muted/50 hover:text-foreground',
                                        )}
                                    >
                                        <Icon
                                            iconNode={BriefcaseBusiness}
                                            className={cn(
                                                'mt-0.5 h-5 w-5 flex-shrink-0',
                                                page.url.startsWith('/certification') ? 'text-primary' : 'text-muted-foreground',
                                            )}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="mb-1 text-sm leading-none font-medium">Sertifikasi</p>
                                            <p className="text-muted-foreground line-clamp-2 text-xs">
                                                Tingkatkan kredibilitas dengan sertifikasi profesional
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Link
                            href="/article"
                            className={cn(
                                'flex flex-col items-center justify-center rounded-lg px-2 py-3 transition-colors duration-200',
                                page.url.startsWith('/article')
                                    ? 'text-primary bg-primary/10'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                            )}
                        >
                            <FileText className="mb-1 h-5 w-6" />
                            <span className="text-center text-xs leading-none font-medium">Artikel</span>
                        </Link>

                        <Link
                            href="/about"
                            className={cn(
                                'flex flex-col items-center justify-center rounded-lg px-2 py-3 transition-colors duration-200',
                                page.url.startsWith('/about')
                                    ? 'text-primary bg-primary/10'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                            )}
                        >
                            <Info className="mb-1 h-5 w-6" />
                            <span className="text-center text-xs leading-none font-medium">Tentang</span>
                        </Link>

                        {auth.user && (
                            <Link
                                href="/profile"
                                className={cn(
                                    'flex flex-col items-center justify-center rounded-lg px-2 py-3 transition-colors duration-200',
                                    page.url.startsWith('/profile')
                                        ? 'text-primary bg-primary/10'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                                )}
                            >
                                <User className="mb-1 h-5 w-6" />
                                <span className="text-center text-xs leading-none font-medium">Profil</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

            {breadcrumbs.length > 1 && (
                <div className="border-sidebar-border/70 flex w-full border-b">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
