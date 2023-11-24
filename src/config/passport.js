const passport = require("passport");
const passportJwt = require("passport-jwt");

const secret = "Segredo!";

const { Strategy, ExtractJwt} = passportJwt;

module.exports = (app) => {
    const params = {
        secretOrKey: secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };

    const strategy = new Strategy(params, (payload, done) => {
        app.services.user.findOne({id: payload.id})
        .then((user) => {
            if(user) {
                return done(null, { ...payload});
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err, false);
        });
    });

    passport.use(strategy);

    return {
        authenticate: () => passport.authenticate("jwt", {session: false}),
    }
};