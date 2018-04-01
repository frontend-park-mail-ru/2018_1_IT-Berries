define('ProfileView', function (require) {
  const View = require('View');
  const UsersModel = require('UsersModel');

  return class ProfileView extends View {
    constructor() {
      super('profileViewTmplTemplate');
    }

    allowed() {
      return UsersModel.isAuthorized();
    }

    render() {
      const attrs = {
        profile: UsersModel.getCurrentUser()
      };

      return super.render(attrs);
    }
  };
});
