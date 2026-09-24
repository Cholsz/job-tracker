<?php

namespace App\Http\Controllers;

use App\Models\FollowUp;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FollowUpController extends Controller
{
    public function index(JobApplication $application)
    {
        abort_unless($application->user_id === Auth::id(), 403);

        $followUps = $application->followUps()
            ->orderBy('follow_up_date')
            ->get();

        return Inertia::render('follow-ups/index', [
            'application' => $application,
            'followUps' => $followUps,
        ]);
    }

    public function create(JobApplication $application)
    {
        abort_unless($application->user_id === Auth::id(), 403);

        return Inertia::render('follow-ups/create', [
            'application' => $application,
        ]);
    }

    public function store(Request $request, JobApplication $application)
    {
        abort_unless($application->user_id === Auth::id(), 403);

        $validated = $request->validate([
            'follow_up_date' => ['required', 'date'],
            'type' => ['required', 'in:follow_up,email,phone,whatsapp,linkedin,other'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,completed,cancelled'],
        ]);

        $application->followUps()->create($validated);

        return redirect()
            ->route('applications.follow-ups.index', $application)
            ->with('success', 'Follow-up berhasil ditambahkan.');
    }

    public function edit(FollowUp $followUp)
    {
        abort_unless(
            $followUp->jobApplication->user_id === Auth::id(),
            403
        );

        return Inertia::render('follow-ups/edit', [
            'followUp' => $followUp,
        ]);
    }

    public function update(Request $request, FollowUp $followUp)
    {
        abort_unless(
            $followUp->jobApplication->user_id === Auth::id(),
            403
        );

        $validated = $request->validate([
            'follow_up_date' => ['required', 'date'],
            'type' => ['required', 'in:follow_up,email,phone,whatsapp,linkedin,other'],
            'notes' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,completed,cancelled'],
        ]);

        $followUp->update($validated);

        return redirect()
            ->route(
                'applications.follow-ups.index',
                $followUp->job_application_id
            )
            ->with('success', 'Follow-up berhasil diperbarui.');
    }

    public function destroy(FollowUp $followUp)
    {
        abort_unless(
            $followUp->jobApplication->user_id === Auth::id(),
            403
        );

        $applicationId = $followUp->job_application_id;

        $followUp->delete();

        return redirect()
            ->route(
                'applications.follow-ups.index',
                $applicationId
            )
            ->with('success', 'Follow-up berhasil dihapus.');
    }
}