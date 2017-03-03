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
      <input type="text" class="form-control food-item" name="food-item" data-row="${i}" value = "">
      <input type="number" class="form-control food-qty" name="food-qty" placeholder="qty">
    </div>`);
    }
  });
  $("#grocery-list").on('submit', (ev) => {
    ev.preventDefault();
    console.log($(ev.target).serialize());
    $.ajax({
      url: "/food/shopping",
      method: 'POST',
      data: $(ev.target).serialize()
    }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.error(err);
    });
  });

});