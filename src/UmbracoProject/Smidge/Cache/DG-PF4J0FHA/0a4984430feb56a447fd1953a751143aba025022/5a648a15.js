/**
 * angular-ui-sortable - This directive allows you to jQueryUI Sortable.
 * @version v0.19.0 - 2018-05-20
 * @link http://angular-ui.github.com
 * @license MIT
 */
!function(a,b,c){"use strict";b.module("ui.sortable",[]).value("uiSortableConfig",{items:"> [ng-repeat],> [data-ng-repeat],> [x-ng-repeat]"}).directive("uiSortable",["uiSortableConfig","$timeout","$log",function(a,d,e){return{require:"?ngModel",scope:{ngModel:"=",uiSortable:"=",create:"&uiSortableCreate",start:"&uiSortableStart",activate:"&uiSortableActivate",beforeStop:"&uiSortableBeforeStop",update:"&uiSortableUpdate",remove:"&uiSortableRemove",receive:"&uiSortableReceive",deactivate:"&uiSortableDeactivate",stop:"&uiSortableStop"},link:function(f,g,h,i){function j(a,b){var c="function"==typeof a,d="function"==typeof b;return c&&d?function(){a.apply(this,arguments),b.apply(this,arguments)}:d?b:a}function k(a){var b=a.data("ui-sortable");return b&&"object"==typeof b&&"ui-sortable"===b.widgetFullName?b:null}function l(a){a.children().each(function(){var a=b.element(this);a.width(a.width())})}function m(a,b){return b}function n(b,c){return E[b]?("stop"===b&&(c=j(c,function(){f.$apply()}),c=j(c,v)),c=j(E[b],c)):F[b]&&(c=F[b](c)),c||"items"!==b&&"ui-model-items"!==b||(c=a.items),c}function o(a,d,e){function f(a,b){b in C||(C[b]=null)}b.forEach(E,f);var g=null;if(d){var h;b.forEach(d,function(d,e){if(!(a&&e in a)){if(e in D)return void("ui-floating"===e?C[e]="auto":C[e]=n(e,c));h||(h=b.element.ui.sortable().options);var f=h[e];f=n(e,f),g||(g={}),g[e]=f,C[e]=f}})}return a=b.extend({},a),b.forEach(a,function(b,c){if(c in D){if("ui-floating"!==c||b!==!1&&b!==!0||!e||(e.floating=b),"ui-preserve-size"===c&&(b===!1||b===!0)){var d=C.helper;a.helper=function(a,b){return C["ui-preserve-size"]===!0&&l(b),(d||m).apply(this,arguments)}}C[c]=n(c,b)}}),b.forEach(a,function(a,b){b in D||(a=n(b,a),g||(g={}),g[b]=a,C[b]=a)}),g}function p(a){var c=a.sortable("option","placeholder");if(c&&c.element&&"function"==typeof c.element){var d=c.element();return d=b.element(d)}return null}function q(a,b){var c=C["ui-model-items"].replace(/[^,]*>/g,""),d=a.find('[class="'+b.attr("class")+'"]:not('+c+")");return d}function r(a,b){var c=a.sortable("option","helper");return"clone"===c||"function"==typeof c&&b.item.sortable.isCustomHelperUsed()}function s(a,b){var c=null;return r(a,b)&&"parent"===a.sortable("option","appendTo")&&(c=B),c}function t(a){return/left|right/.test(a.css("float"))||/inline|table-cell/.test(a.css("display"))}function u(a,b){for(var c=0;c<a.length;c++){var d=a[c];if(d.element[0]===b[0])return d}}function v(a,b){b.item.sortable._destroy()}function w(a){return a.parent().find(C["ui-model-items"]).index(a)}function x(){f.$watchCollection("ngModel",function(){d(function(){k(g)&&g.sortable("refresh")},0,!1)}),E.start=function(a,d){if("auto"===C["ui-floating"]){var e=d.item.siblings(),f=k(b.element(a.target));f.floating=t(e)}var h=w(d.item);d.item.sortable={model:i.$modelValue[h],index:h,source:g,sourceList:d.item.parent(),sourceModel:i.$modelValue,cancel:function(){d.item.sortable._isCanceled=!0},isCanceled:function(){return d.item.sortable._isCanceled},isCustomHelperUsed:function(){return!!d.item.sortable._isCustomHelperUsed},_isCanceled:!1,_isCustomHelperUsed:d.item.sortable._isCustomHelperUsed,_destroy:function(){b.forEach(d.item.sortable,function(a,b){d.item.sortable[b]=c})},_connectedSortables:[],_getElementContext:function(a){return u(this._connectedSortables,a)}}},E.activate=function(a,b){var c=b.item.sortable.source===g,d=c?b.item.sortable.sourceList:g,e={element:g,scope:f,isSourceContext:c,savedNodesOrigin:d};b.item.sortable._connectedSortables.push(e),A=d.contents(),B=b.helper;var h=p(g);if(h&&h.length){var i=q(g,h);A=A.not(i)}},E.update=function(a,b){if(!b.item.sortable.received){b.item.sortable.dropindex=w(b.item);var c=b.item.parent().closest("[ui-sortable], [data-ui-sortable], [x-ui-sortable]");b.item.sortable.droptarget=c,b.item.sortable.droptargetList=b.item.parent();var d=b.item.sortable._getElementContext(c);b.item.sortable.droptargetModel=d.scope.ngModel,g.sortable("cancel")}var e=!b.item.sortable.received&&s(g,b,A);e&&e.length&&(A=A.not(e));var h=b.item.sortable._getElementContext(g);A.appendTo(h.savedNodesOrigin),b.item.sortable.received&&(A=null),b.item.sortable.received&&!b.item.sortable.isCanceled()&&(f.$apply(function(){i.$modelValue.splice(b.item.sortable.dropindex,0,b.item.sortable.moved)}),f.$emit("ui-sortable:moved",b))},E.stop=function(a,c){var d="dropindex"in c.item.sortable&&!c.item.sortable.isCanceled();if(d&&!c.item.sortable.received)f.$apply(function(){i.$modelValue.splice(c.item.sortable.dropindex,0,i.$modelValue.splice(c.item.sortable.index,1)[0])}),f.$emit("ui-sortable:moved",c);else if(!d&&!b.equals(g.contents().toArray(),A.toArray())){var e=s(g,c,A);e&&e.length&&(A=A.not(e));var h=c.item.sortable._getElementContext(g);A.appendTo(h.savedNodesOrigin)}A=null,B=null},E.receive=function(a,b){b.item.sortable.received=!0},E.remove=function(a,b){"dropindex"in b.item.sortable||(g.sortable("cancel"),b.item.sortable.cancel()),b.item.sortable.isCanceled()||f.$apply(function(){b.item.sortable.moved=i.$modelValue.splice(b.item.sortable.index,1)[0]})},b.forEach(E,function(a,b){E[b]=j(E[b],function(){var a,c=f[b];"function"==typeof c&&("uiSortable"+b.substring(0,1).toUpperCase()+b.substring(1)).length&&"function"==typeof(a=c())&&a.apply(this,arguments)})}),F.helper=function(a){return a&&"function"==typeof a?function(d,e){var f=e.sortable,h=w(e);e.sortable={model:i.$modelValue[h],index:h,source:g,sourceList:e.parent(),sourceModel:i.$modelValue,_restore:function(){b.forEach(e.sortable,function(a,b){e.sortable[b]=c}),e.sortable=f}};var j=a.apply(this,arguments);return e.sortable._restore(),e.sortable._isCustomHelperUsed=e!==j,j}:a},f.$watchCollection("uiSortable",function(a,b){var c=k(g);if(c){var d=o(a,b,c);d&&g.sortable("option",d)}},!0),o(C)}function y(){i?x():e.info("ui.sortable: ngModel not provided!",g),g.sortable(C)}function z(){return f.uiSortable&&f.uiSortable.disabled?!1:(y(),z.cancelWatcher(),z.cancelWatcher=b.noop,!0)}var A,B,C={},D={"ui-floating":c,"ui-model-items":a.items,"ui-preserve-size":c},E={create:null,start:null,activate:null,beforeStop:null,update:null,remove:null,receive:null,deactivate:null,stop:null},F={helper:null};return b.extend(C,D,a,f.uiSortable),b.element.fn&&b.element.fn.jquery?(z.cancelWatcher=b.noop,void(z()||(z.cancelWatcher=f.$watch("uiSortable.disabled",z)))):void e.error("ui.sortable: jQuery should be included before AngularJS!")}}}])}(window,window.angular);