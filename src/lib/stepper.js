import _               from 'lodash';
import wpi, { OUTPUT } from 'wiring-pi';
import EventEmitter    from 'events';

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
 */
export class Stepper extends EventEmitter {
  /**
   * Create a stepper motor controller
   * @param {Object} config - An object of configuration parameters
   * @param {number[]} config.pins - An array of Raspberry Pi GPIO pin numbers
   * @param {number} config.steps - The number of steps per motor revolution
   * @param {Mode} config.mode - GPIO pin activation sequence
   * @param {number} config.speed - Motor rotation speed in RPM
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
    this._moveTimer = null;
    this._powered   = false;

    this._validateOptions();
    wpi.setup('gpio');

    for (let pin of this.pins) {
      wpi.pinMode(pin, OUTPUT);
    }
  }

  /**
   * The maximum speed at which the motor can rotate (as dictated by JS's timing resolution)
   * @type {number}
   */
  get maxRPM() {
    return 60 * 1000 / this.steps;
  }

  /**
   * Set motor speed in RPM
   * @type {number}
   * @param {number} rpm - The number of RPMs
   * @fires Stepper#speed
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
   * @returns {undefined}
   */
  stop() {
    this._stopMoving();
    this._powerDown();
    this.emit('stop');
  }

  /**
   * Stop moving the motor and hold position
   * @fires Stepper#hold
   * @returns {undefined}
   */
  hold() {
    this._stopMoving();
    this.emit('hold');
  }

  /**
   * Move the motor a specified number of steps
   * @param {number} stepsToMove - Positive for forward, negative for backward
   * @fires Stepper#start
   * @fires Stepper#move
   * @fires Stepper#complete
   * @fires Stepper#hold
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
      this._moveTimer = setInterval(() => {
        if (remaining === 0) {
          this.emit('complete');
          this.hold();
          return resolve(this.stepNum);
        }

        this._step(this.direction);
        remaining--;
      }, this._stepDelay);
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
    clearInterval(this._moveTimer);
    this._moveTimer = null;
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
