import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { googleLogin } from "../services/auth.service.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:2000/api/v1/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try{
                console.log("1. Google profile received");
                const result = await googleLogin(profile);
                console.log("2. googleLogin finished");
                return done(null, result);
            } catch(err){
                console.log("ERROR INSIDE PASSPORT");
                console.error(err);
                return done(err, null)
            }
        }

    )
)

export default passport;