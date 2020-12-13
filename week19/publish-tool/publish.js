const http = require("http");
const fs = require("fs");
const archiver = require("archiver");
const child_process = require("child_process");
const url = require("url");

child_process.exec(`start https://github.com/login/oauth/authorize?client_id=Iv1.842eb2c303494f2a`);

http
  .createServer((request, response) => {
    const params = url.parse(request.url, true).query;
    publish(params.token);
  })
  .listen(8083);

function publish(token) {
  const request = http.request({
    // hostname: "192.168.0.101",
    hostname: "127.0.0.1",
    path: `/publish?token=${token}`,
    port: 8888,
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });

  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  archive.directory("./sample/");
  archive.finalize();
  archive.pipe(request);
}

// fs.stat("./sample.html", (err, stats) => {
//   const request = http.request({
//     hostname: "192.168.0.101",
//     // hostname: "127.0.0.1",
//     port: 8888,
//     method: "POST",
//     headers: {
//       "Content-Type": "application/octet-stream",
//       // "Content-Length": stats.size,
//     },
//   });

//   const archive = archiver("zip", {
//     zlib: { level: 9 },
//   });

//   archive.directory("./sample/");
//   archive.finalize();
//   archive.pipe(request);
// });
