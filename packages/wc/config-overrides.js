/* eslint-disable no-param-reassign */
/*!
 * Caution! You should not edit this file.
 *
 * Running 'create-react-web-component --update' will replace this file.
 */

const EventHooksPlugin = require('event-hooks-webpack-plugin');
const { PromiseTask } = require('event-hooks-webpack-plugin/lib/tasks');
const rimraf = require('rimraf');
const fs = require('fs');

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

const overrideModule = (module) => {
  // We override css and scss rules to generate a string css instead of an object.
  // See the first <style> tag in the web-component.
  const ruleIndex = 0;
  const cssRuleIndex = module.rules[ruleIndex].oneOf.findIndex((rule) =>
    '.css'.match(rule.test),
  );

  const scssRuleIndex = module.rules[ruleIndex].oneOf.findIndex((rule) =>
    '.scss'.match(rule.test),
  );

  if (cssRuleIndex !== -1) {
    module.rules[ruleIndex].oneOf[cssRuleIndex].use[0] = {
      loader: 'to-string-loader',
    };
    module.rules[ruleIndex].oneOf[cssRuleIndex].use[1] = {
      loader: 'css-loader',
      options: {
        // Needed until a new version of to-string-loader.
        // See https://github.com/gajus/to-string-loader/pull/20 and https://github.com/gajus/to-string-loader/issues/21
        esModule: false,
      },
    };
  }
  if (scssRuleIndex !== -1) {
    module.rules[ruleIndex].oneOf[scssRuleIndex].use[0] = {
      loader: 'to-string-loader',
    };
    module.rules[ruleIndex].oneOf[scssRuleIndex].use[1] = {
      loader: 'css-loader',
      options: {
        // Needed until a new version of to-string-loader
        // See https://github.com/gajus/to-string-loader/pull/20 and https://github.com/gajus/to-string-loader/issues/21
        esModule: false,
      },
    };
  }

  return module;
};

const overrideOutput = (output) => {
  const { checkFilename, ...newOutput } = output;

  return {
    ...newOutput,
    filename: 'bundle.js',
  };
};

const overrideOptimization = (optimization, env) => {
  const newOptions = optimization.minimizer[0].options;

  // newOptions.sourceMap = env === 'development';
  // optimization.minimizer[0].options = newOptions;

  return {
    ...optimization,
    splitChunks: false,
    runtimeChunk: false,
  };
};

const overridePlugins = (plugins) => {
  // HtmlWebpackPlugin
  plugins[0].userOptions.inject = 'head';
  return plugins;
};

const copyBundleScript = async (env) => {
  if (env !== 'production') {
    return;
  }

  if (!fs.existsSync('build')) {
    return;
  }

  fs.readdirSync('build').forEach((file) => {
    if (file !== 'bundle.js') {
      // rimraf.sync(`build/${file}`);
    }
  });
};
