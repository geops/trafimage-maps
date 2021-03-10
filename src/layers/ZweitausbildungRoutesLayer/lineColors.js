import touristicLine from './touristischeLinie.json';
import hauptLinie from './hauptLinie.json';

export const lines = { ...touristicLine, ...hauptLinie };

export const getLineColorExpr = (property) => {
  const singleLines = property === 'hauptlinie' ? hauptLinie : touristicLine;
  // Gte mapbox line-color expression:
  const expr = ['case'];
  Object.entries(singleLines).forEach(([key, { color }]) => {
    expr.push(['==', ['get', property], key]);
    expr.push(color);
  });
  expr.push('rgba(0, 0, 0, 0)');
  return expr;
};

export default {
  getLineColorExpr,
};
