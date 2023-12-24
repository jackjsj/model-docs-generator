export default {
  state: {
    count: 1,
  },

  effects: {
    /**
     * 修改当前计数
     * @param count 
     */
    async changeCount(count: number) {
      this.setState(count);
    }
  }
}