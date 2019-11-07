#

Trafimage maps are used to illustrate a whole range of topics relating to public transport ([more information](https://www.sbb.ch/en/bahnhof-services/bahnhoefe/karten-bahnhofplaene/trafimage-karten.html)).
This section shows you how to configure your own map for integrating it in your existing web page.

```jsx

window.addEventListener('load', () => {  
  const trafimage = document.getElementById('webcomponent');
  trafimage.elements = {
    footer: true,
    header: true,
    mapControls: true,
    menu: true,
    popup: true,
  };
  trafimage.setAttribute('width', '99%');
});

<div style={{ position: 'relative', width: '100%', height: 500 }}>
  <trafimage-maps id='webcomponent'></trafimage-maps>
</div>
```
