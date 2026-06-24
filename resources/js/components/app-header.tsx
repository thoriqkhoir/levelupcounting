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
import {
    Album,
    Award,
    BadgeCheck,
    BookText,
    BriefcaseBusiness,
    FileText,
    Home,
    Info,
    MonitorPlay,
    Presentation,
    Search,
    Sparkles,
    TrendingUp,
    User,
    Users,
} from 'lucide-react';
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
    iconBg,
    iconColor,
    badge,
    inverted,
}: {
    title: string;
    children: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    iconBg?: string;
    iconColor?: string;
    badge?: string;
    inverted?: boolean;
}) {
    const page = usePage<SharedData>();
    const isActive = page.url.startsWith(href);

    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className={cn(
                        'group flex items-start gap-4 rounded-xl p-3.5 no-underline outline-hidden transition-all duration-200 select-none hover:shadow-sm',
                        inverted
                            ? isActive
                                ? 'bg-white/20'
                                : 'hover:bg-white/10'
                            : isActive
                              ? 'bg-primary/8 ring-primary/20 ring-1'
                              : 'hover:bg-gray-50 dark:hover:bg-white/5',
                        
                    )}
                >
                    {IconComponent && (
                        <div
                            className={cn(
                                'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110',
                                iconBg || 'bg-primary/10',
                            )}
                        >
                            <IconComponent className={cn('h-5 w-5', iconColor || 'text-primary')} />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    'text-sm leading-none font-semibold transition-colors',
                                    inverted ? 'text-white' : isActive ? 'text-primary' : 'text-foreground group-hover:text-primary',
                                )}
                            >
                                {title}
                            </div>
                            {badge && (
                                <span
                                    className={cn(
                                        'rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase',
                                        inverted ? 'bg-white/20 text-white' : 'bg-secondary/15 text-secondary',
                                    )}
                                >
                                    {badge}
                                </span>
                            )}
                        </div>
                        <p className={cn('mt-1.5 line-clamp-2 text-xs leading-snug', inverted ? 'text-white/70' : 'text-muted-foreground')}>
                            {children}
                        </p>
                    </div>
                    <div
                        className={cn(
                            'flex-shrink-0 self-center opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100',
                        )}
                    >
                        <svg
                            className={cn('h-4 w-4', inverted ? 'text-white/80' : 'text-primary')}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
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
                                        <AvatarImage
                                            src={
                                                auth.user.photo_url
                                                    ? auth.user.photo_url.startsWith('http')
                                                        ? auth.user.photo_url
                                                        : `/storage/${auth.user.photo_url}`
                                                    : auth.user.avatar || undefined
                                            }
                                            alt={auth.user.name}
                                            className="object-cover"
                                        />
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
                    <div className="bg-background flex-shrink-0 pr-82">
                        <Link href="/" className="flex items-center space-x-2">
                            <img src="/assets/images/logo-primary.png" alt="LevelUp Accounting" className="block w-40" />
                        </Link>
                    </div>
            

                    {/* Navigation Section */}
                    <div className="bg-primary relative flex h-full flex-1 items-center justify-between pl-8">
                        <div className="text-background pointer-events-none absolute top-0 -left-2 h-full w-40">
                            <svg viewBox="0 0 160 80" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
                                <path d="M0,0 H90 C70,0 45,80 0,80 Z" fill="currentColor" transform="scale(1,-1) translate(0,-80)" />
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
                                                'rounded-full border border-white/50 px-5 py-2 text-sm font-semibold transition-colors',
                                                isHomepage ? 'text-primary bg-white' : 'text-white hover:bg-white/20',
                                                
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
                                                'rounded-full border border-white/50 px-5 py-2 text-sm font-semibold transition-colors',
                                                page.url.startsWith('/about') ? 'text-primary bg-white' : 'text-white hover:bg-white/20',
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
                                            'rounded-full border border-white/50 bg-transparent px-5 py-2 text-sm font-semibold transition-colors',
                                            isServicesActive ? '!text-primary bg-white' : 'text-white hover:bg-white/20 hover:text-white',
                                        )}
                                        
                                    >
                                        Program
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        {/* Premium Mega Menu — 3-column layout */}
                                        <div className="w-[720px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-950">
                                            {/* Top accent strip */}
                                            <div className="from-primary via-secondary h-1 w-full bg-gradient-to-r to-violet-500" />

                                            <div className="grid grid-cols-[1fr_1fr_220px] gap-0">
                                                {/* ── Col 1: Program List ── */}
                                                <div className="border-r border-gray-100 p-5 dark:border-white/10">
                                                    <p className="text-muted-foreground mb-3 flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase">
                                                        <Sparkles className="text-primary h-3 w-3" />
                                                        Program Edukasi
                                                    </p>
                                                    <ul className="space-y-1">
                                                        <ListItem
                                                            href="/course"
                                                            title="Kelas Online"
                                                            icon={BookText}
                                                            iconBg="bg-blue-50 dark:bg-blue-900/30"
                                                            iconColor="text-blue-600"
                                                        >
                                                            Belajar dengan video pembelajaran terstruktur dan materi lengkap
                                                        </ListItem>
                                                        <ListItem
                                                            href="/bootcamp"
                                                            title="Bootcamp"
                                                            icon={Presentation}
                                                            iconBg="bg-emerald-50 dark:bg-emerald-900/30"
                                                            iconColor="text-emerald-600"
                                                            badge="Intensif"
                                                        >
                                                            Program intensif dengan mentor profesional dan project-based learning
                                                        </ListItem>
                                                        <ListItem
                                                            href="/webinar"
                                                            title="Webinar"
                                                            icon={MonitorPlay}
                                                            iconBg="bg-violet-50 dark:bg-violet-900/30"
                                                            iconColor="text-violet-600"
                                                        >
                                                            Seminar online dengan topik terkini dan expert speaker
                                                        </ListItem>
                                                    </ul>
                                                </div>

                                                {/* ── Col 2: Penawaran Spesial ── */}
                                                <div className="border-r border-gray-100 p-5 dark:border-white/10">
                                                    <p className="text-muted-foreground mb-3 flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase">
                                                        <Award className="text-secondary h-3 w-3" />
                                                        Penawaran Spesial
                                                    </p>
                                                    <ul className="from-primary space-y-1 overflow-hidden rounded-xl bg-gradient-to-br to-blue-700">
                                                        <ListItem
                                                            href="/bundle"
                                                            title="Paket Bundling"
                                                            icon={Album}
                                                            iconBg="bg-white/20"
                                                            iconColor="text-white"
                                                            badge="Hemat"
                                                            inverted
                                                        >
                                        
                                                            Hemat lebih banyak dengan paket bundling berbagai produk edukasi kami
                                                        </ListItem>
                                                    </ul>
                                                    <ul className="mt-3 space-y-1">
                                                        <ListItem
                                                            href="/certification-programs"
                                                            title="Sertifikasi"
                                                            icon={BriefcaseBusiness}
                                                            iconBg="bg-amber-50 dark:bg-amber-900/30"
                                                            iconColor="text-amber-600"
                                                        >
                                                            Tingkatkan kredibilitas dengan sertifikasi profesional
                                                        </ListItem>
                                                    </ul>
                                                </div>
                        

                                                {/* ── Col 3: Why Level Up ── */}
                                                <div className="border-l border-gray-100 bg-gray-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                                                    <p className="text-muted-foreground mb-3 flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase">
                                                        <TrendingUp className="h-3 w-3 text-emerald-600" />
                                                        Mengapa Kami
                                                    </p>
                                                    <ul className="space-y-3">
                                                        {[
                                                            {
                                                                icon: BadgeCheck,
                                                                label: 'Mentor Bersertifikat',
                                                                color: 'text-primary',
                                                                bg: 'bg-primary/10',
                                                            },
                                                            { icon: Users, label: '5.000+ Alumni', color: 'text-secondary', bg: 'bg-secondary/10' },
                                                            {
                                                                icon: TrendingUp,
                                                                label: 'Kurikulum Update',
                                                                color: 'text-emerald-600',
                                                                bg: 'bg-emerald-50 dark:bg-emerald-900/30',
                                                            },
                                                            {
                                                                icon: Award,
                                                                label: 'Sertifikat Diakui',
                                                                color: 'text-amber-600',
                                                                bg: 'bg-amber-50 dark:bg-amber-900/30',
                                                            },
                                                        ].map((f) => (
                                                            <li key={f.label} className="flex items-center gap-2.5">
                                                                <div
                                                                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${f.bg}`}
                                                                >
                                                                    <f.icon className={`h-3.5 w-3.5 ${f.color}`} />
                                                                </div>
                                                                <span className="text-foreground text-xs font-medium">{f.label}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-white/10">
                                                        <Link
                                                            href="/about"
                                                            className="text-primary flex items-center gap-1 text-xs font-semibold transition-all hover:gap-2"
                                                        >
                                                            Pelajari Lebih Lanjut
                                                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2.5}
                                                                    d="M9 5l7 7-7 7"
                                                                />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                           
                                    </NavigationMenuContent>
                                   
                                </NavigationMenuItem>



                                {/* Artikel */}
                                <NavigationMenuItem className="relative flex h-full items-center">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/article"
                                            className={cn(
                                                'rounded-full border border-white/50 px-5 py-2 text-sm font-semibold transition-colors',
                                                page.url.startsWith('/article') ? 'text-primary bg-white' : 'text-white hover:bg-white/20',
                                            )}
                                        >
                                            Artikel
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                {/* Cek Sertifikat */}
                                <NavigationMenuItem className="relative flex h-full items-center">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href="/check-certificate"
                                            className={cn(
                                                'rounded-full border border-white/50 px-5 py-2 text-sm font-semibold transition-colors',
                                                page.url.startsWith('/check-certificate')
                                                    ? 'text-primary bg-white'
                                                    : 'text-white hover:bg-white/20',
                                            )}
                                        >
                                            Cek Sertifikat
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>

                                {/* Profil Saya (if logged in) */}
                                {auth.user && (
                                    <NavigationMenuItem className="relative flex h-full items-center">
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href="/profile"
                                                className={cn(
                                                    'rounded-full border border-white/50 px-5 py-2 text-sm font-semibold transition-colors',
                                                    page.url.startsWith('/profile')
                                                        ? 'text-primary bg-white'
                                                        : 'text-white hover:bg-white/20',
                                                )}
                                            >
                                                Profil Saya
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                )}
                            </NavigationMenuList>
                        </NavigationMenu>

                        <div className="relative z-10 flex items-center">
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="size-10 rounded-full p-1">
                                            <Avatar className="size-8 overflow-hidden rounded-full">
                                                <AvatarImage
                                                    src={
                                                        auth.user.photo_url
                                                            ? auth.user.photo_url.startsWith('http')
                                                                ? auth.user.photo_url
                                                                : `/storage/${auth.user.photo_url}`
                                                            : auth.user.avatar || undefined
                                                    }
                                                    alt={auth.user.name}
                                                    className="object-cover"
                                                />
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
            {/* Mobile Navigation Dock */}
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
                                        href="/certification-programs"
                                        onClick={() => setServicesOpen(false)}
                                        className={cn(
                                            'flex items-start gap-3 rounded-lg p-3 transition-colors duration-200',
                                            page.url.startsWith('/certification-programs')
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-muted/50 hover:text-foreground',
                                        )}
                                    >
                                        <Icon
                                            iconNode={BriefcaseBusiness}
                                            className={cn(
                                                'mt-0.5 h-5 w-5 flex-shrink-0',
                                                page.url.startsWith('/certification-programs') ? 'text-primary' : 'text-muted-foreground',
                                            )}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="mb-1 text-sm leading-none font-medium">Sertifikasi</p>
                                            <p className="text-muted-foreground line-clamp-2 text-xs">
                                                Tingkatkan kredibilitas dengan sertifikasi profesional
                                            </p>
                                        </div>
                                    </Link>

                                    {/* Cek Sertifikat di Mobile */}
                                    <Link
                                        href="/check-certificate"
                                        onClick={() => setServicesOpen(false)}
                                        className={cn(
                                            'flex items-start gap-3 rounded-lg p-3 transition-colors duration-200',
                                            page.url.startsWith('/check-certificate')
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-muted/50 hover:text-foreground',
                                        )}
                                    >
                                        <Icon
                                            iconNode={Award}
                                            className={cn(
                                                'mt-0.5 h-5 w-5 flex-shrink-0',
                                                page.url.startsWith('/check-certificate') ? 'text-primary' : 'text-muted-foreground',
                                            )}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="mb-1 text-sm leading-none font-medium">Cek Sertifikat</p>
                                            <p className="text-muted-foreground line-clamp-2 text-xs">
                                                Lihat sertifikat Anda dengan email dan nomor WA
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