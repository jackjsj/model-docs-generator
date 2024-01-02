interface IOptions {
  tsConfigPath?: string;
}

interface IModel {
  name: string;
  subModels: Record<string, ISubModel>;
}

interface ISubModel {
  name: string;
  state?: any;
  effects?: any;
}

/**
 * 状态描述
 */
interface IStateDesc {
  /**
   * 状态名
   */
  name: string;
  /**
   * 注释
   */
  comment: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 是否可选
   */
  isOptional?: boolean;
}