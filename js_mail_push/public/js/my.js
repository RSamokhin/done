window.Handlers = {
    onload: {
        initDateTimePickers: function () {
            $('.datepicker').datetimepicker({
                locale: 'ru',
                minDate: new Date()
            });
        },
        initEmojiPicker: function () {
            $('#content__panel-message').emojiPicker({});
        },
        initsToRemove: function () {
            $('.panel').removeClass('m-hidden');
        },
        initArtistsAutocolete: function () {
            var artists = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: 'data/artists.json?/q=%QUERY',
                    wildcard: '%QUERY'
                }
            });

            $('[data-autocomlete=artist]').typeahead(null, {
                name: 'artist',
                displayKey: 'name',
                source: artists,
                templates: {
                    suggestion: function (artist) {
                        return $('<p/>').attr({
                            'data-bind-click': 'transferValue',
                            'data-transfer-target-selector': '[name=artist]',
                            'data-transfer-value': artist.id
                        }).text(artist.name)
                    }
                }
            });
        }
    },
    click: {
        toogleRegim: function () {
            var $button = $(this),
                regim = $button.attr('data-regim-target'),
                $messagePanel = $('.content__panel-message');
            $button.toggleClass('active');
            $button.siblings().removeClass('active');
            $('[data-regim]').not('[data-regim='+ regim +']').addClass('m-hidden');
            $('[data-regim='+ regim +']').toggleClass('m-hidden');
            $button.hasClass('active') ? $messagePanel.removeClass('m-hidden') : $messagePanel.addClass('m-hidden');
        },
        togleDisabledInput: function () {
            var $checkBox = $(this),
                $input = $checkBox.next();
            $checkBox.children('input').is(':checked') ? $input.removeProp('disabled') : $input.prop('disabled', true);

        }
    }
};


$(function(){
    Object.keys(window.Handlers.onload).forEach(function (handler) {
        window.Handlers.onload[handler]();
    });
    Object.keys(window.Handlers).forEach(function (bindFunctionEvent) {
        Object.keys(window.Handlers[bindFunctionEvent]).forEach(function (bindFunctionName) {
            $(document.body).on(bindFunctionEvent, '[data-bind-'+bindFunctionEvent+'*='+bindFunctionName+']', window.Handlers[bindFunctionEvent][bindFunctionName]);
        });
    });
});
