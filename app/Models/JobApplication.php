<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobApplication extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'position',
        'location',
        'employment_type',
        'source',
        'job_url',
        'applied_at',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'applied_at' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }

    public function followUps(): HasMany
{
    return $this->hasMany(FollowUp::class);
}
}