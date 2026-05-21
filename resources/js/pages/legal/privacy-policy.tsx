import UserLayout from '@/layouts/user-layout';
import { Head, Link } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <UserLayout>
            <Head title="Kebijakan Privasi" />

            <div className="min-h-screen bg-background py-12 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Kebijakan Privasi</h1>
                            <p className="text-gray-600 dark:text-gray-400">Level Up Accounting</p>
                        </div>

                        <div className="prose prose-gray dark:prose-invert text-justify max-w-none">
                            <section className="mb-8">
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    Level Up Accounting (“Kami”) berkomitmen untuk melindungi privasi dan menjaga keamanan data pribadi setiap pengguna, peserta, maupun pengunjung platform kami (“Anda”). Kebijakan Privasi ini menjelaskan bagaimana Kami mengumpulkan, menggunakan, menyimpan, mengelola, dan melindungi informasi pribadi yang Anda berikan saat menggunakan layanan Level Up Accounting.
                                </p>
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    Dengan mengakses website, melakukan pendaftaran, atau menggunakan layanan yang tersedia pada platform Level Up Accounting, Anda dianggap telah membaca, memahami, dan menyetujui seluruh isi Kebijakan Privasi ini.
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Kebijakan ini berlaku untuk seluruh layanan, program pelatihan, webinar, kelas, sertifikasi, mentoring, serta fitur lain yang disediakan oleh Level Up Accounting.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">A. INFORMASI YANG DIKUMPULKAN SECARA OTOMATIS</h2>
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    Ketika Anda mengakses atau menggunakan platform Level Up Accounting, sistem kami dapat secara otomatis memperoleh dan mencatat informasi tertentu untuk mendukung operasional layanan, keamanan, serta peningkatan pengalaman pengguna, di antaranya:
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">a. Informasi Dasar Pengguna</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Meliputi nama, alamat email, nomor telepon, serta informasi akun yang Anda berikan saat proses registrasi atau penggunaan layanan.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">b. Data Aktivitas Pengguna</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Mencakup aktivitas selama mengikuti program atau pelatihan, seperti materi yang dipelajari, progres pembelajaran, tingkat kehadiran, serta interaksi pada fitur-fitur yang tersedia di platform.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">c. Informasi Teknis</h3>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Termasuk alamat IP, jenis perangkat, sistem operasi, browser yang digunakan, waktu akses, dan data teknis lainnya yang diperlukan untuk menjaga keamanan sistem serta pengembangan layanan.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">B. INFORMASI YANG DIBERIKAN OLEH PENGGUNA</h2>
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    Level Up Accounting mengumpulkan data pribadi yang Anda berikan secara langsung melalui proses pendaftaran, pengisian formulir peserta, maupun komunikasi dengan tim kami. Informasi yang dapat dikumpulkan meliputi:
                                </p>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Nama lengkap</li>
                                    <li>Alamat email</li>
                                    <li>Nomor telepon</li>
                                    <li>Informasi pendidikan atau pekerjaan yang relevan dengan program</li>
                                    <li>Data lain yang diperlukan untuk kebutuhan administrasi dan proses pembelajaran</li>
                                </ul>
                                <p className="mt-4 text-gray-700 dark:text-gray-300">
                                    Informasi tersebut digunakan untuk mendukung proses registrasi, pelaksanaan program pelatihan, komunikasi dengan peserta, penerbitan sertifikat, serta layanan pendukung lainnya yang berkaitan dengan kegiatan pembelajaran.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">C. PENGGUNAAN INFORMASI</h2>
                                <p className="mb-3 text-gray-700 dark:text-gray-300">
                                    Data pribadi yang diperoleh akan digunakan untuk kepentingan operasional dan pengembangan layanan Level Up Accounting, termasuk namun tidak terbatas pada:
                                </p>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Menyediakan dan menjalankan program pelatihan serta layanan pendidikan</li>
                                    <li>Mengelola administrasi peserta, kehadiran, dan sertifikasi</li>
                                    <li>Meningkatkan kualitas materi, metode pembelajaran, dan pengalaman pengguna</li>
                                    <li>Menyampaikan informasi terkait jadwal kelas, pembaruan layanan, promo, maupun program terbaru</li>
                                    <li>Menjaga keamanan platform dan mencegah penyalahgunaan layanan</li>
                                    <li>Memenuhi kewajiban hukum sesuai ketentuan peraturan perundang-undangan yang berlaku di Indonesia</li>
                                </ul>
                                <p className="mt-4 text-gray-700 dark:text-gray-300">
                                    Level Up Accounting tidak menjual maupun memperdagangkan data pribadi pengguna kepada pihak mana pun.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">D. HAK PENGGUNA & PENGELOLAAN DATA</h2>
                                <p className="mb-3 text-gray-700 dark:text-gray-300">Sebagai pengguna layanan, Anda memiliki hak untuk:</p>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Meminta akses terhadap data pribadi yang tersimpan</li>
                                    <li>Memperbarui atau memperbaiki data yang tidak sesuai</li>
                                    <li>Mengajukan permohonan penghapusan data pribadi</li>
                                    <li>Menarik persetujuan atas penggunaan data tertentu sesuai ketentuan yang berlaku</li>
                                </ul>
                                <p className="mt-4 text-gray-700 dark:text-gray-300">
                                    Permohonan terkait pengelolaan data pribadi dapat disampaikan melalui kontak resmi Level Up Accounting.
                                </p>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">
                                    Apabila permintaan penghapusan akun disetujui, akses terhadap layanan akan dihentikan dan data akan dihapus atau disimpan sesuai kewajiban hukum yang berlaku.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">E. COOKIES</h2>
                                <p className="mb-3 text-gray-700 dark:text-gray-300">Level Up Accounting menggunakan cookies dan teknologi serupa untuk:</p>
                                <ul className="ml-4 list-inside list-disc space-y-2 text-gray-700 dark:text-gray-300">
                                    <li>Mengenali identitas pengguna saat mengakses platform</li>
                                    <li>Meningkatkan performa dan keamanan website</li>
                                    <li>Menyesuaikan pengalaman penggunaan layanan</li>
                                    <li>Membantu proses analisis dan pengembangan platform</li>
                                </ul>
                                <p className="mt-4 text-gray-700 dark:text-gray-300">
                                    Pengguna dapat mengatur atau menonaktifkan cookies melalui pengaturan browser masing-masing. Namun, hal tersebut dapat memengaruhi fungsi dan performa layanan tertentu pada platform.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">F. KEAMANAN DATA</h2>
                                <p className="mb-3 text-gray-700 dark:text-gray-300">
                                    Kami menerapkan langkah-langkah teknis dan administratif yang wajar untuk menjaga keamanan data pribadi pengguna dari akses, penggunaan, perubahan, maupun pengungkapan tanpa izin.
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Meskipun demikian, tidak ada sistem keamanan digital yang sepenuhnya bebas dari risiko. Oleh karena itu, pengguna juga bertanggung jawab untuk menjaga kerahasiaan akun dan informasi login pribadi masing-masing.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">G. PERUBAHAN KEBIJAKAN PRIVASI</h2>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Level Up Accounting berhak untuk memperbarui atau mengubah Kebijakan Privasi ini sewaktu-waktu sesuai kebutuhan layanan, perkembangan teknologi, maupun perubahan peraturan yang berlaku.
                                </p>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">
                                    Versi terbaru Kebijakan Privasi akan dipublikasikan melalui website resmi Level Up Accounting dan mulai berlaku sejak tanggal ditetapkan.
                                </p>
                            </section>

                            <section className="mb-8">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">H. HUBUNGI KAMI</h2>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Apabila Anda memiliki pertanyaan, saran, atau permintaan terkait Kebijakan Privasi ini, silakan menghubungi Level Up Accounting melalui kontak resmi yang tersedia pada website kami.
                                </p>
                            </section>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-8 text-center dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Dengan menggunakan layanan Level Up Accounting, Anda menyetujui kebijakan privasi di atas.
                            </p>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Baca juga{' '}
                                <Link href={route('terms-and-conditions')} className="text-blue-600 underline hover:text-blue-800">
                                    Syarat dan Ketentuan
                                </Link>{' '}
                                kami.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}