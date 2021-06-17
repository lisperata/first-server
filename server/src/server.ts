import { createServer, IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import { parse, ParsedQuery } from "query-string";

const port = 4000;

const isPerson = (obj: any): boolean => {
  return obj.name.length > 0 && Date.parse(obj.date) > 0;
};

createServer((req: IncomingMessage, res: ServerResponse): void => {
  res.setHeader("content-type", "text/plain");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  switch (req.method) {
    case "POST":
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const person: ParsedQuery<string> = parse(body);
        if (
          typeof person.date === "string" &&
          typeof person.name === "string" &&
          isPerson(person)
        ) {
          const name = person.name[0].toUpperCase() + person.name.slice(1);
          const age =
            new Date().getFullYear() - new Date(person.date).getFullYear();
          const hello = `Hello! My name is ${name}! This year I am ${age} years old\n`;
          fs.appendFile("data.txt", hello, () => {
            res.statusCode = 200;
            res.end(`Data has been successfully written to file`);
          });
        } else {
          res.statusCode = 400;
          res.statusMessage = "Bad Request";
          res.end(`Error ${res.statusCode}. ${res.statusMessage}`);
        }
      });
      break;
    case "OPTIONS":
      res.statusCode = 200;
      res.end(`ok`);
      break;
    default:
      res.statusCode = 501;
      res.statusMessage = "Not Implemented";
      res.end(`Error ${res.statusCode}. ${res.statusMessage}`);
  }
}).listen(4000, () => console.log(`The server was opened on port ${port}`));
