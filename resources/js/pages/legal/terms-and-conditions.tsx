import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';

export default function TermsAndConditions() {
    return (
        <UserLayout>
            <Head title="Syarat dan Ketentuan" />

            <div className="min-h-screen bg-background py-12 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Syarat dan Ketentuan</h1>
                            <p className="text-gray-600 dark:text-gray-400">Level Up Accounting</p>
                        </div>

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

                        <div className="mt-8 border-t border-gray-200 pt-8 text-center dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Dengan mendaftar dan mengikuti program di Level Up Accounting, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan yang berlaku.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}