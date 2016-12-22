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

<a name="Stepper"></a>

## Stepper
**Kind**: global class  
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
