$(document).ready(() => {

  $(".login").hide()
  $("#already").on("click", function () {
    $("#already").hide();
    $(".register").hide();
    $(".login").show(400);

  });
  // $(".list-group-item").hide();
  const ingRender = ((items) => {
    for (let ingredient of items) {
      let $ingredient = $("<li></li>").addClass("list-group-item").text(ingredient);
      $('.list-group.checked-list-box').append($ingredient);
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
      ev.preventDefault();
      $(".list-group-item").each(function () {
        var currentLi = $(this);
        // console.log(currentLi.text());
        if (currentLi.text() === "") {
          // console.log($(this).val());

          currentLi.html(`<span class="state-icon glyphicon glyphicon-unchecked"></span><input type="checkbox" class="hidden">${$(".food-item").val()}
            <button type="button" class="btn btn-default trashbutton">
        <i class="fa fa-trash-o"></i>
      </button> `);
        currentLi.find(".trashbutton").on('click', (ev) => {
          ev.stopPropagation();
          $.ajax({
            url: "/food/delPend",
            method: "POST",
            data: {
              _method: "DELETE",
              'food-item': $(this).closest('.list-group-item').text().trim()
            }
          })
          .then(() => {
            console.log("I got killed");
            $(this).closest('.list-group-item').html(`<span class="state-icon glyphicon glyphicon-unchecked"></span><input type="checkbox" class="hidden">`);
          })
          .catch((err) => {
            console.log(err)
          });
        });
          // >>>>>>> 4b1162876c4b26a3167e19f4d7f6302a614b204a
          $.ajax({
            url: "/food/shopping",
            method: 'POST',
            data: { 'food-item': $(".food-item").val().trim() }
          }).then((res) => {
            console.log('sucessful post');
            $(".food-item").val(''); //clear text box after saving.

          }).catch((err) => {
            console.error(err);
          });
          return false;
        }
      });
    }
    if (ev.target.id === "clear") {
      $(".input-group").remove();
      $('#purchased').after(`<div class="input-group">
       <span class="input-group-addon">
        <input type="checkbox">
      </span>
      <input type="text" class="form-control food-item" name="food-item" data-row="${i}" value = "">
      <input type="number" class="form-control food-qty" name="food-qty" placeholder="qty">

    </div>`);
    }
    if (ev.target.id === "purchased") {
      ev.preventDefault();
      var checkedItems = [];

      //<<<<<<< HEAD
      console.log($(".checked-list-box li.active .shopping"))


      $(".checked-list-box.shopping li.active").each(function (idx, li) {
        checkedItems.push($(li).text().trim());

        $.ajax({
          url: "/food/inventory",
          method: 'POST',
          data: { 'food-item': $(li).text().trim() }
        }).then((res) => {
          console.log('sucessful post');
          $(li).html(`<span class="state-icon glyphicon glyphicon-check"></span><input type="checkbox" class="hidden">`);

        }).catch((err) => {
          console.error(err);
        });
      });
      checkedItems;
    }
  });

  // $(function () {
  $('.list-group.checked-list-box.shopping .list-group-item').each(function () {

    // Settings
    var $widget = $(this),
      $checkbox = $('<input type="checkbox" class="hidden" />'),
      color = ($widget.data('color') ? $widget.data('color') : "primary"),
      style = ($widget.data('style') == "button" ? "btn-" : "inventory-list-group-item-"),
      settings = {
        on: {
          icon: 'glyphicon glyphicon-check'
        },
        off: {
          icon: 'glyphicon glyphicon-unchecked'
        }
      };

    $widget.css('cursor', 'pointer')
    $widget.append($checkbox);

    // Event Handlers
    $widget.on('click', function () {
      $checkbox.prop('checked', !$checkbox.is(':checked'));
      $checkbox.triggerHandler('change');
      updateDisplay();
    });
    $checkbox.on('change', function () {
      updateDisplay();
    });

    function updateDisplay() {
      var isChecked = $checkbox.is(':checked');

      // Set the button's state
      $widget.data('state', (isChecked) ? "on" : "off");

      // Set the button's icon
      $widget.find('.state-icon')
        .removeClass()
        .addClass('state-icon ' + settings[$widget.data('state')].icon);

      // Update the button's color
      if (isChecked) {
        $widget.addClass(style + color + ' active');
      } else {
        $widget.removeClass(style + color + ' active');
      }
    }

    // Initialization
    function init() {

      if ($widget.data('checked') == true) {
        $checkbox.prop('checked', !$checkbox.is(':checked'));
      }

      updateDisplay();

      // Inject the icon if applicable
      if ($widget.find('.state-icon').length == 0) {
        $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
      }
    }
    init();
  });


  $('.list-group.checked-list-box.inventory .list-group-item').each(function () {
    // console.log(this);
    // Settings
    var $widget = $(this),
      $checkbox = $('<input type="checkbox" class="hidden" />'),
      color = ($widget.data('color') ? $widget.data('color') : "primary"),
      style = ($widget.data('style') == "button" ? "btn-" : "inventory-list-group-item-"),
      settings = {
        on: {
          icon: 'glyphicon glyphicon-check'
        },
        off: {
          icon: 'glyphicon glyphicon-unchecked'
        }
      };

    $widget.css('cursor', 'pointer')
    $widget.append($checkbox);

    // Event Handlers
    $widget.on('click', function () {
      $checkbox.prop('checked', !$checkbox.is(':checked'));
      $checkbox.triggerHandler('change');
      updateDisplay();
    });
    $checkbox.on('change', function () {
      updateDisplay();
    });

    function updateDisplay() {
      var isChecked = $checkbox.is(':checked');

      // Set the button's state
      $widget.data('state', (isChecked) ? "on" : "off");

      // Set the button's icon
      $widget.find('.state-icon')
        .removeClass()
        .addClass('state-icon ' + settings[$widget.data('state')].icon);

      // Update the button's color
      if (isChecked) {
        $widget.addClass(style + color + ' active');
      } else {
        $widget.removeClass(style + color + ' active');
      }
    }

    // Initialization
    function init() {

      if ($widget.data('checked') == true) {
        $checkbox.prop('checked', !$checkbox.is(':checked'));
      }

      updateDisplay();

      // Inject the icon if applicable
      if ($widget.find('.state-icon').length == 0) {
        $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
      }
    }
    init();
  });
});
