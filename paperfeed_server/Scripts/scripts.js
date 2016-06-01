
//Scripts
$(document).ready(function () {

    {
        $.ajax({
            type: 'GET',
            url: '/api/articles/artnum',
            success: function (data) {
                createChart(data);
            }

        })
    };



    // ======================================================
    // Doughnut Chart
    // ======================================================

    // Doughnut Chart Options
    var doughnutOptions = {

        showTooltips: false,

        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,

        //String - The colour of each segment stroke
        segmentStrokeColor: "#fff",

        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,

        //The percentage of the chart that we cut out of the middle.
        percentageInnerCutout: 50,

        //Boolean - Whether we should animate the chart	
        animation: true,

        //Number - Amount of animation steps
        animationSteps: 100,

        //String - Animation easing effect
        animationEasing: "easeOutBounce",

        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,

        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: true,

        //Function - Will fire on animation completion.
        onAnimationComplete: null,

        
    }


    // Doughnut Chart Data
    function createChart(count) {
        console.log(count);
        var data = {
            labels: [
                "Articles",
                "Total"
               
            ],
            datasets: [
                {
                    data: [count, 3000],
                    backgroundColor: [
                        "#ff4d4d",
                        "#70db70"
                    ],
                    hoverBackgroundColor: [
                        "#ff4d4d",
                        "#70db70"
                    ]
                }]
        };




        //Get the context of the Doughnut Chart canvas element we want to select
        var ctx = document.getElementById("mydoughnutChart").getContext("2d");

        // Create the Doughnut Chart
        var mydoughnutChart = new Chart(ctx, {
            type: "doughnut",
            animation: {
                animateScale: true,
                rotation: 3.14,
            },
            data
        });
    }

});