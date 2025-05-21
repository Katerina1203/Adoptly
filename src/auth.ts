import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credential from "next-auth/providers/credentials";
import { User } from "./lib/models";
import bcrypt from "bcryptjs"
import { connectDB } from "./lib/utils";

const login = async (credentials: any) => {
    try {
        connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user) throw new Error("Wrong credentials!");

        const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
        );

        if (!isPasswordCorrect) throw new Error("Wrong credentials!");

        return user;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to login!");
    }
};

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    session: {
        strategy: 'jwt',
        maxAge: 1 * 24 * 60 * 60, // 1 day
    },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        Credential({
            async authorize(credentials) {
                if (credentials === null) return null;
                try {
                    connectDB()
                    const user = await User.findOne({
                        email: credentials?.email
                    })
                    if (!user) {
                        throw new Error("Credentials do not match!")
                    }

                    const userExists = bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );

                    if (!userExists) {
                        throw new Error("Email or Password is not correct")
                    }
                    return user

                } catch (e) {
                    console.log(e)
                    console.error(e)
                    return null
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                connectDB()
                try {
                    const user = await User.findOne({ email: profile?.email })
                    if (!user) {
                        const newUser = new User({
                            username: profile?.name,
                            email: profile?.email,
                            img: profile?.picture,
                        })
                        await newUser.save()
                    }
                } catch (e) {
                    console.error(e);
                    return false
                }
            }
            return true
        },
        async jwt({ token, user }) {
            user && (token.user = user);
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as any;
            return session;
        },
    }
});
