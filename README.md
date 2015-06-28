node harmony basic boilerplate
-
A very simple boilerplate for node harmony projects.

### Install
```sh
$ npm install node-harmony-basic-boilerplate
```

Answer the prompt questions and it'll do the rest - copying the resulting project back into the directory you ran `npm install` in.

**NOTE:** This boilerplate provides a jasmine patch to allow you to use generator functions directly in `it`, `fit`, `beforeEach`, and `afterEach` calls - if you're not comfortable with that then you can choose not to use the patch by not requiring it into any of your tests.  Also, the install will currently only work properly on **Windows** - looking to address this as soon as possible.

### Usage

To run your tests once (e.g. CI server, `npm test` command etc.).

```sh
$ gulp test
```

To watch for file changes and continuously run the tests.

```sh
$ gulp dev
```

Debug your tests with [node-inspector](https://github.com/node-inspector/node-inspector) using:
> You must already have node-inspector globally installed for this to work!

```sh
$ npm run debug-tests
```
