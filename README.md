# 💻 OmniConfig - Laptop Configuration & Pricing Management System

> A full-stack MERN engineering solution designed for electronics retailers to configure customized laptops, calculate real-time pricing & profit margins, preserve historical price snapshots, and generate official customer quotations.

---

## ✨ Features

- **⚡ Real-Time Price & Margin Calculator**: Live computation of component subtotal costs, selling prices, tax rates, volume discounts, and profit margins ($ & %).
- **🔒 Historical Pricing Preservation (Snapshot Pattern)**: Issued quotations preserve component price snapshots at creation time, guaranteeing historical quote data remains unchanged even when supplier catalog prices shift.
- **🖥️ Hardware Component Catalog Management**: Full CRUD support for Processors, RAM, Storage, GPUs, Displays, Batteries, Keyboards, and OS specs with real-time stock and price revision logs.
- **🔍 Advanced Search & Multi-Criteria Filtering**: Filter quotations and catalog items by price range, customer details, status, or component SKU.
- **📊 Business Analytics Dashboard**: Key metrics on total revenue, average order value, margin distribution, and quote conversion rates.
- **🖨️ Invoice Generation & Export**: One-click printable customer quotations optimized for PDF export and print formatting (`@media print`).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Context API, React Router v6
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB & Mongoose ORM
- **Styling**: Modern Slate Dark Mode (`#090d16`) with Cyan Glassmorphism aesthetics

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) instance running locally (`mongodb://127.0.0.1:27017`) or via MongoDB Atlas

---

### Step 1: Start Backend Server

```bash
cd backend
npm install
npm start
```
> The backend server runs on `http://localhost:5000` and automatically seeds initial catalog components and demo user accounts on startup.

---

### Step 2: Start Frontend Application

Open a new terminal tab:

```bash
cd frontend
npm install
npm run dev
```
> The frontend web application runs on `http://localhost:3000` (or `http://localhost:5173`).

---

## 🔑 Demo Evaluator Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Pricing Manager** | `prashantdasar2004@gmail.com` | `Pachhi@123` |
| **Sales Executive** | `sales@retailer.com` | `password123` |

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/components` | Fetch catalog components (supports `?category=` & `?search=`) |
| `POST` | `/api/components` | Add new component to hardware catalog |
| `PUT` | `/api/components/:id` | Update component details |
| `PATCH` | `/api/components/:id/price` | Update component price & log audit history |
| `DELETE` | `/api/components/:id` | Remove component from catalog |
| `GET` | `/api/quotations` | List quotations (supports `?status=`, `?search=`, price filters) |
| `GET` | `/api/quotations/:id` | View quote details with current vs snapshot price comparison |
| `POST` | `/api/quotations` | Create new quotation with immutable snapshot pricing |
| `PUT` | `/api/quotations/:id/status` | Update quotation lifecycle status |
| `GET` | `/api/analytics/dashboard` | Fetch dashboard KPI summary statistics |
| `POST` | `/api/seed` | Reset & re-seed catalog data |

---

## 📄 Documentation

For full system architecture, database schema design, and technical decisions rationale, refer to [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
