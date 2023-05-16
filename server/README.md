## BACKEND

This is the backend for the chat application made with `express`. The backend interacts with the database to retrieve and store data. The database used for this application is the Google MySQL instance.

### Installation and Local Development

1. Clone the repository
2. Move to the `functions` folder using the command, `cd .\functions\`.
3. Run npm install to install all the dependencies.
4. Create a `.env` file in the root directory with the following environment variables:

```
SQL_HOST_NAME= // enter the IP address
SQL_USER_NAME=
SQL_USER_PASSWORD=
SQL_DATABASE_NAME=
FIREBASE_CLIENT_ID=
JWT_SECRET=
```

5. Follow the steps in the deployment section for both deployment and local testing.

### Deployment

This backend is deployed using Firebase Functions. Follow the following steps to deploy your application,

1. Enable the hosting feature in Firebase.
2. Download the secret key file from your Firebase account and put the file into the `functions` folder. Proper changes have to be made to the `userController` file regarding the name of the file.
3. Install the Firebase cmd line tools.

```
npm i -g firebase-tools
```

4. Login into your Firebase account

```
firebase login
```

5. Initialize hosting to update hosting information

```
firebase init hosting
```

6. Run the server locally using the following command,

```
firebase emulators:start
```

7. Deploy to Firebase using `firebase deploy` command

### Security

This application uses JWT-based security which is provided through Firebase token verification and a `verifyToken` middleware is used to verify the token for authentication.

### Endpoints

This backend provides the following endpoints:

- `/api/auth/login`: API endpoint to create or retrieve the user. Verify the firebase token and generate the JWT token
- `/api/auth/setavatar/:id`: API endpoint to set the avatar image for the user based on user id.
- `/api/auth/allusers`: API endpoint to retrieve user profile details.
- `/api/messages/addmsg/`: API endpoint to add a message to the database.
- `/api/messages/getmsg/`: API endpoint to get messages from the database.
