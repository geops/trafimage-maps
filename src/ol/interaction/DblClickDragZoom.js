/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/**
 * @module ol/interaction/DblPointerDblClick
 */
import Interaction from "ol/interaction/Interaction";
import MapBrowserEventType from "ol/MapBrowserEventType";
import { getValues } from "ol/obj";

/**
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
 * @return {boolean} Whether the event is a pointerdown, pointerdrag
 *     or pointerup event.
 */
function isPointerDraggingEvent(mapBrowserEvent) {
  const { type } = mapBrowserEvent;
  return (
    type === MapBrowserEventType.POINTERDOWN ||
    type === MapBrowserEventType.POINTERDRAG ||
    type === MapBrowserEventType.POINTERUP
  );
}

/**
 * @classdesc
 * Allows the user to zoom the map by double tap then drag with one finger
 * on a touch screen.
 * @api
 */
class DblClickDragZoom extends Interaction {
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
    this.scaleDeltaByPixel_ = options.delta ? options.delta : 0.01;

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
     * @type {boolean}
     * @private
     */
    this.handlingDoubleDownSequence_ = false;

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
   * Handles the {@link module:ol/MapBrowserEvent map browser event} and may call into
   * other functions, if event sequences like e.g. 'drag' or 'down-up' etc. are
   * detected.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   */
  handleEvent(mapBrowserEvent) {
    if (!mapBrowserEvent.originalEvent) {
      return true;
    }

    let stopEvent = false;
    this.updateTrackedPointers_(mapBrowserEvent);
    if (this.handlingDownUpSequence_) {
      if (mapBrowserEvent.type === MapBrowserEventType.POINTERDRAG) {
        this.handleDragEvent(mapBrowserEvent);
        // prevent page scrolling during dragging
        mapBrowserEvent.originalEvent.preventDefault();
      } else if (mapBrowserEvent.type === MapBrowserEventType.POINTERUP) {
        const handledUp = this.handleUpEvent(mapBrowserEvent);
        this.handlingDownUpSequence_ = handledUp;
      }
    } else if (mapBrowserEvent.type === MapBrowserEventType.POINTERDOWN) {
      if (this.handlingDoubleDownSequence_) {
        this.handlingDoubleDownSequence_ = false;
        const handled = this.handleDownEvent(mapBrowserEvent);
        this.handlingDownUpSequence_ = handled;
        stopEvent = this.stopDown(handled);
      } else {
        stopEvent = this.stopDown(false);
        this.waitForDblTap(mapBrowserEvent);
      }
    }
    return !stopEvent;
  }

  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   */
  handleDragEvent(mapBrowserEvent) {
    let scaleDelta = 1.0;

    const touch0 = this.targetPointers[0];
    const touch1 = this.down_.originalEvent;
    const distance = touch0.clientY - touch1.clientY;

    if (this.lastDistance_ !== undefined) {
      scaleDelta =
        1 - -(this.lastDistance_ - distance) * this.scaleDeltaByPixel_;
    }
    this.lastDistance_ = distance;

    if (scaleDelta !== 1.0) {
      this.lastScaleDelta_ = scaleDelta;
    }

    // scale, bypass the resolution constraint
    const { map } = mapBrowserEvent;
    const view = map.getView();
    map.render();
    view.adjustResolutionInternal(scaleDelta);
  }

  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleDownEvent(mapBrowserEvent) {
    if (this.targetPointers.length === 1) {
      const { map } = mapBrowserEvent;
      this.anchor_ = null;
      this.lastDistance_ = undefined;
      this.lastScaleDelta_ = 1;
      this.down_ = mapBrowserEvent;
      if (!this.handlingDownUpSequence_) {
        map.getView().beginInteraction();
      }
      return true;
    }
    return false;
  }

  /**
   * Handle pointer up events zooming out.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   */
  handleUpEvent(mapBrowserEvent) {
    if (this.targetPointers.length === 0) {
      const { map } = mapBrowserEvent;
      const view = map.getView();
      const direction = this.lastScaleDelta_ > 1 ? 1 : -1;
      view.endInteraction(this.duration_, direction);
      this.handlingDownUpSequence_ = false;
      this.handlingDoubleDownSequence_ = false;
      return false;
    }
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
    if (isPointerDraggingEvent(mapBrowserEvent)) {
      const event = mapBrowserEvent.originalEvent;

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
    } else {
      this.handlingDoubleDownSequence_ = true;
      this.doubleTapTimeoutId_ = setTimeout(
        /** @this {MapBrowserEventHandler} */
        () => {
          this.handlingDoubleDownSequence_ = false;
          this.doubleTapTimeoutId_ = undefined;
        },
        250,
      );
    }
  }
}

export default DblClickDragZoom;
