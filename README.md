文档化流程

遍历 models 目录，为每个页面生成相应的端领域模型文档
找到各 model 目录下的 index.ts文件，找到 export 导出的 model 文件
遍历这些文件，对其进行AST解析，生成AST树，找出其中的 state, reduce, effects 三个对象及对应注释。

基于每个AST树，生成相应的 模型 scheme 文件，结构如下：
```
{
  "modelName": "模型名称, 如 search-list",
  "subModelName": "子模型名称, 如 pageData",
  // 依赖的所有引用类型声明
  "interfaces":{
    "typeA": {
      desc: '',
      fields: [{
        name: 'typeB',
        type: 'reference'
      }, {
        name: 'name',
        type: 'string',
      }]
    }
  },
  "states": [{
    name: '',
    type: 'typeA',
    desc: ''




    
  }],
  "reduce": [{

  }],
  "effects": [{

  }],
}
``` 

基于每个schema 完成文档页面渲染。

布局如下：
左侧为目录，如下：

- 模型名称
  - 子模型名称
  - 子模型名称

中间为内容，目录控制中间的内容

然后，中间又分为左右布局
左侧为实际详细文档，右侧为模型结构快速滚动导航，如下：
- state 部分
  - 状态A
  - 状态B
- reduce 部分
  - reduce A
  - reduce B
- effects 部分
  - effects A
  - effects B

每个应用对应一个文档站点，站点名为应用名
一个应用下，会有多个模型（一般一个页面对应一个模型）
一个模型下会包含多个子模型（一般为main, mtop 等等）
一个子模型包含三个部分（state, reduce, effects）



每个模型生成一个d.ts，只需要一个，babel 对这个d.ts文件进行解析，生成json 结构