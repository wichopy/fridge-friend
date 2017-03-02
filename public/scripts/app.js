$(document).ready(() => {
  console.log($(".login"));
  $(".login").hide()
  $("#already").on("click", function () {
    $("#already").hide();
    $(".register").hide();
    $(".login").show(400);
  });
});




$(() => {
  // $.ajax({
  //   method: "GET",
  //   url: "/api/users"
  // }).done((users) => {
  //   for(user of users) {
  //     $("<div>").text(user.name).appendTo($("body"));
  //   }
  // });;
  // $("#logout").click((ev) => {
  //   console.log(ev.target);
  //   $.ajax({
  //     url: "/session/",
  //     method: "POST",
  //     data: {
  //       _method: 'DELETE'
  //     }
  //   }).done(() => {
  //     console.log("logged out!");
  //   });
  // });

  // $("form").on('submit', function (ev) {
  //   ev.preventDefault();
  //   let inputs = ev.target.getElementsByTagName('input');
  //   console.log(inputs);
  //   if (ev.target.id === 'login') {
  //     $.ajax({
  //       url: "/session/",
  //       method: "POST",
  //       data: {
  //         email: inputs.email.value,
  //         password: inputs.password.value
  //       }
  //     }).done((data) => {
  //       console.log("done logging in!");
  //     });
  //   }
  //   if (ev.target.id === 'register') {
  //     $.ajax({
  //       url: "/users/new",
  //       method: "POST",
  //       data: {
  //         email: inputs.email.value,
  //         password: inputs.password.value
  //       }
  //     }).done((data) => {
  //       console.log("register done!");
  //     });
  //   }
  // });

  $("#grocery-list").on("click", "input:last-of-type", (ev) => {
    console.log(ev.target);

  });
});