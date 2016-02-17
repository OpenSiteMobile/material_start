(function(){

  angular
       .module('users')
       .controller('UserController', [
          'userService', '$mdSidenav', '$mdBottomSheet', '$log', '$q',
          UserController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function UserController( userService, $mdSidenav, $mdBottomSheet, $log, $q) {
    var self = this;

    self.selected     = null;
    self.users        = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.showContactOptions  = showContactOptions;

    // Load all registered users

    userService
          .loadAllUsers()
          .then( function( users ) {
            self.users    = [].concat(users);
            self.selected = users[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $log.debug('UserController.js - toggleUsersList -> called.');

      var pending = $mdBottomSheet.hide();

      if (!pending) {
        pending = $q.when(true);
        pending.$$state.name += ':app_when_toggleUsersList';
      }

      pending.then(function(){
        $log.debug('UserController.js - toggleUsersList -> then called.');
        $mdSidenav('left').toggle();
      });
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
      $log.debug('UserController.js - selectUser -> called.');
  
      self.selected = angular.isNumber(user) ? $scope.users[user] : user;
      self.toggleList();
    }

    /**
     * Show the bottom sheet
     */
    function showContactOptions($event) {
        var user = self.selected;

        $log.debug('UserController.js - showContactOptions -> called.');

        /**
         * Bottom Sheet controller for the Avatar Actions
         */
        function ContactPanelController( $mdBottomSheet ) {
          $log.debug('UserController.js - ContactPanelController -> called.');

          this.user = user;
          this.actions = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: './app/assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: './app/assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: './app/assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: './app/assets/svg/hangouts.svg'}
          ];
          this.submitContact = function(action) {
            $log.debug('UserController.js - ContactPanelController - submitContact -> called.');
            $mdBottomSheet.hide(action);
          };
        }

        return $mdBottomSheet.show({
          parent: angular.element(document.getElementById('content')),
          templateUrl: './app/src/users/view/contactSheet.html',
          controller: [ '$mdBottomSheet', ContactPanelController],
          controllerAs: "cp",
          bindToController : true,
          targetEvent: $event
        }).then(function(clickedItem) {
          clickedItem && $log.debug('UserController.js - ContactPanelController -> ' + clickedItem.name + ' clicked!');
        });
    }

  }

})();
