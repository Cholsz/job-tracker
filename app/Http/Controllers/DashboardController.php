<?php

namespace App\Http\Controllers;

use App\Models\FollowUp;
use App\Models\Interview;
use App\Models\JobApplication;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        /*
        |--------------------------------------------------------------------------
        | Job Applications
        |--------------------------------------------------------------------------
        */
        $applications = JobApplication::where('user_id', $userId)
            ->latest('applied_at')
            ->latest('id')
            ->get([
                'id',
                'company_name',
                'position',
                'location',
                'applied_at',
                'status',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Statistics
        |--------------------------------------------------------------------------
        */
        $statistics = [
            'total' => JobApplication::where('user_id', $userId)->count(),
            'interview' => JobApplication::where('user_id', $userId)
                ->where('status', 'interview')
                ->count(),
            'offer' => JobApplication::where('user_id', $userId)
                ->where('status', 'offer')
                ->count(),
            'rejected' => JobApplication::where('user_id', $userId)
                ->where('status', 'rejected')
                ->count(),
            'pendingFollowUps' => FollowUp::whereHas(
                'jobApplication',
                function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            )
                ->where('status', 'pending')
                ->count(),
            'overdueFollowUps' => FollowUp::whereHas(
                'jobApplication',
                function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            )
                ->where('status', 'pending')
                ->where('follow_up_date', '<', today())
                ->count(),
        ];

        /*
        |--------------------------------------------------------------------------
        | Upcoming Interviews
        |--------------------------------------------------------------------------
        */
        $upcomingInterviews = Interview::whereHas(
                'jobApplication',
                function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            )
            ->where('interview_date', '>=', now())
            ->with([
                'jobApplication:id,company_name,position',
            ])
            ->orderBy('interview_date')
            ->take(5)
            ->get([
                'id',
                'job_application_id',
                'interview_date',
                'interview_type',
                'interviewer',
                'location',
                'meeting_url',
                'result',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Upcoming Follow-ups
        |--------------------------------------------------------------------------
        | Follow-up yang masih pending dan tanggalnya hari ini
        | atau setelahnya.
        */
        $upcomingFollowUps = FollowUp::whereHas(
                'jobApplication',
                function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            )
            ->where('status', 'pending')
            ->where('follow_up_date', '>=', today())
            ->with([
                'jobApplication:id,company_name,position',
            ])
            ->orderBy('follow_up_date')
            ->take(5)
            ->get([
                'id',
                'job_application_id',
                'follow_up_date',
                'type',
                'notes',
                'status',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Overdue Follow-ups
        |--------------------------------------------------------------------------
        | Follow-up yang masih pending tetapi tanggalnya sudah lewat.
        */
        $overdueFollowUps = FollowUp::whereHas(
                'jobApplication',
                function ($query) use ($userId) {
                    $query->where('user_id', $userId);
                }
            )
            ->where('status', 'pending')
            ->where('follow_up_date', '<', today())
            ->with([
                'jobApplication:id,company_name,position',
            ])
            ->orderBy('follow_up_date')
            ->take(5)
            ->get([
                'id',
                'job_application_id',
                'follow_up_date',
                'type',
                'notes',
                'status',
            ]);

        return Inertia::render('dashboard', [
            'applications' => $applications,
            'upcomingInterviews' => $upcomingInterviews,
            'upcomingFollowUps' => $upcomingFollowUps,
            'overdueFollowUps' => $overdueFollowUps,
            'statistics' => $statistics,
        ]);
    }
}