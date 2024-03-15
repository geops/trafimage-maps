/*!
 * Caution! You should not edit this file.
 *
 * Running 'create-react-web-component --update' will replace this file.
 */

const { check } = require("prettier");

const overrideModule = (module) => {
  // We override css and scss rules to generate a string css instead of an object.
  // See the first <style> tag in the web-component.
  const ruleIndex = module.rules.length - 1;

  // We remove the auto svg loader to react component
  const svgRuleIndex = module.rules[ruleIndex].oneOf.findIndex((rule) =>
    ".svg".match(rule.test),
  );
  // eslint-disable-next-line no-param-reassign
  module.rules[ruleIndex].oneOf[svgRuleIndex].test = /^((?!url).)*\.svg$/;

  const cssRuleIndex = module.rules[ruleIndex].oneOf.findIndex((rule) =>
    ".css".match(rule.test),
  );
  const scssRuleIndex = module.rules[ruleIndex].oneOf.findIndex((rule) =>
    ".scss".match(rule.test),
  );

  if (cssRuleIndex !== -1) {
    // eslint-disable-next-line no-param-reassign
    module.rules[ruleIndex].oneOf[cssRuleIndex].use[0] = {
      loader: "to-string-loader",
    };
    // eslint-disable-next-line no-param-reassign
    module.rules[ruleIndex].oneOf[cssRuleIndex].use[1] = {
      loader: "css-loader",
      options: {
        // Needed until a new version of to-string-loader.
        // See https://github.com/gajus/to-string-loader/pull/20 and https://github.com/gajus/to-string-loader/issues/21
        esModule: false,
      },
    };
  }
  if (scssRuleIndex !== -1) {
    // eslint-disable-next-line no-param-reassign
    module.rules[ruleIndex].oneOf[scssRuleIndex].use[0] = {
      loader: "to-string-loader",
    };
    // eslint-disable-next-line no-param-reassign
    module.rules[ruleIndex].oneOf[scssRuleIndex].use[1] = {
      loader: "css-loader",
      options: {
        // Needed until a new version of to-string-loader
        // See https://github.com/gajus/to-string-loader/pull/20 and https://github.com/gajus/to-string-loader/issues/21
        esModule: false,
      },
    };
  }

  module.rules[ruleIndex].oneOf.push({
    test: /\.url\.svg$/,
    loader: "url-loader",
  });

  return module;
};

const overrideOutput = (output) => {
  return {
    ...output,
    filename: "bundle.js",
  };
};

const overrideOptimization = (optimization) => {
  return optimization;
};

const overridePlugins = (plugins) => {
  return plugins;
};

module.exports = function override(config, env) {
  const overridenConfig = {
    ...config,
    module: overrideModule(config.module),
    output: overrideOutput(config.output),
    optimization: overrideOptimization(config.optimization, env),
    plugins: overridePlugins(config.plugins, env),
  };

  return overridenConfig;
};
