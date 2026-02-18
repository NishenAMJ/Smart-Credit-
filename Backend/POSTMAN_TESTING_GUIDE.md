# Authentication API Testing Guide

## Base URL
```
http://localhost:3000/api
```

## 1. Register a New User

**Endpoint:** `POST /auth/register`

**Valid Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "Test@1234",
  "role": "borrower"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "firebase-generated-id",
    "email": "john.doe@example.com",
    "role": "borrower"
  }
}
```

**Valid Roles:**
- `borrower`
- `lender`
- `admin`

### Validation Tests:

**Invalid Email:**
```json
{
  "email": "invalid-email",
  "password": "Test@1234",
  "role": "borrower"
}
```
Response: 400 Bad Request - "Please provide a valid email address"

**Weak Password (too short):**
```json
{
  "email": "test@example.com",
  "password": "Test@1",
  "role": "borrower"
}
```
Response: 400 Bad Request - "Password must be at least 8 characters long"

**Weak Password (no special character):**
```json
{
  "email": "test@example.com",
  "password": "Test1234",
  "role": "borrower"
}
```
Response: 400 Bad Request - "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"

**Invalid Role:**
```json
{
  "email": "test@example.com",
  "password": "Test@1234",
  "role": "invalid_role"
}
```
Response: 400 Bad Request - "Role must be one of: borrower, lender, admin"

**Duplicate Email:**
Register same email twice.
Response: 409 Conflict - "User with this email already exists"

---

## 2. Login

**Endpoint:** `POST /auth/login`

**Valid Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "Test@1234"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "firebase-generated-id",
    "email": "john.doe@example.com",
    "role": "borrower"
  }
}
```

### Error Cases:

**Invalid Email:**
```json
{
  "email": "wrong@example.com",
  "password": "Test@1234"
}
```
Response: 401 Unauthorized - "Invalid email or password"

**Wrong Password:**
```json
{
  "email": "john.doe@example.com",
  "password": "WrongPassword"
}
```
Response: 401 Unauthorized - "Invalid email or password"

**Missing Fields:**
```json
{
  "email": "john.doe@example.com"
}
```
Response: 400 Bad Request - "Password is required"

---

## 3. Using the JWT Token

After registration or login, copy the `access_token` value.

### In Postman:
1. Go to the **Authorization** tab
2. Select Type: **Bearer Token**
3. Paste your token in the Token field

### Example Protected Endpoint (to be implemented):
```
GET /borrower/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Testing Flow

1. **Register a borrower:**
   - POST `/auth/register`
   - Email: borrower@test.com
   - Password: Borrower@123
   - Role: borrower

2. **Register a lender:**
   - POST `/auth/register`
   - Email: lender@test.com
   - Password: Lender@123
   - Role: lender

3. **Register an admin:**
   - POST `/auth/register`
   - Email: admin@test.com
   - Password: Admin@123
   - Role: admin

4. **Login with borrower:**
   - POST `/auth/login`
   - Use borrower credentials
   - Save the token

5. **Test validation errors:**
   - Try weak passwords
   - Try invalid emails
   - Try duplicate registration

6. **Verify token works:**
   - Once protected endpoints are created, test with saved token

---

## Password Requirements

✅ Minimum 8 characters
✅ At least one uppercase letter (A-Z)
✅ At least one lowercase letter (a-z)
✅ At least one number (0-9)
✅ At least one special character (@$!%*?&)

**Valid passwords:**
- `Test@1234`
- `MyP@ssw0rd`
- `SecureP@ss123`

**Invalid passwords:**
- `test1234` (no uppercase, no special char)
- `Test1234` (no special char)
- `Test@` (too short)
- `TESTTEST@123` (no lowercase)
