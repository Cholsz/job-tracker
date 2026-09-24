import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type JobApplication = {
    id: number;
    company_name: string;
    position: string;
    location: string | null;
    employment_type: string | null;
    source: string | null;
    applied_at: string | null;
    status: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type ApplicationsPagination = {
    data: JobApplication[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};

type Filters = {
    search?: string;
    status?: string;
    employment_type?: string;
};

type Statistics = {
    total: number;
    interview: number;
    offer: number;
};

type Props = {
    applications: ApplicationsPagination;
    filters?: Filters;
    statistics: Statistics;
};

const statusFilters = [
    'all',
    'applied',
    'screening',
    'interview',
    'offer',
    'rejected',
] as const;

const employmentTypes = [
    'all',
    'full_time',
    'part_time',
    'internship',
    'contract',
    'freelance',
    'remote',
] as const;

function getStatusClass(status: string) {
    switch (status.toLowerCase()) {
        case 'screening':
            return 'border-purple-200 bg-purple-50 text-purple-700';

        case 'interview':
            return 'border-amber-200 bg-amber-50 text-amber-700';

        case 'offer':
            return 'border-green-200 bg-green-50 text-green-700';

        case 'rejected':
            return 'border-red-200 bg-red-50 text-red-700';

        case 'applied':
        default:
            return 'border-blue-200 bg-blue-50 text-blue-700';
    }
}

function formatStatus(status: string) {
    switch (status.toLowerCase()) {
        case 'applied':
            return 'Applied';

        case 'screening':
            return 'Screening';

        case 'interview':
            return 'Interview';

        case 'offer':
            return 'Offer';

        case 'rejected':
            return 'Rejected';

        default:
            return status;
    }
}

function formatEmploymentType(type: string) {
    switch (type.toLowerCase()) {
        case 'full_time':
            return 'Full Time';

        case 'part_time':
            return 'Part Time';

        case 'internship':
            return 'Internship';

        case 'contract':
            return 'Contract';

        case 'freelance':
            return 'Freelance';

        case 'remote':
            return 'Remote';

        default:
            return type;
    }
}

export default function Index({
    applications,
    filters = {},
    statistics,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const [selectedStatus, setSelectedStatus] = useState(
        filters.status || 'all',
    );

    const [selectedEmploymentType, setSelectedEmploymentType] =
        useState(filters.employment_type || 'all');

    useEffect(() => {
        setSearch(filters.search || '');
        setSelectedStatus(filters.status || 'all');
        setSelectedEmploymentType(
            filters.employment_type || 'all',
        );
    }, [
        filters.search,
        filters.status,
        filters.employment_type,
    ]);

    function applyFilters(
        searchValue = search,
        statusValue = selectedStatus,
        employmentTypeValue = selectedEmploymentType,
    ) {
        const params: Record<string, string> = {};

        if (searchValue.trim()) {
            params.search = searchValue.trim();
        }

        if (statusValue && statusValue !== 'all') {
            params.status = statusValue;
        }

        if (
            employmentTypeValue &&
            employmentTypeValue !== 'all'
        ) {
            params.employment_type = employmentTypeValue;
        }

        router.get('/applications', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    function handleSearchSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        applyFilters();
    }

    function handleStatusChange(status: string) {
        setSelectedStatus(status);

        applyFilters(
            search,
            status,
            selectedEmploymentType,
        );
    }

    function handleEmploymentTypeChange(type: string) {
        setSelectedEmploymentType(type);

        applyFilters(
            search,
            selectedStatus,
            type,
        );
    }

    function resetFilters() {
        setSearch('');
        setSelectedStatus('all');
        setSelectedEmploymentType('all');

        router.get(
            '/applications',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    function goToPage(url: string | null) {
        if (!url) {
            return;
        }

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const hasActiveFilters =
        search.trim() !== '' ||
        selectedStatus !== 'all' ||
        selectedEmploymentType !== 'all';

    const applicationsData = applications.data;

    return (
        <>
            <Head title="Job Applications" />

            <div className="min-h-screen bg-slate-50 px-5 py-8 text-slate-800 md:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* HEADER */}
                    <div className="border-b border-slate-200 pb-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
                                    Career Tracker
                                </p>

                                <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                                    Job Applications
                                </h1>

                                <p className="mt-3 max-w-xl text-slate-500">
                                    Kelola dan pantau perjalanan lamaran
                                    pekerjaan kamu dalam satu tempat.
                                </p>
                            </div>

                            <Link
                                href="/applications/create"
                                className="inline-flex items-center justify-center rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
                            >
                                + Tambah Lamaran
                            </Link>
                        </div>

                        {/* NAVIGATION */}
                        <nav className="mt-6 flex flex-wrap items-center gap-2">
                            <Link
                                href="/dashboard"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-green-700"
                            >
                                Dashboard
                            </Link>

                            <Link
                                href="/applications"
                                className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700"
                            >
                                Lamaran
                            </Link>

                            <Link
                                href="/calendar"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-green-700"
                            >
                                Calendar
                            </Link>
                        </nav>
                    </div>

                    {/* SUMMARY */}
                    <div className="mt-8 grid gap-5 sm:grid-cols-3">
                        {/* TOTAL */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Total Lamaran
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {statistics.total}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg text-green-700">
                                    📄
                                </div>
                            </div>
                        </div>

                        {/* INTERVIEW */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Interview
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {statistics.interview}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-lg">
                                    🎯
                                </div>
                            </div>
                        </div>

                        {/* OFFER */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        Offer
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {statistics.offer}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-lg">
                                    🎉
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH & FILTER */}
                    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        {/* SEARCH */}
                        <form onSubmit={handleSearchSubmit}>
                            <label
                                htmlFor="search"
                                className="mb-2 block text-sm font-semibold text-slate-700"
                            >
                                Cari Lamaran
                            </label>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="relative flex-1">
                                    <input
                                        id="search"
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Cari perusahaan atau posisi..."
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-11 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                    />

                                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        🔎
                                    </span>
                                </div>

                                <button
                                    type="submit"
                                    className="rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>

                        {/* STATUS FILTER */}
                        <div className="mt-6">
                            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="text-sm font-semibold text-slate-700">
                                    Filter Status
                                </h2>

                                <span className="text-sm text-slate-500">
                                    {applications.total} lamaran
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {statusFilters.map((status) => {
                                    const isActive =
                                        selectedStatus === status;

                                    return (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() =>
                                                handleStatusChange(
                                                    status,
                                                )
                                            }
                                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                                isActive
                                                    ? 'border-green-700 bg-green-700 text-white'
                                                    : 'border-slate-300 bg-white text-slate-600 hover:border-green-600 hover:text-green-700'
                                            }`}
                                        >
                                            {status === 'all'
                                                ? 'Semua'
                                                : formatStatus(
                                                      status,
                                                  )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* EMPLOYMENT TYPE */}
                        <div className="mt-6">
                            <h2 className="mb-3 text-sm font-semibold text-slate-700">
                                Tipe Pekerjaan
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {employmentTypes.map((type) => {
                                    const isActive =
                                        selectedEmploymentType ===
                                        type;

                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() =>
                                                handleEmploymentTypeChange(
                                                    type,
                                                )
                                            }
                                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                                isActive
                                                    ? 'border-green-700 bg-green-700 text-white'
                                                    : 'border-slate-300 bg-white text-slate-600 hover:border-green-600 hover:text-green-700'
                                            }`}
                                        >
                                            {type === 'all'
                                                ? 'Semua'
                                                : formatEmploymentType(
                                                      type,
                                                  )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RESET */}
                        {hasActiveFilters && (
                            <div className="mt-6 border-t border-slate-100 pt-5">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="text-sm font-semibold text-red-600 transition hover:text-red-700 hover:underline"
                                >
                                    Reset Semua Filter
                                </button>
                            </div>
                        )}
                    </div>

                    {/* RESULT INFO */}
                    <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-slate-500">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-700">
                                {applications.from ?? 0}
                            </span>{' '}
                            sampai{' '}
                            <span className="font-semibold text-slate-700">
                                {applications.to ?? 0}
                            </span>{' '}
                            dari{' '}
                            <span className="font-semibold text-slate-700">
                                {applications.total}
                            </span>{' '}
                            lamaran
                        </p>

                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-slate-500">
                                    Filter aktif:
                                </span>

                                {search.trim() && (
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                        Search: "{search.trim()}"
                                    </span>
                                )}

                                {selectedStatus !== 'all' && (
                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                        Status:{' '}
                                        {formatStatus(
                                            selectedStatus,
                                        )}
                                    </span>
                                )}

                                {selectedEmploymentType !==
                                    'all' && (
                                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                        Tipe:{' '}
                                        {formatEmploymentType(
                                            selectedEmploymentType,
                                        )}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* APPLICATION LIST */}
                    <div className="mt-6">
                        {applicationsData.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl">
                                    📋
                                </div>

                                <p className="mt-4 text-lg font-semibold text-slate-800">
                                    {hasActiveFilters
                                        ? 'Tidak ada lamaran ditemukan'
                                        : 'Belum ada lamaran'}
                                </p>

                                <p className="mt-2 text-sm text-slate-500">
                                    {hasActiveFilters
                                        ? 'Coba ubah kata pencarian atau filter yang digunakan.'
                                        : 'Mulai tambahkan lamaran pekerjaan kamu.'}
                                </p>

                                {hasActiveFilters ? (
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-green-200 hover:text-green-700"
                                    >
                                        Reset Filter
                                    </button>
                                ) : (
                                    <Link
                                        href="/applications/create"
                                        className="mt-5 inline-flex rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                                    >
                                        + Tambah Lamaran
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-5 md:grid-cols-2">
                                {applicationsData.map(
                                    (application) => (
                                        <div
                                            key={application.id}
                                            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                                        >
                                            {/* GREEN ACCENT */}
                                            <div className="absolute left-0 top-0 h-full w-1 bg-green-600" />

                                            {/* CARD HEADER */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h2 className="text-xl font-bold leading-tight text-slate-900">
                                                        {
                                                            application.position
                                                        }
                                                    </h2>

                                                    <p className="mt-1 font-medium text-green-700">
                                                        {
                                                            application.company_name
                                                        }
                                                    </p>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                        application.status,
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        application.status,
                                                    )}
                                                </span>
                                            </div>

                                            {/* INFORMATION */}
                                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        Lokasi
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium text-slate-700">
                                                        {application.location ??
                                                            'Tidak tersedia'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        Tipe
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium capitalize text-slate-700">
                                                        {application.employment_type ??
                                                            'Tidak tersedia'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        Tanggal Melamar
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium text-slate-700">
                                                        {application.applied_at
                                                            ? new Date(
                                                                  application.applied_at,
                                                              ).toLocaleDateString(
                                                                  'id-ID',
                                                                  {
                                                                      day: '2-digit',
                                                                      month: '2-digit',
                                                                      year: 'numeric',
                                                                  },
                                                              )
                                                            : 'Belum diisi'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                        Sumber
                                                    </p>

                                                    <p className="mt-1 text-sm font-medium text-slate-700">
                                                        {application.source ??
                                                            'Tidak tersedia'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* ACTIONS */}
                                            <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
                                                <Link
                                                    href={`/applications/${application.id}`}
                                                    className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                                                >
                                                    Detail
                                                </Link>

                                                <Link
                                                    href={`/applications/${application.id}/edit`}
                                                    className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (
                                                            confirm(
                                                                'Yakin ingin menghapus lamaran ini?',
                                                            )
                                                        ) {
                                                            router.delete(
                                                                `/applications/${application.id}`,
                                                            );
                                                        }
                                                    }}
                                                    className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </div>

                    {/* PAGINATION */}
                    {applications.last_page > 1 && (
                        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-slate-500">
                                Halaman{' '}
                                <span className="font-semibold text-slate-700">
                                    {applications.current_page}
                                </span>{' '}
                                dari{' '}
                                <span className="font-semibold text-slate-700">
                                    {applications.last_page}
                                </span>
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                                {applications.links.map(
                                    (link, index) => {
                                        const isPrevious =
                                            index === 0;

                                        const isNext =
                                            index ===
                                            applications.links
                                                .length - 1;

                                        let label = link.label;

                                        if (isPrevious) {
                                            label = '← Sebelumnya';
                                        }

                                        if (isNext) {
                                            label = 'Berikutnya →';
                                        }

                                        return (
                                            <button
                                                key={`${link.label}-${index}`}
                                                type="button"
                                                disabled={
                                                    !link.url
                                                }
                                                onClick={() =>
                                                    goToPage(
                                                        link.url,
                                                    )
                                                }
                                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                                                    link.active
                                                        ? 'border-green-700 bg-green-700 text-white'
                                                        : link.url
                                                          ? 'border-slate-300 bg-white text-slate-600 hover:border-green-600 hover:text-green-700'
                                                          : 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}