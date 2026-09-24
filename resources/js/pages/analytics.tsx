 import { Head, Link } from '@inertiajs/react';

    type Summary = {
        totalApplications: number;
        applied: number;
        screening: number;
        interview: number;
        offer: number;
        rejected: number;
        offerRate: number;
        interviewRate: number;
    };

    type StatusBreakdown = { status: string; label: string; count: number };
    type EmploymentTypeBreakdown = { type: string; count: number };
    type MonthlyApplication = { month: string; count: number };
    type InterviewStats = { total: number; passed: number; failed: number };
    type FollowUpStats = { total: number; completed: number; pending: number; overdue: number };

    type Props = {
        summary: Summary;
        statusBreakdown: StatusBreakdown[];
        employmentTypeBreakdown: EmploymentTypeBreakdown[];
        monthlyApplications: MonthlyApplication[];
        interviews: InterviewStats;
        followUps: FollowUpStats;
    };

    function formatEmploymentType(type: string) {
        const types: Record<string, string> = {
            full_time: 'Full Time',
            part_time: 'Part Time',
            internship: 'Internship',
            contract: 'Contract',
            freelance: 'Freelance',
            remote: 'Remote',
        };

        return types[type] ?? type;
    }

    function formatMonth(month: string) {
        const [year, monthNumber] = month.split('-');
        return new Date(Number(year), Number(monthNumber) - 1, 1).toLocaleDateString('id-ID', {
            month: 'short',
            year: 'numeric',
        });
    }

    function getStatusBarClass(status: string) {
        const classes: Record<string, string> = {
            applied: 'bg-blue-500',
            screening: 'bg-purple-500',
            interview: 'bg-amber-500',
            offer: 'bg-emerald-500',
            rejected: 'bg-red-500',
        };
        return classes[status] ?? 'bg-slate-400';
    }

    function getStatusBadgeClass(status: string) {
        const classes: Record<string, string> = {
            applied: 'bg-blue-50 text-blue-700',
            screening: 'bg-purple-50 text-purple-700',
            interview: 'bg-amber-50 text-amber-700',
            offer: 'bg-emerald-50 text-emerald-700',
            rejected: 'bg-red-50 text-red-700',
        };
        return classes[status] ?? 'bg-slate-50 text-slate-700';
    }

    export default function Analytics({
        summary,
        statusBreakdown,
        employmentTypeBreakdown,
        monthlyApplications,
        interviews,
        followUps,
    }: Props) {
        const maxMonthlyApplications = Math.max(...monthlyApplications.map((item) => item.count), 1);
        const maxEmploymentCount = Math.max(...employmentTypeBreakdown.map((item) => item.count), 1);

        return (
            <>
                <Head title="Analytics" />

                <div className="min-h-screen bg-slate-50 text-slate-800">
                    <header className="border-b border-slate-200 bg-white">
                        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Career Tracker</h1>
                                    <p className="mt-1 text-sm text-slate-500">Analisis perjalanan pencarian kerja kamu.</p>
                                </div>

                                <div className="w-full lg:w-auto">
                                    <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
                                        <Link href="/dashboard" className="rounded-lg px-4 py-2.5 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-green-700">Dashboard</Link>
                                        <Link href="/applications" className="rounded-lg px-4 py-2.5 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-green-700">Lamaran</Link>
                                        <Link href="/calendar" className="rounded-lg px-4 py-2.5 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-green-700">Calendar</Link>
                                        <Link href="/analytics" className="rounded-lg bg-green-50 px-4 py-2.5 text-center text-sm font-semibold text-green-700">Analytics</Link>
                                    </nav>

                                    <div className="mt-3 flex flex-col gap-2 sm:flex-row lg:justify-end">
                                        <Link href="/applications/create" className="inline-flex items-center justify-center rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800">+ Tambah Lamaran</Link>
                                        <Link href="/dashboard" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-green-700">Kembali ke Dashboard</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <p className="text-sm font-semibold uppercase tracking-wider text-green-700">Analytics</p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Perkembangan Pencarian Kerja</h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Lihat ringkasan, distribusi status, aktivitas lamaran, interview, dan follow-up kamu.</p>
                        </div>

                        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                ['Total Lamaran', summary.totalApplications, 'Semua lamaran yang tercatat', 'text-slate-900', 'border-slate-200'],
                                ['Interview', summary.interview, `${summary.interviewRate}% dari total lamaran`, 'text-amber-600', 'border-amber-100'],
                                ['Offer', summary.offer, `${summary.offerRate}% dari total lamaran`, 'text-emerald-600', 'border-emerald-100'],
                                ['Rejected', summary.rejected, 'Lamaran yang tidak berlanjut', 'text-red-600', 'border-red-100'],
                            ].map(([label, value, description, valueClass, borderClass]) => (
                                <div key={String(label)} className={`rounded-2xl border ${borderClass} bg-white p-5 shadow-sm`}>
                                    <p className="text-sm font-medium text-slate-500">{label}</p>
                                    <p className={`mt-3 text-3xl font-bold ${valueClass}`}>{value}</p>
                                    <p className="mt-2 text-xs text-slate-400">{description}</p>
                                </div>
                            ))}
                        </section>

                        <section className="mt-6 grid gap-6 lg:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                                <h3 className="text-lg font-bold text-slate-900">Status Lamaran</h3>
                                <p className="mt-1 text-sm text-slate-500">Distribusi lamaran berdasarkan status terakhir.</p>

                                <div className="mt-6 space-y-5">
                                    {statusBreakdown.map((item) => {
                                        const percentage = summary.totalApplications > 0 ? (item.count / summary.totalApplications) * 100 : 0;
                                        return (
                                            <div key={item.status}>
                                                <div className="mb-2 flex items-center justify-between gap-3">
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(item.status)}`}>{item.label}</span>
                                                    <span className="text-sm font-semibold text-slate-700">{item.count}</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                    <div className={`h-full rounded-full ${getStatusBarClass(item.status)}`} style={{ width: `${percentage}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900">Conversion</h3>
                                <p className="mt-1 text-sm text-slate-500">Ringkasan perpindahan status lamaran.</p>

                                <div className="mt-6 space-y-4">
                                    <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">Applied</p><p className="mt-1 text-2xl font-bold text-slate-900">{summary.applied}</p></div>
                                    <div className="rounded-xl bg-purple-50 p-4"><p className="text-xs font-medium uppercase tracking-wide text-purple-500">Screening</p><p className="mt-1 text-2xl font-bold text-purple-700">{summary.screening}</p></div>
                                    <div className="rounded-xl bg-amber-50 p-4"><p className="text-xs font-medium uppercase tracking-wide text-amber-500">Interview</p><p className="mt-1 text-2xl font-bold text-amber-700">{summary.interview}</p></div>
                                    <div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs font-medium uppercase tracking-wide text-emerald-500">Offer Rate</p><p className="mt-1 text-2xl font-bold text-emerald-700">{summary.offerRate}%</p></div>
                                </div>
                            </div>
                        </section>

                        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900">Aktivitas Lamaran per Bulan</h3>
                            <p className="mt-1 text-sm text-slate-500">Jumlah lamaran yang kamu catat setiap bulan.</p>

                            {monthlyApplications.length === 0 ? (
                                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                                    <p className="text-sm font-semibold text-slate-600">Belum ada data bulanan.</p>
                                    <p className="mt-1 text-sm text-slate-400">Tambahkan beberapa lamaran untuk melihat perkembangan aktivitas.</p>
                                </div>
                            ) : (
                                <div className="mt-8 overflow-x-auto">
                                    <div className="flex min-w-[600px] items-end gap-4">
                                        {monthlyApplications.map((item) => {
                                            const height = (item.count / maxMonthlyApplications) * 100;
                                            return (
                                                <div key={item.month} className="flex min-w-[70px] flex-1 flex-col items-center">
                                                    <span className="mb-2 text-sm font-bold text-slate-700">{item.count}</span>
                                                    <div className="flex h-48 w-full max-w-16 items-end rounded-lg bg-slate-50">
                                                        <div className="w-full rounded-lg bg-green-600" style={{ height: `${Math.max(height, 5)}%` }} />
                                                    </div>
                                                    <span className="mt-3 text-center text-xs font-medium text-slate-500">{formatMonth(item.month)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="mt-6 grid gap-6 lg:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900">Tipe Pekerjaan</h3>
                                <p className="mt-1 text-sm text-slate-500">Jenis pekerjaan yang paling sering kamu lamar.</p>

                                {employmentTypeBreakdown.length === 0 ? (
                                    <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center"><p className="text-sm text-slate-500">Belum ada data tipe pekerjaan.</p></div>
                                ) : (
                                    <div className="mt-6 space-y-5">
                                        {employmentTypeBreakdown.map((item) => {
                                            const percentage = (item.count / maxEmploymentCount) * 100;
                                            return (
                                                <div key={item.type}>
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-700">{formatEmploymentType(item.type)}</span>
                                                        <span className="text-sm font-bold text-slate-900">{item.count}</span>
                                                    </div>
                                                    <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-green-600" style={{ width: `${percentage}%` }} /></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900">Interview</h3>
                                <p className="mt-1 text-sm text-slate-500">Ringkasan hasil interview kamu.</p>
                                <div className="mt-6 grid grid-cols-3 gap-3">
                                    <div className="rounded-xl bg-blue-50 p-4 text-center"><p className="text-xs font-medium text-blue-500">Total</p><p className="mt-2 text-2xl font-bold text-blue-700">{interviews.total}</p></div>
                                    <div className="rounded-xl bg-emerald-50 p-4 text-center"><p className="text-xs font-medium text-emerald-500">Lolos</p><p className="mt-2 text-2xl font-bold text-emerald-700">{interviews.passed}</p></div>
                                    <div className="rounded-xl bg-red-50 p-4 text-center"><p className="text-xs font-medium text-red-500">Tidak Lolos</p><p className="mt-2 text-2xl font-bold text-red-700">{interviews.failed}</p></div>
                                </div>
                            </div>
                        </section>

                        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900">Follow-up</h3>
                            <p className="mt-1 text-sm text-slate-500">Ringkasan aktivitas follow-up lamaran.</p>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl bg-slate-50 p-5"><p className="text-sm font-medium text-slate-500">Total</p><p className="mt-2 text-3xl font-bold text-slate-900">{followUps.total}</p></div>
                                <div className="rounded-xl bg-emerald-50 p-5"><p className="text-sm font-medium text-emerald-600">Selesai</p><p className="mt-2 text-3xl font-bold text-emerald-700">{followUps.completed}</p></div>
                                <div className="rounded-xl bg-amber-50 p-5"><p className="text-sm font-medium text-amber-600">Pending</p><p className="mt-2 text-3xl font-bold text-amber-700">{followUps.pending}</p></div>
                                <div className="rounded-xl bg-red-50 p-5"><p className="text-sm font-medium text-red-600">Terlambat</p><p className="mt-2 text-3xl font-bold text-red-700">{followUps.overdue}</p></div>
                            </div>
                        </section>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link href="/applications" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-green-200 hover:text-green-700">← Lihat Semua Lamaran</Link>
                            <Link href="/calendar" className="rounded-xl bg-green-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-800">Lihat Calendar</Link>
                        </div>
                    </main>
                </div>
            </>
        );
    }