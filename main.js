jQuery(document).ready(function() {

		// jQuery('#start_Date').datepicker({
		//    format: "mm/dd/yy",
		//    startDate: new Date()
		// });

		// jQuery('#end_Date').datepicker({
		//    format: "mm/dd/yy",
		//    startDate: new Date(),
		//    endDate: '+22d'
		// }); 


	jQuery('#stock_submit_btn').click(function() {

		var name = jQuery('#stock_name').val().trim();
	    var phone = jQuery('#phone_number').val();
	    var stockmaxprice = jQuery('#stock_max_value').val();
	    var stockminprice = jQuery('#stock_min_value').val();
	    var fromdate = jQuery('#startDate').val();
	    var todate = jQuery('#endDate').val();
	    
	    var validname = /^[a-zA-Z\s]*$/.test(name) && name.length > 1 ;
	    var validnumber = /^\d{10}$/;
	  

		var error = [];


	    if(name.length <= 0) {
	    	error.push({'type':'error_name','msg':"Name is required"});
	    } else if(!validname){
	    	error.push({'type':'error_name','msg':"Enter valid Name"});
	    }

	    if(phone.length <= 0) {
				error.push({'type':'error_email','msg':"Phone Number is required."});
		}else if(!validnumber){
			error.push({'type':'error_email','msg':"Enter valid Phone number"});
		}

		if(stockmaxprice.length <= 0) {
			error.push({'type':'error_email','msg':"Stock maximum price is required."});
		}

		if(stockminprice.length <= 0) {
			error.push({'type':'error_email','msg':"Stock minimum price is required."});
		}

		// var dataString = 'name='+ name + '&phone='+ phone + '&stockmaxprice='+ stockmaxprice + '&stockminprice='+ stockminprice;
		var data = {
			name: name,
			phone: phone,
			stockmaxprice: stockmaxprice,
			stockminprice: stockminprice,
		};

	    jQuery('.clear_error').text('');

    	if (error != "") {
		      var ermsg = '';
		      for (var i = 0; i < error.length; i++) {
		        var type = error[i].type;
		        var msg = error[i].msg;
		        ermsg += msg + '\n';
		      }
		      alert(ermsg);
		      return false;
	    }else{
			jQuery.ajax({
			  type: "POST",
				url: "http://localhost:3000/getUpdate",
			  data: data,
			  dataType: 'application/json'
			});
		}	


	});

});