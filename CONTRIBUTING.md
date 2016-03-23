First of all, but not less important, thank you for taking your time to contribute with this project.
Your help is very apreciated and welcome! =)

# Pull requests

To speed up the pull request review process, please check if your PR follows the tips below:
- if it is a bug fix implement at least one test case that exhibits the wrong behavior that you are fixing
- if it is a new feature try to implement tests that at least cover the more important parts of your code
- check if the code coverage is not being reduced
- squash your commits into a single commit
- follow the [angular commit convention] (https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines)

# Bug reporting

Please include in your bug report the following information:
- a brief description of the bug in the title (avoid writing generic titles)
- which version of angular-input-masks and angular was used
- in which browsers (and their versions) the bug was observed
- optional: pull request with a test case that reproduces the bug =)

# Implementing tests

This project implements two kinds of tests:
- unit tests: using [Karma](http://karma-runner.github.io) + [Jasmine](http://jasmine.github.io/) (Files: src/**/*.test.js)
- e2e tests: using [Protractor](https://github.com/angular/protractor) + Jasmine (Files: src/**/*.spec.js)

Only implement an e2e test with you can not reproduce it with an unit test.

# Where this project need more love

- Documentation
- Reduce the lib size without obfuscating the code
- Internationalization
- Build options
- Unit tests
- Include more browsers in the test setup
- And new input-masks =)
