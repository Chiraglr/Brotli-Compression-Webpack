Used react-app-rewired for configuring webpack to enable brotli compress for react's CRA.

The webpack configuration is added in config-overrides.js file. Gzip compression is used as fallback.

We can do npm start and check in the browser that some files are brotli compressed in the response headers.

Content-Encoding: br

which means brotli is used, else

Content-Encoding: gzip