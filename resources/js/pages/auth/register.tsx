import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    phone_number: string;
    instance: string;
    city: string;
    password: string;
    password_confirmation: string;
    affiliate_code?: string;
};

export default function Register() {
    const { t } = useTranslation('auth');
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        phone_number: '',
        instance: '',
        city: '',
        password: '',
        password_confirmation: '',
        affiliate_code: '',
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const refFromUrl = urlParams.get('ref');
        if (refFromUrl) {
            setData('affiliate_code', refFromUrl.toUpperCase());
        }
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title={t('register.title', 'Buat Akun Level Up Accounting')} description={t('register.description', 'Silahkan isi form untuk mendaftar.')}>
            <Head title={t('register.headTitle', 'Daftar')} />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('register.name', 'Nama')}</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder={t('register.namePlaceholder', 'Nama lengkap Anda')}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('register.email', 'Email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone_number">{t('register.phone', 'No. Telepon')}</Label>
                        <Input
                            id="phone_number"
                            type="phone_number"
                            required
                            tabIndex={2}
                            autoComplete="phone_number"
                            value={data.phone_number}
                            onChange={(e) => setData('phone_number', e.target.value)}
                            disabled={processing}
                            placeholder={t('register.phonePlaceholder', '08xxxxxxxxxx')}
                        />
                        <InputError message={errors.phone_number} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="instance">{t('register.instance', 'Instansi')}</Label>
                        <Input
                            id="instance"
                            type="text"
                            tabIndex={3}
                            autoComplete="instance"
                            value={data.instance}
                            onChange={(e) => setData('instance', e.target.value)}
                            disabled={processing}
                            placeholder={t('register.instancePlaceholder', 'Nama instansi Anda')}
                        />
                        <p className="text-xs text-gray-500">
                            {t('register.instanceHint', 'Kosongkan jika tidak memiliki instansi')}
                        </p>
                        <InputError message={errors.instance} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="city">{t('register.city', 'Kota Domisili')}</Label>
                        <Input
                            id="city"
                            type="text"
                            required
                            tabIndex={2}
                            autoComplete="address-level2"
                            value={data.city}
                            onChange={(e) => setData('city', e.target.value)}
                            disabled={processing}
                            placeholder={t('register.cityPlaceholder', 'Masukkan kota domisili Anda')}
                        />
                        <InputError message={errors.city} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">{t('register.password', 'Password')}</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder={t('register.password', 'Password')}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 h-full px-3 hover:cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye className="size-4 text-gray-500" /> : <EyeOff className="size-4 text-gray-500" />}
                                <span className="sr-only">{showPassword ? t('login.hidePassword', 'Sembunyikan password') : t('login.showPassword', 'Tampilkan password')}</span>
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">{t('register.confirmPassword', 'Konfirmasi password')}</Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder={t('register.confirmPassword', 'Konfirmasi password')}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 h-full px-3 hover:cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <Eye className="size-4 text-gray-500" /> : <EyeOff className="size-4 text-gray-500" />}
                                <span className="sr-only">{showPassword ? t('login.hidePassword', 'Sembunyikan password') : t('login.showPassword', 'Tampilkan password')}</span>
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="affiliate_code">{t('register.referralCode', 'Kode Referral / Afiliasi (Opsional)')}</Label>
                        <Input
                            id="affiliate_code"
                            type="text"
                            tabIndex={5}
                            value={data.affiliate_code || ''}
                            onChange={(e) => setData('affiliate_code', e.target.value.toUpperCase())}
                            disabled={processing}
                            placeholder={t('register.referralPlaceholder', 'Contoh: LUC-XXXXXX')}
                            className="font-mono uppercase"
                        />
                        <InputError message={errors.affiliate_code} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {t('register.submit', 'Buat akun')}
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    {t('register.hasAccount', 'Sudah memiliki akun?')}{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        {t('register.login', 'Masuk')}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
