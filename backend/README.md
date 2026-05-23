#  Backend Services

This directory houses the core RESTful API server for the Store Rating and Assessment System. It implements user authentication, relational database orchestration using Prisma ORM, role-based security filters, and strict request validations.

---

## 1. Technologies & Architecture

* **Framework**: Node.js & Express (ES Modules format).
* **Architecture Pattern**: Decoupled MVC-style design splitting routing/validation definitions (`src/routes/`) from business logic execution controllers (`src/controllers/`).
* **ORM**: Prisma Client utilizing custom connection pooling via `@prisma/adapter-pg` and standard PostgreSQL driver (`pg`).
* **Database**: Hosted Cloud PostgreSQL (Neon DB).
* **Security & Auth**: Stateless JWT auth (`jsonwebtoken`) with client-side credential encryption via `bcryptjs`.
* **Validation Layer**: In-route request schema verification via `express-validator` to guarantee schema compliance.

---

## 2. API Endpoints Reference

All requests must set the header `Content-Type: application/json`. Authorized routes require a Bearer token in the request header: `Authorization: Bearer <jwt_token>`.

### Authentication Routes (`/api/auth`)
* `POST /register`: Registers a customer. 
  * **Payload**: `{ "name": "...", "email": "...", "password": "...", "address": "..." }`
  * **Constraints**: Name must be 20–60 characters. Password must be 8–16 characters with at least one uppercase letter and one special character. Address is limited to 400 characters.
* `POST /login`: Validates user and returns a token.
  * **Payload**: `{ "email": "...", "password": "..." }`
* `PATCH /change-password` *(Authenticated)*: Updates current user's password.
  * **Payload**: `{ "password": "..." }`

### Administration Routes (`/api/admin`) — *Requires ADMIN Role*
* `GET /dashboard`: Fetches overall counts for users, stores, and ratings.
* `POST /users`: Provisions a new account under any role (`USER`, `STORE_OWNER`, `ADMIN`).
  * **Payload**: `{ "name": "...", "email": "...", "password": "...", "address": "...", "role": "..." }`
* `GET /users`: Retrieves all users in the system (including Administrators, Store Owners, and Customers). Supports pagination/filtering by `name`, `email`, `address`, and `role`, and sorting by `name`, `email`, `role`, or `createdAt`.
* `GET /users/:id`: Returns detailed profile information for a user, including their owned store configuration and computed metrics.
* `POST /stores`: Registers a new store and binds it to a unique store owner.
  * **Payload**: `{ "name": "...", "email": "...", "address": "...", "ownerId": "..." }`
* `GET /stores`: Retrieves all stores with their owner names and calculated average ratings. Supports multi-column in-memory sorting.

### Rating Operations (`/api/ratings`) — *Requires USER Role*
* `POST /`: Creates or updates a store rating.
  * **Payload**: `{ "storeId": "...", "value": 5 }`
  * **Constraints**: Value must be an integer between 1 and 5. Database upsert guarantees a unique rating record per user-store pair.

### Public/Customer Store List (`/api/stores`) — *Requires USER Role*
* `GET /`: Lists all stores with their average ratings and the current user's rating. Supports queries for `name`, `address`, or a general search term (`search`).

### Owner Specific Analytics (`/api/owner`) — *Requires STORE_OWNER Role*
* `GET /dashboard`: Retrieves the store's name, calculated average rating, and a detailed feed of all customer review actions (reviewer name, email, rating, and timestamp).

---

## 3. Database Schema Overview

The database is built on PostgreSQL. Models and constraints are managed via [schema.prisma](prisma/schema.prisma):
* **User Model**: Holds account details and user roles (`ADMIN`, `USER`, `STORE_OWNER`).
* **Store Model**: Tied to a single owner via a unique, non-null foreign key constraint (`ownerId` -> `User.id`).
* **Rating Model**: Tracks evaluation scores. Relies on a compound unique key `@@unique([userId, storeId])` ensuring database-level guardrails against multiple submissions.

---

## 4. Environment Setup & Configuration

Configure a `.env` file in the root of this directory:

```env
DATABASE_URL="postgresql://<username>:<password>@<host>/<database>?sslmode=require"
PORT=8000
JWT_SECRET="your-jwt-signing-secret"
```

### Installation Steps
1. Install dependencies:
   ```bash
   npm install
   ```
2. Deploy database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
3. Run the admin seeding routine:
   ```bash
   node prisma/seed.js
   ```
   *(This creates a primary administrator account: `admin@admin.com` / `Admin@123`)*

---

## 5. Script Commands
* Run in development mode (with Nodemon hot-reload):
  ```bash
  npm run dev
  ```
* Start the server in production mode:
  ```bash
  npm start
  ```
