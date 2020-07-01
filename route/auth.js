const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Hashids = require('hashids/cjs');
const MobileDetect = require('mobile-detect');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const config = require('../config.js')
const { urlEncoded, jsonParser } = require('./utils/body-parser');
const { Password, User } = require('../models/association');
const database = require('../models/connect');

const router = express.Router();
const hashids = new Hashids(config.session.secret, 20);

router.use(urlEncoded);
router.use(jsonParser);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        return await Password.findOne({
            where: {
                email,
            },
            attributes: [
                'userId',
                'password',
            ],
        })
        .then(user => {
            if(user === null) {
                return done(null, false, { message: 'Incorrect email' });
            }
            else {
                return bcrypt.compare(password, user.password)
                .then(matched => {
                    if(matched){
                        return User.findOne({
                            where: {
                                userId: user.userId,
                            },
                            attributes: [
                                ['userId', 'id'],
                                ['username', 'name'],
                                'icon',
                            ],
                        })
                        .then(user => {
                            return done(null, user);
                        });
                    }
                    else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                })
            }
        })
        .catch(err => {
            return done(err, false);
        });
    }
));

passport.use(new GoogleStrategy(
    {
        clientID: config.passport.google.clientID,
        clientSecret: config.passport.google.clientSecret,
        callbackURL: '/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
        return await database.transaction(t => {
            return User.findOrCreate({
                where: {
                    email: profile.emails[0].value,
                    host: 'google',
                },
                attributes: [
                    'userId',
                    'username',
                    'icon',
                ],
                defaults: {
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    icon: null,
                    // icon: profile.photos[0].value, // TODO: should be blob?
                    host: 'google',
                },
                transaction: t,
            })
            .then(([user, created]) => {
                if(created){
                    return user.update({
                        hash: hashids.encode(user.userId),
                    }, {
                        transaction: t,
                    });
                }
                return user;
            })
            .then(user => {
                return done(null, {
                    id: user.userId,
                    name: user.username,
                    icon: user.icon,
                });
            })
        })
        .catch(err => {
            return done(err, false);
        });
    }
));

passport.use(new FacebookStrategy(
    {
        clientID: config.passport.facebook.clientID,
        clientSecret: config.passport.facebook.clientSecret,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name', 'displayName']
    },
    async function (accessToken, refreshToken, profile, done) {
        return await database.transaction(t => {
            return User.findOrCreate({
                where: {
                    email: profile.emails ? profile.emails[0].value : `${ profile.id }@facebook.com`,
                    host: 'facebook',
                },
                attributes: [
                    'userId',
                    'username',
                    'icon',
                ],
                defaults: {
                    email: profile.emails ? profile.emails[0].value : `${ profile.id }@facebook.com`,
                    username: profile.displayName,
                    icon: null,
                    // icon: profile.photos[0].value, // TODO: can't get this
                    host: 'facebook',
                },
                transaction: t,
            })
            .then(([user, created]) => {
                if(created){
                    return user.update({
                        hash: hashids.encode(user.userId),
                    }, {
                        transaction: t,
                    });
                }
                return user;
            })
            .then(user => {
                return done(null, {
                    id: user.userId,
                    name: user.username,
                    icon: user.icon,
                });
            })
        })
        .catch(err => {
            return done(err, false);
        });
    }
));

passport.use(new TwitterStrategy(
    {
        consumerKey: config.passport.twitter.clientID,
        consumerSecret: config.passport.twitter.clientSecret,
        callbackURL: '/auth/twitter/callback',
        profileFields: ['id', 'emails', 'name', 'displayName']
    },
    async function (accessToken, refreshToken, profile, done) {
        return await database.transaction(t => {
            return User.findOrCreate({
                where: {
                    email: profile.emails ? profile.emails[0].value : `${ profile.id }@twitter.com`,
                    host: 'twitter',
                },
                attributes: [
                    'userId',
                    'username',
                    'icon',
                ],
                defaults: {
                    email: profile.emails ? profile.emails[0].value : `${ profile.id }@twitter.com`,
                    username: profile.displayName,
                    icon: null,
                    // icon: profile.photos[0].value, // TODO: should be blob?
                    host: 'twitter',
                },
                transaction: t,
            })
            .then(([user, created]) => {
                if(created){
                    return user.update({
                        hash: hashids.encode(user.userId),
                    }, {
                        transaction: t,
                    });
                }
                return user;
            })
            .then(user => {
                return done(null, {
                    id: user.userId,
                    name: user.username,
                    icon: user.icon,
                });
            })
        })
        .catch(err => {
            return done(err, false);
        });
    }
));

router.post('/local', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            res.status(500);
            return next(err);
        }
        if (!user) {
            const md = new MobileDetect(req.headers['user-agent']);
            return res.render(`${ md.mobile() ? 'mobile/' : '' }signin`, {
                title: '會員登入',
                error: {
                    message: '使用者不存在，或密碼輸入錯誤',
                },
            });
        }
        req.login(user, err => {
            if (err) {
                res.status(500);
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile', 'https://www.googleapis.com/auth/plus.login'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/signin', }),
    (req, res) => {
        res.redirect('/');
    }
);

router.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/signin', }),
    (req, res) => {
        res.redirect('/');
    }
);

router.get('/twitter',
    passport.authenticate('twitter', { scope: ['email'] })
);

router.get('/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/signin', }),
    (req, res) => {
        res.redirect('/');
    }
);

module.exports = router;
