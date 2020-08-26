const express = require("express");
const Task = require("../Modals/task");
const router = new express.Router();
const auth = require("../middleware/Auth");

router.post("/task", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    res.send(e);
  }
});

router.post("/task/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    //findinf task with user
    const task = await Task.findOne({ _id: _id, owner: req.user._id });
    if (!task) {
      return res.status(400).send();
    }
    res.send(task);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/task", auth, async (req, res) => {
  try {
    // const task=await Task.find({owner:req.user._id})
    await req.user.populate("task").execPopulate();
    res.send(req.user.task);
    console.log(req.user.task);
  } catch (error) {
    res.status(400).send(error);
  }
});

//update task

router.patch("/task/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowupdates = ["name"];
  const isvalid = updates.every((update) => allowupdates.includes(update));
  if (!isvalid) {
    return res.status(400).send({ error: "invalid update" });
  }
  try {
    const task = await Task.findOne({ id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
}); //delet task
router.delete("/task/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(400).send();
    }
    res.send(task);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
