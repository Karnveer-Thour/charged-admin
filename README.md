# Charged Admin Panel

This is the administration panel for the Charged ride-sharing application. The admin panel allows administrators to manage pricing rules, view rider information, and process refunds for cancelled rides.

## Features

- **Dashboard**: View key metrics including total rides, revenue, active users, and reward points.
- **Pricing Management**: Set and update base prices, per-km rates, and cancellation policies for different ride types.
- **Rider Management**: View and manage rider accounts, track reward points, and view ride history.
- **Refund Processing**: Process refunds for canceled rides based on the driver's distance at the time of cancellation (refund eligibility threshold set at 70 meters).

## Technical Stack

- React 18
- TypeScript
- Material UI
- Chart.js
- React Router
- React Context API

## Getting Started

### Prerequisites

- Node.js 14+ and npm/yarn

### Installation

1. Clone the repository

```
git clone <repository-url>
```

2. Navigate to the project directory

```
cd charged-admin
```

3. Install dependencies

```
npm install
```

4. Start the development server

```
npm start
```

The application will be available at `http://localhost:3000`.

## Authentication

The admin panel uses a mock authentication system for demonstration purposes. Use the following credentials to log in:

- **Email**: admin@charged.com
- **Password**: adminpass

## Project Structure

```
charged-admin/
  ├── public/
  └── src/
      ├── components/       # Reusable UI components
      ├── contexts/         # React context providers
      ├── hooks/            # Custom React hooks
      ├── pages/            # Main application pages
      ├── services/         # API services
      ├── types/            # TypeScript type definitions
      └── utils/            # Utility functions
```

## Key Features Implementation

### Refund Policy

The system automatically determines refund eligibility for cancelled rides based on the driver's distance at the time of cancellation. If the driver is more than 70 meters away when the user cancels, the ride is eligible for a refund.

### Pricing Rules

The admin panel allows setting different pricing parameters for each vehicle type:

- Base price
- Price per kilometer
- Price per minute
- Cancellation fee
- Refund eligibility distance

### Rider Rewards

The system tracks reward points for riders based on completed rides. For each completed ride, riders earn points based on the fare amount.

## Deployment

To build the application for production:

```
npm run build
```

The build files will be generated in the `build` directory.

## Future Enhancements

- Integration with a real backend API
- Driver management features
- Real-time ride tracking
- Analytics and reporting
- Payment processing management

# charged-admin
