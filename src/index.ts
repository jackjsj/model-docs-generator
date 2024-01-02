import * as fs from 'fs-extra';
import * as path from 'path';
import * as TypeDoc from 'typedoc';
import { toCamelCase } from './utils';

// 当前执行命令的目录
const cwd = process.cwd();

/**
 * 模型文档化
 * @param modelDir - 相对于命令执行路径的模型目录路径
 * @param options - 配置参数
 */
export default async function docify(modelDir: string, options: IOptions = {}) {
  const {
    tsConfigPath = path.resolve(cwd, 'tsconfig.json'),
  } = options;
  // 获取模型目录的绝对路径
  const modelPath = path.resolve(cwd, modelDir);
  // 读取取模型目录下所有模型名称
  const modelNames = fs.readdirSync(modelPath);
  // 定义模型列表
  const models: Record<string, IModel> = {};
  for(let i = 0; i < modelNames.length; i++) {
    // 如果不是文件夹，就跳过
    if(!fs.statSync(path.resolve(modelPath, modelNames[i])).isDirectory()) continue;
    // 模型名称
    const m = modelNames[i];
    // 找出文件夹中所有文件内容中包含 createModel 关键字的文件
    const files = fs.readdirSync(path.resolve(modelPath, m)).filter((file) => {
      // 判断是否是文件，不是文件就排除掉
      if(!fs.statSync(path.resolve(modelPath, m, file)).isFile()) return false;
      return fs.readFileSync(path.resolve(modelPath, m, file)).toString().indexOf('createModel') > -1;
    })
    
    // 如果找到了，说明该文件夹下有模型
    if(files.length > 0) {
      models[toCamelCase(m)] = {
        name: m,
        subModels: files.reduce((cur, next) => {
          return {
            ...cur,
            [toCamelCase(next.replace('.ts', ''))]: {
              name: next,
            },
          }
        }, {}),
      }
    }
  }

  // 填充子模型
  await fillSubModels(models, {
    tsConfigPath,
    modelPath,
  });

  // 生成文档
  // const docs = generateDocs(filledModels);

  // 写入 meta.json
  fs.writeJSON(path.resolve(cwd, 'meta.json'), models);
}

/**
 * 填充子模型
 * @param models - 主模型
 * @param config - 配置参数
 * @returns 
 */
async function fillSubModels(models: Record<string, IModel>, config: {
  tsConfigPath: string;
  modelPath: string;
}) {
  const exportFileContents: string[] = [];
  //  生成导出 state, effects 的文件，只要生成一份就够了
  Object.keys(models).forEach((modelName) => {
    const filename = models[modelName].name;
    const curSubModels = models[modelName].subModels;
    Object.keys(curSubModels).forEach((subModelName) => {
      const _modelName = toCamelCase(modelName);
      const _subModelName = toCamelCase(subModelName.replace('.ts', ''));
      // 头部添加引入语句
      exportFileContents.unshift(`import ${_modelName}_${_subModelName} from './${filename}/${subModelName}';`);
      // 尾部添加导出语句
      exportFileContents.push(`export const ${_modelName}_${_subModelName}_state = {...${_modelName}_${_subModelName}.state};\r\nexport const ${_modelName}_${_subModelName}_effects = {...${_modelName}_${_subModelName}.effects};`)
    })
  })
  const content = exportFileContents.join('\r\n');
  // 写出到文件系统
  const exportfileName = `${config.modelPath}/_exports.ts`;
  fs.writeFileSync(exportfileName, content);

  const app = await TypeDoc.Application.bootstrapWithPlugins({
    skipErrorChecking: true,
    entryPoints: [exportfileName],
    tsconfig: config.tsConfigPath,
  });
  const project = await app.convert();
  // let state, effects;
  if (project) {
    const result = app.serializer.projectToObject(project, process.cwd());
    result.children?.forEach((item) => {
      const [modelName, subModelName, modelPart] = item.name.split('_');
      try {
        // @ts-expect-error: do not know
        models[modelName].subModels[subModelName][modelPart] = item.type?.declaration.children;
      }catch(e) {
        console.error(e);
      }
    })
  }
  // 删除文件
  await fs.remove(exportfileName);
  return models;
}



// 以下是测试代码
docify('../rx-btrip-flight/models', {
  tsConfigPath: path.resolve(cwd, '../rx-btrip-flight/tsconfig.json'),
});