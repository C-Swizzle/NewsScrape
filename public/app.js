$(document).ready(function(){
$(document).on("click","#sub-submit",function(e){
    e.preventDefault();
    var subToScrapeFrom=$("#sub-to-scrape").val().trim();
    console.log(subToScrapeFrom);
    var url=subToScrapeFrom +"/";
    console.log(url)
    var whenToScrape=$("#when-to-scrape").val();
    console.log(whenToScrape);

    switch(whenToScrape){
        case "hot":
        break;

        case "hour":
        url+="top/?sort=top&t=hour";
        break;

        case "today":
        url+="top/?sort=top&t=day";
        break;

        case "week":
        url+="top/?sort=top&t=week";
        break;

        case "month":
        url+="top/?sort=top&t=month";
        break;

        case "year":
        url+="top/?sort=top&t=year";
        break;

        case "all-time":
        url+="top/?sort=top&t=all";
        break;

        case "controversial":
        url+="controversial";
        break;

        case "new":
        url+="new";
        break;

        case "rising":
        url+="rising";
        break;

    }
    console.log(url);

    $.ajax({method:"POST",url:"/scrape/subreddit/",data:{urlToScrape:url}}).then(function(response){
        console.log(response);
    }).catch(function(err){
        console.log(err);
    })
})



});