function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function profileTmplTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug":"table.profile__table\n    tbody\n        tr.profile__row\n            td\n                img(src='\u002Favatar' height='100' width='100')\n        tr.profile__row\n            td Username:\n            td #{username}\n        tr.profile__row\n            td Email:\n            td #{email}\n        tr.profile__row\n            tr Score:\n            td #{score}"};
;var locals_for_with = (locals || {});(function (email, score, username) {;pug_debug_line = 1;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctable class=\"profile__table\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctbody\u003E";
;pug_debug_line = 3;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctr class=\"profile__row\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 5;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Cimg src=\"\u002Favatar\" height=\"100\" width=\"100\"\u002F\u003E\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
;pug_debug_line = 6;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctr class=\"profile__row\"\u003E";
;pug_debug_line = 7;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 7;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "Username:\u003C\u002Ftd\u003E";
;pug_debug_line = 8;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 8;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = username) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
;pug_debug_line = 9;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctr class=\"profile__row\"\u003E";
;pug_debug_line = 10;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 10;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "Email:\u003C\u002Ftd\u003E";
;pug_debug_line = 11;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 11;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = email) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
;pug_debug_line = 12;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctr class=\"profile__row\"\u003E";
;pug_debug_line = 13;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctr\u003E";
;pug_debug_line = 13;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "Score:\u003C\u002Ftr\u003E";
;pug_debug_line = 14;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 14;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fprofile\u002Fprofile.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = score) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E";}.call(this,"email" in locals_for_with?locals_for_with.email:typeof email!=="undefined"?email:undefined,"score" in locals_for_with?locals_for_with.score:typeof score!=="undefined"?score:undefined,"username" in locals_for_with?locals_for_with.username:typeof username!=="undefined"?username:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}