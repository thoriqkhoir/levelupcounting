import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserLayout from '@/layouts/user-layout';
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Book, BookOpen, Calendar, Clock, Eye, LayoutGrid, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface Category {
    id: string;
    name: string;
    articles_count: number;
}

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    thumbnail?: string;
    category: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        name: string;
    };
    read_time: number;
    views: number;
    published_at: string;
}

interface PopularArticle {
    id: string;
    title: string;
    slug: string;
    views: number;
    thumbnail?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ArticleIndexProps {
    articles: {
        data: Article[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    categories: Category[];
    popularArticles: PopularArticle[];
    filters: {
        category?: string;
        sort?: string;
    };
}

const GRID_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230000ff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

export default function ArticleIndex({ articles, categories, popularArticles, filters }: ArticleIndexProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || '');
    const [sortBy, setSortBy] = useState<string>(filters.sort || 'latest');

    const handleFilter = (category: string) => {
        setSelectedCategory(category);
        router.get('/article', { category: category || undefined, sort: sortBy }, { preserveState: true, replace: true });
    };

    const handleSort = (sort: string) => {
        setSortBy(sort);
        router.get('/article', { category: selectedCategory || undefined, sort }, { preserveState: true, replace: true });
    };

    return (
        <div className="relative min-h-screen bg-background">
            {/* Global Decorative Background — Blobs */}
            <div className="pointer-events-none absolute -top-32 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -top-32 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 -right-20 z-0 h-[400px] w-[400px] rounded-full bg-violet-300/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            {/* Global Decorative Background — Grid Pattern */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06]" style={{ backgroundImage: GRID_PATTERN }} />

            <UserLayout>
                <Head title="Artikel" />

                {/* ── Hero Section ── */}
                <section className="relative z-10 overflow-hidden py-20 text-gray-900 dark:text-white">
                    <div className="mx-auto max-w-7xl px-4">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mb-6 flex justify-center"
                        >
                            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                                <Sparkles className="h-4 w-4 animate-pulse" />
                                Artikel &amp; Blog Level Up Accounting
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.25 }}
                            className="font-av-estiana mx-auto mb-6 max-w-4xl text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
                        >
                            Artikel &amp;{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10 text-primary">Blog</span>
                                <span className="absolute bottom-1 left-0 z-0 h-3 w-full -rotate-1 rounded bg-secondary/20" />
                            </span>
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mx-auto mb-10 max-w-2xl text-center text-base text-gray-600 dark:text-gray-300 md:text-lg"
                        >
                            Temukan insight, tutorial, dan berita terbaru seputar pembelajaran akuntansi, pajak, dan teknologi.
                        </motion.p>

                        {/* Mini stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.55 }}
                            className="flex flex-wrap justify-center gap-3"
                        >
                            {[
                                { icon: BookOpen, label: `${articles.data.length > 0 ? articles.last_page * 9 + '+' : '0'} Artikel`, color: 'text-primary', bg: 'bg-primary/10' },
                                { icon: TrendingUp, label: `${popularArticles.length} Artikel Populer`, color: 'text-secondary', bg: 'bg-secondary/10' },
                                { icon: LayoutGrid, label: `${categories.length} Kategori`, color: 'text-violet-600', bg: 'bg-violet-500/10' },
                            ].map((s) => (
                                <div key={s.label} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-black/5 ${s.bg} ${s.color}`}>
                                    <s.icon className="h-4 w-4" />
                                    {s.label}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ── Filter & Sort Bar ── */}
                <div className="relative z-10 mx-auto w-full max-w-7xl px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-10 flex flex-col gap-4 rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:bg-zinc-950/80 md:flex-row md:items-center md:justify-between"
                    >
                        {/* Filter kategori */}
                        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar items-center">
                            <Button
                                variant={selectedCategory === '' ? 'default' : 'outline'}
                                size="sm"
                                className="rounded-full shrink-0"
                                onClick={() => handleFilter('')}
                            >
                                Semua Kategori
                            </Button>
                            {categories.map((cat) => (
                                <Button
                                    key={cat.id}
                                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                                    size="sm"
                                    className="rounded-full shrink-0 flex items-center"
                                    onClick={() => handleFilter(cat.id)}
                                >
                                    {cat.name}
                                    <span className={`ml-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}>
                                        {cat.articles_count}
                                    </span>
                                </Button>
                            ))}
                        </div>
                        {/* Sort */}
                        <div className="flex shrink-0 items-center gap-3 md:border-l md:pl-4 dark:border-zinc-800">
                            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Urutkan:</span>
                            <Select value={sortBy} onValueChange={handleSort}>
                                <SelectTrigger className="w-[160px] rounded-full">
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Terbaru</SelectItem>
                                    <SelectItem value="popular">Paling Populer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </motion.div>

                    {/* ── Popular Articles ── */}
                    {popularArticles.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-14"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                                    <TrendingUp className="h-4 w-4" />
                                    Paling Banyak Dibaca
                                </span>
                            </div>
                            <div className="flex gap-6 overflow-x-auto pb-4 pt-2 snap-x hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                                {popularArticles.map((article, index) => (
                                    <motion.div
                                        key={article.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                        className="snap-start"
                                    >
                                        <Link
                                            href={`/article/${article.slug}`}
                                            className="group relative flex w-[280px] md:w-[320px] flex-shrink-0 flex-col overflow-hidden rounded-2xl border bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-950"
                                        >
                                            <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 font-bold text-primary shadow backdrop-blur-sm dark:bg-black/90">
                                                #{index + 1}
                                            </div>
                                            <div className="aspect-[4/3] w-full overflow-hidden">
                                                <img
                                                    src={article.thumbnail ? `/storage/${article.thumbnail}` : '/assets/images/placeholder.png'}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex flex-col p-5">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-xs font-medium text-muted-foreground">{article.views.toLocaleString()} views</span>
                                                </div>
                                                <h4 className="line-clamp-2 text-base font-semibold transition-colors group-hover:text-primary">
                                                    {article.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Articles Grid ── */}
                    <div className="mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mb-6"
                        >
                            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-semibold text-secondary shadow-sm ring-1 ring-secondary/20">
                                <Book className="h-4 w-4" />
                                Artikel Terbaru
                            </span>
                        </motion.div>

                        {articles.data.length > 0 ? (
                            <>
                                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {articles.data.map((article, index) => (
                                        <motion.div
                                            key={article.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: 0.4 + index * 0.08 }}
                                        >
                                            <Link
                                                href={`/article/${article.slug}`}
                                                className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-white/80 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/40 dark:bg-zinc-950"
                                            >
                                                <div className="relative aspect-[16/10] overflow-hidden">
                                                    <img
                                                        src={article.thumbnail ? `/storage/${article.thumbnail}` : '/assets/images/placeholder.png'}
                                                        alt={article.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute left-4 top-4">
                                                        <Badge className="bg-white/95 text-primary hover:bg-white dark:bg-black/95 shadow-sm backdrop-blur-sm border-none">
                                                            {article.category.name}
                                                        </Badge>
                                                    </div>
                                                    {/* Hover overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                                </div>
                                                <CardContent className="flex flex-1 flex-col p-6">
                                                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="font-medium text-foreground">{article.user.name}</span>
                                                        <span>•</span>
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {format(new Date(article.published_at), 'dd MMM yyyy', { locale: id })}
                                                    </div>
                                                    <h3 className="mb-3 line-clamp-2 text-xl font-bold transition-colors group-hover:text-primary leading-tight">
                                                        {article.title}
                                                    </h3>
                                                    {article.excerpt && (
                                                        <p className="mb-6 line-clamp-2 text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>
                                                    )}
                                                    <div className="mt-auto flex items-center justify-between border-t pt-4 text-xs font-medium text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="h-4 w-4" />
                                                            {article.read_time} min read
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Eye className="h-4 w-4" />
                                                            {article.views} views
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {articles.last_page > 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        className="mt-12 flex justify-center gap-2"
                                    >
                                        {articles.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                className={link.active ? 'rounded-full shadow-md' : 'rounded-full'}
                                                disabled={!link.url}
                                                onClick={() => link.url && router.visit(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-muted/30"
                            >
                                <Book className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground mb-2 text-xl font-semibold">Artikel tidak ditemukan</p>
                                <p className="text-muted-foreground text-sm">Coba ubah filter atau kategori pencarian Anda</p>
                                <Button variant="outline" className="mt-6 rounded-full" onClick={() => { handleFilter(''); handleSort('latest'); }}>
                                    Reset Filter
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </UserLayout>
        </div>
    );
}