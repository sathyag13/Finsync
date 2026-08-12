# FinSync (Beginner-Friendly Edition) — Digital Banking Platform

This version is organized the standard way every Spring Boot tutorial
teaches it: **one class per file, grouped into clear folders by role**.
It's more files than a compressed version would have, but each file is
small and does exactly one obvious thing — that's what actually makes
a codebase learnable.

Stack: Java 17, Spring Boot 3, Spring Security + JWT, **MySQL**, Spring
Data JPA, React 18 (Vite), Axios.

## Database — 5 tables (MySQL)

`users`, `accounts`, `transactions`, `expenses`, `savings_goals` — all
in one `finsync_db` database. Hibernate creates the tables for you on
first run (`spring.jpa.hibernate.ddl-auto=update`), and the connection
string even creates the database itself if it doesn't exist yet.

## Backend folder structure

```
backend/src/main/java/com/finsync/
├── FinSyncApplication.java     ← starts the app
│
├── model/                      ← what gets stored in the database
│   ├── User.java
│   ├── Account.java
│   ├── Transaction.java
│   ├── Expense.java
│   ├── SavingsGoal.java
│   ├── Role.java               (enum)
│   ├── AccountType.java        (enum)
│   └── TransactionType.java    (enum)
│
├── repository/                 ← database access, one interface per model
│   ├── UserRepository.java
│   ├── AccountRepository.java
│   ├── TransactionRepository.java
│   ├── ExpenseRepository.java
│   └── SavingsGoalRepository.java
│
├── dto/                        ← shapes of incoming JSON request bodies
│   ├── RegisterRequest.java
│   ├── LoginRequest.java
│   ├── CreateAccountRequest.java
│   ├── AmountRequest.java
│   ├── TransferRequest.java
│   ├── ExpenseRequest.java
│   ├── SavingsGoalRequest.java
│   └── ContributeRequest.java
│
├── security/                   ← login, JWT, and access control
│   ├── JwtUtil.java             (creates/validates tokens)
│   ├── UserPrincipal.java       (adapts our User to Spring Security)
│   ├── CustomUserDetailsService.java (looks up users by email)
│   ├── JwtAuthFilter.java       (checks the token on each request)
│   ├── CurrentUser.java         (helper: "who's logged in?")
│   └── SecurityConfig.java      (wires it all together)
│
└── controller/                 ← the actual REST API endpoints
    ├── AuthController.java      (/api/auth/register, /login)
    ├── AccountController.java   (/api/accounts)
    ├── TransactionController.java (/api/accounts/{id}/deposit|withdraw|history, /api/transfer)
    ├── ExpenseController.java   (/api/expenses)
    └── SavingsGoalController.java (/api/savings-goals)
```

**Why no separate "service" layer?** Normally you'd put business logic
in a `@Service` class between the controller and repository. For a
project this small, that extra layer is one more file and one more
level of indirection to trace through without much payoff — so the
logic lives directly in the controller methods. Once a project grows
past this size, pulling that logic out into services is the natural
next step.

**Why plain classes for `dto/` instead of Lombok?** Those files are
tiny (2-4 fields), so writing them by hand costs nothing and lets you
see exactly what JSON shape each endpoint expects without needing to
know what a Lombok annotation expands into. The `model/` classes use
Lombok's `@Getter`/`@Setter` instead, since hand-writing 5-6 getters
and setters per entity is pure repetition — a good early example of
"boilerplate vs. worth automating."

## How a request flows through the code (worth tracing once)

Say the frontend calls `POST /api/accounts/5/deposit`:

1. **`JwtAuthFilter`** reads the `Authorization: Bearer ...` header,
   validates the token, and tells Spring Security who's logged in.
2. **`SecurityConfig`** has already decided this URL needs a logged-in
   user (`anyRequest().authenticated()`), so the request is allowed
   through.
3. **`AccountController`**... actually no — deposits live in
   **`TransactionController.deposit()`**, which:
   - calls `currentUser.id()` to find out who's calling
   - loads the `Account` via `AccountRepository` and checks ownership
   - updates the balance and saves it
   - creates a new `Transaction` row and saves that too
   - returns a JSON response

Following one request like this end-to-end is a great way to learn
the codebase — pick any endpoint and trace it the same way.

## Running it

### 1. Install MySQL (if you haven't already)

Download from [dev.mysql.com/downloads/installer](https://dev.mysql.com/downloads/installer/)
or use whatever package manager you prefer. During setup you'll pick a
password for the `root` user — remember it.

### 2. Set your MySQL password

Open `backend/src/main/resources/application.properties` and update:
```properties
spring.datasource.username=root
spring.datasource.password=root
```
to match what you set during MySQL installation. You do **not** need
to manually create the `finsync_db` database — the connection URL has
`createDatabaseIfNotExist=true`, so it's created automatically on
first run.

### 3. Run the backend

- **IntelliJ / Eclipse:** open/import the `backend` folder as a Maven
  project, install the Lombok plugin, then run `FinSyncApplication.java`
- **Terminal:** `cd backend && mvn spring-boot:run`

Runs on `http://localhost:8080`.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

### 5. Try it

1. Register at `/register`
2. Open an account, deposit money
3. Create a second account (or ask a friend to register) and try a
   transfer
4. Log an expense, create a savings goal and contribute to it

## A note on security basics used here

- Passwords are hashed with **BCrypt** before being stored — never
  store plain-text passwords
- **JWTs** let the server verify who's calling without keeping a
  server-side session — the token itself carries the user's identity,
  signed so it can't be tampered with
- `finsync.jwt.secret` in `application.properties` is a placeholder —
  replace it with a long random value (and load it from an environment
  variable, not a checked-in file) before using this anywhere real
