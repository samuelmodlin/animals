var change = ['Search...', 'Search Animals...', 'Search Type...', 'Search Keywords...'];
var changeCounter = 0,
    displayMode = 0,
    timeOut = false,
    element, clickElement, lastVerify;
$(document).ready(function () {
    document.getElementById('search').addEventListener('change', searchChange);
    document.getElementById('search').addEventListener('keyup', searchChange);
    document.getElementById('search').addEventListener('paste', searchChange);
    if (!(JSON.parse(localStorage["save"]) === null)) {
        data = JSON.parse(localStorage["save"]);
    }
    Handlebars.registerHelper('index_of', function (context, ndx) {
        return context[ndx];
    });
    setInterval(function () {
        changeCounter++;
        if (changeCounter > 3) {
            changeCounter = 0;
        }
        $("#search").attr('placeholder', change[changeCounter]);
    }, 750);
    reset();
});

function reset() {
    $(".item").attr('class', 'item');
    $(".content").html('');
    $(".navbar").css({
        'margin-bottom': '21px'
    });
    if (displayMode < 3) {
        $("#" + displayMode).addClass('active');
        $("#search").val('');
    } else {
        $("#1").addClass('active');
    }
    if (displayMode == 0) {
        $('.content').append(Handlebars.compile($('#category-template').html())({
            category: data.category
        }));
    } else if (displayMode == 1) {
        $('.content').append(Handlebars.compile($('#item-template').html())({
            category: data.category,
            categories: true
        }));
    } else if (displayMode == 3) {
        $(".navbar").css({
            'margin-bottom': '0',
            'padding': '0'
        });
        search();
    }
}

function search() {
    var searchCorrect = [];
    var itemCategory = [];
    var itemIndex = [];
    $('.content').append(Handlebars.compile($('#search-dialog').html())({
        search: $("#search").val()
    }));
    for (i = 0; i < data.category.length; i++) {
        if ($('#search').val().toLowerCase() == data.category[i].name.toLowerCase()) {
            for (x = 0; x < data.category[i].animals.length; x++) {
                itemCategory.push(i);
                itemIndex.push(x);
                searchCorrect.push(data.category[i].animals[x]);
            }
            break;
        } else {
            for (x = 0; x < data.category[i].animals.length; x++) {
                if (data.category[i].animals[x].name.toLowerCase().includes($("#search").val().toLowerCase())) {
                    itemCategory.push(i);
                    itemIndex.push(x);
                    searchCorrect.push(data.category[i].animals[x]);
                }
            }
        }
    }
    displaySearchAnimals(searchCorrect, itemCategory, itemIndex);
}

function displaySearchAnimals(array, itemCategory, itemIndex) {
    $('.content').append(Handlebars.compile($('#item-template').html())({
        animals: array,
        numbercategories: itemCategory,
        numbers: itemIndex,
        categories: false
    }));
}

$("a#categories").click(function () {
    displayMode = 0;
    reset();
});
$("a#navAnimals").click(function () {
    displayMode = 1;
    reset();
});
$("a#add").click(function () {
    add();
    $("#navAnimals").click()
});

function add() {
    $("#form-src").removeClass('has-error');
    $("#form-name").removeClass('has-error');
    $("#form-category").removeClass('has-error');
    $("#form-desc").removeClass('has-error');
    $("#modalAdd").modal('show');
}

$(document).on('mouseover', '.title', function () {
    element = $(this).prev().find('.back');
    text = $(this);
    element.animate({
        'opacity': '1'
    }, 350);
});
$(document).on('mouseout', '.title', function () {
    element.animate({
        'opacity': '0.6'
    }, 350);
});
$(document).on('click', '.title', function () {
    clickElement = $(this).prev().find('.back');
    $('#search').val(clickElement.attr('id'));
    displayMode = 3;
    reset();
});
$(document).on('click', '.titleItem', function () {
    clickElement = $(this).prev().find('.back');
    $('.modalContent').html(Handlebars.compile($('#modal-template').html())({
        name: data.category[Number(clickElement.data('category'))].animals[Number(clickElement.data('index'))].name,
        category: data.category[Number(clickElement.data('category'))].name,
        description: data.category[Number(clickElement.data('category'))].animals[Number(clickElement.data('index'))].description
    }));

    $('#modalTemplate').modal('show');
});
function searchChange(){
  displayMode = 3;
  if ($("#search").val() == "" || $("#search").val() == " ") {
      displayMode = 1;
  }
  reset();
}
$(document).on('click', '.clearSearch', function () {
    $('#search').val('');
    displayMode = 1;
    reset();
});
$(document).on('mouseover', '.titleItem', function () {
    element = $(this).prev().find('.back');
    var id = element.data('number');
    var counter = 0;
    text = $(this);
    element.animate({
        'opacity': '1'
    }, 350);
});
$(document).on('mouseout', '.titleItem', function () {
    element.animate({
        'opacity': '0.6'
    }, 350);
});
$(document).on('click', '.add', function () {
    var name = $("#name").val();
    var src = $("#src").val();
    var category = $("#category").val();
    var desc = $("#desc").val();
    validateImage(name, $("#src").val(), category, desc);
});

function validateImage(name, src, category, desc) {
    $("<img>", {
        src: src,
        error: function () {
            afterVerify(false, name, src, category, desc);
        },
        load: function () {
            afterVerify(true, name, src, category, desc);
        }
    });
}

function afterVerify(verified, name, src, category, desc) {
    var categoryExists = false;
    if (verified == true && name != '' && src != '' && category != '' && desc != '') {
        for (i = 0; i < data.category.length; i++) {
            if (category.toLowerCase() == data.category[i].name.toLowerCase()) {
                categoryExists = true;
                data.category[i].animals.push({
                    image1: src,
                    image2: src,
                    name: name,
                    description: desc
                });
            }
        }
        if (categoryExists == false) {
            data.category.push({
                name: category,
                animals: []
            });
            data.category[data.category.length - 1].animals.push({
                image1: src,
                image2: src,
                name: name,
                description: desc
            });
        }
        $('#modalAdd').modal('hide');
        $("#form-src").removeClass('has-error');
        $("#form-name").removeClass('has-error');
        $("#form-category").removeClass('has-error');
        $("#form-desc").removeClass('has-error');
    } else {
        if (verified == false) {
            $("#form-src").addClass('has-error');
        } else {
            $("#form-src").removeClass('has-error');
        }
        if (name == '') {
            $("#form-name").addClass('has-error');
        } else {
            $("#form-name").removeClass('has-error');
        }
        if (category == '') {
            $("#form-category").addClass('has-error');
        } else {
            $("#form-category").removeClass('has-error');
        }
        if (desc == '') {
            $("#form-desc").addClass('has-error');
        } else {
            $("#form-desc").removeClass('has-error');
        }
    }
    reset();
    localStorage["save"] = JSON.stringify(data);
}
