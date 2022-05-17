const redis = require('redis');
const redisClient = redis.createClient();

redisClient.on('connect', () => console.log('Connected to Redis!'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

exports.redisClient = redisClient;