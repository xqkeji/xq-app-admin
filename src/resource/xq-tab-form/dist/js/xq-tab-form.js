/*!
 * xq-tab-form v1.0.5 (https://xqkeji.cn/demo/xq-tab-form/)
 * Author xqkeji.cn
 * LICENSE SSPL-1.0
 * Copyright 2023 xqkeji.cn
 */
 "use strict";
(() => {
  // node_modules/xq-util/dist/index.mjs
  var domReady = (callBack) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callBack);
    } else {
      callBack();
    }
  };
  var parents = (element, selector) => {
    const parents2 = [];
    let ancestor = element.parentNode;
    while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== 3) {
      if (ancestor.matches(selector)) {
        parents2.push(ancestor);
      }
      ancestor = ancestor.parentNode;
    }
    return parents2;
  };

  // src/ts/xq-tab-form.ts
  var XQ_TAB_FORM_CLASS = ".xq-tab-form";
  var xqTabForm = () => {
    let is_first = true;
    const tab_form = document.querySelector(XQ_TAB_FORM_CLASS);
    if (tab_form) {
      const submit = tab_form.querySelector("input[type=submit]");
      submit.addEventListener("click", () => {
        is_first = true;
      });
      const elements = tab_form.elements;
      for (const element of elements) {
        element.addEventListener("invalid", (event) => {
          if (is_first) {
            const target = event.currentTarget;
            const tab_pane = parents(target, ".tab-pane")[0];
            if (window.getComputedStyle(tab_pane).display === "none") {
              const tab_id = tab_pane.getAttribute("aria-labelledby");
              const el = document.querySelector("#" + tab_id);
              const tab = new bootstrap.Tab(el);
              tab.show();
              el.addEventListener("shown.bs.tab", () => {
                target.reportValidity();
              });
            }
            is_first = false;
          }
        });
      }
    }
  };
  var xq_tab_form_default = xqTabForm;

  // src/ts/index.ts
  domReady(() => {
    xq_tab_form_default();
  });
})();
/*! Bundled license information:

xq-util/dist/index.mjs:
  (*!
   * xq-util v1.0.1 (http://xqkeji.cn/)
   * Author xqkeji.cn
   * LICENSE SSPL-1.0
   * Copyright 2023 xqkeji.cn
   *)
*/
