import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edpbkxlcapjmynahvgth.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcGJreGxjYXBqbXluYWh2Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyODAsImV4cCI6MjEwNTYxOTI4MH0.fmAKxg61vLsPqh4tBVVbJ6mgSEvtyiV76rC5rWcQZ4w';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Fetch admin user from Supabase
        const { data: adminUser, error } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", email)
          .single();

        if (error || !adminUser) {
          throw new Error("Invalid credentials");
        }

        // Check if account is locked
        if (adminUser.locked_until && new Date(adminUser.locked_until) > new Date()) {
          throw new Error("Account temporarily locked due to too many failed attempts");
        }

        // Check if account is active
        if (!adminUser.is_active) {
          throw new Error("Account is inactive");
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, adminUser.password_hash);
        if (!isValidPassword) {
          // Increment failed login attempts
          await supabase
            .from("admin_users")
            .update({
              failed_login_attempts: (adminUser.failed_login_attempts || 0) + 1,
              locked_until: (adminUser.failed_login_attempts || 0) + 1 >= 5 
                ? new Date(Date.now() + 30 * 60 * 1000).toISOString() 
                : null,
            })
            .eq("id", adminUser.id);
          
          throw new Error("Invalid credentials");
        }

        // Reset failed login attempts on successful login
        await supabase
          .from("admin_users")
          .update({
            failed_login_attempts: 0,
            locked_until: null,
            last_login_at: new Date().toISOString(),
          })
          .eq("id", adminUser.id);

        return {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
