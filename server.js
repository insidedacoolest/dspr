// Custom entry point for hosts that run Node.js apps via Phusion Passenger
// (e.g. cPanel "Setup Node.js App"), which expect a single JS file that
// binds an HTTP server to the port the host assigns via process.env.PORT.
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`> Akina Motorsport ready on port ${port} (${dev ? "development" : process.env.NODE_ENV})`);
  });
});
