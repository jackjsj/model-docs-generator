import { parse } from '@babel/parser';
import fs from 'fs-extra';

fs.readFile('./mock/test.ts').then(resp => {
  const code = resp.toString();
  const ast = parse(code, {
    plugins: ['typescript'],
    sourceType: 'module'
  });
  console.log(ast);
});
