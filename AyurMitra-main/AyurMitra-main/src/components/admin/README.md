# Admin Dashboard API Implementation

## Overview

This directory contains the implementation of the Admin Dashboard for the AyurMitra application. The dashboard provides interfaces for managing users, appointments, viewing analytics, and handling feedback.

## Features

### User Management 👥
- View all users with filtering and pagination
- View user statistics
- Get user details
- Create new users
- Update existing users
- Toggle user active status
- Delete users

### Appointment Management 📅
- View all appointments with filtering and pagination
- Reschedule appointments
- Cancel appointments

### Dashboard & Analytics 📊
- View dashboard statistics
- View system metrics

### Feedback Management 📝
- View all feedback with filtering and pagination
- View feedback details
- Update feedback status
- Delete feedback

## Implementation Details

### API Service

The `adminService.js` file contains all the API calls needed to interact with the backend. Each API call is implemented as an async function that returns a Promise.

### Authentication

The `authService.js` file provides authentication utilities, including:
- Getting authentication headers
- Checking if a user is authenticated
- Checking if a user has admin role
- Checking if a user has specific permissions

### Components

The `AdminDashboard.jsx` component demonstrates how to use the API calls to display and manage data in the dashboard.

### Routing

The `AdminRoutes.jsx` file shows how to set up protected routes for the admin dashboard.

## Usage

```jsx
// Import the AdminDashboard component
import AdminDashboard from './components/admin/AdminDashboard';

// Use it in your routes
<Route path="/admin" element={<AdminDashboard />} />
```

## API Endpoints

All API endpoints are prefixed with `/api/admin` and require authentication and admin privileges.

### User Management
- `GET /admin/users` - Get all users
- `GET /admin/users/stats` - Get user statistics
- `GET /admin/users/:userId` - Get user by ID
- `POST /admin/users` - Create new user
- `PUT /admin/users/:userId` - Update user
- `PATCH /admin/users/:userId/toggle-status` - Toggle user status
- `DELETE /admin/users/:userId` - Delete user

### Appointment Management
- `GET /admin/appointments` - Get all appointments
- `PUT /admin/appointments/:appointmentId/reschedule` - Reschedule appointment
- `PATCH /admin/appointments/:appointmentId/cancel` - Cancel appointment

### Dashboard & Analytics
- `GET /admin/dashboard/stats` - Get dashboard statistics
- `GET /admin/system/metrics` - Get system metrics

### Feedback Management
- `GET /admin/feedback` - Get all feedback
- `GET /admin/feedback/:feedbackId` - Get feedback by ID
- `PATCH /admin/feedback/:feedbackId/status` - Update feedback status
- `DELETE /admin/feedback/:feedbackId` - Delete feedback