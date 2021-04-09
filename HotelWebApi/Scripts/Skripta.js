$(document).ready(function () {

    //>>>>>>>>>>>>>>>>> Global variable initialization on start <<<<<<<<<<<<<<<<<<<<<<<<<
    var host = window.location.host;
    var token = null;
    var headers = {};
    var hoteliEndpoint = "/api/hoteli";
    var lanciEndpoint = "/api/lanci";

    var editingId;
    //Prva stranica pri ucitavanju 
    $("#logoutDiv").css("display", "none");
    $("#loginDiv").css("display", "none");
    $("#regForm").css("display", "block");


 
//----------------------------------------------
    $("body").on("click", "#btnAlready", LoadLogin);
    
    function LoadLogin() {
        $("#loginDiv").css("display", "block");
        $("#regForm").css("display", "none");

    }
    //---------------------------------------------
   


    $("#btnPrijava").click(function () {
        $("#loginDiv").css("display", "block");
        $("#regForm").css("display", "none");
        $("#regPrijLogHead").addClass("hidden");
    });

    var hoteliUrl = "http://" + host + hoteliEndpoint;
    var lanciUrl = "http://" + host + lanciEndpoint;

    $.getJSON(hoteliUrl, setHoteli);
    //>>>>>>>>>>>> Dugmici na klik <<<<<<<<<<<
    $("body").on("click", "#logoutBtn", reset);
    $("body").on("click", "#giveUpBtn", cleanForm);
    $("body").on("click", "#btnDelete", deleteHotel);




    $("body").on("click", "#loginBtn", ulogujSe);

    $("body").on("click", "#findBtn", pretrazi);
    $("body").on("click", "#btnTradicija", loadTradition);

    $("body").on("click", "#regBtn", loadRegistration);

    //>>>>>>>>>>>>>>>> Clean creation form <<<<<<<<<<<<<<

    function cleanForm() {
        //$("#createInput1select").val('');
        $("#createInput2").val('');
        $("#createInput3").val('');
        $("#createInput4").val('');
        $("#createInput5").val('');

    }

    //>>>>>>>> Load registration form <<<<<<<<<<
    function loadRegistration() {
        $("#info").empty();
        $("#loginDiv").css("display", "block");
        $("#regForm").css("display", "none");
    }

    //>>>>>>>> Load login form <<<<<<<<<<
    $("body").on("click", "#jumpToLogin", reset);

    //>>>>>>>>>>>>>>> Reset/logout <<<<<<<<<<<<<<<
    function reset() {
        if (token != null) {
            token = null;
        }
        $("#loginDiv").css("display", "none");
        $("#regForm").css("display", "none");
        $("#logoutDiv").css("display", "none");
        $("#loggedInParagraph").empty();
        $("#create").addClass("hidden");
        $("#pFirst").empty();
        $("#pSecond").empty();
        $("#loginDiv").css("display", "none");
        $("#regForm").css("display", "block");
        $("#info").empty();

        $("#sTrad").addClass("hidden");
        $("#regPrijLogHead").removeClass("hidden");
        $("#postReg").addClass("hidden");
        $("#sTrad").addClass("hidden");
        $("#btnTradicija").css("display", "block");


        $.getJSON(hoteliUrl, setHoteli);

    }

    //----------------------------- REGISTRATION---------------------------

    $("#registration").submit(function (e) {
        e.preventDefault();

        var email = $("#regEmail").val();
        var loz1 = $("#regPass").val();
        var loz2 = $("#regPass2").val();


        var sendData = {
            "Email": email,
            "Password": loz1,
            "ConfirmPassword": loz2
        };

        $.ajax({
            type: "POST",
            url: 'http://' + host + "/api/Account/Register",
            data: sendData

        }).done(function (data) {

            $("#regEmail").val('');
            $("#regPass").val('');
            $("#regPass2").val('');
            $("#loginDiv").css("display", "block");
            $("#regForm").css("display", "none");
            

            $("#postReg").removeClass("hidden");





        }).fail(function (data) {
            alert("Your Registration failed! Try Again!");
        });
    });
    //-----------------------LOGIN------------------------

    function ulogujSe() {

        var email = $("#loginEmail").val();
        var loz = $("#loginPass").val();

        var sendData = {
            "grant_type": "password",
            "username": email,
            "password": loz
        };

        $.ajax({
            "type": "POST",
            "url": 'http://' + host + "/Token",
            "data": sendData

        }).done(function (data) {
            console.log(data);
            $("#info").empty().append("Logged in user: " + data.userName);

            token = data.access_token;
            console.log(token);
            $("#loginEmail").val('');
            $("#loginPass").val('');
            $("#loginDiv").css("display", "none");
            $("#regForm").css("display", "none");
            $("#loggedInParagraph").append("Logged in user: " + "<b>" + email + "</b>");
            $("#logoutDiv").css("display", "block");
            $.getJSON(hoteliUrl, setHoteli);
            $.getJSON(lanciUrl, getLanci);

            $("#data").css("display", "block");
            $("#create").removeClass("hidden");
            $("#search").removeClass("hidden");
            $("#tradition").removeClass("hidden");
            $("#regPrijLogHead").addClass("hidden");
            $("#postReg").addClass("hidden");
            $("#sTrad").removeClass("hidden");


        }).fail(function (data) {
            alert("Your login attempt failed! Try Again!");
        });

    };

    //>>>>>>>>>>>>>> Adding main entity(festival) <<<<<<<<<<<<<<<<<<<<<<<<<

    $("#create").submit(function (e) {

        e.preventDefault();



        var lanacId = $("#createInput1select").val();
        var naziv = $("#createInput2").val();
        var godina = $("#createInput3").val();
        var brojSoba = $("#createInput4").val();
        var brojZaposlenih = $("#createInput5").val();

        $("#validationMsgInput1").empty();
        $("#validationMsgInput2").empty();
        $("#validationMsgInput3").empty();


        if (token) {
            headers.Authorization = "Bearer " + token;
        }

        var dataCreate = {
            "LanacId": lanacId,
            "Naziv": naziv,
            "GodinaOtvaranja": godina,
            "BrojSoba": brojSoba,
            "BrojZaposlenih": brojZaposlenih
        }
        httpAction = "POST";

        $.ajax({
            "url": hoteliUrl,
            "type": httpAction,
            "data": dataCreate,
            "headers": headers
        })
            .done(function (data, status) {
                $.getJSON(hoteliUrl, setHoteli);
                //$("#createInput1select").val('');
                $("#createInput2").val('');
                $("#createInput3").val('');
                $("#createInput4").val('');
                $("#createInput5").val('');

            })
            .fail(function (data, status) {
                validation();
            })

    })

   

    //>>>>>>>>>>>>>>>> Load 2nd entity into dropdown menu-create form <<<<<<<<<<<<<<<<<<

    function getLanci(data, status) {
        var lanci = $("#createInput1select");
        lanci.empty();

        if (status === "success") {

            for (var i = 0; i < data.length; i++) {
                var option = "<option value=" + data[i].Id + ">" + data[i].Naziv + "</option>";
                lanci.append(option);
            }
        }
        else {
            var div = $("<div></div>");
            var h3 = $("<h3>Greška prilikom preuzimanja lanaca!</h3>");
            div.append(h3);
            lanci.append(div);
        }



    }
    // metoda za postavljanje proizvoda u tabelu
    function setHoteli(data, status) {

        var $container = $("#data");
        $container.empty();

        if (status == "success") {
            // ispis naslova
            var div = $("<div></div>");
            var h1 = $("<h1 style='text-align:center'>Hotels</h1>");
            div.append(h1);
            // ispis tabele
            var table = $("<table class='table table-bordered'></table>");
            if (token) {
                var header = $("<tr class='text-center' style='background-color:Gainsboro'><td  style='padding:7px; width:150px'>Name</td><td style = 'width:150px; padding:7px'>Foundation year</td><td style = 'width:150px; padding:7px'>Number of rooms</td><td style = 'width:150px; padding:7px'>Number of employees</td><td style = 'width:150px; padding:7px'>Chain</td><td style='width:auto'>Delete</td></tr>");
            } else {
                var header = $("<tr class='text-center' style='background-color:Gainsboro'><td  style='padding:7px; width:150px'>Name</td><td style = 'width:150px; padding:7px'>Foundation year</td><td style = 'width:150px; padding:7px'>Number of rooms</td><td style = 'width:150px; padding:7px'>Number of employees</td><td style = 'width:150px; padding:7px'>Chain</td></tr>");
            }

            table.append(header);
            tbody = $("<tbody></tbody>");
            for (i = 0; i < data.length; i++) {
                // prikazujemo novi red u tabeli
                var row = "<tr>";
                // prikaz podataka
                var displayData = "<td style='padding:7px;text-align:center'>" + data[i].Naziv + "</td><td style='padding:7px;text-align:center'>" + data[i].GodinaOtvaranja + "</td>" + "<td style='padding:7px;text-align:center'>" + data[i].BrojSoba + "</td>" + "<td  style='padding:7px;text-align:center'>" + data[i].BrojZaposlenih + "</td>" + "<td  style='padding:7px;text-align:center'>" + data[i].LanacNaziv + "</td>";
                // prikaz dugmadi za izmenu i brisanje
                var stringId = data[i].Id.toString();
                var displayDelete = "<td><button href=\"#\" id=btnDelete class='btn btn-default' style='color:white; background-color: red' name=" + stringId + ">Delete</button></td>";
                
                // prikaz samo ako je korisnik prijavljen
                if (token) {
                    row += displayData + displayDelete + "</tr>";  
                } else {
                    row += displayData + "</tr>";
                }
                // dodati red
                tbody.append(row);
            }
            table.append(tbody);

            div.append(table);
            if (token) {
                // prikaz forme ako je korisnik prijavljen
                $("#formData").css("display", "block");
            }

            // ispis novog sadrzaja
            $container.append(div);
        }
        else {
            var div = $("<div></div>");
            var h1 = $("<h1>Error during your last action!</h1>");
            div.append(h1);
            $container.append(div);
        }
    };





    //>>>>>>>>>>>>>>>>>>>> Removing entry from table od button delete <<<<<<<<<<<<<<<<<<<<<<<
    function deleteHotel() {
        var deleteId = this.name;
        console.log(this.name);
        httpAction = "DELETE";

        if (token) {
            headers.Authorization = "Bearer " + token;
        }
        var hoteliUrl = "http://" + host + hoteliEndpoint;
        $.ajax({
            "url": hoteliUrl + "?id=" + deleteId,
            "type": httpAction,
            "headers": headers

        })
            .done(function (data, status) {
                hoteliUrl = "http://" + host + hoteliEndpoint;
                $.getJSON(hoteliUrl, setHoteli);

            })
            .fail(function (data, status) {

                alert("Error during your last action!!")
            })

    };
    // api/hoteli/kapacitet?najmanje=140&najvise=200
    //>>>>>>>>>>>>>>>>>>>>>> Search form <<<<<<<<<<<<<<<<<<<<<<<<<
    function pretrazi() {
        var start = $("#findInput1").val();
        var kraj = $("#findInput2").val();
        httpAction = "POST";

        if (token) {
            headers.Authorization = "Bearer " + token;
        }

        var pretragaUrl = "http://" + host + "/api/kapacitet?najmanje=" + start + "&najvise=" + kraj;
        $.ajax({
            "url": pretragaUrl,
            "type": httpAction,
            "headers": headers
        })
            .done(setHoteli)
            .fail(function (data, status) {
                alert("Error during your last action!");
            });
        $("#findInput1").val('');
        $("#findInput2").val('');

    };

    //>>>>>>>>>>>>>>>>>>>>>>>>> Load tradition hotels <<<<<<<<<<<<<<<<<<<<<<
    function loadTradition() {

        httpAction = "GET";

        if (token) {
            headers.Authorization = "Bearer " + token;
        }

        var traditionUrl = "http://" + host + "/api/tradicija";
        $.ajax({
            "url": traditionUrl,
            "type": httpAction,
            "headers": headers
        })
            .done(function (data) {
                $("#pFirst").html("<b>1. " + data[0].Naziv + "</b> (founded: <b>" + data[0].GodinaOsnivanja + "</b>. year)");
                $("#pSecond").html("<b>2. " + data[1].Naziv + "</b> (founded: <b>" + data[1].GodinaOsnivanja + "</b>. year)");
                $("#btnTradicija").css("display", "none");

            })
            .fail(function (data, status) {
                alert("Error during your last action!");
            });

    };

});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Data validation before creating an object and submiting it to controller <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function validation() {
    var name = $("#createInput1").val();
    var price = $("#createInput2").val();
    var year = $("#createInput3").val();
    var pName = $("#validationMsgInput1");
    var pPrice = $("#validationMsgInput2");
    var pYear = $("#validationMsgInput3");

    var isValid = true;

    if (!name) {
        pName.text("Naziv festivala je obavezno polje!");
        isValid = false;
    }
    if (!price || price < 0) {
        pPrice.text("Cena je obavezno polje i mora biti veca od 0!");
        isValid = false;
    }
    if (!year) {
        pYear.text("Godina je obavezno polje!");
        isValid = false;
    }
    else if (year < 1950 || year > 2018) {
        pYear.text("Godina mora biti iz perioda od 1950. do 2018.!");
        isValid = false;
    }

    return isValid;
}