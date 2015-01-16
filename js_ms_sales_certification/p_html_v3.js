a = [];


s = {};
newQ = true;
id = 0;
a.forEach(function(e){
	if (e.q==$('#QuestionPanel').text()){
		newQ = false;
		id = a.indexOf(e);
	}
})
if (newQ){
	s.q = $('#QuestionPanel').text();
	$('.ChoicesTable').find('input.HandCursor').each(function(){
							if( $('#NextButton').hasClass('FadeOut') )
								$(this).click();
							});
	$('#NextButton').click();
	s.a = [];
	$('[src*="multchoice_yes.png"]').each(function(){
		s.a.push($(this).parent().parent().index());
	})
	a.push(s);
	$('#NextButton').click();
}else{
	console.log(a[id].a);
	for (var i = a.length-1 ; i>=0 ; i--){
		$('.ChoicesTable').find('input.HandCursor').eq(a[id].a[i]).click()
	}
	$('#NextButton').click();
	$('#NextButton').click();
}


JSON.stringify(a)
