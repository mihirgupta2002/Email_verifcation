const express = require('express');
const path = require('path');
const cors= require('cors');
const { error } = require('console');
const server= express();
server.use(cors());

server.use(express.json());

const email_routes= require('./routes/email_veri')

const port = 3000;
// server.use(cors({ origin: 'http://dev.smart24x7.com:5173' })); // Allow requests from this origin
server.use("/",email_routes);
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
