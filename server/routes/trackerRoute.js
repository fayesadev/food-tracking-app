const express = require("express");
const router = express.Router();
const db = require("../db/connection");
const axios = require("axios");
require("dotenv").config();

router.get("/", (req, res) => {
  console.log("getting data!");

  const foodQueryStr = `
    SELECT *
    FROM foods
    `;

  db.query(foodQueryStr)
    .then((result) => {
      const data = result.rows;
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
    });
});


router.post("/food-log", (req, res) => {
  console.log("receiving data...")


  const logQueryStr = `
    INSERT INTO food_logs (food_id, user_id, meal_id)
    VALUES ($1, $2, $3)
    `;

  
  console.log("req.body", req.body);
  const values = [req.body.food_id, req.body.user_id, req.body.meal_id]

  console.log("values", values);

  db.query(logQueryStr, values)
  .then((res) => {
    console.log("logQueryResult", res.rows)
    return res;
  })
  .catch((err) => {
    console.log(err.message);
  })

  db.query(logQueryStr, [console.log(req.body)]).then((res) => {});
});

// submit intuitive log to database
router.post("/hunger", (req, res) => {
  const hungerQueryStr = `
  UPDATE food_logs
  SET
    hunger_before = $1
    hunger_after = $2
  WHERE id = 1
  AND meal_id = $3
  `;
  db.query(hungerQueryStr, [req.body])
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
});


module.exports = router;
