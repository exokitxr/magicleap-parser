#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const _cleanType = s => s.replace(/ ML_CALL/, '');

const _parseArgs = args => args.map(arg => {
  const match = arg.match(/^((?:const )?\S+(?: \*)?)(.+)/);
  if (!match) {
    throw new Error('fail: ' + arg);
  }
  const type = _cleanType(match[1]);
  const name = match[2];
  return {
    type,
    name,
  };
});

const fns = [];

const files = fs.readdirSync(__dirname);
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  if (/\.h$/.test(file)) {
    const s = fs.readFileSync(path.join(__dirname, file), 'utf8');
    const lines = s.split('\n');
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      if (!/\.\.\./.test(line)) {
        const match = line.match(/ML_API\s+(.+)\s+(.+)\((.+)\)/);
        if (match) {
          const argStrings = match[3].split(/,\s+/);
          fns.push({
            type: _cleanType(match[1]),
            name: match[2],
            args: _parseArgs(argStrings),
          });
        }
      }
    }
  }
}

console.log('got fns', JSON.stringify(fns, null, 2));
