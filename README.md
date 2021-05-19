# ryoko

## About

This is the source code repository for the Web and Internet Engineering Project 2020/21.

### Group Members

* Roland Bernard, rolbernard@unibz.it
* Daniel Planötscher, dplanoetscher@unibz.it

### Project Idea

Do you want to boost your productivity and agility of your development? With Ryoko you are able to
effectively plan your tasks and manage your projects. It is build with developers in mind and
facilitates effective collaboration.

## Getting Started

You can test out our web application at https://ryoko-planning.herokuapp.com/.

### Simple deployment

If you have [yarn](https://yarnpkg.com/) installed it is possible to build and start the complete
project the same way it is deployed on our server. For this simply enter the root directory of the
repository and execute the following three command in order:

1. `yarn install` This will install all the dependencies for both the frontend and backend
2. `yarn build` This will bundle the source for the frontend and transpile backend
3. `yarn start` This will start the web server and host the webserver at `localhost:8000`

Note:
 * The server requires a public and private key pair to sign the authentication web token. They can
either be placed into the directory `server/keys/` with the name `cert.pem` (public key) and
`cert.key` (private key), or they can be given using the `JWT_PUBLIC_KEY` and `JWT_PRIVATE_KEY`
envirenvironment variables. In any case the keys must be suitable for ES384 signatures.
 * If your `PORT` environment variable is set that will be used as the port to host the webserver in stead of port 8000.
 * If your `NODE_ENV` environment variable is set to `production` (with SSL) or `staging` (without SSL) the server will try
to connect to a postgres database using the connection url inside `DATABASE_URL`.

### Details

The source code for the repository is split into two parts. The backend code can be found inside the
`server` directory while the frontend code can be found inside the `client` directory. Both parts
are managed using the `yarn` package manager, but can also be used with `npm` if necessary. The
server and client parts also use the same commands for running building and testing.
Before building or running you will have to make sure that you have installed all dependencies. This
can be done by executing `yarn install` (or `npm install --legacy-peer-deps`).

### How to Run

To start a development server you can execute `yarn start` (or `npm run start`) inside the `server`
and the `client` directories. Most parts of the client will also require the server to be running
simultaneously.

### How to Build

To build a production build enter the respective directory (either `server` or `client`) and execute
`yarn build` (or `npm run build`). The build output will be created inside a directory named `build`
and can then be executed using node for the server, or served staticaly for the client.

### How to Use

After starting the development server inside `client`, the website is accessible at
`http://localhost:3000`. Depending on your configuration the site will probably be opened
automatically in your default browser after execution of `yarn start`.

## Implementation
<!-- TODO -->

### General
<!-- TODO -->

### Libraries
<!-- TODO -->

