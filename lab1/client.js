
_browsetab = "";

function displayView(){
    if( localStorage.getItem("token")){
        homeTab();
    }
    else{
        welcomeView();
    }
}

function welcomeView(){
    var _main = document.getElementById("main");
    var _welcomeview = document.getElementById("welcomeview");
    _main.innerHTML = _welcomeview.innerHTML;
}

function displayProfile(){
    changeCurrentWindow("hometab");
    displayView();
}

window.onload = function(){
    displayView();
};

function changeCurrentWindow(newWindow){
    var _main = document.getElementById("main");
    if(newWindow == "browsetab" && _browsetab != ""){
        _view = _browsetab;
    }
    else{
        var _view = document.getElementById(newWindow).innerHTML;
    }
    _main.innerHTML = _view;
}

function signup_button_pressed(){

    var _password = document.getElementById("password").value;
    var _repeat_password = document.getElementById("repeat_password").value;
    var min_password_length = 6;

    var inputObject = {
            'email': document.getElementById("email").value,
            'password': document.getElementById("password").value,
            'firstname': document.getElementById("firstname").value,
            'familyname': document.getElementById("familyname").value,
            'gender': document.getElementById("gender").value,
            'city': document.getElementById("city").value,
            'country': document.getElementById("country").value
          };

    var outputstring = "";

    if((_password.length >= min_password_length) &&
    (_password == _repeat_password)) {

        ExtraWindow.display("Sign up successful!", "green");

        outputstring = serverstub.signUp(inputObject);
        if (outputstring.success == true) {
            var result = serverstub.signIn(inputObject.email, inputObject.password);
            if (result.data) {
                localStorage.setItem("token", result.data);
            }
            ExtraWindow.display(outputstring.message, "green");

            displayProfile();
        }
    }else{
        if(_password.length < min_password_length){
            ExtraWindow.display("password needs to be at least 6 characters", "red");
        }
        if(_password != _repeat_password){
            ExtraWindow.display("repeated password does not match", "red");
        }
    }
    return false;
}

function signin_button_pressed(){


    var inputObject2 = {
            'email2': document.getElementById("email2").value,
            'password2': document.getElementById("password2").value
          };

    var min_password_length = 6;
    var _password2 = document.getElementById("password2").value;

    if (_password2.length >= min_password_length){

        var result = serverstub.signIn(inputObject2.email2, inputObject2.password2);

        if (result.success){
            localStorage.setItem("token", result.data);
            displayProfile();
            ExtraWindow.display(result.message, "green");
        }
        else{
            ExtraWindow.display(result.message, "red");
        }
    }
    else{
        ExtraWindow.display("login failed!", "red");
    }
    return false;
}

function accountTab(){
    changeCurrentWindow("accounttab");
    ExtraWindow.hide();
}

function homeTab(){
    changeCurrentWindow("hometab");
    ExtraWindow.hide();
    _token = localStorage.getItem("token");
    _userdata = serverstub.getUserDataByToken(_token);
    _messages = serverstub.getUserMessagesByToken(_token).data;

    document.getElementById("hometab_name").innerHTML = _userdata.data.firstname;
    document.getElementById("hometab_familyname").innerHTML = _userdata.data.familyname;
    document.getElementById("hometab_gender").innerHTML = _userdata.data.gender;
    document.getElementById("hometab_city").innerHTML = _userdata.data.city;
    document.getElementById("hometab_country").innerHTML = _userdata.data.country;
    document.getElementById("hometab_email").innerHTML = _userdata.data.email;
    document.getElementById("hometab_messagewall").innerHTML = messages_to_string(_messages);
}

function refreshHomeTab(){
    _messages = serverstub.getUserMessagesByToken(_token).data;
    document.getElementById("hometab_messagewall").innerHTML = messages_to_string(_messages);
}

function refreshBrowseTab(){
    _email = document.getElementById("browsetab_searchemail").value;
    document.getElementById("browsetab_searchemail").value = _email;
    searchForUser();
}

function message_to_string(_message){
    return _message.writer + ": " + _message.content;
}

function messages_to_string(_messages){
    _output = "";

    for(var i = 0; i < _messages.length; i++){
        _output = _output + message_to_string(_messages[i]) + "<hr>";
    }
    return _output;
}

function browseTab(){
    changeCurrentWindow("browsetab");
    if(document.getElementById("browsetab_name").innerHTML == ""){
        document.getElementById("UserData").style.visibility="hidden";
        document.getElementById("browsetab_messagebox").style.visibility="hidden";
    }
    ExtraWindow.hide();

}

function changePassword(){
    _token = localStorage.getItem("token");
    _oldpassword = document.getElementById("oldpass").value;
    _newpassword = document.getElementById("newpass").value;
    _repeat_newpassword = document.getElementById("repeat_newpass").value;
    if (_newpassword == _repeat_newpassword){
        _message = serverstub.changePassword(_token, _oldpassword, _newpassword);
        if (_message.success){
            ExtraWindow.display("Password changed successfully!", "green");
        }
        else{
            ExtraWindow.display("Failed to change password", "red");
        }
    }
    else{
        ExtraWindow.display("New Password and Repeat new Password does not match!", "red");
    }
}

function logOut(){
    _token = localStorage.getItem("token");
    serverstub.signOut(_token);
    localStorage.removeItem("token");
    ExtraWindow.hide();
    displayView();
}

function hometabSubmit(){

    _token = localStorage.getItem("token");
    _message = document.getElementById("hometab_usertext").value;
    _email = document.getElementById("hometab_email").innerHTML;

    var message = serverstub.postMessage(_token, _message, _email);

    if(message.success == true){
        _writer = serverstub.getUserDataByToken(_token).data.email;
        _wall = document.getElementById("hometab_messagewall") ;
        _wall.innerHTML = _writer + ": " + _message + "<hr>" + _wall.innerHTML;
    }

    document.getElementById("hometab_usertext").value = "";
}

function searchForUser(){
    ExtraWindow.hide();
    _token = localStorage.getItem("token");
    _email = document.getElementById("browsetab_searchemail").value;
    _userdata = serverstub.getUserDataByEmail(_token, _email);


    if(_userdata.success){

        document.getElementById("UserData").style.visibility ="visible";
        document.getElementById("browsetab_messagebox").style.visibility="visible";

        _messages = serverstub.getUserMessagesByEmail(_token, _email).data;

        document.getElementById("browsetab_name").innerHTML = _userdata.data.firstname;
        document.getElementById("browsetab_familyname").innerHTML = _userdata.data.familyname;
        document.getElementById("browsetab_gender").innerHTML = _userdata.data.gender;
        document.getElementById("browsetab_city").innerHTML = _userdata.data.city;
        document.getElementById("browsetab_country").innerHTML = _userdata.data.country;
        document.getElementById("browsetab_email").innerHTML = _userdata.data.email;
        document.getElementById("browsetab_messagewall").innerHTML = messages_to_string(_messages);
    }
    else{
        ExtraWindow.display("That user does not exist", "red");
    }

    update_browsetab();
}

function browsetabSubmit(){

    _token = localStorage.getItem("token");
    _message = document.getElementById("browsetab_usertext").value;
    _email = document.getElementById("browsetab_email").innerHTML;

    var message = serverstub.postMessage(_token, _message, _email);

    if(message.success == true){
        _writer = serverstub.getUserDataByToken(_token).data.email;
        _wall = document.getElementById("browsetab_messagewall") ;
        _wall.innerHTML = _writer + ": " + _message + "<hr>" + _wall.innerHTML;
    }

    document.getElementById("browsetab_usertext").value = "";

    update_browsetab();
}

function update_browsetab(){
    var _main = document.getElementById("main");
    _browsetab = _main.innerHTML;
}

var ExtraWindow = {

    display: function(message, color){
        _messagebox = document.getElementById("messagebox");
        _messagebox.style.display = "block";
        _messagebox.style.color = color;
        _messagebox.innerHTML = message;
    },
    hide: function(){
        _messagebox = document.getElementById("messagebox");
        _messagebox.style.display="none";
    }

}













