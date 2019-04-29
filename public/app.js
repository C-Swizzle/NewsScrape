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
        setTimeout(function(){
        window.location.reload()
    },5000);
    }).catch(function(err){
        console.log(err);
    })
});

$(document).on("click",".comment-submit",function(e){
    e.preventDefault();
    var id=$(this).data("id");
    console.log(id);
    var comment = $("#"+id+"\\/").val();
    console.log(comment);
    var url="/newnote/"+id;
    $.ajax({
        url:url,
        method:"POST",
        data:{
            body:comment
        }
    }).then(function(response){
        window.location.reload()
    }).catch(function(err){
        console.log(err);
    })
})



});