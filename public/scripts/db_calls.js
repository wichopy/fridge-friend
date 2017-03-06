$(() => {

  $.ajax({
    url: "/food/shopping",
    method: 'GET'
      // data: { 'food-item': $(".food-item").val().trim() }
  }).then((res) => {
    console.log(res);
    if (res.length === 0) { return false; }
    var i = 0;
    $(".list-group.checked-list-box.shopping .list-group-item").each(function () {
      var currentLi = $(this);
      currentLi.html(
        `<span class="state-icon glyphicon glyphicon-unchecked">
        </span>
        <input type="checkbox" class="hidden">
        ${res[i].name}<button type="button" style="cursor: pointer;" class="btn btn-default trashbutton">
        <i class="fa fa-trash-o"></i>
      </button>`);
      currentLi.find(".trashbutton").on('click', (ev) => {
        console.log($(this).closest('.list-group-item').text().trim());
        ev.stopPropagation();
        $.ajax({
          url: "/food/delPend",
          method: "POST",
          data: {
            _method: "DELETE",
            'food-item': $(this).closest('.list-group-item').text().trim()
          }
        }).then(() => { console.log("I got killed"); }).catch((err) => { console.log(err) });
      });
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
    if (res.length === 0) { return false; }
    var i = 0;
    $(".list-group.checked-list-box.inventory .list-group-item").each(function () {
      var currentLi = $(this);
      currentLi.html(
        `<span class="state-icon glyphicon glyphicon-unchecked">
        </span>
        <input type="checkbox" class="hidden">
        ${res[i].name}<button type="button" style="cursor: pointer;" class="btn btn-default trashbutton">
        <i class="fa fa-trash-o"></i>
        </button>`);
      currentLi.find(".trashbutton").on('click', (ev) => {
        ev.stopPropagation();
        $.ajax({
            url: "/food/delInv",
            method: "POST",
            data: {
              _method: "DELETE",
              'food-item': $(this).closest('.list-group-item').text().trim()
            }
          })
          .then(() => { console.log("I got killed"); })
          .catch((err) => { console.log(err) });
      });
      i++;
      if (i === res.length) return false;
    });
  });
  $('input#emailme').on('click', function () {

    $.ajax({
      url: "/food/mailgun",
      method: 'POST'
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
});