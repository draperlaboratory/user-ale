/*
   Copyright 2016 The Charles Stark Draper Laboratory

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/**
 * Created by dreed on 3/24/15.
 */
$(document).ready(function () {
    //var ale2 = new userale();
    var slice = [].slice;

    extend = function() {
        var i, key, len, object, objects, out, value;
        objects = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        out = {};
        for (i = 0, len = objects.length; i < len; i++) {
            object = objects[i];
            for (key in object) {
                value = object[key];
                out[key] = value;
            }
        }
        return out;
    };

    var defaultMsg = {
        activity: null,
        action: null,
        elementId: '',
        elementType: '',
        elementGroup: '',
        elementSub: '',
        source: null,
        tags: [],
        meta: {}
    };

    var ale2 = new userale(
        {
        loggingUrl: 'https://'+location.hostname,
        toolName: 'userale-test',
        toolVersion: '3.0.0',
        elementGroups: [
            'map_group',
            'input_group',
            'top',
            'dropdown_group',
            'button_group',
            'query_group'
        ],
        workerUrl: 'js/userale-worker.js',
        debug: true,
        sendLogs: true
    });

    window.ale2 = ale2;
    ale2.register();

    var template = _.template(
        "<tr>" +
            "<td class='a'><%- activity %></td>" +
            "<td class='b'><%- action %></td>" +
            "<td class='c'><%- elementId %></td>" +
            "<td class='d'><%- elementType %></td>" +
            "<td class='e'><%- elementGroup %></td>" +
            "<td class='e'><%- elementSub %></td>" +
            "<td class='f'><%- source %></td>" +
        "</tr>"
    );
    function log(msg) {
        msg = extend(defaultMsg, msg);
        var elem = $(template(msg))
            .appendTo('.output tbody');

        ale2.log(msg);

        //setTimeout(function () {
        //    elem.fadeOut(400, function () {
        //        $(this).remove();
        //    });
        //}, 2000)


    }

    $('#clear-button').click(function() {
        $('.output tbody tr').remove();
    });

    window.myLog = log;



    $('.buttons-grp .btn')
        .mouseover(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOVER',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'button',
                elementGroup: 'button_group',
                source: 'user',
                tags: ['submit']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOUT',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'button',
                elementGroup: 'button_group',
                source: 'user',
                tags: ['submit']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: 'perform',
                action: 'CLICK',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'button',
                elementGroup: 'button_group',
                source: 'user',
                tags: ['submit']
            };
            log(msg);
        });

    $('.rdbtn')
        .mouseover(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOVER',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'radiobutton',
                elementGroup: 'button_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOUT',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'radiobutton',
                elementGroup: 'button_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: 'SELECT_DESELECT',
                action: 'CLICK',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'radiobutton',
                elementGroup: 'button_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        });

    $('.dd-list')
        .mouseover(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOVER',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'dropdownlist',
                elementGroup: 'dropdown_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOUT',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'dropdownlist',
                elementGroup: 'dropdown_group',

                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            //console.log($(this).parent().hasClass('open'))
            var msg = {
                activity: 'OPEN_CLOSE',
                action: 'CLICK',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'dropdownlist',
                elementGroup: 'dropdown_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        });

    $('.dd-item')
        .mouseover(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOVER',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'dropdownlist',
                elementGroup: 'dropdown_group',
                elementSub: 'listitem',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOUT',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'dropdownlist',
                elementGroup: 'dropdown_group',
                elementSub: 'listitem',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: 'perform',
                action: 'CLICK',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'dropdownlist',
                elementGroup: 'dropdown_group',
                elementSub: 'listitem',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        });

    $('.query-group .textbox')
        .mouseover(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOVER',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'textbox',
                elementGroup: 'query_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOVER',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'textbox',
                elementGroup: 'query_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: 'inspect',
                action: 'FOCUS',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'textbox',
                elementGroup: 'query_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .keypress(function () {
            var msg = {
                activity: 'alter',
                action: 'ENTERTEXT',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'textbox',
                elementGroup: 'query_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        });

    $('.map-group .btn')
        .mouseover(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOVER',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'button',
                elementGroup: 'map_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOUT',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'button',
                elementGroup: 'map_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: 'perform',
                action: 'CLICK',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'button',
                elementGroup: 'map_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        });

    $('.query-group .btn')
        .mouseover(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOVER',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'button',
                elementGroup: 'query_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOUT',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'button',
                elementGroup: 'query_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: 'perform',
                action: 'CLICK',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'button',
                elementGroup: 'query_group',
                source: 'user',
                tags: ['query']
            };
            log(msg);
        });


    map
        .on('mouseover', function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOVER',
                elementId: 'UNK',
                elementType: 'map',
                elementGroup: 'map_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .on('mouseout', function () {
            var msg = {
                activity: 'inspect',
                action: 'MOUSEOUT',
                elementId: 'UNK',
                elementType: 'map',
                elementGroup: 'map_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .on('zoomstart', function () {
            var msg = {
                activity: 'alter',
                action: 'ZOOM',
                elementId: 'UNK',
                elementType: 'map',
                elementGroup: 'map_group',
                source: 'unk',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .on('dragstart', function () {
            var msg = {
                activity: 'alter',
                action: 'DRAG',
                elementId: 'UNK',
                elementType: 'map',
                elementGroup: 'map_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .on('dragend', function () {
            var msg = {
                activity: 'alter',
                action: 'DRAG',
                elementId: 'UNK',
                elementType: 'map',
                elementGroup: 'map_group',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .on('moveend', function () {
            var msg = {
                activity: 'alter',
                action: 'MOVE',
                elementId: 'UNK',
                elementType: 'map',
                elementGroup: 'map_group',
                source: 'system',
                tags: ['a', 'b']
            };
            log(msg);
        });


    $('.slider')
        .on("slidestart", function (event, ui) {
            var msg = {
                activity: 'alter',
                action: 'SLIDE',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'slider',
                elementGroup: 'query_group',
                elementSub: 'label',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);


            var msg = {
                activity: 'alter',
                elementType: 'slider',
                elementGroup: 'query_group',
                elementSub: 'label',
                source: 'system',
                tags: []
            };
            log(msg);
        })
        .on("slidestop", function (event, ui) {
            var msg = {
                activity: 'alter',
                action: 'SLIDE',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'slider',
                elementGroup: 'query_group',
                elementSub: 'handle',
                source: 'user',
                tags: ['a', 'b']
            };
            log(msg);

            var msg = {
                activity: 'alter',
                elementId: this.getAttribute('id') || 'UNK',
                elementType: 'slider',
                elementGroup: 'query_group',
                elementSub: 'label',
                source: 'system',
                tags: []
            };
            log(msg);
        });

    $(window)
        .on("scroll", function() {
            var msg = {
                activity: 'alter',
                action: 'SCROLL',
                elementId: 'UNK',
                elementType: 'window',
                elementGroup: 'top',
                source: 'unk',
                tags: ['a', 'b']
            };
            log(msg);
        });
});
