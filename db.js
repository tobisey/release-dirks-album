var spicedPg = require('spiced-pg');
var db;
// var secrets = require('./secrets.json')

//BCRYPT
const bcrypt = require('bcryptjs');

// var db = spicedPg(`postgres:${secrets.username}:${secrets.password}@localhost:5432/signatures`);
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL)
} else {
    var secrets = require('./secrets.json');
    db = spicedPg(`postgres:${secrets.username}:${secrets.password}@localhost:5432/signatures`);
}
// var dbUrl = process.env.DATABASE_URL || `postgres:${secrets.username}:${secrets.password}@localhost:5432/signatures`;

//======================================================================

function register(first, last, email, password) {
    return db.query(
        'INSERT INTO users (first, last, email, password) VALUES (LOWER($1), LOWER($2), $3, $4) RETURNING id',
        [first, last, email, password]
    ).then((results) => {
        console.log('added user to database');
        return results.rows[0].id;
    }).catch((err) => {
        console.log(err);
        throw(err);
    });
}

exports.register = register;

//======================================================================

function signPetition(userId, signature) {
    return db.query(
        'INSERT INTO signatures (user_id, signature) VALUES ($1, $2)',
        [userId, signature]
    ).then((results) => {
        console.log('added signature to database');
    }).catch((err) => {
        console.log(err);
    });
}

exports.signPetition = signPetition;

//======================================================================

function getNames() {
    return db.query(`SELECT users.first AS first_name, users.last AS last_name, user_profiles.age AS age, user_profiles.city AS city, user_profiles.homepage AS homepage
                     FROM users
                     LEFT JOIN user_profiles
                     ON users.id = user_profiles.user_id`).then((results) => {
        return results.rows;
    }).catch((err) => {
        console.log(err);
    })
}

exports.getNames = getNames;

//======================================================================

function getNamesFromCity(location) {
    return db.query(`SELECT users.first AS first_name, users.last AS last_name, user_profiles.age AS age, user_profiles.homepage AS homepage
                     FROM users
                     LEFT JOIN user_profiles
                     ON users.id = user_profiles.user_id
                     WHERE user_profiles.city = $1`,
                     [location]
                    ).then((results) => {
                        console.log(results.rows);
        return results.rows;
    }).catch((err) => {
        console.log(err);
    })
}

exports.getNamesFromCity = getNamesFromCity;

//======================================================================

function resetDB() {
    db.query('DELETE FROM signatures').then(() => {
        console.log('signatures database reset');
    }).catch((err) => {
        console.log(err);
    });

    db.query('DELETE FROM users').then(() => {
        console.log('users database reset');
    }).catch((err) => {
        console.log(err);
    })

    db.query('DELETE FROM user_profiles').then(() => {
        console.log('user profiles database reset');
    }).catch((err) => {
        console.log(err);
    })
}

exports.resetDB = resetDB;

//======================================================================

function getSigImage(id) {
return db.query(`SELECT signature FROM signatures WHERE user_id = $1`,
                [id]
                ).then((results) => {
        return results.rows[0].signature;
    }).catch((err) => {
        throw(err);
    })
}

exports.getSigImage = getSigImage;

//======================================================================

function checkValues() {
    return db.query('SELECT * FROM users').then((results) => {
        return results.rows;
    }).catch((err) => {
        console.log(err);
    });
}

exports.checkValues = checkValues;

//======================================================================

function hashPassword(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

exports.hashPassword = hashPassword;

//======================================================================

function checkPassword(textEnteredInLoginForm, hashedPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPassword, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
}

exports.checkPassword = checkPassword;

//======================================================================

function getInfo(email) {
    return db.query('SELECT id, first, last, email, password FROM users WHERE email = $1', [email]).then((info) => {
        return info.rows[0];
    }).catch((err) => {
        console.log(err);
    });
}

exports.getInfo = getInfo;

//======================================================================

function createUserProfile(userId, age, city, homepage) {
    return db.query('INSERT INTO user_profiles (user_id, age, city, homepage) VALUES ($1, $2, LOWER($3), $4)',
        [userId, age || null, city, homepage]
    ).catch((err) => {
        throw(err);
    })
}

exports.createUserProfile = createUserProfile

//=======================================================================

function getAllInfo(id) {
    return db.query(`SELECT users.first AS first_name, users.last AS last_name, users.email AS email, user_profiles.age AS age, user_profiles.city AS city, user_profiles.homepage AS homepage
                     FROM users
                     LEFT JOIN user_profiles
                     ON users.id = user_profiles.user_id
                     WHERE user_profiles.user_id = $1`,
                    [id]
            ).then((results) => {
         return results.rows[0];
     }).catch((err) => {
         console.log(err);
     });
}

exports.getAllInfo = getAllInfo

//=======================================================================

function updateUserInfo(newInfo, id) {
    return db.query(`UPDATE users
              SET first = $1, last = $2, email = $3
              WHERE id = $4`,
             [newInfo.first, newInfo.last, newInfo.email, id]
        ).then(() => {
            return db.query(`UPDATE user_profiles
                      SET age = $1, city = $2, homepage = $3
                      WHERE user_id = $4`,
                     [newInfo.age || null, newInfo.city, newInfo.homepage, id]
            )
        }).catch((err) => {
            console.log(err);
        });
}

exports.updateUserInfo = updateUserInfo

//=======================================================================

function updatePassword(hashedPassword, id) {
    return db.query(`UPDATE users
              SET password = $1
              WHERE id = $2`,
             [hashedPassword, id]
        ).catch((err) => {
            console.log(err);
        });
}

exports.updatePassword = updatePassword

//=======================================================================

function deleteSignature(id) {
    return db.query('DELETE FROM signatures WHERE user_id = $1',
                    [id]
        ).catch((err) => {
            console.log(err);
        })
}

exports.deleteSignature = deleteSignature

//=======================================================================
