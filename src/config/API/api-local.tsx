const protocol = `${process.env.REACT_APP_PROTOCOL}`;
const host = `${process.env.REACT_APP_HOST}`;
const port = `${process.env.REACT_APP_PORT}`;
const trailUrl = `${process.env.REACT_APP_TRAIL_URL}`;

const hostUrl = `${protocol}://${host}${port ? ':' + port : ''}/`;
const endpoint = `${protocol}://${host}${(port ? ':' + port : '')}/${trailUrl}`;

export default {
    protocol: protocol,
    host: host,
    port: port,
    apiUrl: trailUrl,
    endpoint: endpoint,
    hostUrl: hostUrl,
};

