setTimeout(function() {
    $('.names').addClass('names-slide');
}, 50);

setTimeout(function() {
    if ($('.logout').hasClass('logout-slide') === false) {
        $('.logout').addClass('logout-slide');
    }
}, 900);

$('.groove').on('mouseover', function() {
    $(this).addClass('really-grooving')
    $('audio')[0].play();
})

$('.groove').on('mouseleave', function() {
    $(this).removeClass('really-grooving')
    $('audio')[0].pause();
})
