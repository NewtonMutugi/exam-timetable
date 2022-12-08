const { getCourses, getSheets } = require("./models/tables");
const http = require("http");
const bodyParser = require("body-parser");

const express = require("express");
const path = require("path");

const app = express();

const server = http.createServer(app);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", async (req, res, next) => {
  res.render("index", {
    docTitle: "My - Exam Timetable",
    path: "/",
    input: "",
    campus_choice: "CAMPUS",
    sheets: await getSheets(),
    items_list: [],
  });
});

app.post("/search", async (req, res, next) => {
  const { courses, campus_choice } = req.body;
  let mySheets = await getSheets();
  res.render("index", {
    docTitle: "My - Exam Timetable",
    path: "/",
    input: courses,
    campus_choice: mySheets[campus_choice] || mySheets[0],
    sheets: mySheets,
    items_list: await getCourses(
      courses.split(/[, ]+/),
      parseInt(campus_choice) + 1
    ),
  });
});

app.use((req, res, next) => {
  res
    .status(404)
    .render("404", { docTitle: "404 Page Not Found Error", path: "/404" });
});

// var options = {
//   method: "POST",
//   hostname: "emailapi.netcorecloud.net",
//   port: null,
//   path: "/v5/mail/send",
//   headers: {
//     api_key: "3b9f966442a92852d97294e0809a1e16",
//     "content-type": "application/json",
//   },
// };

// var req = http.request(options, function (res) {
//   var chunks = [];

//   res.on("data", function (chunk) {
//     chunks.push(chunk);
//   });

//   res.on("end", function () {
//     var body = Buffer.concat(chunks);
//     console.log(body.toString());
//   });
// });

// req.write(
//   JSON.stringify({
//     from: {
//       // email: "info@fixafrica.co.ke",
//       email: "support@kimworks.buzz",
//       name: "Flight confirmation",
//     },
//     subject: "Your Barcelona flight e-ticket : BCN2118050657714",
//     content: [
//       {
//         type: "html",
//         value: "Hello Lionel, Your flight for Barcelona is confirmed.",
//       },
//     ],
//     personalizations: [
//       { to: [{ email: "jhnmuinde@gmail.com", name: "Lionel Messi" }] },
//     ],
//   })
// );
// req.end();
// (async ()=>{
//   console.log(JSON.parse((await Database.getOneSession({session_id: 1}))[0].coordinates))
// })()

server.listen(3000);

// process.on("unhandledRejection", (err) => {
//   console.log(`An error occurred: ${err.message}`);
//   // server.close(() => process.exit(1));
// });
