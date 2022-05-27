const express = require("express");
const { referrerPolicy } = require("helmet");
const router = express.Router();
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

/* GET home page. */ /*
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});*/
router.use("/", swaggerUI.serve);
router.get("/", swaggerUI.setup(swaggerDocument));

module.exports = router;
