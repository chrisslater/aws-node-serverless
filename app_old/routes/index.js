"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hello = require("./hello");
var users = require("./users");
exports.routes = [].concat.apply(hello.routes, users.routes);
//# sourceMappingURL=index.js.map