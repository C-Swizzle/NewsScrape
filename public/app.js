$(document).ready(function(){
$(document).on("click","#sub-submit",function(e){
    e.preventDefault();
    var subToScrapeFrom=$("#sub-to-scrape").val().trim();
    console.log(subToScrapeFrom);

    $.ajax({method:"GET",url:"/scrape/subreddit/"+subToScrapeFrom}).then(function(response){
        console.log(response);
    }).catch(function(err){
        console.log(err);
    })
})



});