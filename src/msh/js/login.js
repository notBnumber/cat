$(()=>{
  // 切换tab
  $('.tab-title li').click(function(){
    let index = $(this).index()
    $(this).addClass('tab-active').siblings('li').removeClass('tab-active')
    $('.position-line').css({left: index * 33.3 +'%'})
  })
  // 去忘记密码
  $('#goRestPassword').click(function(){
    $('#reset-form').show()
    $('#login-form').hide()
  })
  // 去登陆
  $('#goLogin').click(function(){
    $('#reset-form').hide()
    $('#login-form').show()
  })
  // 监听input输入
  $('.mobile-input').on("keyup paste",function(){
    let value = $(this).val()
    if (value.length > 0) {
      $(this).next().show()
    } else {
      $(this).next().hide()
    }
  });
  // 清楚输入框内容
  $('span.close').click(function () {
    $(this).prev().val('')
    $(this).hide()
  })
  // 切换密码可见与不可见
  $('.eye').on('click',function () {
    let bool = $(this).hasClass('eye-show')
    if (bool) {
      $(this).removeClass('eye-show').addClass('eye-hidden')
      $(this).prev().attr('type','password')
    }else{
      $(this).removeClass('eye-hidden').addClass('eye-show')
      $(this).prev().attr('type','text')
    }
  })
  // 记住密码
  $('#remember_password').click(function () {
    $(this).prev().toggleClass('check-active')
  })
})
