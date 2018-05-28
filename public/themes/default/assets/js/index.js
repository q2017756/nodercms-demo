/**
 * Created by Administrator on 2018/5/17.
 */
$(function () {

    volume()//音量调节

    $(".navbar .container .nav li").on("mouseover", function () {
        $(this).animate("backgroundColor", "#005743")
    })
    $(".main_index .carousel-inner .item:last-child img").on("click", function () {
        window.location.href = './product'
    })

    //主页点击轮播按钮，修改01,02,03的显示；
    $(".carousel-indicators li").click(function (i, v) {
        num2 = $(this).attr('data-slide-to');
        $(".slide_num img").eq(num2).siblings().hide()
        $(".slide_num img").eq(num2).show();

    });
    //自动轮播，修改01,02,03的显示
    $('#carousel-example-generic').on('slid.bs.carousel', function () {
        for (var i = 0; i < 3; i++) {
            if ($(".carousel-inner .item").eq(i).hasClass('active')) {
                var num = i;
                $(".slide_num img").eq(num).siblings().hide()
                $(".slide_num img").eq(num).show();
            }
        }
    })


    //主页音乐播放声音调节
    function volume() {
        var $box = $('#box_');
        var $bg = $('#bg_');
        var $bgcolor = $('#bgcolor_');
        var $btn = $('#bt_');
        var silent = false;
        var statu = false;
        var left = 50;
        var bgleft = 0;
        var audio = document.getElementById('audio');
        $btn.mousedown(function (e) {
            lx = $btn.offset().left;
            ox = e.pageX - left;
            statu = true;

        });
        $(document).mouseup(function () {
            statu = false;
        });
        $box.mousemove(function (e) {
            if (statu) {
                left = e.pageX - ox;
                if (left < 0) {
                    left = 0;
                }
                if (left > 50) {
                    left = 50;
                }
                $btn.css('left', left);
                $bgcolor.width(left);
                vol(left);
            }

        });
        $bg.click(function (e) {
            if (!statu) {
                bgleft = $bg.offset().left;
                left = e.pageX - bgleft;
                if (left < 0) {
                    left = 0;
                }
                if (left > 50) {
                    left = 50;
                }
                vol(left);
                $btn.css('left', left);
                $bgcolor.stop().animate({
                    width: left
                }, 100);
            }
        });

        function vol(value) {
            if (value > 0) {
                $(".voice_icon").removeClass("silent");
            } else {
                $(".voice_icon").addClass("silent")
            }
            audio.volume = (value * 2) / 100;
        }

        $(".voice_icon").click(function () {
            if (silent) {
                vol(50);
                $btn.css('left', 50);
                $bgcolor.width(50);
                silent = false;
            } else {
                vol(0);
                $btn.css('left', 0);
                $bgcolor.width(0);
                silent = true;
            }
        })
    }

    //  新闻页面
    $(".new_main .tab_tlt li").click(function () {
        var i = $(this).index();
        $(this).addClass("active").siblings("li").removeClass("active")
        $('.news_arrow').eq(i).show().siblings(".news_arrow").hide();
        $('.news_carousel').eq(i).show().siblings(".news_carousel").hide();
    })

    $(".material_content .tab_tlt li").click(function () {
        var i = $(this).index();
        $(this).addClass("active").siblings("li").removeClass("active")
        $('.material_arrow').eq(i).show().siblings(".material_arrow").hide();
        $('.newscarousel').eq(i).show().siblings(".newscarousel").hide();
        $('.swiper-container').eq(i).show().siblings(".swiper-container").hide();
    })

//    素材页面。兼容手机端的hover
    $(".fodder_lists .item li ").click(function () {
        $(this).find("div").animate({bottom: "20px", opacity: 1});
        $(this).siblings("li").find("div").animate({bottom: "-30px", opacity: 0});
    })
    $(".fodder_lists .item li ").on("mouseover", function () {
        $(this).find("div").css({bottom: "20px", opacity: 1});
        $(this).siblings("li").find("div").css({bottom: "-30px", opacity: 0});
    })

    $(".fodder_lists .item li a").click(function (event) {
        var e = event || window.event;
        if (e && e.stopPropagation) {
            e.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }

    });
})