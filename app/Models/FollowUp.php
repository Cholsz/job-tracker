<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FollowUp extends Model
{
    protected $fillable = [
        'job_application_id',
        'follow_up_date',
        'type',
        'notes',
        'status',
    ];

    protected $casts = [
        'follow_up_date' => 'date',
    ];

    public function jobApplication(): BelongsTo
    {
        return $this->belongsTo(JobApplication::class);
    }
}