import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing required environment variables:");
  if (!SUPABASE_URL) console.error("  - NEXT_PUBLIC_SUPABASE_URL");
  if (!SUPABASE_SERVICE_KEY) console.error("  - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing chars: I, O, 0, 1
  let code = "BETA-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += "-";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function generateBetaCodes(count: number, expirationDays: number = 30) {
  const codes: string[] = [];
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expirationDays);

  // Generate unique codes
  const existingCodes = new Set<string>();
  while (codes.length < count) {
    const code = generateCode();
    if (!existingCodes.has(code)) {
      existingCodes.add(code);
      codes.push(code);
    }
  }

  // Insert into database
  const records = codes.map((code) => ({
    code,
    expires_at: expiresAt.toISOString(),
    is_used: false,
  }));

  const { data, error } = await supabase
    .from("beta_codes")
    .insert(records)
    .select();

  if (error) {
    console.error("Failed to insert codes:", error.message);
    process.exit(1);
  }

  return { codes, expiresAt, inserted: data?.length || 0 };
}

async function main() {
  const count = parseInt(process.argv[2] || "10", 10);
  const days = parseInt(process.argv[3] || "30", 10);

  if (isNaN(count) || count < 1 || count > 100) {
    console.error("Usage: npx tsx scripts/generate-beta-codes.ts [count] [days]");
    console.error("  count: Number of codes to generate (1-100, default: 10)");
    console.error("  days: Days until expiration (default: 30)");
    process.exit(1);
  }

  console.log(`\nGenerating ${count} beta codes (valid for ${days} days)...\n`);

  const { codes, expiresAt, inserted } = await generateBetaCodes(count, days);

  console.log(`✓ Generated ${inserted} beta codes`);
  console.log(`  Expires: ${expiresAt.toLocaleDateString()}\n`);
  console.log("─".repeat(40));
  console.log("BETA CODES:");
  console.log("─".repeat(40));
  codes.forEach((code) => console.log(`  ${code}`));
  console.log("─".repeat(40));
  console.log("\nShare these codes with your beta users!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
