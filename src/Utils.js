class Utils {
  static clearElement(element) {
    element.innerHTML = '';
  }
  static hideElement(element) {
    element.style.display = 'none';
    element.hidden = true;
  }
  static showElement(element) {
    element.style.display = 'block';
    element.hidden = false;
  }
  static hideElementsIn(element) {
    Array.from(element).forEach((child) => Utils.hideElement(child));
  }
}

export default Utils;