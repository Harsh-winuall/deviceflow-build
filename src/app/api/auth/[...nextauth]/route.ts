import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { BASEURL } from "@/server/main";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${BASEURL}/edifybackend/v1/auth/login`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (res.ok && data?.user?.length) {
          return data;
        } else {
          throw new Error(data.message || "Login failed");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(
            `${BASEURL}/edifybackend/v1/auth/loginGoogle`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ access_token: account.access_token }),
            }
          );

          const data = await res.json();

          if (res.ok && data?.user?.length) {
            account.userData = data.user[0]; // Save user data for jwt
            account.access_token = data.token;
            return true;
          } else {
            switch (account?.provider) {
              case "google":
              default:
                return `/login?error=${profile.email}`; // This is where you set your error
            }
          }
        } catch (err) {
          return Promise.reject(new Error("AccessDenied"));
        }
      }

      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      //  console.log({token,user,account,trigger})
      if (trigger === "update" && session) {
        // merge only the fields you send in `update`
        // if (typeof session.subscriptionStatus !== "undefined") {
        token.subscriptionStatus = session.subscriptionStatus;
        // }

        token.amount = session.amount;

        return token;
      }
      // From CredentialsProvider
      if (user && user.user?.length) {
        const u = user.user[0];
        token.token = user.token;
        token.userId = u._id;
        token.email = u.email;
        token.firstName = u.first_name;
        token.lastName = u.last_name;
        token.role = u.role;
        token.employeeCount = u.employeeCount;
        token.designation = u.designation;
        token.orgId = u.orgId;
        token.teamId = u.teamId;
        token.addressDetails = u.addressDetails?.[0];
        token.subscriptionStatus = user?.subscriptionStatus;
        token.amount = user?.amount;
      }

      // From GoogleProvider
      if (account?.provider === "google" && account.userData) {
        const u: any = account.userData;
        token.token = account.access_token;
        token.userId = u._id;
        token.email = u.email;
        token.firstName = u.first_name;
        token.lastName = u.last_name;
        token.role = u.role;
        token.employeeCount = u.employeeCount;
        token.designation = u.designation;
        token.orgId = u.orgId;
        token.teamId = u.teamId;
        token.addressDetails = u.addressDetails?.[0];
      }

      return token;
    },

    async session({ session, token }) {
      session.user.user = {
        token: token.token,
        userId: token.userId,
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        role: token.role,
        employeeCount: token.employeeCount,
        designation: token.designation,
        orgId: token.orgId,
        teamId: token.teamId,
        addressDetails: token.addressDetails,
        subscriptionStatus: token.subscriptionStatus,
        amount: token.amount,
      };

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
