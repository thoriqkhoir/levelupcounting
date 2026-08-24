import DeleteConfirmDialog from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/admin-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Archive, Calendar, CircleX, Clock, Copy, Eye, FileText, Send, SquarePen, Trash, User } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { usePermission } from '@/hooks/use-permission';

interface Category {
    id: string;
    name: string;
}

interface Author {
    id: string;
    name: string;
    bio: string;
}

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content?: string | null;
    thumbnail?: string | null;
    category: Category;
    user: Author;
    read_time: number;
    views: number;
    status: 'draft' | 'published' | 'archived';
    published_at?: string | null;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    article: Article;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ShowArticle({ article, flash }: ShowProps) {
    const { auth } = usePage<SharedData>().props;
    const { canManage } = usePermission();
    const isAffiliate = auth.role.includes('affiliate');
    const isAdmin = auth.role.includes('admin');
    const isMentor = auth.role.includes('mentor');
    const canManageArticle = canManage('articles') && !isAffiliate;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Artikel',
            href: '/admin/articles',
        },
        {
            title: article.title,
            href: `/admin/articles/${article.id}`,
        },
    ];

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const getStatusBadge = (status: Article['status']) => {
        const statusMap = {
            draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
            published: { label: 'Published', color: 'bg-green-100 text-green-700' },
            archived: { label: 'Archived', color: 'bg-red-100 text-red-700' },
        };
        const statusInfo = statusMap[status];
        return <Badge className={`${statusInfo.color} border-0`}>{statusInfo.label}</Badge>;
    };

    const currentStatus = {
        draft: { label: 'Draft' },
        published: { label: 'Published' },
        archived: { label: 'Archived' },
    }[article.status];

    const handleDelete = () => {
        router.delete(route('articles.destroy', article.id));
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Artikel - ${article.title}`} />
            <div className="px-4 py-4 md:px-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold">Detail Artikel</h1>
                        <p className="text-muted-foreground text-sm">Informasi lengkap tentang artikel {article.title}</p>
                    </div>
                </div>

                <div className={`${canManageArticle ? 'lg:grid-cols-3' : ''} grid grid-cols-1 gap-4 lg:gap-6`}>
                    <div className={canManageArticle ? 'lg:col-span-2' : 'w-full'}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Detail Artikel</CardTitle>
                                <CardDescription>Informasi artikel yang dibuat.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Thumbnail */}
                                {article.thumbnail && (
                                    <div>
                                        <label className="text-muted-foreground text-sm font-medium">Thumbnail</label>
                                        <div className="mt-2">
                                            <img
                                                src={`/storage/${article.thumbnail}`}
                                                alt={article.title}
                                                className="h-64 w-full rounded-lg object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Category */}
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Kategori</label>
                                    <div className="mt-1">
                                        <Badge variant="outline">{article.category.name}</Badge>
                                    </div>
                                </div>

                                {/* Author */}
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Penulis</label>
                                    <p className="mt-1 text-base">{article.user.name}</p>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Judul</label>
                                    <p className="mt-1 text-base font-semibold">{article.title}</p>
                                </div>

                                {/* Excerpt */}
                                {article.excerpt && (
                                    <div>
                                        <label className="text-muted-foreground text-sm font-medium">Kutipan</label>
                                        <p className="mt-1 text-base text-gray-700">{article.excerpt}</p>
                                    </div>
                                )}

                                {/* Content */}
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Konten</label>
                                    <div className="prose max-w-none mt-2">
                                        <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
                                    </div>
                                </div>

                                {/* Read Time & Views */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-muted-foreground text-sm font-medium">Waktu Baca</label>
                                        <p className="mt-1 text-base">{article.read_time} menit</p>
                                    </div>
                                    <div>
                                        <label className="text-muted-foreground text-sm font-medium">Views</label>
                                        <p className="mt-1 text-base">{article.views.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="text-muted-foreground text-sm font-medium">Status</label>
                                    <div className="mt-1">{getStatusBadge(article.status)}</div>
                                </div>

                                {/* Published Date */}
                                {article.published_at && (
                                    <div className="rounded-lg bg-blue-50 p-4">
                                        <label className="text-sm font-medium text-blue-900">Tanggal Publikasi</label>
                                        <p className="text-base font-medium text-blue-900">
                                            {format(new Date(article.published_at), 'dd MMMM yyyy, HH:mm', { locale: id })} WIB
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Actions */}
                    {canManageArticle && (
                        <div>
                            <h2 className="my-2 text-lg font-medium">Aksi & Pengaturan</h2>
                            <div className="space-y-4 rounded-lg border p-4">
                                {(isAdmin || canManage('articles')) && (article.status === 'draft' || article.status === 'archived') && (
                                    <>
                                        {!article.thumbnail && (
                                            <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
                                                Thumbnail belum diupload. Silakan upload thumbnail sebelum menerbitkan.
                                            </div>
                                        )}
                                        {!article.content && (
                                            <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
                                                Konten artikel masih kosong. Silakan tambahkan konten sebelum menerbitkan.
                                            </div>
                                        )}
                                        <Button asChild className="w-full" disabled={!article.thumbnail || !article.content}>
                                            <Link method="post" href={route('articles.publish', article.id)}>
                                                <Send />
                                                Terbitkan
                                            </Link>
                                        </Button>
                                    </>
                                )}

                                {(isAdmin || canManage('articles')) && article.status === 'published' && (
                                    <Button asChild className="w-full">
                                        <Link method="post" href={route('articles.archive', article.id)}>
                                            <CircleX />
                                            Arsipkan
                                        </Link>
                                    </Button>
                                )}

                                {isMentor && (article.status === 'draft' || article.status === 'archived') && (
                                    <div className="rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-700">
                                        Artikel dalam status <strong>{currentStatus.label}</strong>. Hubungi admin untuk menerbitkan artikel ini.
                                    </div>
                                )}

                                <Separator />

                                {/* Action Buttons */}
                                <div className="space-y-2">
                                    <Button asChild className="w-full" variant="secondary">
                                        <Link href={route('articles.edit', article.id)}>
                                            <SquarePen /> Edit
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full" variant="secondary">
                                        <Link method="post" href={route('articles.duplicate', article.id)}>
                                            <Copy /> Duplicate
                                        </Link>
                                    </Button>
                                    <DeleteConfirmDialog
                                        trigger={
                                            <Button variant="destructive" className="w-full">
                                                <Trash /> Hapus
                                            </Button>
                                        }
                                        title="Apakah Anda yakin ingin menghapus artikel ini?"
                                        itemName={article.title}
                                        onConfirm={handleDelete}
                                    />
                                </div>
                            </div>

                            {/* Article Info */}
                            <div className="mt-4 space-y-4 rounded-lg border p-4">
                                <h3 className="text-sm font-medium">Informasi Artikel</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">Slug:</span>
                                        <code className="text-primary rounded bg-gray-100 px-1.5 py-0.5 text-xs">{article.slug}</code>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">Kategori:</span>
                                        <Badge variant="outline" className="text-xs">
                                            {article.category.name}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">Penulis:</span>
                                        <span className="text-xs">{article.user.name}</span>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">Dibuat:</span>
                                        <span className="text-xs">{format(new Date(article.created_at), 'dd MMM yyyy', { locale: id })}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">Diperbarui:</span>
                                        <span className="text-xs">{format(new Date(article.updated_at), 'dd MMM yyyy', { locale: id })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
