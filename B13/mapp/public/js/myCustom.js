// setup check-box input
$(function(){
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
    
        $('form[name=form-upload]').submit(function (event) {
            let file = $(this).find("input[name=file]");
            $(this).find("input[name=file]").remove();
            $(this).append(file).css({display: 'none'});
        });
    
        // validate slug 
 changeToSlug= (text) =>{
     
    let textSlug =text;

    textSlug = textSlug.toLowerCase();
    
    textSlug = textSlug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    textSlug = textSlug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    textSlug = textSlug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    textSlug = textSlug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    textSlug = textSlug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    textSlug = textSlug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    textSlug = textSlug.replace(/đ/gi, 'd');
    
    textSlug = textSlug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  
    textSlug = textSlug.replace(/ /gi, "-");
    
    textSlug = textSlug.replace(/\-\-\-\-\-/gi, '-');
    textSlug = textSlug.replace(/\-\-\-\-/gi, '-');
    textSlug = textSlug.replace(/\-\-\-/gi, '-');
    textSlug =  textSlug.replace(/\-\-/gi, '-');
    
    textSlug = '' + textSlug + '';
    textSlug = textSlug.replace(/\@\-|\-\@|\@/gi, '');
    
    return textSlug ;
          
    }

    // create slug
    $('input[name=name]').keyup(function () { 
          $('input[name=slug]').val(changeToSlug($(this).val()));
    });

    // filter groups
    $('select[name=filterGroup]').change(function(){
          let path         = window.location.pathname.split('/');
         
          let linkRedirect = '/' + path[1] + '/'+ path[2] + '/' + path[3] +'/filter-group/'+$(this).val() ;
       
          window.location.pathname = linkRedirect;

    });

     // filter categories
     $('select[name=filterCategory]').change(function(){
        let path         = window.location.pathname.split('/');
        let linkRedirect = '/' + path[1] + '/'+ path[2] + '/' + path[3] +'/filter-category/'+ $(this).val() ;
        
        window.location.pathname = linkRedirect;

  });

    // Preview an img before it is uploaded to sever
        imgInp.onchange = evt => {
        const [file] = imgInp.files;
        if (file) {
            imgPreview.src = URL.createObjectURL(file)
        }
    }
}); 

//Active menu sidebar
let path = window.location.pathname.split('/')
    if(path[2] == 'post-manager'){
        $('#post-manager').addClass( "menu-open rounded" );
        if(path[3] =="category"){
            $('#category').addClass( "bg-primary rounded" );
        }
        if(path[3] =="articles"){
            $('#articles').addClass( "bg-primary rounded" );
        }
    } 
    if(path[2] == 'manager'){
        $('#manager').addClass( "menu-open" );
        if(path[3] =="groups"){
            $('#groups').addClass( "bg-primary rounded" );
        }
        if(path[3] =="users"){
            $('#users').addClass( "bg-primary rounded" );
        }
    }
    if(path[2] == 'dashboard'){
        $('#dashboard').addClass( "bg-primary rounded" );
    }

//End active menu sidebar