"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const companyController_1 = __importDefault(require("./controller/companyController"));
const path_1 = __importDefault(require("path"));
console.log(path_1.default.resolve(".", "./lib/database/database.json"));
const server = http_1.default.createServer((req, res) => {
    switch (req.method) {
        case "GET":
            companyController_1.default.getCompany(req, res);
            break;
        case "POST":
            companyController_1.default.addCompany(req, res);
            break;
        case "PUT":
            companyController_1.default.updateCompany(req, res);
            break;
        case "DELETE":
            companyController_1.default.deleteCompany(req, res);
            break;
        default:
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({
                status: "Bad request",
                message: "Your request can't be processed by this server.",
            }));
    }
});
const serverPort = 3000;
server.listen(serverPort, () => {
    console.log(`Server is listening on port ${serverPort}`);
});
