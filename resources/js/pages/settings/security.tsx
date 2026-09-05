import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/security';
/* @chisel-passkeys */
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
/* @end-chisel-passkeys */
/* @chisel-2fa */
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
/* @end-chisel-2fa */

// oxfmt-ignore
type Props = {
    passwordRules: string;
} /* @chisel-passkeys */ & ManagePasskeysProps /* @end-chisel-passkeys */ /* @chisel-2fa */ &
    ManageTwoFactorProps /* @end-chisel-2fa */;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Pengaturan Keamanan" />

            <div className="space-y-6">
                <div className="border-b border-[#b8ceb0] pb-4">
                    <h2 className="text-lg font-bold text-[#142921]">Perbarui Kata Sandi</h2>
                    <p className="text-xs font-semibold text-[#2e5445] mt-1">Pastikan akun Anda menggunakan kata sandi yang kuat dan aman.</p>
                </div>

                <Form
                    {...SecurityController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    resetOnError={[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="space-y-6 max-w-xl"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="current_password" className="text-xs font-extrabold text-[#142921]">
                                    Kata Sandi Saat Ini
                                </Label>

                                <PasswordInput
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    autoComplete="current-password"
                                    placeholder="Masukkan kata sandi saat ini"
                                    style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0', color: '#142921' }}
                                    className="w-full px-4 py-2.5 text-xs rounded-xl border font-semibold placeholder:text-[#527365]"
                                />

                                <InputError message={errors.current_password} className="text-xs text-rose-600" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-xs font-extrabold text-[#142921]">Kata Sandi Baru</Label>

                                <PasswordInput
                                    id="password"
                                    ref={passwordInput}
                                    name="password"
                                    autoComplete="new-password"
                                    placeholder="Masukkan kata sandi baru"
                                    passwordrules={props.passwordRules}
                                    style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0', color: '#142921' }}
                                    className="w-full px-4 py-2.5 text-xs rounded-xl border font-semibold placeholder:text-[#527365]"
                                />

                                <InputError message={errors.password} className="text-xs text-rose-600" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-xs font-extrabold text-[#142921]">
                                    Konfirmasi Kata Sandi Baru
                                </Label>

                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    placeholder="Ulangi kata sandi baru"
                                    passwordrules={props.passwordRules}
                                    style={{ backgroundColor: '#ffffff', borderColor: '#b8ceb0', color: '#142921' }}
                                    className="w-full px-4 py-2.5 text-xs rounded-xl border font-semibold placeholder:text-[#527365]"
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                    className="text-xs text-rose-600"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    data-test="update-password-button"
                                    style={{ backgroundColor: '#265243', color: '#ffffff' }}
                                    className="px-6 py-2.5 rounded-xl hover:bg-[#1f4337] text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Kata Sandi'}
                                </button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            {/* @chisel-2fa */}
            <ManageTwoFactor
                canManageTwoFactor={props.canManageTwoFactor}
                requiresConfirmation={props.requiresConfirmation}
                twoFactorEnabled={props.twoFactorEnabled}
            />
            {/* @end-chisel-2fa */}

            {/* @chisel-passkeys */}
            <ManagePasskeys
                canManagePasskeys={props.canManagePasskeys}
                passkeys={props.passkeys}
            />
            {/* @end-chisel-passkeys */}
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Keamanan & Password',
            href: edit(),
        },
    ],
};
