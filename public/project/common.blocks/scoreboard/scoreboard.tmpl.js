function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function scoreboardTmplTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {"public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug":"table.scoreboard__table\n    tbody\n        each val, index in data\n            tr.scoreboard__row\n                td= index + 1\n                td= val.username\n                td= val.email\n                td= val.score"};
;var locals_for_with = (locals || {});(function (data) {;pug_debug_line = 1;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctable class=\"scoreboard__table\"\u003E";
;pug_debug_line = 2;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctbody\u003E";
;pug_debug_line = 3;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
// iterate data
;(function(){
  var $$obj = data;
  if ('number' == typeof $$obj.length) {
      for (var index = 0, $$l = $$obj.length; index < $$l; index++) {
        var val = $$obj[index];
;pug_debug_line = 4;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctr class=\"scoreboard__row\"\u003E";
;pug_debug_line = 5;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 5;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = index + 1) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
;pug_debug_line = 6;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 6;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = val.username) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
;pug_debug_line = 7;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 7;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = val.email) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
;pug_debug_line = 8;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 8;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = val.score) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
      }
  } else {
    var $$l = 0;
    for (var index in $$obj) {
      $$l++;
      var val = $$obj[index];
;pug_debug_line = 4;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctr class=\"scoreboard__row\"\u003E";
;pug_debug_line = 5;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 5;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = index + 1) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
;pug_debug_line = 6;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 6;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = val.username) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
;pug_debug_line = 7;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 7;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = val.email) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
;pug_debug_line = 8;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + "\u003Ctd\u003E";
;pug_debug_line = 8;pug_debug_filename = "public\u002Fproject\u002Fcommon.blocks\u002Fscoreboard\u002Fscoreboard.tmpl.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = val.score) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E";}.call(this,"data" in locals_for_with?locals_for_with.data:typeof data!=="undefined"?data:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);};return pug_html;}