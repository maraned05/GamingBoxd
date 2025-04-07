const server = require('./server');
const { BACKEND_PORT } = require('./config');
const { BACKEND_URL } = require('./config');

server.listen(BACKEND_PORT, BACKEND_URL, () => {
    console.log(`Server running on ${BACKEND_URL}:${BACKEND_PORT}`)
});