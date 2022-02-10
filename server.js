const express = require('express');
const { Client } = require('pg');
const client = new Client('postgres://localhost/acme_user_places_db');
const morgan = require('morgan');
const app = express();

const getUsers = async () => {
  return (await client.query(`SELECT * FROM "User";`)).rows;
};

const getPlaces = async () => {
  return (await client.query(`SELECT * FROM "Place";`)).rows;
};

const createUser = async ({ name }) => {
  return (
    await client.query(`INSERT INTO "User" (name) VALUES ($1) RETURNING *;`, [
      name,
    ])
  ).rows[0];
};

const deleteUser = async (id) => {
  await client.query(`DELETE FROM "User" WHERE id = $1`, [id]);
};

const syncAndSeed = async () => {
  const SQL = `
  DROP TABLE IF EXISTS "User";
  CREATE TABLE "User"(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
  );
  DROP TABLE IF EXISTS "Place";
  CREATE TABLE "Place"(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
  );
  INSERT INTO "User"(name) VALUES('moe');
  INSERT INTO "User"(name) VALUES('lucy');
  INSERT INTO "User"(name) VALUES('ethyl');
  INSERT INTO "Place"(name) VALUES('NYC');
  INSERT INTO "Place"(name) VALUES('Chicago');
  INSERT INTO "Place"(name) VALUES('Boston');
  INSERT INTO "Place"(name) VALUES('Paris');
  `;
  await client.query(SQL);
};

const PORT = 3000;

const init = async () => {
  try {
    await client.connect();
    await syncAndSeed();
    //const curly = await createUser({ name: 'curly' });
    console.log(await getUsers());
    console.log(await getPlaces());
    //await deleteUser(curly.id);
    console.log(await getUsers());
    console.log('no errors kappa');
    app.listen('PORT', () => {
      console.log(`Glistening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

init();
