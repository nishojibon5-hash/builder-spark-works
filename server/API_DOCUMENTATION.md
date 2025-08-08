# LoanBondhu API Documentation

## Base URL
```
https://api.loanapp.com/v1
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this structure:
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string,
  "pagination": {
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

---

## Auth & User Management

### POST /auth/login
User login with phone number and password or OTP.

**Request Body:**
```json
{
  "phone": "01712345678",
  "password": "user123",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 2,
    "name": "মোহাম্মদ রহিম",
    "phone": "01712345678",
    "role": "user"
  }
}
```

### POST /auth/admin-login
Admin login (restricted to phone: 01650074073).

**Request Body:**
```json
{
  "phone": "01650074073",
  "password": "admin123"
}
```

### POST /auth/register
User registration.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "01812345678",
  "password": "password123",
  "dob": "1990-01-01",
  "address": "Dhaka, Bangladesh"
}
```

### GET /auth/profile
Get logged-in user profile.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 2,
    "name": "মোহাম্মদ রহিম",
    "phone": "01712345678",
    "role": "user",
    "dob": "1990-05-15",
    "address": "House 123, Road 5, Dhanmondi, Dhaka"
  }
}
```

### PUT /auth/profile
Update user profile.

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "Updated Name",
  "dob": "1990-01-01",
  "address": "New Address"
}
```

---

## KYC Verification

### POST /kyc/upload
Upload KYC documents.

**Headers:** Authorization required

**Request Body:**
```json
{
  "document_type": "NID",
  "document_number": "1234567890123",
  "front_image": "base64_encoded_image_data",
  "back_image": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "kyc_id": 1,
    "user_id": 2,
    "document_type": "NID",
    "document_number": "1234567890123",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /kyc/status/:userId
Get KYC status for a user.

**Headers:** Authorization required
**Parameters:** 
- `userId` (number) - User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "kyc_id": 1,
    "user_id": 2,
    "document_type": "NID",
    "status": "verified",
    "reviewed_by": 1,
    "reviewed_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### PUT /kyc/verify/:userId
Admin verifies KYC (Admin only).

**Headers:** Authorization required
**Parameters:** 
- `userId` (number) - User ID

**Request Body:**
```json
{
  "notes": "All documents verified successfully"
}
```

### PUT /kyc/reject/:userId
Admin rejects KYC (Admin only).

**Headers:** Authorization required
**Parameters:** 
- `userId` (number) - User ID

**Request Body:**
```json
{
  "reason": "Document quality is poor, please resubmit"
}
```

---

## Loan Management

### POST /loans/apply
Apply for a loan.

**Headers:** Authorization required

**Request Body:**
```json
{
  "loan_type": "salary",
  "amount": 150000,
  "tenure_months": 24,
  "purpose": "Home renovation and medical expenses",
  "monthly_income": 45000,
  "employment_type": "salaried",
  "employer_name": "XYZ Company"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "loan_id": 1,
    "user_id": 2,
    "loan_type": "salary",
    "amount": 150000,
    "interest_rate": 15,
    "tenure_months": 24,
    "monthly_emi": 7125,
    "purpose": "Home renovation and medical expenses",
    "status": "pending",
    "applied_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /loans/user/:userId
Get all loans for a user.

**Headers:** Authorization required
**Parameters:** 
- `userId` (number) - User ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "loan_id": 1,
      "loan_type": "salary",
      "amount": 150000,
      "status": "disbursed",
      "monthly_emi": 7125,
      "applied_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET /loans/:loanId
Get loan details.

**Headers:** Authorization required
**Parameters:** 
- `loanId` (number) - Loan ID

### PUT /loans/update-status/:loanId
Admin updates loan status (Admin only).

**Headers:** Authorization required
**Parameters:** 
- `loanId` (number) - Loan ID

**Request Body:**
```json
{
  "status": "approved",
  "approved_amount": 150000,
  "rejection_reason": ""
}
```

### GET /loans/all
Admin gets all loan applications (Admin only).

**Headers:** Authorization required
**Query Parameters:**
- `status` (string) - Filter by status
- `loan_type` (string) - Filter by loan type
- `page` (number) - Page number
- `limit` (number) - Items per page
- `search` (string) - Search term

---

## Repayment Management

### POST /repayments/add
Add a repayment entry (Admin only).

**Headers:** Authorization required

**Request Body:**
```json
{
  "loan_id": 1,
  "amount_paid": 7125,
  "payment_method": "bKash",
  "payment_date": "2024-01-15",
  "transaction_reference": "TXN123456789"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "repayment_id": 1,
    "loan_id": 1,
    "user_id": 2,
    "amount_paid": 7125,
    "payment_method": "bKash",
    "payment_date": "2024-01-15",
    "emi_number": 1,
    "status": "completed",
    "late_fee": 0
  }
}
```

### GET /repayments/user/:userId
Get repayment history of a user.

**Headers:** Authorization required
**Parameters:** 
- `userId` (number) - User ID

### GET /repayments/loan/:loanId
Get repayment history for a specific loan.

**Headers:** Authorization required
**Parameters:** 
- `loanId` (number) - Loan ID

**Response:**
```json
{
  "success": true,
  "data": {
    "loan_details": {
      "loan_id": 1,
      "amount": 150000,
      "tenure_months": 24,
      "monthly_emi": 7125
    },
    "emi_schedule": [
      {
        "emi_number": 1,
        "due_date": "2024-02-01",
        "emi_amount": 7125,
        "status": "paid",
        "payment_date": "2024-01-31",
        "amount_paid": 7125
      }
    ],
    "total_paid": 7125,
    "remaining_emis": 23
  }
}
```

### GET /repayments/overdue
Get overdue payments (Admin only).

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "loan_id": 2,
      "user_id": 3,
      "user_name": "ফাতেমা খাতুন",
      "emi_number": 2,
      "emi_amount": 2292,
      "due_date": "2024-01-10",
      "days_overdue": 5,
      "late_fee": 115,
      "total_amount_due": 2407
    }
  ],
  "total_overdue": 1,
  "total_overdue_amount": 2407
}
```

---

## Savings Management

### POST /savings/add
Add a savings entry.

**Headers:** Authorization required

**Request Body:**
```json
{
  "amount": 5000,
  "transaction_type": "deposit",
  "date": "2024-01-15",
  "description": "Monthly savings deposit",
  "user_id": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "saving_id": 1,
    "user_id": 2,
    "amount": 5000,
    "transaction_type": "deposit",
    "date": "2024-01-15",
    "new_balance": 5000
  }
}
```

### GET /savings/user/:userId
Get savings history of a user.

**Headers:** Authorization required
**Parameters:** 
- `userId` (number) - User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "user_info": {
      "user_id": 2,
      "name": "মোহাম্মদ রহিম",
      "phone": "01712345678"
    },
    "current_balance": 3000,
    "total_deposits": 5000,
    "total_withdrawals": 2000,
    "transaction_count": 2,
    "transactions": [
      {
        "saving_id": 1,
        "amount": 5000,
        "transaction_type": "deposit",
        "date": "2024-01-10",
        "description": "Monthly savings deposit"
      }
    ]
  }
}
```

---

## Admin Panel Management

### POST /admin/users/add
Add new user/subadmin/editor (Admin only).

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "Sub Admin",
  "phone": "01888888888",
  "password": "subadmin123",
  "role": "subadmin",
  "dob": "1985-01-01",
  "address": "Dhaka, Bangladesh"
}
```

### GET /admin/users
List all users (Admin only).

**Headers:** Authorization required
**Query Parameters:**
- `role` (string) - Filter by role
- `page` (number) - Page number
- `limit` (number) - Items per page
- `search` (string) - Search term

### GET /admin/dashboard
Get dashboard statistics (Admin only).

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "total_users": 1234,
    "total_loans": 567,
    "total_disbursed": 123456789,
    "total_repayments": 98765432,
    "pending_kyc": 45,
    "pending_loans": 23,
    "overdue_payments": 5,
    "collection_rate": 92.5,
    "portfolio_at_risk": 2.8,
    "kyc_stats": {
      "pending": 45,
      "verified": 1189,
      "total": 1234
    },
    "recent_activity": {
      "new_loans_7d": 15,
      "new_repayments_7d": 89,
      "new_kyc_7d": 12
    }
  }
}
```

---

## Reports & Analytics

### GET /reports/loans
Loan disbursement report (Admin only).

**Headers:** Authorization required
**Query Parameters:**
- `period` (string) - Time period: today, week, month, quarter, year
- `loan_type` (string) - Filter by loan type
- `status` (string) - Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "period": "month",
      "total_applications": 156,
      "approved_loans": 132,
      "disbursed_loans": 128,
      "rejected_loans": 24,
      "total_disbursed_amount": 15678000,
      "approval_rate": 84.6
    },
    "by_type": [
      {
        "loan_type": "salary",
        "count": 89,
        "disbursed_amount": 12500000,
        "approval_rate": 87.6
      }
    ],
    "daily_breakdown": [
      {
        "date": "2024-01-15",
        "applications": 8,
        "disbursed": 6,
        "amount": 850000
      }
    ]
  }
}
```

### GET /reports/repayments
Repayment report (Admin only).

**Headers:** Authorization required
**Query Parameters:**
- `period` (string) - Time period
- `payment_method` (string) - Filter by payment method
- `status` (string) - Filter by status

### GET /reports/export
Export data as CSV/PDF (Admin only).

**Headers:** Authorization required
**Query Parameters:**
- `type` (string) - Report type: loans, repayments, savings, portfolio
- `format` (string) - Export format: csv, pdf, excel
- `period` (string) - Time period

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "loan_report_month_2024-01-15.csv",
    "headers": ["Loan ID", "User Name", "Phone", "Loan Type", "Amount", "Status"],
    "data": [
      [1, "মোহাম্মদ রহিম", "01712345678", "salary", 150000, "disbursed"]
    ]
  }
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

API calls are rate limited to:
- 1000 requests per hour for authenticated users
- 100 requests per hour for unauthenticated endpoints

---

## Webhooks

### Loan Status Updates
```json
{
  "event": "loan.status_updated",
  "data": {
    "loan_id": 1,
    "user_id": 2,
    "old_status": "pending",
    "new_status": "approved",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Payment Received
```json
{
  "event": "payment.received",
  "data": {
    "repayment_id": 1,
    "loan_id": 1,
    "user_id": 2,
    "amount": 7125,
    "payment_method": "bKash",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## SDKs

### Node.js Example
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.loanapp.com/v1',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Apply for a loan
const applyLoan = async () => {
  try {
    const response = await api.post('/loans/apply', {
      loan_type: 'salary',
      amount: 150000,
      tenure_months: 24,
      purpose: 'Home renovation',
      monthly_income: 45000
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
};
```

### cURL Examples
```bash
# Login
curl -X POST https://api.loanapp.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"01712345678","password":"user123"}'

# Get loan details
curl -X GET https://api.loanapp.com/v1/loans/1 \
  -H "Authorization: Bearer your_token_here"

# Add repayment
curl -X POST https://api.loanapp.com/v1/repayments/add \
  -H "Authorization: Bearer your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"loan_id":1,"amount_paid":7125,"payment_method":"bKash","payment_date":"2024-01-15"}'
```
