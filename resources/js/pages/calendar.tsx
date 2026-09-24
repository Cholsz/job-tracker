import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    MessageCircle,
    Video,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

type Interview = {
    id: number;
    job_application_id: number;
    interview_date: string;
    interview_type: string;
    interviewer: string | null;
    meeting_url: string | null;
    location: string | null;
    result: string;
    job_application: {
        id: number;
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
        id: number;
        company_name: string;
        position: string;
    };
};

type Props = {
    interviews: Interview[];
    followUps: FollowUp[];
};

type CalendarEvent = {
    id: string;
    date: string;
    type: 'interview' | 'follow_up';
    title: string;
    position: string;
    applicationId: number;
    interview?: Interview;
    followUp?: FollowUp;
};

const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

const dayNames = [
    'Sen',
    'Sel',
    'Rab',
    'Kam',
    'Jum',
    'Sab',
    'Min',
];

function formatDate(date: string) {
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));
}

function formatTime(date: string) {
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

function formatInterviewType(type: string) {
    const types: Record<string, string> = {
        online: 'Online',
        offline: 'Offline',
        phone: 'Telepon',
        video: 'Video Call',
    };

    return types[type] ?? type;
}

function formatResult(result: string) {
    const results: Record<string, string> = {
        scheduled: 'Terjadwal',
        passed: 'Lulus',
        failed: 'Tidak Lulus',
        pending: 'Menunggu',
        cancelled: 'Dibatalkan',
    };

    return results[result] ?? result;
}

function formatFollowUpType(type: string) {
    const types: Record<string, string> = {
        follow_up: 'Follow-up',
        email: 'Email',
        phone: 'Telepon',
        whatsapp: 'WhatsApp',
        other: 'Lainnya',
    };

    return types[type] ?? type;
}

function formatFollowUpStatus(status: string) {
    const statuses: Record<string, string> = {
        pending: 'Pending',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
    };

    return statuses[status] ?? status;
}

function getDateKey(date: string) {
    const parsed = new Date(date);

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function getDateKeyFromLocalDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function isSameDay(date1: Date, date2: Date) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

function isToday(date: Date) {
    return isSameDay(date, new Date());
}

function isPastDate(date: Date) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    return target < today;
}

export default function Calendar({
    interviews,
    followUps,
}: Props) {
    const today = new Date();

    const [currentMonth, setCurrentMonth] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1),
    );

    const [selectedEvent, setSelectedEvent] =
        useState<CalendarEvent | null>(null);

    const events = useMemo<CalendarEvent[]>(() => {
        return [
            ...interviews.map((interview) => ({
                id: `interview-${interview.id}`,
                date: interview.interview_date,
                type: 'interview' as const,
                title: interview.job_application.company_name,
                position: interview.job_application.position,
                applicationId: interview.job_application_id,
                interview,
            })),

            ...followUps.map((followUp) => ({
                id: `follow-up-${followUp.id}`,
                date: followUp.follow_up_date,
                type: 'follow_up' as const,
                title: followUp.job_application.company_name,
                position: followUp.job_application.position,
                applicationId: followUp.job_application_id,
                followUp,
            })),
        ].sort(
            (a, b) =>
                new Date(a.date).getTime() -
                new Date(b.date).getTime(),
        );
    }, [interviews, followUps]);

    const eventsByDate = useMemo(() => {
        const grouped: Record<string, CalendarEvent[]> = {};

        events.forEach((event) => {
            const key = getDateKey(event.date);

            if (!grouped[key]) {
                grouped[key] = [];
            }

            grouped[key].push(event);
        });

        return grouped;
    }, [events]);

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDay =
            firstDay.getDay() === 0
                ? 6
                : firstDay.getDay() - 1;

        const daysInMonth = lastDay.getDate();

        const previousMonthLastDay = new Date(
            year,
            month,
            0,
        ).getDate();

        const days = [];

        for (let i = startDay - 1; i >= 0; i--) {
            const day = previousMonthLastDay - i;

            days.push({
                date: new Date(year, month - 1, day),
                currentMonth: false,
            });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                date: new Date(year, month, day),
                currentMonth: true,
            });
        }

        let nextDay = 1;

        while (days.length < 42) {
            days.push({
                date: new Date(year, month + 1, nextDay),
                currentMonth: false,
            });

            nextDay++;
        }

        return days;
    }, [currentMonth]);

    function previousMonth() {
        setCurrentMonth(
            (current) =>
                new Date(
                    current.getFullYear(),
                    current.getMonth() - 1,
                    1,
                ),
        );
    }

    function nextMonth() {
        setCurrentMonth(
            (current) =>
                new Date(
                    current.getFullYear(),
                    current.getMonth() + 1,
                    1,
                ),
        );
    }

    function goToToday() {
        const now = new Date();

        setCurrentMonth(
            new Date(now.getFullYear(), now.getMonth(), 1),
        );
    }

    const currentMonthEvents = events.filter((event) => {
        const date = new Date(event.date);

        return (
            date.getFullYear() === currentMonth.getFullYear() &&
            date.getMonth() === currentMonth.getMonth()
        );
    });

    return (
        <>
            <Head title="Calendar" />

            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                                <CalendarDays className="h-6 w-6 text-emerald-600" />
                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-slate-900">
                                    Calendar
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Jadwal interview dan follow-up
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">
                                Dashboard
                            </span>
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {/* Calendar Header */}
                    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                    {monthNames[currentMonth.getMonth()]}{' '}
                                    {currentMonth.getFullYear()}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {currentMonthEvents.length} event pada
                                    bulan ini
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={goToToday}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Hari Ini
                                </button>

                                <button
                                    type="button"
                                    onClick={previousMonth}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                                    aria-label="Bulan sebelumnya"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                <button
                                    type="button"
                                    onClick={nextMonth}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                                    aria-label="Bulan berikutnya"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mb-5 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                            <span className="text-slate-600">
                                Interview
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                            <span className="text-slate-600">
                                Follow-up
                            </span>
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {/* Day Names */}
                        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                            {dayNames.map((day) => (
                                <div
                                    key={day}
                                    className="border-r border-slate-200 px-2 py-3 text-center text-xs font-semibold text-slate-500 last:border-r-0 sm:text-sm"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7">
                            {calendarDays.map(
                                ({ date, currentMonth: isCurrentMonth }) => {
                                    const dateKey =
                                        getDateKeyFromLocalDate(date);

                                    const dayEvents =
                                        eventsByDate[dateKey] ?? [];

                                    const todayClass = isToday(date);

                                    return (
                                        <div
                                            key={dateKey}
                                            className={`min-h-[120px] border-b border-r border-slate-200 p-1.5 sm:min-h-[145px] sm:p-2 ${
                                                !isCurrentMonth
                                                    ? 'bg-slate-50/70'
                                                    : 'bg-white'
                                            }`}
                                        >
                                            <div className="mb-1 flex items-center justify-between">
                                                <span
                                                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium sm:text-sm ${
                                                        todayClass
                                                            ? 'bg-emerald-600 font-bold text-white'
                                                            : isCurrentMonth
                                                              ? 'text-slate-700'
                                                              : 'text-slate-300'
                                                    }`}
                                                >
                                                    {date.getDate()}
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                {dayEvents
                                                    .slice(0, 3)
                                                    .map((event) => {
                                                        const past =
                                                            isPastDate(
                                                                date,
                                                            );

                                                        return (
                                                            <button
                                                                key={event.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedEvent(
                                                                        event,
                                                                    )
                                                                }
                                                                className={`block w-full rounded-md px-1.5 py-1 text-left transition ${
                                                                    event.type ===
                                                                    'interview'
                                                                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                                                } ${
                                                                    past
                                                                        ? 'opacity-60'
                                                                        : ''
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-1">
                                                                    {event.type ===
                                                                    'interview' ? (
                                                                        <Video className="h-3 w-3 shrink-0" />
                                                                    ) : (
                                                                        <MessageCircle className="h-3 w-3 shrink-0" />
                                                                    )}

                                                                    <span className="truncate text-[10px] font-semibold sm:text-xs">
                                                                        {event.title}
                                                                    </span>
                                                                </div>

                                                                <div className="mt-0.5 truncate text-[9px] opacity-80 sm:text-[10px]">
                                                                    {event.type ===
                                                                    'interview'
                                                                        ? formatTime(
                                                                              event.date,
                                                                          )
                                                                        : formatFollowUpType(
                                                                              event
                                                                                  .followUp
                                                                                  ?.type ??
                                                                                  '',
                                                                          )}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}

                                                {dayEvents.length > 3 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedEvent(
                                                                dayEvents[3],
                                                            )
                                                        }
                                                        className="px-1 text-[10px] font-medium text-slate-400 hover:text-slate-600"
                                                    >
                                                        +
                                                        {dayEvents.length -
                                                            3}{' '}
                                                        lainnya
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>

                    {/* Monthly Summary */}
                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        {/* Interviews */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                                        <Video className="h-4 w-4 text-emerald-600" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            Interview Bulan Ini
                                        </h3>

                                        <p className="text-xs text-slate-500">
                                            {
                                                currentMonthEvents.filter(
                                                    (event) =>
                                                        event.type ===
                                                        'interview',
                                                ).length
                                            }{' '}
                                            interview
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {currentMonthEvents.filter(
                                    (event) =>
                                        event.type === 'interview',
                                ).length === 0 ? (
                                    <div className="px-5 py-8 text-center text-sm text-slate-400">
                                        Tidak ada interview bulan ini.
                                    </div>
                                ) : (
                                    currentMonthEvents
                                        .filter(
                                            (event) =>
                                                event.type ===
                                                'interview',
                                        )
                                        .map((event) => (
                                            <button
                                                key={event.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedEvent(
                                                        event,
                                                    )
                                                }
                                                className="block w-full px-5 py-4 text-left transition hover:bg-slate-50"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {event.title}
                                                        </p>

                                                        <p className="text-sm text-slate-500">
                                                            {event.position}
                                                        </p>

                                                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                                                            <span className="inline-flex items-center gap-1">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                {formatTime(
                                                                    event.date,
                                                                )}
                                                            </span>

                                                            {event.interview
                                                                ?.location && (
                                                                <span className="inline-flex items-center gap-1">
                                                                    <MapPin className="h-3.5 w-3.5" />
                                                                    {
                                                                        event
                                                                            .interview
                                                                            .location
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <span className="shrink-0 text-xs text-slate-400">
                                                        {new Date(
                                                            event.date,
                                                        ).getDate()}
                                                    </span>
                                                </div>
                                            </button>
                                        ))
                                )}
                            </div>
                        </div>

                        {/* Follow-ups */}
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                                        <MessageCircle className="h-4 w-4 text-blue-600" />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            Follow-up Bulan Ini
                                        </h3>

                                        <p className="text-xs text-slate-500">
                                            {
                                                currentMonthEvents.filter(
                                                    (event) =>
                                                        event.type ===
                                                        'follow_up',
                                                ).length
                                            }{' '}
                                            follow-up
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {currentMonthEvents.filter(
                                    (event) =>
                                        event.type === 'follow_up',
                                ).length === 0 ? (
                                    <div className="px-5 py-8 text-center text-sm text-slate-400">
                                        Tidak ada follow-up bulan ini.
                                    </div>
                                ) : (
                                    currentMonthEvents
                                        .filter(
                                            (event) =>
                                                event.type ===
                                                'follow_up',
                                        )
                                        .map((event) => (
                                            <button
                                                key={event.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedEvent(
                                                        event,
                                                    )
                                                }
                                                className="block w-full px-5 py-4 text-left transition hover:bg-slate-50"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {event.title}
                                                        </p>

                                                        <p className="text-sm text-slate-500">
                                                            {event.position}
                                                        </p>

                                                        <p className="mt-2 text-xs text-slate-500">
                                                            {formatFollowUpType(
                                                                event.followUp
                                                                    ?.type ??
                                                                    '',
                                                            )}
                                                        </p>
                                                    </div>

                                                    <span className="shrink-0 text-xs text-slate-400">
                                                        {new Date(
                                                            event.date,
                                                        ).getDate()}
                                                    </span>
                                                </div>
                                            </button>
                                        ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedEvent(null)}
                >
                    <div
                        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div
                            className={`flex items-center justify-between px-5 py-4 ${
                                selectedEvent.type === 'interview'
                                    ? 'bg-emerald-50'
                                    : 'bg-blue-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                        selectedEvent.type ===
                                        'interview'
                                            ? 'bg-emerald-100'
                                            : 'bg-blue-100'
                                    }`}
                                >
                                    {selectedEvent.type ===
                                    'interview' ? (
                                        <Video className="h-5 w-5 text-emerald-600" />
                                    ) : (
                                        <MessageCircle className="h-5 w-5 text-blue-600" />
                                    )}
                                </div>

                                <div>
                                    <p
                                        className={`text-xs font-semibold uppercase tracking-wide ${
                                            selectedEvent.type ===
                                            'interview'
                                                ? 'text-emerald-600'
                                                : 'text-blue-600'
                                        }`}
                                    >
                                        {selectedEvent.type ===
                                        'interview'
                                            ? 'Interview'
                                            : 'Follow-up'}
                                    </p>

                                    <h3 className="font-semibold text-slate-900">
                                        Detail Event
                                    </h3>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedEvent(null)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-600"
                                aria-label="Tutup"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-5 p-5">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Perusahaan
                                </p>

                                <p className="mt-1 text-lg font-bold text-slate-900">
                                    {selectedEvent.title}
                                </p>

                                <p className="text-sm text-slate-500">
                                    {selectedEvent.position}
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <p className="text-xs text-slate-500">
                                        Tanggal
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-800">
                                        {formatDate(
                                            selectedEvent.date,
                                        )}
                                    </p>
                                </div>

                                {selectedEvent.type ===
                                    'interview' && (
                                    <div className="rounded-xl bg-slate-50 p-3">
                                        <p className="text-xs text-slate-500">
                                            Waktu
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-800">
                                            {formatTime(
                                                selectedEvent.date,
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {selectedEvent.type ===
                                'interview' &&
                                selectedEvent.interview && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">
                                                Tipe Interview
                                            </span>

                                            <span className="text-sm font-medium text-slate-800">
                                                {formatInterviewType(
                                                    selectedEvent
                                                        .interview
                                                        .interview_type,
                                                )}
                                            </span>
                                        </div>

                                        {selectedEvent.interview
                                            .interviewer && (
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-sm text-slate-500">
                                                    Interviewer
                                                </span>

                                                <span className="text-right text-sm font-medium text-slate-800">
                                                    {
                                                        selectedEvent
                                                            .interview
                                                            .interviewer
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        {selectedEvent.interview
                                            .location && (
                                            <div className="flex items-start justify-between gap-4">
                                                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                                                    <MapPin className="h-4 w-4" />
                                                    Lokasi
                                                </span>

                                                <span className="text-right text-sm font-medium text-slate-800">
                                                    {
                                                        selectedEvent
                                                            .interview
                                                            .location
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm text-slate-500">
                                                Hasil
                                            </span>

                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                {formatResult(
                                                    selectedEvent
                                                        .interview
                                                        .result,
                                                )}
                                            </span>
                                        </div>

                                        {selectedEvent.interview
                                            .meeting_url && (
                                            <a
                                                href={
                                                    selectedEvent
                                                        .interview
                                                        .meeting_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                                            >
                                                <Video className="h-4 w-4" />
                                                Buka Link Interview
                                            </a>
                                        )}
                                    </div>
                                )}

                            {selectedEvent.type ===
                                'follow_up' &&
                                selectedEvent.followUp && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">
                                                Tipe Follow-up
                                            </span>

                                            <span className="text-sm font-medium text-slate-800">
                                                {formatFollowUpType(
                                                    selectedEvent
                                                        .followUp
                                                        .type,
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">
                                                Status
                                            </span>

                                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                                {formatFollowUpStatus(
                                                    selectedEvent
                                                        .followUp
                                                        .status,
                                                )}
                                            </span>
                                        </div>

                                        {selectedEvent.followUp
                                            .notes && (
                                            <div className="rounded-xl bg-slate-50 p-3">
                                                <p className="text-xs text-slate-500">
                                                    Catatan
                                                </p>

                                                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                                    {
                                                        selectedEvent
                                                            .followUp
                                                            .notes
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                            {/* Modal Actions */}
                            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedEvent(null)
                                    }
                                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Tutup
                                </button>

                                <Link
                                    href={`/applications/${selectedEvent.applicationId}`}
                                    className="rounded-lg bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-emerald-700"
                                >
                                    Lihat Detail Lamaran
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}