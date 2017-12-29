if ($('#goofed').length > 0) {
     $('.edit-inputs').addClass('edit-inputs-slide');
} else {
    setTimeout(function() {
        $('.edit-inputs').addClass('edit-inputs-slide')
    }, 50);
}

setTimeout(function() {
    if ($('.logout').hasClass('logout-slide') === false) {
        $('.logout').addClass('logout-slide');
    }
}, 900);

$('input').on('focusin', function() {
    $(this).addClass('focusedInput');
})

$('input').on('focusout', function() {
    $(this).removeClass('focusedInput')
})

$('button').on('focusin', function() {
    $(this).addClass('focusedButton')
})

$('button').on('focusout', function() {
    $(this).removeClass('focusedButton')
})

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
