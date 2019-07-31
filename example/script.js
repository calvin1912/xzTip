$(function(){
  // 生成顶部导航菜单
  var LINK_INDEX = 0, title, link;
  $('h2').each(function(){
    title = $(this).text();
    link = LINK_INDEX++;
    $(this).before('<a name="' + link + '"></a>');
    $('nav.blog-nav').append('<a class="blog-nav-item" href="#'+link+'">'+title+'</a>');
  });

  // 生成右侧链接菜单
  var isFirstLI = true, isExistsLI = false;
  $('h2,h3').each(function(){
    title = $(this).text();

    if($(this).prev().is('a')){
      link = $(this).prev().attr('name');
    }else{
      link = LINK_INDEX++;
      $(this).before('<a name="' + link + '"></a>');
    }

    if($(this).is('h2')){
      if(isExistsLI){
        isExistsLI = false;
        $('div.sidebar-module').append('</ol>');
      }

      isFirstLI = true;
      $('div.sidebar-module').append('<h4><a href="#'+link+'">'+title+'</a></h4>');
    }else{
      if(isFirstLI){
        isFirstLI = false;
        isExistsLI = true;
        $('div.sidebar-module').append('<ol class="list-unstyled">');
      }

      $('div.sidebar-module').append('<li><a href="#'+link+'">'+title+'</a></li>');
    }
  });

  if(isExistsLI){
    isExistsLI = false;
    $('div.sidebar-module').append('</ol>');
  }

});