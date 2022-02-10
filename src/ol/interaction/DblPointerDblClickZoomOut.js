/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/**
 * @module ol/interaction/DblPointerDblClickZoomOut
 */
import Interaction, { zoomByDelta } from 'ol/interaction/Interaction';
import MapBrowserEventType from 'ol/MapBrowserEventType';
import { getValues } from 'ol/obj';

/**
 * @typedef {Object} Options
 * @property {number} [duration=400] Animation duration in milliseconds.
 */

/**
 * @classdesc
 * Allows the user to zoom the map by double tap with two fingers
 * on a touch screen.
 * @api
 */
class DblPointerDblClickZoomOut extends Interaction {
  /**
   * @param {Options} [opt_options] Options.
   */
  constructor(opt_options) {
    super();

    const options = opt_options || {};

    if (options.stopDown) {
      this.stopDown = options.stopDown;
    }

    /**
     * @private
     * @type {number}
     */
    this.delta_ = options.delta ? options.delta : 1;

    /**
     * @private
     * @type {number}
     */
    this.duration_ = options.duration !== undefined ? options.duration : 250;

    /**
     * @type {boolean}
     * @private
     */
    this.handlingDownUpSequence_ = false;

    /**
     * @type {!Object<string, PointerEvent>}
     * @private
     */
    this.trackedPointers_ = {};

    /**
     * @type {Array<PointerEvent>}
     * @protected
     */
    this.targetPointers = [];
  }

  /**
   * Handles the {@link module:ol/MapBrowserEvent map browser event} (if it was a
   * double finger double tap) and eventually zooms out the map.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   */
  handleEvent(mapBrowserEvent) {
    if (!mapBrowserEvent.originalEvent) {
      return true;
    }

    let stopEvent = false;
    this.updateTrackedPointers_(mapBrowserEvent);

    if (
      mapBrowserEvent.type === MapBrowserEventType.POINTERDRAG ||
      mapBrowserEvent.type === MapBrowserEventType.POINTERMOVE
    ) {
      // If the user drag the map we abort this interaction.
      this.handlingDownUpSequence_ = false;
      stopEvent = false;
      return !stopEvent;
    }

    if (
      this.targetPointers.length === 2 &&
      mapBrowserEvent.type === MapBrowserEventType.POINTERDOWN
    ) {
      stopEvent = this.stopDown(false);
      this.waitForDblTap(mapBrowserEvent);
    } else if (
      this.handlingDownUpSequence_ &&
      mapBrowserEvent.type === MapBrowserEventType.POINTERUP
    ) {
      const handledUp = this.handleUpEvent(mapBrowserEvent);
      this.handlingDownUpSequence_ = false;
      stopEvent = handledUp;
    }
    return !stopEvent;
  }

  /**
   * Handle pointer up events zooming out.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleUpEvent(mapBrowserEvent) {
    const browserEvent = /** @type {MouseEvent} */ (
      mapBrowserEvent.originalEvent
    );
    const { map } = mapBrowserEvent;
    const anchor = mapBrowserEvent.coordinate;
    const delta = browserEvent.shiftKey ? this.delta_ : -this.delta_;
    const view = map.getView();
    zoomByDelta(view, delta, anchor, this.duration_);
    browserEvent.preventDefault();
    return true;
  }

  /**
   * This function is used to determine if "down" events should be propagated
   * to other interactions or should be stopped.
   * @param {boolean} handled Was the event handled by the interaction?
   * @return {boolean} Should the `down` event be stopped?
   */
  stopDown(handled) {
    return handled;
  }

  /**
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @private
   */
  updateTrackedPointers_(mapBrowserEvent) {
    const event = mapBrowserEvent.originalEvent;

    // On some other event, pointerId can be empty.
    if (
      mapBrowserEvent.type === MapBrowserEventType.POINTERUP ||
      mapBrowserEvent.type === MapBrowserEventType.POINTERDOWN
    ) {
      const id = event.pointerId.toString();
      if (mapBrowserEvent.type === MapBrowserEventType.POINTERUP) {
        delete this.trackedPointers_[id];
      } else if (mapBrowserEvent.type === MapBrowserEventType.POINTERDOWN) {
        this.trackedPointers_[id] = event;
      } else if (id in this.trackedPointers_) {
        // update only when there was a pointerdown event for this pointer
        this.trackedPointers_[id] = event;
      }
      this.targetPointers = getValues(this.trackedPointers_);
    }
  }

  /**
   * Wait the second double finger tap.
   */
  waitForDblTap() {
    if (this.doubleTapTimeoutId_ !== undefined) {
      // double-click
      clearTimeout(this.doubleTapTimeoutId_);
      this.doubleTapTimeoutId_ = undefined;
      this.handlingDownUpSequence_ = true;
    } else {
      this.doubleTapTimeoutId_ = setTimeout(
        /** @this {MapBrowserEventHandler} */
        () => {
          this.handlingDownUpSequence_ = false;
          this.doubleTapTimeoutId_ = undefined;
        },
        250,
      );
    }
  }
}

export default DblPointerDblClickZoomOut;
