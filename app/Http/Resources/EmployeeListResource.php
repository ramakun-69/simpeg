<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->user?->id,
            'username' => $this->user?->username ?? $this->nip,
            'name' => $this->user?->name ?? $this->name,
            'email' => $this->user?->email,
        ];
    }
}
