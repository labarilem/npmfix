# npmfix

[![Build Status](https://travis-ci.org/labarilem/npmfix.svg?branch=master)](https://travis-ci.org/labarilem/npmfix)
[![Known Vulnerabilities](https://snyk.io/test/github/labarilem/npmfix/badge.svg?targetFile=package.json)](https://snyk.io/test/github/labarilem/npmfix?targetFile=package.json)

CLI tool that fixes *weird issues* in projects managing dependencies with NPM.

## Requirements

- NPM
- Node.js

## Installation

Install the CLI by running this command:
```
  npm i -g npmfix
```

## Usage

```
Usage: npmfix [options]

Options:

  -V, --version    output the version number
  -s, --serious    Serious fix mode: performs time consuming operations to fix more reliably your project(s).
  -r, --recursive  Recursively fix projects. Useful when there are subprojects in the current folder.
  -h, --help       output usage information
```