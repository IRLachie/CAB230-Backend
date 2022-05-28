var express = require("express");
var router = express.Router();

/* GET volcanoes listing. */
router.get("/", async (req, res, next) => {
  if (req.query === undefined) return;
  //Deconstruction of req.query
  let { country, populatedWithin, ...rest } = req.query;
  //Population fields
  const pop = ["5km", "10km", "30km", "100km"];

  if (req.query && country && JSON.stringify(rest).length <= 2) {
    if (!populatedWithin) {
      /*/ SELECT * FROM data WHERE country = req.query.country ORDER BY id ASC /*/
      const all = await req
        .db("data")
        .where("country", country)
        .orderBy("id", "asc");

      //Send a status of 200 (OK) and output an error
      res.status(200).json(all);
      return;
    } else {
      for (var i = 0; i < 4; i++) {
        if (populatedWithin === pop[i]) {
          console.log(pop[i]);

          /*/ SELECT * FROM data WHERE country = req.query.country AND population_$[5km, 10km, 30km, 100km] ORDER BY id ASC /*/
          let result = await req
            .db("data")
            .where("country", country)
            .andWhere(`population_${pop[i]}`, ">", "0")
            .orderBy("id", "asc");

          //Send a status of 200 (OK) and output the query
          res.status(200).json(result);
          return;
        }
      }
    }
  } /* Either the query was empty, country was undefined, or an unknown parameter was enetered */ else {
    //Send a status of 400 (Bad Request) and output an error
    res.status(400).json({
      error: true,
      message: "Country is a required query parameter.",
    });
    return;
  }
});

module.exports = router;
