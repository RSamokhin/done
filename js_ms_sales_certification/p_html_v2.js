a = [];

function continued(){
    if ($('#ResultsActionButton').length==0){
        s = {};
        newQ = true;
        id = 0;
        a.forEach(function(e){
                if (e.q===$('#QuestionViewPrompt').text()){
                        newQ = false;
                        id = a.indexOf(e);
                }
        });
        if (newQ){
                s.q = $('#QuestionViewPrompt').text();
                $('#QuestionViewChoices').find('input').each(function(){
                    $(this).click();
                });
                $('#QCheckAnswerButton').click();
                s.a = [];
                $('#QuestionViewChoices').eq(0).find('.accent_text').each(function(){
                        s.a.push($(this).index());
                });
                if (s.a.length===0)
                    s.a.push( $('#QuestionViewChoices').eq(0).find('label').length-1);
                a.push(s);
                $('#NextMetroButton').click();
        }else{
                console.log(a[id].a);
                for (var i = a.length-1 ; i>=0 ; i--){
                        $('#QuestionViewChoices').find('input').eq(a[id].a[i]).click();
                }
                $('#QCheckAnswerButton').click();
                $('#NextMetroButton').click();
        }
    }else{
        $('#ResultsActionButton').click();
    }
}

var intervalID = setInterval( continued , 1000);

JSON.stringify(a);
