import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcrypt';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err) {
          if (err instanceof Error) {
            throw new Error(err.message);
          }
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          await dbConnect();

          // Find existing user by email only
          const existingUser = await UserModel.findOne({
            $or: [{
              email: user?.email
            }, {
              username: user?.name
            }]
          });

          if (existingUser) {
            // Allow sign-in if the user exists
            return true;
          } else {
            // Create a new user document if it does not exist
            const newUser = new UserModel({
              username: profile?.name || user?.name, // Use profile name if available
              email: user?.email,
              isVerified: true,
              isOAuthUser: true,
            });
            await newUser.save();
            return true;
          }
        }

        // If sign-in provider is not Google, return true to allow sign-in
        return true;
      } catch (error) {
        console.error(error);
        return false; // Return false if there is an error
      }
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
};
