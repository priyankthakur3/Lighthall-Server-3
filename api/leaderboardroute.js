const { Router } = require("express");
const { users } = require("./mongoCollections");

const router = Router();

router.get("/", async (req, res) => {
  let usersCollection = await users();
  let allUsers = await usersCollection
    .aggregate([
      {
        $project: {
          _id: 0,
          username: 1,
          totalWins: {
            $sum: {
              $map: {
                input: "$gameStatus",
                as: "game",
                in: {
                  $cond: {
                    if: { $eq: ["$$game.gamestatus", "won"] },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          },
          totalLosses: {
            $sum: {
              $map: {
                input: "$gameStatus",
                as: "game",
                in: {
                  $cond: {
                    if: { $eq: ["$$game.gamestatus", "lost"] },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          },
        },
      },
    ])
    .toArray();
  console.log(allUsers);
  return res.json(allUsers);
});
module.exports = router;
