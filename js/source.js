var urllink = 'https://diracwikifinder.appspot.com/';//Change this to Localhost IP if an WAMP/XAMMP server is used

var htmltoshow = '';
var pageid;
var nooflevels=0;
var queue = [];
var l,j;
var selected1,selected2,selected3,title;
var dataString;
var json;

function ajaxcall(t,c){
		urllink = urllink + t+' '+c;
		$.getJSON(urllink, function(data){	
				//console.log(data);
				json=data;
				l = data[1].length;
				htmltoshow = '<div class = "container"><fieldset class="form-group">'
				htmltoshow = htmltoshow + '<div class="row"><div class="col-xs-6">Select an immediate parent:<br><br>'
				for(var i=0;i<(data[1].length);i++){
					htmltoshow = htmltoshow + '<div class="row"><label><input class="trigger" type="radio" id="p'+i+'" style="opacity : 1!important; margin-left:40px" name="optionsRadios" value="'+data[1][i]+'">'+data[1][i]+'</label></div>';
				}
				htmltoshow = htmltoshow + '</div><div class="col-xs-6">The corresponding root parent is:<br><br>'
				for(var i=2;i<(2+data[1].length);i++){
					htmltoshow = htmltoshow + '<div class="row" style="margin-left:40px" id="q'+(i-2)+'" ><b>'+data[i]+'</b></div>';
				}
				htmltoshow = htmltoshow + '</div></fieldset></div><br>'
				htmltoshow = htmltoshow + '<div class="row"><div class="col-xs-4"><h>Given keyword is:</h><br><input type="text" class="form-control" id="customskill" style="font-size : 15px;" value='+JSON.stringify(data[0])+' aria-describedby="basic-addon2"></div><div class="col-xs-4"><h>Selected parent category is:</h><br><input type="text" class="form-control" id="customparent" style="font-size : 15px; display:none" value='+t+' aria-describedby="basic-addon2"></div><div class="col-xs-4"><h>Its root category is:</h><br><input type="text" class="form-control" id="customroot" style="font-size : 15px; display:none" value='+t+' aria-describedby="basic-addon2"></div></div><br>'
				htmltoshow = htmltoshow +'<button type="submit" id="export" class="btn btn-outline-secondary btn-rounded waves-effect" style="font-size : 12px;">Submit</button></div>';
				$('#insertresult').html(htmltoshow);
			});
		//$.ajax()
};

$(document).ready(function()
{
	$(document).on("click",'.trigger',function()
	{
		document.getElementById("customparent").style.display='block';
		document.getElementById("customparent").value=($(this)).val();
		document.getElementById("customroot").style.display='block';
		for(var i=0;i<l;i++) {
				if(json[1][i]==($(this)).val()) {
					document.getElementById("customroot").value=json[i+2];
				}
		}
	});	
	
	$('#ajaxhit').on('click',function()
	{
		title = $('#textfield').val();
		context = $('#confield').val();
		$('#insertresult').html('<br><center><div class="conatiner" id="loader"></div></center>');
		$('#loader').show();
		ajaxcall(title,context);
		$('#textfield').val("");
		$('#confield').val("");
	});
	
	$(document).on("click",'#export',function()
	{ 
		selected1= document.getElementById("customskill").value;
		selected2=document.getElementById("customparent").value;
		selected3=document.getElementById("customroot").value;
		if(selected1 && selected2 && selected3)
		{ 
			dataString = { 'skill' : selected1 , 'parent1' : selected2 , 'parent2' : selected3 };
		}
		$.ajax(
		{ 
			type: "POST", url: "http://localhost:8080/WikiFinder/connect.php", 
			data: dataString, 
			cache: false, 
			success: function(result)
			{
				alert(result); 
			} 
		}); 
	});
});