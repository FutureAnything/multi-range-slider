!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.MultiRangeSlider=t()}}(function(){return function t(e,i,s){function n(o,h){if(!i[o]){if(!e[o]){var a="function"==typeof require&&require;if(!h&&a)return a(o,!0);if(r)return r(o,!0);var l=new Error("Cannot find module '"+o+"'");throw l.code="MODULE_NOT_FOUND",l}var u=i[o]={exports:{}};e[o][0].call(u.exports,function(t){var i=e[o][1][t];return n(i||t)},u,u.exports,t,e,i,s)}return i[o].exports}for(var r="function"==typeof require&&require,o=0;o<s.length;o++)n(s[o]);return n}({1:[function(t,e,i){function s(t){var e=this;return t=t||{},e.options=L({allowRemove:!0,allowAdd:!0,allowChange:!0,maxRanges:1/0,ghostLabel:function(t){return"+"},label:function(t){return t[0].toString()+"-"+t[1].toString()},valueParse:function(t){return t},valueFormat:function(t){return t}},t),e.el=document.createElement("div"),e.el.className="mrs-bar",e.options.allowChange===!1&&e.el.classList.add("mrs-allowChangeFalse"),e.el.addEventListener("mousemove",function(t){return e.mousemove(t)}),e.el.addEventListener("mouseleave",function(t){return e.mouseleave(t)}),e.el.addEventListener("mouseup",function(t){return e.mouseup(t)}),e.el.addEventListener("mousedown",function(t){return e.mousedown(t)}),e.el.ondragstart=function(){return!1},e.rangeIdCount=0,e.rangeList=[],e.emitter=new x,e}function n(){this.getRangeId=r,this.proxyRangeEvent=o,this.add=h,this.remove=a,this.removeGhost=l,this.getValue=c,this.getInsideRange=f,this.isOverRange=p,this.getNewGhostValue=g,this.mousedown=u,this.mouseup=d,this.mousemove=v,this.mouseleave=m,this.render=w,this.data=b}function r(){return this.rangeIdCount+=1,this.rangeIdCount}function o(t,e){var i=this;e.emitter.on(t,function(){i.emitter.emit(t,{data:i.data(),range:e.data()})})}function h(t,e){var i=this;if(this.rangeList.length>=this.options.maxRanges)return!1;e=L({id:this.getRangeId(),value:t,allowChange:this.options.allowChange},e,{bar:this});var s=new R(e);this.el.appendChild(s.el),this.rangeList.push(s),this.removeGhost();for(var n=s.id,r=["remove","changing","change","click"],o=0;o<r.length;o++){var h=r[o];this.proxyRangeEvent(h,s)}s.emitter.on("remove",function(){i.remove(n)});for(var a=["change","add"],l=0;l<a.length;l++){var u=a[l];this.emitter.emit(u,{data:this.data(),range:s.data()})}return s}function a(t){var e=this.rangeList.find(function(e){return e.id==t});return!!e&&(e.removeEvents(),this.el.removeChild(e.el),this.rangeList=this.rangeList.filter(function(e){return e.id!==t}),!0)}function l(){this.ghost&&(this.ghost.removeEvents(),this.el.removeChild(this.ghost.el),delete this.ghost)}function u(t){}function d(t){this.ghost&&this.add([this.ghost.left,this.ghost.right])}function m(t){this.removeGhost()}function f(t){for(var e,i=0;e=this.rangeList[i++];)if(e.left<t&&t<e.right)return e;return!1}function p(t,e){for(var i,s=0;i=this.rangeList[s++];)if(t<=i.left&&i.right<=e)return!0;return!1}function g(t){if(this.getInsideRange(t))return null;t=this.roundUserValue(t);var e=this.options.minWidth/this.options.step,i=Math.floor(e/2)*this.options.step,s=Math.floor((e+1)/2)*this.options.step,n=t-i,r=t+s;this.options.max<r&&(r=this.options.max)-n<this.options.minWidth&&(n=this.options.max-this.options.minWidth),n<this.options.min&&(n=this.options.min,r-n<this.options.minWidth&&(r=this.options.min+this.options.minWidth));var o=this.getInsideRange(n);o&&(n=o.getValue()[1],r=n+this.options.minWidth);var h=this.getInsideRange(r);return h&&(r=h.getValue()[0],n=r-this.options.minWidth),this.getInsideRange(n)||this.getInsideRange(r)?null:n<this.options.min?null:this.options.max<r?null:[n,r]}function v(t){if(!this.ghost&&0!=this.options.allowAdd&&!(this.rangeList.length>=this.options.maxRanges||this.rangeList.filter(function(t){return t.pressed}).length>0)){var e=this.getCursor(t),i=this.getNewGhostValue(e);null!=i&&(this.ghost=new _({bar:this}),this.el.appendChild(this.ghost.el),this.ghost.setValue(i))}}function c(){return this.rangeList.map(function(t){return t.getValue()})}function b(){return this.rangeList.map(function(t){return t.data()})}function w(){for(var t,e=0;t=this.rangeList[e++];)t.render()}var L=t(6),x=t(5),_=t(3),R=t(7),E=t(2);e.exports=s,E.call(s.prototype),n.call(s.prototype)},{2:2,3:3,5:5,6:6,7:7}],2:[function(t,e,i){function s(){this.pixelToUnit=o,this.unitToPixel=h,this.unitToUser=a,this.userToUnit=l,this.roundUserValue=u,this.getCursor=d}function n(t){return!!r(t).body}function r(t){for(var e=t;e.parentNode;)e=e.parentNode;return e}function o(t){if(!n(this.el))throw new Error("element is not in dom!");var e=this.el.getBoundingClientRect(),i=e.width;if(0==i)throw new Error("element width is 0 or element is not attached to dom");return t/i}function h(t){return t*this.el.getBoundingClientRect().width}function a(t){return(this.options.max-this.options.min)*t+this.options.min}function l(t){return(t-this.options.min)/(this.options.max-this.options.min)}function u(t){return this.options.min+Math.floor((t-this.options.min)/this.options.step)*this.options.step}function d(t){var e=this.el.getBoundingClientRect(),i=t.clientX-e.left;return this.unitToUser(this.pixelToUnit(i))}e.exports=s},{}],3:[function(t,e,i){function s(t){var e=this;this.bar=t.bar,this.el=document.createElement("div"),this.el.className="mrs-ghost",this.label=document.createElement("div"),this.label.className="mrs-label",this.el.appendChild(this.label),this.pressed=!1,this._mousemove=function(t){return e.mousemove(t)},this._mousedown=function(t){return e.mousedown(t)},this._mouseup=function(t){return e.mouseup(t)},this.bar.el.addEventListener("mousemove",this._mousemove),this.bar.el.addEventListener("mousedown",this._mousedown),this.bar.el.addEventListener("mouseup",this._mouseup)}function n(){this.removeEvents=r,this.mousedown=o,this.mouseup=h,this.mousemove=a,this.setValue=l}function r(){this.bar.el.removeEventListener("mousemove",this._mousemove),this.bar.el.removeEventListener("mousedown",this._mousedown),this.bar.el.removeEventListener("mouseup",this._mouseup)}function o(t){[this.el,this.label].indexOf(t.target)!==-1&&(this.pressed=!0)}function h(t){this.pressed=!1}function a(t){var e=this.bar.getCursor(t);if(this.bar.getInsideRange(e))return void(this.pressed||this.bar.removeGhost());var i=(this.left+this.right)/2;e=this.bar.roundUserValue(e);var s=this.bar.options.minWidth/this.bar.options.step,n=Math.floor(s/2)*this.bar.options.step,r=Math.floor((s+1)/2)*this.bar.options.step,o=[this.left,this.right],h=o[0],a=o[1];this.pressed?(e<i&&(h=e-n),e>i&&(a=e+r)):(h=e-n,a=e+r),a>this.bar.options.max&&(a=this.bar.options.max,this.pressed||(h=a-this.bar.options.minWidth)),h<this.bar.options.min&&(h=this.bar.options.min,this.pressed||(a=h+this.bar.options.minWidth)),this.bar.getInsideRange(h)||this.bar.getInsideRange(a)||this.bar.isOverRange(h,a)||this.setValue([h,a])}function l(t){this.left=t[0],this.right=t[1];var e=parseInt(this.bar.unitToPixel(this.bar.userToUnit(this.left))),i=parseInt(this.bar.unitToPixel(this.bar.userToUnit(this.right)));this.el.style.left=e+"px",this.el.style.width=i-e+"px",this.label.innerHTML=this.bar.options.ghostLabel(t)}e.exports=s,n.call(s.prototype)},{}],4:[function(t,e,i){function s(t){if(!(this instanceof s))return new s(t);t=g.call(this,t||{}),v.call(this,t),this._bar=new w(t),this.el=document.createElement("div"),this.el.className="mrs-slider",this.el.appendChild(this._bar.el)}function n(){this.add=r,this.remove=o,this.removeAll=h,this.rangeValue=a,this.rangeData=l,this.render=u,this.val=d,this.data=m,this.on=f,this.off=p}function r(t,e){if(e=e||{},t=c.call(this,t),b.call(this,t),void 0!==e.id&&this._bar.rangeList.find(function(t){return t.id===e.id}))throw new Error("range with this id already exists");if(this._bar.getInsideRange(t[0])||this._bar.getInsideRange(t[1]))throw new Error("intersection");for(var i,s=0;i=this._bar.rangeList[s++];)if(t[0]<=i.left&&i.right<=t[1])throw new Error("intersection");return this._bar.add(t,e)}function o(t){if(!Number.isInteger(t))throw new Error("wrong data");return this._bar.remove(t)}function h(){for(var t=this._bar.rangeList,e=0,i=t.length;e<i;e++)this._bar.remove(t[e].id)}function a(t,e){if(!Number.isInteger(t))throw"rangeId should be integer";var i=this._bar.rangeList.find(function(e){return e.id===t});return!!i&&(void 0===e?i.getValue():i.setValue(e))}function l(t,e){if(!Number.isInteger(t))throw"rangeId should be integer";var i=this._bar.rangeList.find(function(e){return e.id===t});return!!i&&i.data(e)}function u(){this._bar.render()}function d(){return this._bar.getValue()}function m(){return this._bar.data()}function f(t,e){this._bar.emitter.on(t,e)}function p(t,e){this._bar.emitter.off(t,e)}function g(t){if(t.valueParse)for(var e=["min","max","step","minWidth"],i=0;i<e.length;i++){var s=e[i];t[s]=t.valueParse(t[s])}return t}function v(t){for(var e=["min","max","step"],i=0;i<e.length;i++){var s=e[i],n=t[s];if(void 0===n)throw new Error(s+" option is mandatory");if(!Number.isInteger(n))throw new Error(s+" option should be integer")}if(t.max<=t.min)throw new Error("max should be greater than min");if((t.max-t.min)%t.step!=0)throw new Error("there should be an integer number of steps between min and max");if(void 0===t.minWidth&&(t.minWidth=t.step),t.minWidth%t.step!=0)throw new Error("there should be an integer number of steps in minWidth");if(void 0!==t.maxRanges&&!Number.isInteger(t.maxRanges))throw new Error("maxRanges should be integer");for(var r=["allowChange","allowAdd","allowRemove"],o=0;o<r.length;o++){var h=r[o],a=t[h];if([!0,!1,void 0].indexOf(a)===-1)throw new Error(h+" option should be true, false or undefined")}}function c(t){return this._bar.options.valueParse&&(t=t.map(this._bar.options.valueParse)),t}function b(t){if(!Array.isArray(t)||2!=t.length)throw Error}var w=t(1);e.exports=s,n.call(s.prototype)},{1:1}],5:[function(t,e,i){function s(t){return t=t||this,t.emit=n,t.off=r,t.on=o,t.µ={},t}function n(){for(var t,e=this,i=arguments,s=e.µ[i[0]]||[],n=0,r=i.length,o=0,l=s.length;o<l;o++)(t=s[o])?2==r?t.call(e,i[1]):t.apply(e,a(i,1)):n++;n&&h(s)}function r(){var t,e=this,i=arguments,s=i[0],n=i[1];if(!s)return e.µ={};var r=e.µ[s]||[];n&&~(t=l(r,n))&&(r[t]=null),1===i.length&&(e.µ[s]=[])}function o(t,e){var i=this.µ[t]=this.µ[t]||[];e&&!~l(i,e)&&(i[i.length]=e)}function h(t,e){for(;~(e=l(t,null));)t.splice(e,1)}function a(t,e){e=e||0;for(var i=[],s=0,n=t.length-e;s<n;s++)i[s]=t[s+e];return i}function l(t,e){for(var i=0,s=t.length;i<s;i++)if(t[i]===e)return i;return-1}e.exports=s},{}],6:[function(t,e,i){function s(){for(var t={},e=0;e<arguments.length;e++){var i=arguments[e];for(var s in i)n.call(i,s)&&(t[s]=i[s])}return t}e.exports=s;var n=Object.prototype.hasOwnProperty},{}],7:[function(t,e,i){function s(t){var e=this;this.bar=t.bar,this.id=t.id,this.allowChange=t.allowChange,this.el=document.createElement("div"),this.el.className="mrs-range",this.label=document.createElement("div"),this.label.className="mrs-label",this.el.appendChild(this.label),this.right_handler=document.createElement("div"),this.right_handler.className="mrs-right-handler",this.el.appendChild(this.right_handler),this.left_handler=document.createElement("div"),this.left_handler.className="mrs-left-handler",this.el.appendChild(this.left_handler),this.pressed=!1,this.isRemoving=!1,this._value=t.value,this._mousemove=function(t){return e.mousemove(t)},this._mouseup=function(t){return e.mouseup(t)},this._mousedown=function(t){return e.mousedown(t)},document.addEventListener("mousemove",this._mousemove),this.bar.el.addEventListener("mousedown",this._mousedown),document.addEventListener("mouseup",this._mouseup),this.el.ondragstart=function(){return!1},this.emitter=new g,this.setValue(t.value)}function n(){this.removeEvents=r,this.mousedown=o,this.mousemove=l,this.mouseup=u,this.setValue=m,this.renderRemovePopup=h,this.removeRemovingPopup=a,this.render=d,this.setValue=m,this.getValue=f,this.data=p}function r(){this.bar.el.removeEventListener("mousedown",this._mousedown),document.removeEventListener("mousemove",this._mousemove),document.removeEventListener("mouseup",this._mouseup)}function o(t){this.allowChange!==!1&&([this.el,this.label].indexOf(t.target)!==-1&&(this.pressed=!0,this.pressedMode="this"),t.target==this.right_handler&&(this.pressed=!0,this.pressedMode="right"),t.target==this.left_handler&&(this.pressed=!0,this.pressedMode="left"),this.pressed&&(this.el.classList.add("mrs-pressed"),this.el.classList.add("mrs-pressed-"+this.pressedMode),this.pressedPosition=this.bar.roundUserValue(this.bar.getCursor(t)),this.emitter.emit("click",this.data())))}function h(){this.isRemoving=!0,this.elRemovePopup=document.createElement("div"),this.elRemovePopup.className="mrs-remove-popup",this.elRemoveLabel=document.createElement("div"),this.elRemoveLabel.className="mrs-remove-label",this.elRemoveLabel.innerHTML="×",this.elRemovePopup.appendChild(this.elRemoveLabel),this.el.appendChild(this.elRemovePopup)}function a(){this.isRemoving=!1,this.el.removeChild(this.elRemovePopup)}function l(t){if(this.pressed){var e=this.bar.getCursor(t),i=e-this.pressedPosition,s=this.bar.roundUserValue(i);if(0==s)return;var n=this.right,r=this.left;if("this"==this.pressedMode&&(n+=s,r+=s),"right"==this.pressedMode&&(n+=s),"left"==this.pressedMode&&(r+=s),r<this.bar.options.min)return;if(n>this.bar.options.max)return;if(n<r)return;for(var o,h=!1,a=0;(o=this.bar.rangeList[a++])&&!h;)o!=this&&(o.left<n&&n<=o.right&&(h=!0),o.left<=r&&r<o.right&&(h=!0),r<=o.left&&o.right<=n&&(h=!0));if(h)return;if(this.pressedPosition+=s,this.bar.options.allowRemove)n-r<this.bar.options.minWidth?this.isRemoving||this.renderRemovePopup():this.isRemoving&&this.removeRemovingPopup();else if(n-r<this.bar.options.minWidth)return;n==r?this.el.classList.add("mrs-zero-width"):this.el.classList.remove("mrs-zero-width"),this.setValue([r,n]),this.emitter.emit("changing",this.data())}}function u(t){if(this.isRemoving&&(this.removeRemovingPopup(),this.emitter.emit("remove",this.data())),this.el.classList.remove("mrs-pressed"),this.el.classList.remove("mrs-pressed-"+this.pressedMode),[this.el,this.left_handler,this.right_handler,this.label].indexOf(t.target)!==-1||this.pressed){this.pressed=!1,this.pressedPosition=void 0;var e=this._value,i=this.data().val;i[0]==e[0]&&i[1]==e[1]||(this.emitter.emit("change",this.data()),this._value=[i[0],i[1]])}}function d(){var t=parseInt(this.bar.unitToPixel(this.bar.userToUnit(this.left))),e=parseInt(this.bar.unitToPixel(this.bar.userToUnit(this.right)));this.el.style.left=t+"px",this.el.style.width=e-t+"px",this.right-this.left<this.bar.options.minWidth?this.label.innerHTML="":this.label.innerHTML=this.bar.options.label([this.left,this.right],this.data())}function m(t){this.left=t[0],this.right=t[1],this.render()}function f(){return[this.left,this.right].map(this.bar.options.valueFormat)}function p(t){return void 0!==t&&(void 0!==t.val&&this.setValue(t.val),void 0!==t.allowChange&&(this.allowChange=t.allowChange)),{id:this.id,val:this.getValue(),el:this.el,allowChange:this.allowChange}}var g=t(5);e.exports=s,n.call(s.prototype)},{5:5}]},{},[4])(4)});
