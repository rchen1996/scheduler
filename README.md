# Interview Scheduler

Interview scheduler is a single page app for students to book, edit, and delete interview appointments that they schedule with a selected interviewer. The interview scheduler client application connects with a WebSocket server to allow for a realtime experience.

## Tech Stack

Scheduler is built using React, CSS (SASS), JS/JSX, and axios. The client application is created using Create React App. The Scheduler API server is built with Express. A PostgreSQL database is used to persist data.

## Testing

- Jest: unit and integration tests
- Storybook: testing components in isolation
- Cypress: end-to-end testing

## Hosting

[Client application](https://scheduler-rchen.netlify.app) is hosted on Netlify.

WebSockets are supported in this application. Open a second browser window or tab to see changes made live!

_The scheduler API/PostgreSQL database are hosted using the free version of Heroku. 10-15 seconds of wait time or a refresh of the page may be required to wake the database._

## Final Product

!["Create/edit interview form"](#)
!["Appointment shown in hover state with edit/delete buttons visible"](#)
!["Confirm message prior to destructive action"](#)

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

The app will be served at http://localhost:8000/.

\*_Requires scheduler API server to be running_

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Running Cypress Test Framework

Install cypress using `npm install -g cypress`

```sh
npm run cypress
```
