export const SET_LAYERS = 'SET_LAYERS';
export const SET_LAYER_SERVICE = 'SET_LAYER_SERVICE';
export const SET_CENTER = 'SET_CENTER';
export const SET_RESOLUTION = 'SET_RESOLUTION';
export const SET_ZOOM = 'SET_ZOOM';

export const setLayers = data => ({ type: SET_LAYERS, data });

export const setCenter = data => ({ type: SET_CENTER, data });

export const setResolution = data => ({ type: SET_RESOLUTION, data });

export const setZoom = data => ({ type: SET_ZOOM, data });
