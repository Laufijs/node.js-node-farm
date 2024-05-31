const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");
const replaceTemp = require("./modules/replaceTemplate");
/////////////////////////////////////////////////////////////////////////////
//FILES
// Blocking  - Synchronous Way
// const textIn = fs.readFileSync("./input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about avocados, but I still prefer meat 🍖 : ${textIn}\nCreated on ${Date.now()}`;
// fs.writeFileSync("./output.txt", textOut);
// console.log(`File has been written.`);

//Non-Blocking - Asynchronous Way
// fs.readFile("./start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("File has been written.");
//       });
//     });
//   });
// });
// console.log("Will read the file...");
/////////////////////////////////////////////////////////////////////////////
//SERVER

//server
const server = http.createServer((request, response) => {
  const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
  const tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    "utf-8"
  );
  const tempCard = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    "utf-8"
  );
  const tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    "utf-8"
  );
  const dataObj = JSON.parse(data);

  const { query, pathname } = url.parse(request.url, true);
  // Overview / start page
  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, { "Content-Type": "text/html" });
    const cardsHtml = dataObj
      .map((elem) => replaceTemp(tempCard, elem))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    // console.log(cardsHtml);
    response.end(output);

    // product page
  } else if (pathname === "/product") {
    response.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemp(tempProduct, product);
    response.end(output);

    // application programming interface
  } else if (pathname === "/api") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(data);
    // 404, not foudn page
  } else {
    response.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "Hello World",
    });
    response.end("<h1>404 - Page not found!</h1>");
  }
});

server.listen(8000, "localhost", () => {
  console.log(`Server is running and listening for requests.`);
});
