// import polyfills for ie 11
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

// Import web-components polyfills for ie 11, see https://github.com/webcomponents/polyfills.
// If you need to test the component with { shadow: true }, you have to add:
// import '@webcomponents/shadydom'
// import '@webcomponents/shadycss'
import '@webcomponents/webcomponents-platform';
import '@webcomponents/custom-elements';
import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import 'proxy-polyfill';
import { ReactWebComponent } from '@geops/create-react-web-component';
import WebComponent from './WebComponent';

ReactWebComponent.setAttributes(WebComponent.attributes);
ReactWebComponent.setProperties(WebComponent.defaultProps);
ReactWebComponent.render(WebComponent, 'trafimage-maps', { shadow: false });
