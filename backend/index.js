const server = require('./server');
const { BACKEND_PORT } = require('./utils/config');
const { BACKEND_URL } = require('./utils/config');

server.listen(BACKEND_PORT, '0.0.0.0', () => {
    console.log(`Server running on ${BACKEND_URL}`)
});