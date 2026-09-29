import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://edpbkxlcapjmynahvgth.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkcGJreGxjYXBqbXluYWh2Z3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDMyODAsImV4cCI6MjEwNTYxOTI4MH0.fmAKxg61vLsPqh4tBVVbJ6mgSEvtyiV76rC5rWcQZ4w';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  const email = process.argv[2];
  const password = process.argv[3];
  const role = process.argv[4] || 'admin';

  if (!email || !password) {
    console.log("Usage: npx tsx scripts/create-admin.ts <email> <password> [role]");
    console.log("Example: npx tsx scripts/create-admin.ts admin@example.com securepassword super_admin");
    process.exit(1);
  }

  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      console.log(`Admin user with email ${email} already exists.`);
      process.exit(1);
    }

    // Create admin user
    const { data, error } = await supabase
      .from("admin_users")
      .insert({
        email,
        password_hash: passwordHash,
        role,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating admin user:", error);
      process.exit(1);
    }

    console.log(`✅ Admin user created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Role: ${role}`);
    console.log(`ID: ${data.id}`);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createAdminUser();
