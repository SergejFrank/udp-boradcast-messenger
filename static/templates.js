var userlist = '<li class="clearfix"> <div class="about"> <div class="name">{{user.name}}</div> <div class="status"> <i class="fa fa-circle {{#online}}online{{/online}} {{^online}}offline{{/online}}"></i> {{#online}}online{{/online}}{{^online}}offline (<time class="timeago" datetime="{{ lastSeen }}"></time>){{/online}}  </div> </div> </li>';


exports.userlist = userlist;
