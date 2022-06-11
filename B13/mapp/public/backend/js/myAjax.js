//Change Status Ajax
changeStatus = (links) => {
    let url = links;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success:  (res) => {
        
            let status = res.result.changeStatus;
            let linkIndex = res.linksIndex;
            let cid = res.result.cid;
            let dataNotices = res.result.notify;
            let current = $(`.status-${cid}`);
            let linkStatus = linkIndex + '/change-status/'+ cid +"/" + status;
            let colorBtn = (status == "active") ?"success": "danger";
            let icon = (status == "active")? "check": "minus";

            let Xhtml = `<a href="javascript:changeStatus('${linkStatus}')" class ="status-${cid} position-relative" id= "status"><i class="fa fa-${icon}-circle text-${colorBtn}"></i></a>`;
            
            current.notify(
                dataNotices.title, 
                { position: "top center", className: dataNotices.className }
              );
            current.replaceWith(Xhtml);
        }
    });
    
}

//Change Spacecial Ajax
changeSpacecial = (links) => {
    let url = links;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success:  (res) => {
        
            let spacecial = res.result.changeSpacecial;
            let linkIndex = res.linksIndex;
            let cid       = res.result.cid;
            let dataNotices = res.result.notify;
            let current    = $(`.spacecial-${cid}`);
            let linkStatus = linkIndex + '/change-spacecial/'+ cid +"/" + spacecial;
            let colorBtn   = (spacecial == "yes") ?"success": "danger";
            let icon       = (spacecial == "yes")? "fa-check-square": "fa-square";

            let Xhtml      = `<a href="javascript:changeSpacecial('${linkStatus}')" class ="spacecial-${cid} position-relative" id= "spacecial"><i class="fa ${icon} "></i></a>`;
            
            current.notify(
                dataNotices.title, 
                { position: "top center", className: dataNotices.className }
              );
            current.replaceWith(Xhtml);
        }
    });
    
}

//Change groups Ajax
changeGroup = (links) => {
    let url = links;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success:  (res) => {
        
            let group = res.result.changeGroup;
            let linkIndex = res.linksIndex;
            let cid = res.result.cid;
            let dataNotices = res.result.notify;
            let current = $(`.group-${cid}`);
            let linkGroup = linkIndex + '/change-acp/'+ cid +"/" + group;
            let colorBtn = (group == "true") ?"success": "danger";
            let icon = (group == "true")? "check": "lock";

            let Xhtml = `<a href="javascript:changeGroup('${linkGroup}')" class ="group-${cid} group position-relative" ><i class="fa fa-user-${icon} text-${colorBtn}"></i></a>`;
            
            current.notify(
                dataNotices.title, 
                { position: "top center", className: dataNotices.className }
              );
            current.replaceWith(Xhtml);
        }
    });
    
}


//Change groups Ajax
deleteAjax = (links) => {
    let url = links;
    Swal.fire(setUpConfirmObj()).then((result) => {
        if (result.value) {
                $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: (res) => {
                    let id = '#tr-' + res.id;
                    Toast.fire({
                        icon: res.className,
                        title: res.message
                      });
                    $(id).hide(3000);
                      
                }
            });
        }
      }) 
}

//Delete Ajax
setUpConfirmObj = ()=>{
    return {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        };
}

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

//Change ordering Ajax
$('input.ordering').change(function () {
   
    let  url        = $(this).data('link');
    let  id         = $(this).data('id');
    let  ordering   = $(this).val();
    let  current    = $(this);

    $.ajax({
        type: "POST",
        url: url,
        data: {"id": id, "ordering": ordering},
        dataType: "json",
        success: function (res) {
            current.notify(
                res.message, 
                { position: "top center", className: res.className }
              );
            
            
        }
    });
});

//Change category Ajax
$('select[ name = selectCategory]').change(function () {
    
    let  current = $(this);
    let  url = $(this).data('link');
    let  idArticle = $(this).data('id');
    let  categoryID  = $(this).val();
    let  categoryName = current.text();
    
    $.ajax({
        type: "POST",
        url: url,
        data: {
            "id"           : idArticle,
            "categoryID"   : categoryID,
            "categoryName" : categoryName
        },
        dataType: "json",
        success: function (res) {
            current.notify(
                res.message, 
                { position: "top center", className: res.className }
              );
            
        }
    });
});
 
//Change group Ajax for module Users
$('select[ name = selectGroup]').change(function () {
    
    let  current = $(this);
    let  url = $(this).data('link');
    let  idUser = $(this).data('id');
    let  groupID  = $(this).val();
    let  groupName = current.text();
    
    $.ajax({
        type: "POST",
        url: url,
        data: {
            "id"        : idUser,
            "groupID"   : groupID,
            "groupName" : groupName

        },
        dataType: "json",
        success: function (res) {
            
            current.notify(
                res.message, 
                { position: "top center", className: res.className }
              );
            
            
        }
    });
});
 
