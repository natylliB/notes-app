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
}

export default Utils;