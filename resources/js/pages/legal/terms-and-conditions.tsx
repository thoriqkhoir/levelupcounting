import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function TermsAndConditions() {
    const { i18n } = useTranslation();
    const isEn = i18n.language === 'en';

    return (
        <UserLayout>
            <Head title={isEn ? 'Terms and Conditions' : 'Syarat dan Ketentuan'} />

            <div className="min-h-screen bg-background py-12 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                                {isEn ? 'Terms and Conditions' : 'Syarat dan Ketentuan'}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">Level Up Accounting</p>
                        </div>

                        {isEn ? (
                            <div className="prose prose-gray dark:prose-invert text-justify max-w-none">
                                <section className="mb-8">
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting is an education and training platform focused on competence development in the fields of accounting, finance, taxation, and professional career development. Our programs are designed to help students, fresh graduates, employees, and practitioners acquire skills relevant to today's workplace requirements.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        These Terms and Conditions govern the use of the website, services, training programs, classes, webinars, certifications, and all content provided by Level Up Accounting. By accessing, registering, or participating in our programs, You are deemed to have read, understood, and agreed to all applicable terms.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">A. GENERAL TERMS</h2>

                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">1. Usage Agreement</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            This document constitutes an official agreement between the user/participant ("You") and Level Up Accounting ("We", "Us", or "Our"). These terms apply to all services, training programs, classes, webinars, mentoring, certifications, and content available on our platform. By registering or participating in a program, You agree to these Terms and Conditions along with our applicable Privacy Policy and Refund Policy.
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">2. Amendments to Terms</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Level Up Accounting reserves the right to modify, update, or adjust the contents of these Terms and Conditions at any time without prior notice. Changes will take effect upon publication on the official website and will be binding on all users and program participants.
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">3. Participant Registration</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Some information on the website can be accessed publicly. However, to participate in certain programs, participants must register with accurate, complete, and verifiable data. Participants are responsible for maintaining account security and the confidentiality of their login credentials.
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">4. Program Changes</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Level Up Accounting reserves the right to modify schedules, materials, teaching methods, mentors/instructors, learning media, and program facilities if necessary, while maintaining educational quality.
                                        </p>
                                    </div>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">B. PARTICIPANT RESPONSIBILITIES</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">In using the services and participating in Level Up Accounting programs, participants are prohibited from:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>Accessing systems or accounts of other parties without authorization.</li>
                                        <li>Copying, recording, disseminating, commercializing, or distributing learning materials without prior written consent.</li>
                                        <li>Transferring account access, class access, learning videos, or certificates to any other party.</li>
                                        <li>Using the Level Up Accounting name, logo, identity, or materials for commercial purposes without official permission.</li>
                                        <li>Engaging in activities that violate laws, copyrights, trademarks, or other intellectual property rights.</li>
                                        <li>Disrupting the comfort of other participants or the learning process.</li>
                                    </ul>
                                    <p className="mt-3 text-gray-700 dark:text-gray-300">
                                        All services are intended solely for the educational benefit and personal skill development of the participant.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">C. VIOLATIONS</h2>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting reserves the right to impose sanctions in the form of warnings, access restrictions, suspension, or temporary or permanent termination of participant participation if violations of these Terms and Conditions are found.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        For violations committed by participants, any fees paid are strictly non-refundable.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">D. REGISTRATION, PAYMENT & REFUND</h2>

                                    <div className="mb-4">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">1. Registration</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Every program registration will be confirmed via email, WhatsApp, or official Level Up Accounting communication channels.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">2. Payment</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Participants are considered officially registered once payment is verified. Payments are made through official payment methods provided by Level Up Accounting or trusted payment partners.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">3. Fees & Refunds</h3>
                                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                                            Program fees are subject to change at any time according to company policy. Refunds can only be issued if the program is cancelled by Level Up Accounting or if a technical system error prevents services from being used properly.
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Refunds do not apply if participants fail to attend classes, arrive late, or experience personal issues outside our responsibility.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">4. Promos, Discounts & Scholarships</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Promos, discounts, vouchers, and scholarship programs are subject to specific terms and quotas, are limited in availability, and are non-transferable.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">5. Access Rights</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Access rights to classes, learning videos, materials, discussion groups, and other facilities are valid for the chosen program duration and are strictly for personal participant use.
                                        </p>
                                    </div>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">E. COPYRIGHT & LICENSING</h2>
                                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                        <p>
                                            All learning materials, modules, videos, designs, class recordings, logos, and other content available on the Level Up Accounting platform are the property of Level Up Accounting and protected by the laws of the Republic of Indonesia.
                                        </p>
                                        <p>
                                            Participants are only permitted to use materials for personal learning purposes and are prohibited from using, copying, or distributing materials for commercial purposes without written consent.
                                        </p>
                                        <p>
                                            Participants are responsible for maintaining the security and confidentiality of their respective accounts.
                                        </p>
                                    </div>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">F. LIMITATION OF LIABILITY</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting is committed to providing the best service to all participants. However, we do not guarantee that services will always be free from technical disruptions, system errors, internet limitations, or other conditions beyond our control.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Level Up Accounting is not liable for direct or indirect losses arising from the use of services outside of applicable terms.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">G. GOVERNING LAW</h2>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        These Terms and Conditions are governed by and construed in accordance with the laws of the Republic of Indonesia.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        In the event of a dispute, both parties agree to resolve it first through amicable deliberation within a maximum period of 60 (sixty) days before pursuing legal channels in accordance with applicable laws.
                                    </p>
                                </section>
                            </div>
                        ) : (
                            <div className="prose text-justify prose-gray dark:prose-invert max-w-none">
                                <section className="mb-8">
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting adalah platform edukasi dan pelatihan yang berfokus pada pengembangan kompetensi di bidang akuntansi, keuangan, perpajakan, dan pengembangan karier profesional. Program kami dirancang untuk membantu mahasiswa, fresh graduate, karyawan, maupun praktisi agar memiliki keterampilan yang relevan dengan kebutuhan dunia kerja saat ini.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Syarat dan Ketentuan ini mengatur penggunaan situs, layanan, program pelatihan, kelas, webinar, sertifikasi, serta seluruh konten yang disediakan oleh Level Up Accounting. Dengan mengakses, mendaftar, atau mengikuti program kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang berlaku.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">A. KETENTUAN UMUM</h2>

                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">1. Perjanjian Penggunaan</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Dokumen ini merupakan perjanjian resmi antara pengguna/peserta (“Anda”) dan Level Up Accounting (“Kami”). Ketentuan ini berlaku untuk seluruh layanan, program pelatihan, kelas, webinar, mentoring, sertifikasi, serta konten yang tersedia di platform kami. Dengan mendaftar atau mengikuti program, Anda menyetujui seluruh Syarat dan Ketentuan ini beserta Kebijakan Privasi dan Kebijakan Pengembalian Dana yang berlaku.
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">2. Perubahan Ketentuan</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Level Up Accounting berhak mengubah, memperbarui, atau menyesuaikan isi Syarat dan Ketentuan sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Perubahan akan berlaku sejak dipublikasikan pada situs resmi dan mengikat seluruh pengguna maupun peserta program.
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">3. Pendaftaran Peserta</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Sebagian informasi pada situs dapat diakses secara umum. Namun, untuk mengikuti program tertentu, peserta wajib melakukan pendaftaran dengan data yang benar, lengkap, dan dapat dipertanggungjawabkan. Peserta bertanggung jawab atas keamanan akun dan kerahasiaan data login masing-masing.
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">4. Perubahan Program</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Level Up Accounting berhak melakukan perubahan jadwal, materi, metode pembelajaran, mentor/instruktur, media pembelajaran, maupun fasilitas program apabila diperlukan, dengan tetap mempertahankan kualitas pembelajaran.
                                        </p>
                                    </div>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">B. TANGGUNG JAWAB PESERTA</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">Dalam menggunakan layanan dan mengikuti program Level Up Accounting, peserta dilarang untuk:</p>
                                    <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                        <li>Mengakses sistem atau akun pihak lain tanpa izin.</li>
                                        <li>Menyalin, merekam, menyebarluaskan, memperjualbelikan, atau mendistribusikan materi pembelajaran tanpa persetujuan tertulis.</li>
                                        <li>Memindahtangankan akun, akses kelas, video pembelajaran, atau sertifikat kepada pihak lain.</li>
                                        <li>Menggunakan nama, logo, identitas, maupun materi Level Up Accounting untuk kepentingan komersial tanpa izin resmi.</li>
                                        <li>Melakukan tindakan yang melanggar hukum, hak cipta, merek dagang, atau hak kekayaan intelektual lainnya.</li>
                                        <li>Mengganggu kenyamanan peserta lain maupun jalannya proses pembelajaran.</li>
                                    </ul>
                                    <p className="mt-3 text-gray-700 dark:text-gray-300">
                                        Seluruh layanan hanya diperuntukkan bagi kepentingan edukasi dan pengembangan kompetensi pribadi peserta.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">C. PELANGGARAN</h2>
                                    <p className="mb-4 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting berhak memberikan sanksi berupa peringatan, pembatasan akses, penangguhan, hingga penghentian keikutsertaan peserta secara sementara maupun permanen apabila ditemukan pelanggaran terhadap Syarat dan Ketentuan ini.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Atas pelanggaran yang dilakukan peserta, biaya yang telah dibayarkan tidak dapat diminta kembali.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">D. PENDAFTARAN, PEMBAYARAN & PENGEMBALIAN DANA</h2>

                                    <div className="mb-4">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">1. Pendaftaran</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Setiap pendaftaran program akan dikonfirmasi melalui email, WhatsApp, atau media komunikasi resmi Level Up Accounting.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">2. Pembayaran</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Peserta dianggap terdaftar secara resmi setelah pembayaran berhasil diverifikasi. Pembayaran dilakukan melalui metode pembayaran resmi yang disediakan oleh Level Up Accounting atau mitra pembayaran terpercaya.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">3. Biaya & Pengembalian Dana</h3>
                                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                                            Biaya program dapat berubah sewaktu-waktu sesuai kebijakan perusahaan. Pengembalian dana hanya dapat dilakukan apabila program dibatalkan oleh pihak Level Up Accounting atau terjadi kendala teknis dari sistem yang menyebabkan layanan tidak dapat digunakan sebagaimana mestinya.
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Pengembalian dana tidak berlaku apabila peserta tidak mengikuti kelas, terlambat hadir, atau mengalami kendala pribadi di luar tanggung jawab kami.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">4. Promo, Diskon & Beasiswa</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Promo, diskon, voucher, maupun program beasiswa memiliki syarat dan kuota tertentu, bersifat terbatas, dan tidak dapat dipindahtangankan kepada pihak lain.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">5. Hak Akses</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Hak akses terhadap kelas, video pembelajaran, materi, grup diskusi, dan fasilitas lainnya berlaku sesuai durasi program yang dipilih dan hanya diperuntukkan bagi penggunaan pribadi peserta.
                                        </p>
                                    </div>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">E. HAK CIPTA & LISENSI</h2>
                                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                        <p>
                                            Seluruh materi pembelajaran, modul, video, desain, rekaman kelas, logo, serta konten lain yang tersedia di platform Level Up Accounting merupakan hak milik Level Up Accounting dan dilindungi oleh hukum yang berlaku di Republik Indonesia.
                                        </p>
                                        <p>
                                            Peserta hanya diperbolehkan menggunakan materi untuk keperluan belajar pribadi dan dilarang menggunakan, menggandakan, maupun menyebarluaskan materi untuk kepentingan komersial tanpa izin tertulis.
                                        </p>
                                        <p>
                                            Peserta bertanggung jawab menjaga keamanan dan kerahasiaan akun masing-masing.
                                        </p>
                                    </div>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">F. BATASAN TANGGUNG JAWAB</h2>
                                    <p className="mb-3 text-gray-700 dark:text-gray-300">
                                        Level Up Accounting berkomitmen memberikan layanan terbaik kepada seluruh peserta. Namun, kami tidak menjamin layanan akan selalu bebas dari gangguan teknis, kesalahan sistem, keterbatasan jaringan internet, atau kondisi lain di luar kendali kami.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Level Up Accounting tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul akibat penggunaan layanan di luar ketentuan yang berlaku.
                                    </p>
                                </section>

                                <section className="mb-8">
                                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">G. HUKUM YANG BERLAKU</h2>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Seluruh Syarat dan Ketentuan ini tunduk dan diatur berdasarkan hukum Republik Indonesia.
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Apabila terjadi perselisihan, kedua belah pihak sepakat untuk menyelesaikannya terlebih dahulu secara musyawarah dalam waktu paling lama 60 (enam puluh) hari sebelum menempuh jalur hukum sesuai ketentuan yang berlaku.
                                    </p>
                                </section>
                            </div>
                        )}

                        <div className="mt-8 border-t border-gray-200 pt-8 text-center dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {isEn
                                    ? 'By registering and participating in programs at Level Up Accounting, You state that You have read, understood, and agreed to all applicable Terms and Conditions.'
                                    : 'Dengan mendaftar dan mengikuti program di Level Up Accounting, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan yang berlaku.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}