import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password"
        }
      },
      async authorize(credentials: any): Promise<any> {
        await connectDB();
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.identifier }, {
              username: credentials.identifier
            }]
          })
          if (!user) {
            throw new Error("User not found");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Email or Password")
          }
        } catch (error) {
          console.error("Error", error);
          if (error instanceof Error) {
            throw new Error(error.message)
          }
        }
      }
    })
  ],
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token
    }
  }
}