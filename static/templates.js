var userlist =  '<li class="clearfix">'+
                    '<div class="about">'+
                        '<div class="name">{{sender.name}}</div>'+
                        '<div class="status" data-timestamp="{{ timeStamp }}">'+
                            '<div class="on">'+
                            '{{#isOnline}}'+
                            '<i class="fa fa-circle online"></i> online'+
                            '</div>'+
                            '{{/isOnline}}'+
                            '{{^isOnline}}'+
                            '<div class="off">' +
                            '<i class="fa fa-circle offline"></i> '+
                            'offline (<time class="timeago" datetime="{{getDate}}"></time>)'+
                            '</div>'+
                            '{{/isOnline}}'+
                        '</div>'+
                    '</div>'+
                '</li>';


var joinedRoomList =    '<li class="room-item" data-room="{{getId}}" data-identifier="{{identifier}}" class="clearfix">'+
                            '<div class="about">'+
                                '<div class="name">{{name}}</div>'+
                            '</div>'+
                        '</li>';

var message =   '<div class="message-wrapper" data-room="{{room.id}}">'+
                    '<div class="message-data">'+
                        '<span class="message-data-name">' +
                            '<span class="name">{{data.sender.name}}[{{room.name}}]</span>'+
                        '</span>'+
                        '<span class="message-data-time">' +
                            '<span class="time">{{data.date}}</span>' +
                        '</span>'+
                        '<span style="display: none" class="uuid">{{data.uuid}}</span>'+
                    '</div>'+
                    '<div class="message float-left">'+
                        '<span>{{data.content}}</span>'+
                    '</div>'+
                '</div>';

exports.userlist = userlist;
exports.message = message;
exports.joinedRoomList = joinedRoomList;
