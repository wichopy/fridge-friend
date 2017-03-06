$(() => {

  $.ajax({
    url: "/food/shopping",
    method: 'GET'
      // data: { 'food-item': $(".food-item").val().trim() }
  }).then((res) => {
    console.log(res);

    var i = 0;
    $(".list-group.checked-list-box.shopping .list-group-item").each(function () {
      var currentLi = $(this);
      currentLi.html(
        `<span class="state-icon glyphicon glyphicon-unchecked">
        </span>
        <input type="checkbox" class="hidden">
        ${res[i].name}`);
      i++;
      if (i === res.length) return false;
    });
  }).catch((err) => {
    console.error(err);
  });

  $.ajax({
    url: "/food/inventory",
    method: 'GET'
      // data: { 'food-item': $(".food-item").val().trim() }
  }).then((res) => {
    console.log(res);

    var i = 0;
    $(".list-group.checked-list-box.inventory .list-group-item").each(function () {
      var currentLi = $(this);
      currentLi.html(
        `<span class="state-icon glyphicon glyphicon-unchecked">
        </span>
        <input type="checkbox" class="hidden">
        ${res[i].name}`);
      i++;
      if (i === res.length) return false;
    });
  }).catch((err) => {
    console.error(err);
  });
});