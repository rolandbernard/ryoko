# Technologies, Architecture & Development Process

## Architecture & Technology

The application is divided into a front-end (`client` folder) and back-end (`server` folder). Both
are running on [JavaScript](javascript) runtimes and are written in [TypeScript](typescript). The
communication between the server and client is implement using a [REST API](rest).

### Server

The server runs on the [Node.js](node) environment. The code is rune using [node-ts](nodets) when
testing, and compiled using the [TypeScript](typescript) compiler before running it with regular
[node](node) for production.

The API is implement on the server using the [express](express) web framework. The server also
serves the static resources for the front-end. The back-end handles requests using a database
connection handled by the [Knex.js](knex) query builder. For testing a [SQLite3](sqlite) database is
used, while for production and staging the server connects to a [PostgreSQL](postgres) database.

Authentication is handled using [JSON Web Tokens](jwt) (JWT) that are signed either using a secret
(in testing) or using a public and private key pair (in production). The authentication token must
be given for all request that require authentication. Password are salted and hashed using the
[bcrypt](bcrypt) algorithm and later verified against the provided credentials for generating new
tokens. 

The implementation of the API is split into multiple parts. The parts all have unit test in the
server code, that are run using the [Jest](jest) testing framework and the [supertest](supertest)
library for testing the API. Documentation for each part can be found in the [API
Documentation](api).

### Client

The front-end is running in the browser and implemented as a [Single Page Application](spa). Like
the server, it is written in [TypeScript](typescript) and transpiled before running in the browser.
For production builds, the application is bundled and minified using [Webpack](webpack). We are also
using the [Workbox](workbox) library to simplify the implementation of the service worker and make
the website a [Progressive Web App](pwa) (PWA).

The client uses the [React](react) framework together with the [React router](reactrouter) library.
[React](react) is a [JavaScript](javascript) library for rendering user interfaces. It uses a
component structure, where the programmer defines custom components that can be nested and will then
be rendered by the library into the browsers DOM. We implemented only functional components, and
used [TSX](tsx) to allow easier input of the [React](react) nodes.

We also use [SCSS](sass) for styling the pages and custom components we implemented. It is
transpiled, similar to [TypeScript](typescript), before running the code in the browser. The
resulting [CSS](css) will also be bundled using [Webpack](webpack).

[javascript]: https://developer.mozilla.org/en-US/docs/Web/javascript
[typescript]: https://www.typescriptlang.org/
[rest]: https://developer.mozilla.org/en-US/docs/Glossary/REST
[node]: https://nodejs.org/en/
[nodets]: https://typestrong.org/ts-node/
[express]: http://expressjs.com/
[knex]: http://knexjs.org/
[sqlite]: https://sqlite.org/index.html
[postgres]: https://www.postgresql.org/
[jwt]: https://jwt.io/
[bcrypt]: https://github.com/kelektiv/node.bcrypt.js#readme
[jest]: https://jestjs.io/
[supertest]: https://github.com/visionmedia/supertest#readme
[api]: api-docs.md
[spa]: https://developer.mozilla.org/en-US/docs/Glossary/SPA
[webpack]: https://webpack.js.org/
[workbox]: https://developers.google.com/web/tools/workbox/
[pwa]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
[react]: https://reactjs.org/
[reactrouter]: https://reactrouter.com/
[tsx]: https://www.typescriptlang.org/docs/handbook/jsx.html
[sass]: https://sass-lang.com/
[css]: https://developer.mozilla.org/en-US/docs/Web/CSS

## Development Process

We started development by thinking about the user story and crating simple wireframes. After we had
an idea of what the application was supposed to do, we started to design the database structure.
With the database schema finished and after selecting the technologies, we started work first on the
backend. At the same time, we also started work on the front-end, initially working on the parts
that did not need the API. After we completed the functionality of the server code, we focused our
attention on design and implementation of the client side code. From then on, changes to the
back-end where small and mainly to fix bugs that were found during the implementation of the
front-end. We focused the last part of development on finding and fixing bugs, adding only a small
amount of new features in the last month.

