// const {
//     override,
// } = require("customize-cra");
'use strict';

const fs = require('fs');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const zlib = require('zlib');
const expressStaticGzip = require("express-static-gzip");
  
//   module.exports = override(
//   );

module.exports = {
    // The Webpack config to use when compiling your react app for development or production.
    webpack: function(config, env) {
      // ...add your webpack config
      config.plugins.push(new CompressionPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      }));
      config.plugins.push(new CompressionPlugin({
        filename: "[path][base].br",
        algorithm: "brotliCompress",
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        // threshold: 10240,
        minRatio: 1,
      }));
      return config;
    },
    devServer: function(configFunction) {
        // Return the replacement function for create-react-app to use to generate the Webpack
        // Development Server config. "configFunction" is the function that would normally have
        // been used to generate the Webpack Development server config - you can use it to create
        // a starting configuration to then modify instead of having to create a config from scratch.
        return function(proxy, allowedHost) {
          // Create the default config by calling configFunction with the proxy/allowedHost parameters
          const config = configFunction(proxy, allowedHost);
     
          // Change the https certificate options to match your certificate, using the .env file to
          // set the file paths & passphrase.
        //   const fs = require('fs');
        //   config.https = {
        //     key: fs.readFileSync(process.env.REACT_HTTPS_KEY, 'utf8'),
        //     cert: fs.readFileSync(process.env.REACT_HTTPS_CERT, 'utf8'),
        //     ca: fs.readFileSync(process.env.REACT_HTTPS_CA, 'utf8'),
        //     passphrase: process.env.REACT_HTTPS_PASS
        //   };
     
          // Return your customised Webpack Development Server config.
          console.log(config);
          config.before = (app, server) => {
            // Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
            // middlewares before `redirectServedPath` otherwise will not have any effect
            // This lets us fetch source contents from webpack for the error overlay
            app.use(
              expressStaticGzip("build", {
                enableBrotli: true
              })
            );
            app.use(evalSourceMapMiddleware(server));
            // This lets us open files from the runtime error overlay.
            app.use(errorOverlayMiddleware());
      
            // if (fs.existsSync(paths.proxySetup)) {
            //   // This registers user provided middleware for proxy reasons
            //   require(paths.proxySetup)(app);
            // }
          };
          return config;
        //   return {
        //       ...config,
        //       before(app, server) {
        //         // Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
        //         // middlewares before `redirectServedPath` otherwise will not have any effect
        //         // This lets us fetch source contents from webpack for the error overlay
        //         app.use(
        //           expressStaticGzip("build", {
        //             enableBrotli: true
        //           })
        //         );
        //         app.use(evalSourceMapMiddleware(server));
        //         // This lets us open files from the runtime error overlay.
        //         app.use(errorOverlayMiddleware());
          
        //         if (fs.existsSync(paths.proxySetup)) {
        //           // This registers user provided middleware for proxy reasons
        //           require(paths.proxySetup)(app);
        //         }
        //       },
        //     };
        };
      },
      paths: function(paths, env) {
        // ...add your paths config
        // console.log(paths);
        return paths;
      },
};