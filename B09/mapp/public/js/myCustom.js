// setup check-box input
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

// even checked for add name Ordering
$('input[name=cid]').click(function(){
    if($(this).is(':checked')){
        $(this).parents('tr').find('input.ordering').attr('name','ordering');
    }else{
        $(this).parents('tr').find('input.ordering').removeAttr('name');
    }
});

// add name Ordering after clicking button All
$('input[name=all]').click(function(){
    if($(this).is(':checked')){
        $('input.ordering').attr('name','ordering');
    }else{
        $('input.ordering').removeAttr('name');
    }
});

// Check option button apply
$('select[name=action]').change( function (){
    if($('select[name=action]').val()==''){
        $('#bulk-apply').prop('disabled', true)
    }else{
        $('#bulk-apply').removeAttr('disabled')
    }
  });

// Check option button filter group
$('select[name=group_name]').change( function (){
    if($('select[name=group_name]').val()==''){
        $('#bulk-filter').prop('disabled',true)
    }else{
        $('#bulk-filter').removeAttr('disabled')
    }
  });


// hide flash message 
const boxMessage = $('div#message-box');
  setTimeout(function () {
    boxMessage.css("display", "none");
  }, 6000);


