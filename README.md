# WebEye
URL personalisation and shortener with tracking capabilities 

## Setup
- `npm install` in base directory and also in `./client`
- Change the MongoDB URI in "./config/keys.js"
- `npm run dev`

## File Structure
`./models`: DataBase schemas

### React
- `./client/`: React Project
- `./client/public/`: Page Template
- `./client/src/`: JavaScript Endpoints
- `./client/src/App.js`: Routing for all React components 

### Express
- `server.js`: Same as app.py in Flask
- `./server/`: Scripts for all routes should be placed here in their respective folders
