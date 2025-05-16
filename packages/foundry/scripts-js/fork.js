import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: join(__dirname, '..', '.env') });

// Get fork URL from args or env
const forkUrl = process.argv[2] || process.env.FORK_URL || 'mainnet';

console.log(`Forking from: ${forkUrl}`);

try {
  execSync(`make fork FORK_URL="${forkUrl}"`, { 
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
} catch (error) {
  process.exit(1);
}