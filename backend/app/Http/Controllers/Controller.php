<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller // Base controller class. All controllers should extend this.
{
    use AuthorizesRequests;
}
