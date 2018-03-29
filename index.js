#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const _cleanType = s => s.replace(/\s+ML_CALL/, '');
const _cleanName = s => s.replace(/ML_CALL\s+/, '');
const _getJsType = type => {
  switch (type) {
    case 'bool':
      return 'Boolean';
    case 'uint32_t':
    case 'uint64_t':
    case 'int64_t':
    case 'uint16_t':
    case 'MLHandle':
    case 'MLFileInfo':
    case 'const MLFileInfo':
    case 'MLFileDescriptor':
    case 'MLDispatchErrorCode':
    case 'MLSurfaceFormat':
    case 'VkFormat':
    case 'MLIdentityError':
    case 'MLInvokeFuture':
    case 'MLLifecycleErrorCode':
    case 'MLLifecycleInitArg':
    case 'const MLLifecycleInitArg':
    case 'void':
    case 'MLDataArrayLockResult':
    case 'MLPlanesQueryResult':
    case 'MLSharedFileList':
    case 'MLTokenAgentError':
      return 'Number';
    case 'const char':
      return 'String';
    default:
      throw new Error('unknown type: ' + type);
  }
};
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

const dir = process.argv[2];
if (dir && fs.lstatSync(dir).isDirectory(dir)) {
  const fns = [];

  const files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (/\.h$/.test(file)) {
      const s = fs.readFileSync(path.join(dir, file), 'utf8');
      const lines = s.split('\n');
      for (let j = 0; j < lines.length; j++) {
        const line = lines[j];
        if (!/\.\.\./.test(line)) {
          const match = line.match(/ML_API\s+((?:const )?\S+(?: \*)?)\s+(.+)\((.+)\)/);
          if (match) {
            const argStrings = match[3].split(/,\s+/);
            const type = _cleanType(match[1]);
            const name = _cleanName(match[2]);
            const args = _parseArgs(argStrings);
            if (/\(/.test(type) || /ML_CALL/.test(type) || /ML_CALL/.test(name)) {
              console.warn({line, type, name});
              throw new Error('failed to gen');
            }
            fns.push({
              type,
              name,
              args,
            });
          }
        }
      }
    }
  }

  let result = '';
  // console.log('got fns', fns.length);
  for (let i = 0; i < fns.length; i++) {
    const fn = fns[i];
    const {type, name, args} = fn;
    result += 'NAN_METHOD(' + name + ') {\n';
    for (let j = 0; j < args.length; j++) {
      const jsType = _getJsType(type);
      result += `  const ${type} ${name} = Nan::New<${jsType}>(info[${j}]);\n`;
    }
    result += '\n';
    result += `  ${name}(`;
    for (let j = 0; j < args.length; j++) {
      const arg = args[j];
      const {name} = arg;
      result += name;
      if (j !== (args.length - 1)) {
        result += ', ';
      }
    }
    result += `);\n`;
    result += '}\n\n';
  }

  // console.log(JSON.stringify(fns, null, 2));
  console.log(result);
} else {
  console.warn('usage: index.js <MLSDK headers directory>');
}
