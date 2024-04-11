import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      decodedContents: []
    };
  },
  mutations: {
    addDecodedContent(state, content) {
      state.decodedContents.push(content);
    }
  }
});
