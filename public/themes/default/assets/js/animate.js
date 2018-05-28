/**
 * Created by Administrator on 2018/5/17.
 */

$(function () {
  //控制了解、蔻界产品的动画
  var $cont = document.querySelector('.cont');
  var $elsArr = [].slice.call(document.querySelectorAll(' .el'));
  //var $kjicon = [].slice.call(document.querySelectorAll('.productindex .kj_icon'));
  var $closeBtnsArr = [].slice.call(document.querySelectorAll('.el__close-btn'));

  setTimeout(function () {
    $cont.classList.remove('s--inactive');
  }, 200);

  $elsArr.forEach(function ($el) {
    $el.addEventListener('click', function () {
      if (this.classList.contains('s--active')) return;
      $cont.classList.add('s--el-active');
      this.classList.add('s--active');
      $(".bgcover").css("display", "none")
    });
  });

  $closeBtnsArr.forEach(function ($btn) {
    $btn.addEventListener('click', function (event) {
      var e = event || window.event;
      if (e && e.stopPropagation) {
        e.stopPropagation();
      } else if (window.event) {
        window.event.cancelBubble = true;
      }
      $cont.classList.remove('s--el-active');
      document.querySelector('.el.s--active').classList.remove('s--active');
      //$(".bgcover").css("display","block")
    });
  });
  //鼠标移开。了解页面的遮盖添加 消失动画
  $(".aboutindex .el").on("mouseout", function () {
    $(this).find(".bgcover").addClass('leave')
  })


})

