/*!
 * xq-tab-form v1.0.5 (https://xqkeji.cn/demo/xq-tab-form/)
 * Author xqkeji.cn
 * LICENSE SSPL-1.0
 * Copyright 2023 xqkeji.cn
 */
 'use strict';

const xqUtil = require('xq-util');

const XQ_TAB_FORM_CLASS = ".xq-tab-form";
const xqTabForm = () => {
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
          const tab_pane = xqUtil.parents(target, ".tab-pane")[0];
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

xqUtil.domReady(() => {
  xqTabForm();
});
