# Laravel Backend Integration Guide

This document provides step-by-step instructions for Laravel backend developers to integrate with this React frontend.

## Prerequisites

- Laravel 10+
- PHP 8.1+
- Composer
- MySQL/PostgreSQL

## Quick Start

### 1. Install Required Packages

```bash
composer require laravel/sanctum
composer require intervention/image  # For image processing
```

### 2. Configure CORS

In `config/cors.php`:

```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### 3. Set Up Authentication

In `app/Http/Kernel.php`, add to API middleware:

```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

### 4. Database Migrations

Create migrations for key tables:

```bash
php artisan make:migration create_vendors_table
php artisan make:migration create_transactions_table
php artisan make:migration create_onboarding_submissions_table
```

## Key Implementations

### Authentication Controller

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'phone' => $user->phone,
                        'status' => $user->status,
                        'kyc_status' => $user->kyc_status,
                    ],
                    'token' => $token,
                    'expires_at' => now()->addDays(30),
                ],
                'message' => 'Login successful'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials',
            'errors' => [
                'email' => ['The provided credentials are incorrect.']
            ]
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }
}
```

### Dashboard Controller

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function analytics(Request $request)
    {
        $user = $request->user();
        
        $totalRevenue = Transaction::where('vendor_id', $user->id)
            ->where('status', 'success')
            ->sum('amount');
            
        $totalCommissions = $totalRevenue * 0.02; // 2% commission
        
        $totalTransactions = Transaction::where('vendor_id', $user->id)->count();
        
        $successRate = Transaction::where('vendor_id', $user->id)
            ->where('status', 'success')
            ->count() / max($totalTransactions, 1) * 100;

        // Revenue trend for last 7 days
        $revenueTrend = Transaction::where('vendor_id', $user->id)
            ->where('status', 'success')
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->selectRaw('DATE(created_at) as date, SUM(amount) as revenue, COUNT(*) as transactions')
            ->groupBy('date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_revenue' => $totalRevenue,
                'total_commissions' => $totalCommissions,
                'total_transactions' => $totalTransactions,
                'success_rate' => round($successRate, 2),
                'revenue_trend' => $revenueTrend,
            ]
        ]);
    }
}
```

### Transaction Controller

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::where('vendor_id', $request->user()->id);

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('reference', 'like', "%{$request->search}%")
                  ->orWhere('customer_name', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        $transactions = $query->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => [
                'transactions' => $transactions->items(),
                'pagination' => [
                    'current_page' => $transactions->currentPage(),
                    'per_page' => $transactions->perPage(),
                    'total' => $transactions->total(),
                    'last_page' => $transactions->lastPage(),
                    'from' => $transactions->firstItem(),
                    'to' => $transactions->lastItem(),
                ]
            ]
        ]);
    }
}
```

### Onboarding Controller

```php
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OnboardingSubmission;
use Illuminate\Support\Facades\Storage;

class OnboardingController extends Controller
{
    public function submitBusinessInfo(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'business_type' => 'required|string',
            'business_category' => 'required|string',
            'registration_number' => 'required|string',
            'tax_id' => 'nullable|string',
            'website' => 'nullable|url',
            'description' => 'nullable|string',
        ]);

        $submission = OnboardingSubmission::updateOrCreate(
            ['user_id' => $request->user()->id],
            array_merge($validated, ['step_completed' => 1])
        );

        return response()->json([
            'success' => true,
            'data' => [
                'onboarding_id' => $submission->id,
                'step_completed' => 1,
                'next_step' => 2,
            ],
            'message' => 'Business information saved successfully'
        ]);
    }

    public function uploadDocuments(Request $request)
    {
        $request->validate([
            'onboarding_id' => 'required|exists:onboarding_submissions,id',
            'id_document_front' => 'required|file|mimes:jpeg,png,pdf|max:5120',
            'id_document_back' => 'nullable|file|mimes:jpeg,png,pdf|max:5120',
            'business_license' => 'required|file|mimes:jpeg,png,pdf|max:5120',
            'proof_of_address' => 'nullable|file|mimes:jpeg,png,pdf|max:5120',
        ]);

        $submission = OnboardingSubmission::findOrFail($request->onboarding_id);
        
        $documents = [];

        foreach (['id_document_front', 'id_document_back', 'business_license', 'proof_of_address'] as $field) {
            if ($request->hasFile($field)) {
                $path = $request->file($field)->store('kyc-documents', 's3');
                $documents[] = [
                    'type' => $field,
                    'url' => Storage::disk('s3')->url($path),
                    'uploaded_at' => now(),
                ];
            }
        }

        $submission->update([
            'documents' => json_encode($documents),
            'step_completed' => 3,
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'onboarding_id' => $submission->id,
                'step_completed' => 3,
                'next_step' => 4,
                'documents' => $documents,
            ],
            'message' => 'Documents uploaded successfully'
        ]);
    }
}
```

### Middleware for Role-Based Access

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to perform this action',
                'code' => 'FORBIDDEN'
            ], 403);
        }

        return $next($request);
    }
}
```

Register in `app/Http/Kernel.php`:

```php
protected $routeMiddleware = [
    // ... other middleware
    'role' => \App\Http\Middleware\CheckRole::class,
];
```

## API Routes

In `routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\OnboardingController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\AdminController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/analytics', [DashboardController::class, 'analytics']);
    
    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{id}', [TransactionController::class, 'show']);
    Route::post('/payments/{id}/refund', [PaymentController::class, 'refund']);

    // Onboarding
    Route::post('/onboarding/business-info', [OnboardingController::class, 'submitBusinessInfo']);
    Route::post('/onboarding/owner-info', [OnboardingController::class, 'submitOwnerInfo']);
    Route::post('/onboarding/kyc-documents', [OnboardingController::class, 'uploadDocuments']);
    Route::post('/onboarding/bank-details', [OnboardingController::class, 'submitBankDetails']);
    Route::post('/onboarding/submit', [OnboardingController::class, 'finalSubmit']);
    Route::get('/onboarding/status', [OnboardingController::class, 'getStatus']);

    // Payments
    Route::post('/payments/initialize', [PaymentController::class, 'initialize']);
    Route::get('/payments/{id}/status', [PaymentController::class, 'getStatus']);

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/vendors', [AdminController::class, 'getVendors']);
        Route::get('/analytics', [AdminController::class, 'getAnalytics']);
        Route::put('/vendors/{id}/kyc-status', [AdminController::class, 'updateKycStatus']);
    });
});
```

## Database Schema Examples

### Users Table

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('first_name');
    $table->string('last_name');
    $table->string('email')->unique();
    $table->string('phone');
    $table->string('password');
    $table->enum('role', ['admin', 'merchant'])->default('merchant');
    $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
    $table->enum('kyc_status', ['pending', 'under_review', 'approved', 'rejected'])->default('pending');
    $table->string('avatar')->nullable();
    $table->timestamps();
});
```

### Transactions Table

```php
Schema::create('transactions', function (Blueprint $table) {
    $table->id();
    $table->string('reference')->unique();
    $table->foreignId('vendor_id')->constrained('users');
    $table->string('customer_name');
    $table->string('customer_phone');
    $table->string('customer_email')->nullable();
    $table->decimal('amount', 15, 2);
    $table->string('currency', 3)->default('XOF');
    $table->decimal('commission', 15, 2);
    $table->decimal('net_amount', 15, 2);
    $table->enum('payment_method', ['mobile_money', 'card']);
    $table->string('provider');
    $table->enum('status', ['pending', 'success', 'failed'])->default('pending');
    $table->text('description')->nullable();
    $table->json('metadata')->nullable();
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();
});
```

## Environment Variables

Add to your `.env`:

```env
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173

# Payment Gateway
KKIAPAY_PUBLIC_KEY=your_public_key
KKIAPAY_PRIVATE_KEY=your_private_key
KKIAPAY_SECRET=your_secret

# File Storage
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your_bucket_name
```

## Testing

Run migrations and seed test data:

```bash
php artisan migrate
php artisan db:seed
```

Test the API:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"merchant@example.com","password":"password"}'

# Get analytics (with token)
curl -X GET http://localhost:8000/api/dashboard/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Security Checklist

- ✅ Enable HTTPS in production
- ✅ Set up rate limiting
- ✅ Implement CSRF protection
- ✅ Validate all inputs
- ✅ Sanitize file uploads
- ✅ Use prepared statements (Eloquent does this)
- ✅ Implement proper error logging
- ✅ Set up monitoring (Laravel Telescope)
- ✅ Regular security updates

## Deployment

### Production Checklist

1. Set `APP_ENV=production` in `.env`
2. Run `php artisan config:cache`
3. Run `php artisan route:cache`
4. Run `php artisan view:cache`
5. Set up queue workers
6. Configure backups
7. Set up monitoring

## Support & Documentation

- Laravel Documentation: https://laravel.com/docs
- Laravel Sanctum: https://laravel.com/docs/sanctum
- Frontend Documentation: `/README.md`
- API Contract: `/plan.md`

---

For questions or issues, refer to the architecture plan in `/plan.md`.
