"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = require("express");
const route = (0, express_1.Router)();
exports.route = route;
route.get('/', (req, res) => {
    res.json({ message: 'hello world with Typescript' });
});
