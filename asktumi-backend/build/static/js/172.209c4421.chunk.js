"use strict";(self.webpackChunkyoda_admin_react=self.webpackChunkyoda_admin_react||[]).push([[172],{328:function(e,n,r){var t=r(1523),i=r(914),a=r(8164),c=r(184);n.Z=function(e){var n=e.breadCrumbParent,r=e.breadCrumbParent2,s=e.breadCrumbParent3,l=e.breadCrumbActive;return(0,c.jsx)(i.Z,{children:(0,c.jsxs)(a.Z,{className:"hp-d-flex hp-flex-wrap",children:[(0,c.jsx)(a.Z.Item,{children:(0,c.jsx)(t.rU,{to:"/",children:"Home"})}),"Components"===n?(0,c.jsx)(a.Z.Item,{children:(0,c.jsx)(t.rU,{to:"/components/components-page",children:"Components"})}):(0,c.jsx)(a.Z.Item,{children:n}),r&&(0,c.jsx)(a.Z.Item,{children:r}),s&&(0,c.jsx)(a.Z.Item,{children:s}),(0,c.jsx)(a.Z.Item,{children:l})]})})}},1201:function(e,n,r){var t=r(6030),i=r(4880),a=r(184);n.Z=function(){return(0,t.v9)((function(e){var n;return null===(n=e.auth)||void 0===n?void 0:n.isLoggedIn}))?null:(0,a.jsx)(i.Redirect,{to:"/pages/authentication/login"})}},5172:function(e,n,r){r.r(n),r.d(n,{default:function(){return C}});r(2791);var t=r(3539),i=r(4349),a=r(1851),c=r(6106),s=r(914),l=r(7131),o=r(328),p=r(4165),u=r(5861),d=r(5958),m=r(3695),h=r(8360),b=function(e){return function(){var n=(0,u.Z)((0,p.Z)().mark((function n(r){var t,i,a,c,s,l;return(0,p.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return r({type:"SET_LOADING",loading:!0}),t=e.id,delete e.id,n.prev=3,n.next=6,d.Z.post("/v1/stripe/create-checkout-session",e);case 6:if(i=n.sent,r({type:"SET_LOADING",loading:!1}),201!=i.status){n.next=14;break}return r((0,h.Nq)({id:t})),window.location.href=null===i||void 0===i||null===(a=i.data)||void 0===a?void 0:a.url,n.abrupt("return",!0);case 14:m.ZP.error(null===i||void 0===i||null===(c=i.data)||void 0===c?void 0:c.message);case 15:return n.abrupt("return",!1);case 18:n.prev=18,n.t0=n.catch(3),m.ZP.error(null===n.t0||void 0===n.t0||null===(s=n.t0.response)||void 0===s||null===(l=s.data)||void 0===l?void 0:l.message),r({type:"SET_LOADING",loading:!1});case 22:case"end":return n.stop()}}),n,null,[[3,18]])})));return function(e){return n.apply(this,arguments)}}()},v=function(e){return function(){var n=(0,u.Z)((0,p.Z)().mark((function n(r){var t,i,a,c;return(0,p.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return r({type:"SET_LOADING",loading:!0}),n.prev=1,n.next=4,d.Z.post("/v1/stripe/cancel-subscription",e);case 4:if(t=n.sent,r({type:"SET_LOADING",loading:!1}),204!=t.status){n.next=12;break}return m.ZP.success("Succesfully unsubscribed!"),r((0,h.Nq)({id:e.id})),n.abrupt("return",!0);case 12:m.ZP.error(null===t||void 0===t||null===(i=t.data)||void 0===i?void 0:i.message);case 13:n.next=19;break;case 15:n.prev=15,n.t0=n.catch(1),m.ZP.error(null===n.t0||void 0===n.t0||null===(a=n.t0.response)||void 0===a||null===(c=a.data)||void 0===c?void 0:c.message),r({type:"SET_LOADING",loading:!1});case 19:case"end":return n.stop()}}),n,null,[[1,15]])})));return function(e){return n.apply(this,arguments)}}()},f=r(7309),x=r(6030),y=r(184);function g(e){var n=(0,x.I0)(),r=(0,x.v9)((function(e){var n;return null===(n=e.auth)||void 0===n?void 0:n.user}));console.log(e);var t=function(){var e=(0,u.Z)((0,p.Z)().mark((function e(t){var i;return(0,p.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log(t),i=!1,!t.unsubscribe){e.next=7;break}return e.next=5,n(v({id:null===r||void 0===r?void 0:r.id}));case 5:e.next=10;break;case 7:return e.next=9,n(b({paymentType:t.paymentType,paymentPlan:t.paymentPlan,id:null===r||void 0===r?void 0:r.id}));case 9:i=e.sent;case 10:console.log("userPaymentChect",i);case 11:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),i=(0,y.jsx)("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,y.jsx)("path",{d:"M6.99992 13.6667C3.31792 13.6667 0.333252 10.682 0.333252 7.00004C0.333252 3.31804 3.31792 0.333374 6.99992 0.333374C10.6819 0.333374 13.6666 3.31804 13.6666 7.00004C13.6666 10.682 10.6819 13.6667 6.99992 13.6667ZM6.99992 12.3334C8.41441 12.3334 9.77096 11.7715 10.7712 10.7713C11.7713 9.77108 12.3333 8.41453 12.3333 7.00004C12.3333 5.58555 11.7713 4.229 10.7712 3.2288C9.77096 2.22861 8.41441 1.66671 6.99992 1.66671C5.58543 1.66671 4.22888 2.22861 3.22868 3.2288C2.22849 4.229 1.66659 5.58555 1.66659 7.00004C1.66659 8.41453 2.22849 9.77108 3.22868 10.7713C4.22888 11.7715 5.58543 12.3334 6.99992 12.3334ZM6.33525 9.66671L3.50659 6.83804L4.44925 5.89537L6.33525 7.78137L10.1059 4.01004L11.0493 4.95271L6.33525 9.66671Z",fill:"#0010F7"})}),a=e.values.map((function(e,n){return(0,y.jsxs)(s.Z,{className:"hp-pricing-item hp-p-24 hp-mx-xl-8 hp-mx-16 hp-mb-sm-24 hp-mb-16 hp-border-1 hp-border-radius ".concat(e.special?"hp-pricing-item-special":"hp-border-color-black-40 hp-border-color-dark-80"),children:[(0,y.jsxs)("div",{children:[(0,y.jsxs)(c.Z,{justify:"space-between",children:[(0,y.jsxs)(s.Z,{span:e.best?15:24,children:[(0,y.jsx)("h5",{className:"hp-mb-0 hp-pricing-item-title",children:e.title}),(0,y.jsx)("p",{className:"hp-pricing-item-subtitle hp-caption hp-mb-sm-8 hp-mb-32 hp-text-color-black-60",children:e.subTitle})]}),e.best&&(0,y.jsx)(s.Z,{md:9,span:5,children:(0,y.jsx)(f.Z,{type:"primary",className:"hp-pricing-item-best-button hp-caption hp-py-4 hp-px-16 hp-bg-color-primary-4 hp-text-color-primary-1",children:"Best Price"})})]}),(0,y.jsx)("span",{className:"hp-pricing-item-price h1",children:e.price}),(0,y.jsx)("p",{className:"hp-pricing-item-billed hp-caption hp-mt-sm-0 hp-mt-4 hp-mb-0 hp-text-color-black-60",children:e.billed}),(0,y.jsx)("ul",{className:"hp-mt-24 hp-mb-0 hp-p-0",children:e.list.map((function(e,n){return(0,y.jsxs)("li",{className:"hp-pricing-item-list hp-d-flex-center hp-mt-8",children:[i,(0,y.jsx)("span",{className:"hp-d-block hp-ml-8 hp-caption hp-font-weight-400 hp-text-color-dark-0",children:e})]},n)}))})]}),e.special?(0,y.jsx)(f.Z,{onClick:function(){return t(e)},className:"hp-mt-32 hp-hover-border-color-primary-2 hp-hover-bg-primary-2 hp-hover-text-color-black-0",block:!0,type:"primary",children:e.button}):(0,y.jsx)(f.Z,{onClick:function(){return t(e)},className:"hp-mt-32",block:!0,type:"primary",children:e.button})]},n)}));return(0,y.jsx)(c.Z,{align:"top",justify:"center",children:a})}var Z=r(3528),j=r(1201);var C=(0,a.ZP)((function(){(0,x.I0)(),(0,x.v9)((function(e){return e}));var e=(0,x.v9)((function(e){var n;return null===(n=e.auth)||void 0===n?void 0:n.user}));console.log(e),console.log(null===e||void 0===e?void 0:e.id,"user ID");var n=(0,t.Z)(),r=[{title:(0,y.jsx)(Z.Z,{id:"pricing-basic"}),subTitle:(0,y.jsx)(Z.Z,{id:"pricing-one-time-purchase"}),price:"$ 100",billed:(0,y.jsx)(Z.Z,{id:"pricing-one-time-purchase"}),special:!1,best:!1,button:(0,y.jsx)(Z.Z,{id:"pricing-buy-now"}),list:["100 ".concat(n.formatMessage({id:"pricing-token-credit"}))],paymentType:"oneTime",paymentPlan:"plan100"},{title:(0,y.jsx)(Z.Z,{id:"pricing-starter"}),subTitle:(0,y.jsx)(Z.Z,{id:"pricing-one-time-purchase"}),price:"$ 100",billed:(0,y.jsx)(Z.Z,{id:"pricing-one-time-purchase"}),special:!1,best:!1,button:(0,y.jsx)(Z.Z,{id:"pricing-buy-now"}),list:["200 ".concat(n.formatMessage({id:"pricing-token-credit"}))],paymentType:"oneTime",paymentPlan:"plan200"},{title:"Proffesional",subTitle:"Monthly Subscription",price:"$ 300",billed:"Montly Subscription",special:!1,best:!1,unsubscribe:"plan300"==(null===e||void 0===e?void 0:e.paymentPlan),button:"plan300"==(null===e||void 0===e?void 0:e.paymentPlan)?(0,y.jsx)(Z.Z,{id:"pricing-unsubscribe"}):(0,y.jsx)(Z.Z,{id:"pricing-subscribe"}),list:["300 ".concat(n.formatMessage({id:"pricing-token-credit"}))],paymentType:"monthly",paymentPlan:"plan300"},{title:"Advanced",subTitle:"Monthly Subscription",price:"$ 400",billed:"Montly Subscription",special:!0,best:!1,unsubscribe:"plan400"==(null===e||void 0===e?void 0:e.paymentPlan),button:"plan400"==(null===e||void 0===e?void 0:e.paymentPlan)?(0,y.jsx)(Z.Z,{id:"pricing-unsubscribe"}):(0,y.jsx)(Z.Z,{id:"pricing-subscribe"}),list:["500 ".concat(n.formatMessage({id:"pricing-token-credit"}))],paymentType:"monthly",paymentPlan:"plan400"}];return(0,y.jsxs)(c.Z,{gutter:[32,32],className:"hp-mb-32",children:[(0,y.jsx)(s.Z,{span:24,children:(0,y.jsx)(c.Z,{gutter:[32,32],justify:"space-between",children:(0,y.jsx)(o.Z,{breadCrumbParent:"".concat(n.formatMessage({id:"pages"})),breadCrumbActive:"".concat(n.formatMessage({id:"pricing"}))})})}),(0,y.jsx)(s.Z,{span:24,children:(0,y.jsx)(l.Z,{className:"hp-border-color-black-40 hp-pb-sm-0 hp-pb-64",children:(0,y.jsxs)(c.Z,{children:[(0,y.jsxs)(s.Z,{span:24,children:[(0,y.jsx)("h1",{className:"hp-mb-4",children:(0,y.jsx)(i.Z,{id:"pricing-simple-flexible-plans"})}),(0,y.jsx)("p",{className:"hp-p1-body hp-mb-0",children:(0,y.jsx)(i.Z,{id:"pricing-get-your-plan-now"})})]}),(0,y.jsx)(s.Z,{span:24,children:(0,y.jsx)(g,{values:r})})]})})}),(0,y.jsx)(j.Z,{})]})}))},8164:function(e,n,r){r.d(n,{Z:function(){return k}});var t=r(7462),i=r(4942),a=r(3433),c=r(2791),s=r(1694),l=r.n(s),o=r(5501),p=r(7295),u=r(3652),d=r(3785),m=function(e,n){var r={};for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&n.indexOf(t)<0&&(r[t]=e[t]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(t=Object.getOwnPropertySymbols(e);i<t.length;i++)n.indexOf(t[i])<0&&Object.prototype.propertyIsEnumerable.call(e,t[i])&&(r[t[i]]=e[t[i]])}return r},h=function(e){var n,r,i=e.prefixCls,a=e.separator,s=void 0===a?"/":a,l=e.children,o=e.overlay,h=e.dropdownProps,b=m(e,["prefixCls","separator","children","overlay","dropdownProps"]),v=(0,c.useContext(d.E_).getPrefixCls)("breadcrumb",i);return n="href"in b?c.createElement("a",(0,t.Z)({className:"".concat(v,"-link")},b),l):c.createElement("span",(0,t.Z)({className:"".concat(v,"-link")},b),l),r=n,n=o?c.createElement(u.Z,(0,t.Z)({overlay:o,placement:"bottomCenter"},h),c.createElement("span",{className:"".concat(v,"-overlay-link")},r,c.createElement(p.Z,null))):r,l?c.createElement("span",null,n,s&&c.createElement("span",{className:"".concat(v,"-separator")},s)):null};h.__ANT_BREADCRUMB_ITEM=!0;var b=h,v=function(e){var n=e.children,r=(0,c.useContext(d.E_).getPrefixCls)("breadcrumb");return c.createElement("span",{className:"".concat(r,"-separator")},n||"/")};v.__ANT_BREADCRUMB_SEPARATOR=!0;var f=v,x=r(4333),y=r(4824),g=r(1113),Z=function(e,n){var r={};for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&n.indexOf(t)<0&&(r[t]=e[t]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(t=Object.getOwnPropertySymbols(e);i<t.length;i++)n.indexOf(t[i])<0&&Object.prototype.propertyIsEnumerable.call(e,t[i])&&(r[t[i]]=e[t[i]])}return r};function j(e,n,r,t){var i=r.indexOf(e)===r.length-1,a=function(e,n){if(!e.breadcrumbName)return null;var r=Object.keys(n).join("|");return e.breadcrumbName.replace(new RegExp(":(".concat(r,")"),"g"),(function(e,r){return n[r]||e}))}(e,n);return i?c.createElement("span",null,a):c.createElement("a",{href:"#/".concat(t.join("/"))},a)}var C=function(e,n){return e=(e||"").replace(/^\//,""),Object.keys(n).forEach((function(r){e=e.replace(":".concat(r),n[r])})),e},N=function(e){var n,r=e.prefixCls,s=e.separator,p=void 0===s?"/":s,u=e.style,m=e.className,h=e.routes,v=e.children,f=e.itemRender,N=void 0===f?j:f,k=e.params,P=void 0===k?{}:k,E=Z(e,["prefixCls","separator","style","className","routes","children","itemRender","params"]),w=c.useContext(d.E_),O=w.getPrefixCls,_=w.direction,T=O("breadcrumb",r);if(h&&h.length>0){var I=[];n=h.map((function(e){var n,r=C(e.path,P);return r&&I.push(r),e.children&&e.children.length&&(n=c.createElement(x.Z,null,e.children.map((function(e){return c.createElement(x.Z.Item,{key:e.path||e.breadcrumbName},N(e,P,h,function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",r=arguments.length>2?arguments[2]:void 0,t=(0,a.Z)(e),i=C(n,r);return i&&t.push(i),t}(I,e.path,P)))})))),c.createElement(b,{overlay:n,separator:p,key:r||e.breadcrumbName},N(e,P,h,I))}))}else v&&(n=(0,o.Z)(v).map((function(e,n){return e?((0,y.Z)(e.type&&(!0===e.type.__ANT_BREADCRUMB_ITEM||!0===e.type.__ANT_BREADCRUMB_SEPARATOR),"Breadcrumb","Only accepts Breadcrumb.Item and Breadcrumb.Separator as it's children"),(0,g.Tm)(e,{separator:p,key:n})):e})));var A=l()(T,(0,i.Z)({},"".concat(T,"-rtl"),"rtl"===_),m);return c.createElement("div",(0,t.Z)({className:A,style:u},E),n)};N.Item=b,N.Separator=f;var k=N}}]);
//# sourceMappingURL=172.209c4421.chunk.js.map