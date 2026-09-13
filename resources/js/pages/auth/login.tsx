import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
/* @chisel-registration */
import { register } from '@/routes';
/* @end-chisel-registration */
import { store } from '@/routes/login';
import { request } from '@/routes/password';
/* @chisel-passkeys */
import PasskeyVerify from '@/components/passkey-verify';
/* @end-chisel-passkeys */

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk - Portal Admin" />

            {/* @chisel-passkeys */}
            <PasskeyVerify />
            {/* @end-chisel-passkeys */}

            {status && (
                <div className="mb-5 flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm font-medium text-emerald-300">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Email field */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-extrabold text-[#142921] uppercase tracking-wider">
                                Email Address
                            </Label>
                            <div className="relative">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#527365]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@sekolah.com"
                                    className="pl-10 rounded-2xl border-[#c8dac5] focus:ring-[#265243] focus:border-[#265243] bg-[#f8faf7] text-[#142921] font-semibold text-sm h-11"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        {/* Password field */}
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-extrabold text-[#142921] uppercase tracking-wider">
                                    Kata Sandi
                                </Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-xs font-bold text-[#265243] hover:text-[#142921] transition-colors"
                                        tabIndex={5}
                                    >
                                        Lupa password?
                                    </TextLink>
                                )}
                            </div>
                            <div className="relative">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#527365] z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Masukkan kata sandi"
                                    className="pl-10 rounded-2xl border-[#c8dac5] focus:ring-[#265243] focus:border-[#265243] bg-[#f8faf7] text-[#142921] font-semibold text-sm h-11"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center gap-2.5">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                                className="border-[#c8dac5] data-[state=checked]:bg-[#265243] data-[state=checked]:border-[#265243]"
                            />
                            <Label htmlFor="remember" className="text-sm font-medium text-[#527365] cursor-pointer">
                                Ingat saya
                            </Label>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full h-11 rounded-2xl bg-[#265243] hover:bg-[#142921] text-white font-black text-sm transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] mt-1"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner />}
                            {processing ? 'Memproses...' : 'Masuk ke Portal'}
                        </Button>

                        {/* Divider */}
                        <div className="relative flex items-center gap-3 my-1">
                            <div className="flex-1 h-px bg-[#e2ebd9]" />
                            <span className="text-[11px] text-[#527365] font-bold">atau</span>
                            <div className="flex-1 h-px bg-[#e2ebd9]" />
                        </div>

                        {/* @chisel-registration */}
                        <div className="text-center text-sm text-[#527365] font-medium">
                            Belum punya akun?{' '}
                            <TextLink href={register()} tabIndex={5} className="font-extrabold text-[#265243] hover:text-[#142921]">
                                Daftar sekarang
                            </TextLink>
                        </div>
                        {/* @end-chisel-registration */}
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Selamat Datang Kembali',
    description: 'Masuk ke portal administrasi sekolah',
};
