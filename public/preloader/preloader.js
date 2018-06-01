new class Preloader {

  constructor() {
    switch (window.location.hostname) {
    case 'it-berries.neat.codes':
      this._basePath = '';
      break;
    default:
      this._basePath = '/dist';
    }

    document.getElementById('audioPlayer').play();

    this._application = document.getElementsByClassName('application')[0];

    document.addEventListener('DOMContentLoaded', async () => {
      await this.start();
      this.showCurrentTheme();
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
    }, 4000);
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
    this.errormsg.classList.add('preloader');
    this.errormsg.innerHTML = '<div class=preloader-error>Application loading failed:(</div>';
    this.application.removeChild(this.preloader);
    this.application.appendChild(this.errormsg);
  }

  async loadApplication() {
    return Promise.all([
      this.loadScript(this._basePath + '/bundle.js'),
      this.loadCss(this._basePath + '/bundle.css'),
      this.loadImage('/images/about-btn-original.png'),
      this.loadImage('/images/settings-btn-original.png'),
      this.loadImage('/images/scoreboard-btn-original.png'),
      this.loadImage('/images/login-btn-original.png'),
      this.loadImage('/images/play-btn-original.png'),
      this.loadImage('/images/mid_ground.png'),
      this.loadImage('/images/fore_ground.png')
    ]);
  }

  addLoadResultListeners(element, url) {
    element.onload = () => {
      return Promise.resolve(url);
    };
    element.onerror = () => {
      this.showErrorLoadResult();
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

  showCurrentTheme() {
    if (localStorage) {

      this.theme = localStorage.getItem('theme');
      this.vpn = localStorage.getItem('vpn');

      if (!this.vpn) {
        this.vpn = localStorage.setItem('vpn', 'false');
      }

      if (this.theme !== '1' && this.theme !== '2') {
        this.theme = localStorage.setItem('theme', '1');
      }

      if (this.vpn == 'true') {
        this._application.classList.remove('application_theme-1');
        this._application.classList.add('application_theme-vpn');
      } else {
        switch (this.theme) {
        case '1':
          break;
        case '2':
          this._application.classList.remove('application_theme-1');
          this._application.classList.add('application_theme-2');
          break;
        }
      }

    }
  }

};