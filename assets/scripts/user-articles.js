var UserArticlesController = (function ($) {
    return {
        load: function () {
            UserArticlesController.Load.init();
        }
    };
}(jQuery));

UserArticlesController.Load = (function ($) {

    var attachEvents = function () {
        console.log('attaching events');
        /*
         * Load More Articles on My Post Page
         */
        $('.loadMoreMyArticles').on('click', function (e) {
            e.preventDefault();
            var btnObj = $(this);

            $.fn.Ajax_LoadMoreMyArticles({
                onSuccess: function (data, textStatus, jqXHR) {
                    if (data.success == 1) {
                        if (data.articles.length < 20) {
                            $(btnObj).css('display', 'none');
                        }
                        for (var i in data.articles) {
                            data.articles[i]['containerClass'] = 'col-quarter';
                            data.articles[i]['cardClass'] = 'card__news card--local';
                            
                            data.articles[i]['blogClass']= '';
                            if(data.articles[i].blog['id'] !== null) {
                               data.articles[i]['blogClass']= 'card--blog_'+data.articles[i].blog['id'];
                            } 
                            
                            var ImageUrl = $.image({media:data.articles[i]['featuredMedia'], mediaOptions:{width: 500 ,height:350, crop: 'limit'} });
                            data.articles[i]['imageUrl'] = ImageUrl;
                            var articleTemplate = Handlebars.compile(systemCardTemplate);
                            var article = articleTemplate(data.articles[i]);
                            $('.LoadMyArticles').append(article);
                        }
                        $(".card p, .card h1").dotdotdot();
                         //Lazyload implement
                        $("div.lazyload").lazyload({
                            effect: "fadeIn"
                        });
                    }
                },
                beforeSend: function (jqXHR, settings) {
                    $(btnObj).html("Please wait...");
                },
                onComplete: function (jqXHR, textStatus) {
                    $(btnObj).html("Load More");
                }
            });
        });
        
        /**
         *  See User Post Articles
         */

        var totalPosts = parseInt($('div#userArticleContainer').data('total-count'));
        console.log(totalPosts);
        console.log(_appJsConfig.articleOffset);

        if (totalPosts > _appJsConfig.articleOffset) {
            console.log('adding waypoint');
            var waypoint = new Waypoint({
                element: $('#LoadMoreArticles'),
                offset: '80%',
                handler: function (direction) {
                    if (direction == 'down') {
                        $.fn.Ajax_LoadMoreUserArticles({
                            onSuccess: function (data, textStatus, jqXHR) {
                                console.log(data);
                                if (data.userArticles.length > 0) {

                                    for (var i in data.userArticles) {
                                        console.log(i);
                                        data.userArticles[i]['containerClass'] = 'col-sm-4 card-sm';
                                        
                                        data.userArticles[i]['blogClass']= '';
                                        if(data.userArticles[i].blog['id'] !== null) {
                                           data.userArticles[i]['blogClass']= 'card--blog_'+data.userArticles[i].blog['id'];
                                        } 
                                        
                                        var ImageUrl = $.image({media:data.userArticles[i]['featuredMedia'], mediaOptions:{width: 500 ,height:350, crop: 'limit'} });
                                        data.userArticles[i]['imageUrl'] = ImageUrl;
                                        data.userArticles[i]['placeholder'] = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=Loading&w=450&h=250';
                                        var articleTemplate = Handlebars.compile(systemCardTemplate);
                                        var article = articleTemplate(data.userArticles[i]);
                                        $('#userArticleContainer').append(article);
                                    }

                                    if (data.userArticles.length < _appJsConfig.articleOffset) {
                                        waypoint.destroy();
                                    } else {
                                        Waypoint.refreshAll();
                                    }
                                    $(".card p, .card h1").dotdotdot();
                                     //Lazyload implement
                                    $("div.lazyload").lazyload({
                                        effect: "fadeIn"
                                    });
                                }
                            },
                            beforeSend: function (jqXHR, settings) {
                                $('div.loader').removeClass('hide');
                            },
                            onComplete: function (jqXHR, textStatus) {
                                $('div.loader').addClass('hide');
                            }
                        });
                    }
                }
            });
        }
    };
    return {
        init: function () {
            attachEvents();
        }
    };

}(jQuery));


