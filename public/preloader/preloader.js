window.AudioContext = window.AudioContext || window.webkitAudioContext;

new class Preloader {

  constructor() {
    switch (window.location.hostname) {
    case 'it-berries.neat.codes':
      this._basePath = '';
      break;
    default:
      this._basePath = '/dist';
    }

    //this.player = document.getElementById('audioPlayer');
    //this.player.play();

    //URL до аудио файла (mp3, ogg, wav)
    //this.play('fault-the-police.mp3', 1);

    /*window.audioCtx_1 = new AudioContext();
    window.gainNode_1 = window.audioCtx_1.createGain ? window.audioCtx_1.createGain() : window.audioCtx_1.createGainNode();
    window.audioCtx_2 = new AudioContext();
    window.gainNode_2 = window.audioCtx_2.createGain ? window.audioCtx_2.createGain() : window.audioCtx_2.createGainNode();

    this.play('star-trek.mp3', 0.5, window.audioCtx_1, window.gainNode_1);
    this.play('fault-the-police.mp3', 0.5, window.audioCtx_2, window.gainNode_2);*/

    window.musicCtx = new AudioContext();
    window.musicNode = window.musicCtx.createGain ? window.musicCtx.createGain() : window.musicCtx.createGainNode();
    this.loadSound(window.musicCtx, window.musicNode);
    window.soundCtx = new AudioContext();
    window.soundNode = window.soundCtx.createGain ? window.soundCtx.createGain() : window.soundCtx.createGainNode();
    window.soundNode.connect(window.soundCtx.destination);       // connect the source to the context's destination (the speakers)
    if (localStorage) {
      let vol = localStorage.getItem('soundVol');
      if (vol === 0 || vol === null) {
        window.soundNode.gain.value = 0.5;
      } else {
        window.soundNode.gain.value = vol;
      }
    } else {
      window.soundNode.gain.value = 0.5;
    }
    this.loadBufer(window.soundCtx, window.soundNode);
    
    window.soundPlay = function() {
      window.soundCtx.resume();
      let source = window.soundCtx.createBufferSource(); // creates a sound source
      source.buffer = window.soundBufer;                    // tell the source which sound to play
      source.connect(window.soundNode);
      window.sound = source;
      window.sound.start();
      window.soundCtx.suspend();
    };

    this._application = document.getElementsByClassName('application')[0];

    document.addEventListener('DOMContentLoaded', async () => {
      await this.start();
      this.showCurrentTheme();
    });

  }

  loadBufer(audioCtx, node) {
    let request = new XMLHttpRequest();
    request.open('GET', 'pop.mp3', true);

    request.responseType = 'arraybuffer';

    request.onload = function() {
      let audioData = request.response;

      audioCtx.decodeAudioData(audioData, function(buffer) {
        window.soundBufer = buffer;
        let source = window.soundCtx.createBufferSource(); // creates a sound source
        source.buffer = window.soundBufer;                    // tell the source which sound to play
        source.connect(window.soundNode);
        window.sound = source;
        window.sound.start();
        window.soundCtx.suspend();
      },

      function(e) {
      });

    };

    request.send();
  }

  loadSound(audioCtx, node) {
    let source = audioCtx.createBufferSource();
    let request = new XMLHttpRequest();

    request.open('GET', 'music.mp3', true);

    request.responseType = 'arraybuffer';

    request.onload = function() {
      let audioData = request.response;

      audioCtx.decodeAudioData(audioData, function(buffer) {
        let myBuffer = buffer;
        source.buffer = myBuffer;
        source.connect(node);
        node.connect( audioCtx.destination );
        if (localStorage) {
          let vol = localStorage.getItem('musicVol');
          if (vol === 0 || vol === null) {
            node.gain.value = 0.5;
          } else {
            node.gain.value = vol;
          }
        } else {
          node.gain.value = 0.5;
        }
        source.loop = true;
        window.musicTheme = source;
        window.musicTheme.start(0);
        if (localStorage) {
          let bool = localStorage.getItem('musicIsOn');
          if (bool !== null
            && bool !== undefined
            && bool === 'false') {
            window.musicCtx.suspend();
          }
        }

      },

      function(e) {
      });

    };

    request.send();
  }

  /*async playerStart() {

    function finishedLoading(bufferList) {

      // Create two sources and play them both together.
      let source1 = context.createBufferSource();
      let source2 = context.createBufferSource();
      source1.buffer = bufferList[0];
      source2.buffer = bufferList[1];

      source1.connect(context.destination);
      source2.connect(context.destination);
      source1.start(0);
      source2.start(0);
    }

    class BufferLoader {
      constructor(context, urlList, callback) {
        this.context = context;
        this.urlList = urlList;
        this.onload = callback;
        this.bufferList = new Array();
        this.loadCount = 0;
      }

      loadBuffer(url, index) {

        // Load buffer asynchronously
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        let loader = this;

        request.onload = async function () {
          let audioData = request.response;

          // Asynchronously decode the audio file data in request.response
          await loader.context.decodeAudioData(
            audioData,
            function (buffer) {
              if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
              }
              loader.bufferList[index] = buffer;
              if (++loader.loadCount === loader.urlList.length) {
                loader.onload(loader.bufferList);
              }
            },
            function (error) {
              alert('decodeAudioData error: ' + error);
            }
          );
        };

        request.onerror = function () {
          alert('BufferLoader: XHR error');
        };

        request.send();
      }

      async load() {
        for (let i = 0; i < this.urlList.length; ++i) {
          this.loadBuffer(this.urlList[i], i);
        }
        return Promise.resolve();
      }
    }

    let context;
    let bufferLoader;

    context = new AudioContext();

    bufferLoader = new BufferLoader(
      context,
      [
        '/star-trek.mp3',
        '/fault-the-police.mp3'
      ],
      finishedLoading
    );

    await bufferLoader.load();

  }*/

  /*play (snd, vol = 1, context, node) {

    let request = new XMLHttpRequest();
    request.open( 'GET', snd, true );
    request.responseType = 'arraybuffer';
    request.onload = function () {
      let audioData = request.response;

      context.decodeAudioData(
        audioData,
        function ( buffer ) {
          let smp = context.createBufferSource();
          smp.buffer = buffer;

          //создание объекта GainNode и его привязка
          smp.connect( node );
          node.connect( context.destination );
          node.gain.value = vol;
          smp.start( 0 );
        },
        function ( e ) {
          alert( 'Error with decoding audio data' + e.err );
        }
      );
    };
    request.send();
  }*/

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