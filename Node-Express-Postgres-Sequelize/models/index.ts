'use strict';

import fs from 'fs';
import path from 'path';
import {Sequelize, DataTypes} from 'sequelize';
import process from 'process';
import dotenv from "dotenv"

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// import config from `${__dirname}/../config/config.json`[env];
const config = require(__dirname + '/../config/config.js')[env];

dotenv.config()
const _env: any = process.env
const db: any = {};

console.log('enviroment',_env.NODE_ENV)

let sequelize: any;
if (config.use_env_variable) {
  sequelize = new Sequelize(_env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
