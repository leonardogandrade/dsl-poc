const express = require('express');
const server = express();

server.listen(process.env.PORT || 3007);
console.log("server is listen on port 3007.");
