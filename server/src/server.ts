import { createServer, IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import { parse, ParsedQuery } from "query-string";
import variables from "./infrastructureVariables";

const getNameWithCapitalLetter = (name: string): string => {
  return name[0].toUpperCase() + name.slice(1);
};

const getAgeByDateOfBirth = (date: string): number => {
  return new Date().getFullYear() - new Date(date).getFullYear();
};

createServer((req: IncomingMessage, res: ServerResponse): void => {
  res.setHeader("content-type", "text/plain");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  if (req.method != "POST") {
    return res.writeHead(403, "Forbidden").end(`Error 403. Forbidden`);
  }
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    const person: ParsedQuery<string> = parse(body);
    if (
      !person.date ||
      !person.name ||
      isNaN(Date.parse(person.date.toString()))
    ) {
      return res.writeHead(400, "Bad Request").end(`Error 400. Bad Request`);
    }
    const name = getNameWithCapitalLetter(person.name.toString());
    const age = getAgeByDateOfBirth(person.date.toString());
    const hello = `Hello! My name is ${name}! This year I am ${age} years old\n`;
    fs.appendFile("data.txt", hello, () => {
      res
        .writeHead(200, "Ok")
        .end(`Data has been successfully written to file`);
    });
  });
}).listen(4000, () =>
  console.log(`The server was opened on port ${variables.port}`)
);
