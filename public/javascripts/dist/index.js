function indexInit(){$(".page-number:eq(0)").prop("class","active page-number"),$("#iconPopover").popover(),$(".nav-content").click(function(){pageAction.article.type="全部"==$(this).text()?"All":$(this).text(),$('.page-number[class="active page-number"]').prop("class","page-number"),$(".page-number:eq(0)").prop("class","active page-number"),$.post("/",{action:"readList",type:pageAction.article.type,number:15},function(e){pageAction.updatePage(e)},"JSON")}),$(".nav-content").click(function(){$(".nav-content").css({"box-shadow":"","-webkit-box-shadow":"","-moz-box-shadow":""}),$(this).css({"box-shadow":"0px 0px 8px grey","-webkit-box-shadow":"0px 0px 8px grey","-moz-box-shadow":"0px 0px 8px grey"})}),$("#hotArticleSpan").click(pageAction.updateHot),$("#hotPictureSpan").click(pageAction.updateHot),$("#hotVideoSpan").click(pageAction.updateHot),pageAction.pageNavbarAction()}define("index",["jquery"],function(){return{indexInit:indexInit,readArticleList:function(){pageAction.readArticleList()},getBackgroundImg:function(){$("#backgroundImg").prop("class","background-img")}}});var pageAction={article:{type:"All"}};pageAction.modalWindow=function(e){$(".modal-body").text(e),$("#modalWindow").modal("show",{backdrop:!0,keyboard:!0})},pageAction.readArticleList=function(){var e=this;$.post("/",{action:"readList",type:"All",number:10,start:0},function(a){e.updatePage(a)},"JSON")},pageAction.updateHot=function(){var e=$(this).text();$.post("/updateHot",{actionType:e},function(a){var t=JSON.parse(a);t.err?pageAction.modalWindow(t.statusText):t.hotList&&("图片"==e?$("#hotPicture").children().remove():"视频"==e?$("#hotVideo").children().remove():"贴文"==e&&$("#hotArticle").children().remove(),$.each(t.hotList,function(a,t){var i=$('<div class="col-md-12"></div>'),c=$('<div class="popu-item"></div>'),n=$("<a></a>"),p=[];p.push("/article/",t.author,"/",t.title,"/",t.date),n.attr("openHref",p.join("")),n.click(function(){window.open(n.attr("openHref"))}),n.text(t.title),n.appendTo(c),c.appendTo(i),"图片"==e?$("#hotPicture").append(i):"视频"==e?$("#hotVideo").append(i):"贴文"==e&&$("#hotArticle").append(i)}))},"JSON")},pageAction.updatePage=function(e){if(e.status){var a=JSON.parse(e.articleData);if(0===a.articles.length)return this.modalWindow("抱歉,没有相关数据!");$("#articleList").children().remove();var t=$("#articleList");$.each(a.articles,function(e,a){var i=$('<div class="col-md-12">'),c=$('<div class="col-md-12 article-view"></div>'),n=$('<div class="col-md-12 article-title"></div>'),p=$("<a></a>");p.text(a.title+" "),"视频"==a.type?p.append($('<span class="glyphicon glyphicon-film"></span>')):"贴文"==a.type?p.append($('<span class="glyphicon glyphicon-pencil"></span>')):"图片"==a.type?p.append($('<span class="glyphicon glyphicon-picture"></span>')):"音乐"==a.type?p.append($('<span class="glyphicon glyphicon-headphones"></span>')):p.append($('<span class="glyphicon glyphicon-list-alt"></span>'));var o=[];o.push("/article/",a.author,"/",a.title,"/",a.date),p.attr({openHref:o.join("")}),p.click(function(){window.open($(this).attr("openHref"))}),n.append(p).appendTo(c);var r=$('<div class="col-md-2 article-author"></div>');r.text(a.author).appendTo(c);var s=$('<div class="col-md-6 article-time"></div>');s.text(a.date).appendTo(c);var l=$('<div class="col-md-12 article-abstract spacing"></div>');l.text(a.abstract).appendTo(c);var d=$('<div class="col-md-12"></div>');$.each(a.tags,function(e,a){var t=$('<p class="col-md-2 tag"></p>');t.text(a.tag).appendTo(d)}),d.appendTo(c),c.appendTo(i);var u=$('<div class="col-md-12 article-read"></div>'),g=$('<div class="col-md-2 col-md-offset-4"></div>');g.text("阅读: "+a.readNumber).appendTo(u);var m=$('<div class="col-md-2"></div>');m.text("评论: "+a.commentNumber).appendTo(u),u.appendTo(i),t.append(i)}),$("#hotArticleSpan").click()}else this.modalWindow("服务器发生错误,请刷新重试!")},pageAction.pageNavbarAction=function(){function e(){$.post("/",{action:"readList",type:pageAction.article.type,number:t,start:a},function(e){i.updatePage(e)},"JSON")}var a=0,t=10,i=this;$("#first").click(function(){"active page-number"!=$(".page-number:eq(0)").prop("class")&&($('.page-number[class="active page-number"]').prop("class","page-number"),$(".page-number:eq(0)").prop("class","active page-number"),a=0,e())}),$(".pageNumber").click(function(){"active page-number"!=$(this).prop("class")&&($('.pageNumber[class="active page-number"]').prop("class","page-Number"),$(this).prop("class","active pageNumber"),a=($(this).children(0).text()-1)*t,e())}),$("#next").click(function(){$('.pageNumber[class="active pageNumber"]').prop("class","pageNumber");var e=$(".pageNumber");$.each(e.children(0),function(e,a){$(a).text(parseInt($(a).text())+10)})}),$("#last").click(function(){$('.pageNumber[class="active page-number"]').prop("class","page-number");var e=$(".page-number");$.each(e.children(0),function(e,a){var t=parseInt($(a).text());$(a).text(t-10>0?t-10:t)})})};