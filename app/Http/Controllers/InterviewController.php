<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InterviewController extends Controller
{
    /**
     * Menampilkan daftar interview dari sebuah lamaran.
     */
    public function index(JobApplication $application)
    {
        abort_unless($application->user_id === Auth::id(), 403);

        $interviews = $application->interviews()
            ->orderBy('interview_date')
            ->get();

        return Inertia::render('interviews/index', [
            'application' => $application,
            'interviews' => $interviews,
        ]);
    }

    /**
     * Menampilkan form tambah interview.
     */
    public function create(JobApplication $application)
    {
        abort_unless($application->user_id === Auth::id(), 403);

        return Inertia::render('interviews/create', [
            'application' => $application,
        ]);
    }

    /**
     * Menyimpan interview baru.
     */
    public function store(Request $request, JobApplication $application)
    {
        abort_unless($application->user_id === Auth::id(), 403);

        $validated = $request->validate([
            'interview_date' => ['required', 'date'],
            'interview_type' => ['required', 'string', 'max:100'],
            'interviewer' => ['nullable', 'string', 'max:255'],
            'meeting_url' => ['nullable', 'url', 'max:2048'],
            'location' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'result' => ['required', 'in:scheduled,passed,failed,cancelled'],
        ]);

        $application->interviews()->create($validated);

        return redirect()
            ->route('applications.interviews.index', $application)
            ->with('success', 'Interview berhasil ditambahkan.');
    }

    /**
     * Menampilkan form edit interview.
     */
    public function edit(Interview $interview)
    {
        abort_unless(
            $interview->jobApplication->user_id === Auth::id(),
            403
        );

        return Inertia::render('interviews/edit', [
            'interview' => $interview,
        ]);
    }

    /**
     * Memperbarui interview.
     */
    public function update(Request $request, Interview $interview)
    {
        abort_unless(
            $interview->jobApplication->user_id === Auth::id(),
            403
        );

        $validated = $request->validate([
            'interview_date' => ['required', 'date'],
            'interview_type' => ['required', 'string', 'max:100'],
            'interviewer' => ['nullable', 'string', 'max:255'],
            'meeting_url' => ['nullable', 'url', 'max:2048'],
            'location' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'result' => ['required', 'in:scheduled,passed,failed,cancelled'],
        ]);

        $validated['reminder_sent_at'] = null;

        $interview->update($validated);

        return redirect()
            ->route(
                'applications.interviews.index',
                $interview->job_application_id
            )
            ->with('success', 'Interview berhasil diperbarui.');
    }

    /**
     * Menghapus interview.
     */
    public function destroy(Interview $interview)
    {
        abort_unless(
            $interview->jobApplication->user_id === Auth::id(),
            403
        );

        $applicationId = $interview->job_application_id;

        $interview->delete();

        return redirect()
            ->route('applications.interviews.index', $applicationId)
            ->with('success', 'Interview berhasil dihapus.');
    }
}