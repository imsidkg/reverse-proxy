"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const httpServer = http_1.default.createServer((req, res) => {
    res.end("hello from http server");
});
httpServer.listen(3000, () => console.log("listening on port 3000"));
