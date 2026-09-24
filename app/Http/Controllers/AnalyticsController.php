<?php

namespace App\Http\Controllers;

use App\Models\FollowUp;
use App\Models\Interview;
use App\Models\JobApplication;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        /*
        |--------------------------------------------------------------------------
        | Base Query
        |--------------------------------------------------------------------------
        */

        $applicationsQuery = JobApplication::where('user_id', $userId);

        /*
        |--------------------------------------------------------------------------
        | Summary
        |--------------------------------------------------------------------------
        */

        $totalApplications = (clone $applicationsQuery)->count();

        $interviewApplications = (clone $applicationsQuery)
            ->where('status', 'interview')
            ->count();

        $offerApplications = (clone $applicationsQuery)
            ->where('status', 'offer')
            ->count();

        $rejectedApplications = (clone $applicationsQuery)
            ->where('status', 'rejected')
            ->count();

        $screeningApplications = (clone $applicationsQuery)
            ->where('status', 'screening')
            ->count();

        $appliedApplications = (clone $applicationsQuery)
            ->where('status', 'applied')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Application Status
        |--------------------------------------------------------------------------
        */

        $statusBreakdown = [
            [
                'status' => 'applied',
                'label' => 'Applied',
                'count' => $appliedApplications,
            ],
            [
                'status' => 'screening',
                'label' => 'Screening',
                'count' => $screeningApplications,
            ],
            [
                'status' => 'interview',
                'label' => 'Interview',
                'count' => $interviewApplications,
            ],
            [
                'status' => 'offer',
                'label' => 'Offer',
                'count' => $offerApplications,
            ],
            [
                'status' => 'rejected',
                'label' => 'Rejected',
                'count' => $rejectedApplications,
            ],
        ];

        /*
        |--------------------------------------------------------------------------
        | Employment Type
        |--------------------------------------------------------------------------
        */

        $employmentTypeBreakdown = (clone $applicationsQuery)
            ->selectRaw('employment_type, COUNT(*) as count')
            ->whereNotNull('employment_type')
            ->groupBy('employment_type')
            ->orderByDesc('count')
            ->get()
            ->map(function ($item) {
                return [
                    'type' => $item->employment_type,
                    'count' => (int) $item->count,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Applications Per Month
        |--------------------------------------------------------------------------
        */

        $monthlyApplications = (clone $applicationsQuery)
            ->selectRaw(
                "DATE_FORMAT(applied_at, '%Y-%m') as month, COUNT(*) as count"
            )
            ->whereNotNull('applied_at')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'count' => (int) $item->count,
                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Interviews
        |--------------------------------------------------------------------------
        */

        $totalInterviews = Interview::whereHas(
            'jobApplication',
            function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }
        )->count();

        $passedInterviews = Interview::whereHas(
            'jobApplication',
            function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }
        )
            ->where('result', 'passed')
            ->count();

        $failedInterviews = Interview::whereHas(
            'jobApplication',
            function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }
        )
            ->where('result', 'failed')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Follow-ups
        |--------------------------------------------------------------------------
        */

        $totalFollowUps = FollowUp::whereHas(
            'jobApplication',
            function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }
        )->count();

        $completedFollowUps = FollowUp::whereHas(
            'jobApplication',
            function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }
        )
            ->where('status', 'completed')
            ->count();

        $pendingFollowUps = FollowUp::whereHas(
            'jobApplication',
            function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }
        )
            ->where('status', 'pending')
            ->count();

        $overdueFollowUps = FollowUp::whereHas(
            'jobApplication',
            function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }
        )
            ->where('status', 'pending')
            ->whereDate('follow_up_date', '<', today())
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Conversion
        |--------------------------------------------------------------------------
        */

        $offerRate = $totalApplications > 0
            ? round(($offerApplications / $totalApplications) * 100, 1)
            : 0;

        $interviewRate = $totalApplications > 0
            ? round(($interviewApplications / $totalApplications) * 100, 1)
            : 0;

        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return Inertia::render('analytics', [
            'summary' => [
                'totalApplications' => $totalApplications,
                'applied' => $appliedApplications,
                'screening' => $screeningApplications,
                'interview' => $interviewApplications,
                'offer' => $offerApplications,
                'rejected' => $rejectedApplications,
                'offerRate' => $offerRate,
                'interviewRate' => $interviewRate,
            ],

            'statusBreakdown' => $statusBreakdown,

            'employmentTypeBreakdown' => $employmentTypeBreakdown,

            'monthlyApplications' => $monthlyApplications,

            'interviews' => [
                'total' => $totalInterviews,
                'passed' => $passedInterviews,
                'failed' => $failedInterviews,
            ],

            'followUps' => [
                'total' => $totalFollowUps,
                'completed' => $completedFollowUps,
                'pending' => $pendingFollowUps,
                'overdue' => $overdueFollowUps,
            ],
        ]);
    }
}