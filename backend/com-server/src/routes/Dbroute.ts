import express from "express";
import async_middleware from "../middlewares/AsyncMiddleware.js";

const route = express.Router();

route.post("/author-update", async_middleware(otp));

export default route;
