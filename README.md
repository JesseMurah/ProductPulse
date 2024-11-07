# Company Data Visualizer

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage](#usage)
  - [Data Upload](#data-upload)
  - [Data Visualization](#data-visualization)
- [License](#license)
- [Contact](#contact)

## Overview

**Company Data Visualizer** is a web application built with Next.js that allows users to upload, manage, and visualize company data. Leveraging tRPC for type-safe API interactions and D3.js for dynamic data visualizations, the application provides an intuitive interface for handling bulk data uploads and generating insightful visual representations.

## Features

- **Bulk Data Upload:** Upload CSV files or paste data directly to manage company information.
- **Dynamic Visualization:** Visualize company ratings using interactive D3.js charts.
- **Type-Safe APIs:** Utilize tRPC for seamless and type-safe client-server communication.
- **Responsive Design:** Built with responsive UI components for optimal user experience across devices.
- **Theme Support:** Toggle between light and dark modes with system preference detection.

## Technologies Used

- **Frontend:**
  - [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation.
  - [React](https://reactjs.org/) - JavaScript library for building user interfaces.
  - [D3.js](https://d3js.org/) - JavaScript library for producing dynamic, interactive data visualizations.
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development.

- **Backend:**
  - [tRPC](https://trpc.io/) - Type-safe APIs without the need for code generation.
  - [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js applications.
  - [Prisma](https://www.prisma.io/) - ORM for database interactions.

- **State Management & Data Fetching:**
  - [React Query](https://react-query.tanstack.com/) - Data-fetching library for React.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) (v14 or later)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/company-data-visualizer.git
   cd company-data-visualizer
2. **Install Dependencies**
   Using npm:
   ```bash
   npm install
   ```
   Using yarn
   ```bash
   yarn install
   ```
### Environment Variables
Create a .env.local file in the root directory and add the following environment variables:
```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Database Configuration
DATABASE_URL=your-database-url

# Additional Configurations
VERCEL_URL=your-vercel-url # Optional, for deployment
PORT=3000
```
**Note**: Replace `your-nextauth-secret` and `your-database-url` with your actual credentials. Ensure that `.env` is added to `.gitignore` to keep sensitive information secure.

### Running the Application
Start the development server:
Using npm:
```bash
npm run dev
```
Or using Yarn:
```bash
yarn dev
```

Open `http://localhost:3000` in your browser to view the application.

# Project Structure
```bash
src/
├── app/
│   ├── _components/
│   │   ├── CompanyDataVisualization.tsx
│   │   └── DataUploadForm.tsx
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── server/
│   ├── api/
│   │   ├── context.ts
│   │   ├── routers/
│   │   │   ├── company.ts
│   │   │   ├── product.ts
│   │   │   └── productAvailability.ts
│   │   ├── root.ts
│   │   └── trpc.ts
│   ├── auth/
│   │   └── index.ts
│   └── db.ts
├── trpc/
│   └── react.ts
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   └── theme-provider.tsx
├── styles/
│   └── globals.css
├── utils/
│   └── api.ts
├── public/
│   └── favicon.ico
├── .env.local
├── tsconfig.json
├── package.json
└── README.md
```

# Usage
## Uploading Data
1. Navigate to the Upload Page
Go to the upload section of the application where you can either upload a CSV file or paste data directly.

2. Upload a CSV File
  - Click on the "Upload CSV file" button.
  - Select your CSV file from your local machine.
  - Click "Upload Data" to submit.

3. Or Paste Data Directly
  - Use the text area to paste your data.
  - Click "Upload Data" to submit.

### Visualizing Data
After uploading, navigate to the visualization section to view dynamic charts and graphs representing your company data.
  - Bar Charts: Compare different metrics across companies.
  - Line Graphs: Track changes over time.
  - Pie Charts: Show distribution of categories.
**Note**: Interact with the charts to get more detailed insights.

## License
This project is licensed under the MIT License.

## Contact
For any enquiries or support, please contact:
  - Name: Jesse Murah
  - Email: jkhnmurah@gmail.com
  - LinkedIn: https://www.linkedin.com/in/jessemurah/


