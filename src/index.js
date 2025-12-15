import "react-app-polyfill/stable";
import ReactWebComponent from "@geops/create-react-web-component";
import WebComponent from "./WebComponent";

ReactWebComponent.setAttributes(WebComponent.attributes);
ReactWebComponent.setProperties(WebComponent.defaultProps);
ReactWebComponent.render(WebComponent, "trafimage-maps", { shadow: false });
