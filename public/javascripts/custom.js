$(function() {
    $(document).off('mouseenter click','#btn-load-report').on('mouseenter click','#btn-load-report',function(){
        var iModel = $('#sl-models').val();
        var iProcess = $('#sl-type-report').val();
        if(iModel==""){
            $.toast({
                heading: "Action Check",
                text: "Need select model export first!",
                position: 'top-right',
                loaderBg:'#ff6849',
                icon: 'warning',
                hideAfter: 3500, 
                stack: 6
            });
        }else{
            $.get( "/loadsetup", { mod: iModel, pro: iProcess} )
            .done(function( data ) {
                $("#main_content").empty().html( data );
            });
        }
    });
    
    //Export Ppt
    $(document).off('click','#btn-mreport').on('click','#btn-mreport',function(){
        var iModel = $('#sl-models').val();
        var iProcess = $('#sl-type-report').val();
        if(iModel==""){
            $.toast({
                heading: "Action Check",
                text: "Need select model export first!",
                position: 'top-right',
                loaderBg:'#ff6849',
                icon: 'warning',
                hideAfter: 3500, 
                stack: 6
            });
        }else{
            $.toast({
                heading: "Action Pass",
                text: "Waitting load data!",
                position: 'top-right',
                loaderBg:'#ff6849',
                icon: 'success',
                hideAfter: 3500, 
                stack: 6
            });
            $.get( "/getexportpptx", { mod: iModel, pro: iProcess} )
            .done(function( data ) {
                window.open(data, '_blank').focus();
            });
        }
    });

    //Export Translate
    $(document).off('click','#btn-mtranslate').on('click','#btn-mtranslate',function(){
        var iModel = $('#sl-models').val();
        var iProcess = $('#sl-type-report').val();
        if(iModel==""){
            $.toast({
                heading: "Action Check",
                text: "Need select model export first!",
                position: 'top-right',
                loaderBg:'#ff6849',
                icon: 'warning',
                hideAfter: 3500, 
                stack: 6
            });
        }else{
            $.toast({
                heading: "Action Pass",
                text: "Waitting load data!",
                position: 'top-right',
                loaderBg:'#ff6849',
                icon: 'success',
                hideAfter: 3500, 
                stack: 6
            });
            $.get( "/getdatatranslate", { mod: iModel, pro: iProcess} )
            .done(function( res ) {
                //console.log(res.iData, res);
                $('#example').DataTable({
                    destroy: true,
                    searching: false,
                    paging: false,
                    info:false,
                    dom: 'lBfrtip',
                    buttons: [
                        {
                            extend: 'csv',
                            text: 'Download Translate',
                            charset: 'utf-8',
                            extension: '.csv',
                            filename: 'Inspections_'+res.iModel,
                            bom: true
                        },
                    ],
                    data: res.iData,
                    columns: [
                    { "data": "iName" },
                    { "data": "iSize" },
                    { "data": "iProcess" },
                    { "data": "iLabel"},
                    { "data": "iFunction" }
                    ]
                });
            });
        }
    });

    //Totgle Class
    $(document).off('click','#jbtreeview .box').on('click','#jbtreeview .box',function(){
        $(this).parent().find(".nested").toggleClass("active");
        $(this).parent().find(".box").toggleClass("check-box");
    });
});