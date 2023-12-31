import fs from 'fs-extra';
import * as path from 'path';
import { ParseResult, parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { Expression, File, Identifier, ObjectExpression, ObjectProperty } from '@babel/types';
import * as t from '@babel/types';

/**
 * 模型文档化
 * @param modelDir - 模型目录
 * @param options - 配置参数
 */
export default async function docify(modelDir: string, options: IOptions = {}) {
  console.log(options);
  const cwd = process.cwd();
  const modelPath = path.resolve(cwd, modelDir);
  // 路取模型目录下所有模型名称
  const modelNames = fs.readdirSync(modelPath);
  const models: Record<string, IModel> = {};
  for(let i = 0; i < modelNames.length; i++) {
    const m = modelNames[i];
     // 读取 index.ts 文件，通过AST，找到所有子模型
     if(!fs.existsSync(path.resolve(modelPath, m, 'index.ts'))) continue;
     const fileContent = fs.readFileSync(path.resolve(modelPath, m, 'index.ts')).toString();
     const ast = parse(fileContent, {
       sourceType: 'module',
       plugins: ['typescript'],
     });
     models[m] = {
       name: m,
       subModels: {},
     };
     traverse(ast, {
       ExportSpecifier(_path) {
         const subModelName = _path.node.local.name;
         const subModelFileContent = fs.readFileSync(path.resolve(modelPath, m, subModelName + '.ts')).toString();
         const subModelAst = parse(subModelFileContent, {
          sourceType: 'module',
          plugins: ['typescript'],
        });
         const { state } = traverseSubModelAst(subModelAst);
         models[m].subModels[subModelName] = {
           name: subModelName,
           state,
         }
       }
     });
  }
  console.log(models);
  fs.writeJSON(path.resolve(modelPath, 'meta.json'), models);
}

docify('./mock')

function traverseSubModelAst(ast: ParseResult<File>) {
  const state: ISubModel['state'] = {};
  traverse(ast, {
    // 找到默认导出声明代码节点
    ExportDefaultDeclaration(_path) {
      // 找到 state 代码块
      const stateNode = (_path.node.declaration as ObjectExpression).properties.
        find(node => ((node as ObjectProperty).key as Identifier).name === 'state') as ObjectProperty;
      if(stateNode) {
        // 获取当前 state 的初始值
        const valueNode = stateNode.value;
        // 如果是声明，则要找到原对象
        if(t.isIdentifier(valueNode)) {
          const identifierName = valueNode.name;
          
        } else if(t.isLiteral(valueNode) || t.isExpression(valueNode)) {
          // 如果是值或者表达式，TODO:
        }
      }
   
      // 生成 state 的TS声明
      stateNode.value
    }
  })
  return {
    state
  }
}