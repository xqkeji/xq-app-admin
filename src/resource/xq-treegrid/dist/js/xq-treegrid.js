/*!
 * xq-treegrid v1.0.7 (https://xqkeji.cn/demo/xq-treegrid/)
 * Author xqkeji.cn
 * LICENSE SSPL-1.0
 * Copyright 2023 xqkeji.cn
 */
 "use strict";
(() => {
  // src/ts/xq-option.ts
  var DEFAULT_OPTIONS = {
    expanderTemplate: '<span class="xq-treegrid-expander"></span>',
    indentTemplate: '<span class="xq-treegrid-indent"></span>',
    indentClass: ".xq-treegrid-indent",
    expanderClass: ".xq-treegrid-expander",
    expanderExpandedClass: "xq-treegrid-expander-expanded",
    expanderCollapsedClass: "xq-treegrid-expander-collapsed",
    treeColumn: 2,
    tableClass: ".xq-treegrid",
    topClass: ".xq-treegrid-top",
    dragClass: ".xq-drag",
    checkAllClass: ".xq-treegrid .xq-check-all",
    addBtnClass: ".xq-treegrid .xq-add",
    editBtnClass: ".xq-edit",
    deleteBtnClass: ".xq-delete",
    copyBtnClass: ".xq-copy",
    dragOffset: -30,
    "xq-url": null
  };
  var treegridOptions = {};
  var setOption = (options = {}) => {
    treegridOptions = Object.assign({}, DEFAULT_OPTIONS);
    if (options) {
      for (const option in options) {
        if (Object.hasOwn(treegridOptions, option)) {
          treegridOptions[option] = options[option];
        }
      }
    }
  };
  var getOption = (key) => {
    if (key in treegridOptions) {
      return treegridOptions[key];
    }
    const tableClass = treegridOptions["tableClass"];
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

  // src/ts/xq-check-all.ts
  var checkAll = () => {
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

  // src/ts/xq-build.ts
  var build = (table2) => {
    if (table2) {
      let tbody = table2.querySelector("tbody");
      if (tbody && tbody.querySelectorAll("tr").length > 1) {
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
    }
  };

  // src/ts/xq-tree.ts
  var getTopNodes = () => {
    const table2 = getTable();
    const topClass = getOption("topClass");
    const tops = table2.querySelectorAll("tbody>" + topClass);
    if (tops) {
      return tops;
    }
    return null;
  };
  var getRootId = () => {
    const table2 = getTable();
    const topClass = getOption("topClass");
    const top = table2.querySelector("tbody>" + topClass);
    if (top) {
      return top.getAttribute("pid");
    }
    return null;
  };
  var getNodeId = (element) => {
    const nodeId = element.getAttribute("id");
    if (nodeId) {
      return nodeId;
    }
    return "";
  };
  var getNodeById = (id) => {
    const table2 = getTable();
    if (!id.startsWith("xq_")) {
      id = "xq_" + id;
    }
    return table2.querySelector("#" + id);
  };
  var getChildNodes = (id) => {
    if (id.startsWith("xq_")) {
      id = id.replace("xq_", "");
    }
    const table2 = getTable();
    const nodes = table2.querySelectorAll('tr[pid="' + id + '"]');
    return nodes;
  };
  var isExistChildNode = (id) => {
    const nodes = getChildNodes(id);
    return nodes.length > 0;
  };
  var getParent = (element) => {
    const parentNodeId = element.getAttribute("pid");
    if (parentNodeId) {
      return getNodeById(parentNodeId);
    }
    return null;
  };
  var getParentId = (element) => {
    const parentNodeId = element.getAttribute("pid");
    if (parentNodeId) {
      return parentNodeId;
    }
    return null;
  };
  var getDepth = (element) => {
    const depth = element.getAttribute("depth");
    if (depth) {
      return Number.parseInt(depth, 10);
    }
    return 0;
  };
  var isLeaf = (element) => {
    const is_leaf = element.getAttribute("is_leaf");
    return Number.parseInt(is_leaf, 10) !== 0;
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
  var append = (element, dom) => {
    const node = document.createRange().createContextualFragment(dom);
    element.append(node);
  };
  var prepend = (element, dom) => {
    const node = document.createRange().createContextualFragment(dom);
    element.prepend(node);
  };

  // src/ts/xq-edit.ts
  var bindEdit = (element) => {
    const editClass = getOption("editBtnClass");
    const editBtn = element.querySelector(editClass);
    if (editBtn) {
      editBtn.addEventListener("click", (event) => {
        const targetElement = event.currentTarget;
        const node = parents(targetElement, "tr")[0];
        const nodeId = getNodeId(node);
        let id = "";
        let name = "";
        id = nodeId.replace("xq_", "");
        if (id) {
          let url = targetElement.getAttribute("xq-url");
          if (!url) {
            url = window.location.href;
            if (url.includes(".html") || url.endsWith("/")) {
              url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
              url = url + "/edit.html?id=" + id;
            } else {
              url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
              url = url + "/edit/" + id;
            }
          }
          const text = node.querySelector("#name_" + id);
          name = text.getAttribute("value") + "\u8BBE\u7F6E";
          if (window !== window.parent) {
            const tabId = "treegrid-edit-" + id;
            const message = { "callback": "xqAddTab", "params": [tabId, name, url] };
            window.parent.postMessage(message, "*");
          } else {
            const form = document.querySelector("#xq-not-tab-url");
            const formId = document.querySelector("#xq-not-tab-url-id");
            if (form && formId) {
              form.setAttribute("action", url);
              formId.setAttribute("value", id);
              form.submit();
            } else {
              const template2 = '<form id="xq-not-tab-url" target="_blank" action="' + url + '" method="get"><input type="hidden" id="xq-not-tab-url-id" name="id" value="' + id + '"/></form>';
              append(document.body, template2);
              const form2 = document.querySelector("#xq-not-tab-url");
              form2.submit();
            }
          }
        }
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
  var build2 = (options = {}) => {
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
    build2(options);
  };
  window.xqConfirm = xqConfirm;

  // src/ts/xq-delete.ts
  var bindDelete = (element) => {
    const deleteBtnClass = getOption("deleteBtnClass");
    const delBtn = element.querySelector(deleteBtnClass);
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        let deleteUrl = "";
        if (isLeaf(element)) {
          const xq_url = getOption("xq-url");
          const id = getNodeId(element);
          const req_id = id.replace("xq_", "");
          const data = { id: req_id };
          if (!xq_url) {
            let url = window.location.href;
            url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
            url += "/delete";
            deleteUrl = url;
          } else {
            deleteUrl = xq_url + "/delete";
          }
          xqConfirm({
            content: "\u786E\u5B9A\u8981\u5220\u9664\u5417\uFF1F",
            confirm() {
              fetch(deleteUrl, {
                body: JSON.stringify(data),
                headers: {
                  "content-type": "application/json"
                },
                method: "POST"
              }).then(async (response) => {
                return response.json();
              }).then((data2) => {
                xqConfirm({
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                  content: data2.message,
                  confirm() {
                    if (data2.code === 200) {
                      removeNode(element);
                    }
                  }
                });
              });
            }
          });
        } else {
          xqConfirm({
            content: "\u5B58\u5728\u5B50\u680F\u76EE\u65E0\u6CD5\u8FDB\u884C\u5220\u9664\u64CD\u4F5C\uFF01"
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
          let xq_url = getOption("xq-url");
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

  // src/ts/xq-copy.ts
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
  var copy = (text) => {
    const el = document.createElement("input");
    el.setAttribute("value", text);
    document.body.append(el);
    el.select();
    document.execCommand("copy");
    el.remove();
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

  // src/ts/xq-node.ts
  var removeNode = (element) => {
    const treeColumn = getOption("treeColumn");
    const pid = getParentId(element);
    element.parentElement?.remove();
    if (pid) {
      const parentNode = getNodeById(pid);
      if (parentNode && !isExistChildNode(pid)) {
        parentNode.setAttribute("is_leaf", "1");
        const cell = parentNode.querySelector("td:nth-child(" + treeColumn.toString() + ")");
        const spanes = cell.querySelectorAll("span");
        for (const span of spanes) {
          span.remove();
        }
        initNode(parentNode);
      }
    }
  };
  var isExpander = (element) => {
    const treeColumn = getOption("treeColumn");
    const expanderClass = getOption("expanderClass");
    const expanderCollapsedClass = getOption("expanderCollapsedClass");
    const cell = element.querySelector("td:nth-child(" + treeColumn.toString() + ")");
    if (cell && !isLeaf(element)) {
      const expander = cell.querySelector(expanderClass);
      const id = element.getAttribute("id");
      if (expander.classList.contains(expanderCollapsedClass)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  var expanderNode = (element, callBack = () => {
  }) => {
    const treeColumn = getOption("treeColumn");
    const expanderClass = getOption("expanderClass");
    const expanderCollapsedClass = getOption("expanderCollapsedClass");
    const expanderExpandedClass = getOption("expanderExpandedClass");
    const cell = element.querySelector("td:nth-child(" + treeColumn.toString() + ")");
    if (cell && !isLeaf(element)) {
      const expander = cell.querySelector(expanderClass);
      const id = element.getAttribute("id");
      if (expander.classList.contains(expanderCollapsedClass)) {
        expander.classList.remove(expanderCollapsedClass);
        expander.classList.add(expanderExpandedClass);
        if (!isExistChildNode(id)) {
          let xq_url = getOption("xq-url");
          if (!xq_url) {
            let url = window.location.href;
            url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
            const req_id = id.replace("xq_", "");
            url = url + "/subnode/" + req_id;
            xq_url = url;
          } else {
            const req_id = id.replace("xq_", "");
            xq_url = xq_url + "/subnode/" + req_id;
          }
          if (xq_url.includes(":3000")) {
            xq_url = xq_url.replace(":3000", ":9000");
          }
          loadNodes(element, xq_url, callBack);
          return;
        } else {
          const chileNodes = getChildNodes(id);
          for (const node of chileNodes) {
            expandRecursive(node);
          }
        }
      } else if (expander.classList.contains(expanderExpandedClass)) {
        expander.classList.remove(expanderExpandedClass);
        expander.classList.add(expanderCollapsedClass);
        const chileNodes = getChildNodes(id);
        for (const node of chileNodes) {
          collapseRecursive(node);
        }
      }
    }
    callBack();
  };
  var loadNodes = (element, url, callBack = () => {
  }) => {
    let newElement = element;
    const depth = getDepth(element);
    fetch(url).then(async (response) => {
      return response.json();
    }).then((data) => {
      for (const category of data) {
        category.depth = depth + 1;
        newElement = addNode(newElement, category);
      }
      callBack();
    });
  };
  var addNode = (element, category) => {
    const table2 = getTable();
    const id = category.id;
    const pid = category.pid;
    const is_leaf = category.is_leaf;
    const depth = category.depth;
    const content = category.content;
    const tr = document.createElement("tr");
    const trId = "xq_" + id;
    tr.setAttribute("id", "xq_" + id);
    tr.setAttribute("pid", pid);
    tr.setAttribute("is_leaf", is_leaf);
    tr.setAttribute("depth", depth);
    tr.innerHTML = content;
    initNode(tr);
    bindChange(tr);
    bindDelete(tr);
    bindEdit(tr);
    bindCopy(tr);
    const td = tr.querySelector("td:first-child");
    td?.classList.add("xq-move");
    const tbody = document.createElement("tbody");
    tbody.setAttribute("id", "tbody_" + trId);
    tbody.append(tr);
    if (element.tagName === "TABLE") {
      const thead = table2.querySelector("thead");
      thead?.after(tbody);
    } else {
      element.parentElement?.after(tbody);
    }
    const dragClass = getOption("dragClass");
    if (table2.classList.contains(dragClass.substring(1))) {
      sortable(table2, {});
    }
    return tr;
  };
  var expandRecursive = (element) => {
    if (element.classList.contains("d-none")) {
      element.classList.remove("d-none");
    }
  };
  var collapseRecursive = (element) => {
    const treeColumn = getOption("treeColumn");
    const expanderClass = getOption("expanderClass");
    const expanderCollapsedClass = getOption("expanderCollapsedClass");
    const expanderExpandedClass = getOption("expanderExpandedClass");
    element.classList.add("d-none");
    const check = element.querySelector("td:first-child .form-check-input");
    if (check) {
      check.checked = false;
    }
    if (!isLeaf(element)) {
      const childNodes = getChildNodes(getNodeId(element));
      const cell = element.querySelector("td:nth-child(" + treeColumn.toString() + ")");
      if (cell) {
        const expander = cell.querySelector(expanderClass);
        expander.classList.remove(expanderExpandedClass);
        expander.classList.add(expanderCollapsedClass);
      }
      for (const node of childNodes) {
        collapseRecursive(node);
      }
    }
  };
  var reloadNode = (element) => {
    const parent = getParent(element);
    const parentId = getParentId(element).replace("xq_", "");
    const depth = getDepth(parent) + 1;
    element.setAttribute("pid", parentId);
    element.setAttribute("depth", depth.toString());
    initNode(element);
    if (!isLeaf(element)) {
      const id = getNodeId(element);
      const children = getChildNodes(id);
      if (children) {
        reloadNodes(children);
      }
    }
  };
  var reloadNodes = (elements) => {
    for (const element of elements) {
      reloadNode(element);
    }
  };
  var setTopNode = (element) => {
    const rootId = getRootId().replace("xq_", "");
    element.setAttribute("pid", rootId);
    element.setAttribute("depth", "1");
    const xqTopClass = getOption("topClass").slice(1);
    if (!element.classList.contains(xqTopClass)) {
      element.classList.add(xqTopClass);
    }
    reinitNode(element);
  };
  var decNode = (element, previous) => {
    let parent = null;
    const elementDepth = getDepth(element);
    if (elementDepth > 1) {
      parent = getParent(element);
    }
    const pid = getNodeId(previous).replace("xq_", "");
    const depth = getDepth(previous) + 1;
    element.setAttribute("pid", pid);
    element.setAttribute("depth", depth.toString());
    const xqTopClass = getOption("topClass").slice(1);
    if (element.classList.contains(xqTopClass)) {
      element.classList.remove(xqTopClass);
    }
    if (isLeaf(previous)) {
      previous.setAttribute("is_leaf", "0");
    }
    reinitNode(previous);
    const treeColumn = getOption("treeColumn");
    const expanderClass = getOption("expanderClass");
    const expanderCollapsedClass = getOption("expanderCollapsedClass");
    const expanderExpandedClass = getOption("expanderExpandedClass");
    const cell = previous.querySelector("td:nth-child(" + treeColumn.toString() + ")");
    if (cell && !isLeaf(previous)) {
      const expander = cell.querySelector(expanderClass);
      if (expander.classList.contains(expanderCollapsedClass)) {
        expander.classList.remove(expanderCollapsedClass);
        expander.classList.add(expanderExpandedClass);
      }
    }
    reinitNode(element);
    if (parent) {
      const parentId = getNodeId(parent);
      if (!isExistChildNode(parentId)) {
        parent.setAttribute("is_leaf", "1");
      }
      reinitNode(parent, true);
    }
  };
  var eqNode = (element, previous) => {
    let parent = null;
    const elementDepth = getDepth(element);
    if (elementDepth > 1) {
      parent = getParent(element);
    }
    const pid = getParentId(previous).replace("xq_", "");
    const depth = getDepth(previous);
    element.setAttribute("pid", pid);
    element.setAttribute("depth", depth.toString());
    const xqTopClass = getOption("topClass").slice(1);
    if (element.classList.contains(xqTopClass)) {
      element.classList.remove(xqTopClass);
    }
    reinitNode(element);
    if (!isLeaf(previous)) {
      reinitNode(previous);
    }
    if (parent) {
      const parentId = getNodeId(parent);
      if (!isExistChildNode(parentId)) {
        parent.setAttribute("is_leaf", "1");
      }
      reinitNode(parent);
    }
  };

  // src/ts/xq-init.ts
  var initExpander = (element) => {
    const treeColumn = getOption("treeColumn");
    const expanderTemplate = getOption("expanderTemplate");
    const expanderClass = getOption("expanderClass");
    const expanderCollapsedClass = getOption("expanderCollapsedClass");
    const expanderExpandedClass = getOption("expanderExpandedClass");
    const cell = element.querySelector("td:nth-child(" + treeColumn.toString() + ")");
    let sourceClass = expanderCollapsedClass;
    if (cell) {
      const expander = cell.querySelector(expanderClass);
      if (expander) {
        if (expander.classList.contains(expanderExpandedClass)) {
          sourceClass = expanderExpandedClass;
        }
      }
      const spanes = cell.querySelectorAll("span");
      for (const span of spanes) {
        span.remove();
      }
      prepend(cell, expanderTemplate);
      if (!isLeaf(element)) {
        const expander2 = cell.querySelector(expanderClass);
        if (expander2) {
          expander2.classList.add(sourceClass);
          expander2.addEventListener("click", () => {
            expanderNode(element);
          });
        }
      }
    }
  };
  var initIndent = (element) => {
    const treeColumn = getOption("treeColumn");
    const indentTemplate = getOption("indentTemplate");
    const expanderClass = getOption("expanderClass");
    const expander = element.querySelector(expanderClass);
    if (expander) {
      const cell = element.querySelector("td:nth-child(" + treeColumn.toString() + ")");
      if (cell) {
        const depth = getDepth(element);
        for (let i = 1; i < depth; i++) {
          prepend(cell, indentTemplate);
        }
      }
    }
  };
  var initNode = (element) => {
    initExpander(element);
    initIndent(element);
  };
  var reinitNode = (element, is_parent = false) => {
    initNode(element);
    if (!isLeaf(element)) {
      const id = getNodeId(element);
      const children = getChildNodes(id);
      const elementBody = element.parentElement;
      let previousBody = elementBody;
      for (const child of children) {
        const childBody = child.parentElement;
        if (previousBody !== childBody && !is_parent) {
          previousBody.after(childBody);
        }
        previousBody = childBody;
        reloadNode(child);
        if (!isLeaf(child)) {
          reinitNode(child);
        }
      }
    }
  };

  // src/ts/xq-add.ts
  var bindAdd = () => {
    const treeColumn = getOption("treeColumn");
    const expanderClass = getOption("expanderClass");
    const expanderCollapsedClass = getOption("expanderCollapsedClass");
    const expanderExpandedClass = getOption("expanderExpandedClass");
    const addBtnClass = getOption("addBtnClass");
    const xqTreegripAdd = document.querySelector(addBtnClass);
    if (xqTreegripAdd) {
      xqTreegripAdd.addEventListener("click", () => {
        const table2 = getTable();
        const checks = table2.querySelectorAll("tbody > tr > td:first-child > input[type=checkbox]");
        const ids = [];
        for (const check of checks) {
          if (check.checked) {
            const tr = parents(check, "tr")[0];
            const nodeId = getNodeId(tr);
            ids.push(nodeId);
          }
        }
        let xq_url = getOption("xq-url");
        if (!xq_url) {
          let url = window.location.href;
          url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
          url += "/add";
          xq_url = url;
        } else {
          xq_url += "/add";
        }
        if (ids.length > 0) {
          for (const id of ids) {
            const node = getNodeById(id);
            const depth = getDepth(node);
            const req_id = id.replace("xq_", "");
            const data = { pid: req_id, depth };
            fetch(xq_url, {
              body: JSON.stringify(data),
              headers: {
                "content-type": "application/json"
              },
              method: "POST"
            }).then(async (response) => {
              return response.json();
            }).then((data2) => {
              const node2 = getNodeById(id);
              if (node2) {
                if (isLeaf(node2)) {
                  const cell = node2.querySelector("td:nth-child(" + treeColumn.toString() + ")");
                  const spanes = cell.querySelectorAll("span");
                  for (const span of spanes) {
                    span.remove();
                  }
                  node2.setAttribute("is_leaf", "0");
                  initNode(node2);
                  const expander = cell.querySelector(expanderClass);
                  if (expander) {
                    expander.classList.remove(expanderCollapsedClass);
                    expander.classList.add(expanderExpandedClass);
                  }
                  addNode(node2, data2);
                } else {
                  const cell = node2.querySelector("td:nth-child(" + treeColumn.toString() + ")");
                  const expander = cell.querySelector(expanderClass);
                  if (expander.classList.contains(expanderCollapsedClass)) {
                    expanderNode(node2, () => {
                      const childNodes = getChildNodes(id);
                      const lastNode = childNodes[childNodes.length - 1];
                      addNode(lastNode, data2);
                    });
                  } else {
                    const childNodes = getChildNodes(id);
                    const lastNode = childNodes[childNodes.length - 1];
                    addNode(lastNode, data2);
                  }
                }
              }
            });
          }
        } else {
          const data = { pid: "" };
          fetch(xq_url, {
            body: JSON.stringify(data),
            headers: {
              "content-type": "application/json"
            },
            method: "POST"
          }).then(async (response) => {
            return response.json();
          }).then((data2) => {
            const node = table2.querySelector("tbody:last-of-type>tr");
            if (node === null) {
              const empty_node = table2.querySelector("tbody:last-of-type");
              if (empty_node !== null) {
                empty_node.remove();
              }
              addNode(table2, data2);
            } else {
              addNode(node, data2);
            }
          });
        }
      });
    }
  };
  var addBtnTooltip = () => {
    const addBtnClass = getOption("addBtnClass");
    const tooltipEl = document.querySelector(addBtnClass);
    if (tooltipEl) {
      if (typeof bootstrap !== void 0 && bootstrap.Tooltip !== void 0) {
        const tooltip = new bootstrap.Tooltip(tooltipEl);
      }
    }
  };

  // src/ts/xq-previous.ts
  var getPrevious = (element) => {
    const previousElement = element.previousElementSibling;
    const tr = previousElement.querySelector("tr");
    if (tr) {
      if (tr.classList.contains("d-none")) {
        return getPrevious(previousElement);
      }
      return previousElement;
    }
    return null;
  };

  // src/ts/xq-drag.ts
  var next = (element, selector) => {
    const depth = Number.parseInt(element.getAttribute("depth"), 10);
    const parent = element.parentElement;
    let next2 = parent.nextElementSibling;
    let nextElement = next2.firstElementChild;
    let elementDepth = Number.parseInt(nextElement.getAttribute("depth"), 10);
    if (next2.tagName == "TFOOT") {
      return null;
    }
    while (next2) {
      if (elementDepth > depth) {
        return null;
      }
      if (nextElement.matches(selector)) {
        return nextElement;
      }
      next2 = next2.nextElementSibling;
      nextElement = next2.firstElementChild;
      elementDepth = Number.parseInt(nextElement.getAttribute("depth"), 10);
      if (next2.tagName == "TFOOT") {
        return null;
      }
    }
    return null;
  };
  var dragElement = (e) => {
    const { item } = e.detail;
    const tr = item.querySelector("tr");
    if (tr && !isLeaf(tr)) {
      const node = item.querySelector("tr");
      const childNodes = getChildNodes(getNodeId(node));
      for (const child of childNodes) {
        item.append(child);
      }
    }
  };
  var dropElement = (e) => {
    let { item } = e.detail;
    const trs = item.querySelectorAll("tbody>tr:not(:first-child)");
    if (trs) {
      const table2 = getTable();
      for (const tr of trs) {
        const trId = tr.getAttribute("id");
        const tbodyId = "#tbody_" + trId;
        const tbody = table2.querySelector(tbodyId);
        if (tbody) {
          item.after(tbody);
          item = tbody;
          tbody.append(tr);
        }
      }
    }
  };
  var dragUpdate = (e) => {
    const dragger_table = getTable();
    const { offsetLeft } = dragger_table;
    const detail = e.detail;
    const element = detail.item;
    const td = element.querySelector("td:first-child");
    const tr = element.querySelector("tr");
    const { offsetWidth } = td;
    const offset2 = detail.dragEvent.pageX - offsetLeft - offsetWidth - 10;
    const previousElement = getPrevious(element);
    const pTr = previousElement.querySelector("tr");
    if (previousElement.tagName === "THEAD") {
      setTopNode(tr);
      const data = getData(tr);
      moveNode(data);
    } else if (offset2 > 0) {
      if (isExpander(pTr)) {
        decNode(tr, pTr);
        const data = getData(tr);
        moveNode(data);
      } else {
        expanderNode(pTr, () => {
          decNode(tr, pTr);
          const data = getData(tr);
          moveNode(data);
        });
      }
    } else {
      eqNode(tr, pTr);
      const data = getData(tr);
      moveNode(data);
    }
  };
  var getData = (tr) => {
    const data = { id: "", pid: "", nextid: "" };
    data.id = getNodeId(tr).replace("xq_", "");
    data.pid = getParentId(tr);
    const nextTr = next(tr, 'tr[pid="' + data.pid + '"]');
    if (nextTr) {
      data.nextid = getNodeId(nextTr).replace("xq_", "");
    } else {
      data.nextid = "";
    }
    return data;
  };
  var moveNode = (data) => {
    let moveUrl;
    const xq_url = getOption("xq-url");
    if (!xq_url) {
      let url = window.location.href;
      url = url.slice(0, Math.max(0, url.lastIndexOf("/")));
      url += "/move";
      moveUrl = url;
    } else {
      moveUrl = xq_url + "/move";
    }
    fetch(moveUrl, {
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
  };
  var dragerTable = () => {
    const tableClass = getOption("tableClass");
    const dragClass = getOption("dragClass");
    const dragger_table = document.querySelector(tableClass + dragClass);
    if (dragger_table) {
      sortable(dragger_table, {
        items: "tbody",
        handle: ".xq-move",
        placeholder: '<tbody><tr><td colspan="99">&nbsp;</td></tr><tbody>'
      });
      dragger_table.addEventListener("sortstart", (e) => {
        dragElement(e);
      });
      dragger_table.addEventListener("sortstop", (e) => {
        const event = e.detail.dragEvent;
        if (event.type === "dragend") {
          dropElement(e);
          dragUpdate(e);
        }
      });
    }
  };
  var xq_drag_default = dragerTable;

  // src/ts/index.ts
  var xqTreegrid = (options = {}) => {
    setOption(options);
    const table2 = getTable();
    if (table2) {
      build(table2);
      const top_nodes = getTopNodes();
      if (top_nodes) {
        for (const node of top_nodes) {
          initNode(node);
          bindChange(node);
          bindDelete(node);
          bindEdit(node);
          bindCopy(node);
        }
      }
      bindAdd();
      addBtnTooltip();
      checkAll();
      xq_drag_default();
    }
  };
  domReady(() => {
    xqTreegrid();
  });
  window.xqTreegrid = xqTreegrid;
  var ts_default = xqTreegrid;
})();
/*! Bundled license information:

xq-util/dist/index.mjs:
  (*!
   * xq-util v1.0.1 (http://xqkeji.cn/)
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
