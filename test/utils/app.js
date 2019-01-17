const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');

const services = require('./services');

const authentication = require('../../src/authentication');

const sequelize = require('../../src/sequelize');

const app = express(feathers());

app.configure(configuration());
app.configure(sequelize);
app.configure(authentication);
app.configure(services);

module.exports = app;
