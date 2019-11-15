// import polyfills for ie 11
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'proxy-polyfill';
import { ReactWebComponent } from 'create-react-web-component';
import WebComponent from './WebComponent';

ReactWebComponent.setAttributes(WebComponent.attributes);
ReactWebComponent.setProperties(WebComponent.defaultProps);
ReactWebComponent.render(WebComponent, 'trafimage-maps', { shadow: false });
