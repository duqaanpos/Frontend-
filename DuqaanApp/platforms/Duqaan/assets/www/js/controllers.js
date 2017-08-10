var DuqaanCtrl = angular.module("DuqaanControllers", []);

//var baseURL = "http://pimppros.onsisdev.info:5084/api/";
//var baseURL = "http://192.168.1.8:3000/";
var baseURL = "http://35.189.139.110:3000/";
//var baseURL = "http://52.91.149.107:3000/";

var header="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2ZWVyZW5kcmEiOiJkZXZlbmRyYSIsImlhdCI6MTQ3Mzg1MDYwNH0.YoeHbbF_GQdj1bvMwHzJU0R0KXyij11JfhL2HgyMEyg";
var serverMessage = "There is a problem with our system. We apologize for the inconvenience caused. Please try again later. If the problem persist, please contact at support@pimppros.com.";

//Login Controller

//Login
DuqaanCtrl.controller("DuqaanLoginCtrl", function($scope, $rootScope, $location, $http, $cordovaDialogs, $cordovaSpinnerDialog, $cordovaNetwork){

        localStorage.setItem("page_id", "1");

            $scope.user_name = "";
            $scope.password = "";

            var user_id = localStorage.getItem("user_id");
            var business_details_status = localStorage.getItem("business_details_status");

//            alert(business_details_status);

            if(user_id != null && user_id.length > 0 ){
                if(business_details_status){
                    $location.path("/welcome");
                }else{
//                    window.plugins.toast.showShortCenter("Please fill your business details");
                    $location.path("/registerComplete");
                }
            }

            $scope.registration= function() {
                $location.path('/registerBasic');
            }

            $scope.dialNumber = function(number) {
              window.open('tel:' + number, '_system');
            }

            $scope.loginClicked = function($val) {
                if($val == true){
                  var dataObj = {
                        username : $scope.user_name,
                        password : $scope.password
                    };
                    $cordovaSpinnerDialog.show("Please Wait..","", true);
                    var res = $http.post(baseURL + 'authenticate', dataObj);
                    console.log("login parameter: " + JSON.stringify(dataObj));
                    res.success(function(data, status, headers, config) {
                    console.log("login parameter Success: " + JSON.stringify(data));
                        $cordovaSpinnerDialog.hide();
                        if(data.success == true){
                            localStorage.setItem("user_id", data._id );
                            localStorage.setItem("user_full_name", data.user.fullName );
                            localStorage.setItem("user_phone_number", data.user.mobile);
                            localStorage.setItem("employee_list", JSON.stringify(data.user.employee_list));
                            localStorage.setItem("business_details_status", data.business_flag);
                            if(data.business_flag) {
                            window.plugins.toast.showShortCenter(data.msg);
                            $location.path('/welcome');
                            }else{
                               window.plugins.toast.showShortCenter("Please fill your business details first");
                               $location.path('/registerComplete');
                            }
                         }else if(data.success == false){
                            window.plugins.toast.showShortCenter(data.msg);
                         }else {
                              window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                          }
                    });
                    res.error(function(data, status, headers, config) {
                    $cordovaSpinnerDialog.hide();
                    if (!$cordovaNetwork.isOnline()) {
                        window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                    } else {
                        window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                    }
                    console.log("login api failure message: " + JSON.stringify({ data: data }));
                });

                }else{
                    $scope.submitted = true;
                    if ($scope.user_name == "") {
                        window.plugins.toast.showShortCenter('Please enter userName');
                        return false;
                    }
                    if ($scope.password == "") {
                        window.plugins.toast.showShortCenter('Please enter password');
                        return false;
                    }
                }
            }
});

//register basic
DuqaanCtrl.controller("DuqaanRegistrationBasicCtrl", function($scope, $rootScope, $location, $http, $cordovaDialogs, $cordovaSpinnerDialog, $cordovaNetwork ){

        localStorage.setItem("page_id", "2");

        $scope.showAlert = false;
        $scope.alertMsg = "User Name is already exists. Please try with some other username.";
        $scope.full_name = "";
        $scope.phone_number = "";
        $scope.shop_number = "";
        $scope.street = "";
        $scope.state = "";
        $scope.city = "";
        $scope.zip_code = "";
        $scope.user_name = "";
        $scope.password = "";
        $scope.confirm_password = "";


         $scope.createAccount = function($val) {
            if($val == true){
                if($scope.password != $scope.confirm_password) {
                    window.plugins.toast.showShortCenter("Your password does not match with confirm password");
                    return false;
                }
                if($scope.showAlert == true){
                    window.plugins.toast.showShortCenter("User Name is already exists. Please try with some other username.");
                    return false;
                }
                        var dataObj = {
                            fullName :  $scope.full_name,
                            mobile : $scope.phone_number,
                            shopNo: $scope.shop_number,
                            street :  $scope.street,
                            state: $scope.state,
                            city :  $scope.city,
                            pincode: $scope.zip_code,
                            username : $scope.user_name,
                            password : $scope.password,
                        };
                        $cordovaSpinnerDialog.show("Please Wait..","", true);
                        var res = $http.post(baseURL + 'signup', dataObj);
                        console.log("login parameter: " + JSON.stringify(dataObj));
                        res.success(function(data, status, headers, config) {
                            $cordovaSpinnerDialog.hide();
                            console.log("login api response: " + JSON.stringify(data));

                            if (data.success == true) {
                                  localStorage.setItem("user_id",data.user.id);
                                  localStorage.setItem("user_full_name", data.user.fullName );
                                  localStorage.setItem("user_phone_number", data.user.mobile);
                                  window.plugins.toast.showShortCenter(data.msg);
                                    $location.path('/registerComplete');
                            } else if(data.success == false){
                                window.plugins.toast.showLongCenter(data.msg);
                            } else {
                                window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                            }
                        });
                res.error(function(data, status, headers, config) {
                    $cordovaSpinnerDialog.hide();
                    if (!$cordovaNetwork.isOnline()) {
                        window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                    } else {
                        window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                    }
                    console.log("login api failure message: " + JSON.stringify({ data: data }));
                });


            }else{
                $scope.submitted = true;
                if ($scope.full_name == "") {
                    window.plugins.toast.showShortCenter('Please enter full name');
                    return false;
                }
                if ($scope.phone_number == "") {
                    window.plugins.toast.showShortCenter('Please enter phone number');
                    return false;
                }
                if ($scope.shop_number == "") {
                    window.plugins.toast.showShortCenter('Please enter shop number');
                    return false;
                }
                if ($scope.street == "") {
                    window.plugins.toast.showShortCenter('Please enter street address');
                    return false;
                }
                if ($scope.state == "") {
                    window.plugins.toast.showShortCenter('Please enter state');
                    return false;
                }
                if ($scope.city == "") {
                    window.plugins.toast.showShortCenter('Please enter city')
                    return false;
                }
                if ($scope.zip_code == "") {
                    window.plugins.toast.showShortCenter('Please enter pin code');
                    return false;
                }
                if ($scope.user_name == "") {
                    window.plugins.toast.showShortCenter('Please enter user name');
                    return false;
                }
                if ($scope.password == "") {
                    window.plugins.toast.showShortCenter('Please enter password');
                    return false;
                }
                if ($scope.confirm_password == "") {
                    window.plugins.toast.showShortCenter('Please enter confirm password');
                    return false;
                }
            }
        }

        $scope.userNameCheck = function() {
            if($scope.user_name == ""){
              }else{
              var dataObj = {
                    username : $scope.user_name
                };
                $cordovaSpinnerDialog.show("Please Wait..","", true);
                var res = $http.post(baseURL + 'signup/checkUsername', dataObj);
                console.log("sign up parameter: " + JSON.stringify(dataObj));
                res.success(function(data, status, headers, config) {
                console.log("sign up parameter Success: " + JSON.stringify(data));
                    $cordovaSpinnerDialog.hide();
                    if(data.success == true){
//                            $scope.alertMsg = data.msg;
                            $scope.showAlert = true;
                     }else{
                           $scope.showAlert = false;
                     }
                });
                res.error(function(data, status, headers, config) {
                    $cordovaSpinnerDialog.hide();
                    if (!$cordovaNetwork.isOnline()) {
                        window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                    } else {
                        window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                    }
                    console.log("sign up api failure message: " + JSON.stringify({ data: data }));
                });
        }
        }
});

//register complete
DuqaanCtrl.controller("DuqaanRegistrationCompleteCtrl", function($scope, $rootScope, $location, $http, $cordovaDialogs,$cordovaSpinnerDialog, $cordovaNetwork){

        localStorage.setItem("page_id", "3");

        $scope.business_owner = "";
        $scope.showOwner = false;
        $scope.showEmployee = false;

        if(localStorage.getItem("user_phone_number")){
            $scope.mobilenumber = localStorage.getItem("user_phone_number")
        }else{
            $scope.mobilenumber = "";
        }


                $scope.store_name = "";
                $scope.retailer_type = "";
                $scope.sell_what = "";
                $scope.business_owner = "";
                $scope.employee_detail = "";
                $scope.business_age = "";
                $scope.track_business = "";
                $scope.business_matters = "";


        $scope.businessAge = [];

        for(var i=1 ; i< 6; i++){
            $scope.businessAge.push(i);
        }

/*=========business adding more owner============*/
        $scope.businessOwnerClicked = function() {
            $scope.showOwner = false;
            if($scope.business_owner == '2') {
                $scope.showOwner = true;
            }
        }
        $scope.choices = [{id: 'choice1', employeeName:"", contact_no:""}];
        $scope.addNewChoice = function() {
         var newItemNo = $scope.choices.length+1;
         $scope.choices.push({'id':'choice'+newItemNo});
       };
        $scope.removeChoice = function() {
         var lastItem = $scope.choices.length-1;
         $scope.choices.splice(lastItem);
       };

/*========= Adding more employee============*/

        $scope.employeeMoreClicked = function() {
            $scope.showEmployee = false;
            if($scope.employee_detail == '2') {
                $scope.showEmployee = true;
            }
        }
        $scope.choiceList = {id: 'choice100', employeeName:"self", contact_no:$scope.mobilenumber};

        $scope.choicess = [{id: 'choice1', employeeName:"", contact_no: ""}];
        $scope.addNewChoices = function() {
             var newItemNo = $scope.choicess.length+1;
             $scope.choicess.push({'id':'choice'+newItemNo});
           };
        $scope.removeChoices = function() {
             var lastItem = $scope.choicess.length-1;
             $scope.choicess.splice(lastItem);
           };

        $scope.retailerType = function(value){
            $scope.retailer_type = value;
        }

   /*======Adding Business details===============*/
     $scope.addingBusinessDetails = function($val) {
           if($val == true){
            if($scope.choicess[0].employeeName == ""){
                $scope.choicess = [{id: 'choice1', employeeName:"self", contact_no:$scope.mobilenumber}];
            }else{
               $scope.choicess.push($scope.choiceList);
               }
                 for(var i = 0; i < $scope.choices.length; i++) {
                       delete $scope.choices[i]['$$hashKey'];
                       delete $scope.choices[i]['id'];
                   }

                for(var i = 0; i < $scope.choicess.length; i++) {
                      delete $scope.choicess[i]['$$hashKey'];
                      delete $scope.choicess[i]['id'];
                  }



                        var dataObj = {
                            id : localStorage.getItem("user_id"),
                            storename : $scope.store_name,
                            retailer_type : $scope.retailer_type,
                            sell_type : $scope.sell_what,
                            business_owner :  {
                                                    fullName: localStorage.getItem("user_full_name"),
                                                    phoneNumber: localStorage.getItem("user_phone_number")
                                                },
                            employee_list: $scope.choicess,
                            business_age : $scope.business_age,
                            business_track :  $scope.track_business,
                            business_interest: $scope.business_matters
                        };
                            $cordovaSpinnerDialog.show("Please Wait..","", true);
                            var res = $http.post(baseURL + 'business', dataObj);
                            console.log("business details parameter: " + JSON.stringify(dataObj));
                            res.success(function(data, status, headers, config) {
                            console.log("login parameter Success: " + JSON.stringify(data));
                                $cordovaSpinnerDialog.hide();
                                if(data.success == true){
                                    window.plugins.toast.showShortCenter(data.msg);
//                                    localStorage.setItem("user_id", data.id );
//                                    localStorage.setItem("employee_list", JSON.stringify(data.user.employee_list));
                                    localStorage.setItem("business_details_status", true);
                                    $location.path('/welcome');
                                 }else if(data.success == false){
                                    window.plugins.toast.showShortCenter(data.msg);
                                 }else {
                                      window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                                  }
                            });
                            res.error(function(data, status, headers, config) {
                                $cordovaSpinnerDialog.hide();
                                if (!$cordovaNetwork.isOnline()) {
                                    window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                                } else {
                                    window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                                }
                                console.log("business details api failure message: " + JSON.stringify({ data: data }));
                            });

                }else{
                    $scope.submitted = true;
                    if ($scope.store_name == "") {
                        window.plugins.toast.showShortCenter('Please enter store name');
                        return false;
                    }
                    if ($scope.retailer_type == "") {
                        window.plugins.toast.showShortCenter('Please choose type of retailer');
                        return false;
                    }
                    if ($scope.sell_what == "") {
                        window.plugins.toast.showShortCenter('Please select what you sell');
                        return false;
                    }
                    if ($scope.business_owner == "") {
                        window.plugins.toast.showShortCenter('Please select the no of owner');
                        return false;
                    }
                    if ($scope.employee_detail == "") {
                        window.plugins.toast.showShortCenter('Please choose employee details');
                        return false;
                    }
                    if ($scope.business_age == "") {
                        window.plugins.toast.showShortCenter('Please select the business age');
                        return false;
                    }
                    if ($scope.track_business == "") {
                        window.plugins.toast.showShortCenter('Please select how you track your business');
                        return false;
                    }
                    if ($scope.business_matters == "") {
                        window.plugins.toast.showShortCenter('Please select what matters most in your business');
                        return false;
                    }
                 }
            }
});

//Forgot Password
DuqaanCtrl.controller("DuqaanForgotPasswordCtrl", function($scope, $rootScope, $location){

        localStorage.setItem("page_id", "4");

                $scope.customerClicked = function(){
                    $rootScope.next();
                    $location.path('/customerLogin')
                }

                $scope.registration= function() {
                    $location.path('/register');
                }



});

//Welcome Screen
DuqaanCtrl.controller("WelcomeCtrl", function($scope, $rootScope, $location, $http, $cordovaNetwork, $cordovaDialogs, $cordovaSpinnerDialog){

        $scope.userName = localStorage.getItem("user_full_name");
        localStorage.setItem("page_id", "5");

        $scope.pop == false;

    $scope.logoutClicked = function (){
        $cordovaDialogs.confirm('Are you sure? Do you want to logout from Duqaan.', 'Alert', ['Cancel', 'Ok'])
           .then(function(buttonIndex) {
            if (buttonIndex == 2) {
                localStorage.clear();
               window.plugins.toast.showShortCenter("Successfully logout");
                   $location.path('/login');
            } else if (buttonIndex == 1) {}
           });
    }

    $scope.show = function(){
        if($scope.pop == true){
            $scope.pop == false;
        }else{
            $scope.pop = true;
        }
    }

  var dataObject = {
                    id : localStorage.getItem("user_id")
                };
  $cordovaSpinnerDialog.show("Please Wait..","", true);
  var res = $http.post(baseURL + 'home_screen', dataObject);
    console.log("home screen api parameter: " + JSON.stringify(dataObject));
  res.success(function(data, status, headers, config) {
  console.log("home screen api parameter Success: " + JSON.stringify(data));
      $cordovaSpinnerDialog.hide();
      if(data.success == true){
            $scope.homecreen = data;
       }else if(data.success == false){
          window.plugins.toast.showShortCenter(data.msg);
       }else {
            window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
        }
  });
  res.error(function(data, status, headers, config) {
          $cordovaSpinnerDialog.hide();
          if (!$cordovaNetwork.isOnline()) {
              window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
          } else {
              window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
          }
          console.log("home screen api failure message: " + JSON.stringify({ data: data }));
      });
});

//POS Screen
DuqaanCtrl.controller("POSCtrl", function($scope, $rootScope, $location, $cordovaDialogs, $http, $cordovaDialogs,$cordovaSpinnerDialog, $cordovaNetwork){

        localStorage.setItem("page_id", "6");

            $scope.showEmp = false;
            $scope.customerSelectedName = "";
            $scope.employee = "";

            /*============Employee list===========*/
            var dataObject = {
                              id : localStorage.getItem("user_id")
                          };
            $cordovaSpinnerDialog.show("Please Wait..","", true);
            var res = $http.post(baseURL + 'employeelist', dataObject);
              console.log("employee list api parameter: " + JSON.stringify(dataObject));
            res.success(function(data, status, headers, config) {
            console.log("home screen api parameter Success: " + JSON.stringify(data));
                $cordovaSpinnerDialog.hide();
                if(data.success == true){
                      $scope.employeeList = data.employee_list;
                 }else if(data.success == false){
                    window.plugins.toast.showShortCenter(data.msg);
                 }else {
                      window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                  }
            });
            res.error(function(data, status, headers, config) {
                    $cordovaSpinnerDialog.hide();
                    if (!$cordovaNetwork.isOnline()) {
                        window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                    } else {
                        window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                    }
                    console.log("employee list api failure message: " + JSON.stringify({ data: data }));
                });
            /*===============End==================*/

            /*  Array eisting ot Not   */
                function in_array(array, id) {
                     for(var i=0;i<array.length;i++) {
                        if(array[i].id === id){
                            return i+1;
                        }
                     }
                     return false;
                 }

                $scope.categoryClicked12 = function(item){
                      var dataObject = {
                                        id : localStorage.getItem("user_id"),
                                        category: item
                                    };
                      $cordovaSpinnerDialog.show("Please Wait..","", true);
                      var res = $http.post(baseURL + 'servicelist', dataObject);
                        console.log("service category api parameter: " + JSON.stringify(dataObject));
                      res.success(function(data, status, headers, config) {
                      console.log("service category api parameter Success: " + JSON.stringify(data));
                          $cordovaSpinnerDialog.hide();
                          if(data.success == true){
                                $scope.servicesCategoryList = data.service_list;
                           }else if(data.success == false){
                              window.plugins.toast.showShortCenter(data.msg);
                           }else {
                                window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                            }
                      });
                      res.error(function(data, status, headers, config) {
                                          $cordovaSpinnerDialog.hide();
                                          if (!$cordovaNetwork.isOnline()) {
                                              window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                                          } else {
                                              window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                                          }
                                          console.log("service category api failure message: " + JSON.stringify({ data: data }));
                                      });
                }
                $scope.sum = 0.00;
                $scope.items = [];
                $scope.categoryClicked = function(service) {
                   var x = in_array($scope.items, service.id);
                   if(x){
                      $scope.items[x-1].qty += 1;
                      $scope.qtyClicked($scope.items[x-1]);
                   }else{
                      $scope.items.push({id: service.id, category: service.sub_category, qty: service.volume, amt: service.rate, finalAmt: service.rate });
                      $scope.qtyBlur();
                   }
                };
                $scope.removeItems = function(item) {
                     $scope.items = $scope.items.filter(function(el) {
                         return el.id !== item.id;
                     });
                     $scope.qtyBlur();
                 };

               $scope.qtyBlur = function(){
                    $scope.sum = 0.00;
                for(var i=0; i < $scope.items.length; i++){
                    $scope.sum = $scope.sum + $scope.items[i].finalAmt;
                }
               }
               $scope.qtyClicked = function(item){
                    for(var i = 0; i < $scope.items.length ; i++){
                            if($scope.items[i].id === item.id){
                                $scope.items[i].finalAmt = item.qty * item.amt;
                            }
                    }
                    $scope.qtyBlur();
               }

              /*================service api started================*/

              var dataObj = {
                                id : localStorage.getItem("user_id")
                            };
              $cordovaSpinnerDialog.show("Please Wait..","", true);
              var res = $http.post(baseURL + 'servicelist', dataObj);
                console.log("service api parameter: " + JSON.stringify(dataObj));
              res.success(function(data, status, headers, config) {
              console.log("service api parameter Success: " + JSON.stringify(data));
                  $cordovaSpinnerDialog.hide();
                  if(data.success == true){
                        $scope.servicesList = data.service_list;
                   }else if(data.success == false){
                      window.plugins.toast.showShortCenter(data.msg);
                   }else {
                        window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                    }
              });
              res.error(function(data, status, headers, config) {
                      $cordovaSpinnerDialog.hide();
                      if (!$cordovaNetwork.isOnline()) {
                          window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                      } else {
                          window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                      }
                      console.log("service api failure message: " + JSON.stringify({ data: data }));
                  });

              $scope.nameClicked = function(item) {
                    $scope.customerSelectedName = {
                            employeeName : item.employeeName,
                            emp_id : item.emp_id
                        };
                console.log("name selected : " + JSON.stringify($scope.customerSelectedName));
              }
                $scope.openPopUp=function(){
                    $scope.isVisible=true;
                }
                $scope.closePopUp=function(){
                if($scope.employee == ""){
                    alert("Please select the employee first");
                }else{
                    for(var i = 0; i < $scope.items.length; i++) {
                        delete $scope.items[i]['$$hashKey'];
                    }

//                    if($scope.employee == "self"){
//                        $scope.customerSelectedName = {
//                                    employeeName : localStorage.getItem("user_full_name"),
//                                    emp_id : localStorage.getItem("user_id")
//                        };
//                    }
                    $scope.isVisible=false;
                    $location.path('/payment/'+JSON.stringify($scope.customerSelectedName)+'/'+ JSON.stringify($scope.items)+'/'+ $scope.sum);
                }
                }
              $scope.payClicked = function() {
                if($scope.items.length == 0){
                    alert("Add a item first");
                    return false;
                }else {
                    if($scope.employeeList[0].employeeName == "self"){
//                        $scope.customerSelectedName = {
//                            employeeName : localStorage.getItem("user_full_name"),
//                            emp_id : localStorage.getItem("user_id")
//                        };
                        $location.path('/payment/'+JSON.stringify($scope.customerSelectedName)+'/'+ JSON.stringify($scope.items)+'/'+ $scope.sum);
                    }else{
                        $scope.openPopUp();
                   }
                }
                return false;
              }
              $scope.cancelButton = function() {
                  $rootScope.back();
              }

});

//payment Screen
DuqaanCtrl.controller("PaymentScreenCtrl", function($scope, $rootScope, $routeParams, $location, $http, $cordovaDialogs, $cordovaSpinnerDialog, $cordovaNetwork){

        localStorage.setItem("page_id", "7");

                $scope.employeeName = JSON.parse($routeParams.id);
                $scope.itemsInfo = JSON.parse($routeParams.items);

        $scope.customerPayableAmt = parseInt($routeParams.totalSum);

        $scope.customerCredit = "";
        $scope.customerName = "";
        $scope.customerContactNumber = "";
        $scope.customerAge = "";
        $scope.customerSex = "";
        $scope.customerCash = "";
        $scope.customerBillAmt = "";
        $scope.customerDiscountAmt = "";
        $scope.customerMandate = false;
        $scope.showOther = false;
        $scope.customerExists = false;
        $scope.customer_age = [];
        $scope.mode_payment = "cash";

        $scope.customerBillAmt = parseInt($routeParams.totalSum);
        $scope.customerCash = $scope.customerBillAmt;

        for(var i=1 ; i< 60; i++){
            $scope.customer_age.push(i);
        }
        $scope.creditBlur = function(){
            if($scope.customerCredit == ""){
                    $scope.customerMandate = false;
                    $scope.mode_payment = "cash";
            }else{
                if(angular.isNumber($scope.customerCredit) && $scope.customerBillAmt >= $scope.customerCredit ){
                    $scope.customerMandate = true;
                    $scope.mode_payment = "credit";
                    $scope.customerCash = parseInt($scope.customerCash) - parseInt($scope.customerCredit);
                }else{
                    alert("Please fill the correct credit value");
                    $scope.customerCredit = "";
                }
            }
        }

        $scope.discountClick = function() {
            if($scope.customerDiscountAmt!= ""){
                  $scope.customerBillAmt = parseInt($scope.customerPayableAmt) - parseInt($scope.customerDiscountAmt);
                  $scope.customerCash = $scope.customerBillAmt;
                  $scope.customerCredit = "";
            }else{
                  $scope.customerBillAmt = parseInt($scope.customerPayableAmt);
                  $scope.customerCash = $scope.customerBillAmt;
                  $scope.customerCredit = "";
            }
        }

        $scope.paymentSubmit = function(){
        if( $scope.customerCredit != ""){

            if($scope.customerContactNumber == ""){
                alert("Customer contact number is mandatory");
                return false;
            }
            if($scope.customerName == ""){
                alert("Customer name is mandatory");
                return false;
            }
            if($scope.customerAge == ""){
                alert("Please select the age");
                return false;
            }
            if($scope.customerSex == ""){
                alert("Please select the sex");
                return false;
            }
                $scope.finalSubmit();
        }else{
            $scope.finalSubmit();
        }
    }

        $scope.finalSubmit = function(){
            if($scope.customerContactNumber == ""){
                    $scope.customer_info = {};
            }else{
                 $scope.customer_info = {
                                    user_id : localStorage.getItem("user_id"),
                                    name: $scope.customerName,
                                    contact_number : $scope.customerContactNumber,
                                    age : $scope.customerAge,
                                    gender: $scope.customerSex
                                };
            }

            var dataObj = {
                id : localStorage.getItem("user_id"),
                itemsList: $scope.itemsInfo,
                employee : $scope.employeeName,
                mode_of_payment : $scope.mode_payment,
                payableAmount : $scope.customerPayableAmt ,
                discount: $scope.customerDiscountAmt,
                totalBill: $scope.customerBillAmt,
                payByCash: $scope.customerCash,
                payByCredit: $scope.customerCredit,
                customerInfo: $scope.customer_info,
                timestamp: new Date()
              };

              console.log("transaction params list : " + JSON.stringify(dataObj));

              $cordovaSpinnerDialog.show("Please Wait..","", true);
              var res = $http.post(baseURL + 'transaction', dataObj);
              console.log("Transaction api parameter: " + JSON.stringify(dataObj));
              res.success(function(data, status, headers, config) {
              console.log("Transaction api parameter Success: " + JSON.stringify(data));
                  $cordovaSpinnerDialog.hide();
                  if(data.success == true){
                         window.plugins.toast.showShortCenter(data.msg);
                        $location.path('/welcome');
                   }else if(data.success == false){
                      window.plugins.toast.showShortCenter(data.msg);
                   }else {
                        window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                    }
              });
              res.error(function(data, status, headers, config) {
                  $cordovaSpinnerDialog.hide();
                  if (!$cordovaNetwork.isOnline()) {
                      window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                  } else {
                      window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                  }
                  console.log("Transaction api failure message: " + JSON.stringify({ data: data }));
              });
        }

        $scope.customerContactBlur = function(){
            if(angular.isUndefined($scope.customerContactNumber)){
                window.plugins.toast.showShortCenter("Please fill the 10 digit mobile number");
                $scope.customerContactNumber = "";
                $scope.showOther = false;
            }else if($scope.customerContactNumber == ""){
                $scope.showOther = false;
            }else{
                    var dataObject = {
                                      id : localStorage.getItem("user_id"),
                                      contact_no : $scope.customerContactNumber
                                  };
                    $cordovaSpinnerDialog.show("Please Wait..","", true);
                    var res = $http.post(baseURL + 'customerinfo ', dataObject);
                      console.log("customerinfo  api parameter: " + JSON.stringify(dataObject));
                    res.success(function(data, status, headers, config) {
                    console.log("customerinfo  api parameter Success: " + JSON.stringify(data));
                        $cordovaSpinnerDialog.hide();
                        if(data.success == true){
                                $scope.showOther = false;
                              $scope.customerinfo  = data.customerinfo;
                              $scope.customerName  = $scope.customerinfo.cust_name;
                              $scope.credit = $scope.customerinfo.totalCredit;
                         }else if(data.success == false){
//                            $scope.customerExists = false;
                            $scope.showOther = true;
//                            window.plugins.toast.showShortCenter(data.msg);
                         }else {
//                            $scope.customerExists = false;
                              window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                          }
                    });
                    res.error(function(data, status, headers, config) {
                            $cordovaSpinnerDialog.hide();
                            if (!$cordovaNetwork.isOnline()) {
                                window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                            } else {
                                window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                            }
                            console.log("customerinfo  api failure message: " + JSON.stringify({ data: data }));
                        });

            }
        }
});

//EmployeeDetails Screen
DuqaanCtrl.controller("EmployeeDetailsCtrl", function($scope, $rootScope, $location, $http, $cordovaNetwork, $cordovaDialogs, $cordovaSpinnerDialog){

        $scope.userName = localStorage.getItem("user_full_name");
        localStorage.setItem("page_id", "8");

      $scope.addEmployeeClicked = function(){
            $location.path('/newEmployee');
        }
      $scope.employeeDetails = function(id){
            $location.path('/employeeInformation/' + id);
        }

        var dataObject = {
                          id : localStorage.getItem("user_id")
                      };
        $cordovaSpinnerDialog.show("Please Wait..","", true);
        var res = $http.post(baseURL + 'employeelist', dataObject);
          console.log("employee list api parameter: " + JSON.stringify(dataObject));
        res.success(function(data, status, headers, config) {
        console.log("home screen api parameter Success: " + JSON.stringify(data));
            $cordovaSpinnerDialog.hide();
            if(data.success == true){
                  $scope.employeelist = data.employee_list;
             }else if(data.success == false){
                window.plugins.toast.showShortCenter(data.msg);
             }else {
                  window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
              }
        });
        res.error(function(data, status, headers, config) {
                $cordovaSpinnerDialog.hide();
                if (!$cordovaNetwork.isOnline()) {
                    window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                } else {
                    window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                }
                console.log("employee list api failure message: " + JSON.stringify({ data: data }));
            });

});

//EmployeeInformation Screen
DuqaanCtrl.controller("EmployeeInformationCtrl", function($scope, $rootScope, $routeParams, $location, $http, $cordovaNetwork, $cordovaDialogs, $cordovaSpinnerDialog){

        $scope.userName = localStorage.getItem("user_full_name");
        localStorage.setItem("page_id", "9");

        $scope.emp_id = $routeParams.emp_id;

            $scope.name = "";
            $scope.contact_number = "";
            $scope.age = "";
            $scope.sex = "";

             $scope.ageList = [];
             for(var i = 14; i < 60; i++){
                 $scope.ageList.push(i);
             }

        var dataObject = {
                          id : localStorage.getItem("user_id"),
                          emp_id : $scope.emp_id
                      };
        $cordovaSpinnerDialog.show("Please Wait..","", true);
        var res = $http.post(baseURL + 'employeelist', dataObject);
          console.log("each employee list api parameter: " + JSON.stringify(dataObject));
        res.success(function(data, status, headers, config) {
        console.log("each employee list parameter Success: " + JSON.stringify(data));
            $cordovaSpinnerDialog.hide();
            if(data.success == true){
                  $scope.employeeInfo = data.employee_details;
                  $scope.emp_id = $scope.employeeInfo.emp_id;
                  $scope.name = $scope.employeeInfo.employeeName;
                  $scope.contact_number = $scope.employeeInfo.contact_no;
                  $scope.txn_amount = $scope.employeeInfo.txn_amount;
                  if($scope.employeeInfo.age){
                     $scope.age = $scope.employeeInfo.age.toString();
                  }
                  $scope.sex = $scope.employeeInfo.sex;
             }else if(data.success == false){
                window.plugins.toast.showShortCenter(data.msg);
             }else {
                  window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
              }
        });
        res.error(function(data, status, headers, config) {
                $cordovaSpinnerDialog.hide();
                if (!$cordovaNetwork.isOnline()) {
                    window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                } else {
                    window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                }
                console.log("each employee list api failure message: " + JSON.stringify({ data: data }));
            });

          $scope.saveClicked = function(){
              if($scope.name == ""){
                  alert("Please enter employee name");
                  return false;
              }
              if($scope.contact_number == ""){
                  alert("Please enter employee contact number");
                  return false;
              }
              if($scope.age == ""){
                  alert("Please select the employee age");
                  return false;
              }
              if($scope.sex == ""){
                  alert("Please select the employee gender");
                  return false;
              }
           var dataObject = {
                             id : localStorage.getItem("user_id"),
                             employee:
                                { "emp_id": $scope.emp_id,
                                  "employeeName": $scope.name,
                                  "contact_no": $scope.contact_number,
                                  "age": $scope.age,
                                  "sex": $scope.sex,
                                  txn_amount : $scope.txn_amount

                                }
                         };
           $cordovaSpinnerDialog.show("Please Wait..","", true);
           var res = $http.post(baseURL + 'employee_update', dataObject);
             console.log("employee update api parameter: " + JSON.stringify(dataObject));
           res.success(function(data, status, headers, config) {
           console.log("employee add api parameter Success: " + JSON.stringify(data));
               $cordovaSpinnerDialog.hide();
               if(data.success == true){
                     window.plugins.toast.showShortCenter(data.msg);
                     $rootScope.back();
                }else if(data.success == false){
                   window.plugins.toast.showShortCenter(data.msg);
                }else {
                     window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                 }
           });
           res.error(function(data, status, headers, config) {
                   $cordovaSpinnerDialog.hide();
                   if (!$cordovaNetwork.isOnline()) {
                       window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                   } else {
                       window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                   }
                   console.log("employee update api failure message: " + JSON.stringify({ data: data }));
               });

          }

           $scope.deleteClicked = function(){
              var dataObject = {
                          id : localStorage.getItem("user_id"),
                          emp_id : $scope.employeeInfo.emp_id
                      };
        $cordovaSpinnerDialog.show("Please Wait..","", true);
        var res = $http.post(baseURL + 'employee_rm ', dataObject);
          console.log("employee remove api parameter: " + JSON.stringify(dataObject));
        res.success(function(data, status, headers, config) {
        console.log("employee remove parameter Success: " + JSON.stringify(data));
            $cordovaSpinnerDialog.hide();
            if(data.success == true){
                  $rootScope.back();
             }else if(data.success == false){
                window.plugins.toast.showShortCenter(data.msg);
             }else {
                  window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
              }
        });
        res.error(function(data, status, headers, config) {
                $cordovaSpinnerDialog.hide();
                if (!$cordovaNetwork.isOnline()) {
                    window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                } else {
                    window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                }
                console.log("employee remove failure message: " + JSON.stringify({ data: data }));
            });
           }

        /*================All transaction info by employee=============*/
             var dataObject = {
                               id : localStorage.getItem("user_id"),
                               emp_id : $scope.emp_id
                           };
             $cordovaSpinnerDialog.show("Please Wait..","", true);
             var res = $http.post(baseURL + 'transactionlist', dataObject);
               console.log("employee transaction api parameter: " + JSON.stringify(dataObject));
             res.success(function(data, status, headers, config) {
             console.log("employee transaction parameter Success: " + JSON.stringify(data));
                 $cordovaSpinnerDialog.hide();
                 if(data.success == true){
                        $scope.employee_transaction = data.Employee_Transactions;
                  }else if(data.success == false){
                     window.plugins.toast.showShortCenter(data.msg);
                  }else {
                       window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                   }
             });
             res.error(function(data, status, headers, config) {
                     $cordovaSpinnerDialog.hide();
                     if (!$cordovaNetwork.isOnline()) {
                         window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                     } else {
                         window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                     }
                     console.log("employee transaction list api failure message: " + JSON.stringify({ data: data }));
                 });

});

//NewEmployee Screen
DuqaanCtrl.controller("NewEmployeeCtrl", function($scope, $rootScope, $location, $http, $cordovaNetwork, $cordovaDialogs, $cordovaSpinnerDialog){

        $scope.userName = localStorage.getItem("user_full_name");
        localStorage.setItem("page_id", "10");

        $scope.name = "";
        $scope.contact_number = "";
        $scope.age = "";
        $scope.sex = "";

        $scope.ageList = [];
        for(var i = 14; i < 60; i++){
            $scope.ageList.push(i);
        }

        var dataObject = {
                          id : localStorage.getItem("user_id")
                      };
        $cordovaSpinnerDialog.show("Please Wait..","", true);
        var res = $http.post(baseURL + 'employeelist', dataObject);
          console.log("employee list api parameter: " + JSON.stringify(dataObject));
        res.success(function(data, status, headers, config) {
        console.log("home screen api parameter Success: " + JSON.stringify(data));
            $cordovaSpinnerDialog.hide();
            if(data.success == true){
                  $scope.employeelist = data.employee_list;
             }else if(data.success == false){
                window.plugins.toast.showShortCenter(data.msg);
             }else {
                  window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
              }
        });
        res.error(function(data, status, headers, config) {
                $cordovaSpinnerDialog.hide();
                if (!$cordovaNetwork.isOnline()) {
                    window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                } else {
                    window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                }
                console.log("employee list api failure message: " + JSON.stringify({ data: data }));
            });

        $scope.saveClicked = function(){
            if($scope.name == ""){
                alert("Please enter employee name");
                return false;
            }
            if($scope.contact_number == ""){
                alert("Please enter employee contact number");
                return false;
            }
            if($scope.age == ""){
                alert("Please select the employee age");
                return false;
            }
            if($scope.sex == ""){
                alert("Please select the employee gender");
                return false;
            }
         var dataObject = {
                           id : localStorage.getItem("user_id"),
                           employee_list: [
                             	{ "emp_id": "",
                             	  "employeeName": $scope.name,
                             	  "contact_no": $scope.contact_number,
                             	  "age": $scope.age,
                             	  "sex": $scope.sex,
                             	  "txn_amount": 0

                             	}]
                       };
         $cordovaSpinnerDialog.show("Please Wait..","", true);
         var res = $http.post(baseURL + 'employee_add', dataObject);
           console.log("employee add api parameter: " + JSON.stringify(dataObject));
         res.success(function(data, status, headers, config) {
         console.log("employee add api parameter Success: " + JSON.stringify(data));
             $cordovaSpinnerDialog.hide();
             if(data.success == true){
                   window.plugins.toast.showShortCenter(data.msg);
                   $rootScope.back();
              }else if(data.success == false){
                 window.plugins.toast.showShortCenter(data.msg);
              }else {
                   window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
               }
         });
         res.error(function(data, status, headers, config) {
                 $cordovaSpinnerDialog.hide();
                 if (!$cordovaNetwork.isOnline()) {
                     window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                 } else {
                     window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                 }
                 console.log("employee add api failure message: " + JSON.stringify({ data: data }));
             });

        }

         $scope.cancelClicked = function(){
            $rootScope.back();
         }

});

//Dashboard Screen
DuqaanCtrl.controller("DashboardCtrl", function($scope, $rootScope, $location, $cordovaDialogs, $cordovaSpinnerDialog){
        localStorage.setItem("page_id", "11");

});

//EmpAttendance Screen
DuqaanCtrl.controller("EmpAttendanceCtrl", function($scope, $rootScope, $location, $cordovaDialogs, $cordovaSpinnerDialog){
        localStorage.setItem("page_id", "12");

        $scope.attendanceClicked = function() {
            $location.path('/attendanceInfo');
        }

});

//AttendanceInformation Screen
DuqaanCtrl.controller("AttendanceInformationCtrl", function($scope, $rootScope, $location, $cordovaDialogs, $cordovaSpinnerDialog){
        localStorage.setItem("page_id", "13");

});

//CustomerDetails Screen
DuqaanCtrl.controller("CustomerDetailsCtrl", function($scope, $rootScope, $location, $http, $cordovaNetwork, $cordovaDialogs, $cordovaSpinnerDialog){

        $scope.userName = localStorage.getItem("user_full_name");
        localStorage.setItem("page_id", "14");

      $scope.customerDetails = function(id){
            $location.path('/customerInformation/' + id);
        }

        var dataObject = {
                          id : localStorage.getItem("user_id")
                      };
        $cordovaSpinnerDialog.show("Please Wait..","", true);
        var res = $http.post(baseURL + 'customerlist', dataObject);
          console.log("customer list api parameter: " + JSON.stringify(dataObject));
        res.success(function(data, status, headers, config) {
        console.log("customer list api parameter Success: " + JSON.stringify(data));
            $cordovaSpinnerDialog.hide();
            if(data.success == true){
                  $scope.customerList = data.Customer_List;
             }else if(data.success == false){
                window.plugins.toast.showShortCenter(data.msg);
             }else {
                  window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
              }
        });
        res.error(function(data, status, headers, config) {
                $cordovaSpinnerDialog.hide();
                if (!$cordovaNetwork.isOnline()) {
                    window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                } else {
                    window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                }
                console.log("customer list api failure message: " + JSON.stringify({ data: data }));
            });

});

//CustomerDetails Screen
DuqaanCtrl.controller("CustomerInformationCtrl", function($scope, $rootScope, $routeParams, $location, $http, $cordovaNetwork, $cordovaDialogs, $cordovaSpinnerDialog){

        $scope.userName = localStorage.getItem("user_full_name");
        localStorage.setItem("page_id", "17");

      $scope.customerId = $routeParams.id;

        var dataObject = {
                          id : localStorage.getItem("user_id"),
                          cust_id : $scope.customerId
                      };
        $cordovaSpinnerDialog.show("Please Wait..","", true);
        var res = $http.post(baseURL + 'transactionlist', dataObject);
          console.log("customer transaction list api parameter: " + JSON.stringify(dataObject));
        res.success(function(data, status, headers, config) {
        console.log("customer transaction list api parameter Success: " + JSON.stringify(data));
            $cordovaSpinnerDialog.hide();
            if(data.success == true){
                  $scope.customerTransactionList = data.Customer_Transactions;
             }else if(data.success == false){
                window.plugins.toast.showShortCenter(data.msg);
             }else {
                  window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
              }
        });
        res.error(function(data, status, headers, config) {
                $cordovaSpinnerDialog.hide();
                if (!$cordovaNetwork.isOnline()) {
                    window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                } else {
                    window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                }
                console.log("customer transaction list api failure message: " + JSON.stringify({ data: data }));
            });

});

//transactionHistory Screen
DuqaanCtrl.controller("transactionHistoryCtrl", function($scope, $rootScope, $location, $http, $cordovaNetwork, $cordovaDialogs, $cordovaSpinnerDialog){

        $scope.userName = localStorage.getItem("user_full_name");
        localStorage.setItem("page_id", "15");

        /*================All transaction info by employee=============*/
             var dataObject = {
                               id : localStorage.getItem("user_id")
                           };
             $cordovaSpinnerDialog.show("Please Wait..","", true);
             var res = $http.post(baseURL + 'transactionlist', dataObject);
               console.log("transaction api parameter: " + JSON.stringify(dataObject));
             res.success(function(data, status, headers, config) {
             console.log("transaction parameter Success: " + JSON.stringify(data));
                 $cordovaSpinnerDialog.hide();
                 if(data.success == true){
                        $scope.transactionist = data.transactionist;
                  }else if(data.success == false){
                     window.plugins.toast.showShortCenter(data.msg);
                  }else {
                       window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                   }
             });
             res.error(function(data, status, headers, config) {
                     $cordovaSpinnerDialog.hide();
                     if (!$cordovaNetwork.isOnline()) {
                         window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                     } else {
                         window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                     }
                     console.log("transaction list api failure message: " + JSON.stringify({ data: data }));
                 });

      $scope.transactionClicked = function(value){
        $location.path('transactionHistoryDetails/'+value._id);
      }

});

//TransactionHistoryDetails Screen
DuqaanCtrl.controller("TransactionHistoryDetailsCtrl", function($scope, $rootScope, $routeParams, $location, $http, $cordovaNetwork, $cordovaDialogs, $cordovaSpinnerDialog){

        $scope.userName = localStorage.getItem("user_full_name");
        localStorage.setItem("page_id", "16");

        /*================Each transaction info by employee=============*/
             var dataObject = {
                               id : localStorage.getItem("user_id"),
                               txn_id: $routeParams.id

                           };
             $cordovaSpinnerDialog.show("Please Wait..","", true);
             var res = $http.post(baseURL + 'transactionlist', dataObject);
               console.log("single transaction api parameter: " + JSON.stringify(dataObject));
             res.success(function(data, status, headers, config) {
             console.log("single transaction parameter Success: " + JSON.stringify(data));
                 $cordovaSpinnerDialog.hide();
                 if(data.success == true){
                        $scope.transactionDetails = data.Transaction_Details[0];
                  }else if(data.success == false){
                     window.plugins.toast.showShortCenter(data.msg);
                  }else {
                       window.plugins.toast.showShortCenter('There is some problem. Please try again later.');
                   }
             });
             res.error(function(data, status, headers, config) {
                     $cordovaSpinnerDialog.hide();
                     if (!$cordovaNetwork.isOnline()) {
                         window.plugins.toast.showShortCenter('There is no network connectivity. Please check your network connection.');
                     } else {
                         window.plugins.toast.showShortCenter('There is some problem. Please try again later.')
                     }
                     console.log("single transaction list api failure message: " + JSON.stringify({ data: data }));
                 });

});
