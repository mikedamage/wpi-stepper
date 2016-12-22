# wpi-stepper
## A WiringPi Stepper Motor Control Module

_by Mike Green_

## Introduction

`wpi-stepper` is a flexible control class for stepper motors, written using the excellent [WiringPi-Node](https://www.npmjs.com/package/wiring-pi) library. If you find yourself in need of such a module, give it a try.

I wrote `wpi-stepper` for a few reasons:

+ I'm a web developer by trade. I'm most comfortable programming in JavaScript.
+ My wife and I keep chickens (20 laying hens and a rotating cast of broilers, if you're curious).
+ We built an automatic sliding door for our chicken coop that uses a stepper motor.
+ All existing stepper control modules for WiringPi-Node either don't work, can't be installed in current versions of Node, or require you to wire your motor in a way that makes no rational sense.

## API

Please refer to the [API documentation](doc/api.md).

## License

`wpi-stepper` is released under the terms of the [MIT License](./LICENSE).
