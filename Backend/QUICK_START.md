# 🚀 Quick Start - Authentication Testing

## Server Info
- **Status:** ✅ Running
- **URL:** http://localhost:3000
- **API Prefix:** /api

## 📝 Created Endpoints

### 1. Register User
```
POST http://localhost:3000/api/auth/register
```

**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "Test@1234",
  "role": "borrower"
}
```

**Success Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "firebase-id",
    "email": "test@example.com",
    "role": "borrower"
  }
}
```

---

### 2. Login
```
POST http://localhost:3000/api/auth/login
```

**Body (JSON):**
```json
{
  "email": "test@example.com",
  "password": "Test@1234"
}
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "firebase-id",
    "email": "test@example.com",
    "role": "borrower"
  }
}
```

---

### 3. Protected Endpoint (Demo)
```
GET http://localhost:3000/api/borrower/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

**Success Response (200):**
```json
{
  "message": "This is a protected borrower endpoint",
  "user": {
    "uid": "firebase-id",
    "email": "test@example.com",
    "role": "borrower"
  },
  "timestamp": "2026-02-18T16:14:56.000Z"
}
```

**Without Token (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## ⚡ Quick Postman Test Flow

### Step 1: Register
1. Open Postman
2. Create new request: POST `http://localhost:3000/api/auth/register`
3. Go to Body → raw → JSON
4. Paste:
   ```json
   {
     "email": "john@test.com",
     "password": "Test@1234",
     "role": "borrower"
   }
   ```
5. Click Send
6. **Copy the `access_token` from response**

### Step 2: Test Protected Route
1. Create new request: GET `http://localhost:3000/api/borrower/profile`
2. Go to Authorization tab
3. Select Type: **Bearer Token**
4. Paste your token
5. Click Send
6. **Should see your user info!**

### Step 3: Test Without Token
1. Same GET request
2. Remove authorization
3. Click Send
4. **Should get 401 Unauthorized**

### Step 4: Test Login
1. Create new request: POST `http://localhost:3000/api/auth/login`
2. Body → raw → JSON:
   ```json
   {
     "email": "john@test.com",
     "password": "Test@1234"
   }
   ```
3. Click Send
4. **Should get new token**

---

## 🎨 Test Scenarios

### ✅ Success Cases
- Register with valid data → 201 Created
- Login with correct credentials → 200 OK
- Access protected route with token → 200 OK

### ❌ Error Cases
- Register with weak password → 400 Bad Request
- Register with invalid email → 400 Bad Request
- Register duplicate email → 409 Conflict
- Login with wrong password → 401 Unauthorized
- Access protected route without token → 401 Unauthorized

---

## 📦 Import Postman Collection

You can import this file into Postman:
```
Smart_Credit_Auth.postman_collection.json
```

**How to Import:**
1. Open Postman
2. Click Import button (top left)
3. Drag and drop the JSON file
4. Collection will appear in your sidebar
5. Start testing!

---

## 🔑 Password Rules

Your password MUST have:
- ✅ At least 8 characters
- ✅ One uppercase letter (A-Z)
- ✅ One lowercase letter (a-z)
- ✅ One number (0-9)
- ✅ One special character (@$!%*?&)

**Valid:** `Test@1234`, `MyPass@123`, `Secure!P4ss`
**Invalid:** `weak`, `Test1234`, `test@test`

---

## 🎯 Role Options

Choose one when registering:
- `borrower` - For loan borrowers
- `lender` - For loan lenders
- `admin` - For system administrators

---

## 🐛 Troubleshooting

**Server not responding?**
```bash
npm run start:dev
```

**Port 3000 already in use?**
```bash
# Kill existing process
Get-Process -Name node | Stop-Process -Force
npm run start:dev
```

**Firebase errors?**
- Check `firebase-service-account.json` exists
- Check Firebase credentials are valid

---

## 📚 More Details

See these files for comprehensive info:
- `AUTHENTICATION_IMPLEMENTATION.md` - Full implementation details
- `POSTMAN_TESTING_GUIDE.md` - Detailed testing guide
- `Smart_Credit_Auth.postman_collection.json` - Import into Postman

---

## ✨ You're Ready!

Everything is set up and running. Just open Postman and start testing! 🎉
