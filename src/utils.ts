// -命名转驼峰命名
export const toCamelCase = (str: string) => {
  return str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
};
// 驼峰转-命名
export const toKebabCase = (str: string) => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
};