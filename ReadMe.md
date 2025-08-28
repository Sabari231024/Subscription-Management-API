# Subscription Management API

## Overview
The **Subscription Management API** is a backend service built with **Node.js** and **Express.js** that provides secure user authentication, subscription plan tracking, and automated workflows such as email notifications. It follows the **MVC (Model–View–Controller)** architecture for modularity and scalability.

This project is designed for businesses or individuals who want to manage recurring subscriptions (Netflix, AWS, SaaS tools, etc.), monitor due dates, and receive automated alerts.

---

## Tech Stack
- **Node.js & Express.js** → Web framework for building RESTful APIs.
- **MongoDB (Mongoose ODM)** → NoSQL database for storing users, plans, and subscription data.
- **JWT (JSON Web Token)** → Authentication and secure API access.
- **Bcrypt.js** → Password hashing for secure storage.
- **Nodemailer** → Email notifications (reminders, confirmations, alerts).
- **dotenv** → Environment variable management.

---

## Features
### 🔐 Authentication & Security
- User registration and login with JWT-based authentication.
- Secure password storage with **bcrypt hashing**.
- Role-based access middleware (`auth.middleware.js`).
- Protected routes for sensitive operations.

### 📊 Subscription Management
- Add, update, and delete subscription plans.
- Track subscription start and end dates.
- Monitor billing cycles and renewal reminders.

### 📬 Workflow Automation
- Email notifications for:
  - Upcoming subscription renewals.
  - Expired subscriptions.
  - Welcome emails after signup.
- Automated tasks (via cron jobs) for recurring reminders.

### 🗄 Database Layer
- MongoDB connection handled in `mongodb.js`.
- Models for Users and Subscriptions with schema validation.
- Scalable structure for future integrations (payments, invoices, analytics).

---

## Project Structure
```
Subscription-Tracker/
├── config/              # Configuration (e.g., nodemailer, JWT, secrets)
├── controllers/         # Route handlers (business logic)
├── middlewares/         # Auth & request middlewares
├── models/              # Database schemas (User, Subscription, etc.)
├── routes/              # API endpoints definitions
├── DataBase/            # MongoDB connection config
├── utils/               # Helper functions (email templates, validators)
├── server.js            # Application entry point
└── .env                 # Environment variables
```

---

## Security Highlights
- **JWT authentication** with expiry ensures sessions are time-bound.
- **Password hashing** prevents exposure of plain-text passwords.
- **Middleware-based route protection** prevents unauthorized access.
- **Environment variable encryption** for API keys and secrets.

---

## Workflow Example
1. **User signs up** → Password hashed with bcrypt → User stored in MongoDB.
2. **User logs in** → JWT generated → Token returned to client.
3. **User adds subscription** → Subscription stored in DB with due date.
4. **Cron job checks due dates daily** → If renewal approaching → Email triggered via Nodemailer.
5. **User notified** → Can renew/cancel subscription accordingly.

---

## Setup Instructions
1. Clone the repository and unzip:
   ```bash
   git clone <repo_url>
   cd Subscription-Tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/subscriptions
   JWT_SECRET=your_secret
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_password
   ```
4. Run the server:
   ```bash
   npm start
   ```
5. API available at:
   ```
   http://localhost:5000/api
   ```

---

## Future Improvements
- Integration with **payment gateways** (Stripe, Razorpay).
- Admin dashboards with analytics.
- Mobile app client for subscription reminders.
- Multi-tenant support for teams/organizations.

---

## License
This project is open-source under the MIT License.
