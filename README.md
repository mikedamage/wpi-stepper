# wpi-stepper
## A WiringPi Stepper Motor Control Module

_by Mike Green_

## Introduction

`wpi-stepper` is a flexible control class for stepper motors, written using the excellent [WiringPi-Node](https://www.npmjs.com/package/wiring-pi) library. If you find yourself in need of such a module, give it a try.

I wrote `wpi-stepper` for a few reasons:

+ I'm a web developer by trade. I'm most comfortable programming in JavaScript.
+ My wife and I keep chickens (20 laying hens and a rotating cast of broilers, if you're curious).
+ We built an automatic sliding door for our chicken coop that uses a stepper motor.
+ All existing stepper control modules I could find in JS either don't work, can't be installed in current versions of Node, or require you to wire your motor to the driver in a way that makes no rational sense.

`wpi-stepper` allows you to wire your motor and controller however you prefer, and you can also program your own pin activation sequences by simply feeding some arrays of 1's and 0's to the `Stepper` class. I can see this being useful not only for driving stepper motors, but also for controlling anything that requires a repeating sequence of activation and deactivation.

I tried to make this library as configurable as possible, and it supports both events and ES6 promises wherever it makes sense to, so it should play well with other libraries you're using.

_Note: This library uses WiringPi to toggle GPIO pins, which means that it must be run as root in order to work. If you're not running as root, your script will bail when WiringPi tries and fails to initialize._

## Installation

```sh
npm install --save wpi-stepper
```

## Usage

### ES5 Module

Pre-compiled to ES5 with Babel and the `es2015-node` preset:

```js
var Stepper = require('wpi-stepper').Stepper;
```

### ES6 Module

The raw ES6 source, if you're transpiling it yourself:

```js
import { Stepper } from 'wpi-stepper/es6/lib/stepper';
```

### Example

```js
const pins = [
  17, // A+
  16, // A-
  13, // B+
  12  // B-
];
const motor = new Stepper({ pins, steps: 200 });

motor.speed = 20; // 20 RPM

// Move the motor forward 800 steps (4 rotations), logging to console when done:
motor.move(800).then(() => console.log('motion complete'));
```

Additionally, `Stepper` is an `EventEmitter`, so you can subscribe to various events emitted by the class throughout its life cycle:

```js
motor.on('start', () => console.log('Starting to move!'));
motor.on('cancel', () => console.log('Stopping that. Doing this instead!'));
motor.on('complete', () => console.log('I\'m all finished!'));

motor.move(800);
motor.move(-800);

// => "Starting to move!"
// => "Stopping that. Doing this instead!"
// => "Starting to move!"
// (a few seconds later...)
// => "I'm all finished!"

```

## API

[API documentation](doc/api.md) is a work in progress.

## License

`wpi-stepper` is released under the terms of the [MIT License](./LICENSE).
