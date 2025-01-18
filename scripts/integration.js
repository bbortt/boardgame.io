const shell = require('shelljs');

shell.rm('-rf', 'dist');
shell.exec('pnpm pack');
const packed = shell.ls('./boardgame.io-*.tgz').stdout.trim();

shell.mv(packed, 'integration');
shell.cd('integration');
shell.rm('-rf', 'node_modules');
shell.exec('pnpm install');
shell.exec(`pnpm install ${packed}`);
shell.rm(packed);

shell.set('-e');

// Test
shell.exec('pnpm test');
shell.exec('pnpm run build');
