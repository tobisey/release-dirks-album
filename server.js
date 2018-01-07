//EXPRESS
const express = require('express');
const app = express();

//EXPRESS-HANDLEBARS
const hb = require('express-handlebars');
const handlebars = require('handlebars')

//HELPERS
const hbHelper = hb.create({
    helpers: {
        myHelper1: (results) => {
            if (results.age && results.city) {
                const escaped = results.city.replace(/<\/?[^>]+(>|$)/g, "");
                return new handlebars.SafeString(`, ${results.age}, <a href="/signers/${escaped}">${escaped}</a>`);
            } else if (results.age) {
                return new handlebars.SafeString(`, ${results.age}`);
            } else if (results.city) {
                const escaped = results.city.replace(/<\/?[^>]+(>|$)/g, "");
                return new handlebars.SafeString(`, <a href="/signers/${escaped}">${escaped}</a>`);
            }
        },
        myHelper2: (results) => {
            const escapedFirst = results.first_name.replace(/<\/?[^>]+(>|$)/g, "");
            const escapedLast = results.last_name.replace(/<\/?[^>]+(>|$)/g, "");
            if (results.homepage) {
                return new handlebars.SafeString(`<a href="http://${results.homepage}" target="_blank">${escapedFirst} ${escapedLast}</a>`);
            } else {
                return new handlebars.SafeString(`${escapedFirst} ${escapedLast}`);
            }
        }
    }
})

app.engine('handlebars', hbHelper.engine);
app.set('view engine', 'handlebars');

//BODY-PARSER
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}))

//COOKIE-SESSION
const cookieSession = require('cookie-session');
app.use(cookieSession({
    secret: 'no distance left to run',
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

//CSURF
const csurf = require('csurf');
app.use(csurf());

//DB MODULE
const db = require('./db');
const signPetition = db.signPetition;
const getNames = db.getNames;
const getSigImage = db.getSigImage;
const resetDB = db.resetDB;
const checkValues = db.checkValues;
const register = db.register;
const getInfo = db.getInfo;
const checkPassword = db.checkPassword;
const hashPassword = db.hashPassword;
const cancelSession = db.cancelSession;
const createUserProfile = db.createUserProfile;
const getNamesFromCity = db.getNamesFromCity;
const getAllInfo = db.getAllInfo;
const updateUserInfo = db.updateUserInfo;
const updatePassword = db.updatePassword;
const deleteSignature = db.deleteSignature;

const spaces = /^\s+$/;

app.use((req, res, next) => {
    res.setHeader('x-frame-options', 'deny');
    next();
})

app.disable('x-powered-by');

//SERVE STATIC FILES
app.use('/public', express.static(`${__dirname}/public`));

//REGISTER PAGE=======================================================================
app.get('/', (req, res) => {
    res.render('register', {
        layout: 'main',
        csrfToken: req.csrfToken()
    })
})

//POST REQUEST TO SEND REGISTRATION DETAILS
app.post('/register', (req, res) => {
    if (!req.body.first || !req.body.last || !req.body.email || !req.body.password || req.body.email.indexOf('@') === -1 || spaces.test(req.body.first) || spaces.test(req.body.last) || spaces.test(req.body.password)) {
        res.render('register', {
            layout: 'main',
            error: 'error',
            csrfToken: req.csrfToken()
        })
    } else {
        hashPassword(req.body.password).then((hash) => {
            register(req.body.first, req.body.last, req.body.email, hash).then((id) => {
                req.session.user = {
                    firstName: req.body.first,
                    lastName: req.body.last,
                    userId: id,
                    signature: false
                }
                console.log(req.session.user);
                // rd.flushdb();
                res.redirect('/more-info');
            }).catch((err) => {
                console.log('email already registered');
                res.render('register', {
                    layout: 'main',
                    error: 'error',
                    csrfToken: req.csrfToken()
                })
            });
        }).catch((err) => {
            console.log(err);
        });
    }

})

//MORE INFO PAGE=======================================================================
app.get('/more-info', (req, res) => {
    if (req.session.user.signature) {
        res.redirect('/thanks');
    } else {
        res.render('more_info', {
            layout: 'main',
            csrfToken: req.csrfToken()
        })
    }
})

//ADD ADDITIONAL USER INFO
app.post('/more-info', (req, res) => {
    createUserProfile(req.session.user.userId, req.body.age, req.body.city, req.body.homepage).then(() => {
        // rd.flushdb();
        res.redirect('/sign');
    }).catch((err) => {
        console.log(err);
    });
})

//LOGIN PAGE=======================================================================
app.get('/login', (req, res) => {
    res.render('login', {
        layout: 'main',
        csrfToken: req.csrfToken()
    })
})

//POST REQUEST TO LOGIN
app.post('/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.render('login', {
            layout: 'main',
            error: 'error',
            csrfToken: req.csrfToken()
        })
    } else {
        getInfo(req.body.email).then((info) => {
            checkPassword(req.body.password, info.password).then((doesMatch) => {
                if (doesMatch) {
                    req.session.user = {
                        firstName: info.first,
                        lastName: info.last,
                        email: info.email,
                        userId: info.id
                    }
                    res.redirect('/thanks');
                } else {
                    console.log('incorrect password');
                    res.render('login', {
                        layout: 'main',
                        error: 'error',
                        csrfToken: req.csrfToken()
                    })
                }
            })
        }).catch((err) => {
            console.log('incorrect email');
            res.render('login', {
                layout: 'main',
                error: 'error',
                csrfToken: req.csrfToken()
            })
        });
    }
})

//SIGN PAGE=======================================================================
app.get('/sign', (req, res) => {
    res.render('sign', {
        layout: 'main',
        csrfToken: req.csrfToken()
    })
})

//POST REQUEST SENDING SIGNATURE
app.post('/sign', (req, res) => {
    if (!req.body.sig) {
        res.render('sign', {
            layout: 'main',
            error: 'error',
            csrfToken: req.csrfToken()
        })
    } else {
        signPetition(req.session.user.userId, req.body.sig).then(() => {
            req.session.user.signature = true;
            console.log(req.session.user.signature);
            // rd.flushdb();
            res.redirect('/thanks');
        }).catch((err) => {
            console.log(err);
        });
    }
})

//SIGNERS PAGE=======================================================================
app.get('/signers', (req, res) => {
    getNames().then((results) => {
        res.render('signers', {
            layout: 'main',
            names: results
        })
    }).catch((err) => {
        console.log(err);
    })
})

//SIGNERS FROM A SPECIFIC CITY PAGE
app.get('/signers/:city', (req, res) => {
    getNamesFromCity(req.params.city).then((results) => {
        res.render('specific_city', {
            layout: 'main',
            names: results
        })
    }).catch((err) => {
        console.log(err);
    })
})

//EDIT PROFILE PAGE=======================================================================
app.get('/update', (req, res) => {
    getAllInfo(req.session.user.userId).then((results) => {
        res.render('edit', {
            layout: 'main',
            results: results,
            csrfToken: req.csrfToken()
        });
    }).catch((err) => {
        console.log(err);
    });

})

//UPDATE PROFILE
app.post('/update', (req, res) => {
    if (req.body.email.indexOf('@') === -1 || spaces.test(req.body.first) || spaces.test(req.body.last) || spaces.test(req.body.password) || spaces.test(req.body.city) || spaces.test(req.body.homepage)) {
        getAllInfo(req.session.user.userId).then((results) => {
            res.render('edit', {
                layout: 'main',
                error: 'error',
                results: results,
                csrfToken: req.csrfToken()
            });
        }).catch((err) => {
            console.log(err);
        });
    } else {
        if (req.body.password) {
            hashPassword(req.body.password).then((hashedPassword) => {
                updatePassword(hashedPassword, req.session.user.userId).then(() => {
                    res.redirect('/thanks');
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            });
        }
        updateUserInfo(req.body, req.session.user.userId).then(() => {
            // rd.flushdb();
            res.redirect('/thanks');
        }).catch((err) => {
            console.log(err);
        });;
    }
})

//DELETE SIGNATURE================================================================
app.post('/delete', (req, res) => {
    deleteSignature(req.session.user.userId).then(() => {
        res.redirect('/sign');
        console.log('signature deleted');
    }).catch((err) => {
        console.log(err);
    });
})

//THANKS PAGE=======================================================================
app.get('/thanks', (req, res) => {
    if (req.session.user) {
        getSigImage(req.session.user.userId).then((img) => {
            res.render('thanks', {
                layout: 'main',
                image: img,
                csrfToken: req.csrfToken()
            })
        }).catch((err) => {
            res.redirect('/sign');
        })
    } else {
        res.redirect('/');
    }
})

//LOGOUT=======================================================================
app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
})

//STOP PEOPLE TYPING RANDOM URLS=======================================================================
app.get('*', (req, res) => {
    res.redirect('/');
})

app.listen(process.env.PORT || 8080, () => {console.log(`listening 8080...`)});
