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

    
    const ctx = $('#myLineChart')[0].getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Sales',
          data: [12, 19, 3, 5, 2],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });


});