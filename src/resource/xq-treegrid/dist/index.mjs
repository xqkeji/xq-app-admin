/*!
 * xq-treegrid v1.0.4 (https://xqkeji.cn/demo/xq-treegrid/)
 * Author xqkeji.cn
 * LICENSE SSPL-1.0
 * Copyright 2023 xqkeji.cn
 */
 import { parents, append, prepend, domReady } from 'xq-util';
import xqConfirm from 'xq-confirm';
import sortable from 'xq-html5sortable';

const DEFAULT_OPTIONS = {
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
let treegridOptions = {};
const setOption = (options = {}) => {
  treegridOptions = Object.assign({}, DEFAULT_OPTIONS);
  if (options) {
    for (const option in options) {
      if (Object.hasOwn(treegridOptions, option)) {
        treegridOptions[option] = options[option];
      }
    }
  }
};
const getOption = (key) => {
  if (key in treegridOptions) {
    return treegridOptions[key];
  }
  const tableClass = treegridOptions["tableClass"];
  const table = document.querySelector(tableClass);
  if (table.hasAttribute(key)) {
    return String(table.getAttribute(key));
  }
  return "";
};

let table;
const getTable = () => {
  if (table) {
    return table;
  } else {
    const tableClass = getOption("tableClass");
    const container = document.querySelector(tableClass);
    table = container;
    return table;
  }
};

const checkAll = () => {
  const checkAllClass = getOption("checkAllClass");
  const check_all = document.querySelector(checkAllClass);
  if (check_all) {
    check_all.addEventListener("click", (event) => {
      const target = event.currentTarget;
      const { checked } = target;
      const table = getTable();
      const checks = table?.querySelectorAll("tr > td:first-child > input[type=checkbox]");
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

const build = (table) => {
  if (table) {
    const tbody = table.querySelector("tbody");
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
      }
    }
  }
};

const getTopNodes = () => {
  const table = getTable();
  const topClass = getOption("topClass");
  const tops = table.querySelectorAll("tbody>" + topClass);
  if (tops) {
    return tops;
  }
  return null;
};
const getRootId = () => {
  const table = getTable();
  const topClass = getOption("topClass");
  const top = table.querySelector("tbody>" + topClass);
  if (top) {
    return top.getAttribute("pid");
  }
  return null;
};
const getNodeId = (element) => {
  const nodeId = element.getAttribute("id");
  if (nodeId) {
    return nodeId;
  }
  return "";
};
const getNodeById = (id) => {
  const table = getTable();
  if (!id.startsWith("xq_")) {
    id = "xq_" + id;
  }
  return table.querySelector("#" + id);
};
const getChildNodes = (id) => {
  if (id.startsWith("xq_")) {
    id = id.replace("xq_", "");
  }
  const table = getTable();
  const nodes = table.querySelectorAll('tr[pid="' + id + '"]');
  return nodes;
};
const isExistChildNode = (id) => {
  const nodes = getChildNodes(id);
  return nodes.length > 0;
};
const getParent = (element) => {
  const parentNodeId = element.getAttribute("pid");
  if (parentNodeId) {
    return getNodeById(parentNodeId);
  }
  return null;
};
const getParentId = (element) => {
  const parentNodeId = element.getAttribute("pid");
  if (parentNodeId) {
    return parentNodeId;
  }
  return null;
};
const getDepth = (element) => {
  const depth = element.getAttribute("depth");
  if (depth) {
    return Number.parseInt(depth, 10);
  }
  return 0;
};
const isLeaf = (element) => {
  const is_leaf = element.getAttribute("is_leaf");
  return Number.parseInt(is_leaf, 10) !== 0;
};

const bindEdit = (element) => {
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
            const template = '<form id="xq-not-tab-url" target="_blank" action="' + url + '" method="get"><input type="hidden" id="xq-not-tab-url-id" name="id" value="' + id + '"/></form>';
            append(document.body, template);
            const form2 = document.querySelector("#xq-not-tab-url");
            form2.submit();
          }
        }
      }
    });
  }
};

const bindDelete = (element) => {
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

const bindChange = (element) => {
  const table = getTable();
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
        const pid = table?.getAttribute("pid");
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

const bindCopy = (element) => {
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
const copy = (text) => {
  const el = document.createElement("input");
  el.setAttribute("value", text);
  document.body.append(el);
  el.select();
  document.execCommand("copy");
  el.remove();
};

const removeNode = (element) => {
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
const isExpander = (element) => {
  const treeColumn = getOption("treeColumn");
  const expanderClass = getOption("expanderClass");
  const expanderCollapsedClass = getOption("expanderCollapsedClass");
  const cell = element.querySelector("td:nth-child(" + treeColumn.toString() + ")");
  if (cell && !isLeaf(element)) {
    const expander = cell.querySelector(expanderClass);
    element.getAttribute("id");
    if (expander.classList.contains(expanderCollapsedClass)) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};
const expanderNode = (element, callBack = () => {
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
const loadNodes = (element, url, callBack = () => {
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
const addNode = (element, category) => {
  const table = getTable();
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
    const thead = table.querySelector("thead");
    thead?.after(tbody);
  } else {
    element.parentElement?.after(tbody);
  }
  const dragClass = getOption("dragClass");
  if (table.classList.contains(dragClass.substring(1))) {
    sortable(table, {});
  }
  return tr;
};
const expandRecursive = (element) => {
  if (element.classList.contains("d-none")) {
    element.classList.remove("d-none");
  }
};
const collapseRecursive = (element) => {
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
const reloadNode = (element) => {
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
const reloadNodes = (elements) => {
  for (const element of elements) {
    reloadNode(element);
  }
};
const setTopNode = (element) => {
  const rootId = getRootId().replace("xq_", "");
  element.setAttribute("pid", rootId);
  element.setAttribute("depth", "1");
  const xqTopClass = getOption("topClass").slice(1);
  if (!element.classList.contains(xqTopClass)) {
    element.classList.add(xqTopClass);
  }
  reinitNode(element);
};
const decNode = (element, previous) => {
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
    reinitNode(parent);
  }
};
const eqNode = (element, previous) => {
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

const initExpander = (element) => {
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
const initIndent = (element) => {
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
const initNode = (element) => {
  initExpander(element);
  initIndent(element);
};
const reinitNode = (element) => {
  initNode(element);
  if (!isLeaf(element)) {
    const id = getNodeId(element);
    const children = getChildNodes(id);
    const elementBody = element.parentElement;
    let previousBody = elementBody;
    for (const child of children) {
      const childBody = child.parentElement;
      if (previousBody !== childBody) {
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

const bindAdd = () => {
  const treeColumn = getOption("treeColumn");
  const expanderClass = getOption("expanderClass");
  const expanderCollapsedClass = getOption("expanderCollapsedClass");
  const expanderExpandedClass = getOption("expanderExpandedClass");
  const addBtnClass = getOption("addBtnClass");
  const xqTreegripAdd = document.querySelector(addBtnClass);
  if (xqTreegripAdd) {
    xqTreegripAdd.addEventListener("click", () => {
      const table = getTable();
      const checks = table.querySelectorAll("tbody > tr > td:first-child > input[type=checkbox]");
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
          const node = table.querySelector("tbody:last-of-type>tr");
          if (node === null) {
            addNode(table, data2);
          } else {
            addNode(node, data2);
          }
        });
      }
    });
  }
};
const addBtnTooltip = () => {
  const addBtnClass = getOption("addBtnClass");
  const tooltipEl = document.querySelector(addBtnClass);
  if (tooltipEl) {
    if (typeof bootstrap !== void 0 && bootstrap.Tooltip !== void 0) {
      new bootstrap.Tooltip(tooltipEl);
    }
  }
};

const getPrevious = (element) => {
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

const next = (element, selector) => {
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
  }
  return null;
};
const dragElement = (e) => {
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
const dropElement = (e) => {
  let { item } = e.detail;
  const trs = item.querySelectorAll("tbody>tr:not(:first-child)");
  if (trs) {
    const table = getTable();
    for (const tr of trs) {
      const trId = tr.getAttribute("id");
      const tbodyId = "#tbody_" + trId;
      const tbody = table.querySelector(tbodyId);
      if (tbody) {
        item.after(tbody);
        item = tbody;
        tbody.append(tr);
      }
    }
  }
};
const dragUpdate = (e) => {
  const dragger_table = getTable();
  const { offsetLeft } = dragger_table;
  const detail = e.detail;
  const element = detail.item;
  const td = element.querySelector("td:first-child");
  const tr = element.querySelector("tr");
  const { offsetWidth } = td;
  const offset = detail.dragEvent.pageX - offsetLeft - offsetWidth - 10;
  const previousElement = getPrevious(element);
  const pTr = previousElement.querySelector("tr");
  if (previousElement.tagName === "THEAD") {
    setTopNode(tr);
    const data = getData(tr);
    moveNode(data);
  } else if (offset > 0) {
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
const getData = (tr) => {
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
const moveNode = (data) => {
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
const dragerTable = () => {
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

const xqTreegrid = (options = {}) => {
  setOption(options);
  const table = getTable();
  if (table) {
    build(table);
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
    dragerTable();
  }
};
domReady(() => {
  xqTreegrid();
});
window.xqTreegrid = xqTreegrid;

export { xqTreegrid as default };
