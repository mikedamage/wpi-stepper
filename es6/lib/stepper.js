import _               from 'lodash';
import wpi, { OUTPUT } from 'wiring-pi';
import EventEmitter    from 'events';
import NanoTimer       from 'nanotimer';

/**
 * Node's EventEmitter module
 * @external EventEmitter
 * @see {@link https://nodejs.org/api/events.html}
 */

/**
 * A matrix of high/low pin values, representing each step of an activation cycle
 * @typedef {Array} Mode
 */

/**
 * @constant
 * @type {Object.<string,Mode>}
 * @default
 */
export const MODES = {
  SINGLE: [
    [ 1, 0, 0, 0 ],
    [ 0, 1, 0, 0 ],
    [ 0, 0, 1, 0 ],
    [ 0, 0, 0, 1 ]
  ],
  DUAL: [
    [ 1, 0, 0, 1 ],
    [ 0, 1, 0, 1 ],
    [ 0, 1, 1, 0 ],
    [ 1, 0, 1, 0 ]
  ]
};

/**
 * A number of steps to advance or retreat
 * @typedef {number} direction
 */

/**
 * @constant
 * @type {Direction}
 * @default
 */
export const FORWARD = 1;

/**
 * @constant
 * @type {Direction}
 * @default
 */
export const BACKWARD = -1;

/**
 * Stepper motor control class
 * @extends EventEmitter
 */
export class Stepper extends EventEmitter {
  /**
   * Create a stepper motor controller
   * @param {Object} config - An object of configuration parameters
   * @param {number[]} config.pins - An array of Raspberry Pi GPIO pin numbers
   * @param {number} config.steps - The number of steps per motor revolution
   * @param {Mode} config.mode - GPIO pin activation sequence
   * @param {number} config.speed - Motor rotation speed in RPM
   * @example
   * import { Stepper } from 'wpi-stepper';
   * const motor = new Stepper({ pins: [ 17, 16, 13, 12 ], steps: 200 });
   * @returns {Object} an instance of Stepper
   */
  constructor({ pins, steps = 200, mode = MODES.DUAL, speed = 1 }) {
    super();
    this.mode       = mode;
    this.pins       = pins;
    this.steps      = steps;
    this.stepNum    = 0;
    this.moving     = false;
    this.direction  = null;
    this.speed      = speed;
    this._moveTimer = new NanoTimer();
    this._powered   = false;

    this._validateOptions();
    wpi.setup('gpio');

    for (let pin of this.pins) {
      wpi.pinMode(pin, OUTPUT);
    }
  }

  /**
   * The maximum speed at which the motor can rotate (as dictated by our
   * timing resolution). Currently we can send a signal once every microsecond.
   * @type {number}
   */
  get maxRPM() {
    return 60 * 1e6 / this.steps;
  }

  /**
   * Set motor speed in RPM
   * @type {number}
   * @param {number} rpm - The number of RPMs
   * @fires Stepper#speed
   * @example <caption>Sets the speed to 20 RPM</caption>
   * motor.speed = 20;
   * // => 20
   */
  set speed(rpm) {
    this._rpms = rpm;

    if (this._rpms > this.maxRPM) {
      this._rpms = this.maxRPM;
    }

    this._stepDelay = this.maxRPM / this._rpms;

    /**
     * Speed change event
     * @event Stepper#speed
     * @param {number} rpms - The current RPM number
     * @param {number} stepDelay - The current step delay in msj
     */
    this.emit('speed', this._rpms, this._stepDelay);
  }

  get speed() {
    return this._rpms;
  }

  /**
   * Stop the motor and power down all GPIO pins
   * @fires Stepper#stop
   * @example <caption>Log to console whenever the motor stops</caption>
   * motor.on('stop', () => console.log('Motor stopped'));
   * motor.stop();
   * // => undefined
   * // => "Motor stopped"
   * @returns {undefined}
   */
  stop() {
    this._stopMoving();
    this._powerDown();

    /**
     * Fires when the motor stops moving AND powers off all magnets
     * @event Stepper#stop
     */
    this.emit('stop');
  }

  /**
   * Stop moving the motor and hold position
   * @fires Stepper#hold
   * @example <caption>Log to console when the motor holds position</caption>
   * motor.on('hold', () => console.log('Holding position'));
   * motor.hold();
   * // => undefined
   * // => "Holding position"
   * @returns {undefined}
   */
  hold() {
    this._stopMoving();

    /**
     * Fires when the motor stops moving and holds its current position
     * @event Stepper#hold
     */
    this.emit('hold');
  }

  /**
   * Move the motor a specified number of steps. Each step fires a 'move' event.
   * @param {number} stepsToMove - Positive for forward, negative for backward
   * @fires Stepper#start
   * @fires Stepper#move
   * @fires Stepper#complete
   * @fires Stepper#hold
   * @example <caption>Move the motor forward one full rotation, then log to console</caption>
   * motor.move(200).then(() => console.log('Motion complete'));
   * // => Promise
   * // => "Motion complete"
   * @example <caption>Same thing, using an event handler instead of a promise</caption>
   * motor.on('complete', () => console.log('Motion complete'));
   * motor.move(200);
   * // => Promise
   * @returns {Promise.<number>} A promise resolving to the number of steps moved
   */
  move(stepsToMove) {
    if (stepsToMove === 0) {
      return this.hold();
    }

    if (this.moving) {
      this.emit('cancel');
      this.hold();
    }

    this.moving    = true;
    let remaining  = Math.abs(stepsToMove);
    this.direction = stepsToMove > 0 ? FORWARD : BACKWARD;

    this.emit('start', this.direction, stepsToMove);

    return new Promise((resolve) => {
      this._moveTimer.setInterval(() => {
        if (remaining === 0) {
          this.emit('complete');
          this.hold();
          return resolve(this.stepNum);
        }

        this._step(this.direction);
        remaining--;
      }, '', `${this._stepDelay}u`);
    });
  }

  stepForward() {
    this._step(FORWARD);
  }

  stepBackward() {
    this._step(BACKWARD);
  }

  attachLogger(logger) {
    const childLog = logger.child({ module: 'Stepper' });

    this.on('power', () => childLog.info({ powered: this._powered }, 'power toggled'));
    this.on('speed', () => childLog.info({ rpms: this._rpms, stepDelay: this._stepDelay }, 'speed changed'));
    this.on('hold', () => childLog.info('holding position'));
    this.on('start', (direction, steps) => childLog.info({ direction, steps }, 'starting motion'));
    this.on('stop', () => childLog.info('stopping'));
    this.on('cancel', () => childLog.info('cancelling previous motion'));
    this.on('move', (direction, phase, pinStates) => {
      childLog.debug({ direction, phase, pinStates }, 'move one step');
    });
    this.on('complete', () => childLog.info({ numSteps: this._numSteps }, 'motion complete'));
  }

  _step(direction) {
    let phase;

    if (direction === FORWARD) {
      phase = this._incrementStep();
    } else if (direction === BACKWARD) {
      phase = this._decrementStep();
    } else {
      return;
    }

    const pinStates = this.mode[phase];

    this._setPinStates(...pinStates);

    /**
     * Fires each time the motor moves a step
     * @event Stepper#move
     * @param {number} direction - 1 for forward, -1 for backward
     * @param {number} phase - Current pin activation phase
     * @param {number[]} pinStates - Current pin activation states
     *
     * @example <caption>Log each step moved, in excruciating detail</caption>
     * motor.on('move', (direction, phase, pinStates) => {
     *   console.debug(
     *     'Moved one step (direction: %d, phase: %O, pinStates: %O)',
     *     direction,
     *     phase,
     *     pinStates
     *   );
     * });
     * motor.move(200);
     * // => Promise
     */
    this.emit('move', direction, phase, pinStates);
  }

  _stopMoving() {
    this._resetMoveTimer();
    this.moving = false;
  }

  _powerDown() {
    this._powered = false;
    this._setPinStates(0, 0, 0, 0);
    this.emit('power', false);
  }

  _setPinStates(...states) {
    if (states.length !== this.pins.length) {
      throw new Error(`Must pass exactly ${this.pins.length} pin states`);
    }

    for (let idx in states) {
      wpi.digitalWrite(this.pins[idx], states[idx]);

      if (!this._powered && states[idx] === 1) {
        this._powered = true;
        this.emit('power', true);
      }
    }
  }

  _resetMoveTimer() {
    this._moveTimer.clearInterval();
  }

  _incrementStep() {
    this.stepNum++;

    if (this.stepNum >= this.steps) {
      this.stepNum = 0;
    }

    return Math.abs(this.stepNum) % this.mode.length;
  }

  _decrementStep() {
    this.stepNum--;

    if (this.stepNum < 0) {
      this.stepNum = this.steps - 1;
    }

    return Math.abs(this.stepNum) % this.mode.length;
  }

  _validateOptions() {
    const { mode, pins } = this;
    const invalidStep    = _.findIndex(mode, (step) => step.length !== pins.length);

    if (invalidStep !== -1) {
      throw new Error(`Mode step at index ${invalidStep} has the wrong number of pins`);
    }
  }
}

export default Stepper;
