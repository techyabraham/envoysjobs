import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const apiUrl = process.env.API_INTERNAL_HOST
  ? `http://${process.env.API_INTERNAL_HOST}:${process.env.API_INTERNAL_PORT || "4000"}`
  : process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
        token.accessTokenExpires = Date.now() + 14 * 60 * 1000;
        return token;
      }

      if (token.accessToken && Date.now() < Number(token.accessTokenExpires || 0)) return token;
      if (!token.refreshToken) {
        token.error = "RefreshAccessTokenError";
        return token;
      }

      try {
        const response = await fetch(`${apiUrl}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: token.refreshToken })
        });
        if (!response.ok) throw new Error("Token refresh failed");
        const refreshed = await response.json();
        token.accessToken = refreshed.accessToken;
        token.refreshToken = refreshed.refreshToken;
        token.accessTokenExpires = Date.now() + 14 * 60 * 1000;
        delete token.error;
      } catch {
        token.error = "RefreshAccessTokenError";
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user as any;
      (session as any).accessToken = token.accessToken;
      (session as any).error = token.error;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
