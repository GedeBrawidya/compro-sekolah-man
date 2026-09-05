import { Form, Head, usePage } from '@inertiajs/react';
/* @chisel-email-verification */
import { Link } from '@inertiajs/react';
/* @end-chisel-email-verification */
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
/* @chisel-email-verification */
import { send } from '@/routes/verification';
/* @end-chisel-email-verification */

type PageProps = {
    auth: Auth;
};

export default function Profile(
    /* @chisel-email-verification */
    {
        mustVerifyEmail,
        status,
    }: {
        mustVerifyEmail: boolean;
        status?: string;
    },
    /* @end-chisel-email-verification */
) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Pengaturan Profil" />

            <div className="space-y-6">
                <div className="border-b border-[#b8ceb0] pb-4">
                    <h2 className="text-lg font-bold text-[#142921]">Informasi Profil</h2>
                    <p className="text-xs font-semibold text-[#2e5445] mt-1">Perbarui nama dan alamat email akun pengguna Anda.</p>
                </div>

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6 max-w-xl"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-xs font-extrabold text-[#142921]">Nama Lengkap</Label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    defaultValue={auth.user.name}
                                    required
                                    autoComplete="name"
                                    placeholder="Masukkan nama lengkap"
                                    style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0', color: '#142921' }}
                                    className="w-full px-4 py-2.5 text-xs rounded-xl border font-semibold placeholder:text-[#527365] focus:outline-none focus:ring-2 focus:ring-[#265243] transition-all"
                                />

                                <InputError
                                    className="mt-1 text-xs text-rose-600"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-extrabold text-[#142921]">Alamat Email</Label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={auth.user.email}
                                    required
                                    autoComplete="username"
                                    placeholder="nama@email.com"
                                    style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0', color: '#142921' }}
                                    className="w-full px-4 py-2.5 text-xs rounded-xl border font-semibold placeholder:text-[#527365] focus:outline-none focus:ring-2 focus:ring-[#265243] transition-all"
                                />

                                <InputError
                                    className="mt-1 text-xs text-rose-600"
                                    message={errors.email}
                                />
                            </div>

                            {/* @chisel-email-verification */}
                            {mustVerifyEmail &&
                                auth.user.email_verified_at === null && (
                                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                                        <p className="font-semibold">
                                            Alamat email Anda belum terverifikasi.{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="underline font-bold text-amber-900 hover:text-black transition-colors"
                                            >
                                                Klik di sini untuk mengirim ulang email verifikasi.
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-xs font-bold text-emerald-700">
                                                Link verifikasi baru telah dikirim ke alamat email Anda.
                                            </div>
                                        )}
                                    </div>
                                )}
                            {/* @end-chisel-email-verification */}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    data-test="update-profile-button"
                                    style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                    className="px-6 py-2.5 rounded-xl hover:bg-[#1f4337] text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <div className="pt-6 border-t border-[#b8ceb0]">
                <DeleteUser />
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Profil',
            href: edit(),
        },
    ],
};
