import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const source = path.join(here, 'entry.png');
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = path.join(targetDir, 'entry.png');
const signature = Buffer.from([137,80,78,71,13,10,26,10]);

function fail(message) { throw new Error(message); }
try {
  if (!fs.existsSync(source)) fail('entry.png is missing; run generate.mjs first');
  const data = fs.readFileSync(source);
  if (data.length < 33 || !data.subarray(0,8).equals(signature)) fail('invalid PNG signature');
  if (data.toString('ascii',12,16) !== 'IHDR') fail('PNG IHDR chunk missing');
  const width = data.readUInt32BE(16), height = data.readUInt32BE(20);
  if (width !== 1024 || height !== 1024) fail(`unexpected PNG dimensions ${width}x${height}`);
  fs.mkdirSync(targetDir, {recursive:true});
  fs.writeFileSync(target, data);
  const copied = fs.statSync(target).size;
  if (copied !== data.length) fail('copied file size mismatch');
  console.log(`entry.png: ${width}x${height}, ${copied} bytes`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
