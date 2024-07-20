import anime from "animejs";

class LoadingIndicator extends HTMLElement {
  #_shadowRoot = null;
  #style = null;

  constructor() {
    super() 

    this.#_shadowRoot = this.attachShadow({ mode: 'open' });
    this.#style = document.createElement('style');

    this.#render();
  }

  #clearContent() {
    this.#_shadowRoot.innerHTML = '';
  }

  #updateStyle() {
    this.#style.textContent = `
      .wrapper {
        display: flex; 
        flex-direction: row;
        align-items: baseline;
        padding-inline: 16px;
        gap: 8px;
      }

      .loadingText {
        color: var(--blue-primary);
        font-size: 1.2em;
      }

      .animatedBall {
        border-radius: 100%;
        width: 12px;
        height: 12px;

        background-color: #071952;
      }
    `;
  }

  #render() {
    this.#updateStyle();
    this.#clearContent();

    this.#_shadowRoot.appendChild(this.#style);
    this.#_shadowRoot.innerHTML += `
      <div class="wrapper">
        <div class="loadingText"><slot>Loading</slot></div>
        <div class="animatedBall"></div>
      </div>
    `;

    anime({
      targets: this.#_shadowRoot.querySelector('.animatedBall'),
      translateX: 30,
      easing: 'easeInOutQuad',
      direction: 'alternate',
      loop: true,
      duration: 600,
      backgroundColor: '#37B7C3',
    });
  }
}

customElements.define('loading-indicator', LoadingIndicator);