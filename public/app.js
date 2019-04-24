$(document).ready(function(){
$(document).on("click","#sub-submit",function(e){
    e.preventDefault();
    var subToScrapeFrom=$("#sub-to-scrape").val().trim();
    console.log(subToScrapeFrom);
})



});