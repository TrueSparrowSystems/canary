class NavigationService {
  // Current navigation object.
  currentNavigator = null;

  constructor() {
    this.setCurrentNavigator.bind(this);
  }

  /**
   * Function to set the current navigation object of the app.
   * @param {Object} navigator Current object used for navigation in the app.
   */
  setCurrentNavigator(navigator) {
    this.currentNavigator = navigator;
  }

  navigate(screenName, data) {
    this.currentNavigator.navigate(screenName, data);
  }
}

export default new NavigationService();
