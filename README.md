# WebEye
URL personalisation and shortener with tracking capabilities 

## Setup
- `npm install` in base directory and also in `./client`
- `npm run dev`

### React
- `./client/`: React Project
- `./client/public/`: Page Template
- `./client/src/`: JavaScript Endpoints
- `./client/src/App.js`: Routing for all React components 

### Express
- `app.js`: Same as app.py in Flask
- `./server/`: Scripts for all routes should be placed here in their respective folders
- `./server/dbconnection`: Database connection methods
- `./server/signin/users`: Login/Sign-up
- `./server/index`: Route handler
- `./server/api`: All api methods

### To-do's:

- [x] Route protection
- [x] Create shortened url
- [x] Edit url
- [x] Delete url
- [x] Get stats for a url
- [ ] IP logging
- [ ] Geolocation lookup
- [ ] Email tracking