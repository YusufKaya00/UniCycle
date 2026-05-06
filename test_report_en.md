# UniCycle – University Second-Hand Goods Platform
# System Test Report

**Project Name:** UniCycle – University Marketplace  
**Version:** 0.1.0  
**Date:** April 28, 2026  
**Prepared By:** Yusuf Kaya  
**Standard:** IEEE 829 – Standard for Software and System Test Documentation  

---

## 1. Introduction

### 1.1 Purpose
This document reports the results of the system tests conducted to verify the functional and non-functional requirements of the UniCycle web application. The tests cover user authentication, listing management, messaging, profile management, admin panel, and overall usability.

### 1.2 Scope
The tested system is a university second-hand goods marketplace built on the Next.js 16.1.6 framework, utilizing Firebase (Authentication, Firestore, Storage) infrastructure, and featuring Google Maps API integration. The application is exclusive to Riga Technical University (RTU) students and only accepts email addresses with the `@edu.rtu.lv` domain.

### 1.3 Technology Stack

| Component | Technology |
|---|---|
| Frontend Framework | Next.js 16.1.6 (React 19.2.3) |
| Programming Language | TypeScript 5.x |
| Styling | Tailwind CSS 4.x |
| Database | Firebase Firestore |
| Authentication | Firebase Authentication |
| File Storage | Firebase Storage |
| Map Service | Google Maps API |
| Multi-language | Custom i18n module (EN/LV) |

---

## 2. Test Environment

| Feature | Detail |
|---|---|
| Operating System | Windows 11 |
| Browser | Google Chrome (latest version) |
| Server | localhost:3000 (Next.js Dev Server – Turbopack) |
| Node.js | v20.x |
| Network | Local development environment |

---

## 3. Tested Modules

| # | Module | Page Path |
|---|---|---|
| M1 | Home Page | `/` |
| M2 | User Registration | `/register` |
| M3 | User Login | `/login` |
| M4 | Listing Page | `/listings` |
| M5 | Listing Detail | `/listings/[id]` |
| M6 | Create New Listing | `/listings/new` |
| M7 | My Listings | `/my-listings` |
| M8 | Messaging (Chat List) | `/chat` |
| M9 | Chat Detail | `/chat/[id]` |
| M10 | Profile Management | `/profile` |
| M11 | Admin Panel – Dashboard | `/admin` |
| M12 | Admin – User Management | `/admin/users` |
| M13 | Admin – Listing Management | `/admin/listings` |

---

## 4. Functional Test Results

### 4.1 Authentication and Authorization Tests (M2, M3)

| Test No | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-AUTH-01 | Register with a valid `@edu.rtu.lv` email and password | Account is created, redirected to the home page | Account successfully created, redirection occurred | ✅ Passed |
| TC-AUTH-02 | Register with an invalid email domain (e.g., `@gmail.com`) | Error message is displayed: "Only @edu.rtu.lv email addresses are allowed." | Error message correctly displayed | ✅ Passed |
| TC-AUTH-03 | Register with a password shorter than 6 characters | "Password must be at least 6 characters" error | Error message displayed | ✅ Passed |
| TC-AUTH-04 | Password and confirm password fields do not match | "Passwords do not match" error | Error message displayed | ✅ Passed |
| TC-AUTH-05 | Login with Google account (RTU email) | Google popup opens, login successful, redirected to home page | Successfully logged in | ✅ Passed |
| TC-AUTH-06 | Login with Google account (non-RTU email) | Session closed, error message displayed | Session closed and error displayed | ✅ Passed |
| TC-AUTH-07 | Login with valid email/password | Login successful, redirected to home page | Successfully logged in | ✅ Passed |
| TC-AUTH-08 | Attempt login with incorrect password | Firebase error message is displayed | Error message displayed | ✅ Passed |
| TC-AUTH-09 | Sign Out | Session closed, redirected to the login page | Successfully signed out | ✅ Passed |
| TC-AUTH-10 | Access protected page without logging in (`/chat`, `/profile`, `/listings/new`) | Redirected to the login page | Redirection occurred | ✅ Passed |

### 4.2 Home Page Tests (M1)

| Test No | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-HOME-01 | Home page loading | Hero section, categories, recent listings, and "How it Works" sections are displayed | All sections loaded | ✅ Passed |
| TC-HOME-02 | Unauthenticated user – CTA section | "Join UniCycle" button and CTA section are visible | CTA section displayed | ✅ Passed |
| TC-HOME-03 | Authenticated user – CTA section | CTA section is hidden, "Sell Item" button is visible | Correct buttons displayed | ✅ Passed |
| TC-HOME-04 | Listing the last 8 active listings | Active listings fetched from Firestore, sorted by date | Listings sorted correctly | ✅ Passed |
| TC-HOME-05 | Clicking on category cards | Redirected to the listings page filtered by the relevant category | Redirected to the correct URL | ✅ Passed |

### 4.3 Listing Management Tests (M4, M5, M6, M7)

| Test No | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-LIST-01 | Loading the listing page | All active listings are displayed in a grid layout | Listings successfully listed | ✅ Passed |
| TC-LIST-02 | Filtering by category | Listings in the selected category are displayed | Filtering worked correctly | ✅ Passed |
| TC-LIST-03 | Filtering by price (Free/Paid) | Listings are filtered based on price status | Filtering worked correctly | ✅ Passed |
| TC-LIST-04 | Search function (title/description) | Listings containing the searched keyword are listed | Search returned correct results | ✅ Passed |
| TC-LIST-05 | Sorting: Newest / Price low-high / Price high-low | Listings are arranged according to the selected sorting | Sorting worked correctly | ✅ Passed |
| TC-LIST-06 | Create new listing (all fields filled) | Listing saved to Firestore, redirected to detail page | Listing successfully created | ✅ Passed |
| TC-LIST-07 | Attempt to create listing without photos | "Please add at least one image" error | Error message displayed | ✅ Passed |
| TC-LIST-08 | Attempt to upload more than 5 photos | "Maximum 5 images allowed" error | Error message displayed | ✅ Passed |
| TC-LIST-09 | Attempt to create listing without title | "Please enter a title" error | Error message displayed | ✅ Passed |
| TC-LIST-10 | Create free listing (checkbox checked) | Price saved as 0, price field hidden | Worked correctly | ✅ Passed |
| TC-LIST-11 | View listing detail page | Photos, description, price, location map are visible | All information displayed | ✅ Passed |
| TC-LIST-12 | "My Listings" page | Only the authenticated user's listings are displayed | Correct listings displayed | ✅ Passed |
| TC-LIST-13 | Location selection (Google Maps) | Pin placed on the map, address info saved | Location successfully selected | ✅ Passed |
| TC-LIST-14 | Attempt to upload non-image file | "Only image files are allowed" error | Error message displayed | ✅ Passed |

### 4.4 Messaging Tests (M8, M9)

| Test No | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-CHAT-01 | View chat list | All chats the user is participating in are listed | Chats listed | ✅ Passed |
| TC-CHAT-02 | Chat list sorting | Sorted by the last message | Correct sorting | ✅ Passed |
| TC-CHAT-03 | Unread message indicator | Unread chat is marked with a blue dot | Indicator worked correctly | ✅ Passed |
| TC-CHAT-04 | Load chat detail page | Messages are displayed in chronological order | Messages sorted correctly | ✅ Passed |
| TC-CHAT-05 | Real-time message receiving (onSnapshot) | New messages are displayed instantly | Real-time update worked | ✅ Passed |
| TC-CHAT-06 | Empty state message when no chats | "No messages yet" message and "Browse Listings" button are displayed | Empty state correctly displayed | ✅ Passed |

### 4.5 Profile Management Tests (M10)

| Test No | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-PROF-01 | Loading the profile page | User info (name, email, university) is displayed | Info correctly displayed | ✅ Passed |
| TC-PROF-02 | Update display name | New name updated in Firebase Auth and Firestore | Update successful | ✅ Passed |
| TC-PROF-03 | Upload profile photo | Photo uploaded to Storage, URL updated | Photo successfully updated | ✅ Passed |
| TC-PROF-04 | Email field being uneditable | Email field is disabled, "Email cannot be changed" note | Field is uneditable | ✅ Passed |
| TC-PROF-05 | University field being uneditable | "Riga Technical University" is displayed fixed | Field is uneditable | ✅ Passed |

### 4.6 Admin Panel Tests (M11, M12, M13)

| Test No | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-ADM-01 | Loading admin dashboard | Statistics cards displayed (user, listing counts) | Statistics correctly displayed | ✅ Passed |
| TC-ADM-02 | Listing status statistics | Active, Reserved, Sold counts are calculated correctly | Counts are correct | ✅ Passed |
| TC-ADM-03 | User management page | All users are listed | Users listed | ✅ Passed |
| TC-ADM-04 | Listing management page | All listings are listed, status can be changed | Listings listed | ✅ Passed |
| TC-ADM-05 | Quick Actions links | Manage Users, Manage Listings, View Site links work | Links worked correctly | ✅ Passed |

---

## 5. Non-Functional Test Results

### 5.1 Performance Tests

| Test No | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-PERF-01 | Home page initial load time | < 3 seconds | ~1275ms (compile: 615ms, render: 660ms) | ✅ Passed |
| TC-PERF-02 | Home page subsequent load | < 500ms | ~90ms (compile: 10ms, render: 80ms) | ✅ Passed |
| TC-PERF-03 | Listing page load | < 500ms | ~79ms (compile: 50ms, render: 29ms) | ✅ Passed |
| TC-PERF-04 | Login page load | < 500ms | ~84ms (compile: 52ms, render: 33ms) | ✅ Passed |
| TC-PERF-05 | Register page load | < 500ms | ~243ms (compile: 198ms, render: 45ms) | ✅ Passed |
| TC-PERF-06 | Chat page load | < 500ms | ~89ms (compile: 54ms, render: 35ms) | ✅ Passed |
| TC-PERF-07 | Listing detail page load | < 2 seconds | ~811ms (compile: 778ms, render: 33ms) | ✅ Passed |
| TC-PERF-08 | New listing page load | < 500ms | ~95ms (compile: 63ms, render: 31ms) | ✅ Passed |

### 5.2 Usability Tests (UI/UX)

| Test No | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-UI-01 | Responsive design (mobile view) | All pages display correctly on mobile devices | Grid layouts are adaptable (2→3→4 columns) | ✅ Passed |
| TC-UI-02 | Loading states (Skeleton) | Skeleton placeholders are displayed while data is loading | Skeleton animations worked | ✅ Passed |
| TC-UI-03 | Empty state messages | Appropriate empty state messages are displayed when there's no data | All empty states are correct | ✅ Passed |
| TC-UI-04 | Animations | fadeIn, slideUp, float animations run smoothly | Animations are smooth | ✅ Passed |
| TC-UI-05 | Multi-language support (EN/LV) | All texts update when the language is changed | Language switch worked | ✅ Passed |
| TC-UI-06 | Error message visibility | Error messages are displayed prominently with a red background | Error messages are visible | ✅ Passed |
| TC-UI-07 | Button disabled state | Buttons are disabled while the form is submitting | Double submission prevented | ✅ Passed |

### 5.3 Security Tests

| Test No | Test Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-SEC-01 | Email domain restriction | Only `@edu.rtu.lv` is accepted | Domain check worked | ✅ Passed |
| TC-SEC-02 | Protected page access control | Unauthenticated user is redirected to login | Redirection worked | ✅ Passed |
| TC-SEC-03 | Firebase environment variables | API keys are stored in the `.env.local` file | Configuration is correct | ✅ Passed |
| TC-SEC-04 | Minimum password length (6 characters) | Passwords shorter than 6 characters are rejected | Validation worked | ✅ Passed |
| TC-SEC-05 | File type validation (image upload) | Only `image/*` MIME type files are accepted | Validation worked | ✅ Passed |
| TC-SEC-06 | Domain check after Google OAuth | Login with a non-RTU Google account is blocked and session is closed | Check worked | ✅ Passed |

---

## 6. Data Validation Tests

| Test No | Field | Validation Rule | Status |
|---|---|---|---|
| TC-VAL-01 | Listing Title | Required, max 100 characters | ✅ Passed |
| TC-VAL-02 | Listing Description | Required, max 1000 characters | ✅ Passed |
| TC-VAL-03 | Listing Photos | Min 1, max 5, images only | ✅ Passed |
| TC-VAL-04 | Price | Min 0, step 0.50, in EUR | ✅ Passed |
| TC-VAL-05 | Registration – Display Name | Required field | ✅ Passed |
| TC-VAL-06 | Registration – Email | Required, `@edu.rtu.lv` format | ✅ Passed |
| TC-VAL-07 | Registration – Password | Required, min 6 characters | ✅ Passed |
| TC-VAL-08 | Registration – Confirm Password | Must match the password | ✅ Passed |

---

## 7. Category and Filter Tests

The application operates with 6 categories:

| Category | Icon | Description | Filtering Test |
|---|---|---|---|
| Electronics | 💻 | Heaters, fans, chargers, etc. | ✅ Passed |
| Clean | 🧹 | Cleaning supplies and products | ✅ Passed |
| Cooking | 🍳 | Kitchen items and cookware | ✅ Passed |
| Home Things | 🛏️ | Bed, pillow, blankets, furniture | ✅ Passed |
| Personal Needs | 🎒 | Personal items and accessories | ✅ Passed |
| Others | 📦 | Miscellaneous items | ✅ Passed |

---

## 8. Test Summary Table

| Test Category | Total Tests | Passed | Failed | Success Rate |
|---|---|---|---|---|
| Authentication | 10 | 10 | 0 | 100% |
| Home Page | 5 | 5 | 0 | 100% |
| Listing Management | 14 | 14 | 0 | 100% |
| Messaging | 6 | 6 | 0 | 100% |
| Profile Management | 5 | 5 | 0 | 100% |
| Admin Panel | 5 | 5 | 0 | 100% |
| Performance | 8 | 8 | 0 | 100% |
| Usability (UI/UX) | 7 | 7 | 0 | 100% |
| Security | 6 | 6 | 0 | 100% |
| Data Validation | 8 | 8 | 0 | 100% |
| **TOTAL** | **74** | **74** | **0** | **100%** |

---

## 9. Known Limitations and Recommendations

### 9.1 Known Limitations
1. **Password Reset:** The password reset (Forgot Password) feature has not been implemented yet.
2. **Notification System:** There is no push notification infrastructure.
3. **Search Engine:** Search is only performed client-side; performance may degrade with large datasets.
4. **Turbopack Warning:** There is a multiple lockfile warning, but it does not affect functionality.

### 9.2 Future Improvement Recommendations
1. Addition of server-side search and pagination
2. Implementation of an email verification flow
3. Push notification integration
4. Addition of the password reset feature
5. Setup of an end-to-end (E2E) automated testing infrastructure (Cypress/Playwright)

---

## 10. Conclusion

The UniCycle web application has successfully passed all **74 test scenarios**. The application comprehensively fulfills core functions such as user authentication, listing management, real-time messaging, profile management, and the admin panel. In performance tests, all page load times were measured below acceptable limits. From a security perspective, the email domain restriction, file type validation, and page access control mechanisms operate correctly.

The system is considered **production-ready**.

---
