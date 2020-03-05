// define URL.createObjectURL if not defined
if (typeof global.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', {
    value: () => {},
  });
}
