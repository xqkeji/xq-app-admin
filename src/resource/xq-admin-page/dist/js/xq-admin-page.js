/*!
 * xq-admin-page v1.0.4 (https://xqkeji.cn/demo/xq-admin-page)
 * Author xqkeji.cn
 * LICENSE SSPL-1.0
 * Copyright 2023 xqkeji.cn
 */
 "use strict";
(() => {
  // src/ts/xq-option.ts
  var DEFAULT_OPTIONS = {
    tableClass: ".xq-table",
    dragClass: ".xq-drag",
    checkAllClass: ".xq-table .xq-check-all",
    addBtnClass: ".xq-table .xq-add",
    editBtnClass: ".xq-edit",
    viewBtnClass: ".xq-view",
    deleteBtnClass: ".xq-delete",
    copyBtnClass: ".xq-copy",
    batchBtnClass: ".xq-batch",
    backPageClass: ".xq-backpage",
    authTableClass: ".xq-auth-table",
    authCheckTableClass: ".xq-auth-check-table",
    authCheckRowClass: ".xq-auth-check-row",
    captchaClass: ".xq-captcha"
  };
  var tablelistOptions = {};
  var setOption = (options = {}) => {
    tablelistOptions = Object.assign({}, DEFAULT_OPTIONS);
    if (options) {
      for (const option in options) {
        if (Object.hasOwn(tablelistOptions, option)) {
          treegridOptions[option] = options[option];
        }
      }
    }
  };
  var getOption = (key) => {
    if (key in tablelistOptions) {
      return tablelistOptions[key];
    }
    const tableClass = tablelistOptions["tableClass"];
    const table2 = document.querySelector(tableClass);
    if (table2.hasAttribute(key)) {
      return String(table2.getAttribute(key));
    }
    return "";
  };

  // src/ts/xq-table.ts
  var table;
  var getTable = () => {
    if (table) {
      return table;
    } else {
      const tableClass = getOption("tableClass");
      const container = document.querySelector(tableClass);
      table = container;
      return table;
    }
  };

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
  var next = (element, selector) => {
    let next2 = element.nextElementSibling;
    while (next2) {
      if (next2.matches(selector)) {
        return [next2];
      }
      next2 = next2.nextElementSibling;
    }
    return [];
  };
  var append = (element, dom) => {
    const node = document.createRange().createContextualFragment(dom);
    element.append(node);
  };
  var jsonFormData = (form) => {
    const object = {};
    const formData = new FormData(form);
    for (const item of formData) {
      const top_key = item[0];
      if (top_key.includes("[")) {
        const key1 = top_key.slice(0, Math.max(0, top_key.indexOf("[")));
        const key2 = top_key.slice(top_key.indexOf("[") + 1, top_key.indexOf("]"));
        const data = {};
        data[key2] = item[1];
        if (object[key1]) {
          const tmp = object[key1];
          tmp[key2] = item[1];
          object[key1] = tmp;
        } else {
          object[key1] = data;
        }
      } else {
        object[item[0]] = item[1];
      }
    }
    return object;
  };

  // src/ts/xq-add.ts
  var bindAdd = () => {
    const addBtnClass = getOption("addBtnClass");
    const add_btn = document.querySelector(addBtnClass);
    if (add_btn) {
      add_btn.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const table2 = parents(target, "table")[0];
        const pid = table2.getAttribute("pid");
        let url = target.getAttribute("xq-url");
        if (!url) {
          url = window.location.href;
          if (url.includes(".html") || url.includes("localhost")) {
            url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
            url += "/add.html";
          } else {
            if (pid) {
              url = url.replace("/" + pid, "");
            }
            url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
            url += pid ? "/add/" + pid : "/add";
          }
        }
        window.location.href = url;
      });
    }
  };

  // node_modules/xq-confirm/dist/index.mjs
  var template = '<div id="xq-bs-modal" class="modal" tabindex="-1" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title"><i></i><span>title</span></h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><p>Modal content.</p></div><div class="modal-footer"></div></div></div></div>';
  var DEFAULT_OPTIONS2 = {
    id: "xq-bs-modal",
    type: "alert",
    size: "modal-sm",
    position: "modal-dialog-centered",
    template,
    title: "\u63D0\u793A\u4FE1\u606F",
    content: "\u60A8\u786E\u8BA4\u8981\u8FDB\u884C\u64CD\u4F5C\u5417?",
    icon: "info",
    confirmButton: "\u786E\u8BA4",
    cancelButton: "\u53D6\u6D88",
    confirmButtonClass: "btn-primary",
    cancelButtonClass: "btn-secondary",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    confirm: () => {
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    cancel: () => {
    },
    backgroundDismiss: true,
    autoClose: false
    // confirm|3000表示3秒后自动确认，cancel|3000表示3秒后自动取消
  };
  var confirmOptions = {};
  var setOption2 = (options = {}) => {
    confirmOptions = Object.assign({}, DEFAULT_OPTIONS2);
    if (options) {
      for (const option in options) {
        if (Object.prototype.hasOwnProperty.call(confirmOptions, option)) {
          confirmOptions[option] = options[option];
        }
      }
    }
  };
  var getOption2 = (key) => {
    if (key in confirmOptions) {
      return confirmOptions[key];
    }
    const id = confirmOptions["id"];
    const modal = document.querySelector("#" + id);
    if (modal.hasAttribute(key)) {
      return String(modal.getAttribute(key));
    }
    return "";
  };
  var ICONS = {
    info: "bi bi-info-circle-fill link-primary",
    warn: "bi bi-info-circle-fill link-warning",
    error: "bi bi-info-circle-fill link-danger"
  };
  var getIcon = (icon) => {
    if (Object.prototype.hasOwnProperty.call(ICONS, icon)) {
      return ICONS[icon];
    } else {
      return icon;
    }
  };
  var build = (options = {}) => {
    setOption2(options);
    const template2 = getOption2("template");
    append(document.body, template2);
    const id = getOption2("id");
    const xq_bs_modal = document.querySelector("#" + id);
    if (xq_bs_modal) {
      const xq_modal_dialog = xq_bs_modal.querySelector(".modal-dialog");
      const size = getOption2("size");
      const position = getOption2("position");
      xq_modal_dialog.classList.add(size);
      xq_modal_dialog.classList.add(position);
      const title_icon = xq_bs_modal.querySelector(".modal-title>i");
      const title_content = xq_bs_modal.querySelector(".modal-title>span");
      const body_content = xq_bs_modal.querySelector(".modal-body>p");
      if (title_icon) {
        const icon = getOption2("icon");
        const iconClass = getIcon(icon);
        title_icon.className = iconClass;
      }
      if (title_content) {
        const title = getOption2("title");
        title_content.innerHTML = title;
      }
      if (body_content) {
        const content = getOption2("content");
        body_content.innerHTML = content;
      }
      if (typeof bootstrap !== void 0 && typeof bootstrap.Modal !== void 0) {
        const xqModal = new bootstrap.Modal(xq_bs_modal);
        const footer = document.querySelector(".modal-footer");
        if (footer) {
          const type = getOption2("type");
          if (type !== "alert") {
            const cancelButtonClass = getOption2("cancelButtonClass");
            const cancelButton = getOption2("cancelButton");
            append(footer, '<button id="xq-bs-modal-cancel" type="button" class="btn ' + cancelButtonClass + '" data-bs-dismiss="modal">' + cancelButton + "</button>");
            const cancel = footer.querySelector("#xq-bs-modal-cancel");
            cancel?.addEventListener("click", (event) => {
              event.preventDefault();
              xqModal.hide();
              const cancel2 = getOption2("cancel");
              if (cancel2 !== null) {
                cancel2();
              }
            });
          }
          const confirmButtonClass = getOption2("confirmButtonClass");
          const confirmButton = getOption2("confirmButton");
          append(footer, '<button id="xq-bs-modal-confirm" type="button" class="btn ' + confirmButtonClass + '">' + confirmButton + "</button>");
          const confirm = footer.querySelector("#xq-bs-modal-confirm");
          confirm?.addEventListener("click", (event) => {
            event.preventDefault();
            xqModal.hide();
            const confirm2 = getOption2("confirm");
            if (confirm2 !== null) {
              confirm2();
            }
          });
        }
        xq_bs_modal.addEventListener("hidden.bs.modal", () => {
          xqModal.dispose();
          xq_bs_modal.remove();
        });
        const autoClose = getOption2("autoClose");
        if (autoClose) {
          const close = autoClose;
          if (close.indexOf("|")) {
            const closeArr = close.split("|");
            const btn = closeArr[0];
            const timer = Number.parseInt(closeArr[1], 10);
            let autoCloseInterval;
            let autoCloseBtn;
            let seconds = Math.ceil(timer / 1e3);
            const countdown = '<span class="countdown"> (' + seconds + ")</span>";
            if (btn === "confirm") {
              autoCloseBtn = footer.querySelector("#xq-bs-modal-confirm");
              append(autoCloseBtn, countdown);
            } else {
              autoCloseBtn = footer.querySelector("#xq-bs-modal-cancel");
              append(autoCloseBtn, countdown);
            }
            xq_bs_modal.addEventListener("show.bs.modal", () => {
              autoCloseInterval = setInterval(function() {
                const countdown2 = autoCloseBtn.querySelector(".countdown");
                seconds = seconds - 1;
                countdown2.innerHTML = " (" + seconds + ") ";
                if (seconds <= 0) {
                  clearInterval(autoCloseInterval);
                  autoCloseBtn.click();
                }
              }, 1e3);
            });
          }
        }
        xqModal.show();
      } else {
        console.log("error", "the bootstrap not loaded!");
      }
    }
  };
  var xqConfirm = (options = {}) => {
    build(options);
  };
  window.xqConfirm = xqConfirm;

  // src/ts/xq-edit.ts
  var bindEdit = (element) => {
    const editBtnClass = getOption("editBtnClass");
    const edit_btn = element.querySelector(editBtnClass);
    if (edit_btn) {
      edit_btn.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const table2 = getTable();
        const pid = table2?.getAttribute("pid");
        let id = element.getAttribute("id");
        id = id.replace("xq_", "");
        if (id) {
          let url = target.getAttribute("xq-url");
          if (!url) {
            url = window.location.href;
            if (url.includes(".html") || url.endsWith("/")) {
              url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
              url = url + "/edit.html?id=" + id;
            } else {
              if (pid) {
                url = url.replace("/" + pid, "");
              }
              url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
              url = url + "/edit/" + id;
            }
          }
          window.location.href = url;
        } else {
          xqConfirm({
            content: "\u627E\u4E0D\u5230tr\u7684id\u5C5E\u6027\uFF01"
          });
        }
      });
    }
  };

  // src/ts/xq-view.ts
  var bindView = (element) => {
    const viewBtnClass = getOption("viewBtnClass");
    const view_btn = element.querySelector(viewBtnClass);
    if (view_btn) {
      view_btn.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const table2 = getTable();
        const pid = table2?.getAttribute("pid");
        let id = element.getAttribute("id");
        id = id.replace("xq_", "");
        if (id) {
          let url = target.getAttribute("xq-url");
          if (!url) {
            url = window.location.href;
            if (url.includes(".html") || url.endsWith("/")) {
              url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
              url = url + "/view.html?id=" + id;
            } else {
              if (pid) {
                url = url.replace("/" + pid, "");
              }
              url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
              url = url + "/view/" + id;
            }
          }
          window.location.href = url;
        } else {
          xqConfirm({
            content: "\u627E\u4E0D\u5230tr\u7684id\u5C5E\u6027\uFF01"
          });
        }
      });
    }
  };

  // src/ts/xq-copy.ts
  var copy = (text) => {
    const el = document.createElement("input");
    el.setAttribute("value", text);
    document.body.append(el);
    el.select();
    document.execCommand("copy");
    el.remove();
  };
  var bindCopy = (element) => {
    const copyBtnClass = getOption("copyBtnClass");
    const copy_btn = element.querySelector(copyBtnClass);
    if (copy_btn) {
      copy_btn.addEventListener("click", () => {
        let id = element.getAttribute("id");
        id = id.replace("xq_", "");
        if (id) {
          copy(id);
          xqConfirm({
            content: "\u5DF2\u7ECF\u5C06id\u590D\u5236\u5230\u7C98\u8D34\u677F"
          });
        }
      });
    }
  };

  // src/ts/xq-delete.ts
  var bindDelete = (element) => {
    const deleteBtnClass = getOption("deleteBtnClass");
    const delete_btn = element.querySelector(deleteBtnClass);
    if (delete_btn) {
      delete_btn.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const table2 = getTable();
        const pid = table2?.getAttribute("pid");
        let id = element.getAttribute("id");
        id = id.replace("xq_", "");
        if (id) {
          let url = target.getAttribute("xq-url");
          if (!url) {
            url = window.location.href;
            if (pid) {
              url = url.replace("/" + pid, "");
            }
            url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
            url += "/delete";
          }
          xqConfirm({
            content: "\u786E\u5B9A\u8981\u5220\u9664\u5417\uFF1F",
            confirm() {
              fetch(url, {
                body: JSON.stringify({ id }),
                headers: {
                  "content-type": "application/json"
                },
                method: "POST"
              }).then(async (response) => {
                return response.json();
              }).then((data) => {
                xqConfirm({
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                  content: data.message,
                  confirm() {
                    if (data.code === 200) {
                      window.location.reload();
                    }
                  }
                });
              });
            }
          });
        } else {
          xqConfirm({
            content: "\u627E\u4E0D\u5230tr\u7684id\u5C5E\u6027\uFF01"
          });
        }
      });
    }
  };

  // src/ts/xq-change.ts
  var bindChange = (element) => {
    const table2 = getTable();
    let id = element.getAttribute("id");
    id = id?.replace("xq_", "");
    const textes = element.querySelectorAll("input,select");
    for (const text of textes) {
      const elementId = text.getAttribute("id");
      if (elementId !== "id" && elementId !== "check_all") {
        text.addEventListener("change", (event) => {
          const targetElement = event.currentTarget;
          let value = null;
          value = targetElement.type === "checkbox" ? targetElement.checked : targetElement.value;
          const target_id = targetElement.getAttribute("id");
          const field = target_id?.slice(0, Math.max(0, target_id.indexOf("_")));
          const pid = table2?.getAttribute("pid");
          let xq_url = table2?.getAttribute("xq-url");
          const data = { id, field, value };
          if (!xq_url) {
            let url = window.location.href;
            if (pid) {
              url = url.replace("/" + pid, "");
            }
            url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
            url += "/change";
            xq_url = url;
          } else {
            xq_url += "/change";
          }
          fetch(xq_url, {
            body: JSON.stringify(data),
            headers: {
              "content-type": "application/json"
            },
            method: "POST"
          }).then(async (response) => {
            return response.json();
          }).then((data2) => {
            console.log(data2);
          });
        });
      }
    }
  };

  // src/ts/xq-batch.ts
  var bindBatch = () => {
    const batchBtnClass = getOption("batchBtnClass");
    const batch_btns = document.querySelectorAll(batchBtnClass);
    if (batch_btns) {
      for (const batch_btn of batch_btns) {
        batch_btn.addEventListener("click", (event) => {
          const target = event.currentTarget;
          const table2 = parents(target, "table")[0];
          const pid = table2.getAttribute("pid");
          const formObject = parents(target, "form")[0];
          const action = target.getAttribute("name");
          if (action) {
            let url = target.getAttribute("xq-url");
            if (!url) {
              url = window.location.href;
              if (pid) {
                url = url.replace("/" + pid, "");
              }
              url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
              url = url + "/" + action;
            }
            const formData = jsonFormData(formObject);
            const jsonData = JSON.stringify(formData);
            if (jsonData !== "{}") {
              xqConfirm({
                content: "\u786E\u5B9A\u8981\u8FDB\u884C\u6279\u91CF\u64CD\u4F5C\u5417\uFF1F",
                confirm() {
                  fetch(url, {
                    body: jsonData,
                    headers: {
                      "content-type": "application/json"
                    },
                    method: "POST"
                  }).then(async (response) => {
                    return response.json();
                  }).then((data) => {
                    xqConfirm({
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                      content: data.message,
                      confirm() {
                        if (data.code === 200) {
                          window.location.reload();
                        }
                      }
                    });
                  });
                }
              });
            } else {
              xqConfirm({
                content: "\u6CA1\u6709\u9009\u62E9\u64CD\u4F5C\u6570\u636E."
              });
            }
          }
        });
      }
    }
  };

  // node_modules/xq-html5sortable/dist/index.mjs
  function addData(element, key, value) {
    if (value === void 0) {
      return element && element.h5s && element.h5s.data && element.h5s.data[key];
    } else {
      element.h5s = element.h5s || {};
      element.h5s.data = element.h5s.data || {};
      element.h5s.data[key] = value;
    }
  }
  function removeData(element) {
    if (element.h5s) {
      delete element.h5s.data;
    }
  }
  var filter = (nodes, selector) => {
    if (!(nodes instanceof NodeList || nodes instanceof HTMLCollection || nodes instanceof Array)) {
      throw new Error("You must provide a nodeList/HTMLCollection/Array of elements to be filtered.");
    }
    if (typeof selector !== "string") {
      return Array.from(nodes);
    }
    return Array.from(nodes).filter((item) => item.nodeType === 1 && item.matches(selector));
  };
  var stores = /* @__PURE__ */ new Map();
  var Store = class {
    constructor() {
      this._config = /* @__PURE__ */ new Map();
      this._placeholder = void 0;
      this._data = /* @__PURE__ */ new Map();
    }
    set config(config) {
      if (typeof config !== "object") {
        throw new Error("You must provide a valid configuration object to the config setter.");
      }
      const mergedConfig = Object.assign({}, config);
      this._config = new Map(Object.entries(mergedConfig));
    }
    get config() {
      const config = {};
      this._config.forEach((value, key) => {
        config[key] = value;
      });
      return config;
    }
    setConfig(key, value) {
      if (!this._config.has(key)) {
        throw new Error(`Trying to set invalid configuration item: ${key}`);
      }
      this._config.set(key, value);
    }
    getConfig(key) {
      if (!this._config.has(key)) {
        throw new Error(`Invalid configuration item requested: ${key}`);
      }
      return this._config.get(key);
    }
    get placeholder() {
      return this._placeholder;
    }
    set placeholder(placeholder) {
      if (!(placeholder instanceof HTMLElement) && placeholder !== null) {
        throw new Error("A placeholder must be an html element or null.");
      }
      this._placeholder = placeholder;
    }
    setData(key, value) {
      if (typeof key !== "string") {
        throw new Error("The key must be a string.");
      }
      this._data.set(key, value);
    }
    getData(key) {
      if (typeof key !== "string") {
        throw new Error("The key must be a string.");
      }
      return this._data.get(key);
    }
    deleteData(key) {
      if (typeof key !== "string") {
        throw new Error("The key must be a string.");
      }
      return this._data.delete(key);
    }
  };
  var store = (sortableElement) => {
    if (!(sortableElement instanceof HTMLElement)) {
      throw new Error("Please provide a sortable to the store function.");
    }
    if (!stores.has(sortableElement)) {
      stores.set(sortableElement, new Store());
    }
    return stores.get(sortableElement);
  };
  function addEventListener(element, eventName, callback) {
    if (element instanceof Array) {
      for (let i = 0; i < element.length; ++i) {
        addEventListener(element[i], eventName, callback);
      }
      return;
    }
    element.addEventListener(eventName, callback);
    store(element).setData(`event${eventName}`, callback);
  }
  function removeEventListener(element, eventName) {
    if (element instanceof Array) {
      for (let i = 0; i < element.length; ++i) {
        removeEventListener(element[i], eventName);
      }
      return;
    }
    element.removeEventListener(eventName, store(element).getData(`event${eventName}`));
    store(element).deleteData(`event${eventName}`);
  }
  function addAttribute(element, attribute, value) {
    if (element instanceof Array) {
      for (let i = 0; i < element.length; ++i) {
        addAttribute(element[i], attribute, value);
      }
      return;
    }
    element.setAttribute(attribute, value);
  }
  function removeAttribute(element, attribute) {
    if (element instanceof Array) {
      for (let i = 0; i < element.length; ++i) {
        removeAttribute(element[i], attribute);
      }
      return;
    }
    element.removeAttribute(attribute);
  }
  var offset = (element) => {
    if (!element.parentElement || element.getClientRects().length === 0) {
      throw new Error("target element must be part of the dom");
    }
    const rect = element.getClientRects()[0];
    return {
      left: rect.left + window.pageXOffset,
      right: rect.right + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      bottom: rect.bottom + window.pageYOffset
    };
  };
  var debounce = (func, wait = 0) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  };
  var getIndex = (element, elementList) => {
    if (!(element instanceof HTMLElement) || !(elementList instanceof NodeList || elementList instanceof HTMLCollection || elementList instanceof Array)) {
      throw new Error("You must provide an element and a list of elements.");
    }
    return Array.from(elementList).indexOf(element);
  };
  var isInDom = (element) => {
    if (!(element instanceof HTMLElement)) {
      throw new Error("Element is not a node element.");
    }
    return element.parentNode !== null;
  };
  var insertNode = (referenceNode, newElement, position) => {
    if (!(referenceNode instanceof HTMLElement) || !(referenceNode.parentElement instanceof HTMLElement)) {
      throw new Error("target and element must be a node");
    }
    referenceNode.parentElement.insertBefore(
      newElement,
      position === "before" ? referenceNode : referenceNode.nextElementSibling
    );
  };
  var insertBefore = (target, element) => insertNode(target, element, "before");
  var insertAfter = (target, element) => insertNode(target, element, "after");
  var serialize = (sortableContainer, customItemSerializer = (serializedItem, sortableContainer2) => serializedItem, customContainerSerializer = (serializedContainer) => serializedContainer) => {
    if (!(sortableContainer instanceof HTMLElement) || !sortableContainer.isSortable === true) {
      throw new Error("You need to provide a sortableContainer to be serialized.");
    }
    if (typeof customItemSerializer !== "function" || typeof customContainerSerializer !== "function") {
      throw new Error("You need to provide a valid serializer for items and the container.");
    }
    const options = addData(sortableContainer, "opts");
    const item = options.items;
    const items = filter(sortableContainer.children, item);
    const serializedItems = items.map((item2) => {
      return {
        parent: sortableContainer,
        node: item2,
        html: item2.outerHTML,
        index: getIndex(item2, items)
      };
    });
    const container = {
      node: sortableContainer,
      itemCount: serializedItems.length
    };
    return {
      container: customContainerSerializer(container),
      items: serializedItems.map((item2) => customItemSerializer(item2, sortableContainer))
    };
  };
  var makePlaceholder = (sortableElement, placeholder, placeholderClass = "sortable-placeholder") => {
    if (!(sortableElement instanceof HTMLElement)) {
      throw new Error("You must provide a valid element as a sortable.");
    }
    if (!(placeholder instanceof HTMLElement) && placeholder !== void 0) {
      throw new Error("You must provide a valid element as a placeholder or set ot to undefined.");
    }
    if (placeholder === void 0) {
      if (["UL", "OL"].includes(sortableElement.tagName)) {
        placeholder = document.createElement("li");
      } else if (["TABLE", "TBODY"].includes(sortableElement.tagName)) {
        placeholder = document.createElement("tr");
        placeholder.innerHTML = '<td colspan="100"></td>';
      } else {
        placeholder = document.createElement("div");
      }
    }
    if (typeof placeholderClass === "string") {
      placeholder.classList.add(...placeholderClass.split(" "));
    }
    return placeholder;
  };
  var getElementHeight = (element) => {
    if (!(element instanceof HTMLElement)) {
      throw new Error("You must provide a valid dom element");
    }
    const style = window.getComputedStyle(element);
    if (style.getPropertyValue("box-sizing") === "border-box") {
      return parseInt(style.getPropertyValue("height"), 10);
    }
    return ["height", "padding-top", "padding-bottom"].map((key) => {
      const int = parseInt(style.getPropertyValue(key), 10);
      return isNaN(int) ? 0 : int;
    }).reduce((sum, value) => sum + value);
  };
  var getElementWidth = (element) => {
    if (!(element instanceof HTMLElement)) {
      throw new Error("You must provide a valid dom element");
    }
    const style = window.getComputedStyle(element);
    return ["width", "padding-left", "padding-right"].map((key) => {
      const int = parseInt(style.getPropertyValue(key), 10);
      return isNaN(int) ? 0 : int;
    }).reduce((sum, value) => sum + value);
  };
  var getHandles = (items, selector) => {
    if (!(items instanceof Array)) {
      throw new Error("You must provide a Array of HTMLElements to be filtered.");
    }
    if (typeof selector !== "string") {
      return items;
    }
    return items.filter((item) => {
      return item.querySelector(selector) instanceof HTMLElement || item.shadowRoot && item.shadowRoot.querySelector(selector) instanceof HTMLElement;
    }).map((item) => {
      return item.querySelector(selector) || item.shadowRoot && item.shadowRoot.querySelector(selector);
    });
  };
  var getEventTarget = (event) => {
    return event.composedPath && event.composedPath()[0] || event.target;
  };
  var defaultDragImage = (draggedElement, elementOffset, event) => {
    return {
      element: draggedElement,
      posX: event.pageX - elementOffset.left,
      posY: event.pageY - elementOffset.top
    };
  };
  var setDragImage = (event, draggedElement, customDragImage) => {
    if (!(event instanceof Event)) {
      throw new Error("setDragImage requires a DragEvent as the first argument.");
    }
    if (!(draggedElement instanceof HTMLElement)) {
      throw new Error("setDragImage requires the dragged element as the second argument.");
    }
    if (!customDragImage) {
      customDragImage = defaultDragImage;
    }
    if (event.dataTransfer && event.dataTransfer.setDragImage) {
      const elementOffset = offset(draggedElement);
      const dragImage = customDragImage(draggedElement, elementOffset, event);
      if (!(dragImage.element instanceof HTMLElement) || typeof dragImage.posX !== "number" || typeof dragImage.posY !== "number") {
        throw new Error("The customDragImage function you provided must return and object with the properties element[string], posX[integer], posY[integer].");
      }
      event.dataTransfer.effectAllowed = "copyMove";
      event.dataTransfer.setData("text/plain", getEventTarget(event).id);
      event.dataTransfer.setDragImage(dragImage.element, dragImage.posX, dragImage.posY);
    }
  };
  var listsConnected = (destination, origin) => {
    if (destination.isSortable === true) {
      const acceptFrom = store(destination).getConfig("acceptFrom");
      if (acceptFrom !== null && acceptFrom !== false && typeof acceptFrom !== "string") {
        throw new Error('HTML5Sortable: Wrong argument, "acceptFrom" must be "null", "false", or a valid selector string.');
      }
      if (acceptFrom !== null) {
        return acceptFrom !== false && acceptFrom.split(",").filter(function(sel) {
          return sel.length > 0 && origin.matches(sel);
        }).length > 0;
      }
      if (destination === origin) {
        return true;
      }
      if (store(destination).getConfig("connectWith") !== void 0 && store(destination).getConfig("connectWith") !== null) {
        return store(destination).getConfig("connectWith") === store(origin).getConfig("connectWith");
      }
    }
    return false;
  };
  var defaultConfiguration = {
    items: null,
    connectWith: null,
    disableIEFix: null,
    acceptFrom: null,
    copy: false,
    placeholder: null,
    placeholderClass: "sortable-placeholder",
    draggingClass: "sortable-dragging",
    hoverClass: false,
    dropTargetContainerClass: false,
    debounce: 0,
    throttleTime: 100,
    maxItems: 0,
    itemSerializer: void 0,
    containerSerializer: void 0,
    customDragImage: null,
    orientation: "vertical"
  };
  function throttle(fn, threshold = 250) {
    if (typeof fn !== "function") {
      throw new Error("You must provide a function as the first argument for throttle.");
    }
    if (typeof threshold !== "number") {
      throw new Error("You must provide a number as the second argument for throttle.");
    }
    let lastEventTimestamp = null;
    return (...args) => {
      const now = Date.now();
      if (lastEventTimestamp === null || now - lastEventTimestamp >= threshold) {
        lastEventTimestamp = now;
        fn.apply(this, args);
      }
    };
  }
  var enableHoverClass = (sortableContainer, enable) => {
    if (typeof store(sortableContainer).getConfig("hoverClass") === "string") {
      const hoverClasses = store(sortableContainer).getConfig("hoverClass").split(" ");
      if (enable === true) {
        addEventListener(sortableContainer, "mousemove", throttle((event) => {
          if (event.buttons === 0) {
            filter(sortableContainer.children, store(sortableContainer).getConfig("items")).forEach((item) => {
              if (item === event.target || item.contains(event.target)) {
                item.classList.add(...hoverClasses);
              } else {
                item.classList.remove(...hoverClasses);
              }
            });
          }
        }, store(sortableContainer).getConfig("throttleTime")));
        addEventListener(sortableContainer, "mouseleave", () => {
          filter(sortableContainer.children, store(sortableContainer).getConfig("items")).forEach((item) => {
            item.classList.remove(...hoverClasses);
          });
        });
      } else {
        removeEventListener(sortableContainer, "mousemove");
        removeEventListener(sortableContainer, "mouseleave");
      }
    }
  };
  var dragging;
  var draggingHeight;
  var draggingWidth;
  var originContainer;
  var originIndex;
  var originElementIndex;
  var originItemsBeforeUpdate;
  var previousContainer;
  var destinationItemsBeforeUpdate;
  var removeItemEvents = function(items) {
    removeEventListener(items, "dragstart");
    removeEventListener(items, "dragend");
    removeEventListener(items, "dragover");
    removeEventListener(items, "dragenter");
    removeEventListener(items, "drop");
    removeEventListener(items, "mouseenter");
    removeEventListener(items, "mouseleave");
  };
  var removeContainerEvents = function(originContainer2, previousContainer2) {
    if (originContainer2) {
      removeEventListener(originContainer2, "dragleave");
    }
    if (previousContainer2 && previousContainer2 !== originContainer2) {
      removeEventListener(previousContainer2, "dragleave");
    }
  };
  var getDragging = function(draggedItem, sortable2) {
    let ditem = draggedItem;
    if (store(sortable2).getConfig("copy") === true) {
      ditem = draggedItem.cloneNode(true);
      addAttribute(ditem, "aria-copied", "true");
      draggedItem.parentElement.appendChild(ditem);
      ditem.style.display = "none";
      ditem.oldDisplay = draggedItem.style.display;
    }
    return ditem;
  };
  var removeSortableData = function(sortable2) {
    removeData(sortable2);
    removeAttribute(sortable2, "aria-dropeffect");
  };
  var removeItemData = function(items) {
    removeAttribute(items, "aria-grabbed");
    removeAttribute(items, "aria-copied");
    removeAttribute(items, "draggable");
    removeAttribute(items, "role");
  };
  function findSortable(element, event) {
    if (event.composedPath) {
      return event.composedPath().find((el) => el.isSortable);
    }
    while (element.isSortable !== true) {
      element = element.parentElement;
    }
    return element;
  }
  function findDragElement(sortableElement, element) {
    const options = addData(sortableElement, "opts");
    const items = filter(sortableElement.children, options.items);
    const itemlist = items.filter(function(ele) {
      return ele.contains(element) || ele.shadowRoot && ele.shadowRoot.contains(element);
    });
    return itemlist.length > 0 ? itemlist[0] : element;
  }
  var destroySortable = function(sortableElement) {
    const opts = addData(sortableElement, "opts") || {};
    const items = filter(sortableElement.children, opts.items);
    const handles = getHandles(items, opts.handle);
    enableHoverClass(sortableElement, false);
    removeEventListener(sortableElement, "dragover");
    removeEventListener(sortableElement, "dragenter");
    removeEventListener(sortableElement, "dragstart");
    removeEventListener(sortableElement, "dragend");
    removeEventListener(sortableElement, "drop");
    removeSortableData(sortableElement);
    removeEventListener(handles, "mousedown");
    removeItemEvents(items);
    removeItemData(items);
    removeContainerEvents(originContainer, previousContainer);
    sortableElement.isSortable = false;
  };
  var enableSortable = function(sortableElement) {
    const opts = addData(sortableElement, "opts");
    const items = filter(sortableElement.children, opts.items);
    const handles = getHandles(items, opts.handle);
    addAttribute(sortableElement, "aria-dropeffect", "move");
    addData(sortableElement, "_disabled", "false");
    addAttribute(handles, "draggable", "true");
    enableHoverClass(sortableElement, true);
    if (opts.disableIEFix === false) {
      const spanEl = (document || window.document).createElement("span");
      if (typeof spanEl.dragDrop === "function") {
        addEventListener(handles, "mousedown", function() {
          if (items.indexOf(this) !== -1) {
            this.dragDrop();
          } else {
            let parent = this.parentElement;
            while (items.indexOf(parent) === -1) {
              parent = parent.parentElement;
            }
            parent.dragDrop();
          }
        });
      }
    }
  };
  var disableSortable = function(sortableElement) {
    const opts = addData(sortableElement, "opts");
    const items = filter(sortableElement.children, opts.items);
    const handles = getHandles(items, opts.handle);
    addAttribute(sortableElement, "aria-dropeffect", "none");
    addData(sortableElement, "_disabled", "true");
    addAttribute(handles, "draggable", "false");
    removeEventListener(handles, "mousedown");
    enableHoverClass(sortableElement, false);
  };
  var reloadSortable = function(sortableElement) {
    const opts = addData(sortableElement, "opts");
    const items = filter(sortableElement.children, opts.items);
    const handles = getHandles(items, opts.handle);
    addData(sortableElement, "_disabled", "false");
    removeItemEvents(items);
    removeContainerEvents(originContainer, previousContainer);
    removeEventListener(handles, "mousedown");
    removeEventListener(sortableElement, "dragover");
    removeEventListener(sortableElement, "dragenter");
    removeEventListener(sortableElement, "drop");
  };
  function sortable(sortableElements, options) {
    const method = String(options);
    options = options || {};
    if (typeof sortableElements === "string") {
      sortableElements = document.querySelectorAll(sortableElements);
    }
    if (sortableElements instanceof HTMLElement) {
      sortableElements = [sortableElements];
    }
    sortableElements = Array.prototype.slice.call(sortableElements);
    if (/serialize/.test(method)) {
      return sortableElements.map((sortableContainer) => {
        const opts = addData(sortableContainer, "opts");
        return serialize(sortableContainer, opts.itemSerializer, opts.containerSerializer);
      });
    }
    sortableElements.forEach(function(sortableElement) {
      if (/enable|disable|destroy/.test(method)) {
        return sortable[method](sortableElement);
      }
      ["connectWith", "disableIEFix"].forEach((configKey) => {
        if (Object.prototype.hasOwnProperty.call(options, configKey) && options[configKey] !== null) {
          console.warn(`HTML5Sortable: You are using the deprecated configuration "${configKey}". This will be removed in an upcoming version, make sure to migrate to the new options when updating.`);
        }
      });
      options = Object.assign({}, defaultConfiguration, store(sortableElement).config, options);
      store(sortableElement).config = options;
      addData(sortableElement, "opts", options);
      sortableElement.isSortable = true;
      reloadSortable(sortableElement);
      const listItems = filter(sortableElement.children, options.items);
      let customPlaceholder;
      if (options.placeholder !== null && options.placeholder !== void 0) {
        const tempContainer = document.createElement(sortableElement.tagName);
        if (options.placeholder instanceof HTMLElement) {
          tempContainer.appendChild(options.placeholder);
        } else {
          tempContainer.innerHTML = options.placeholder;
        }
        customPlaceholder = tempContainer.children[0];
      }
      store(sortableElement).placeholder = makePlaceholder(sortableElement, customPlaceholder, options.placeholderClass);
      addData(sortableElement, "items", options.items);
      if (options.acceptFrom) {
        addData(sortableElement, "acceptFrom", options.acceptFrom);
      } else if (options.connectWith) {
        addData(sortableElement, "connectWith", options.connectWith);
      }
      enableSortable(sortableElement);
      addAttribute(listItems, "role", "option");
      addAttribute(listItems, "aria-grabbed", "false");
      addEventListener(sortableElement, "dragstart", function(e) {
        const target = getEventTarget(e);
        if (target.isSortable === true) {
          return;
        }
        e.stopImmediatePropagation();
        if (options.handle && !target.matches(options.handle) || target.getAttribute("draggable") === "false") {
          return;
        }
        const sortableContainer = findSortable(target, e);
        const dragItem = findDragElement(sortableContainer, target);
        originItemsBeforeUpdate = filter(sortableContainer.children, options.items);
        originIndex = originItemsBeforeUpdate.indexOf(dragItem);
        originElementIndex = getIndex(dragItem, sortableContainer.children);
        originContainer = sortableContainer;
        setDragImage(e, dragItem, options.customDragImage);
        draggingHeight = getElementHeight(dragItem);
        draggingWidth = getElementWidth(dragItem);
        dragItem.classList.add(options.draggingClass);
        dragging = getDragging(dragItem, sortableContainer);
        addAttribute(dragging, "aria-grabbed", "true");
        sortableContainer.dispatchEvent(new CustomEvent("sortstart", {
          detail: {
            origin: {
              elementIndex: originElementIndex,
              index: originIndex,
              container: originContainer
            },
            item: dragging,
            originalTarget: target,
            dragEvent: e
          }
        }));
      });
      addEventListener(sortableElement, "dragenter", (e) => {
        const target = getEventTarget(e);
        const sortableContainer = findSortable(target, e);
        if (sortableContainer && sortableContainer !== previousContainer) {
          destinationItemsBeforeUpdate = filter(sortableContainer.children, addData(sortableContainer, "items")).filter((item) => item !== store(sortableElement).placeholder);
          if (options.dropTargetContainerClass) {
            sortableContainer.classList.add(options.dropTargetContainerClass);
          }
          sortableContainer.dispatchEvent(new CustomEvent("sortenter", {
            detail: {
              origin: {
                elementIndex: originElementIndex,
                index: originIndex,
                container: originContainer
              },
              destination: {
                container: sortableContainer,
                itemsBeforeUpdate: destinationItemsBeforeUpdate
              },
              item: dragging,
              originalTarget: target
            }
          }));
          addEventListener(sortableContainer, "dragleave", function(e2) {
            const outTarget = e2.relatedTarget || e2.fromElement;
            if (!e2.currentTarget.contains(outTarget)) {
              if (options.dropTargetContainerClass) {
                sortableContainer.classList.remove(options.dropTargetContainerClass);
              }
              sortableContainer.dispatchEvent(new CustomEvent("sortleave", {
                detail: {
                  origin: {
                    elementIndex: originElementIndex,
                    index: originIndex,
                    container: sortableContainer
                  },
                  item: dragging,
                  originalTarget: target
                }
              }));
            }
          });
        }
        previousContainer = sortableContainer;
      });
      addEventListener(sortableElement, "dragend", function(e) {
        if (!dragging) {
          return;
        }
        dragging.classList.remove(options.draggingClass);
        addAttribute(dragging, "aria-grabbed", "false");
        if (dragging.getAttribute("aria-copied") === "true" && addData(dragging, "dropped") !== "true") {
          dragging.remove();
        }
        if (dragging.oldDisplay !== void 0) {
          dragging.style.display = dragging.oldDisplay;
          delete dragging.oldDisplay;
        }
        const visiblePlaceholder = Array.from(stores.values()).map((data2) => data2.placeholder).filter((placeholder) => placeholder instanceof HTMLElement).filter(isInDom)[0];
        if (visiblePlaceholder) {
          visiblePlaceholder.remove();
        }
        sortableElement.dispatchEvent(new CustomEvent("sortstop", {
          detail: {
            origin: {
              elementIndex: originElementIndex,
              index: originIndex,
              container: originContainer
            },
            item: dragging,
            dragEvent: e
          }
        }));
        previousContainer = null;
        dragging = null;
        draggingHeight = null;
        draggingWidth = null;
      });
      addEventListener(sortableElement, "drop", function(e) {
        if (!listsConnected(sortableElement, dragging.parentElement)) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        addData(dragging, "dropped", "true");
        const visiblePlaceholder = Array.from(stores.values()).map((data2) => {
          return data2.placeholder;
        }).filter((placeholder2) => placeholder2 instanceof HTMLElement).filter(isInDom)[0];
        if (visiblePlaceholder) {
          visiblePlaceholder.replaceWith(dragging);
          if (dragging.oldDisplay !== void 0) {
            dragging.style.display = dragging.oldDisplay;
            delete dragging.oldDisplay;
          }
        } else {
          addData(dragging, "dropped", "false");
          return;
        }
        const placeholder = store(sortableElement).placeholder;
        const originItems = filter(originContainer.children, options.items).filter((item) => item !== placeholder);
        const destinationContainer = this.isSortable === true ? this : this.parentElement;
        const destinationItems = filter(destinationContainer.children, addData(destinationContainer, "items")).filter((item) => item !== placeholder);
        const destinationElementIndex = getIndex(dragging, Array.from(dragging.parentElement.children).filter((item) => item !== placeholder));
        const destinationIndex = getIndex(dragging, destinationItems);
        if (options.dropTargetContainerClass) {
          destinationContainer.classList.remove(options.dropTargetContainerClass);
        }
        sortableElement.dispatchEvent(new CustomEvent("sortstop", {
          detail: {
            origin: {
              elementIndex: originElementIndex,
              index: originIndex,
              container: originContainer
            },
            item: dragging,
            destination: {
              index: destinationIndex,
              elementIndex: destinationElementIndex,
              container: destinationContainer,
              itemsBeforeUpdate: destinationItemsBeforeUpdate,
              items: destinationItems
            },
            dragEvent: e
          }
        }));
        if (originElementIndex !== destinationElementIndex || originContainer !== destinationContainer) {
          sortableElement.dispatchEvent(new CustomEvent("sortupdate", {
            detail: {
              origin: {
                elementIndex: originElementIndex,
                index: originIndex,
                container: originContainer,
                itemsBeforeUpdate: originItemsBeforeUpdate,
                items: originItems
              },
              destination: {
                index: destinationIndex,
                elementIndex: destinationElementIndex,
                container: destinationContainer,
                itemsBeforeUpdate: destinationItemsBeforeUpdate,
                items: destinationItems
              },
              item: dragging,
              dragEvent: e
            }
          }));
        }
      });
      const debouncedDragOverEnter = debounce(
        (sortableElement2, element, pageX, pageY) => {
          if (!dragging) {
            return;
          }
          if (options.forcePlaceholderSize) {
            store(sortableElement2).placeholder.style.height = draggingHeight + "px";
            store(sortableElement2).placeholder.style.width = draggingWidth + "px";
          }
          if (Array.from(sortableElement2.children).indexOf(element) > -1) {
            const thisHeight = getElementHeight(element);
            const thisWidth = getElementWidth(element);
            const placeholderIndex = getIndex(store(sortableElement2).placeholder, element.parentElement.children);
            const thisIndex = getIndex(element, element.parentElement.children);
            if (thisHeight > draggingHeight || thisWidth > draggingWidth) {
              const deadZoneVertical = thisHeight - draggingHeight;
              const deadZoneHorizontal = thisWidth - draggingWidth;
              const offsetTop = offset(element).top;
              const offsetLeft = offset(element).left;
              if (placeholderIndex < thisIndex && (options.orientation === "vertical" && pageY < offsetTop || options.orientation === "horizontal" && pageX < offsetLeft)) {
                return;
              }
              if (placeholderIndex > thisIndex && (options.orientation === "vertical" && pageY > offsetTop + thisHeight - deadZoneVertical || options.orientation === "horizontal" && pageX > offsetLeft + thisWidth - deadZoneHorizontal)) {
                return;
              }
            }
            if (dragging.oldDisplay === void 0) {
              dragging.oldDisplay = dragging.style.display;
            }
            if (dragging.style.display !== "none") {
              dragging.style.display = "none";
            }
            let placeAfter = false;
            try {
              const elementMiddleVertical = offset(element).top + element.offsetHeight / 2;
              const elementMiddleHorizontal = offset(element).left + element.offsetWidth / 2;
              placeAfter = options.orientation === "vertical" && pageY >= elementMiddleVertical || options.orientation === "horizontal" && pageX >= elementMiddleHorizontal;
            } catch (e) {
              placeAfter = placeholderIndex < thisIndex;
            }
            if (placeAfter) {
              insertAfter(element, store(sortableElement2).placeholder);
            } else {
              insertBefore(element, store(sortableElement2).placeholder);
            }
            Array.from(stores.values()).filter((data2) => data2.placeholder !== void 0).forEach((data2) => {
              if (data2.placeholder !== store(sortableElement2).placeholder) {
                data2.placeholder.remove();
              }
            });
          } else {
            const placeholders = Array.from(stores.values()).filter((data2) => data2.placeholder !== void 0).map((data2) => {
              return data2.placeholder;
            });
            if (placeholders.indexOf(element) === -1 && sortableElement2 === element && !filter(element.children, options.items).length) {
              placeholders.forEach((element2) => element2.remove());
              element.appendChild(store(sortableElement2).placeholder);
            }
          }
        },
        options.debounce
      );
      const onDragOverEnter = function(e) {
        let element = e.target;
        const sortableElement2 = element.isSortable === true ? element : findSortable(element, e);
        element = findDragElement(sortableElement2, element);
        if (!dragging || !listsConnected(sortableElement2, dragging.parentElement) || addData(sortableElement2, "_disabled") === "true") {
          return;
        }
        const options2 = addData(sortableElement2, "opts");
        if (parseInt(options2.maxItems) && filter(sortableElement2.children, addData(sortableElement2, "items")).length >= parseInt(options2.maxItems) && dragging.parentElement !== sortableElement2) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = store(sortableElement2).getConfig("copy") === true ? "copy" : "move";
        debouncedDragOverEnter(sortableElement2, element, e.pageX, e.pageY);
      };
      addEventListener(listItems.concat(sortableElement), "dragover", onDragOverEnter);
      addEventListener(listItems.concat(sortableElement), "dragenter", onDragOverEnter);
    });
    return sortableElements;
  }
  sortable.destroy = function(sortableElement) {
    destroySortable(sortableElement);
  };
  sortable.enable = function(sortableElement) {
    enableSortable(sortableElement);
  };
  sortable.disable = function(sortableElement) {
    disableSortable(sortableElement);
  };
  sortable.__testing = {
    data: addData,
    removeItemEvents,
    removeItemData,
    removeSortableData,
    removeContainerEvents
  };

  // src/ts/xq-drag.ts
  var bindDrag = () => {
    const dragClass = getOption("dragClass");
    const dragger_table = document.querySelector(dragClass);
    if (dragger_table) {
      let tbody = dragger_table.querySelector("tbody");
      if (tbody) {
        const firstTr = tbody.querySelector("tbody>tr:first-child");
        const firstId = firstTr.getAttribute("id");
        const firstTd = firstTr.querySelector("td:first-child");
        firstTd?.classList.add("xq-move");
        tbody.setAttribute("id", "tbody_" + firstId);
        const trs = tbody.querySelectorAll("tbody>tr:not(:first-child)");
        for (const tr of trs) {
          const td = tr.querySelector("td:first-child");
          td?.classList.add("xq-move");
          const innerbody = document.createElement("tbody");
          innerbody.append(tr);
          const trId = tr.getAttribute("id");
          innerbody.setAttribute("id", "tbody_" + trId);
          tbody.after(innerbody);
          tbody = innerbody;
        }
      }
      sortable(dragClass, {
        items: "tbody",
        handle: ".xq-move",
        placeholder: '<tbody><tr><td colspan="99">&nbsp;</td></tr><tbody>'
      });
      dragger_table.addEventListener("sortstop", () => {
        const rows = [];
        let rowIndex = 0;
        const tbodies = dragger_table.querySelectorAll("tbody");
        for (const tbody2 of tbodies) {
          rowIndex++;
          const tr = tbody2.querySelector("tr:first-child");
          const trId = tr?.getAttribute("id");
          const row = { id: trId, ordernum: rowIndex };
          rows.push(row);
        }
        const pid = dragger_table.getAttribute("pid");
        let url = dragger_table.getAttribute("xq-url");
        if (!url) {
          url = window.location.href;
          if (pid) {
            url = url.replace("/" + pid, "");
          }
          url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
          url += "/b-order";
        }
        fetch(url, {
          body: JSON.stringify(rows),
          headers: {
            "content-type": "application/json"
          },
          method: "POST"
        }).then(async (response) => {
          return response.json();
        }).then((data) => {
          if (data.code === 200) {
          }
        });
      });
    }
  };

  // src/ts/xq-check-all.ts
  var bindCheckAll = () => {
    const checkAllClass = getOption("checkAllClass");
    const check_all = document.querySelector(checkAllClass);
    if (check_all) {
      check_all.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const { checked } = target;
        const table2 = getTable();
        const checks = table2?.querySelectorAll("tr > td:first-child > input[type=checkbox]");
        for (const check of checks) {
          if (check === target) {
            continue;
          }
          if (checked) {
            check.checked = true;
          } else {
            check.checked = false;
          }
        }
      });
    }
  };

  // src/ts/xq-back.ts
  var bindBack = () => {
    let referrer;
    let backpage;
    let topReferrer;
    const backPageClass = getOption("backPageClass");
    const els = document.querySelectorAll(backPageClass);
    if (els) {
      referrer = document.referrer;
      topReferrer = null;
      if (window.top !== window) {
        try {
          topReferrer = window.top?.location.href;
        } catch (e) {
        }
      }
      if (referrer && referrer !== document.location.href && referrer !== topReferrer) {
        sessionStorage.setItem(document.location.href, referrer);
        backpage = referrer;
      } else {
        const item = sessionStorage.getItem(document.location.href);
        if (item) {
          backpage = item.toString();
        }
      }
      for (const el of els) {
        el.addEventListener("click", (event) => {
          event.preventDefault();
          if (backpage) {
            document.location.href = backpage;
          } else {
            xqConfirm({
              content: "\u7CFB\u7EDF\u65E0\u6CD5\u81EA\u52A8\u8FD4\u56DE\u4E0A\u4E00\u4E2A\u9875\u9762."
            });
          }
        });
      }
    }
  };

  // src/ts/xq-auth.ts
  var bindAuth = () => {
    const authTableClass = getOption("authTableClass");
    const auth_tables = document.querySelectorAll(authTableClass);
    if (auth_tables) {
      for (const auth_table of auth_tables) {
        const authCheckTableClass = getOption("authCheckTableClass");
        const check_table = auth_table.querySelector(authCheckTableClass);
        if (check_table) {
          const table_check_all = check_table.querySelector("input[type=checkbox]");
          if (table_check_all) {
            table_check_all.addEventListener("click", (event) => {
              const target = event.currentTarget;
              const { checked } = target;
              const other_checks = auth_table.querySelectorAll("input[type=checkbox]:not(" + authCheckTableClass + ">input[type=checkbox])");
              for (const other_check of other_checks) {
                if (checked) {
                  other_check.checked = true;
                } else {
                  other_check.checked = false;
                }
              }
            });
          }
        }
        const authCheckRowClass = getOption("authCheckRowClass");
        const check_rows = auth_table.querySelectorAll(authCheckRowClass);
        for (const check_row of check_rows) {
          const row_check_all = check_row.querySelector("input[type=checkbox]");
          if (row_check_all) {
            row_check_all.addEventListener("click", (event) => {
              const target = event.currentTarget;
              const { checked } = target;
              const next_td = next(check_row, "td")[0];
              const next_td_checks = next_td.querySelectorAll("input[type=checkbox]");
              for (const next_td_check of next_td_checks) {
                if (checked) {
                  next_td_check.checked = true;
                } else {
                  next_td_check.checked = false;
                }
              }
            });
          }
        }
      }
    }
  };

  // src/ts/xq-fileinput.ts
  var bindFileinput = () => {
    const fileinputs = document.querySelectorAll(".xq-fileinput");
    if (fileinputs && typeof jQuery !== void 0) {
      let config;
      for (const fileinput of fileinputs) {
        config = fileinput.hasAttribute("xq-config") ? fileinput.getAttribute("xq-config") : "{}";
        $(fileinput).fileinput(JSON.parse(config)).on("filedeleted", (event) => {
          const target = event.currentTarget;
          updateFileInputValue(target);
        }).on("fileuploaded", (event) => {
          const target = event.currentTarget;
          updateFileInputValue(target);
        }).on("filesorted", (event) => {
          const target = event.currentTarget;
          updateFileInputValue(target);
        });
        updateFileInputValue(fileinput);
      }
    }
  };
  var updateFileInputValue = (fileinput) => {
    const fileinput_id = fileinput.getAttribute("id");
    const fileinput_value_id = fileinput_id.replace("-xq-fileinput", "");
    const fileinput_value = document.querySelector("#" + fileinput_value_id);
    const fileinput_preview = $(fileinput).fileinput("getPreview");
    fileinput_value?.setAttribute("value", JSON.stringify(fileinput_preview));
    const fileCount = $(fileinput).fileinput("getFilesCount", true);
    const configStr = fileinput.getAttribute("xq-config");
    const config = JSON.parse(configStr);
    if (config !== null && "required" in config) {
      if (fileCount > 0) {
        fileinput.removeAttribute("required");
      } else {
        fileinput.setAttribute("required", "true");
      }
      if ("content" in fileinput_preview) {
        const { content } = fileinput_preview;
        if (content.length === 0) {
          fileinput.setCustomValidity("\u9700\u8981\u81F3\u5C11\u4E0A\u4F20\u4E00\u4E2A\u6587\u4EF6");
        } else {
          fileinput.setCustomValidity("");
        }
      }
    }
  };

  // src/ts/xq-captcha.ts
  var bindCaptcha = () => {
    const captchaClass = getOption("captchaClass");
    const captcha = document.querySelector(captchaClass);
    if (captcha) {
      captcha.addEventListener("click", (event) => {
        const target = event.currentTarget;
        let src = target.getAttribute("src");
        if (src.includes("?")) {
          src = src.slice(0, Math.max(0, src.lastIndexOf("?")));
          src = src + "?xq-r=" + Math.random().toString();
        } else {
          src = src + "?xq-r=" + Math.random().toString();
        }
        target.setAttribute("src", src);
      });
    }
  };

  // src/ts/xq-init.ts
  var init = () => {
    const table2 = getTable();
    if (table2) {
      const tres = table2.querySelectorAll("tr");
      for (const tr of tres) {
        bindView(tr);
        bindEdit(tr);
        bindDelete(tr);
        bindChange(tr);
        bindCopy(tr);
      }
      bindCheckAll();
      bindAdd();
      bindBatch();
      bindDrag();
    }
    bindBack();
    bindAuth();
    bindFileinput();
    bindCaptcha();
  };

  // src/ts/index.ts
  var xqTableList = (options = {}) => {
    setOption(options);
    init();
  };
  domReady(() => {
    xqTableList();
  });
})();
/*! Bundled license information:

xq-util/dist/index.mjs:
  (*!
   * xq-util v1.0.3 (http://xqkeji.cn/)
   * Author xqkeji.cn
   * LICENSE SSPL-1.0
   * Copyright 2023 xqkeji.cn
   *)

xq-confirm/dist/index.mjs:
  (*!
   * xq-confirm v1.0.9 (https://xqkeji.cn/demo/xq-confirm)
   * Author xqkeji.cn
   * LICENSE SSPL-1.0
   * Copyright 2023 xqkeji.cn
   *)

xq-html5sortable/dist/index.mjs:
  (*!
   * xq-html5sortable v1.0.2 (https://xqkeji.cn/)
   * Author xqkeji.cn
   * LICENSE MIT
   * Copyright 2023 xqkeji.cn
   *)
*/
