/**
 * Created by dreed on 3/24/15.
 */
$(document).ready(function () {
    //var ale2 = new userale();
    var userale = new userale({
        loggingUrl: '',
        toolName: 'dave',
        toolVersion: '2.3',
        componentGroups: [
            'map_group',
            'input_group'
        ],
        workerUrl: '../../../helper-libs/javascript/draper.activity_worker-2.1.1.js',
        debug: true,
        sendLogs: false
    });

    userale.register()

    var template = _.template(
        "<tr>" +
            "<td class='a'><%- activity %></td>" +
            "<td class='b'><%- action %></td>" +
            "<td class='c'><%- component.id %></td>" +
            "<td class='d'><%- component.type %></td>" +
            "<td class='e'><%- component.group %></td>" +
            "<td class='f'><%- source %></td>" +
        "</tr>"
    );
    function log(msg) {
        var elem = $(template(msg))
            .appendTo('.output tbody');

        userale.log(msg);

        setTimeout(function () {
            elem.fadeOut(400, function () {
                $(this).remove();
            });
        }, 2000)


    }



    $('.buttons-grp .btn')
        .mouseover(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOVER',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.BUTTON,
                    group: 'button_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOUT',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.BUTTON,
                    group: 'button_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: ale.activities.PERFORM,
                action: 'CLICK',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.BUTTON,
                    group: 'button_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        });

    $('.rdbtn')
        .mouseover(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOVER',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.RADIOBUTTON,
                    group: 'button_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOUT',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.RADIOBUTTON,
                    group: 'button_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: 'SELECT_DESELECT',
                action: 'CLICK',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.RADIOBUTTON,
                    group: 'button_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        });

    $('.dd-list')
        .mouseover(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOVER',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.DROPDOWNLIST,
                    group: 'dropdown_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOUT',
                component: {
                    id: this.getAttribute('id'),
                    type: ale.components.DROPDOWNLIST,
                    group: 'dropdown_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            //console.log($(this).parent().hasClass('open'))
            var msg = {
                activity: 'OPEN_CLOSE',
                action: 'CLICK',
                component: {
                    id: this.getAttribute('id'),
                    type: ale.components.DROPDOWNLIST,
                    group: 'dropdown_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        });

    $('.dd-item')
        .mouseover(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOVER',
                component: {
                    id: this.getAttribute('id'),
                    type: ale.components.LISTITEM,
                    group: 'dropdown_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOUT',
                component: {
                    id: this.getAttribute('id'),
                    type: ale.components.LISTITEM,
                    group: 'dropdown_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: ale.activities.PERFORM,
                action: 'CLICK',
                component: {
                    id: this.getAttribute('id'),
                    type: ale.components.LISTITEM,
                    group: 'dropdown_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        });

    $('.textbox')
        .mouseover(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOVER',
                component: {
                    id: this.getAttribute('id'),
                    type: ale.components.TEXTBOX,
                    group: 'input_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOVER',
                component: {
                    id: this.getAttribute('id'),
                    type: ale.components.TEXTBOX,
                    group: 'input_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'FOCUS',
                component: {
                    id: this.getAttribute('id'),
                    type: ale.components.TEXTBOX,
                    group: 'input_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .keypress(function () {
            var msg = {
                activity: ale.activities.ALTER,
                action: 'ENTERTEXT',
                component: {
                    id: this.getAttribute('id'),
                    type: ale.components.TEXTBOX,
                    group: 'input_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        });

    $('.map-group .btn')
        .mouseover(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOVER',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.BUTTON,
                    group: 'map_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOUT',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.BUTTON,
                    group: 'map_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: ale.activities.PERFORM,
                action: 'CLICK',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.BUTTON,
                    group: 'map_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        });

    $('.query-group .btn')
        .mouseover(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOVER',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.BUTTON,
                    group: 'query_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .mouseout(function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOUT',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.BUTTON,
                    group: 'query_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .click(function () {
            var msg = {
                activity: ale.activities.PERFORM,
                action: 'CLICK',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.BUTTON,
                    group: 'query_group'
                },
                source: 'user',
                object: null,
                tags: ['query']
            };
            log(msg);
        });


    map
        .on('mouseover', function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOVER',
                component: {
                    id: 'UNK',
                    type: ale.components.MAP,
                    group: 'map_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .on('mouseout', function () {
            var msg = {
                activity: ale.activities.INSPECT,
                action: 'MOUSEOUT',
                component: {
                    id: 'UNK',
                    type: ale.components.MAP,
                    group: 'map_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .on('zoomstart', function () {
            var msg = {
                activity: ale.activities.ALTER,
                action: 'ZOOM',
                component: {
                    id: 'UNK',
                    type: ale.components.MAP,
                    group: 'map_group'
                },
                source: 'unk',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .on('dragstart', function () {
            var msg = {
                activity: ale.activities.ALTER,
                action: 'DRAG',
                component: {
                    id: 'UNK',
                    type: ale.components.MAP,
                    group: 'map_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .on('dragend', function () {
            var msg = {
                activity: ale.activities.ALTER,
                action: 'DRAG',
                component: {
                    id: 'UNK',
                    type: ale.components.MAP,
                    group: 'map_group'
                },
                source: 'user',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        })
        .on('moveend', function () {
            var msg = {
                activity: ale.activities.ALTER,
                action: 'MOVE',
                component: {
                    id: 'UNK',
                    type: 'map',
                    group: 'map_group'
                },
                source: 'system',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        });


    $('.slider')
        .on("slidestart", function (event, ui) {
            var msg = {
                activity: ale.activities.ALTER,
                action: 'SLIDE',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.SLIDER,
                    group: 'input_group'
                },
                source: 'user',
                object: 'HANDLE',
                tags: ['a', 'b']
            };
            log(msg);
        })
        .on("slidestop", function (event, ui) {
            var msg = {
                activity: ale.activities.ALTER,
                action: 'SLIDE',
                component: {
                    id: this.getAttribute('id') || 'UNK',
                    type: ale.components.SLIDER,
                    group: 'input_group'
                },
                source: 'user',
                object: 'HANDLE',
                tags: ['a', 'b']
            };
            log(msg);
        });

    $(window)
        .on("scroll", function() {
            var msg = {
                activity: ale.activities.ALTER,
                action: 'SCROLL',
                component: {
                    id: 'UNK',
                    type: ale.components.WINDOW,
                    group: 'top'
                },
                source: 'unk',
                object: null,
                tags: ['a', 'b']
            };
            log(msg);
        });

    ale = {};
    ale.components =
    {
        BUTTON : "button",
        CANVAS : "canvas",
        CHECKBOX : "checkbox",
        COMBOBOX : "combobox",
        DATAGRID : "datagrid",
        DIALOGBOX : "dialog_box",
        DROPDOWNLIST : "dropdownlist",
        FRAME : "frame",
        ICON : "icon",
        INFOBAR : "infobar",
        LABEL : "label",
        LINK : "link",
        LISTBOX : "listbox",
        LISTITEM: "listitem",
        MAP : "map",
        MENU : "menu",
        MODALWINDOW : "modalwindow",
        PALETTEWINDOW : "palettewindow",
        PANEL : "panel",
        PROGRESSBAR : "progressbar",
        RADIOBUTTON : "radiobutton",
        SLIDER : "slider",
        SPINNER : "spinner",
        STATUSBAR : "statusbar",
        TAB : "tab",
        TABLE : "table",
        TAG : "tag",
        TEXTBOX : "textbox",
        THROBBER : "throbber",
        TOAST : "toast",
        TOOLBAR : "toolbar",
        TOOLTIP : "tooltip",
        TREEVIEW : "treeview",
        WINDOW : "window",
        WORKSPACE : "workspace",
        // Other is used in conjunction with softwareMetadata in order
        // to provide a component in which is not currently listed within
        // the COMPONENT list.
        OTHER : "other"
    };

    ale.activities =
    {
        ADD : "add",
        REMOVE : "remove",
        CREATE : "create",
        DELETE : "delete",
        SELECT : "select",
        DESELECT : "deselect",
        ENTER : "enter",
        LEAVE : "leave",
        INSPECT : "inspect",
        ALTER : "alter",
        HIDE : "hide",
        SHOW : "show",
        PERFORM: "perform"
    };
    //$('#slider1')
    //    .on("slidestart", function (event, ui) {
    //        log(this.getAttribute('id') + ' slider start')
    //    })
    //    .on("slidestop", function (event, ui) {
    //        log(this.getAttribute('id') + ' slider stop')
    //    });

    //document.querySelector('body').addEventListener('click', function(event) {
    //    //if (event.target.tagName.toLowerCase() === 'li') {
    //    //    // do your action on your 'li' or whatever it is you're listening for
    //    //}
    //
    //    window.A = event.target;
    //
    //    console.log('click', event.target.tagName, event.target)
    //});

    //$(document).ready(function(){
    //    $(document).bind('mousewheel', function(e){
    //        if(e.originalEvent.wheelDelta /120 > 0) {
    //            log('scrolling up !');
    //        }
    //        else{
    //            log('scrolling down !');
    //        }
    //    });
    //});
});