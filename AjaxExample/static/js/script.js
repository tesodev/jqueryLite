console.time();
$(function(){
    console.log($(".right").shift());
    console.log($(".right").pop());
    console.log($("#logInBtn").offset());
    // console.log($("#logInBtn").css("position","absolute"));
    // console.log($("#logInBtn").css("left","50px"));
    // console.log($("#logInBtn").css({left: "50px", position: "absolute"}));
    $("#logInBtn").hover((e)=>console.log("mouse on login button"),(e) =>console.log("mouse out login button"));
    console.log($("#logInBtn").parents().el);
    console.log($("#logInBtn").parents(".right").el);
    console.log($("#logInBtn").siblings().el);
    console.log($("#logInBtn").siblings("#loggedUser").el);
    console.log($(".container").children().el);
    console.log($(".container").children("div").el);
    console.log($("#logInBtn").parent().el);
    console.log($("#logInBtn").closest(".row").el);
    console.log($("[name]"));
    console.log($("[name]:lt(1)"));
    console.log($("[type='email']").val("asdasd"));
    $("#logInBtn").before($(".side-nav1"));
    /** sideNav **/{
        /** init **/{
            $('.left_sidenav').sideNav({
                // menuWidth: 250,
                // edge: 'left', // default left
                target: '.side-nav1',
                // closeOnClick: false, //default false
                time: 0.5, // default 0
                onOpen: function (el) {
                    console.log("left sidenav opened, ", el)
                },
                onClose: function (el) {
                    console.log("left sidenav closed, ", el)
                }
            });
            $('.right_sidenav').sideNav({
                menuWidth: 250,
                edge: 'right',
                target: '.side-nav2',
                closeOnClick: true,
                time: 0.5,
                onOpen: function (el) {
                    console.log("right sidenav opened, ", el)
                },
                onClose: function (el) {
                    console.log("right sidenav closed, ", el)
                }
            });
        }
        /** methods **/{
            // $('.right_sidenav').sideNav("destroy");
            // $('.right_sidenav').sideNav("open");
            // $('.right_sidenav').sideNav("close");
            // $('.right_sidenav').sideNav("toggle");
        }
        /** shortcuts **/{
            $(window).on("keydown", function (ev) {
                if (ev.keyCode === 9) { // tab
                    ev.preventDefault();
                    $(".right_sidenav").sideNav("close");
                    $(".left_sidenav").sideNav("toggle");
                }
                if (ev.keyCode === 79) { // o
                    ev.preventDefault();
                    $(".left_sidenav").sideNav("close");
                    $(".right_sidenav").sideNav("toggle");
                }
            });
        }
    }
    $.ajax({
        url: '/loggedIn',
        type: 'GET',
        success: function(response){
            if(response) {
                $("#loggedUser").text(response.email).removeClass("hide");
                $("#logOutBtn").removeClass("hide");
                $("#logInBtn, #signUpBtn").toggleClass("hide");
            }
        },
        error: function(error){
            console.log(error);
        }
    });
    console.log($(".side-nav").push(document.getElementById("logOutBtn")));
    console.log($(".side-nav").push($("#logOutBtn")))

    console.timeEnd();
    $(".modal").forEach(function (val,index) {
        console.log(val,index)
    });
    $(".modal").map(function (val,index) {
        console.log(val,index);
    });
    let even = (element, index)=> index % 2 === 0;
    console.log($(".modal").filter(even));
    console.log($(".modal").some(even));
    $('form#signUpForm').on("submit",function(ev){
        ev.preventDefault();
        let email = $("form#signUpForm input[type=email]").val();
        let password = $("form#signUpForm input[type=password]").val();
        $.ajax({
            url: 'signUp',
            data: $("form#signUpForm").serialize(),
            type: 'POST',
            success: function(response){
                if(typeof response === "string")
                    $.toast(response);
                else
                    $.toast("Successfully signed up");
                    $("#signUpModal").fadeOut(10, function () {
                        $("form#signUpForm").reset();
                    });
            },
            error: function(error){
                console.log(error);
            }
        })
        // .then(function (value) { console.log(value) })
        // .catch(function (reason) { console.error(reason) });
    });
    $("#signUpBtn").on("click",function (ev) {
        $("#signUpModal").fadeIn(100);
        $("form#signUpForm").toggleClass("signUpForm");
    });
    $('form#logInForm').on("submit",function(ev){
        ev.preventDefault();
        let email = $("form#logInForm input[type=email]").val();
        let password = $("form#logInForm input[type=password]").val();
        $.ajax({
            url: '/logIn',
            data: $("form#logInForm").serialize(),
            type: 'POST',
            success: function(response){
                if(typeof response === "string")
                    $.toast(response);
                else {
                    $("#loggedUser").text(email).removeClass("hide");
                    $("#logOutBtn").removeClass("hide");
                    $("#logInBtn, #signUpBtn").toggleClass("hide");
                    $.toast("Successfully logged in");
                }
                $("#logInModal").fadeOut(10, function () {
                    $("form#logInForm").reset();
                });
            },
            error: function(error){
                console.log(error);
            }
        })
        // .then(function (value) { console.log(value) })
        // .catch(function (reason) { console.error(reason) });
    });
    $("#logInBtn").on("click",function (ev) {
        $("#logInModal").modal("open").fadeIn(100);
        $("form#logInForm").toggleClass("logInForm");
    });
    $("#logOutBtn").on("click",function (ev) {
        $.ajax({
            url: '/logOut',
            type: 'GET',
            success: function(response){
                $("#loggedUser").toggleClass("hide");
                $("#logOutBtn").addClass("hide");
                $("#logInBtn, #signUpBtn").toggleClass("hide");
                $.toast(response);
            },
            error: function(error){
                console.log(error);
            }
        })
    });

    let columnDefs = [
        {name: "ID", searchable: true, key: "id"},
        {name: "Name", searchable: true, key: "name"},
        {name: "E-mail", searchable: true, key: "email"}
    ], options ={
            columnDragHandle: "", // selector of handler (must be inside of th tag)
            resize: true, // default: true
            columnOnDragClass: "columnOnDrag",
            rowOnDragClass: "rowOnDrag",
            onIndexChange: function (oldIndex, newIndex, type, rowElement) {
                console.log(oldIndex, newIndex, type, rowElement)
            }
        };
    let dataTable1 = new DataTable('#testTable1', columnDefs,[
            {id:1,name:"baris",email:"bariskaracaa@gmail.com"},
            {id:2,name:"alpkan",email:"alpkancicek@gmail.com"},
            {id:3,name:"kenan",email:"kenankurt@gmail.com"},
            {id:4,name:"tanzer",email:"tanzeratay@gmail.com"},
            {id:5,name:"serkan",email:"serkanturkeli@gmail.com"}
        ]);
    dataTable1.create();
    let dt1 = new DragTable($("#testTable1"),options);
    dt1.createColumnSort();
    dt1.createRowSort();
    let dataTable = new DataTable('#testTable', columnDefs,[
            {id:1,name:"baris",email:"bariskaracaa@gmail.com"},
            {id:2,name:"alpkan",email:"alpkancicek@gmail.com"},
            {id:3,name:"kenan",email:"kenankurt@gmail.com"},
            {id:4,name:"tanzer",email:"tanzeratay@gmail.com"}
        ]);
    dataTable.create();
    let dt = new DragTable($("#testTable"),options);
    dt.createColumnSort();
    dt.createRowSort();
    $.modal();
    $.tabs(function (el, index) {
        if(index === 0)
            dt.create();
        else
            dt1.create()
    });
});
