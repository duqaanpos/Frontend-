var Duqaan = angular.module('Duqaan', ['ui.bootstrap', 'ngAside', 'ngRoute','DuqaanControllers', 'ngCordova', 'ngMaterial']);

Duqaan.config(['$routeProvider', function($routeProvider) {
                      $routeProvider.
                    when('/login' ,{
                         templateUrl: 'templates/duqaan/LoginScreen.html',
                         controller: 'DuqaanLoginCtrl'
                      }).
                    when('/registerBasic' ,{
                       templateUrl: 'templates/duqaan/RegistrationBasic.html',
                       controller: 'DuqaanRegistrationBasicCtrl'
                      }).
                    when('/registerComplete' ,{
                        templateUrl: 'templates/duqaan/RegistrationComplete.html',
                        controller: 'DuqaanRegistrationCompleteCtrl'
                      }).
                    when('/welcome' ,{
                        templateUrl: 'templates/duqaan/Welcome.html',
                        controller: 'WelcomeCtrl'
                      }).
                    when('/dashboard' ,{
                        templateUrl: 'templates/duqaan/Dashboard.html',
                        controller: 'DashboardCtrl'
                      }).
                    when('/pos' ,{
                        templateUrl: 'templates/duqaan/POS.html',
                        controller: 'POSCtrl'
                      }).
                    when('/payment/:id/:items/:totalSum' ,{
                        templateUrl: 'templates/duqaan/PaymentScreen.html',
                        controller: 'PaymentScreenCtrl'
                      }).
                    when('/employeeDetails' ,{
                        templateUrl: 'templates/duqaan/employee/EmployeeDetails.html',
                        controller: 'EmployeeDetailsCtrl'
                      }).
                    when('/employeeInformation/:emp_id' ,{
                        templateUrl: 'templates/duqaan/employee/EmployeeInformation.html',
                        controller: 'EmployeeInformationCtrl'
                      }).
                    when('/newEmployee' ,{
                        templateUrl: 'templates/duqaan/employee/NewEmployee.html',
                        controller: 'NewEmployeeCtrl'
                      }).
                    when('/empAttendance' ,{
                        templateUrl: 'templates/duqaan/employee/EmpAttendance.html',
                        controller: 'EmpAttendanceCtrl'
                      }).
                    when('/attendanceInfo' ,{
                        templateUrl: 'templates/duqaan/employee/AttendanceInformation.html',
                        controller: 'AttendanceInformationCtrl'
                      }).
                    when('/customerDetails' ,{
                        templateUrl: 'templates/duqaan/employee/CustomerDetails.html',
                        controller: 'CustomerDetailsCtrl'
                      }).
                    when('/customerInformation/:id', {
                        templateUrl: 'templates/duqaan/employee/CustomerInformation.html',
                        controller: 'CustomerInformationCtrl'
                    }).
                    when('/transactionHistory' ,{
                        templateUrl: 'templates/duqaan/TransactionHistory.html',
                        controller: 'transactionHistoryCtrl'
                      }).
                    when('/transactionHistoryDetails/:id' ,{
                        templateUrl: 'templates/duqaan/TransactionHistoryDetails.html',
                        controller: 'TransactionHistoryDetailsCtrl'
                      })
                    .otherwise({
                        redirectTo: '/login',
                      });
      }
   ]);

Duqaan.filter('unique', function() {
   return function(collection, keyname) {
      var output = [],
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });

      return output;
   };
});

Duqaan.run(function($rootScope, $window,$location,$cordovaDialogs,$http,$cordovaNetwork,$aside, $cordovaSpinnerDialog, $route) {


    document.addEventListener("deviceready", function() {
                  var push = PushNotification.init({
                	    android: {
                	        "senderID": "674992289180",
                	        "icon": "screen-16",
                            "iconColor": "orange"
                	    }
                	});

                	push.on('registration', function(data) {
                         localStorage.setItem("DeviceToken",data.registrationId);
                	});

                	push.on('notification', function(data) {
                    if(data.additionalData.type == "1001"){
                         $cordovaDialogs.alert(data.message).then(function(){
                            $route.reload();
                             $location.path('/providerRequestAcceptForm/'+data.additionalData._id);
                         });
                    }else if(data.additionalData.type == "1002"){
                       $cordovaDialogs.alert(data.message).then(function(){
                          $route.reload();
                           $location.path('/customerRequestAcceptProviderDetail/'+data.additionalData.requestId+'/'+data.additionalData.serviceProviderId);
                       });
                    }else if(data.additionalData.type == "1004"){
                        $cordovaDialogs.alert(data.message).then(function(){
                           $route.reload();
                           $location.path('/customerAcceptedProviderRequest/'+data.additionalData.requestId+'/'+data.additionalData.customerId+'/'+data.additionalData.responseId);
                       });
                    }else if(data.additionalData.type == "1006"){
                         $cordovaDialogs.alert(data.message).then(function(){
                            $route.reload();
                            $location.path('/customerOnTheWay/'+data.additionalData.requestId+'/'+data.additionalData.serviceProviderId+'/'+data.additionalData.responseId);
                        });
                     }else if(data.additionalData.type == "1007"){
                       $cordovaDialogs.alert(data.message).then(function(){
                          $route.reload();
                          $location.path('/customerHomePage');
                      });
                     }else if(data.additionalData.type == "1008"){
                       $cordovaDialogs.alert(data.message).then(function(){
                          $route.reload();
                          $location.path('/customerRating/'+data.additionalData.requestId+'/'+data.additionalData.serviceProviderId+'/'+data.additionalData.responseId);
                      });
                   }else {
                        alert(data.message);
                        $route.reload();
                        }
                	});

                	push.on('error', function(e) {
                	});
                  }, false);

     $rootScope.$on('$routeChangeStart', function() {

                        $rootScope.asideState = {
                          open: false
                        };

                        $rootScope.openAside = function(position, backdrop, class1){
                          $rootScope.asideState = {
                            open: true,
                            position: position
                          };

                          $rootScope.class= class1;

                          function postClose() {
                            $rootScope.asideState.open = false;
                          }

                          $aside.open({
                            templateUrl: 'templates/duqaan/menu.html',
                            placement: position,
                            size: 'sm',
                            backdrop: backdrop,
                            controller: function($scope, $uibModalInstance, $location, $cordovaSpinnerDialog) {

                                    $scope.customer_name = localStorage.getItem("user_full_name");
                                    $scope.customer_phone_number = localStorage.getItem("user_phone_number");
//                                    $scope.customer_name = "Abhay Pratap Singh";
//                                        if(localStorage.getItem("profile_image") == "null"){
//                                            $scope.profile_pic = "default-user.png";
//                                         }else{
//                                             $scope.profile_pic = localStorage.getItem("profile_image");
//                                         }

                             document.addEventListener("click", function(e) {
                                       if(backdrop != true){
                                           backdrop = false;
                                            $uibModalInstance.dismiss();
                                            e.stopPropagation();
                                       }else{
                                            backdrop = false;
                                       }
                              });

                              $scope.homeClicked = function(){
                                      $rootScope.selectedTab = "home";
                                      $uibModalInstance.dismiss();
                                      $location.path('/welcome');
                                }

                              $scope.profileClicked = function(){
                                    $rootScope.selectedTab = "myProfile";
                                    $uibModalInstance.dismiss();
                                    $rootScope.message();
                              }

                              $scope.employeeDetails = function(){
                                    $rootScope.selectedTab = "employee";
                                    $uibModalInstance.dismiss();
                                        $location.path('/employeeDetails');
                              }

                               $scope.customerDetails = function(){
                                    $rootScope.selectedTab = "customer"
                                     $uibModalInstance.dismiss();
                                         $location.path('/customerDetails');
                               }

                               $scope.transactionHistory = function(){
                                   $rootScope.selectedTab = "transactionHistory";
                                   $uibModalInstance.dismiss();
                                   $location.path('/transactionHistory');
                               }

                              $scope.resetPasswordClicked = function(){
                              $rootScope.selectedTab = "resetPassword";
                               $uibModalInstance.dismiss();
                               $rootScope.message();
                              }

                              $scope.posClicked = function(){
                              $rootScope.selectedTab = "pos";
                               $uibModalInstance.dismiss();
                               $location.path('/pos');
                              }

                               $scope.aboutClicked = function(){
                               $rootScope.selectedTab = "about";
                                     $uibModalInstance.dismiss();
                                     $rootScope.message();
                               }
                                $scope.logoutClicked = function(){
                              $rootScope.selectedTab = "logout"

                              $cordovaDialogs.confirm("Are you sure? Do you want to logout from Duqaan App","Alert",['OK','Cancel']).
                                then(function(buttonIndex){
                                    if(buttonIndex == 1){
                                        $uibModalInstance.dismiss();
                                        localStorage.clear();
                                       window.plugins.toast.showShortCenter("Successfully logout");
                                       $location.path('/login');
//                                       $scope.device_id = toaster.getdeviceId();
//                                       $scope.device_token = localStorage.getItem("DeviceToken");
//                                        $scope.device_type = "1";
//                                            var req = {
//                                            method: 'POST',
//                                            url: baseURL + 'users/logout',
//                                            headers: {'x-access-token': header },
//                                            data: {
//                                                 _id : localStorage.getItem("user_id"),
//                                                 device_id: $scope.device_id,
//                                                 device_token: $scope.device_token,
//                                                 device_type: $scope.device_type
//                                            }
//
//                                           }
//
//                                           $cordovaSpinnerDialog.show("Please Wait..","", true);
//                                           var res = $http(req);
//                                           console.log("Logout  parameter: " + JSON.stringify(req));
//                                           res.success(function(data, status, headers, config) {
//                                              $cordovaSpinnerDialog.hide();
//                                            console.log("login api response: " + JSON.stringify(data));
//
//                                            if (data.data.status == "1") {
//                                                  var token = localStorage.getItem("DeviceToken");
//                                                    $window.localStorage.clear();
//                                                    localStorage.setItem("DeviceToken",token);
//                                                 $rootScope.next();
//                                                  $location.path('/home');
//                                            } else if (data.data.status == "0") {
//                                                window.plugins.toast.showShortCenter(data.data.msg);
//                                            } else {
//                                                window.plugins.toast.showShortCenter(serverMessage);
//                                            }
//                                           });
//                                           res.error(function(data, status, headers, config) {
//                                              $cordovaSpinnerDialog.hide();
//                                            if (!$cordovaNetwork.isOnline()) {
//                                                window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
//                                            } else {
//                                                 window.plugins.toast.showShortCenter(serverMessage);
//                                            }
//                                                console.log("login api failure message: " + JSON.stringify({ data: data }));
//                                           });
                                    }else{
                                        $uibModalInstance.dismiss();
                                    }
                                });
                              }
                            }
                          }).result.then(postClose, postClose);
                        }

                 //event button to move backward
                     $rootScope.back = function() {
                         $rootScope.slide = 'slide-right';
                         $window.history.back();
                         window.scrollTo(0, 0);
                     }
                     //event button item list to move forward
                     $rootScope.next = function() {
                        window.scrollTo(0, 0);
                     }

                     $rootScope.message=function(){
                        $cordovaDialogs.alert("Under Construction.","HAHA","Ok").then(function(){

                        });
                     }
 });
 });

document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown() {
	var page=localStorage.getItem("page_id");
	switch (parseInt(page)) {
	case 1:
	case 5:
			navigator.notification.confirm(
    				'Do you want to exit from Duqaan App?',
    				onConfirmLOGOUT,
    				'Attention',
    				['Cancel','Confirm']
    		);
    		break;
	case 3:
	        break;
	default:
		window.history.go(-1);
	break;
	}
}

function onConfirmLOGOUT(buttonIndex) {
	if(buttonIndex == 2){
		setTimeout(function() {
			toaster.finishApp();			
		}, 100);
	}		
}
