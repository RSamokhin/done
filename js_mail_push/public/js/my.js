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
                            'data-parent-input-selector': '[data-autocomlete=artist]',
                            'data-bind-click': 'addParam',
                            'data-transfer-target-selector': '[data-list="artist"]',
                            'data-transfer-value': artist.id
                        }).text(artist.name)
                    }
                }
            });

            $('[data-autocomlete=genres]').typeahead(null, {
                name: 'artist',
                displayKey: 'name',
                source: artists,
                templates: {
                    suggestion: function (artist) {
                        return $('<p/>').attr({
                            'data-parent-input-selector': '[data-autocomlete=genres]',
                            'data-bind-click': 'addParam',
                            'data-transfer-target-selector': '[data-list="genres"]',
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

        },
        addParam: function () {
            var $el = $(this),
                $targetList = $($el.attr('data-transfer-target-selector'));
            if (![].some.call($targetList.children(), function (listEl) {
                    return $(listEl).attr('data-value') === $el.attr('data-transfer-value');
                })) {
                $('<li>')
                    .addClass('list-group-item remove-element')
                    .attr({
                        'data-value': $el.attr('data-transfer-value'),
                        'data-bind-click': 'removeListElement'
                    })
                    .html('<span class="glyphicon glyphicon-minus" aria-hidden="true">&nbsp&nbsp</span>' + $el.text())
                    .prependTo($targetList);
                $($el.attr('data-parent-input-selector')).val('');
            }
        },
        removeListElement: function () {
            $(this).remove();
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
