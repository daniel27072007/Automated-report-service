# Automated Sales Report & Email Delivery Background Service

**An automated background service built with Node.js, designed to aggregate weekly sales data from MongoDB, generate professional PDF reports, and deliver them automatically via SendGrid.**

---

## The Problem
In modern business operations, tracking weekly sales performance manually or relying on ad-hoc reporting introduces operational inefficiencies:
*   **Manual Reporting Overhead:** Managers waste valuable time manually querying databases, calculating weekly revenue totals, and generating report documents.
*   **Inconsistent Delivery Schedules:** Without automated triggers, stakeholder updates can be delayed, inconsistent, or forgotten entirely.
*   **Lack of Delivery Transparency:** Businesses often lack execution logs or status checks to verify whether automated reports were successfully generated and sent or if critical errors occurred during email dispatch.
*   **Risk of Inaccurate Financial Aggregation:** Incomplete database query filters can lead to inaccurate sales calculations or the inclusion of stale/unverified transactions in weekly financial snapshots.

---

## The Solution
This service operates as an automated reporting engine and email delivery pipeline. It runs background tasks scheduled via CRON to fetch weekly sales data, dynamically generate PDF documents using `PDFKit`, and dispatch them directly to designated stakeholders via SendGrid's API.

### What this tool automatically handles for you:
*   **Automated CRON Scheduling:** Executes a background job every Sunday at midnight (`0 0 * * 0`) using `node-cron` to automatically process and send the weekly report without human intervention.
*   **Dynamic PDF Generation:** Dynamically creates formatted PDF documents in memory (`Buffer`) featuring sales breakdowns, payment statuses (`PAID` vs `PENDING`), and accurate sum totals.
*   **SendGrid Email Integration:** Delivers HTML-formatted emails with the generated PDF directly attached as a base64 payload.
*   **Comprehensive Audit Logging:** Automatically logs the execution result (`SUCCESS` or `FAILED` with error messages) in MongoDB to ensure complete operational visibility via status endpoints.
*   **On-Demand Manual Triggers & Previews:** Offers API endpoints to trigger email dispatch on demand (`/api/reports/trigger`) or preview the generated PDF inline in the browser (`/api/reports/preview`).
*   **Isolated Environments:** Configures database URIs and API keys dynamically based on runtime parameters (`process.env.NODE_ENV`) to separate development, testing, and production environments.

---

## Demonstrated Capabilities
Building this background reporting and automated delivery service demonstrates a strong understanding of backend engineering, document generation, and API architectural integrity:

*   **Clean Architectural Boundaries:** Clear separation of concerns between Routes, Controllers, Models, Background Functions (PDF Generator & SendGrid Service), and CRON scheduling modules.
*   **In-Memory Stream Processing:** Generating PDF files as in-memory buffers instead of writing temporary files to disk, optimizing file handling and performance during email attachment creation.
*   **Reliable Error Resilience & Logging:** Comprehensive try-catch handling guarantees that any execution failure logs failure details directly to the database without crashing the application server.
*   **Cross-Applicable Middleware & Testing Structure:** Includes full integration testing using Jest and Supertest to validate endpoints, database persistence, and API response streams under isolated test databases.

---

## Interface Specifications & Technical Walkthrough

This section outlines how data flows through the application, detailing the exact execution lifecycle of automated reporting, manual triggers, and testing endpoints.

### 1. Report & Monitoring Endpoints

These endpoints manage manual triggers, PDF preview generation, and execution status tracking.

#### **POST** `/api/reports/trigger`
Manually triggers the weekly sales report generation and emails the result immediately.
*   **Headers:** `Content-Type: application/json`
*   **Success Response (`200 OK`):**
    ```json
    {
      "message": "Report generated and email delivered to SendGrid successfully!"
    }
    ```
*   **Error Response:**
    *   `500 Internal Server Error` (Failure during PDF generation, email sending, or database query).

#### **GET** `/api/reports/preview`
Generates and streams the weekly sales PDF report directly in the browser for instant preview.
*   **Headers:** None
*   **Success Response (`200 OK`):**
    *   **Content-Type:** `application/pdf`
    *   **Content-Disposition:** `inline; filename=weekly-report.pdf`
    *   *Returns raw binary PDF stream.*

#### **GET** `/api/reports/status`
Retrieves execution logs sorted by the most recent execution timestamp.
*   **Headers:** None
*   **Success Response (`200 OK`):**
    ```json
    [
      {
        "_id": "66f42c12a8f9...",
        "status": "SUCCESS",
        "executedAt": "2026-09-20T00:00:00.000Z"
      },
      {
        "_id": "66f42b10a8f9...",
        "status": "FAILED",
        "errorMessage": "API key invalid",
        "executedAt": "2026-09-13T00:00:00.000Z"
      }
    ]
    ```

---

### 2. Tester & Data Input Endpoints

Auxiliary pathways provided for registering new sales records and verifying recent transaction entries.

#### **POST** `/api/tester/send`
Registers a new sales transaction in the system.
*   **Headers:** `Content-Type: application/json`
*   **Body Parameters:**
    ```json
    {
      "clientName": "ACME Corp",
      "amount": 250.00,
      "status": "paid"
    }
    ```
    *Note: Valid choices for `status` are restricted to `paid` or `pending`.*
*   **Success Response (`201 Created`):**
    ```json
    {
      "message": "sale registered with success",
      "content": {
        "clientName": "ACME Corp",
        "amount": 250,
        "status": "paid",
        "_id": "66f42d88a8f9...",
        "createdAt": "2026-09-18T22:00:00.000Z"
      }
    }
    ```
*   **Error Response:**
    *   `400 Bad Request` (Missing required fields or invalid schema validation).

#### **GET** `/api/tester/read`
Retrieves sales registered over the past 7 days.
*   **Success Response (`200 OK`):**
    ```json
    [
      {
        "_id": "66f42d88a8f9...",
        "clientName": "ACME Corp",
        "amount": 250,
        "status": "paid",
        "createdAt": "2026-09-18T22:00:00.000Z"
      }
    ]
    ```

---

## Project Architecture
```text
Automated-report-service/
├── functions/               # Auxiliary services and document generators
│   ├── PDF_Generator.js     # PDFKit document creation logic (File stream & In-memory Buffer)
│   └── Send-Grid-Service.js # SendGrid API mail delivery logic & log persistence
├── src/
│   ├── config/              # Environment and database connection configurations
│   │   └── database.js      # Mongoose database initialization manager
│   ├── controllers/         # Business logic engines for reporting and test features
│   │   ├── reportController.js
│   │   └── testerController.js
│   ├── models/              # Mongoose data schemas
│   │   ├── reportLog.model.js
│   │   └── sales.model.js
│   ├── routes/              # Express network endpoint definitions
│   │   ├── report.routes.js
│   │   └── tester.routes.js
│   ├── app.js               # Express core application setup & global error handlers
│   └── cron.js              # Background CRON job scheduler
├── tests/                   # Automated integration test suite
│   └── report.test.js       # End-to-end endpoint tests with Jest and Supertest
├── .env                     # Private local environment variables
├── package.json             # Scripts, dependencies, and project metadata
├── server.js                # Application entrypoint & HTTP server lifecycle manager
└── README.md                # Project documentation
```