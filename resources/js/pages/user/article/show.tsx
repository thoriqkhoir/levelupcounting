import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { BookText, Calendar, Clock, Eye, Presentation, Share2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface Category {
    id: string;
    name: string;
}

interface Author {
    id: string;
    name: string;
    bio: string;
    avatar?: string;
}

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    thumbnail?: string;
    category: Category;
    user: Author;
    read_time: number;
    views: number;
    published_at: string;
    created_at: string;
}

interface RelatedArticle {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    thumbnail?: string;
    read_time: number;
    published_at: string;
}

interface ArticleShowProps {
    article: Article;
    relatedArticles: RelatedArticle[];
}

const GRID_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230000ff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

export default function ArticleShow({ article, relatedArticles }: ArticleShowProps) {
    const getInitials = useInitials();

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: article.title, text: article.excerpt || article.title, url: window.location.href });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link berhasil disalin!');
        }
    };

    return (
        <div className="relative min-h-screen bg-background">
            {/* Global Decorative Background — Blobs */}
            <div className="pointer-events-none absolute -top-32 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -top-32 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-0 -right-0 z-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-3xl" />
            {/* Global Decorative Background — Grid Pattern */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06]" style={{ backgroundImage: GRID_PATTERN }} />

            <UserLayout>
                <Head title={article.title} />

                {/* ── Hero / Thumbnail ── */}
                <div className="relative z-10 mb-12">
                    {article.thumbnail ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7 }}
                            className="relative h-[60vh] min-h-[400px] w-full overflow-hidden"
                        >
                            <img
                                src={`/storage/${article.thumbnail}`}
                                alt={article.title}
                                className="h-full w-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 xl:p-16 text-white max-w-5xl mx-auto w-full">
                                <Badge className="mb-4 w-fit bg-primary text-white border-none shadow-sm hover:bg-primary/90 text-sm py-1 px-3">
                                    {article.category.name}
                                </Badge>
                                <h1 className="mb-6 font-av-estiana text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-md">
                                    {article.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base opacity-95 font-medium">
                                    <div className="flex items-center gap-2.5">
                                        <Avatar className="h-10 w-10 border-2 border-white/80 shadow-sm">
                                            <AvatarImage src={article.user.avatar} alt={article.user.name} />
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {getInitials(article.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{article.user.name}</span>
                                    </div>
                                    <Separator orientation="vertical" className="h-5 bg-white/40" />
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        {format(new Date(article.published_at), 'dd MMMM yyyy', { locale: id })}
                                    </div>
                                    <Separator orientation="vertical" className="h-5 bg-white/40" />
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        {article.read_time} min read
                                    </div>
                                    <Separator orientation="vertical" className="h-5 bg-white/40" />
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="h-4 w-4" />
                                        {article.views.toLocaleString()} views
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* No thumbnail — centered hero */
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mx-auto mt-8 max-w-7xl px-4"
                        >
                            <div className="overflow-hidden rounded-3xl border border-primary/10 bg-white/70 px-6 py-16 text-center shadow-sm backdrop-blur-sm dark:bg-white/5 md:py-24">
                                {/* Badge */}
                                <div className="mb-6 flex justify-center">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/20">
                                        <Sparkles className="h-4 w-4 animate-pulse" />
                                        {article.category.name}
                                    </span>
                                </div>
                                <h1 className="font-av-estiana mx-auto mb-8 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                                    {article.title}
                                </h1>
                                <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground font-medium">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={article.user.avatar} alt={article.user.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {getInitials(article.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-foreground font-semibold">{article.user.name}</span>
                                    </div>
                                    <Separator orientation="vertical" className="h-4" />
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        {format(new Date(article.published_at), 'dd MMMM yyyy', { locale: id })}
                                    </div>
                                    <Separator orientation="vertical" className="h-4" />
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        {article.read_time} min read
                                    </div>
                                    <Separator orientation="vertical" className="h-4" />
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="h-4 w-4" />
                                        {article.views.toLocaleString()} views
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* ── Content + Sidebar ── */}
                <div className="relative z-10 mx-auto max-w-5xl px-4 pb-20 grid grid-cols-1 gap-10 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <article>
                            {/* Excerpt callout */}
                            {article.excerpt && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="mb-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-6 md:p-8"
                                >
                                    <p className="text-xl leading-relaxed text-foreground/90 font-medium italic">"{article.excerpt}"</p>
                                </motion.div>
                            )}

                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:font-av-estiana prose-headings:font-bold prose-img:rounded-2xl prose-img:shadow-md prose-a:text-primary hover:prose-a:text-primary/80"
                            >
                                {article.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl opacity-60">
                                        <BookText className="h-12 w-12 mb-4" />
                                        <p className="text-xl font-medium">Konten artikel tidak tersedia.</p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Author Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="mt-16 flex flex-col md:flex-row items-center md:items-start gap-6 rounded-3xl border border-gray-100 bg-white/70 p-8 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                            >
                                <Avatar className="h-24 w-24 border-4 border-white shadow-md dark:border-zinc-800">
                                    <AvatarImage src={article.user.avatar} alt={article.user.name} className="object-cover" />
                                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                                        {getInitials(article.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-center md:text-left">
                                    <Badge variant="outline" className="mb-3 border-primary/30 text-primary bg-primary/5 uppercase tracking-wider text-[10px] font-semibold">
                                        Penulis Artikel
                                    </Badge>
                                    <h3 className="mb-2 font-av-estiana text-2xl font-bold text-foreground">
                                        {article.user.name === 'Admin' ? 'Level Up Accounting Team' : article.user.name}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {article.user.bio || 'Penulis di Level Up Accounting yang membagikan wawasan dan pengetahuan seputar akuntansi, pajak, dan pengembangan karir.'}
                                    </p>
                                </div>
                            </motion.div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        {/* Share button sticky */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="sticky top-28 z-10"
                        >
                            <button
                                onClick={handleShare}
                                className="group flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-primary bg-white/80 text-primary backdrop-blur-sm hover:bg-primary hover:text-white px-6 py-4 text-lg font-bold shadow-sm transition-all hover:shadow-md dark:bg-zinc-950/80"
                            >
                                <Share2 className="h-5 w-5 transition-transform group-hover:scale-110" />
                                Bagikan Artikel
                            </button>
                        </motion.div>

                        {/* Related Articles */}
                        {relatedArticles.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                            >
                                <div className="mb-5">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-semibold text-secondary shadow-sm ring-1 ring-secondary/20">
                                        <BookText className="h-4 w-4" />
                                        Artikel Terkait
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {relatedArticles.map((related) => (
                                        <Link
                                            key={related.id}
                                            href={`/article/${related.slug}`}
                                            className="group flex gap-4 rounded-2xl p-2 transition-all hover:bg-muted/50"
                                        >
                                            <div className="overflow-hidden rounded-xl h-20 w-24 flex-shrink-0">
                                                <img
                                                    src={related.thumbnail ? `/storage/${related.thumbnail}` : '/assets/images/placeholder.png'}
                                                    alt={related.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1 py-1">
                                                <h4 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary leading-tight">
                                                    {related.title}
                                                </h4>
                                                <div className="mt-2 flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {related.read_time} min</span>
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(new Date(related.published_at), 'dd MMM', { locale: id })}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* CTA Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-700 text-white shadow-lg relative"
                        >
                            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-black/10 blur-2xl" />
                            <div className="relative p-8">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/30">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Eksplorasi Program
                                </div>
                                <h3 className="mb-3 font-av-estiana text-2xl font-bold">Ingin Belajar Lebih Lanjut?</h3>
                                <p className="mb-6 text-sm text-white/80 leading-relaxed font-medium">
                                    Jelajahi berbagai produk edukasi kami untuk meningkatkan skill dan karir Anda di bidang Akuntansi &amp; Perpajakan.
                                </p>
                                <div className="space-y-3">
                                    {[
                                        { href: '/course', icon: BookText, label: 'Kelas Online' },
                                        { href: '/bootcamp', icon: Presentation, label: 'Program Bootcamp' },
                                    ].map(({ href, icon: Icon, label }) => (
                                        <Link
                                            key={href}
                                            href={href}
                                            className="group flex items-center justify-between rounded-2xl bg-white/10 backdrop-blur-sm px-5 py-4 text-sm font-semibold shadow-sm transition-all hover:bg-white hover:text-primary border border-white/20"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-full bg-white/20 p-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <span>{label}</span>
                                            </div>
                                            <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">→</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </UserLayout>
        </div>
    );
}