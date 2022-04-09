// check-box
$('#checkall').change(function () {
    $('.cb-element').prop('checked',this.checked);
});

$('.cb-element').change(function () {
 if ($('.cb-element:checked').length == $('.cb-element').length){
  $('#checkall').prop('checked',true);
 }
 else {
  $('#checkall').prop('checked',false);
 }
});


$('input[name=cid]').click(function(){
    if($(this).is(':checked')){
        $(this).parents('tr').find('input.ordering').attr('name','ordering');
    }else{
        $(this).parents('tr').find('input.ordering').removeAttr('name');
    }
});

$('input[name=all]').click(function(){
    if($(this).is(':checked')){
        $('input.ordering').attr('name','ordering');
    }else{
        $('input.ordering').removeAttr('name');
    }
});
// end check-box

// Check option button apply
$('select[name=action]').change( function (){
    if($('select[name=action]').val()==''){
        $('#bulk-apply').addClass('disabled')
    }else{
        $('#bulk-apply').removeClass('disabled')
    }
  });
// End check option button apply