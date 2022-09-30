class NavigationService {
  // Current navigation object.
  currentNavigator = null;

  constructor() {
    this.setCurrentNavigator.bind(this);
    this.getCurrentRouteName.bind(this);
  }

  /**
   * Function to set the current navigation object of the app.
   * @param {Object} navigator Current object used for navigation in the app.
   */
  setCurrentNavigator(navigator) {
    this.currentNavigator = navigator;
  }

  getCurrentRouteName() {
    return this.currentNavigator?.getCurrentRoute?.()?.name;
  }

  navigate(screenName, data) {
    this.currentNavigator.navigate(screenName, data);
  }
}

export default new NavigationService();
