type IPerson = {
  /**
   * 姓名
   */
  name: string;
  /**
   * 年龄
   */
  age: number;
}

interface IState {
  /**
   * 计数
   */
  count: number;

  /**
   * 名字
   */
  name?: string;

  /**
   * 人员信息
   */
  person: IPerson;
}

const initState: IState = {
  count: 1,
  person: {
    name: 'Jesse',
    age: 18,
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