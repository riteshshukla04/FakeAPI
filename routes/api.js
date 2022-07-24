const router = require("express").Router();
const apiModel = require("../models/models");
const bodyParser = require("body-parser");
const ExcelParser = require("../Helpers/ExcelParser");
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

router.post("/excel",jsonParser,async (req,res)=>{
  try {
    
    if(!req.files){
      return res.status(400).send("No file uploaded")
    }
    let data=ExcelParser(req.files.file.tempFilePath);
    const resp = await apiModel.findOne({ key: req.body.key });
    console.log(req.body.key);
    if (resp) {
      await apiModel.updateOne(
        { key: req.body.key },
        {
          data: JSON.stringify(data),
        }
      );
      return res.send(resp);
    }

    const apiData = new apiModel({
      data: JSON.stringify(data),
      key: req.body.key,
    });

    const savedData = await apiData.save();
    res.send(savedData);
  } catch (err) {
    res.status(400).send(err);
  }
});


router.get("/excel/:id", urlencodedParser, async (req, res) => {
  
  
  const resp=await apiModel.exists({ key: req.params.id });
  if(!resp){
    return res.status(400).send("Not Found");
  }
  try {
  const apiData = apiModel.findOne({ key: req.params.id }, (err, data) => {
    if (err) {
      return res.status(400).send("Done");
    }
    res.status(200).send(JSON.parse(data.data))
    
  });
} catch (err) {
  res.status(400).send(err);
}
});


router.get("/:id", urlencodedParser, async (req, res) => {
  
  
    const resp=await apiModel.exists({ key: req.params.id });
    if(!resp){
      return res.status(400).send("Not Found");
    }
    try {
    const apiData = apiModel.findOne({ key: req.params.id }, (err, data) => {
      if (err) {
        return res.status(400).send("Done");
      }
      let s=data.data
      let t=""
      if(s.includes("<div>")||s.includes("<html>")||s.includes("<body>")||s.includes("<input>")){
        t=s
      }
      else{
        t=s.replace(/(?:\r\n|\r|\n)/g, '<br>');

      }
      
      res.send(t);
      
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
