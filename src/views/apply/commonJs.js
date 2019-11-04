let isChecked = false;
$('.readme_wrap .radio_normal').click(()=>{
    isChecked = true;
    $('.readme_wrap .radio_checked').show();
    $('.readme_wrap .radio_normal').hide();
})
$('.readme_wrap .radio_checked').click(()=>{
    isChecked = false;
    $('.readme_wrap .radio_normal').show();
    $('.readme_wrap .radio_checked').hide();
})

layui.use('form', function(){
  var form = layui.form;
  
  //各种基于事件的操作，下面会有进一步介绍
});