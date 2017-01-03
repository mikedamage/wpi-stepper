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

### Custom Activation Modes

`wpi-stepper` comes configured for a 4-wire stepper motor out of the box, and thus far that's all I've tested it with. However, you can easily use the `Stepper` class to drive other types of motors with different numbers of wires by passing it a custom `mode` option when you initialize an instance.

Activation modes are arrays of arrays, whose inner members are either `1` or `0` and correspond to each pin, in the order you first specified them. `wpi-stepper` exports two available activation modes out of the box, and they look like this:

#### `DUAL` _(this is the default mode)_

Use this activation mode if you're driving a bipolar, 4-wire stepper motor:

```js
import { MODES, Stepper } from 'wpi-stepper';

const pins = [ 17, 16, 13, 12 ];
const mode = MODES.DUAL;
/*
[
  [ 1, 0, 0, 1 ], // Pin states: (17: on, 16: off, 13: off, 12: on)
  [ 0, 1, 0, 1 ],
  [ 0, 1, 1, 0 ],
  [ 1, 0, 1, 0 ]
]
*/

const motor = new Stepper({ pins, mode });
```

#### `SINGLE` _(for unipolar motors)_

```js
import { MODES, Stepper } from 'wpi-stepper';

const pins = [ 17, 16, 13, 12 ];
const mode = MODES.SINGLE;
/*
[
  [ 1, 0, 0, 0 ], // Pin states: (17: on, 16: off, 13: off, 12: off)
  [ 0, 1, 0, 0 ],
  [ 0, 0, 1, 0 ],
  [ 0, 0, 0, 1 ]
]
*/

const motor = new Stepper({ pins, mode });
```

As the motor turns, the `Stepper` class will step through these activation modes and apply the appropriate states to the pins you register. For both of the included modes, the pattern repeats every 4 steps. This can and should vary depending on how many wires your motor has.

#### Half-Stepping

_TODO_

## Full API

See the [API documentation](doc/api.md).

## License

`wpi-stepper` is released under the terms of the [MIT License](./LICENSE).
