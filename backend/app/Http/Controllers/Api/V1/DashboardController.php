<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboard)
    {
    }

    /** GET /dashboard (admin only). The route middleware checks the role. */
    public function __invoke(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->dashboard->summaryFor($request->user()),
        ]);
    }
}
