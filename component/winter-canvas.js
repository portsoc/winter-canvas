/* eslint-disable no-useless-constructor */

import * as snow from './snow-util.js';

class WinterCanvas extends HTMLElement {
  constructor() {
    super();

    this.MAX_SETTLED = 10000;
    this.animate = this.animate.bind(this);
  }

  get width() {
    return this.getAttribute('width');
  }

  set width(value) {
    this.setAttribute('width', value);
  }

  get height() {
    return this.getAttribute('height');
  }

  set height(value) {
    this.setAttribute('height', value);
  }

  get snowing() {
    return this.getAttribute('snowing');
  }

  set snowing(value) {
    this.setAttribute('snowing', value);
  }

  connectedCallback() {
    if (!this.shadow) {
      this.shadow = this.attachShadow({ mode: 'closed' });
      this.canvas = document.createElement('canvas');
      this.c = this.canvas.getContext('2d');
      this.settledCount = 0;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.shadow.append(this.canvas);
    }
  }

  disconnectedCallback() {
    this.snowing = false;
  }

  static get observedAttributes() {
    return ['snowing', 'width', 'height'];
  }

  // todo: are attribute values (prev, curr) always string?
  attributeChangedCallback(name, prev, curr) {
    if (name === 'snowing') {
      if (curr !== false) {
        this.animate();
      }
    } else if (name === 'width') {
      if (this.canvas) this.canvas.width = curr;
    } else if (name === 'height') {
      if (this.canvas) this.canvas.height = curr;
    }
  }

  getContext(what) {
    if (what !== '2d') throw new TypeError('winter-canvas only does "2d" context');
    return this.c;
  }

  getImageData(...params) {
    return this.canvas.getImageData(...params);
  }

  checkBoolAttr(name) {
    return this.hasAttribute(name) && this.getAttribute(name) !== 'false';
  }


  checkOptionAttr(name, htmlName, options) {
    if (this.hasAttribute(htmlName)) options[name] = Number(this.getAttribute(htmlName));
  }

  getFlakeOptions() {
    const retval = {};
    this.checkOptionAttr('FLAKE_COUNT', 'flake-count', retval);
    this.checkOptionAttr('MAX_FLAKE_SIZE', 'max-flake-size', retval);
    this.checkOptionAttr('MAX_SY', 'max-sy', retval);
    this.checkOptionAttr('MIN_SY', 'min-sy', retval);
    this.checkOptionAttr('MAX_SX', 'max-sx', retval);
    return retval;
  }

  animate() {
    if (this.flakes == null) this.flakes = snow.initSnow(this.c, this.getFlakeOptions());
    if (this.savedPicture) snow.restoreCanvasPicture(this.c, this.savedPicture);
    const settledFlakes = snow.moveSnow(this.c, this.flakes);
    if (this.settledCount < this.MAX_SETTLED) snow.drawSnow(this.c, settledFlakes);
    this.settledCount += settledFlakes.length;
    this.savedPicture = snow.saveCanvasPicture(this.c);

    snow.drawSnow(this.c, this.flakes);

    if (this.checkBoolAttr('snowing')) window.requestAnimationFrame(this.animate);
  }
}

customElements.define('winter-canvas', WinterCanvas);
