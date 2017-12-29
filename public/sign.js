$('.canv').hide();
$('#sign-button').hide();

if ($('#goofed-sign').length > 0) {
     $('.dirk-bar-sign').hide();
     $('.canv').show();
     $('.logout').addClass('logout-slide');
     $('#projector')[0].play();
     $('#sign-button').show();
} else {
    setTimeout(function() {
        $('.dirk-bar-sign').fadeOut(1000);
    }, 100);

    setTimeout(function() {
        $('.canv').show();
        $('.canv').addClass('animate');
        $('#projector')[0].play()
    }, 1400);

    setTimeout(function() {
        $('#sign-button').fadeIn(1000);
    }, 2000);

    setTimeout(function() {
        $('.logout').addClass('logout-slide');
    }, 3000);
}

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

var canvas = $('.canv');
var context = canvas[0].getContext('2d');
var sigInput = $('#sig');

canvas.on('mousedown', function() {
    context.beginPath();
    context.strokeStyle = 'hotpink';
    context.lineWidth = 4;
    context.shadowColor = 'purple';
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;

    canvas.on('mousemove.event', function(e) {
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
    }).on('mouseup', function(e){
        canvas.off('.event');
        sigInput.val(canvas[0].toDataURL())
        console.log(sigInput.val());
    }).on('mouseleave', function(e){
        canvas.off('.event')
        sigInput.val(canvas[0].toDataURL())
        console.log(sigInput.val());
    })

})
