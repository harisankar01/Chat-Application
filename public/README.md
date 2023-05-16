## FRONTEND

The frontend is made using `reactJS` and styling is done using `styled-component`. Axios is used to make requests to the backend and Firebase is used for authentication and real-time database.

### Installation and Local Development

1. Clone the repository
2. Run npm install to install all the dependencies
3. Create a project in Firebase and configure the project for the web to get the credentials for the Firebase connection.
4. Enable Google authentication in Firebase. Create a real-time database in Firebase.
5. Create a Cloudinary account and create a new folder. Create a preset from the `settings->upload` option.
6. Create a `.env` file in the root directory with the following environment variables:

```
REACT_APP_LOCALHOST_KEY=
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
REACT_APP_CLOUDINARY_URL=
REACT_APP_UPLOAD_PRESET=
```

7. Run npm start to start the React frontend
