const { ObjectId } = require("mongodb");
const { users } = require("./mongoCollections");
const validations = require("./validations");
const bcrypt = require("bcrypt");
const passwordEncryptRounds = 10;

const exportedMethods = {
  async createUser(username, password) {
    username = validations.isStringName(username, "User Name");
    password = validations.checkString(password, "Password");
    let hashpassword = await bcrypt.hash(password, passwordEncryptRounds);
    const usersCollection = await users();
    let newUser = {
      username,
      password: hashpassword,
      words: [],
      gameStatus: [],
    };
    let userInsertedInfo = await usersCollection.insertOne(newUser);
    if (!userInsertedInfo.acknowledged || !userInsertedInfo.insertedId)
      throw new Error(`Could not Create User`);

    return {
      usercreated: true,
    };
  },

  async logGameStatus(userid, gamestatus, timeTaken, wrongAttempts) {
    userid = validations.checkId(userid, "User ID");
    gamestatus = validations.checkGameStatus(gamestatus);
    timeTaken = validations.checkisNumber(timeTaken);
    wrongAttempts = validations.checkisNumber(wrongAttempts);
    let usersCollection = await users();
    let dbUser = await usersCollection.findOne(
      { _id: new ObjectId(userid) },
      { projection: { _id: 1, username: 1, password: 1 } }
    );
    if (!dbUser) throw new Error(`No User Exists for ID ${userid}`);

    let newGame = {
      _id: new ObjectId(),
      gamestatus,
      timeTaken,
      wrongAttempts,
    };

    let dbUserInfo = await usersCollection.updateOne(
      {
        _id: new ObjectId(userid),
      },
      {
        $push: { gameStatus: newGame },
      }
    );

    if (!dbUserInfo.acknowledged) throw new Error(`Error Creating new Game`);

    return { inserted: true };
  },

  async checkUser(username, password) {
    username = validations.isStringName(username, "User Name");
    password = validations.checkString(password);
    const usersCollection = await users();

    let dbUser = await usersCollection.findOne(
      { username },
      { projection: { _id: 1, username: 1, password: 1 } }
    );
    if (!dbUser) throw new Error(`Either email or password is invalid`);

    if (!(await bcrypt.compare(password, dbUser.password)))
      throw new Error(`Either email or password is invalid`);
    return {
      _id: dbUser._id.toString(),
      username: dbUser.username,
    };
  },

  async getUserGameStatus(userid) {
    userid = validations.checkId(userid, "User ID");
    const usersCollection = await users();

    let dbUser = await usersCollection.findOne(
      { username },
      { projection: { _id: 1, games: 1 } }
    );
    if (!dbUser) throw new Error(`No User Exists for ID ${userid}`);

    return dbUser.games;
  },
  async checkIfUserExists(username) {
    username = validations.isStringName(username, "User Name");

    const usersCollection = await users();
    let dbUser = await usersCollection.findOne(
      { username },
      { projection: { _id: 1, username: 1 } }
    );
    if (dbUser) return true;
    return false;
  },
};

module.exports = exportedMethods;
