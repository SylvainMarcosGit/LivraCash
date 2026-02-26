# SaaS Fintech Marketplace - Frontend Application

A high-fidelity fintech marketplace inspired by KKiaPay, built with ReactJS and TailwindCSS, designed for seamless integration with Laravel (PHP) REST API backend.

## 🚀 Features

### Core Functionality
- **Multi-Vendor Support**: Separate dashboards for Merchants and Admins
- **Role-Based Access Control (RBAC)**: Admin and Merchant roles with protected routes
- **Multi-Step Onboarding**: Complete KYC flow with document upload
- **Payment Interface**: Support for Mobile Money and Card payments
- **Analytics Dashboard**: Real-time revenue, transactions, and success rate metrics
- **Transaction Management**: Searchable transaction history with filters

### Technical Features
- **React Router v7**: Data mode routing with protected routes
- **Context API**: Authentication and language state management
- **Axios Integration**: Configured API client with interceptors
- **Form Validation**: Client-side validation with error handling
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG 2.1 / RGAA 4.1 compliant

### Localization
- **Multi-Language Support**: English, French, and Fon
- **Persistent Language Selection**: Stored in localStorage
- **Language Switcher**: Available in header and login page

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Dashboard components
│   │   ├── layout/              # Layout components (Header, Sidebar)
│   │   ├── onboarding/          # Multi-step onboarding forms
│   │   ├── payment/             # Payment interface
│   │   └── ui/                  # Reusable UI components
│   ├── contexts/                # React Context providers
│   ├── hooks/                   # Custom React hooks
│   ├── pages/                   # Page components
│   ├── services/                # API services
│   ├── utils/                   # Utility functions
│   ├── App.tsx                  # Root component
│   └── routes.ts                # Route configuration
├── styles/                      # Global styles
└── plan.md                      # Architecture documentation
```

## 🔧 Laravel Integration Guide

### API Configuration

Update the base URL in your environment variables:

```env
VITE_API_BASE_URL=https://your-laravel-api.com/api
```

### API Endpoints Reference

See `/plan.md` for complete API contract documentation including:

- Authentication endpoints (`/api/auth/*`)
- Dashboard endpoints (`/api/dashboard/*`)
- Transaction endpoints (`/api/transactions`)
- Onboarding endpoints (`/api/onboarding/*`)
- Payment endpoints (`/api/payments/*`)
- Admin endpoints (`/api/admin/*`)

### Authentication Flow

1. User logs in via `/api/auth/login`
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. Token added to all requests via Axios interceptor
5. Automatic logout on 401 responses

### Error Handling

The application handles standard Laravel error responses:

- **401 Unauthorized**: Automatic logout and redirect
- **422 Validation Error**: Display field-level errors
- **500 Internal Error**: User-friendly error message

Example Laravel validation error response:
```php
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

## 🎨 Component Architecture

### Authentication Context
```tsx
const { user, token, login, logout, isAuthenticated } = useAuth();
```

### Language Context
```tsx
const { language, setLanguage, t } = useLanguage();
const translatedText = t("dashboard"); // Returns translated string
```

### Protected Routes
Routes automatically redirect unauthenticated users:
```tsx
useEffect(() => {
  if (!isAuthenticated) {
    navigate("/");
  }
}, [isAuthenticated]);
```

## ♿ Accessibility Features

### WCAG 2.1 / RGAA 4.1 Compliance

1. **Semantic HTML**: Proper use of header, main, nav, footer
2. **ARIA Labels**: All interactive elements have descriptive labels
3. **Keyboard Navigation**: Full keyboard support
4. **Focus Indicators**: Visible focus states (3:1 contrast ratio)
5. **Color Contrast**: Minimum 4.5:1 for normal text
6. **Screen Reader Support**: Status announcements and live regions
7. **Form Labels**: Associated labels for all inputs
8. **Error Identification**: Clear, accessible error messages

### Accessibility Utilities

```tsx
import { announceToScreenReader } from "@/app/utils/accessibility";

// Announce to screen readers
announceToScreenReader("Payment successful", "polite");
```

## 🌍 Localization

### Adding New Translations

Edit `/src/app/contexts/LanguageContext.tsx`:

```tsx
const translations = {
  en: { key: "English value" },
  fr: { key: "French value" },
  fon: { key: "Fon value" },
};
```

### Using Translations in Components

```tsx
import { useLanguage } from "@/app/hooks/useLanguage";

const { t } = useLanguage();
return <h1>{t("dashboard")}</h1>;
```

## 🔒 Role-Based Access Control

### Roles
 - **Admin**: Full LivraCash platform access (vendor management, KYC approvals)
- **Merchant**: Vendor access (dashboard, transactions, payments)

### Route Protection
```tsx
// Redirect based on role
useEffect(() => {
  if (user?.role === "admin") {
    navigate("/admin/dashboard");
  } else if (user?.role === "merchant") {
    navigate("/dashboard");
  }
}, [user]);
```

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: 
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Sidebar**: Hidden on mobile, visible on md+

## 🧪 Testing with Mock Data

The application uses mock data for demonstration:

### Login Credentials
- **Admin**: admin@example.com / any password
- **Merchant**: merchant@example.com / any password

### Mock API Responses
All API calls are mocked with realistic delays and data. Replace with actual API calls in production.

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit VITE_API_BASE_URL
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📊 Features Checklist

- ✅ User Authentication (Login/Register)
- ✅ Role-Based Access Control (Admin/Merchant)
- ✅ Vendor Dashboard with Analytics
- ✅ Revenue Charts (Recharts)
- ✅ Transaction Management
- ✅ Multi-Step Onboarding Flow
- ✅ KYC Document Upload
- ✅ Payment Interface (Mobile Money & Card)
- ✅ Multi-Language Support (EN/FR/Fon)
- ✅ Accessibility Compliance (WCAG 2.1)
- ✅ Error Handling (Toasts & Modals)
- ✅ Responsive Design
- ✅ API Integration Ready

## 🔗 Laravel Backend Checklist

To integrate with Laravel, implement:

1. ✅ JWT Authentication (Sanctum/Passport)
2. ✅ User & Vendor Models
3. ✅ Transaction Model & Controllers
4. ✅ Onboarding Flow Endpoints
5. ✅ File Upload for KYC Documents (S3/Local)
6. ✅ Payment Gateway Integration
7. ✅ RBAC Middleware
8. ✅ CORS Configuration
9. ✅ API Rate Limiting
10. ✅ Webhook Handlers for Payments

## 📄 License

This project is created for demonstration purposes.

## 🤝 Support

For questions about Laravel integration, refer to:
- `/plan.md` - Complete architecture and API documentation
- API endpoint examples in the plan
- Laravel documentation: https://laravel.com/docs

---

Built with ❤️ using React, TailwindCSS, and TypeScript
