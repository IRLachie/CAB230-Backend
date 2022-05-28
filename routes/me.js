var express = require("express");
var router = express.Router();

/* GET me listing. */
router.get("/", async (req, res, next) => {
  /* posts my name and student number for marking purposes */
  res.status(200).json({
    name: "Lachlan Munt",
    student_number: "n10510192",
  });
});

module.exports = router;
