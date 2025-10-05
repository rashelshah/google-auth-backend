const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const BACKEND = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;


if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set');
}


passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${BACKEND}/auth/google/callback`  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // You can save user to database here if needed
      // For now, just pass the profile
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails,
        photos: profile.photos
      };
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;