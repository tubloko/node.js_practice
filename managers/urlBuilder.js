module.exports = {
  /**
   * @param listId
   * @return {string}
   */
  makeListTasksUrl(listId) {
    return `/tasks-list?listId=${listId}`;
  },
};
