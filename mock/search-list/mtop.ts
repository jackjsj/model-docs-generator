interface IState {
  /**
   * 计数
   */
  count: number;

  /**
   * 部门
   */
  department: {
    /**
     * 部门名称
     */
    name: string;
    /**
     * 资产
     */
    price: number;
  };
}

const initState: IState = {
  count: 1,
  department: {
    name: '部门',
    price: 3000,
  }
}

/**
 * 主模型
 */
export default {
  state: initState,
  reduces: {

  },
  effects: {
    /**
     * 设置当前计数
     * @param count - 计数
     */
    async setCount(count: number) {
      console.log(count);
    },

    /**
     * 打招呼
     * 
     * @internal
     */
    async sayHello() {
      console.log('hello')
    }
  }
}