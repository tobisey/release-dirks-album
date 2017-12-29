$('#delete-sig').hide();

setTimeout(function() {
    $('#delete-sig').fadeIn(1000);
}, 500);

setTimeout(function() {
    $('.options').addClass('options-slide');
}, 800);

$('button').on('focusin', function() {
    $(this).addClass('focusedButton')
});

$('button').on('focusout', function() {
    $(this).removeClass('focusedButton')
});

$('button').on('mouseover', function() {
    $(this).css({'color': 'blue'})
});

$('button').on('mouseleave', function() {
    $(this).css({'color': 'hotpink'})
});

$('.groove').on('mouseover', function() {
    $(this).addClass('really-grooving')
    $('audio')[0].play();
})

$('.groove').on('mouseleave', function() {
    $(this).removeClass('really-grooving')
    $('audio')[0].pause();
})
