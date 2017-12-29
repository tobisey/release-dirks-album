var redis = require('redis');
var client = redis.createClient({
    host: 'localhost',
    port: 6379
});

client.on('error', function(err) {
    console.log(err);
});

exports.get = function(key) {
    return new Promise(function(resolve, reject) {
        client.get(key, function(err, data) {
            if (err) {
                reject(err)
            } else {
                console.log(data);
                resolve(JSON.parse(data));
            }
        })
    })
}

exports.setex = function(key, expiry, val) {
    return new Promise(function(resolve, reject) {
        client.setex(key, expiry, JSON.stringify(val), function(err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data);
            }
        })
    })
}

exports.flushdb = function() {
    client.flushdb( function (err, succeeded) {
        console.log('flushed', succeeded); // will be true if successfull
    });
}
