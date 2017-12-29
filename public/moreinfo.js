setTimeout(function() {
    $('.more-info-inputs').addClass('more-info-inputs-slide');
}, 50);

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
