/* eslint-disable */
if (!Array.prototype.flat)
  Array.prototype.flat = function() {
    return (function f(arr) {
      return arr.reduce(
        (a, v) => (Array.isArray(v) ? a.concat(f(v)) : a.concat(v)),
        [],
      );
    })(this);
  };
