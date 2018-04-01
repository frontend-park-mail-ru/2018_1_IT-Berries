define('AboutView', function (require) {
  const View = require('View');

  return class ProfileView extends View {
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
