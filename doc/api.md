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
<dt><a href="#FORWARD">FORWARD</a> : <code>Direction</code></dt>
<dd></dd>
<dt><a href="#BACKWARD">BACKWARD</a> : <code>Direction</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Mode">Mode</a> : <code>Array</code></dt>
<dd><p>A matrix of high/low pin values, representing each step of an activation cycle</p>
</dd>
<dt><a href="#direction">direction</a> : <code>number</code></dt>
<dd><p>A number of steps to advance or retreat</p>
</dd>
</dl>

## External

<dl>
<dt><a href="#external_EventEmitter">EventEmitter</a></dt>
<dd><p>Node&#39;s EventEmitter module</p>
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
    * ["speed" (rpms, stepDelay)](#Stepper+event_speed)
    * ["stop"](#Stepper+event_stop)
    * ["hold"](#Stepper+event_hold)

<a name="new_Stepper_new"></a>

### new Stepper(config)
Create a stepper motor controller

**Returns**: <code>Object</code> - an instance of Stepper  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | An object of configuration parameters |
| config.pins | <code>Array.&lt;number&gt;</code> | An array of Raspberry Pi GPIO pin numbers |
| config.steps | <code>number</code> | The number of steps per motor revolution |
| config.mode | <code>[Mode](#Mode)</code> | GPIO pin activation sequence |
| config.speed | <code>number</code> | Motor rotation speed in RPM |

**Example**  
```js
import { Stepper } from 'wpi-stepper';
const motor = new Stepper({ pins: [ 17, 16, 13, 12 ], steps: 200 });
```
<a name="Stepper+maxRPM"></a>

### stepper.maxRPM : <code>number</code>
The maximum speed at which the motor can rotate (as dictated by our
timing resolution). Currently we can send a signal once every microsecond.

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
Move the motor a specified number of steps. Each step fires a 'move' event.

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>Promise.&lt;number&gt;</code> - A promise resolving to the number of steps moved  
**Emits**: <code>Stepper#event:start</code>, <code>Stepper#event:move</code>, <code>Stepper#event:complete</code>, <code>[hold](#Stepper+event_hold)</code>  

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
```
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
<a name="Stepper+event_speed"></a>

### "speed" (rpms, stepDelay)
Speed change event

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rpms | <code>number</code> | The current RPM number |
| stepDelay | <code>number</code> | The current step delay in msj |

<a name="Stepper+event_stop"></a>

### "stop"
Fires when the motor stops moving AND powers off all magnets

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
<a name="Stepper+event_hold"></a>

### "hold"
Fires when the motor stops moving and holds its current position

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
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
    * ["speed" (rpms, stepDelay)](#Stepper+event_speed)
    * ["stop"](#Stepper+event_stop)
    * ["hold"](#Stepper+event_hold)

<a name="new_Stepper_new"></a>

### new Stepper(config)
Create a stepper motor controller

**Returns**: <code>Object</code> - an instance of Stepper  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | An object of configuration parameters |
| config.pins | <code>Array.&lt;number&gt;</code> | An array of Raspberry Pi GPIO pin numbers |
| config.steps | <code>number</code> | The number of steps per motor revolution |
| config.mode | <code>[Mode](#Mode)</code> | GPIO pin activation sequence |
| config.speed | <code>number</code> | Motor rotation speed in RPM |

**Example**  
```js
import { Stepper } from 'wpi-stepper';
const motor = new Stepper({ pins: [ 17, 16, 13, 12 ], steps: 200 });
```
<a name="Stepper+maxRPM"></a>

### stepper.maxRPM : <code>number</code>
The maximum speed at which the motor can rotate (as dictated by our
timing resolution). Currently we can send a signal once every microsecond.

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
Move the motor a specified number of steps. Each step fires a 'move' event.

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>Promise.&lt;number&gt;</code> - A promise resolving to the number of steps moved  
**Emits**: <code>Stepper#event:start</code>, <code>Stepper#event:move</code>, <code>Stepper#event:complete</code>, <code>[hold](#Stepper+event_hold)</code>  

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
```
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
<a name="Stepper+event_speed"></a>

### "speed" (rpms, stepDelay)
Speed change event

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rpms | <code>number</code> | The current RPM number |
| stepDelay | <code>number</code> | The current step delay in msj |

<a name="Stepper+event_stop"></a>

### "stop"
Fires when the motor stops moving AND powers off all magnets

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
<a name="Stepper+event_hold"></a>

### "hold"
Fires when the motor stops moving and holds its current position

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  
<a name="MODES"></a>

## MODES : <code>Object.&lt;string, Mode&gt;</code>
**Kind**: global constant  
<a name="FORWARD"></a>

## FORWARD : <code>Direction</code>
**Kind**: global constant  
<a name="BACKWARD"></a>

## BACKWARD : <code>Direction</code>
**Kind**: global constant  
<a name="Mode"></a>

## Mode : <code>Array</code>
A matrix of high/low pin values, representing each step of an activation cycle

**Kind**: global typedef  
<a name="direction"></a>

## direction : <code>number</code>
A number of steps to advance or retreat

**Kind**: global typedef  
<a name="external_EventEmitter"></a>

## EventEmitter
Node's EventEmitter module

**Kind**: global external  
**See**: [https://nodejs.org/api/events.html](https://nodejs.org/api/events.html)  
