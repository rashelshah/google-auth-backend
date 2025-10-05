const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';


// Step 1: Start Google OAuth
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Google callback
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND}/login?error=auth_failed` }),
  (req, res) => {
    try {
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables');
        return res.redirect(`${FRONTEND}/login?error=config_error`);
      }

      const payload = {
        user: {
          id: req.user?.id,
          email: (req.user?.emails && req.user.emails[0]?.value) || '',
          name: req.user?.displayName || ''
        }
      };

      const authtoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

      // Redirect back to frontend with token (URL-encoded)
      res.redirect(`${FRONTEND}/?login=success&token=${encodeURIComponent(authtoken)}`);
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect(`${FRONTEND}/login?error=server_error`);
    }
  }
);

module.exports = router;