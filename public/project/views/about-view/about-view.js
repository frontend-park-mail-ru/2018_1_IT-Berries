define('AboutView', function (require) {
  const View = require('View');

  return class AboutView extends View {
    constructor() {
      super('aboutViewTmplTemplate');
    }

    allowed() {
      return true;
    }

    render() {
      const attrs = {};

      return super.render(attrs);
    }
  };
});
