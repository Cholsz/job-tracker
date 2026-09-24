import { Form, Head, Link } from '@inertiajs/react';
import NotificationReminder from '../components/NotificationReminder';

type JobApplication = {
    id: number;
    company_name: string;
    position: string;
    location: string | null;
    applied_at: string | null;
    status: string;
};

type Interview = {
    id: number;
    job_application_id: number;
    interview_date: string;
    interview_type: string;
    interviewer: string | null;
    location: string | null;
    meeting_url: string | null;
    result: string;
    job_application: {
        company_name: string;
        position: string;
    };
};

type FollowUp = {
    id: number;
    job_application_id: number;
    follow_up_date: string;
    type: string;
    notes: string | null;
    status: string;
    job_application: {
        company_name: string;
        position: string;
    };
};

type Statistics = {
    total: number;
    interview: number;
    offer: number;
    rejected: number;
    pendingFollowUps: number;
    overdueFollowUps: number;
};

type Props = {
    applications?: JobApplication[];
    upcomingInterviews?: Interview[];
    upcomingFollowUps?: FollowUp[];
    overdueFollowUps?: FollowUp[];
    statistics?: Statistics;
};

function formatStatus(status: string) {
    const statuses: Record<string, string> = {
        applied: 'Applied',
        screening: 'Screening',
        interview: 'Interview',
        offer: 'Offer',
        rejected: 'Rejected',
    };

    return statuses[status] ?? status;
}

function getStatusClass(status: string) {
    const classes: Record<string, string> = {
        applied: 'bg-blue-50 text-blue-700 ring-blue-200',
        screening: 'bg-purple-50 text-purple-700 ring-purple-200',
        interview: 'bg-amber-50 text-amber-700 ring-amber-200',
        offer: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        rejected: 'bg-red-50 text-red-700 ring-red-200',
    };

    return (
        classes[status] ??
        'bg-slate-50 text-slate-700 ring-slate-200'
    );
}

function formatDate(date: string | null) {
    if (!date) {
        return '-';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatDateTime(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatInterviewResult(result: string) {
    const results: Record<string, string> = {
        scheduled: 'Terjadwal',
        passed: 'Lolos',
        failed: 'Tidak Lolos',
        cancelled: 'Dibatalkan',
    };

    return results[result] ?? result;
}

function getInterviewResultClass(result: string) {
    const classes: Record<string, string> = {
        scheduled: 'bg-blue-50 text-blue-700 ring-blue-200',
        passed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        failed: 'bg-red-50 text-red-700 ring-red-200',
        cancelled: 'bg-slate-50 text-slate-700 ring-slate-200',
    };

    return (
        classes[result] ??
        'bg-slate-50 text-slate-700 ring-slate-200'
    );
}

function formatFollowUpDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function formatFollowUpType(type: string) {
    const types: Record<string, string> = {
        follow_up: 'Follow-up Lamaran',
        email: 'Email',
        phone: 'Telepon',
        whatsapp: 'WhatsApp',
        linkedin: 'LinkedIn',
        other: 'Lainnya',
    };

    return types[type] ?? type;
}

function getDaysOverdue(date: string) {
    const target = new Date(date);
    const today = new Date();

    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const difference = today.getTime() - target.getTime();

    return Math.max(
        1,
        Math.ceil(difference / (1000 * 60 * 60 * 24)),
    );
}

function isToday(date: string) {
    const target = new Date(date);
    const today = new Date();

    return (
        target.getFullYear() === today.getFullYear() &&
        target.getMonth() === today.getMonth() &&
        target.getDate() === today.getDate()
    );
}

function isTomorrow(date: string) {
    const target = new Date(date);
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
        target.getFullYear() === tomorrow.getFullYear() &&
        target.getMonth() === tomorrow.getMonth() &&
        target.getDate() === tomorrow.getDate()
    );
}

export default function Dashboard({
    applications = [],
    upcomingInterviews = [],
    upcomingFollowUps = [],
    overdueFollowUps = [],
    statistics = {
        total: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
        pendingFollowUps: 0,
        overdueFollowUps: 0,
    },
}: Props) {
    const todayInterviews = upcomingInterviews.filter((item) =>
        isToday(item.interview_date),
    );

    const tomorrowInterviews = upcomingInterviews.filter((item) =>
        isTomorrow(item.interview_date),
    );

    const todayFollowUps = upcomingFollowUps.filter((item) =>
        isToday(item.follow_up_date),
    );

    const tomorrowFollowUps = upcomingFollowUps.filter((item) =>
        isTomorrow(item.follow_up_date),
    );

    const futureFollowUps = upcomingFollowUps.filter(
        (item) =>
            !isToday(item.follow_up_date) &&
            !isTomorrow(item.follow_up_date),
    );

    const attentionCount =
        todayInterviews.length +
        tomorrowInterviews.length +
        todayFollowUps.length +
        tomorrowFollowUps.length +
        overdueFollowUps.length;

    return (
        <>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                    <header className="border-b border-slate-200 bg-white">
                        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                {/* Brand */}
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                        Career Tracker
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Kelola perjalanan pencarian kerja kamu.
                                    </p>
                                </div>

                                {/* Navigation & Actions */}
                                <div className="w-full lg:w-auto">
                                    {/* Main Navigation */}
                                    <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
                                        <Link
                                            href="/dashboard"
                                            className="rounded-lg bg-green-50 px-4 py-2.5 text-center text-sm font-semibold text-green-700 transition hover:bg-green-100"
                                        >
                                            Dashboard
                                        </Link>

                                        <Link
                                            href="/applications"
                                            className="rounded-lg px-4 py-2.5 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-green-700"
                                        >
                                            Lamaran
                                        </Link>

                                        <Link
                                            href="/calendar"
                                            className="rounded-lg px-4 py-2.5 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-green-700"
                                        >
                                            Calendar
                                        </Link>

                                        <Link
                                            href="/analytics"
                                            className="rounded-lg px-4 py-2.5 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-green-700"
                                        >
                                            Analytics
                                        </Link>
                                    </nav>

                                    {/* Action Buttons */}
                                    <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
                                        <Link
                                            href="/applications/create"
                                            className="inline-flex items-center justify-center rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                                        >
                                            + Tambah Lamaran
                                        </Link>

                                        <div className="flex items-center justify-center">
                                            <NotificationReminder
                                                upcomingInterviews={upcomingInterviews}
                                                upcomingFollowUps={upcomingFollowUps}
                                                overdueFollowUps={overdueFollowUps}
                                            />
                                        </div>

                                        <Form
                                            method="post"
                                            action="/logout"
                                            className="col-span-2 sm:col-span-1"
                                        >
                                            {({ processing }) => (
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                                >
                                                    {processing ? 'Logout...' : 'Logout'}
                                                </button>
                                            )}
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Welcome */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Dashboard
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Pantau semua aktivitas dan perkembangan lamaran
                            pekerjaan kamu.
                        </p>
                    </div>

                    {/* Follow-up Terlambat */}
                    <section className="mb-8">
                        <div className="mb-4">
                            <h2 className="text-lg font-bold text-slate-900">
                                Follow-up Terlambat
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Follow-up yang tanggalnya sudah lewat tetapi
                                belum dilakukan.
                            </p>
                        </div>

                        {overdueFollowUps.length === 0 ? (
                            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
                                        ✓
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            Tidak ada follow-up yang
                                            terlambat
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Semua follow-up masih sesuai
                                            jadwal.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {overdueFollowUps.map((followUp) => (
                                    <Link
                                        key={followUp.id}
                                        href={`/applications/${followUp.job_application_id}/follow-ups`}
                                        className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm transition hover:border-red-300 hover:bg-red-50/30"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {
                                                        followUp
                                                            .job_application
                                                            .company_name
                                                    }
                                                </p>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {
                                                        followUp
                                                            .job_application
                                                            .position
                                                    }
                                                </p>

                                                <p className="mt-3 text-sm text-red-600">
                                                    Terlambat{' '}
                                                    {getDaysOverdue(
                                                        followUp.follow_up_date,
                                                    )}{' '}
                                                    hari
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                                                Terlambat
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                                            <span>
                                                {formatFollowUpType(
                                                    followUp.type,
                                                )}
                                            </span>

                                            <span>
                                                {formatFollowUpDate(
                                                    followUp.follow_up_date,
                                                )}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Perlu Perhatian */}
                    <section className="mb-8">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Perlu Perhatian
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Agenda interview dan follow-up terdekat.
                                </p>
                            </div>

                            <Link
                                href="/calendar"
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                Lihat Calendar →
                            </Link>
                        </div>

                        {attentionCount === 0 ? (
                            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
                                        ✓
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            Tidak ada agenda terdekat
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Saat ini tidak ada interview atau
                                            follow-up yang perlu diperhatikan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                Hari Ini
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Aktivitas yang harus diperhatikan
                                                hari ini.
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                            {todayInterviews.length +
                                                todayFollowUps.length}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {todayInterviews.map((interview) => (
                                            <Link
                                                key={`today-interview-${interview.id}`}
                                                href={`/applications/${interview.job_application_id}`}
                                                className="block rounded-xl bg-amber-50 p-3 transition hover:bg-amber-100"
                                            >
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Interview —{' '}
                                                    {
                                                        interview
                                                            .job_application
                                                            .company_name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-600">
                                                    {formatDateTime(
                                                        interview.interview_date,
                                                    )}
                                                </p>
                                            </Link>
                                        ))}

                                        {todayFollowUps.map((followUp) => (
                                            <Link
                                                key={`today-followup-${followUp.id}`}
                                                href={`/applications/${followUp.job_application_id}/follow-ups`}
                                                className="block rounded-xl bg-blue-50 p-3 transition hover:bg-blue-100"
                                            >
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Follow-up —{' '}
                                                    {
                                                        followUp
                                                            .job_application
                                                            .company_name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-600">
                                                    {formatFollowUpType(
                                                        followUp.type,
                                                    )}
                                                </p>
                                            </Link>
                                        ))}

                                        {todayInterviews.length === 0 &&
                                            todayFollowUps.length === 0 && (
                                                <p className="py-4 text-center text-xs text-slate-400">
                                                    Tidak ada aktivitas hari
                                                    ini.
                                                </p>
                                            )}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                Besok
                                            </h3>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Agenda yang perlu dipersiapkan.
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                            {tomorrowInterviews.length +
                                                tomorrowFollowUps.length}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {tomorrowInterviews.map((interview) => (
                                            <Link
                                                key={`tomorrow-interview-${interview.id}`}
                                                href={`/applications/${interview.job_application_id}`}
                                                className="block rounded-xl bg-amber-50 p-3 transition hover:bg-amber-100"
                                            >
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Interview —{' '}
                                                    {
                                                        interview
                                                            .job_application
                                                            .company_name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-600">
                                                    {formatDateTime(
                                                        interview.interview_date,
                                                    )}
                                                </p>
                                            </Link>
                                        ))}

                                        {tomorrowFollowUps.map((followUp) => (
                                            <Link
                                                key={`tomorrow-followup-${followUp.id}`}
                                                href={`/applications/${followUp.job_application_id}/follow-ups`}
                                                className="block rounded-xl bg-blue-50 p-3 transition hover:bg-blue-100"
                                            >
                                                <p className="text-sm font-semibold text-slate-800">
                                                    Follow-up —{' '}
                                                    {
                                                        followUp
                                                            .job_application
                                                            .company_name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-600">
                                                    {formatFollowUpType(
                                                        followUp.type,
                                                    )}
                                                </p>
                                            </Link>
                                        ))}

                                        {tomorrowInterviews.length === 0 &&
                                            tomorrowFollowUps.length === 0 && (
                                                <p className="py-4 text-center text-xs text-slate-400">
                                                    Tidak ada aktivitas besok.
                                                </p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Statistics */}
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">
                                Total Lamaran
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {statistics.total}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-blue-600">
                                Applied
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {applications.filter(
                                    (application) =>
                                        application.status === 'applied',
                                ).length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-purple-600">
                                Screening
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {applications.filter(
                                    (application) =>
                                        application.status === 'screening',
                                ).length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-amber-600">
                                Interview
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {statistics.interview}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-emerald-600">
                                Offer
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {statistics.offer}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-red-600">
                                Rejected
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                {statistics.rejected}
                            </p>
                        </div>
                    </section>

                    {/* Upcoming Interviews */}
                    <section className="mt-8">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Interview Mendatang
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Interview yang akan datang.
                                </p>
                            </div>

                            <Link
                                href="/calendar"
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                Lihat Calendar →
                            </Link>
                        </div>

                        {upcomingInterviews.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-xl">
                                    🎤
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-slate-900">
                                    Belum ada interview mendatang
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Interview yang akan datang akan muncul di
                                    sini.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingInterviews.map((interview) => (
                                    <div
                                        key={interview.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200"
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {
                                                            interview
                                                                .job_application
                                                                .position
                                                        }
                                                    </h3>

                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getInterviewResultClass(
                                                            interview.result,
                                                        )}`}
                                                    >
                                                        {formatInterviewResult(
                                                            interview.result,
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {
                                                        interview
                                                            .job_application
                                                            .company_name
                                                    }
                                                </p>

                                                <div className="mt-3 space-y-1 text-sm text-slate-600">
                                                    <p>
                                                        📅{' '}
                                                        {formatDateTime(
                                                            interview.interview_date,
                                                        )}
                                                    </p>

                                                    <p>
                                                        🎯{' '}
                                                        {
                                                            interview.interview_type
                                                        }
                                                    </p>

                                                    {interview.interviewer && (
                                                        <p>
                                                            👤{' '}
                                                            {
                                                                interview.interviewer
                                                            }
                                                        </p>
                                                    )}

                                                    {interview.location && (
                                                        <p>
                                                            📍{' '}
                                                            {
                                                                interview.location
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {interview.meeting_url && (
                                                    <a
                                                        href={
                                                            interview.meeting_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                                    >
                                                        Join Meeting
                                                    </a>
                                                )}

                                                <Link
                                                    href={`/interviews/${interview.id}/edit`}
                                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Follow-up */}
                    <section className="mt-8">
                        <div className="mb-5">
                            <h2 className="text-lg font-bold text-slate-900">
                                Follow-up yang Perlu Dilakukan
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Jadwal follow-up yang belum dilakukan.
                            </p>
                        </div>

                        {upcomingFollowUps.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-xl">
                                    ✓
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-slate-900">
                                    Tidak ada follow-up
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Saat ini tidak ada follow-up yang perlu
                                    dilakukan.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingFollowUps.map((followUp) => (
                                    <div
                                        key={followUp.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200"
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <h3 className="font-semibold text-slate-900">
                                                    {
                                                        followUp
                                                            .job_application
                                                            .position
                                                    }
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {
                                                        followUp
                                                            .job_application
                                                            .company_name
                                                    }
                                                </p>

                                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-semibold text-emerald-600">
                                                        {formatFollowUpDate(
                                                            followUp.follow_up_date,
                                                        )}
                                                    </span>

                                                    <span className="text-slate-300">
                                                        •
                                                    </span>

                                                    <span className="text-sm text-slate-600">
                                                        {formatFollowUpType(
                                                            followUp.type,
                                                        )}
                                                    </span>
                                                </div>

                                                {followUp.notes && (
                                                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                                                        {followUp.notes}
                                                    </p>
                                                )}
                                            </div>

                                            <Link
                                                href={`/applications/${followUp.job_application_id}`}
                                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                                            >
                                                Lihat Lamaran →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Recent Applications */}
                    <section className="mt-8">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Recent Applications
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Lamaran pekerjaan terbaru.
                                </p>
                            </div>

                            <Link
                                href="/applications"
                                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                            >
                                Lihat Semua →
                            </Link>
                        </div>

                        {applications.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-xl">
                                    💼
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-slate-900">
                                    Belum ada lamaran
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Mulai catat lamaran pekerjaan kamu.
                                </p>

                                <Link
                                    href="/applications/create"
                                    className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                >
                                    + Tambah Lamaran
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {applications.slice(0, 6).map((application) => (
                                    <div
                                        key={application.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="truncate font-semibold text-slate-900">
                                                    {application.position}
                                                </h3>

                                                <p className="mt-1 truncate text-sm text-slate-500">
                                                    {application.company_name}
                                                </p>

                                                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                                                    {application.location && (
                                                        <span>
                                                            📍{' '}
                                                            {
                                                                application.location
                                                            }
                                                        </span>
                                                    )}

                                                    <span>
                                                        📅{' '}
                                                        {formatDate(
                                                            application.applied_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getStatusClass(
                                                    application.status,
                                                )}`}
                                            >
                                                {formatStatus(
                                                    application.status,
                                                )}
                                            </span>
                                        </div>

                                        <div className="mt-5 flex gap-2">
                                            <Link
                                                href={`/applications/${application.id}`}
                                                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                                            >
                                                Detail
                                            </Link>

                                            <Link
                                                href={`/applications/${application.id}/edit`}
                                                className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-center text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-600"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Quick Navigation */}
                    <section className="mt-8 grid gap-4 sm:grid-cols-3">
                        <Link
                            href="/applications/create"
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                        >
                            <p className="text-sm font-bold text-slate-900">
                                + Tambah Lamaran
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Catat lowongan baru.
                            </p>
                        </Link>

                        <Link
                            href="/calendar"
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                        >
                            <p className="text-sm font-bold text-slate-900">
                                📅 Calendar
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Lihat interview dan follow-up.
                            </p>
                        </Link>

                        <Link
                            href="/analytics"
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                        >
                            <p className="text-sm font-bold text-slate-900">
                                📊 Analytics
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Lihat perkembangan pencarian kerja.
                            </p>
                        </Link>
                    </section>
                </main>
            </div>
        </>
    );
}