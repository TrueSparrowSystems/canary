class PaginatedListDataSource {
  constructor(params = {}) {
    this.reloadId = 0;
    const {numberOfColumnsPortrait, numberOfColumnsLandscape} = params;
    this.numberOfColumnsPortrait = numberOfColumnsPortrait || 1;
    this.numberOfColumnsLandscape = numberOfColumnsLandscape || 1;
    this.viewData = {};
    this.visibleItems = null;
    this.listStateData = null;
    this.resetInitialIndex = true;
    this.apiCall.bind(this);
    this.processData.bind(this);
    this.getComponentData.bind(this);
    this.setComponentData.bind(this);
    this.clearViewData.bind(this);
    this.onResponse.bind(this);
    this.updateVisibleData.bind(this);
    this.updateReloadIdentifier.bind(this);
  }

  updateReloadIdentifier() {
    this.reloadId++;
  }

  apiCall() {
    return Promise.resolve();
  }

  processData(response) {
    return [];
  }

  filterAllData({allData}) {
    return allData;
  }

  getComponentData() {
    return this.listStateData;
  }

  setComponentData(componentState) {
    this.listStateData = componentState;
  }

  updateVisibleData(viewableItems) {
    this.visibleItems = viewableItems;
  }

  clearViewData() {
    this.resetInitialIndex = true;
    this.viewData = {};
    this.listStateData = null;
    this.visibleItems = null;
  }

  onResponse(response) {
    return response;
  }

  getInitialIndex() {
    let indexData = {landscape: 0, portrait: 0};
    if (
      this.visibleItems &&
      this.visibleItems.length > 0 &&
      !this.resetInitialIndex
    ) {
      const visibleIndex = this.visibleItems[0].index;
      const landscapeIndex = Math.floor(
        visibleIndex / this.numberOfColumnsLandscape,
      );
      const portraitIndex = Math.floor(
        visibleIndex / this.numberOfColumnsPortrait,
      );
      indexData = {landscape: landscapeIndex, portrait: portraitIndex};
    }
    this.resetInitialIndex = false;
    return indexData;
  }
}
export default PaginatedListDataSource;
