const router = require("express").Router();
const apiModel = require("../models/models");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

function isJson(item) {
  item = typeof item !== "string" ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === "object" && item !== null) {
    return true;
  }

  return false;
}

router.post("/getRequest", jsonParser, async (req, res) => {
  try {
    s = req.body.data;

    if (isJson(req.body.data)) {
      s = JSON.stringify(req.body.data);
    }
    const resp = await apiModel.findOne({ key: req.body.key });
    if (resp) {
      await apiModel.updateOne(
        { key: req.body.key },
        {
          data: s,
        }
      );
      return res.send(resp);
    }

    const apiData = new apiModel({
      data: s,
      key: req.body.key,
    });

    const savedData = await apiData.save();
    res.send(savedData);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/:id", urlencodedParser, async (req, res) => {
  
  
    const resp=await apiModel.exists({ key: req.params.id });
    console.log(resp);
    if(!resp){
      return res.status(400).send("Not Found");
    }
    try {
    const apiData = apiModel.findOne({ key: req.params.id }, (err, data) => {
      if (err) {
        return res.status(400).send("Done");
      }
      res.send(data.data);
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
