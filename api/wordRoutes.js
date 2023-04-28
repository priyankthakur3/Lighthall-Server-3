const express = require("express");
const wordData = require("./wordData");
const { checkStringArray, isStringName } = require("./validations");
const router = express.Router();

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
    topic = isStringName(req.body.topic, "Topic Name");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  try {
    let word = await wordData.getTopicWord(topic);
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
  res.json(word);
});
module.exports = router;
