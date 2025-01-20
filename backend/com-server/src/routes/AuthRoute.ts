import express from "express";
import {otp, institution_signup, institution_login, staff_login, staff_signup, refresh_token, logout } from "../controllers/auth_controllers/index.js";
import async_middleware from "../middlewares/AsyncMiddleware.js";

const route = express.Router();

route.post("/institution/signup", async_middleware(institution_signup));
route.post("/institution/login", async_middleware(institution_login));
route.post("/staff/signup", async_middleware(staff_signup));
route.post("/staff/login", async_middleware(staff_login));
route.post("/reset-password", async_middleware(otp));

route.get("/logout", async_middleware(logout));
route.get("/refresh_token", async_middleware(refresh_token));

export default route;

