import { Head, Link } from '@inertiajs/react';

type Interview = {
    id: number;
    job_application_id: number;
    interview_date: string;
    interview_type: string;
    interviewer: string | null;
    meeting_url: string | null;
    location: string | null;
    notes: string | null;
    result: string;
};

type FollowUp = {
    id: number;
    job_application_id: number;
    follow_up_date: string;
    type: string;
    notes: string | null;
    status: string;
};

type JobApplication = {
    id: number;
    company_name: string;
    position: string;
    location: string | null;
    employment_type: string | null;
    source: string | null;
    job_url: string | null;
    applied_at: string | null;
    status: string;
    notes: string | null;
    interviews: Interview[];
    follow_ups: FollowUp[];
};

type Props = {
    application: JobApplication;
};

type TimelineItem = {
    id: string;
    type: 'application' | 'interview' | 'follow_up';
    date: string;
    title: string;
    description: string;
    status?: string;
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

    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function formatInterviewDate(date: string) {
    return new Date(date).toLocaleString('id-ID', {
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
    return new Date(date).toLocaleDateString('id-ID', {
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
        other: 'Lainnya',
    };

    return types[type] ?? type;
}

function formatFollowUpStatus(status: string) {
    const statuses: Record<string, string> = {
        pending: 'Belum Dilakukan',
        completed: 'Sudah Dilakukan',
        cancelled: 'Dibatalkan',
    };

    return statuses[status] ?? status;
}

function getFollowUpStatusClass(status: string) {
    const classes: Record<string, string> = {
        pending: 'bg-amber-50 text-amber-700 ring-amber-200',
        completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        cancelled: 'bg-red-50 text-red-700 ring-red-200',
    };

    return (
        classes[status] ??
        'bg-slate-50 text-slate-700 ring-slate-200'
    );
}

function getTimelineIcon(type: TimelineItem['type']) {
    if (type === 'application') {
        return '📩';
    }

    if (type === 'interview') {
        return '🎤';
    }

    return '📅';
}

function getTimelineIconClass(type: TimelineItem['type']) {
    if (type === 'application') {
        return 'bg-blue-50 text-blue-600';
    }

    if (type === 'interview') {
        return 'bg-amber-50 text-amber-600';
    }

    return 'bg-emerald-50 text-emerald-600';
}

function getTimelineStatusClass(status?: string) {
    if (!status) {
        return 'bg-slate-50 text-slate-600 ring-slate-200';
    }

    if (status === 'completed' || status === 'passed') {
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    }

    if (status === 'cancelled' || status === 'failed') {
        return 'bg-red-50 text-red-700 ring-red-200';
    }

    if (status === 'pending' || status === 'scheduled') {
        return 'bg-amber-50 text-amber-700 ring-amber-200';
    }

    return 'bg-slate-50 text-slate-600 ring-slate-200';
}

function getProgressSteps(status: string) {
    const steps = [
        {
            key: 'applied',
            label: 'Applied',
        },
        {
            key: 'screening',
            label: 'Screening',
        },
        {
            key: 'interview',
            label: 'Interview',
        },
        {
            key: 'offer',
            label: 'Offer',
        },
    ];

    if (status === 'rejected') {
        return [
            ...steps.slice(0, 3),
            {
                key: 'rejected',
                label: 'Rejected',
            },
        ];
    }

    return steps;
}

function getProgressIndex(status: string) {
    const steps = [
        'applied',
        'screening',
        'interview',
        'offer',
    ];

    return steps.indexOf(status);
}

export default function Show({ application }: Props) {
    const timeline: TimelineItem[] = [
        ...(application.applied_at
            ? [
                  {
                      id: `application-${application.id}`,
                      type: 'application' as const,
                      date: application.applied_at,
                      title: 'Lamaran Dikirim',
                      description: `Lamaran untuk posisi ${application.position} di ${application.company_name}.`,
                      status: application.status,
                  },
              ]
            : []),

        ...application.interviews.map((interview) => ({
            id: `interview-${interview.id}`,
            type: 'interview' as const,
            date: interview.interview_date,
            title: `Interview ${interview.interview_type}`,
            description: interview.interviewer
                ? `Interview dengan ${interview.interviewer}.`
                : 'Jadwal interview untuk lamaran ini.',
            status: interview.result,
        })),

        ...application.follow_ups.map((followUp) => ({
            id: `follow-up-${followUp.id}`,
            type: 'follow_up' as const,
            date: followUp.follow_up_date,
            title: formatFollowUpType(followUp.type),
            description:
                followUp.notes ||
                'Follow-up untuk lamaran pekerjaan ini.',
            status: followUp.status,
        })),
    ].sort(
        (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime(),
    );

    const progressSteps = getProgressSteps(application.status);
    const progressIndex = getProgressIndex(application.status);

    return (
        <>
            <Head
                title={`${application.position} - ${application.company_name}`}
            />

            <div className="min-h-screen bg-slate-50">
                {/* HEADER */}
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
                        {/* NAVIGATION */}
                        <nav className="flex flex-wrap items-center gap-2">
                            <Link
                                href="/dashboard"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/applications"
                                className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700"
                            >
                                Lamaran
                            </Link>

                            <Link
                                href="/calendar"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600"
                            >
                                Calendar
                            </Link>

                            <Link
                                href="/applications/create"
                                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                + Tambah Lamaran
                            </Link>
                        </nav>

                        {/* BACK LINK */}
                        <Link
                            href="/applications"
                            className="mt-6 inline-flex text-sm font-medium text-slate-500 transition hover:text-emerald-600"
                        >
                            ← Kembali ke Lamaran
                        </Link>

                        {/* PAGE HEADER */}
                        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-600">
                                    Detail Lamaran
                                </p>

                                <h1 className="mt-1 text-2xl font-bold text-slate-900">
                                    {application.position}
                                </h1>

                                <p className="mt-1 text-base text-slate-500">
                                    {application.company_name}
                                </p>
                            </div>

                            <Link
                                href={`/applications/${application.id}/edit`}
                                className="inline-flex w-fit rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-600"
                            >
                                Edit Lamaran
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* APPLICATION INFORMATION */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Informasi Lamaran
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Informasi utama mengenai lamaran pekerjaan.
                                </p>
                            </div>

                            <span
                                className={`inline-flex w-fit rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${getStatusClass(
                                    application.status,
                                )}`}
                            >
                                {formatStatus(application.status)}
                            </span>
                        </div>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Perusahaan
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {application.company_name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Posisi
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {application.position}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Lokasi
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {application.location || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Tipe Pekerjaan
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {application.employment_type || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Sumber
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {application.source || '-'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Tanggal Melamar
                                </p>

                                <p className="mt-1 font-semibold text-slate-900">
                                    {formatDate(application.applied_at)}
                                </p>
                            </div>
                        </div>

                        {application.job_url && (
                            <div className="mt-6 border-t border-slate-100 pt-5">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Link Lowongan
                                </p>

                                <a
                                    href={application.job_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 inline-block break-all text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                                >
                                    {application.job_url}
                                </a>
                            </div>
                        )}

                        {application.notes && (
                            <div className="mt-6 border-t border-slate-100 pt-5">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Catatan
                                </p>

                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                                    {application.notes}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* APPLICATION PROGRESS */}
                    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Progress Lamaran
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Posisi kamu saat ini dalam proses rekrutmen.
                            </p>
                        </div>

                        <div className="mt-8 overflow-x-auto pb-2">
                            <div className="flex min-w-[620px] items-start">
                                {progressSteps.map(
                                    (step, index, steps) => {
                                        const isRejected =
                                            application.status ===
                                                'rejected' &&
                                            step.key === 'rejected';

                                        const isCurrent =
                                            step.key ===
                                            application.status;

                                        const isCompleted =
                                            application.status !==
                                                'rejected' &&
                                            progressIndex > index;

                                        const isLast =
                                            index === steps.length - 1;

                                        return (
                                            <div
                                                key={step.key}
                                                className="flex min-w-0 flex-1 items-start"
                                            >
                                                <div className="flex min-w-0 flex-1 flex-col items-center">
                                                    <div
                                                        className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ring-4 ring-white ${
                                                            isRejected
                                                                ? 'bg-red-600 text-white'
                                                                : isCurrent
                                                                  ? 'bg-emerald-600 text-white'
                                                                  : isCompleted
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : 'bg-slate-100 text-slate-400'
                                                        }`}
                                                    >
                                                        {isCompleted
                                                            ? '✓'
                                                            : isRejected
                                                              ? '!'
                                                              : index + 1}
                                                    </div>

                                                    <p
                                                        className={`mt-3 text-center text-sm font-semibold ${
                                                            isRejected
                                                                ? 'text-red-600'
                                                                : isCurrent
                                                                  ? 'text-emerald-700'
                                                                  : isCompleted
                                                                    ? 'text-emerald-600'
                                                                    : 'text-slate-400'
                                                        }`}
                                                    >
                                                        {step.label}
                                                    </p>

                                                    {isCurrent && (
                                                        <span
                                                            className={`mt-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                isRejected
                                                                    ? 'bg-red-50 text-red-700'
                                                                    : 'bg-emerald-50 text-emerald-700'
                                                            }`}
                                                        >
                                                            {isRejected
                                                                ? 'Tidak Lolos'
                                                                : 'Saat Ini'}
                                                        </span>
                                                    )}
                                                </div>

                                                {!isLast && (
                                                    <div
                                                        className={`mt-5 h-0.5 flex-1 ${
                                                            isCompleted
                                                                ? 'bg-emerald-300'
                                                                : 'bg-slate-200'
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ACTIVITY TIMELINE */}
                    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Activity Timeline
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Riwayat perjalanan lamaran dari awal hingga
                                aktivitas terbaru.
                            </p>
                        </div>

                        {timeline.length === 0 ? (
                            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                                <div className="text-2xl">📋</div>

                                <p className="mt-2 text-sm font-semibold text-slate-700">
                                    Belum ada aktivitas
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Aktivitas lamaran akan muncul di sini.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6">
                                {timeline.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="relative flex gap-4"
                                    >
                                        {index < timeline.length - 1 && (
                                            <div className="absolute left-5 top-11 h-[calc(100%-1rem)] w-px bg-slate-200" />
                                        )}

                                        <div
                                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base ${getTimelineIconClass(
                                                item.type,
                                            )}`}
                                        >
                                            {getTimelineIcon(item.type)}
                                        </div>

                                        <div className="min-w-0 flex-1 pb-7">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">
                                                        {item.title}
                                                    </h3>

                                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <div className="shrink-0 text-left sm:text-right">
                                                    <p className="text-sm font-medium text-emerald-600">
                                                        {formatDate(item.date)}
                                                    </p>

                                                    {item.type ===
                                                        'interview' && (
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {new Date(
                                                                item.date,
                                                            ).toLocaleTimeString(
                                                                'id-ID',
                                                                {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                },
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {item.status && (
                                                <span
                                                    className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getTimelineStatusClass(
                                                        item.status,
                                                    )}`}
                                                >
                                                    {item.type ===
                                                    'application'
                                                        ? formatStatus(
                                                              item.status,
                                                          )
                                                        : item.type ===
                                                            'interview'
                                                          ? formatInterviewResult(
                                                                item.status,
                                                            )
                                                          : formatFollowUpStatus(
                                                                item.status,
                                                            )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* INTERVIEW */}
                    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Interview
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Jadwal dan riwayat interview untuk lamaran
                                    ini.
                                </p>
                            </div>

                            <Link
                                href={`/applications/${application.id}/interviews/create`}
                                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                + Tambah Interview
                            </Link>
                        </div>

                        {application.interviews.length === 0 ? (
                            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                                <div className="text-2xl">🎤</div>

                                <p className="mt-2 text-sm font-semibold text-slate-700">
                                    Belum ada interview
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Tambahkan jadwal interview jika perusahaan
                                    sudah menghubungi kamu.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-5 space-y-4">
                                {application.interviews.map((interview) => (
                                    <div
                                        key={interview.id}
                                        className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-200"
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {interview.interview_type}
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

                                                <p className="mt-2 text-sm font-medium text-emerald-600">
                                                    {formatInterviewDate(
                                                        interview.interview_date,
                                                    )}
                                                </p>

                                                <div className="mt-3 space-y-1 text-sm text-slate-600">
                                                    {interview.interviewer && (
                                                        <p>
                                                            <span className="font-medium text-slate-700">
                                                                Interviewer:
                                                            </span>{' '}
                                                            {
                                                                interview.interviewer
                                                            }
                                                        </p>
                                                    )}

                                                    {interview.location && (
                                                        <p>
                                                            <span className="font-medium text-slate-700">
                                                                Lokasi:
                                                            </span>{' '}
                                                            {interview.location}
                                                        </p>
                                                    )}
                                                </div>

                                                {interview.meeting_url && (
                                                    <a
                                                        href={
                                                            interview.meeting_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-3 inline-flex text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                                                    >
                                                        Join Meeting →
                                                    </a>
                                                )}

                                                {interview.notes && (
                                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                                        {interview.notes}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex shrink-0 gap-2">
                                                <Link
                                                    href={`/interviews/${interview.id}/edit`}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                                                >
                                                    Edit
                                                </Link>

                                                <Link
                                                    href={`/applications/${application.id}/interviews`}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                                                >
                                                    Semua
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* FOLLOW-UP */}
                    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Follow-up
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Catat jadwal follow-up untuk lamaran ini.
                                </p>
                            </div>

                            <Link
                                href={`/applications/${application.id}/follow-ups/create`}
                                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                + Tambah Follow-up
                            </Link>
                        </div>

                        {application.follow_ups.length === 0 ? (
                            <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                                <div className="text-2xl">📅</div>

                                <p className="mt-2 text-sm font-semibold text-slate-700">
                                    Belum ada follow-up
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Tambahkan jadwal follow-up untuk mengingatkan
                                    kamu kapan harus menghubungi perusahaan.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-5 space-y-4">
                                {application.follow_ups.map((followUp) => (
                                    <div
                                        key={followUp.id}
                                        className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-200"
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">
                                                        {formatFollowUpType(
                                                            followUp.type,
                                                        )}
                                                    </h3>

                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getFollowUpStatusClass(
                                                            followUp.status,
                                                        )}`}
                                                    >
                                                        {formatFollowUpStatus(
                                                            followUp.status,
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-sm font-medium text-emerald-600">
                                                    {formatFollowUpDate(
                                                        followUp.follow_up_date,
                                                    )}
                                                </p>

                                                {followUp.notes && (
                                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                                        {followUp.notes}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex shrink-0 gap-2">
                                                <Link
                                                    href={`/follow-ups/${followUp.id}/edit`}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                                                >
                                                    Edit
                                                </Link>

                                                <Link
                                                    href={`/applications/${application.id}/follow-ups`}
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                                                >
                                                    Semua
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* BOTTOM ACTIONS */}
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/applications"
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-600"
                        >
                            ← Kembali ke Semua Lamaran
                        </Link>

                        <Link
                            href={`/applications/${application.id}/edit`}
                            className="rounded-xl bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Edit Lamaran
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}