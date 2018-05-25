new class Preloader {

  constructor() {
    document.addEventListener('DOMContentLoaded', async () => {
      await this.start();
    });
  }

  async start() {
    this.showLoader();
    setTimeout(async () => {
      try {
        await this.loadApplication();
      } catch (error) {
        this.showErrorLoadResult();
      }
    }, 2000);
  }

  showLoader() {
    this.application = document.getElementsByClassName('application')[0];
    this.preloader = document.createElement('div');
    this.preloader.classList.add('preloader');
    this.preloader.innerHTML = '<div class=preloader_planet><div class="preloader_text">Loading</div></div><div class=preloader_rocket></div>';
    this.application.appendChild(this.preloader);
  }

  showErrorLoadResult() {
    this.application = document.getElementsByClassName('application')[0];
    this.errormsg = document.createElement('div');
    this.errormsg.classList.add('preloader-container');
    this.errormsg.innerHTML = 'Application loading failed.';
    this.application.removeChild(this.preloader);
    this.application.appendChild(this.errormsg);
  }

  async loadApplication() {
    return Promise.all([
      this.loadScript('/bundle.js'),
      this.loadScript('/runtime.js'),
      this.loadCss('/bundle.css'),
      this.loadImage('/images/about-btn-original.png'),
      this.loadImage('/images/settings-btn-original.png'),
      this.loadImage('/images/scoreboard-btn-original.png'),
      this.loadImage('/images/login-btn-original.png'),
      this.loadImage('/images/play-btn-original.png'),
      this.loadImage('/images/sky.png'),
    ]);
  }

  addLoadResultListeners(element, url) {
    element.onload = function() {
      return Promise.resolve(url);
    };
    element.onerror = function() {
      return Promise.reject(url);
    };
  }

  loadImage(url) {
    let img = new Image();
    this.addLoadResultListeners(img, url);
    img.src = url;
  }

  loadCss(url) {
    let css = document.createElement('link');
    this.addLoadResultListeners(css, url);
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css['href'] = url;
    document['head'].appendChild(css);
  }

  loadScript(url) {
    let script = document.createElement('script');
    this.addLoadResultListeners(script, url);
    script.async = true;
    script['src'] = url;
    document['body'].appendChild(script);
  }

};