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

            let Xhtml = `<a href="javascript:changeGroup('${linkGroup}')" class ="group-${cid} position-relative" ><i class="fa fa-user-${icon} text-${colorBtn}"></i></a>`;
            
            current.notify(
                dataNotices.title, 
                { position: "top center", className: dataNotices.className }
              );
            current.replaceWith(Xhtml);
        }
    });
    
}

//Change ordering Ajax
$('input.ordering').change(function () {
    // event.preventDefault();
    
    let  url = $(this).data('link');
    let  id = $(this).data('id');
    let  ordering = $(this).val();
    let  current = $(this);

    $.ajax({
        type: "POST",
        url: url,
        data: {"id": id, "ordering": ordering},
        dataType: "json",
        success: function (res) {
            console.log(res);
            
            current.notify(
                res.message, 
                { position: "top center", className: res.className }
              );
            
            
        }
    });
});
 
