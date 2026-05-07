import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';

export default function TermsAndConditions() {
    return (
        <UserLayout>
            <Head title="Syarat dan Ketentuan" />

            <div className="min-h-screen bg-gray-50 py-12 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Syarat dan Ketentuan</h1>
                            <p className="text-gray-600 dark:text-gray-400">Level Up Accounting</p>
                        </div>

                        <div className="prose text-justify prose-gray dark:prose-invert max-w-none">
                            <section className="mb-8">
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    Level Up Accounting adalah lembaga pendidikan dan pelatihan perpajakan yang berfokus pada peningkatan kompetensi di bidang akuntansi dan perpajakan, baik untuk mahasiswa, fresh graduate, karyawan, maupun praktisi. Kami berkomitmen membantu peserta memahami regulasi perpajakan secara komprehensif dan aplikatif sebagai bekal karier profesional.
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Syarat dan Ketentuan ini mengatur penggunaan situs, layanan, program pelatihan, serta seluruh konten yang disediakan oleh Level Up Accounting. Dengan mengakses, mendaftar, atau mengikuti program Level Up Accounting, Anda dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang berlaku.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">A. KETENTUAN UMUM</h2>
                                
                                <div className="mb-6">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">1. Perjanjian Penggunaan</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Dokumen ini merupakan perjanjian resmi antara pengguna/peserta ("Anda") dan Level Up Accounting ("Kami"). Ketentuan ini berlaku untuk seluruh layanan, program pelatihan, kelas, webinar, sertifikasi, serta konten yang tersedia. Dengan mendaftar atau mengikuti program, Anda menyetujui Syarat dan Ketentuan ini, termasuk Kebijakan Privasi dan Kebijakan Pengembalian Dana yang berlaku.
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">2. Perubahan Ketentuan</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Level Up Accounting berhak mengubah, memperbarui, atau menyesuaikan isi Syarat dan Ketentuan sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Perubahan berlaku sejak dipublikasikan dan mengikat seluruh peserta. Peserta disarankan untuk meninjau halaman ini secara berkala.
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">3. Pendaftaran Peserta</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Sebagian informasi dapat diakses oleh publik. Namun, untuk mengikuti program pelatihan, peserta wajib melakukan pendaftaran dengan data yang benar, lengkap, dan dapat dipertanggungjawabkan. Seluruh data pribadi dikelola sesuai peraturan perundang-undangan yang berlaku di Indonesia.
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">4. Perubahan Program</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Level Up Accounting berhak melakukan penyesuaian jadwal, materi, metode pembelajaran, instruktur, atau media pelatihan apabila diperlukan, dengan tetap menjaga kualitas dan tujuan pembelajaran.
                                    </p>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">B. TANGGUNG JAWAB PESERTA</h2>
                                <p className="mb-3 text-gray-700 dark:text-gray-300">Dalam mengikuti program Level Up Accounting, peserta dilarang untuk:</p>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Mengakses sistem atau akun pihak lain secara tidak sah.</li>
                                    <li>Menyalin, merekam, mendistribusikan, atau memperjualbelikan materi pelatihan tanpa izin tertulis.</li>
                                    <li>Memindahtangankan akun kelas, akses video, atau sertifikat kepada pihak lain.</li>
                                    <li>Menggunakan nama, logo, atau materi Level Up Accounting untuk kepentingan komersial tanpa persetujuan tertulis.</li>
                                    <li>Melanggar hak cipta, merek dagang, dan hak kekayaan intelektual lainnya.</li>
                                </ul>
                                <p className="mt-3 text-gray-700 dark:text-gray-300">
                                    Seluruh layanan hanya boleh digunakan untuk tujuan edukasi dan pengembangan kompetensi pribadi.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">C. PELANGGARAN</h2>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Level Up Accounting berhak memberikan sanksi berupa peringatan, pembatasan akses, hingga penghentian keikutsertaan peserta secara sementara atau permanen apabila terjadi pelanggaran. Atas pelanggaran tersebut, biaya yang telah dibayarkan tidak dapat diminta kembali.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">D. PENDAFTARAN, PEMBAYARAN & PENGEMBALIAN DANA</h2>
                                
                                <div className="mb-4">
                                    <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">1. Pendaftaran</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Setiap pendaftaran program akan dikonfirmasi melalui email atau media komunikasi resmi Level Up Accounting.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">2. Pembayaran</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Peserta dianggap terdaftar secara sah setelah pembayaran diverifikasi. Pembayaran dilakukan melalui mitra pembayaran resmi yang aman.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">3. Biaya & Pengembalian Dana</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Biaya program dapat berubah sewaktu-waktu. Pengembalian dana hanya dapat dilakukan apabila program dibatalkan oleh pihak Level Up Accounting atau terjadi kendala teknis dari sistem, bukan akibat kelalaian peserta.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">4. Promo & Diskon</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Promo, diskon, atau beasiswa bersifat terbatas, hanya berlaku untuk penerima yang terdaftar, dan tidak dapat dialihkan.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">5. Hak Akses</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Akses kelas, materi, dan fasilitas hanya berlaku sesuai durasi program dan untuk penggunaan pribadi peserta.
                                    </p>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">E. HAK CIPTA & LISENSI</h2>
                                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <p>
                                        Seluruh materi pembelajaran, modul, video, rekaman kelas, desain, dan konten lainnya merupakan milik Level Up Accounting dan dilindungi oleh hukum yang berlaku.
                                    </p>
                                    <p>
                                        Materi hanya boleh digunakan untuk keperluan belajar pribadi dan dilarang digunakan kembali untuk kepentingan komersial tanpa izin tertulis.
                                    </p>
                                    <p>
                                        Peserta bertanggung jawab menjaga kerahasiaan akun dan dilarang membagikannya kepada pihak lain.
                                    </p>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">F. BATASAN TANGGUNG JAWAB</h2>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Level Up Accounting berupaya memberikan layanan terbaik. Namun, kami tidak menjamin layanan bebas dari gangguan teknis, keterbatasan jaringan, atau kondisi di luar kendali kami. Level Up Accounting tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul akibat penggunaan layanan di luar ketentuan.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">G. HUKUM YANG BERLAKU</h2>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Seluruh Syarat dan Ketentuan ini tunduk pada hukum Republik Indonesia. Apabila terjadi perselisihan, penyelesaian akan diupayakan secara musyawarah paling lama 60 (enam puluh) hari sebelum menempuh jalur hukum.
                                </p>
                            </section>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-8 text-center dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Dengan mendaftar dan mengikuti program Level Up Accounting, Anda menyatakan setuju dan terikat pada seluruh Syarat dan Ketentuan di atas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}