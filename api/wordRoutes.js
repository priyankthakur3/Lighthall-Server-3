const express = require("express");
const {
  checkStringArray,
  isStringName,
  checkString,
  checkId,
} = require("./validations");

const wordData = require("./wordData");
const router = express.Router();

router.route("/:id").get(async (req, res) => {
  let id;
  try {
    id = checkId(req.params.id);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    let word = await wordData.getByID(id);
    return res.json(word);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/init", async (req, res) => {
  let words;
  if (req.body.words)
    try {
      words = checkStringArray(req.body.words, "Words");
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  try {
    let taskObj = await wordData.initWords(undefined);
    return res.json(taskObj);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/getTopicWord", async (req, res) => {
  let topic;
  try {
    topic = isStringName(req.query.topic, "Topic Name");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  try {
    let word = await wordData.getTopicWord(topic);
    word.word = word.word.toLowerCase();
    return res.json({ word });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/gettopic", async (req, res) => {
  try {
    let topicList = await wordData.getTopics();
    return res.json({ totalTopics: topicList.length, topicList });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/getaword", async (req, res) => {
  let word = await wordData.getRandomWord();
  word.word = word.word.toLowerCase();
  res.json(word);
});

router.post("/shareword", async (req, res) => {
  let word;
  try {
    word = checkString(req.body.word);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    let createdWord = await wordData.pushWord(word);
    if (createdWord) return res.json(createdWord);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;
