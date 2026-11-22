import { copyFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function executeEntrypoint(): void {
  const botDirectory = process.env.MAKEFUN_BOT_DIR ?? '/bot';
  const targetOutputDirectory = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

  mkdirSync(targetOutputDirectory, { recursive: true });

  const sourceVideoConfig = join(botDirectory, 'VIDEO.json');
  const targetVideoConfig = join(targetOutputDirectory, 'VIDEO.json');

  if (!existsSync(sourceVideoConfig)) {
    throw new Error(`Critical manifest missing: ${sourceVideoConfig}`);
  }

  const rawConfig = readFileSync(sourceVideoConfig, 'utf-8');
  const parsedData = JSON.parse(rawConfig);
  if (!parsedData.url || !parsedData.url.startsWith('https://www.tiktok.com/')) {
    throw new Error(`Invalid video payload target: ${parsedData.url}`);
  }

  copyFileSync(sourceVideoConfig, targetVideoConfig);
  console.log(`Verified and deployed VIDEO.json destination: ${targetVideoConfig}`);
}

try {
  executeEntrypoint();
} catch (failureError) {
  console.error(`Execution halted: ${(failureError as Error).message}`);
  process.exit(1);
}
