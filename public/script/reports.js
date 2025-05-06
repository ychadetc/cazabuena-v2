$(document).ready(function(){
    
    $(document).on('click','#btn-ar-analytics', function(){
        $('.a-r-slider').css('left', '19px')
        $('.report-page .a-r-content .reports-content').css('left', '100%')
        $('.report-page .a-r-content .analytics-content').css('transform', 'scale(1)')
        $('.report-page .a-r-content .analytics-content').css('opacity', '1')
    });

    $(document).on('click','#btn-ar-reports', function(){
        $('.a-r-slider').css('left', '105px')
        $('.report-page .a-r-content .reports-content').css('left', '0%')
        $('.report-page .a-r-content .analytics-content').css('transform', 'scale(.5)')
        $('.report-page .a-r-content .analytics-content').css('opacity', '.10')
    });


});