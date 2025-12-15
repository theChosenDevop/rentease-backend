import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma';
import dotenv from 'dotenv';

dotenv.config();

async function findOrCreateUser(profile: any) {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new Error("Email required");

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                firstName: profile.name?.givenName ?? "Google",
                lastName: profile.name?.familyName ?? "User",
                googleId: profile.id,
            }
        });
    }
    return user;
}


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                // const email = profile.emails?.[0]?.value;
                // const firstName = profile.name?.givenName || 'Google';
                // const lastName = profile.name?.familyName || 'User';

                // if (!email) return done(new Error('Google account must have an email'))
                
                // let user = await prisma.user.findUnique({ where: { email } });

                // if (!user) {
                //     user = await prisma.user.create({
                //         data: { email, firstName, lastName, googleId: profile.id, role: 'TENANT' }
                //     })
                // }
                const user = await findOrCreateUser(profile);

                const safeUser = user ?  { ...user } : undefined;

                return done(undefined, safeUser)
            } catch (error) {
                return done(error as Error, undefined)
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        const safeUser = user ? { ...user } : undefined;
        done(undefined, safeUser);
    } catch (error) {
        done(error as Error, undefined);
    }
})