$(function() {
	//$(".comment").each(function() {$( this ).textareaCount({ 'maxCharacterSize': 600, 'originalStyle': 'originalDisplayInfo', 'warningStyle': 'warningDisplayInfo', 'warningNumber': 100, 'displayFormat': '#input Characters | #left Characters Left'});});
	
	function gen_buttons(){
		var ts = "";
		$.ajax( "http://oraweb.ffab.tide.ti.com/pls/equip_track/BDB.get_Testsystem?action=list", {dataType: "json", async: false})
			.done(function(data) {ts = data || {};})
			.fail(function() {alert( "error" );});
		var c = "";
		$.ajax( "http://oraweb.ffab.tide.ti.com/pls/equip_track/BDB.get_Cabinet?action=list", {dataType: "json", async: false})
			.done(function(data) {c = data || {};})
			.fail(function() {alert( "error" );});
		var $str = {};
		var $c_div = $("div#cabinets");
		var $column1 = $(document.createElement("div")).addClass("column");
		var $column2 = $column1.clone();
		var $column3 = $column1.clone();
		var $y;
		
		$.each(ts.Records, function(i, tsval){
			var $portlet        = $(document.createElement("div")).addClass("portlet");
			var $portletheader  = $(document.createElement("div")).addClass("portlet-header").html(tsval.TESTER_NAME);    
			var $portletcontent = $(document.createElement("div")).addClass("portlet-content");    
			
			$.each(c.Records, function(j, cval){
				if ((tsval.TESTER_ID == cval.TESTER_ID) && (tsval.WEBCOLUMN != "0")){
					x              = cval.SCHRANK_NAME.split(" ", 1)
					var $span      = $(document.createElement("span"));
					var $cabs      = $(document.createElement("span")).addClass("cabs").attr("id", x).html(cval.SCHRANK_NAME);
					var $cabsprint = $(document.createElement("span")).addClass("cabs-print").attr("id", x + "-p");
					$y             = $span.append($cabs).append($cabsprint);
					$portletcontent.append($y);
				}
			});
			switch (tsval.WEBCOLUMN) {    
				case "0":    
					break;    
				case "1":    
					$str = $portlet.append($portletheader);    
					$str = $portlet.append($portletcontent);    
					$column1.append($str);    
					break;    
				case "2":    
					$str = $portlet.append($portletheader);    
					$str = $portlet.append($portletcontent);    
					$column2.append($str);    
					break;    
				case "3":    
					$str = $portlet.append($portletheader);    
					$str = $portlet.append($portletcontent);    
					$column3.append($str);    
					break;    
				default:    
					break;    
			}
		});
		
		$c_div.append($column1);
		$c_div.append($column2);
		$c_div.append($column3);
	}
	$("#LoadRecordsButton")
		.button({text: true, icons: {primary: "ui-icon-search"}})
		.click(function (e) {
			e.preventDefault();
			$("#BoardTableContainer").jtable("load", {
				boardnummer_in: $("form#search #boardnummer").val(),
				searchlink_in: $("form#search #searchlink").val(),
				volltext_in: $("form#search #volltext").val(),
				system_in: $("form#search #system").val()
			});
			$("#accordion" ).accordion( "option", "active", 1 );
		});
	$("ResetRecordsButton")
		.button({text: true, icons: {primary: "ui-icon-arrowrefresh-1-e"}})
		.click(function (e) {
			$("form#search #boardnummer").val("");
			$("form#search #volltext").val("");
			$("form#search #system").val("%");
			e.preventDefault();
			$("#BoardTableContainer").jtable("load");
			$("#accordion" ).accordion( "option", "active", 1 );
		});
	$("ReloadRecordsButton")
		.button({text: true, icons: {primary: "ui-icon-arrowrefresh-1-e"}})
		.click(function (e) {
			$("form#search #boardnummer").val("");
			$("form#search #volltext").val("");
			$("form#search #system").val("%");
			e.preventDefault();
			$("#BoardTableContainer").jtable("destroy").jtable(jtBoards).jtable("load");
			$("#accordion" ).accordion( "option", "active", 1 );
		});
	var jqxhr = $.ajax( "http://oraweb.ffab.tide.ti.com/pls/equip_track/BDB.get_Testsystem", {dataType: "json"} )
		.done(function(data) {
			data = data || {};
			var $select = $("#system");
			$.each(data.Options, function(i, val){
				$select.append($("<option />", { value: val.Value, text: val.DisplayText }));
			});
		})
		.fail(function() {
			alert( "error" );
		});
	gen_buttons();   
	$( document ).tooltip();
	$( "#accordion" ).accordion({collapsible: true, heightStyle: "content"});
	$(".portlet").addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all").find(".portlet-header").addClass("ui-widget-header ui-corner-all").end().find(".portlet-content");
});