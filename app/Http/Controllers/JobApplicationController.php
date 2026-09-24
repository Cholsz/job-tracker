<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;


class JobApplicationController extends Controller
{
   public function index(Request $request)
{
    $userId = Auth::id();

    $query = JobApplication::where('user_id', $userId);

    // Search berdasarkan perusahaan atau posisi
    if ($request->filled('search')) {
        $search = $request->search;

        $query->where(function ($query) use ($search) {
            $query
                ->where('company_name', 'like', "%{$search}%")
                ->orWhere('position', 'like', "%{$search}%");
        });
    }

    // Filter berdasarkan status
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    // Filter berdasarkan tipe pekerjaan
    if ($request->filled('employment_type')) {
        $employmentType = $request->employment_type;

        $employmentTypeMap = [
            'full_time' => [
                'full_time',
                'Full-Time',
                'Full Time',
                'full-time',
            ],

            'part_time' => [
                'part_time',
                'Part-Time',
                'Part Time',
                'part-time',
            ],

            'internship' => [
                'internship',
                'Internship',
            ],

            'contract' => [
                'contract',
                'Contract',
            ],

            'freelance' => [
                'freelance',
                'Freelance',
            ],

            'remote' => [
                'remote',
                'Remote',
            ],
        ];

        if (isset($employmentTypeMap[$employmentType])) {
            $query->whereIn(
                'employment_type',
                $employmentTypeMap[$employmentType]
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    $statisticsQuery = clone $query;

    $statistics = [
        'total' => (clone $statisticsQuery)->count(),

        'interview' => (clone $statisticsQuery)
            ->where('status', 'interview')
            ->count(),

        'offer' => (clone $statisticsQuery)
            ->where('status', 'offer')
            ->count(),
    ];

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    $applications = $query
        ->latest('applied_at')
        ->latest('id')
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('job-applications/index', [
        'applications' => $applications,

        'filters' => [
            'search' => $request->search ?? '',
            'status' => $request->status ?? '',
            'employment_type' => $request->employment_type ?? '',
        ],

        'statistics' => $statistics,
    ]);
}

public function create()
{
    return Inertia::render('job-applications/create');
}

public function show(JobApplication $application)
{
    abort_unless($application->user_id === Auth::id(), 403);

    $application->load([
        'interviews' => function ($query) {
            $query->orderBy('interview_date');
        },

        'followUps' => function ($query) {
            $query->orderBy('follow_up_date');
        },
    ]);

    return Inertia::render('job-applications/show', [
        'application' => $application,
    ]);
}

public function edit(JobApplication $application)
{
    abort_unless($application->user_id === Auth::id(), 403);

    return Inertia::render('job-applications/edit', [
        'application' => $application,
    ]);
}

public function update(Request $request, JobApplication $application)
{
    abort_unless($application->user_id === Auth::id(), 403);

    $validated = $request->validate([
        'company_name' => ['required', 'string', 'max:255'],
        'position' => ['required', 'string', 'max:255'],
        'location' => ['nullable', 'string', 'max:255'],
        'employment_type' => ['nullable', 'string', 'max:100'],
        'source' => ['nullable', 'string', 'max:100'],
        'job_url' => ['nullable', 'url', 'max:2048'],
        'applied_at' => ['nullable', 'date'],
        'status' => ['required', 'in:applied,screening,interview,offer,rejected'],
        'notes' => ['nullable', 'string'],
    ]);

    $application->update($validated);

    return redirect()
        ->route('applications.index')
        ->with('success', 'Lamaran berhasil diperbarui.');
}

public function store(Request $request)
{
    $validated = $request->validate([
        'company_name' => ['required', 'string', 'max:255'],
        'position' => ['required', 'string', 'max:255'],
        'location' => ['nullable', 'string', 'max:255'],
        'employment_type' => ['nullable', 'string', 'max:100'],
        'source' => ['nullable', 'string', 'max:100'],
        'job_url' => ['nullable', 'url', 'max:2048'],
        'applied_at' => ['nullable', 'date'],
        'notes' => ['nullable', 'string'],
    ]);

    $validated['user_id'] = Auth::id();
    $validated['status'] = 'applied';

    JobApplication::create($validated);

    return redirect()
        ->route('applications.index')
        ->with('success', 'Lamaran berhasil ditambahkan.');
}

public function destroy(JobApplication $application)
{
    abort_unless($application->user_id === Auth::id(), 403);

    $application->delete();

    return redirect()
        ->route('applications.index')
        ->with('success', 'Lamaran berhasil dihapus.');
}
}