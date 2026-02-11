import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });
        if (!res.ok) return null;
        const data = await res.json();
        return {
          id: data.user?.id,
          email: data.user?.email,
          name: `${data.user?.firstName ?? ""} ${data.user?.lastName ?? ""}`.trim(),
          role: data.user?.role,
          imageUrl: data.user?.imageUrl ?? null,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        } as any;
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as any;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user as any;
      (session as any).accessToken = token.accessToken;
      (session as any).refreshToken = token.refreshToken;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
