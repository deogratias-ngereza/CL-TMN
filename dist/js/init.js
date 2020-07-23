window.paceOptions = {
    document: true, // disabled
    eventLag: true,
    restartOnPushState: true,
    restartOnRequestAfter: true,
    ajax: {
        trackMethods: [ 'POST','GET','PUT','DELETE']
    }

};


// onclick="selectElementContents( document.getElementById('tableId') );"
function selectElementContents(el) {
    var body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }


   

    /*var Excel = new ActiveXObject("Excel.Application");
        Excel.Visible = true;
        Excel.Workbooks.Open("teste.xlsx");*/

   	setTimeout(function(){
   		 /* Copy the text inside the text field */
		var x = document.execCommand("copy");
	  /* Alert the copied text */
		//alert("Copied the text: " + sel);

		alert("NOTE:\n" + "CONTENT COPIED TO CLIPBOARD\n\n1) OPEN MS-EXCEL PROGRAM\n2) PASTE or CTRL + v");
   		range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
   		range.select();
   	},500);


}

