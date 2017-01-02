## Classes

<dl>
<dt><a href="#Stepper">Stepper</a> ⇐ <code>EventEmitter</code></dt>
<dd><p>Stepper motor control class</p>
</dd>
<dt><a href="#Stepper">Stepper</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#MODES">MODES</a> : <code>Object.&lt;string, Mode&gt;</code></dt>
<dd></dd>
<dt><a href="#FORWARD">FORWARD</a> : <code><a href="#Direction">Direction</a></code></dt>
<dd></dd>
<dt><a href="#BACKWARD">BACKWARD</a> : <code><a href="#Direction">Direction</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Phase">Phase</a> : <code>Array.&lt;number&gt;</code></dt>
<dd><p>Represents a single step of the motor, indicating which pins should be active.
Must have the same number of members as <code>this.pins.length</code>.</p>
</dd>
<dt><a href="#Mode">Mode</a> : <code><a href="#Phase">Array.&lt;Phase&gt;</a></code></dt>
<dd><p>An array of Phases, each representing a single motor step</p>
</dd>
<dt><a href="#Direction">Direction</a> : <code>number</code></dt>
<dd><p>Positive number denotes forward motion, negative denotes backward motion.</p>
</dd>
</dl>

## External

<dl>
<dt><a href="#external_EventEmitter">EventEmitter</a></dt>
<dd><p>Node&#39;s EventEmitter module</p>
</dd>
<dt><a href="#external_Logger">Logger</a></dt>
<dd><p>A Bunyan <code>Logger</code> instance</p>
</dd>
</dl>

<a name="Stepper"></a>

## Stepper ⇐ <code>EventEmitter</code>
Stepper motor control class

**Kind**: global class  
**Extends:** <code>EventEmitter</code>  

* [Stepper](#Stepper) ⇐ <code>EventEmitter</code>
    * [new Stepper(config)](#new_Stepper_new)
    * [.maxRPM](#Stepper+maxRPM) : <code>number</code>
    * [.speed](#Stepper+speed) : <code>number</code>
    * [.stop()](#Stepper+stop) ⇒ <code>undefined</code>
    * [.hold()](#Stepper+hold) ⇒ <code>undefined</code>
    * [.move(stepsToMove)](#Stepper+move) ⇒ <code>Promise.&lt;number&gt;</code>
    * [.run([direction])](#Stepper+run) ⇒ <code>undefined</code>
    * [.stepForward()](#Stepper+stepForward) ⇒ <code>number</code>
    * [.stepBackward()](#Stepper+stepBackward) ⇒ <code>number</code>
    * [.step(direction)](#Stepper+step) ⇒ <code>number</code>
    * [.attachLogger(logger)](#Stepper+attachLogger) ⇒ <code>undefined</code>
    * ["speed" (rpms, stepDelay)](#Stepper+event_speed)
    * ["stop"](#Stepper+event_stop)
    * ["hold"](#Stepper+event_hold)
    * ["cancel"](#Stepper+event_cancel)
    * ["start" (direction, stepsToMove)](#Stepper+event_start)
    * ["complete"](#Stepper+event_complete)
    * ["move" (direction, phase, pinStates)](#Stepper+event_move)

<a name="new_Stepper_new"></a>

### new Stepper(config)
Create a stepper motor controller instance

**Returns**: <code>Object</code> - an instance of Stepper  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | An object of configuration parameters |
| config.pins | <code>Array.&lt;number&gt;</code> |  | An array of Raspberry Pi GPIO pin numbers _(NOT WiringPi pin numbers)_ |
| [config.steps] | <code>number</code> | <code>200</code> | The number of steps per motor revolution |
| [config.mode] | <code>[Mode](#Mode)</code> | <code>MODES.DUAL</code> | GPIO pin activation sequence |
| [config.speed] | <code>number</code> | <code>1</code> | Motor rotation speed in RPM |

**Example** *(Initialize a stepper controller on pins 17, 16, 13, and 12, for a motor with 200 steps per revolution)*  
```js
import { Stepper } from 'wpi-stepper';
const motor = new Stepper({ pins: [ 17, 16, 13, 12 ], steps: 200 });
```
<a name="Stepper+maxRPM"></a>

### stepper.maxRPM : <code>number</code>
The maximum speed at which the motor can rotate (as dictated by our
timing resolution). _Note: This is not your motor's top speed; it's the computer's.
This library has not been tested with actual motor speeds in excess of 300 RPM.

**Kind**: instance property of <code>[Stepper](#Stepper)</code>  
<a name="Stepper+speed"></a>

### stepper.speed : <code>number</code>
Set motor speed in RPM

**Kind**: instance property of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>[speed](#Stepper+event_speed)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rpm | <code>number</code> | The number of RPMs |

**Example** *(Sets the speed to 20 RPM)*  
```js
motor.speed = 20;
// => 20
```
**Example** *(Receive notifications when motor speed changes)*  
```js
motor.on('speed', (rpms, stepDelay) => console.log('RPM: %d, Step Delay: %d', rpms, stepDelay));
motor.speed = 20;
// => 20
// => "RPM: 20, Step Delay: 15000"
```
<a name="Stepper+stop"></a>

### stepper.stop() ⇒ <code>undefined</code>
Stop the motor and power down all GPIO pins

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>[stop](#Stepper+event_stop)</code>  
**Example** *(Log to console whenever the motor stops)*  
```js
motor.on('stop', () => console.log('Motor stopped'));
motor.stop();
// => undefined
// => "Motor stopped"
```
<a name="Stepper+hold"></a>

### stepper.hold() ⇒ <code>undefined</code>
Stop moving the motor and hold position

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>[hold](#Stepper+event_hold)</code>  
**Example** *(Log to console when the motor holds position)*  
```js
motor.on('hold', () => console.log('Holding position'));
motor.hold();
// => undefined
// => "Holding position"
```
<a name="Stepper+move"></a>

### stepper.move(stepsToMove) ⇒ <code>Promise.&lt;number&gt;</code>
Move the motor a specified number of steps. Each step fires a `move` event. If another call to `move()`
is made while a motion is still executing, the previous motion will be cancelled and a `cancel` event
will fire.

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>Promise.&lt;number&gt;</code> - A promise resolving to the number of steps moved  
**Emits**: <code>[start](#Stepper+event_start)</code>, <code>[move](#Stepper+event_move)</code>, <code>[complete](#Stepper+event_complete)</code>, <code>[hold](#Stepper+event_hold)</code>, <code>[cancel](#Stepper+event_cancel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| stepsToMove | <code>number</code> | Positive for forward, negative for backward |

**Example** *(Move the motor forward one full rotation, then log to console)*  
```js
motor.move(200).then(() => console.log('Motion complete'));
// => Promise
// => "Motion complete"
```
**Example** *(Same thing, using an event handler instead of a promise)*  
```js
motor.on('complete', () => console.log('Motion complete'));
motor.move(200);
// => Promise
// => "Motion complete"
```
<a name="Stepper+run"></a>

### stepper.run([direction]) ⇒ <code>undefined</code>
Run the motor in the given direction indefinitely

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>undefined</code> - nothing  
**Emits**: <code>[cancel](#Stepper+event_cancel)</code>, <code>[start](#Stepper+event_start)</code>, <code>[move](#Stepper+event_move)</code>, <code>[complete](#Stepper+event_complete)</code>, <code>[hold](#Stepper+event_hold)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [direction] | <code>[Direction](#Direction)</code> | <code>FORWARD</code> | The direction in which to move (`FORWARD` or `BACKWARD`) |

<a name="Stepper+stepForward"></a>

### stepper.stepForward() ⇒ <code>number</code>
Moves the motor a single step forward. Convenience method for `this.step(FORWARD)`.

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>number</code> - The motor's current step number  
**Emits**: <code>[move](#Stepper+event_move)</code>  
<a name="Stepper+stepBackward"></a>

### stepper.stepBackward() ⇒ <code>number</code>
Moves the motor a single step backward. Convenience method for `this.step(BACKWARD)`.

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>number</code> - The motor's current step number  
**Emits**: <code>[move](#Stepper+event_move)</code>  
<a name="Stepper+step"></a>

### stepper.step(direction) ⇒ <code>number</code>
Move the motor one step in the given direction

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>number</code> - The motor's current step number  
**Emits**: <code>[move](#Stepper+event_move)</code>  

| Param | Type | Description |
| --- | --- | --- |
| direction | <code>[Direction](#Direction)</code> | The direction in which to move |

<a name="Stepper+attachLogger"></a>

### stepper.attachLogger(logger) ⇒ <code>undefined</code>
Attach a `bunyan` logger instance to report on all possible events at varying detail levels.

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| logger | <code>Logger</code> | a Bunyan logger instance |

<a name="Stepper+event_speed"></a>

### "speed" (rpms, stepDelay)
Speed change event

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rpms | <code>number</code> | The current RPM number |
| stepDelay | <code>number</code> | The current step delay in microseconds |

<a name="Stepper+event_stop"></a>

### "stop"
Fires when the motor stops moving AND powers off all magnets

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
<a name="Stepper+event_hold"></a>

### "hold"
Fires when the motor stops moving and holds its current position

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
<a name="Stepper+event_cancel"></a>

### "cancel"
Emitted when a motion is cancelled, before a new one begins

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
<a name="Stepper+event_start"></a>

### "start" (direction, stepsToMove)
Fires right before a new motion begins

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| direction | <code>[Direction](#Direction)</code> |  |
| stepsToMove | <code>number</code> | The requested number of steps to move |

<a name="Stepper+event_complete"></a>

### "complete"
Fires when a motion is completed and there are no more steps to move, right before the motor holds position

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
<a name="Stepper+event_move"></a>

### "move" (direction, phase, pinStates)
Fires each time the motor moves a step

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| direction | <code>number</code> | 1 for forward, -1 for backward |
| phase | <code>number</code> | Current pin activation phase |
| pinStates | <code>Array.&lt;number&gt;</code> | Current pin activation states |

**Example** *(Log each step moved, in excruciating detail)*  
```js
motor.on('move', (direction, phase, pinStates) => {
  console.debug(
    'Moved one step (direction: %d, phase: %O, pinStates: %O)',
    direction,
    phase,
    pinStates
  );
});
motor.move(200);
// => Promise
```
<a name="Stepper"></a>

## Stepper
**Kind**: global class  

* [Stepper](#Stepper)
    * [new Stepper(config)](#new_Stepper_new)
    * [.maxRPM](#Stepper+maxRPM) : <code>number</code>
    * [.speed](#Stepper+speed) : <code>number</code>
    * [.stop()](#Stepper+stop) ⇒ <code>undefined</code>
    * [.hold()](#Stepper+hold) ⇒ <code>undefined</code>
    * [.move(stepsToMove)](#Stepper+move) ⇒ <code>Promise.&lt;number&gt;</code>
    * [.run([direction])](#Stepper+run) ⇒ <code>undefined</code>
    * [.stepForward()](#Stepper+stepForward) ⇒ <code>number</code>
    * [.stepBackward()](#Stepper+stepBackward) ⇒ <code>number</code>
    * [.step(direction)](#Stepper+step) ⇒ <code>number</code>
    * [.attachLogger(logger)](#Stepper+attachLogger) ⇒ <code>undefined</code>
    * ["speed" (rpms, stepDelay)](#Stepper+event_speed)
    * ["stop"](#Stepper+event_stop)
    * ["hold"](#Stepper+event_hold)
    * ["cancel"](#Stepper+event_cancel)
    * ["start" (direction, stepsToMove)](#Stepper+event_start)
    * ["complete"](#Stepper+event_complete)
    * ["move" (direction, phase, pinStates)](#Stepper+event_move)

<a name="new_Stepper_new"></a>

### new Stepper(config)
Create a stepper motor controller instance

**Returns**: <code>Object</code> - an instance of Stepper  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | An object of configuration parameters |
| config.pins | <code>Array.&lt;number&gt;</code> |  | An array of Raspberry Pi GPIO pin numbers _(NOT WiringPi pin numbers)_ |
| [config.steps] | <code>number</code> | <code>200</code> | The number of steps per motor revolution |
| [config.mode] | <code>[Mode](#Mode)</code> | <code>MODES.DUAL</code> | GPIO pin activation sequence |
| [config.speed] | <code>number</code> | <code>1</code> | Motor rotation speed in RPM |

**Example** *(Initialize a stepper controller on pins 17, 16, 13, and 12, for a motor with 200 steps per revolution)*  
```js
import { Stepper } from 'wpi-stepper';
const motor = new Stepper({ pins: [ 17, 16, 13, 12 ], steps: 200 });
```
<a name="Stepper+maxRPM"></a>

### stepper.maxRPM : <code>number</code>
The maximum speed at which the motor can rotate (as dictated by our
timing resolution). _Note: This is not your motor's top speed; it's the computer's.
This library has not been tested with actual motor speeds in excess of 300 RPM.

**Kind**: instance property of <code>[Stepper](#Stepper)</code>  
<a name="Stepper+speed"></a>

### stepper.speed : <code>number</code>
Set motor speed in RPM

**Kind**: instance property of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>[speed](#Stepper+event_speed)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rpm | <code>number</code> | The number of RPMs |

**Example** *(Sets the speed to 20 RPM)*  
```js
motor.speed = 20;
// => 20
```
**Example** *(Receive notifications when motor speed changes)*  
```js
motor.on('speed', (rpms, stepDelay) => console.log('RPM: %d, Step Delay: %d', rpms, stepDelay));
motor.speed = 20;
// => 20
// => "RPM: 20, Step Delay: 15000"
```
<a name="Stepper+stop"></a>

### stepper.stop() ⇒ <code>undefined</code>
Stop the motor and power down all GPIO pins

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>[stop](#Stepper+event_stop)</code>  
**Example** *(Log to console whenever the motor stops)*  
```js
motor.on('stop', () => console.log('Motor stopped'));
motor.stop();
// => undefined
// => "Motor stopped"
```
<a name="Stepper+hold"></a>

### stepper.hold() ⇒ <code>undefined</code>
Stop moving the motor and hold position

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>[hold](#Stepper+event_hold)</code>  
**Example** *(Log to console when the motor holds position)*  
```js
motor.on('hold', () => console.log('Holding position'));
motor.hold();
// => undefined
// => "Holding position"
```
<a name="Stepper+move"></a>

### stepper.move(stepsToMove) ⇒ <code>Promise.&lt;number&gt;</code>
Move the motor a specified number of steps. Each step fires a `move` event. If another call to `move()`
is made while a motion is still executing, the previous motion will be cancelled and a `cancel` event
will fire.

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>Promise.&lt;number&gt;</code> - A promise resolving to the number of steps moved  
**Emits**: <code>[start](#Stepper+event_start)</code>, <code>[move](#Stepper+event_move)</code>, <code>[complete](#Stepper+event_complete)</code>, <code>[hold](#Stepper+event_hold)</code>, <code>[cancel](#Stepper+event_cancel)</code>  

| Param | Type | Description |
| --- | --- | --- |
| stepsToMove | <code>number</code> | Positive for forward, negative for backward |

**Example** *(Move the motor forward one full rotation, then log to console)*  
```js
motor.move(200).then(() => console.log('Motion complete'));
// => Promise
// => "Motion complete"
```
**Example** *(Same thing, using an event handler instead of a promise)*  
```js
motor.on('complete', () => console.log('Motion complete'));
motor.move(200);
// => Promise
// => "Motion complete"
```
<a name="Stepper+run"></a>

### stepper.run([direction]) ⇒ <code>undefined</code>
Run the motor in the given direction indefinitely

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>undefined</code> - nothing  
**Emits**: <code>[cancel](#Stepper+event_cancel)</code>, <code>[start](#Stepper+event_start)</code>, <code>[move](#Stepper+event_move)</code>, <code>[complete](#Stepper+event_complete)</code>, <code>[hold](#Stepper+event_hold)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [direction] | <code>[Direction](#Direction)</code> | <code>FORWARD</code> | The direction in which to move (`FORWARD` or `BACKWARD`) |

<a name="Stepper+stepForward"></a>

### stepper.stepForward() ⇒ <code>number</code>
Moves the motor a single step forward. Convenience method for `this.step(FORWARD)`.

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>number</code> - The motor's current step number  
**Emits**: <code>[move](#Stepper+event_move)</code>  
<a name="Stepper+stepBackward"></a>

### stepper.stepBackward() ⇒ <code>number</code>
Moves the motor a single step backward. Convenience method for `this.step(BACKWARD)`.

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>number</code> - The motor's current step number  
**Emits**: <code>[move](#Stepper+event_move)</code>  
<a name="Stepper+step"></a>

### stepper.step(direction) ⇒ <code>number</code>
Move the motor one step in the given direction

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>number</code> - The motor's current step number  
**Emits**: <code>[move](#Stepper+event_move)</code>  

| Param | Type | Description |
| --- | --- | --- |
| direction | <code>[Direction](#Direction)</code> | The direction in which to move |

<a name="Stepper+attachLogger"></a>

### stepper.attachLogger(logger) ⇒ <code>undefined</code>
Attach a `bunyan` logger instance to report on all possible events at varying detail levels.

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| logger | <code>Logger</code> | a Bunyan logger instance |

<a name="Stepper+event_speed"></a>

### "speed" (rpms, stepDelay)
Speed change event

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rpms | <code>number</code> | The current RPM number |
| stepDelay | <code>number</code> | The current step delay in microseconds |

<a name="Stepper+event_stop"></a>

### "stop"
Fires when the motor stops moving AND powers off all magnets

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
<a name="Stepper+event_hold"></a>

### "hold"
Fires when the motor stops moving and holds its current position

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
<a name="Stepper+event_cancel"></a>

### "cancel"
Emitted when a motion is cancelled, before a new one begins

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
<a name="Stepper+event_start"></a>

### "start" (direction, stepsToMove)
Fires right before a new motion begins

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| direction | <code>[Direction](#Direction)</code> |  |
| stepsToMove | <code>number</code> | The requested number of steps to move |

<a name="Stepper+event_complete"></a>

### "complete"
Fires when a motion is completed and there are no more steps to move, right before the motor holds position

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
<a name="Stepper+event_move"></a>

### "move" (direction, phase, pinStates)
Fires each time the motor moves a step

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| direction | <code>number</code> | 1 for forward, -1 for backward |
| phase | <code>number</code> | Current pin activation phase |
| pinStates | <code>Array.&lt;number&gt;</code> | Current pin activation states |

**Example** *(Log each step moved, in excruciating detail)*  
```js
motor.on('move', (direction, phase, pinStates) => {
  console.debug(
    'Moved one step (direction: %d, phase: %O, pinStates: %O)',
    direction,
    phase,
    pinStates
  );
});
motor.move(200);
// => Promise
```
<a name="MODES"></a>

## MODES : <code>Object.&lt;string, Mode&gt;</code>
**Kind**: global constant  
<a name="FORWARD"></a>

## FORWARD : <code>[Direction](#Direction)</code>
**Kind**: global constant  
<a name="BACKWARD"></a>

## BACKWARD : <code>[Direction](#Direction)</code>
**Kind**: global constant  
<a name="Phase"></a>

## Phase : <code>Array.&lt;number&gt;</code>
Represents a single step of the motor, indicating which pins should be active.
Must have the same number of members as `this.pins.length`.

**Kind**: global typedef  
<a name="Mode"></a>

## Mode : <code>[Array.&lt;Phase&gt;](#Phase)</code>
An array of Phases, each representing a single motor step

**Kind**: global typedef  
<a name="Direction"></a>

## Direction : <code>number</code>
Positive number denotes forward motion, negative denotes backward motion.

**Kind**: global typedef  
<a name="external_EventEmitter"></a>

## EventEmitter
Node's EventEmitter module

**Kind**: global external  
**See**: [https://nodejs.org/api/events.html](https://nodejs.org/api/events.html)  
<a name="external_Logger"></a>

## Logger
A Bunyan `Logger` instance

**Kind**: global external  
**See**: [https://www.npmjs.com/package/bunyan](https://www.npmjs.com/package/bunyan)  
