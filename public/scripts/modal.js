//document ready
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex > 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    console.log(randomIndex);
  }

  return array;
}
$(() => {

  // Get the modal
  var modal = document.getElementById('myModal');

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
    $('#display-json').html(`<img src='./images/giphy.gif'>`);
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      $('#display-json').html(`<img src='./images/giphy.gif'>`);
    }
  }

  $('#Recipes').on('click', function (event) {
      event.preventDefault();
      console.log(event.target);
      var checkedItems = [];
      modal.style.display = "block";
      console.log($(".check-list-box.inventory li.active"));
      $(".checked-list-box.inventory li.active").each(function (idx, li) {
        // console.log($(this).text());
        console.log(li);
        console.log(idx);
        checkedItems.push($(li).text());
        console.log($(li).text());
        // counter++;
      });
      console.log(checkedItems);
      $.ajax({
          url: "/food/recipes",
          method: 'POST',
          data: { ingredients: checkedItems }
        })
        .then((results) => {
          let output = "";
          let recipes = JSON.parse(results.body);
          console.log(recipes.recipes);
          recipes.recipes = shuffle(recipes.recipes);
          recipes.recipes.map((recipe_obj) => {
            output += `<div>
                <img class="result" src="${recipe_obj.image_url}" height = "200" weight = "200"> <a href="${recipe_obj.source_url}" target="_blank"> ${recipe_obj.title} </a>
                </div>`;
          });
          setTimeout(function () {
            $('#display-json').html(output)

          }, 10000);

        });

    })
    .catch((err) => {
      console.log(err);
    });
});
