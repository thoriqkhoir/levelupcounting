import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { BookText, Calendar, Clock, Eye, MonitorPlay, Presentation, Share2 } from 'lucide-react';
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

export default function ArticleShow({ article, relatedArticles }: ArticleShowProps) {
    const getInitials = useInitials();

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.excerpt || article.title,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link berhasil disalin!');
        }
    };

    return (
        <UserLayout>
            <Head title={article.title} />

            {/* Hero Section */}
            <div className="relative mb-12">
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
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 py-16 md:py-24 text-center border border-primary/10 shadow-sm mx-auto max-w-7xl mt-8"
                    >
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-[80px]" />
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-tertiary/30 blur-[80px]" />
                        
                        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-4">
                            <Badge className="mb-2 bg-primary/20 text-primary border-primary/20 shadow-none hover:bg-primary/30 text-sm py-1 px-3">
                                {article.category.name}
                            </Badge>
                            <h1 className="font-av-estiana text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
                                {article.title}
                            </h1>
                            <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground font-medium">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={article.user.avatar} alt={article.user.name} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {getInitials(article.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-foreground">{article.user.name}</span>
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

            <div className="mx-auto max-w-5xl px-2 md:px-0 grid grid-cols-1 gap-10 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <article>
                        {/* Excerpt */}
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

                        {/* Author Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mt-16 flex flex-col md:flex-row items-center md:items-start gap-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border p-8 shadow-sm"
                        >
                            <Avatar className="h-24 w-24 border-4 border-white shadow-md dark:border-zinc-800">
                                <AvatarImage src={article.user.avatar} alt={article.user.name} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                                    {getInitials(article.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-center md:text-left">
                                <Badge variant="outline" className="mb-3 border-primary/30 text-primary bg-primary/5 uppercase tracking-wider text-[10px] font-semibold">Penulis Artikel</Badge>
                                <h3 className="mb-2 font-av-estiana text-2xl font-bold text-foreground">
                                    {article.user.name === 'Admin' ? 'Level Up Accounting Team' : article.user.name}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">{article.user.bio || "Penulis di Level Up Accounting yang membagikan wawasan dan pengetahuan seputar akuntansi, pajak, dan pengembangan karir."}</p>
                            </div>
                        </motion.div>
                    </article>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-8">
                    {/* Share Button - sticky on desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="sticky top-28 z-10"
                    >
                        <button
                            onClick={handleShare}
                            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white dark:bg-zinc-950 border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-4 text-lg font-bold shadow-sm transition-all hover:shadow-md"
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
                            className="rounded-3xl border bg-white dark:bg-zinc-950 p-6 shadow-sm"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                                    <BookText className="h-5 w-5" />
                                </div>
                                <h3 className="font-av-estiana text-2xl font-bold">Artikel Terkait</h3>
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

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-700 text-white shadow-lg relative"
                    >
                        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-black/10 blur-2xl" />
                        <div className="relative p-8">
                            <h3 className="mb-3 font-av-estiana text-2xl font-bold">Ingin Belajar Lebih Lanjut?</h3>
                            <p className="mb-6 text-sm text-white/80 leading-relaxed font-medium">
                                Jelajahi berbagai produk edukasi kami untuk meningkatkan skill dan karir Anda di bidang Akuntansi & Perpajakan.
                            </p>
                            <div className="space-y-3">
                                <Link
                                    href="/course"
                                    className="group flex items-center justify-between rounded-2xl bg-white/10 backdrop-blur-sm px-5 py-4 text-sm font-semibold shadow-sm transition-all hover:bg-white hover:text-primary border border-white/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-white/20 p-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <BookText className="h-5 w-5" />
                                        </div>
                                        <span>Kelas Online</span>
                                    </div>
                                    <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">→</span>
                                </Link>
                                <Link
                                    href="/bootcamp"
                                    className="group flex items-center justify-between rounded-2xl bg-white/10 backdrop-blur-sm px-5 py-4 text-sm font-semibold shadow-sm transition-all hover:bg-white hover:text-primary border border-white/20"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-white/20 p-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <Presentation className="h-5 w-5" />
                                        </div>
                                        <span>Program Bootcamp</span>
                                    </div>
                                    <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">→</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </UserLayout>
    );
}