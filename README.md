# npmfix

[![Build Status](https://travis-ci.org/labarilem/npmfix.svg?branch=master)](https://travis-ci.org/labarilem/npmfix)
[![Known Vulnerabilities](https://snyk.io/test/github/labarilem/npmfix/badge.svg?targetFile=package.json)](https://snyk.io/test/github/labarilem/npmfix?targetFile=package.json)
[![npm version](https://badge.fury.io/js/npmfix.svg)](https://badge.fury.io/js/npmfix)

CLI tool that fixes *weird issues* in projects managing dependencies with NPM.

## How it works

For

## Requirements

- NPM
- Node.js

## Installation

Install the CLI by running this command:

```bash
  npm i -g npmfix
```

## Usage

```shell
Usage: npmfix [options]

Options:

  -V, --version    output the version number
  -s, --serious    Serious fix mode: performs time-consuming operations to fix more reliably your project(s).
  -i, --install    Runs 'npm i' after fixing a project.
  -r, --recursive  Recursively fix projects. Useful when there are sub-projects in the current folder.
  -h, --help       output usage information
```