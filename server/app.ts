import http, { IncomingMessage, Server, ServerResponse } from "http";
import companyController from "./controller/companyController";
import path from "path";

console.log(path.resolve(".", "./lib/database/database.json"))
const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    switch (req.method) {
      case "GET":
        companyController.getCompany(req, res);
        break;
      case "POST":
        companyController.addCompany(req, res);
        break;
      case "PUT":
        companyController.updateCompany(req, res);
        break;
      case "DELETE":
        companyController.deleteCompany(req, res);
        break;
      default:
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "Bad request",
            message: "Your request can't be processed by this server.",
          })
        );
    }
  }
);
const serverPort = 3000;
server.listen(serverPort, () => {
  console.log(`Server is listening on port ${serverPort}`);
});
