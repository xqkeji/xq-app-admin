/*!
 * xq-admin-page v1.0.1 (https://xqkeji.cn/demo/xq-admin-page)
 * Author xqkeji.cn
 * LICENSE SSPL-1.0
 * Copyright 2023 xqkeji.cn
 */
 import { parents, jsonFormData, next, domReady } from 'xq-util';
import xqConfirm from 'xq-confirm';
import sortable from 'xq-html5sortable';

const DEFAULT_OPTIONS = {
  tableClass: ".xq-table",
  dragClass: ".xq-drag",
  checkAllClass: ".xq-table .xq-check-all",
  addBtnClass: ".xq-table .xq-add",
  editBtnClass: ".xq-edit",
  deleteBtnClass: ".xq-delete",
  copyBtnClass: ".xq-copy",
  batchBtnClass: ".xq-batch",
  backPageClass: ".xq-backpage",
  authTableClass: ".xq-auth-table",
  authCheckTableClass: ".xq-auth-check-table",
  authCheckRowClass: ".xq-auth-check-row",
  captchaClass: ".xq-captcha"
};
let tablelistOptions = {};
const setOption = (options = {}) => {
  tablelistOptions = Object.assign({}, DEFAULT_OPTIONS);
  if (options) {
    for (const option in options) {
      if (Object.hasOwn(tablelistOptions, option)) {
        treegridOptions[option] = options[option];
      }
    }
  }
};
const getOption = (key) => {
  if (key in tablelistOptions) {
    return tablelistOptions[key];
  }
  const tableClass = tablelistOptions["tableClass"];
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

const bindAdd = () => {
  const addBtnClass = getOption("addBtnClass");
  const add_btn = document.querySelector(addBtnClass);
  if (add_btn) {
    add_btn.addEventListener("click", (event) => {
      const target = event.currentTarget;
      const table = parents(target, "table")[0];
      const pid = table.getAttribute("pid");
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

const bindEdit = (element) => {
  const editBtnClass = getOption("editBtnClass");
  const edit_btn = element.querySelector(editBtnClass);
  if (edit_btn) {
    edit_btn.addEventListener("click", (event) => {
      const target = event.currentTarget;
      const table = getTable();
      const pid = table?.getAttribute("pid");
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

const copy = (text) => {
  const el = document.createElement("input");
  el.setAttribute("value", text);
  document.body.append(el);
  el.select();
  document.execCommand("copy");
  el.remove();
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

const bindDelete = (element) => {
  const deleteBtnClass = getOption("deleteBtnClass");
  const delete_btn = element.querySelector(deleteBtnClass);
  if (delete_btn) {
    delete_btn.addEventListener("click", (event) => {
      const target = event.currentTarget;
      const table = getTable();
      const pid = table?.getAttribute("pid");
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
        let xq_url = table?.getAttribute("xq-url");
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

const bindBatch = () => {
  const batchBtnClass = getOption("batchBtnClass");
  const batch_btns = document.querySelectorAll(batchBtnClass);
  if (batch_btns) {
    for (const batch_btn of batch_btns) {
      batch_btn.addEventListener("click", (event) => {
        const target = event.currentTarget;
        const table = parents(target, "table")[0];
        const pid = table.getAttribute("pid");
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

const bindDrag = () => {
  const dragClass = getOption("dragClass");
  const dragger_table = document.querySelector(dragClass);
  if (dragger_table) {
    const tbody = dragger_table.querySelector("tbody");
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
        if (data.code === 200) ;
      });
    });
  }
};

const bindCheckAll = () => {
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

const bindBack = () => {
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

const bindAuth = () => {
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

const bindFileinput = () => {
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
const updateFileInputValue = (fileinput) => {
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

const bindCaptcha = () => {
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

const init = () => {
  const table = getTable();
  if (table) {
    const tres = table.querySelectorAll("tr");
    for (const tr of tres) {
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

const xqTableList = (options = {}) => {
  setOption(options);
  init();
};
domReady(() => {
  xqTableList();
});
