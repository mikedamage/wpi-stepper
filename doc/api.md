## Classes

<dl>
<dt><a href="#Stepper">Stepper</a></dt>
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

<a name="Stepper"></a>

## Stepper
Stepper motor control class

**Kind**: global class  

* [Stepper](#Stepper)
    * [new Stepper(config)](#new_Stepper_new)
    * [.maxRPM](#Stepper+maxRPM) : <code>number</code>
    * [.speed](#Stepper+speed) : <code>number</code>
    * [.stop()](#Stepper+stop) ⇒ <code>undefined</code>
    * [.hold()](#Stepper+hold) ⇒ <code>undefined</code>
    * [.move(stepsToMove)](#Stepper+move) ⇒ <code>Promise.&lt;number&gt;</code>
    * ["speed" (rpms, stepDelay)](#Stepper+event_speed)

<a name="new_Stepper_new"></a>

### new Stepper(config)
Create a stepper motor controller


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | An object of configuration parameters |
| config.pins | <code>Array.&lt;number&gt;</code> | An array of Raspberry Pi GPIO pin numbers |
| config.steps | <code>number</code> | The number of steps per motor revolution |
| config.mode | <code>[Mode](#Mode)</code> | GPIO pin activation sequence |
| config.speed | <code>number</code> | Motor rotation speed in RPM |

<a name="Stepper+maxRPM"></a>

### stepper.maxRPM : <code>number</code>
The maximum speed at which the motor can rotate (as dictated by JS's timing resolution)

**Kind**: instance property of <code>[Stepper](#Stepper)</code>  
<a name="Stepper+speed"></a>

### stepper.speed : <code>number</code>
Set motor speed in RPM

**Kind**: instance property of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>[speed](#Stepper+event_speed)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rpm | <code>number</code> | The number of RPMs |

<a name="Stepper+stop"></a>

### stepper.stop() ⇒ <code>undefined</code>
Stop the motor and power down all GPIO pins

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>Stepper#event:stop</code>  
<a name="Stepper+hold"></a>

### stepper.hold() ⇒ <code>undefined</code>
Stop moving the motor and hold position

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>Stepper#event:hold</code>  
<a name="Stepper+move"></a>

### stepper.move(stepsToMove) ⇒ <code>Promise.&lt;number&gt;</code>
Move the motor a specified number of steps

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>Promise.&lt;number&gt;</code> - A promise resolving to the number of steps moved  
**Emits**: <code>Stepper#event:start</code>, <code>Stepper#event:move</code>, <code>Stepper#event:complete</code>, <code>Stepper#event:hold</code>  

| Param | Type | Description |
| --- | --- | --- |
| stepsToMove | <code>number</code> | Positive for forward, negative for backward |

<a name="Stepper+event_speed"></a>

### "speed" (rpms, stepDelay)
Speed change event

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rpms | <code>number</code> | The current RPM number |
| stepDelay | <code>number</code> | The current step delay in msj |

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

<a name="new_Stepper_new"></a>

### new Stepper(config)
Create a stepper motor controller


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | An object of configuration parameters |
| config.pins | <code>Array.&lt;number&gt;</code> | An array of Raspberry Pi GPIO pin numbers |
| config.steps | <code>number</code> | The number of steps per motor revolution |
| config.mode | <code>[Mode](#Mode)</code> | GPIO pin activation sequence |
| config.speed | <code>number</code> | Motor rotation speed in RPM |

<a name="Stepper+maxRPM"></a>

### stepper.maxRPM : <code>number</code>
The maximum speed at which the motor can rotate (as dictated by JS's timing resolution)

**Kind**: instance property of <code>[Stepper](#Stepper)</code>  
<a name="Stepper+speed"></a>

### stepper.speed : <code>number</code>
Set motor speed in RPM

**Kind**: instance property of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>[speed](#Stepper+event_speed)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rpm | <code>number</code> | The number of RPMs |

<a name="Stepper+stop"></a>

### stepper.stop() ⇒ <code>undefined</code>
Stop the motor and power down all GPIO pins

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>Stepper#event:stop</code>  
<a name="Stepper+hold"></a>

### stepper.hold() ⇒ <code>undefined</code>
Stop moving the motor and hold position

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Emits**: <code>Stepper#event:hold</code>  
<a name="Stepper+move"></a>

### stepper.move(stepsToMove) ⇒ <code>Promise.&lt;number&gt;</code>
Move the motor a specified number of steps

**Kind**: instance method of <code>[Stepper](#Stepper)</code>  
**Returns**: <code>Promise.&lt;number&gt;</code> - A promise resolving to the number of steps moved  
**Emits**: <code>Stepper#event:start</code>, <code>Stepper#event:move</code>, <code>Stepper#event:complete</code>, <code>Stepper#event:hold</code>  

| Param | Type | Description |
| --- | --- | --- |
| stepsToMove | <code>number</code> | Positive for forward, negative for backward |

<a name="Stepper+event_speed"></a>

### "speed" (rpms, stepDelay)
Speed change event

**Kind**: event emitted by <code>[Stepper](#Stepper)</code>  

| Param | Type | Description |
| --- | --- | --- |
| rpms | <code>number</code> | The current RPM number |
| stepDelay | <code>number</code> | The current step delay in msj |

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
