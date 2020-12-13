const http = require("http");
const https = require("https");
const unzipper = require("unzipper");
const qs = require("querystring");
const url = require("url");

// https://github.com/login/oauth/access_token
function getToken(code, callback) {
  const request = https.request(
    {
      hostname: "github.com",
      path: `/login/oauth/access_token?code=${code}&client_id=Iv1.842eb2c303494f2a&client_secret=a897b47c80d70012d8eba5e2ab7210bb864f3563`,
      port: 443,
      method: "POST",
    },
    (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk.toString();
      });
      res.on("end", (chunk) => {
        callback(qs.parse(body));
      });
    }
  );

  request.end();
}

function auth(request, response) {
  const params = url.parse(request.url, true).query;
  getToken(params.code, (info) => {
    // response.write(JSON.stringify(info));
    response.write(`<a href="http://localhost:8083/?token=${info.access_token}">publish</a>`);
    response.end();
  });
}
function publish(request, response) {
  const params = url.parse(request.url, true).query;

  if (params.token)
    getUser(params.token, (info) => {
      console.log(typeof info);
      //   if (info.login == "blancokitsune") {
      request.pipe(unzipper.Extract({ path: "../server/public/" }));
      request.on("end", () => {
        response.end("发布成功");
      });
      //   }
    });
}
function getUser(token, callback) {
  const request = https.request(
    {
      hostname: "api.github.com",
      path: `/user`,
      port: 443,
      headers: {
        Authorization: `token ${token}`,
        "User-Agent": "kitsune-publish",
      },
    },
    (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk.toString();
      });
      res.on("end", (chunk) => {
        callback(qs.parse(body));
      });
    }
  );

  request.end();
}

http
  .createServer((req, res) => {
    if (req.url.match(/^\/auth/)) {
      return auth(req, res);
    }
    if (req.url.match(/^\/publish/)) {
      return publish(req, res);
    }
  })
  .listen(8888);
