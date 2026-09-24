
import { Form, Head } from '@inertiajs/react';

export default function Login() {
    return (
        <>
            <Head title="Login" />

            <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                    <h1 className="mb-2 text-2xl font-bold text-slate-900">
                        Welcome Back
                    </h1>

                    <p className="mb-6 text-sm text-slate-500">
                        Login to your Job Tracker account.
                    </p>

                    <Form action="/login" method="post" className="space-y-4">
                        {({ errors, processing }) => (
                            <>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
                                        required
                                    />

                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-1 block text-sm font-medium text-slate-700"
                                    >
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
                                        required
                                    />

                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Logging in...' : 'Login'}
                                </button>
                            </>
                        )}
                    </Form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <a
                            href="/register"
                            className="font-medium text-slate-900 hover:underline"
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}

