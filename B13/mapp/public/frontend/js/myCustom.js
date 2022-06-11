$('#headline').owlCarousel({
    dots: false,
    items: 1,
    loop:true,
    autoplay: true,
    autoplayTimeout: 4000
});

$('#featured').owlCarousel({
    dots: false,
    items: 1,
    loop:true,
    autoplay: true,
    autoplayTimeout: 5000,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn'
});