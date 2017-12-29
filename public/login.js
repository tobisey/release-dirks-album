if ($('#goofed').length > 0) {
     $('.login-inputs').addClass('login-inputs-slide');
} else {
    setTimeout(function() {
        $('.login-inputs').addClass('login-inputs-slide')
    }, 300);
}

console.log($('#goofed').length);

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
