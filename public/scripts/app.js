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