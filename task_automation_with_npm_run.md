## [task automation with npm run](http://substack.net/task_automation_with_npm_run)

There are some [fancy tools](http://gruntjs.com/) for doing build automation on javascript projects that I've never felt the appeal of because the lesser-known npm run command has been perfectly adequate for everything I've needed to do while maintaining a very tiny configuration footprint.

Here are some tricks I use to get the most out of `npm run` and the `package.json` "scripts" field.

### the scripts field

If you haven't seen it before, npm looks at a field called `scripts` in the package.json of a project in order to make things like `npm test` from the s`cripts.test` field and `npm start` from the `scripts.start` field work.

`npm test` and `npm start` are just shortcuts for `npm run test` and `npm run start` and you can use `npm run` to run whichever entries in the scripts field you want!

Another thing that makes npm run really great is that npm will automatically set up $PATH to look in node_modules/.bin, so you can just run commands supplied by dependencies and devDependencies directly without doing a global install. Packages from npm that you might want to incorporate into your task workflow only need to expose a simple command-line interface and you can always write a simple little program yourself!

### building javascript

I write my browser code with node-style commonjs `module.exports` and `require()` to organize my code and to use packages published to npm. browserify can resolve all the require() calls statically as a build step to create a single concatenated bundle file you can load with a single script tag. To use browserify I can just have a `scripts['build-js']` entry in package.json that looks like:

```
"build-js": "browserify browser/main.js > static/bundle.js"
```

If I want my javascript build step for production to also do minification, I can just add uglify-js as a devDependency and insert it straight into the pipeline:

```
"build-js": "browserify browser/main.js | uglifyjs -mc > static/bundle.js"
```
### watching javascript

To recompile my browser javascript automatically whenever I change a file, I can just substitude the browserify command for watchify and add -d and -v for debugging and more verbose output:

"watch-js": "watchify browser/main.js -o static/bundle.js -dv"
### building css

I find that cat is usually adequate so I just have a script that looks something like:

"build-css": "cat static/pages/*.css tabs/*/*.css > static/bundle.css"
### watching css

Similarly to my watchify build, I can recompile css as it changes by substituting cat with catw:

```
"watch-css": "catw static/pages/*.css tabs/*/*.css -o static/bundle.css -v"
```
### sequential sub-tasks

If you have 2 tasks you want to run in series, you can just npm run each task separated by a &&:

```
"build": "npm run build-js && npm run build-css"
```
### parallel sub-tasks

If you want to run some tasks in parallel, just use & as the separator!

"watch": "npm run watch-js & npm run watch-css"
### the complete package.json

Altogether, the package.json I've just described might look like:

```
{
  "name": "my-silly-app",
  "version": "1.2.3",
  "private": true,
  "dependencies": {
    "browserify": "~2.35.2",
    "uglifyjs": "~2.3.6"
  },
  "devDependencies": {
    "watchify": "~0.1.0",
    "catw": "~0.0.1",
    "tap": "~0.4.4"
  },
  "scripts": {
    "build-js": "browserify browser/main.js | uglifyjs -mc > static/bundle.js",
    "build-css": "cat static/pages/*.css tabs/*/*.css",
    "build": "npm run build-js && npm run build-css",
    "watch-js": "watchify browser/main.js -o static/bundle.js -dv",
    "watch-css": "catw static/pages/*.css tabs/*/*.css -o static/bundle.css -v",
    "watch": "npm run watch-js & npm run watch-css",
    "start": "node server.js",
    "test": "tap test/*.js"
  }
}
```
If I want to build for production I can just do `npm run build ` and for local development I can just do npm run watch!

You can extend this basic approach however you like! For instance you might want to run the build step before running start, so you could just do:

```
"start": "npm run build && node server.js"
```
or perhaps you want an npm run start-dev command that also starts the watchers:

```
"start-dev": "npm run watch & npm start"
```
If you need to add a stage that executes after the watchify bundle is regenerated, you can use a tool like onchange to wire that up:

```
"watch": "npm run watch-js & npm run watch-css & npm run post-js",
"post-js": "onchange static/bundle.js -- npm test"
```

[onchange](https://npmjs.org/package/onchange) can even accept globs as arguments to watch a whole directory tree of files.

You can reorganize the pieces however you want! The dream of unix, alive and well!

### when things get really complicated...

If you find yourself stuffing a lot of commands into a single scripts field entry, consider factoring some of those commands out into someplace like bin/.

You can write those scripts in bash or node or perl or whatever. Just put the proper #! line at the top of the file, chmod +x, and you're good to go:

```
#!/bin/bash
(cd site/main; browserify browser/main.js | uglifyjs -mc > static/bundle.js)
(cd site/xyz; browserify browser.js > static/bundle.js)
"build-js": "bin/build.sh# windows
```

A surprising amount of bash-isms work on windows but we still need to get ; and & working to get to "good enough".

I have some experiments in the works for windows compatibility that should fold in very well with this npm-centric approach but in the meantime, win-bash is a super handy little bash implementation for windows.

### conclusion

I hope that this npm run approach I've documented here will appeal to some of you who may be unimpressed with the current state of frontend task automation tooling, particularly those of you like me who just don't "get" the appeal of some of these things. I tend to prefer tools that are more steeped in the unix heritage like git or here with npm just providing a rather minimal interface on top of bash. Some things really don't require a lot of ceremony or coordination and you can often get a lot of mileage out of very simple tools that do very ordinary things.

If you don't like the npm run style I've elaborated upon here you might also consider Makefiles as a solid and simple alternative to some of the more baroque approaches to task automation making the rounds these days.