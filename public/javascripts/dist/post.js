function postInit(){pageAction.ueditorInit(),$("#musicSelect").click(function(){$(".content-preview").slideDown(),pageAction.contentPreview("music")}),$("#videoSelect").click(function(){$(".content-preview").slideDown(),pageAction.contentPreview("video")}),$("#pictureSelect").click(function(){$(".content-preview").slideDown(),pageAction.contentPreview("picture")}),$(".tag").click(function(){pageAction.tagCheck()}),$("#sendArticle").click(function(){pageAction.postCheck()}),$(".type > div").click(function(){pageAction.article.type=$(this).text(),"col-md-2 type-other"==$(this).prop("class")&&$(".content-preview").slideUp(),$(".type > div").css({"background-color":"rgba(0,0,0,0)"}),$(this).css({"background-color":"#b5dccc"})}),$(".type > div:eq(1)").css({"background-color":"#b5dccc"}),pageAction.article.from=$("#bilibiliAV").length>0?"bilibili":"Qwaii"}define("post",["jquery"],function(){return{postInit:postInit,getBackgroundImg:function(){$("#backgroundImg").prop("class","background-img")}}});var pageAction={ueAbstract:null,ueContent:null,article:{title:null,type:"贴文",tags:[{tag:null}],abstract:null,content:null,from:"Qwaii",source:null}};pageAction.modalWindow=function(t){$(".modal-body").text(t),$("#modalWindow").modal("show",{backdrop:!0,keyboard:!0})},pageAction.ueditorInit=function(){this.ueAbstract=UE.getEditor("editorAbstract",{toolbars:[["fullscreen","source","undo","redo","insertunorderedlist","insertorderedlist","link","unlink","help","emotion","pagebreak","date","bold","italic","fontborder","strikethrough","underline","forecolor","justifyleft","justifycenter","justifyright","justifyjustify","paragraph","rowspacingbottom","rowspacingtop","lineheight"]],autoHeightEnabled:!0,autoFloatEnabled:!0}),this.ueContent=UE.getEditor("editorContent",{autoHeightEnabled:!0,autoFloatEnabled:!0})},pageAction.contentPreview=function(t){function e(t){var e=$(".content-preview");return e.children().remove(),t.length?void $.each(t,function(t,i){var o=$("<div></div>");o.prop("class","picture-preview-div");var n=$("<img>");n.prop({src:i.source,alt:i.title,class:"picture-preview"}),n.isClicked=!1,n.click(function(){this.isClicked=!this.isClicked,this.isClicked?(o.css({"background-color":"rgb(157,94,202)"}),$(this).css({opacity:"0.5"}),pageAction.ueContent.setContent($("<p></p>").append($("<img>").prop({src:i.source,alt:i.title,class:"picturePreview"})).html(),!0)):(o.css({"background-color":""}),$(this).css({opacity:"1"}))}),o.append(n),e.append(o)}):$(".content-preview").append($("<p></p>").text("你还没有上传任何数据!"))}function i(t){var e=$(".content-preview");return e.children().remove(),t.length?void $.each(t,function(t,i){var o=$("<div></div>");o.prop("class","video-preview-div");var n=$("<p></p>");n.text(++t+". "+i.title+" - "+i.date+" ").append($('<span class="glyphicon glyphicon-film" style="color: red"></span>')).prop({class:"video-preview"}),n.isClicked=!1,n.click(function(){if(this.isClicked=!this.isClicked,this.isClicked){$(this).css({"background-color":"rgba(57, 89, 128, 0.5)"});var t=$("<video>"),e=$("<p></p>");t.prop({src:i.source,controls:"controls"}).css({display:"block",width:"100%",height:"450px"}),e.append(t),pageAction.ueContent.setContent(e.html(),!0)}else $(this).css({"background-color":""}),$(this).css({opacity:"1"})}),o.append(n),e.append(o)}):$(".content-preview").append($("<p></p>").text("你还没有上传任何数据!"))}function o(t){var e=$(".content-preview");return e.children().remove(),t.length?void $.each(t,function(t,i){var o=$("<div></div>");o.prop("class","music-preview-div");var n=$("<p></p>");n.text(++t+". "+i.title+" - "+i.date+" ").append($('<span class="glyphicon glyphicon-music" style="color : red"></span>')).prop({class:"music-preview"}),n.isClicked=!1,n.click(function(){if(this.isClicked=!this.isClicked,this.isClicked){$(this).css({"background-color":"rgba(57, 89, 128, 0.5)"});var t=$("<audio>"),e=$("<p></p>");t.prop({src:i.source,controls:"controls"}).css({width:"100%",height:"auto"}),e.append(t),pageAction.ueContent.setContent(e.html(),!0)}else $(this).css({"background-color":""}),$(this).css({opacity:"1"})}),o.append(n),e.append(o)}):$(".content-preview").append($("<p></p>").text("你还没有上传任何数据!"))}$.post("/preview/"+t,function(n){var c=JSON.parse(n);return c.err?pageAction.modalWindow(c.statusText):void("music"==t?o(c.data):"video"==t?i(c.data):"picture"==t&&e(c.data))},"JSON")},pageAction.tagCheck=function(){var t=[];$.each($(".tag"),function(e,i){$(i).prop("checked")&&t.push({tag:i.value})}),t.length>4?(t.pop(),pageAction.article.tags=t,pageAction.modalWindow("文章标签最多选4个额!")):t.length<1?(pageAction.article.tags=t,pageAction.modalWindow("给你的文章贴上标签吧!")):pageAction.article.tags=t},pageAction.postCheck=function(){return!$("#bilibiliAV").val()&&$("#bilibiliAV").length>0?void headerAction.modalWindow("填写bilibili AV号才能成功转载额!"):$("#articleTitle").val()?pageAction.article.tags.length<1?void headerAction.modalWindow("给你的文章贴上标签吧!"):pageAction.ueAbstract.hasContents()?pageAction.ueContent.hasContents()?(pageAction.article.title="["+pageAction.article.type+"]"+$("#articleTitle").val(),pageAction.article.abstract=pageAction.ueAbstract.getPlainTxt(),pageAction.article.content=pageAction.ueContent.getContent(),pageAction.article.source=$("#bilibiliAV").val(),void pageAction.sendPost()):void headerAction.modalWindow("正文怎么能不写呢!"):void headerAction.modalWindow("贴文摘要是必须要写的!"):void headerAction.modalWindow("至少要填写文章标题吧!")},pageAction.sendPost=function(){$.post("/post",{jsonArticle:JSON.stringify(pageAction.article)},function(t){if(t.status){var e=t.statusText,i=[];i.push("/article/",e.author,"/",e.title,"/",e.date),window.location.href=i.join("")}else pageAction.modalWindow(t.statusText)},"JSON")};