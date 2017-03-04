$(document).ready(() => {

  $(".login").hide()
  $("#already").on("click", function () {
    $("#already").hide();
    $(".register").hide();
    $(".login").show(400);

  });
  var i = 0;
  //// add a new list well
  $('#grocery-list').on("focus", '.food-item', function (ev) {
    // console.log($(ev.target).data("row"));
    if ($(ev.target).data("row") === i || i === 0) {
      i++;
      $('.input-group').last().after(
        `<div class="input-group" style="background: pink;">
      <span class="input-group-addon">
        <input type="checkbox">
      </span>
      <input type="text" class="form-control food-item " name="food-item" data-row="${i}" value = "">
      <input type="number" class="form-control food-qty" name="food-qty" placeholder="qty">
            <button type="button" class="btn btn-default trashbutton">
        <i class="fa fa-trash-o"></i>
      </button>
    </div>`);
    }
  });
  $("#grocery-list").on("click", ".trashbutton", function (ev) {
    console.log(ev.target);
    $(ev.target).closest(".input-group").remove();
  });
  $("#grocery-list").on('click', (ev) => {
    ev.preventDefault();
    // console.log($(ev.target).serialize());
    if (ev.target.id === "save") {
      $.ajax({
        url: "/food/shopping",
        method: 'POST',
        data: $("#grocery-list").serialize()
      }).then((res) => {
        console.log('sucessful post');
      }).catch((err) => {
        console.error(err);
      });
    }
    if (ev.target.id === "clear") {
      $(".input-group").remove();
      $('#purchased').after(`<div class="input-group" style="background: pink;">
      <span class="input-group-addon">
        <input type="checkbox">
      </span>
      <input type="text" class="form-control food-item" name="food-item" data-row="${i}" value = "">
      <input type="number" class="form-control food-qty" name="food-qty" placeholder="qty">
      <button type="button" class="btn btn-default trashbutton">
        <i class="fa fa-trash-o"></i>
      </button>
    </div>`);

    }
    if (ev.target.id === "purchased") {
      $.ajax({
        url: "/food/inventory",
        method: 'POST',
        data: $("#grocery-list").serialize()
      }).then((res) => {
        console.log('sucessful post');
      }).catch((err) => {
        console.error(err);
      });
    }
  });

});