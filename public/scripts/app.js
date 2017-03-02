$(document).ready( () => {
  console.log($(".login"));
  $(".login").hide()
  $("#already").on("click", function(){
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
  $("#grocery-list").on("click", "input:last-of-type", (ev) => {
    console.log(ev.target);

  });
});