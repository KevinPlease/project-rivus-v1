Project Rivus v1

# Getting Started

## Installation

- MongoDb **(v5.0.9)** + Compass GUI
- NodeJS **(v18.12.1)**
- VSCode (preferably)
- Git


### MongoDB configuration
1. Before making the steps below, make sure Mongod is running by going to the install directory, opening the terminal where the file `mongod` is, and running `./mongod`.
2. Follow this article to enable authorization and create a root admin user:
[How to Enable Authentication on MongoDB | by Stampery Inc. | Mongoaudit — the mongoaudit guides | Medium](https://medium.com/mongoaudit/how-to-enable-authentication-on-mongodb-b9e8a924efac)
**NOTE that the user should be created with credentials saved in the env file!**
3. Restart the `mongod` service in the terminal and attempt to login via the Compass GUI app.

After opening Compass, should create in Mongo this db, collection and the domain:

![image](https://github.com/KevinPlease/project-rivus-v1/assets/24757252/24ba4c17-74a8-46fc-ac85-5f37f76a70ec)

```json
{
  "id": "Rivus",
  "repository": "domains",
  "data": {
    "name": "Rivus",
    "username": "DB_USERNAME",
    "password": "DB_PASSWORD"
  },
  "role": "domain"
}
```

## Server App
1. To run the app (server and client), from the project root execute `npm start`. In the browser you can access the website via `rivus.localhost:5000`.
2. The first time you run the server, you should run the `onboarding` DEV_API via the Postman collection in github. It will insert some initial system data in the database.

[WIP for more details, bugs etc.]

