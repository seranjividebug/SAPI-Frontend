# SAPI - Sovereign AI Assessment Platform

A comprehensive React application for assessing national AI sovereignty capabilities across multiple dimensions.

## Project Structure

```
sapi-assessment/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SAPI_P1_Landing.jsx      # Landing page
│   │   ├── SAPI_P2_preview.jsx      # Assessment preview
│   │   ├── SAPI_P3_Briefing.jsx     # Briefing page
│   │   ├── SAPI_P4_DimIntro.jsx     # Dimensions introduction
│   │   ├── SAPI_P5_Quiz.jsx         # Quiz interface
│   │   ├── SAPI_P6_Calculating.jsx  # Results calculation
│   │   └── SAPI_P7_Results.jsx      # Results display
│   ├── App.js                       # Main application component
│   ├── index.css                    # Global styles
│   └── index.js                     # Application entry point
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Application Flow

The application follows a structured assessment flow:

1. **Landing Page** (`/`) - Introduction and overview
2. **Preview** (`/preview`) - Assessment preview
3. **Briefing** (`/briefing`) - Detailed briefing
4. **Dimensions Introduction** (`/dimintro`) - Assessment dimensions
5. **Quiz** (`/quiz`) - Interactive assessment
6. **Calculating** (`/calculating`) - Results processing
7. **Results** (`/results`) - Final results display

## Features

- Multi-page assessment flow
- Interactive quiz interface
- Dynamic results calculation
- Responsive design
- Custom styling with inline SVG graphics
- State management for assessment data

## Technologies Used

- React 18
- React Router DOM for navigation
- Create React App template
- CSS-in-JS styling approach
