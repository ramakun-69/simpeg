<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ResponseOutput;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Passport\Passport;


class CUser extends Controller
{
    use ResponseOutput;
   
    public function me(Request $request): JsonResponse
    {
        return $this->safeExecute(function() use($request){
            $user = $request->user();
            $clientId = $user->token()?->oauth_client_id;
            $client = $clientId ? Passport::client()->newQuery()->find($clientId) : null;

            $applicationCode = $client  ? Str::upper(trim($client->name)) : null;
            return response()->json([
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'email' => $user->email,
                'isAdmin' => $applicationCode  ? $user->isApplicationAdmin($applicationCode) : false,
            ]);
        });
    }

}
