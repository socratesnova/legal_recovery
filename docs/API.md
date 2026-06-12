# Legal Recovery OS - API Documentation

## Base URL
```
Development: http://localhost:3001/api/v1
```

## Authentication
All endpoints require Bearer token:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Auth
- `POST /api/v1/auth/login` - Login with email/password

### Users
- `GET /api/v1/users` - List users (Admin+)
- `GET /api/v1/users/:id` - Get user
- `POST /api/v1/users` - Create user (Admin+)
- `PATCH /api/v1/users/:id` - Update user (Admin+)
- `DELETE /api/v1/users/:id` - Soft delete user (Admin+)

### Institutions
- `GET /api/v1/institutions` - List institutions
- `GET /api/v1/institutions/:id` - Get institution
- `POST /api/v1/institutions` - Create institution (Super Admin)
- `PATCH /api/v1/institutions/:id` - Update institution
- `DELETE /api/v1/institutions/:id` - Soft delete institution (Super Admin)

### Portfolios
- `GET /api/v1/portfolios` - List portfolios
- `POST /api/v1/portfolios` - Create portfolio
- `POST /api/v1/portfolios/upload` - Upload CSV/Excel

### Cases
- `GET /api/v1/cases` - List cases
- `GET /api/v1/cases/:id` - Get case
- `POST /api/v1/cases` - Create case
- `PATCH /api/v1/cases/:id` - Update case

### Documents
- `GET /api/v1/documents` - List documents
- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents/:id/download` - Download document

### Data Passports
- `GET /api/v1/data-passports` - List data passports
- `POST /api/v1/data-passports` - Create data passport
- `POST /api/v1/data-passports/check` - Check if data can be used

### Contacts
- `GET /api/v1/contacts` - List contacts
- `POST /api/v1/contacts` - Create contact
- `PATCH /api/v1/contacts/:id` - Update contact

### Agreements
- `GET /api/v1/agreements` - List agreements
- `POST /api/v1/agreements` - Create agreement
- `POST /api/v1/agreements/:id/approve` - Approve agreement

### Payments
- `GET /api/v1/payments` - List payments
- `POST /api/v1/payments` - Register payment
- `POST /api/v1/payments/:id/reconcile` - Reconcile payment

### Disputes
- `GET /api/v1/disputes` - List disputes
- `POST /api/v1/disputes` - Open dispute
- `POST /api/v1/disputes/:id/resolve` - Resolve dispute

### Audit
- `GET /api/v1/audit` - List audit logs

## Swagger
Full API documentation available at:
```
http://localhost:3001/api/docs
```
