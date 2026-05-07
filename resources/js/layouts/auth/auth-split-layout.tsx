import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { GraduationCap } from 'lucide-react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-dvh flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4 py-8">
            {/* Decorative Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <Link href={route('home')} className="mb-4 md:mb-6 flex flex-col items-center justify-center ">
                    <img 
                        src="/assets/images/logo-primary2.png" 
                        alt="Level Up Accounting" 
                        className="h-16 w-auto dark:hidden" 
                    />
                    <span className="text-3xl font-bold text-center text-gray-900 dark:text-white">Level Up Accounting</span>
                </Link>

                {/* Card */}
                <div className="rounded-2xl border-2 bg-white p-8 shadow-xl dark:bg-zinc-900 dark:border-zinc-800">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                    </div>

                    {/* Content */}
                    {children}
                </div>

                {/* Footer */}
                <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
                    © 2024 Level Up Accounting. All rights reserved.
                </p>
            </div>
        </div>
    );
}