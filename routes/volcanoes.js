var express = require("express");
var router = express.Router();

/* GET volcanoes listing. */
router.get("/", async (req, res, next) => {
  if (req.query === undefined) return;
  let { country, populatedWithin, ...rest } = req.query;
  const pop = ["5km", "10km", "30km", "100km"];

  if (req.query && country && JSON.stringify(rest).length <= 2) {
    if (!populatedWithin) {
      const all = await req
        .db("data")
        .where("country", country)
        .orderBy("id", "asc");
      res.status(200).json(all);
      return;
    } else {
      for (var i = 0; i < 4; i++) {
        if (populatedWithin === pop[i]) {
          console.log(pop[i]);
          let result = await req
            .db("data")
            .where("country", country)
            .andWhere(`population_${pop[i]}`, ">", "0")
            .orderBy("id", "asc");

          res.status(200).json(result);
          return;
        }
      }
    }
  } else {
    res.status(400).json({
      error: true,
      message: "Country is a required query parameter.",
    });
    return;
  }
});

module.exports = router;
