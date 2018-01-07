if ($('#goofed').length > 0) {
     $('.title').addClass('slide');
     $('.dirk-bar').addClass('dirk-slide');
     $('.register-inputs').addClass('register-inputs-slide');
} else {
    setTimeout(function() {
        $('.title').addClass('slide')
    }, 300);

    setTimeout(function() {
        $('.dirk-bar').addClass('dirk-slide')
    }, 800);
}

$('input').on('focusin', function() {
    $(this).addClass('focusedInput');
    if ($('.register-inputs').hasClass('register-inputs-slide') === false) {
        $('.register-inputs').addClass('register-inputs-slide');
    }
});

$('input').on('focusout', function() {
    $(this).removeClass('focusedInput')
});

$('button').on('focusin', function() {
    $(this).addClass('focusedButton')
});

$('button').on('focusout', function() {
    $(this).removeClass('focusedButton')
});

$('.register-inputs').on('mouseover', function() {
    if ($('.register-inputs').hasClass('register-inputs-slide') === false) {
        $('.register-inputs').addClass('register-inputs-slide');
    }
});

$('input').on('mouseover', function() {
    $(this).css({'opacity': '0.7'})
});

$('input').on('mouseleave', function() {
    $(this).css({'opacity': '1'})
});

$('button').on('mouseover', function() {
    $(this).css({'color': 'blue'})
});

$('button').on('mouseleave', function() {
    $(this).css({'color': 'hotpink'})
});
