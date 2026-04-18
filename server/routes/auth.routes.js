const express = require("express");
const router = express.Router();
const { register, login, me, dashboard } = require("../controllers/auth.controllers");
const auth = require("../middleware/auth.middleware");
const verifyCaptcha = require("../middleware/captcha.middleware");

router.post("/register", verifyCaptcha, register);
router.post("/login", verifyCaptcha, login);
router.get("/me", auth, me);
router.get("/dashboard", auth, dashboard);

module.exports = router;