import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

interface EditMentorProps {
    mentor: {
        id: string;
        name: string;
        bio?: string;
        email: string;
        phone_number: string;
        commission: number;
        photo_url?: string;
    };
    setOpen: (open: boolean) => void;
}

export default function EditMentor({ mentor, setOpen }: EditMentorProps) {
    const nameInput = useRef<HTMLInputElement>(null);
    const bioInput = useRef<HTMLInputElement>(null);
    const emailInput = useRef<HTMLInputElement>(null);
    const phoneInput = useRef<HTMLInputElement>(null);
    const commissionInput = useRef<HTMLInputElement>(null);

    const getInitials = useInitials();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<
        Required<{ name: string; bio: string; email: string; phone_number: string; commission: number; photo_url: File | null; _method: string }>
    >({
        name: mentor.name,
        bio: mentor.bio ?? '',
        email: mentor.email,
        phone_number: mentor.phone_number,
        commission: mentor.commission,
        photo_url: null,
        _method: 'put',
    });

    useEffect(() => {
        setData({
            name: mentor.name,
            bio: mentor.bio ?? '',
            email: mentor.email,
            phone_number: mentor.phone_number,
            commission: mentor.commission,
            photo_url: null,
            _method: 'put',
        });
        clearErrors();
    }, [mentor, setData, clearErrors]);

    useEffect(() => {
        if (data.photo_url instanceof File) {
            const url = URL.createObjectURL(data.photo_url);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(mentor.photo_url ? (mentor.photo_url.startsWith('http') ? mentor.photo_url : `/storage/${mentor.photo_url}`) : null);
        }
    }, [data.photo_url, mentor.photo_url]);

    const updateMentor: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('mentors.update', mentor.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                clearErrors();
            },
            onError: () => nameInput.current?.focus(),
        });
    };

    return (
        <DialogContent>
            <DialogTitle>Edit Mentor</DialogTitle>
            <DialogDescription>Ubah nama, email, atau nomor telepon mentor.</DialogDescription>
            <form className="space-y-6" onSubmit={updateMentor}>
                <div className="grid gap-2">
                    <Label htmlFor="name" className="sr-only">
                        Nama Mentor
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        name="name"
                        ref={nameInput}
                        value={data.name}
                        onChange={(e) => {
                            setData('name', e.target.value);
                        }}
                        placeholder="Nama Mentor"
                        autoComplete="off"
                    />
                    <InputError message={errors.name} />

                    <Label htmlFor="bio" className="sr-only">
                        Bio Mentor
                    </Label>
                    <Input
                        id="bio"
                        type="text"
                        name="bio"
                        ref={bioInput}
                        value={data.bio}
                        onChange={(e) => {
                            setData('bio', e.target.value);
                        }}
                        placeholder="Bio Mentor, contoh: Frontend Developer, UI/UX Designer, dsb."
                        autoComplete="off"
                    />
                    <InputError message={errors.bio} />

                    <Label htmlFor="email" className="sr-only">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="text"
                        name="email"
                        ref={emailInput}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Email"
                        autoComplete="off"
                    />
                    <InputError message={errors.email} />

                    <Label htmlFor="phone_number" className="sr-only">
                        Nomor Telepon
                    </Label>
                    <Input
                        id="phone_number"
                        type="text"
                        name="phone_number"
                        ref={phoneInput}
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        placeholder="Nomor Telepon"
                        autoComplete="off"
                    />
                    <InputError message={errors.phone_number} />

                    <Label htmlFor="commission" className="text-xs text-gray-500">
                        Komisi (%) - Komisi yang akan diterima mentor dari setiap transaksi
                    </Label>
                    <Input
                        id="commission"
                        type="number"
                        name="commission"
                        ref={commissionInput}
                        value={data.commission}
                        onChange={(e) => {
                            setData('commission', Number(e.target.value));
                        }}
                        placeholder="Komisi"
                        autoComplete="off"
                    />
                    <InputError message={errors.commission} />

                    <Label htmlFor="photo_url" className="text-xs text-gray-500">
                        Foto Profil
                    </Label>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border shadow-sm">
                            <AvatarImage src={previewUrl || undefined} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {getInitials(data.name || 'M')}
                            </AvatarFallback>
                        </Avatar>
                        <Input
                            id="photo_url"
                            type="file"
                            name="photo_url"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setData('photo_url', e.target.files[0]);
                                } else {
                                    setData('photo_url', null);
                                }
                            }}
                            accept="image/*"
                            className="flex-1"
                        />
                    </div>
                    <InputError message={errors.photo_url} />
                </div>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" onClick={() => setOpen(false)} className="hover:cursor-pointer">
                            Batal
                        </Button>
                    </DialogClose>
                    <Button disabled={processing} asChild className="hover:cursor-pointer">
                        <button type="submit">Simpan Perubahan</button>
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
