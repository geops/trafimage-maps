Trafimage maps are used to illustrate a whole range of topics relating to public transport ([more information](https://company.sbb.ch/en/sbb-as-business-partner/services/trafimage-maps-and-station-plans.html)).
This section shows you how to configure your own map for integrating it in your existing web page.

```jsx
import 'trafimage-maps';
import React from 'react';

const App = () => {
  return (
    <div className="container">
      <trafimage-maps
        zoom="7"
        apiKey={apiKey}
        embedded="true"
        elements="permalink=false"
      />
    </div>
  );
};

<App />;
```
