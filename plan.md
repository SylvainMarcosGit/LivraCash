# SaaS Fintech Marketplace - Architecture Plan

## Project Overview
A high-fidelity fintech marketplace inspired by KKiaPay, built with ReactJS and TailwindCSS, designed for seamless integration with Laravel (PHP) REST API backend.

---

## Component Architecture

### 1. Core Layout Components
- **`/src/app/components/layout/AppLayout.tsx`** - Main application wrapper with header, sidebar, and footer
- **`/src/app/components/layout/Header.tsx`** - Top navigation bar with user menu and language toggle
- **`/src/app/components/layout/Sidebar.tsx`** - Role-based navigation sidebar
- **`/src/app/components/layout/Footer.tsx`** - Application footer with links and copyright

### 2. Authentication & Authorization
- **`/src/app/pages/Login.tsx`** - Login page with email/password form
- **`/src/app/pages/Register.tsx`** - Initial registration page
- **`/src/app/components/auth/ProtectedRoute.tsx`** - Route wrapper for authenticated pages
- **`/src/app/components/auth/RoleGuard.tsx`** - Component to restrict access based on user role

### 3. Vendor Dashboard (Merchant Role)
- **`/src/app/pages/Dashboard.tsx`** - Main dashboard page
- **`/src/app/components/dashboard/AnalyticsCards.tsx`** - Revenue, commissions, transactions summary
- **`/src/app/components/dashboard/RevenueChart.tsx`** - Line/bar chart showing revenue trends
- **`/src/app/components/dashboard/RecentTransactions.tsx`** - List of latest transactions
- **`/src/app/components/dashboard/TransactionHistory.tsx`** - Searchable/filterable transaction table

### 4. Onboarding Flow (Multi-Step Form)
- **`/src/app/pages/Onboarding.tsx`** - Container for multi-step onboarding
- **`/src/app/components/onboarding/StepIndicator.tsx`** - Progress stepper UI
- **`/src/app/components/onboarding/BusinessInfoStep.tsx`** - Step 1: Business details
- **`/src/app/components/onboarding/OwnerInfoStep.tsx`** - Step 2: Owner information
- **`/src/app/components/onboarding/KYCDocumentStep.tsx`** - Step 3: Document upload (ID, business license)
- **`/src/app/components/onboarding/BankDetailsStep.tsx`** - Step 4: Bank account information
- **`/src/app/components/onboarding/ReviewSubmitStep.tsx`** - Step 5: Review and submit

### 5. Payment Interface
- **`/src/app/pages/Payment.tsx`** - Payment initiation page
- **`/src/app/components/payment/PaymentMethodSelector.tsx`** - Choose Mobile Money or Card
- **`/src/app/components/payment/MobileMoneyForm.tsx`** - Mobile Money payment form
- **`/src/app/components/payment/CardPaymentForm.tsx`** - Card payment form
- **`/src/app/components/payment/TransactionProgress.tsx`** - Animated progress bar during processing
- **`/src/app/components/payment/PaymentSuccess.tsx`** - Success confirmation screen
- **`/src/app/components/payment/PaymentFailed.tsx`** - Failure screen with retry option

### 6. Admin Dashboard (Admin Role)
- **`/src/app/pages/AdminDashboard.tsx`** - Admin overview page
- **`/src/app/components/admin/VendorManagement.tsx`** - List and manage vendors
- **`/src/app/components/admin/PlatformAnalytics.tsx`** - Platform-wide statistics
- **`/src/app/components/admin/PendingApprovals.tsx`** - KYC approvals queue

### 7. Shared UI Components
- **`/src/app/components/ui/Button.tsx`** - Reusable button component
- **`/src/app/components/ui/Input.tsx`** - Form input component
- **`/src/app/components/ui/Select.tsx`** - Dropdown select component
- **`/src/app/components/ui/Modal.tsx`** - Modal dialog component
- **`/src/app/components/ui/Toast.tsx`** - Toast notification component
- **`/src/app/components/ui/Card.tsx`** - Card container component
- **`/src/app/components/ui/Table.tsx`** - Data table component
- **`/src/app/components/ui/Badge.tsx`** - Status badge component
- **`/src/app/components/ui/FileUpload.tsx`** - File upload component with drag-and-drop

### 8. Context & State Management
- **`/src/app/contexts/AuthContext.tsx`** - Authentication state management
- **`/src/app/contexts/LanguageContext.tsx`** - Localization state management
- **`/src/app/contexts/ToastContext.tsx`** - Global toast notifications

### 9. API Integration Layer
- **`/src/app/services/api.ts`** - Axios configuration and base API client
- **`/src/app/services/authService.ts`** - Authentication API calls
- **`/src/app/services/dashboardService.ts`** - Dashboard data API calls
- **`/src/app/services/transactionService.ts`** - Transaction API calls
- **`/src/app/services/onboardingService.ts`** - Onboarding API calls
- **`/src/app/services/paymentService.ts`** - Payment API calls

### 10. Utilities & Hooks
- **`/src/app/hooks/useAuth.ts`** - Custom hook for authentication
- **`/src/app/hooks/useToast.ts`** - Custom hook for notifications
- **`/src/app/hooks/useLanguage.ts`** - Custom hook for translations
- **`/src/app/utils/formatters.ts`** - Currency, date formatting utilities
- **`/src/app/utils/validators.ts`** - Form validation helpers
- **`/src/app/constants/translations.ts`** - Translation strings

---

## Laravel REST API Contract (JSON Structure)

### Authentication Endpoints

#### POST `/api/auth/login`
**Request:**
```json
{
  "email": "vendor@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "vendor@example.com",
      "role": "merchant",
      "phone": "+229123456789",
      "avatar": "https://example.com/avatar.jpg",
      "status": "active",
      "kyc_status": "approved",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2024-02-15T10:30:00Z"
  },
  "message": "Login successful"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": {
    "email": ["The provided credentials are incorrect."]
  }
}
```

#### POST `/api/auth/register`
**Request:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane@example.com",
  "phone": "+229987654321",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane@example.com",
      "role": "merchant",
      "kyc_status": "pending"
    }
  },
  "message": "Registration successful. Please complete onboarding."
}
```

#### POST `/api/auth/logout`
**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/me`
**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "vendor@example.com",
    "role": "merchant",
    "phone": "+229123456789",
    "avatar": "https://example.com/avatar.jpg",
    "status": "active",
    "kyc_status": "approved"
  }
}
```

---

### Dashboard Endpoints

#### GET `/api/dashboard/analytics`
**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_revenue": 15420000,
    "total_commissions": 308400,
    "total_transactions": 1247,
    "pending_settlements": 425000,
    "success_rate": 98.5,
    "revenue_trend": [
      {
        "date": "2024-01-01",
        "revenue": 1200000,
        "transactions": 45
      },
      {
        "date": "2024-01-02",
        "revenue": 1450000,
        "transactions": 52
      }
    ],
    "payment_methods": {
      "mobile_money": 65,
      "card": 35
    },
    "top_currencies": [
      {
        "currency": "XOF",
        "amount": 12000000,
        "percentage": 78
      },
      {
        "currency": "USD",
        "amount": 3420000,
        "percentage": 22
      }
    ]
  }
}
```

#### GET `/api/transactions?page=1&per_page=20&status=success&search=&date_from=&date_to=`
**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "TXN_001",
        "reference": "KKP-20240115-001",
        "customer_name": "Alice Johnson",
        "customer_phone": "+229123456789",
        "amount": 50000,
        "currency": "XOF",
        "commission": 1000,
        "net_amount": 49000,
        "payment_method": "mobile_money",
        "provider": "MTN Mobile Money",
        "status": "success",
        "description": "Payment for order #12345",
        "created_at": "2024-01-15T14:30:00Z",
        "completed_at": "2024-01-15T14:31:00Z"
      },
      {
        "id": "TXN_002",
        "reference": "KKP-20240115-002",
        "customer_name": "Bob Martin",
        "customer_phone": "+229987654321",
        "amount": 25000,
        "currency": "XOF",
        "commission": 500,
        "net_amount": 24500,
        "payment_method": "card",
        "provider": "Visa",
        "status": "pending",
        "description": "Subscription payment",
        "created_at": "2024-01-15T15:45:00Z",
        "completed_at": null
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 1247,
      "last_page": 63,
      "from": 1,
      "to": 20
    }
  }
}
```

---

### Onboarding Endpoints

#### POST `/api/onboarding/business-info`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "business_name": "Tech Solutions Ltd",
  "business_type": "limited_company",
  "business_category": "technology",
  "registration_number": "RC-2023-001",
  "tax_id": "TAX-123456",
  "website": "https://techsolutions.com",
  "description": "IT services and consulting"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "onboarding_id": "OB_001",
    "step_completed": 1,
    "next_step": 2
  },
  "message": "Business information saved successfully"
}
```

#### POST `/api/onboarding/owner-info`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "onboarding_id": "OB_001",
  "date_of_birth": "1985-05-15",
  "nationality": "Benin",
  "id_type": "national_id",
  "id_number": "ID-789456123",
  "address": "123 Main Street, Cotonou",
  "city": "Cotonou",
  "country": "Benin",
  "postal_code": "01BP123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "onboarding_id": "OB_001",
    "step_completed": 2,
    "next_step": 3
  },
  "message": "Owner information saved successfully"
}
```

#### POST `/api/onboarding/kyc-documents`
**Headers:** `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

**Request (FormData):**
```
onboarding_id: "OB_001"
id_document_front: [File]
id_document_back: [File]
business_license: [File]
proof_of_address: [File]
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "onboarding_id": "OB_001",
    "step_completed": 3,
    "next_step": 4,
    "documents": [
      {
        "type": "id_document_front",
        "url": "https://storage.example.com/documents/id_front.jpg",
        "uploaded_at": "2024-01-15T16:00:00Z"
      },
      {
        "type": "id_document_back",
        "url": "https://storage.example.com/documents/id_back.jpg",
        "uploaded_at": "2024-01-15T16:00:01Z"
      }
    ]
  },
  "message": "Documents uploaded successfully"
}
```

**Error Response (422 Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "id_document_front": ["The document must be a file of type: jpeg, png, pdf."],
    "business_license": ["The business license field is required."]
  }
}
```

#### POST `/api/onboarding/bank-details`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "onboarding_id": "OB_001",
  "bank_name": "Bank of Africa",
  "account_name": "Tech Solutions Ltd",
  "account_number": "BJ06BOA01234567890123456",
  "account_type": "business",
  "currency": "XOF"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "onboarding_id": "OB_001",
    "step_completed": 4,
    "next_step": 5
  },
  "message": "Bank details saved successfully"
}
```

#### POST `/api/onboarding/submit`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "onboarding_id": "OB_001",
  "terms_accepted": true,
  "privacy_policy_accepted": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "onboarding_id": "OB_001",
    "status": "under_review",
    "submitted_at": "2024-01-15T16:30:00Z",
    "estimated_review_time": "2-3 business days"
  },
  "message": "Onboarding submitted successfully. Your application is under review."
}
```

#### GET `/api/onboarding/status`
**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "onboarding_id": "OB_001",
    "status": "approved",
    "current_step": 5,
    "completed_steps": [1, 2, 3, 4, 5],
    "kyc_status": "approved",
    "reviewed_at": "2024-01-17T10:00:00Z",
    "reviewer_notes": "All documents verified successfully"
  }
}
```

---

### Payment Endpoints

#### POST `/api/payments/initialize`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "amount": 10000,
  "currency": "XOF",
  "payment_method": "mobile_money",
  "provider": "mtn",
  "customer": {
    "name": "Customer Name",
    "phone": "+229123456789",
    "email": "customer@example.com"
  },
  "description": "Payment for order #12345",
  "metadata": {
    "order_id": "12345",
    "product_name": "Premium Subscription"
  },
  "callback_url": "https://merchant-site.com/payment-callback",
  "return_url": "https://merchant-site.com/payment-success"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transaction_id": "TXN_003",
    "reference": "KKP-20240115-003",
    "amount": 10000,
    "currency": "XOF",
    "payment_method": "mobile_money",
    "provider": "mtn",
    "status": "pending",
    "payment_url": "https://payment.kkiapay.com/pay/KKP-20240115-003",
    "qr_code": "https://api.kkiapay.com/qr/KKP-20240115-003.png",
    "ussd_code": "*880*1234#",
    "expires_at": "2024-01-15T17:00:00Z",
    "created_at": "2024-01-15T16:30:00Z"
  },
  "message": "Payment initialized successfully"
}
```

#### GET `/api/payments/{transaction_id}/status`
**Headers:** `Authorization: Bearer {token}`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transaction_id": "TXN_003",
    "reference": "KKP-20240115-003",
    "status": "success",
    "amount": 10000,
    "currency": "XOF",
    "commission": 200,
    "net_amount": 9800,
    "payment_method": "mobile_money",
    "provider": "mtn",
    "customer": {
      "name": "Customer Name",
      "phone": "+229123456789"
    },
    "completed_at": "2024-01-15T16:32:00Z"
  }
}
```

#### POST `/api/payments/{transaction_id}/refund`
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "amount": 10000,
  "reason": "Customer requested refund",
  "notes": "Duplicate payment"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "refund_id": "REF_001",
    "transaction_id": "TXN_003",
    "amount": 10000,
    "currency": "XOF",
    "status": "processing",
    "estimated_completion": "2-5 business days",
    "created_at": "2024-01-15T17:00:00Z"
  },
  "message": "Refund initiated successfully"
}
```

---

### Admin Endpoints

#### GET `/api/admin/vendors?page=1&per_page=20&status=&search=`
**Headers:** `Authorization: Bearer {token}` (Admin role required)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "vendors": [
      {
        "id": 1,
        "business_name": "Tech Solutions Ltd",
        "owner_name": "John Doe",
        "email": "vendor@example.com",
        "phone": "+229123456789",
        "kyc_status": "approved",
        "status": "active",
        "total_revenue": 15420000,
        "total_transactions": 1247,
        "commission_rate": 2.0,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 145,
      "last_page": 8
    }
  }
}
```

#### GET `/api/admin/analytics`
**Headers:** `Authorization: Bearer {token}` (Admin role required)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "platform_revenue": 125000000,
    "platform_commissions": 2500000,
    "total_vendors": 145,
    "active_vendors": 132,
    "pending_kyc": 13,
    "total_transactions": 45678,
    "success_rate": 97.8,
    "revenue_by_country": [
      {
        "country": "Benin",
        "revenue": 75000000,
        "percentage": 60
      },
      {
        "country": "Togo",
        "revenue": 50000000,
        "percentage": 40
      }
    ]
  }
}
```

#### PUT `/api/admin/vendors/{vendor_id}/kyc-status`
**Headers:** `Authorization: Bearer {token}` (Admin role required)

**Request:**
```json
{
  "status": "approved",
  "notes": "All documents verified successfully"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "vendor_id": 1,
    "kyc_status": "approved",
    "reviewed_at": "2024-01-15T18:00:00Z",
    "reviewer": "Admin User"
  },
  "message": "KYC status updated successfully"
}
```

---

## Error Response Standards

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthenticated",
  "code": "UNAUTHORIZED"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "code": "FORBIDDEN"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "amount": ["The amount must be at least 100."]
  },
  "code": "VALIDATION_ERROR"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "An unexpected error occurred. Please try again later.",
  "code": "INTERNAL_ERROR"
}
```

---

## RBAC (Role-Based Access Control) System

### Roles
1. **Admin** - Full platform access
   - View all vendors and transactions
   - Approve/reject KYC applications
   - Manage platform settings
   - Access platform-wide analytics

2. **Merchant** - Vendor access
   - View own dashboard and analytics
   - Access transaction history
   - Initiate payments
   - Manage business profile
   - Submit onboarding/KYC

### Permission Matrix

| Feature | Admin | Merchant |
|---------|-------|----------|
| View Dashboard | ✓ | ✓ |
| View Own Analytics | ✓ | ✓ |
| View All Vendors | ✓ | ✗ |
| Approve KYC | ✓ | ✗ |
| Platform Analytics | ✓ | ✗ |
| Submit Onboarding | ✗ | ✓ |
| Initiate Payments | ✗ | ✓ |
| View Own Transactions | ✓ | ✓ |
| View All Transactions | ✓ | ✗ |
| Refund Transactions | ✓ | ✓ |

---

## Accessibility Compliance (WCAG 2.1 / RGAA 4.1)

### Requirements
1. **Color Contrast** - Minimum 4.5:1 for normal text, 3:1 for large text
2. **Focus Indicators** - Visible focus states for all interactive elements
3. **Keyboard Navigation** - Full keyboard accessibility
4. **Screen Reader Support** - Proper ARIA labels and semantic HTML
5. **Form Labels** - Associated labels for all form inputs
6. **Error Identification** - Clear error messages with suggestions
7. **Skip Links** - Skip to main content navigation
8. **Responsive Text** - Minimum 16px base font size
9. **Touch Targets** - Minimum 44x44px for mobile interactions

---

## Localization Support

### Supported Languages
1. **French (fr)** - Primary language (West Africa)
2. **English (en)** - Secondary language
3. **Fon** - Local language (Benin)

### Implementation
- Language context provider
- Translation JSON files
- Language switcher in header
- Persistent language preference (localStorage)
- Right-to-left (RTL) support consideration

### Translation Keys Structure
```typescript
{
  "common": {
    "login": "Se connecter",
    "logout": "Se déconnecter",
    "dashboard": "Tableau de bord",
    "transactions": "Transactions"
  },
  "dashboard": {
    "total_revenue": "Revenu total",
    "total_commissions": "Commissions totales"
  },
  "payment": {
    "mobile_money": "Mobile Money",
    "card_payment": "Paiement par carte"
  }
}
```

---

## Technical Implementation Notes

### State Management
- React Context API for global state (Auth, Language, Toast)
- Local component state for UI interactions
- Custom hooks for reusable logic

### API Integration
- Axios for HTTP requests
- Interceptors for token management
- Error handling middleware
- Request/response logging (development)

### Form Handling
- Controlled components
- Client-side validation
- Real-time error feedback
- File upload with progress indicators

### Performance Optimization
- Lazy loading for routes
- Image optimization
- Debouncing for search inputs
- Pagination for large datasets

### Security Considerations
- JWT token storage (httpOnly cookies recommended for Laravel)
- CSRF protection
- Input sanitization
- XSS prevention
- Secure file uploads

---

## Routing Structure

```
/                           → Landing/Login page (public)
/register                   → Registration page (public)
/onboarding                 → Multi-step onboarding (merchant, protected)
/dashboard                  → Vendor dashboard (merchant, protected)
/transactions               → Transaction history (merchant, protected)
/payment/new                → Payment initialization (merchant, protected)
/payment/:id/status         → Payment status page (merchant, protected)
/admin/dashboard            → Admin dashboard (admin, protected)
/admin/vendors              → Vendor management (admin, protected)
/admin/vendors/:id          → Vendor details (admin, protected)
/admin/kyc-approvals        → KYC approval queue (admin, protected)
/profile                    → User profile (protected)
/settings                   → Account settings (protected)
/404                        → Not found page
```

---

## Development Workflow

1. **Phase 1:** Core architecture, routing, and authentication
2. **Phase 2:** Vendor dashboard with analytics and charts
3. **Phase 3:** Multi-step onboarding flow with file uploads
4. **Phase 4:** Payment interface with Mobile Money and Card options
5. **Phase 5:** Admin dashboard and vendor management
6. **Phase 6:** Accessibility enhancements and localization
7. **Phase 7:** Testing, refinement, and documentation

---

## Next Steps for Laravel Backend Team

1. Implement the API endpoints following the contract above
2. Set up JWT authentication with Laravel Sanctum or Passport
3. Create database migrations for users, vendors, transactions, onboarding
4. Implement RBAC middleware for route protection
5. Set up file storage for KYC documents (S3 or local)
6. Integrate payment gateway APIs (Mobile Money, Card processors)
7. Implement webhook handlers for payment status updates
8. Set up CORS configuration for frontend domain
9. Create API documentation (Swagger/OpenAPI)
10. Implement rate limiting and security measures

---

This architecture plan provides a complete blueprint for building the fintech marketplace frontend and defines clear API contracts for Laravel backend integration.
