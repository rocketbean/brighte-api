# Brighte-api

Nikko Mesina
[@rocketbean](https://github.com/rocketbean)

> Notes before running the node app;

_after cloning this repo, please install the dependencies before anything else_

```
  $ npm install
```

_I have added the .env file intentionally, so you can simply adjust the values accordingly_
please check the [./.env] and [./test/.env.test] file and adjust the values regards to the environment.

The app is using [prisma](https://www.prisma.io/) to connect and transact to the database.
_please run this commands to setup the DB environment_

```
  $ npm run prisma:migrate
```

```
// To generate a prisma client
// NOTE:run this only if you have made changes to the models declared in prisma files
  $ npm run prisma:generate
```

_if you want to check the methods, please refer to [scripts] declaration in ./package.json_

## Test Cases

> please note that I have implemented an integration test rather than a unit test to scope the functionalities of each endpoint rather than a function.

the test is using [vitest](https://vitest.dev/) and [supertest](https://www.npmjs.com/package/supertest)
_you can find test files in under [./test] directory_

```
// to run the test cases
// the test will also run a test scenario after each endpoint testing
  $ npm run test
```

## Running the dev server

```
//run as development server
  $ npm run dev
```

or

```
//run the live server
  $ npm run start
```

both commands will generate a [./dist] folder which contains javascript files that will run the server.

### App specifications:
- Database: mysql
- nodejs: ^16.0.0
- typescript: ^5.7.3
- prisma: ^6.8.2

<hr/>

# chasi-ts

Chasi TS Framework

CLI: https://www.npmjs.com/package/@rocketbean/chasis

github: https://github.com/rocketbean/chasi-ts

[docs] - documentation is available on localserver by default,

- run the server [npm run serve]
- headover to [protocol<http|https>]://localhost:<port_number>
- default: http://localhost:3010

# Chasi

**RESTApi** Framework for **node.js**
this framework implements services such as

- Database
- Routing
- Middlewares
- Services
- Model
- View
- Controller

# Installation

> you can install Chasi-TS via npm init

```
  > $ npm init @rocketbean/chasi
```

> OR you can fork this repo (https://github.com/rocketbean/chasi-ts)

## starting the server

    // after setting up your .env file

run local development environment

```
  $ npm run dev
```

# Scripts

_you can install chasi-cli globally by running or you can just run it via npx._

> $ npm i -g @rocketbean/chasis

chasi command lines:

> ### Creating Controller

```
> $ chasis create -c <ControllerName> //using global chasi-cli
> $ npx chasis create -c <ControllerName> //npx
```

> this will generate your controller inside **./container/controllers/** path,
> which can be pointed to a certain route in route containers
> **e.g.**

```
route.get("yourpath", "yourcontroller@method");
route.post("yourpath2", "yourcontroller2@method2");

route.group({ prefix: "yourPathPrefix", middleware: [ "yourMiddlewareAlias" ]}, (() => {
  route.post('endpoint', "yourcontroller3@method3");
}));
```

<hr/>

> ### Creating Model

```
> $ chasis create -m <ModelName> //using global chasi-cli
> $ npx chasis create -m <ModelName> //npx
```

> by default, in your **Controller** the registered models is accessible via [this] **this.models**
> you can try to check it out:
> **e.g.**

```
this.models.user //inside your controller methods
console.log(this.models) // or try this instead to see the registered models
```

 <hr/>
 
  > ### Creating Service Provider
  
```
> $ chasis create -p <ServiceProvider> //using global chasi-cli
> $ npx chasis create -p <ServiceProvider> //npx
```
  > please note that ServiceProviders must be declared in **./config/container** under **ServiceBootstrap** property before it can be utilized, by then it will be registered to the chasi third party container, and will be accessible to any registered controller via the get method
  *e.g.*
```
get yourModule () {
    return this.services.yourModule
}
```
<hr/>

> ### Creating Middleware

```
> $ chasis create -w <middleware> //using global chasi-cli
> $ npx chasis create -w <middleware> //npx
```

> middlewares must also be registered in **./config/container** under **middlewares** property, before it can

    be attached to any route/ route group/ route container.

**e.g.**

```
route.post("yourpath", "yourcontroller@method").middleware("yourmiddleware");
```

_or you can add in the alias in ./config/services/RouterServiceProvider under middlewares array, this will be applied to all the routes under a routeContainer_

# View

Chasi utilizes vite for SSR.
please check `./container/html` directorty,
and `./config/compiler` to configure the compiler engine.

# Notes

as of this moment, MongoDB is the only database it supports, though Databases can be imported directly unto controller,
so you can have your DB wrapper _(only if you are not using MongoDB as your database)_

Might release a version built with TS. this repo was built in the most simpliest way to support any type of devs.

# Requirements

this template requires

- nodejs: ^16.0.0
- mongoDB: ^3.0.0

### Chasi [2.4.1] ReleaseNotes

** v2.4.1 >> v2.3.9 **

- test environment has been added (./test/\*_/_)
- supertest is added as a dev dependency.
- added StreamBucket class to handle cluster worker signals to the parent thread.
- serverPipe have been updated to handle signaling when cluster is enabled.
- Server storage update [workers will now send signals to the parent thread].
- removed signal logs handler from the lead worker, re appointed to the parent thread.
- Channels have been added to the SocketServer module.
- worker signals for service modules ([action: “service:<modulename>”])
- global.\_\_basepath (server basepath) is added as a global variable.
