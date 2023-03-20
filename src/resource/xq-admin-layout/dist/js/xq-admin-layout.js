/*!
 * xq-admin-layout v1.0.1 (https://xqkeji.cn/demo/xq-adminpage)
 * Author xqkeji.cn
 * LICENSE SSPL-1.0
 * Copyright 2023 xqkeji.cn
 */
 "use strict";
(() => {
  // src/ts/xq-constant.ts
  var TAB_FULL = "#xq-tab-fullscreen";
  var TAB_LEFT = "#xq-tab-left";
  var TAB_RIGHT = "#xq-tab-right";
  var TAB_NAV = "#xq-tab-nav";
  var TAB_NAV_UL = "#xq-tab-nav-ul";
  var TAB_ACTIVE = "#xq-tab-nav-ul>li>a.active";
  var TAB_RIGT_MENU = "#xq-tab-contentmenu";
  var TAB_REFRESH = "#xq-tab-refresh";
  var TAB_CLOSE_ALL = "#xq-tab-close-all";
  var TAB_CLOSE_OTHER = "#xq-tab-close-other";
  var SIDEBAR = "#xq-sidebar";
  var FILEINPUT_CLASS = ".xq-fileinput";
  var MODULE_MENU = "#xq-top-nav";
  var SIDEBAR_MINI_NAME = "mini";
  var SIDEBAR_MENU_BTN = '[xq-widget="xq-mini-menu"]';
  var LAYOUT_HEADER = "#xq-header";
  var LAYOUT_CONTENT = "#xq-content";
  var LAYOUT_FOOTER = "#xq-footer";
  var CAPTCHA_CLASS = ".xq-captcha";
  var TAB_CONTENT = "#xq-tab-content";
  var TAB_CLOSE = "#xq-tab-nav-ul .nav-item .nav-link button.close";
  var TAB_ALL_SWITCH = "#xq-tab-nav-ul .nav-item .nav-link";
  var TAB_MENU_CLASS = "xq-menu";
  var SIDERBAR_A_CLASS_ACTIVE = "bg-primary";
  var SIDERBAR_A_CLASS = "bg-dark";
  var LOGOUT_CLASS = ".xq-logout";
  var MENU_OPEN_CLASS = "bi-chevron-down";
  var MENU_CLOSE_CLASS = "bi-chevron-left";

  // src/ts/xq-captcha.ts
  var bindCaptcha = () => {
    const captcha = document.querySelector(CAPTCHA_CLASS);
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
  var after = (element, dom) => {
    const node = document.createRange().createContextualFragment(dom);
    element.after(node);
  };

  // src/ts/xq-fileinput.ts
  var bindFileinput = () => {
    const fileinputs = document.querySelectorAll(FILEINPUT_CLASS);
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
    if ("required" in config) {
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

  // src/ts/xq-logout.ts
  var bindLogout = () => {
    const xq_logouts = document.querySelectorAll(LOGOUT_CLASS);
    if (xq_logouts) {
      for (const xq_logout of xq_logouts) {
        xq_logout.addEventListener("click", (event) => {
          event.preventDefault();
          const target = event.currentTarget;
          const action = target.getAttribute("href");
          const id = "xq-logout-form-" + Math.floor(Math.random() * 1e3).toString();
          const logout_form_str = '<form action="' + action + '" method="post" style="display: none;" id="' + id + '"></form>';
          append(document.body, logout_form_str);
          const logout_form = document.querySelector("#" + id);
          logout_form.submit();
        });
      }
    }
  };

  // src/ts/xq-sidebar-overlay.ts
  var Config = {
    scrollbarTheme: "os-theme-light",
    scrollbarAutoHide: "leave"
  };
  var _instance = null;
  var OverlayScrollbars = null;
  var initScrollbar = () => {
    if (typeof OverlayScrollbarsGlobal !== "undefined") {
      OverlayScrollbars = OverlayScrollbarsGlobal.OverlayScrollbars;
      if (!_instance) {
        _instance = OverlayScrollbars(document.querySelector(SIDEBAR), {
          // eslint-disable-line new-cap
          className: Config.scrollbarTheme,
          sizeAutoCapable: true,
          scrollbars: {
            autoHide: Config.scrollbarAutoHide,
            clickScrolling: true
          }
        });
      }
    }
  };
  var destroy = () => {
    if (_instance) {
      _instance.destroy();
      _instance = null;
    }
  };

  // src/ts/xq-module-menu.ts
  var bindModuleMenu = () => {
    const container = document.querySelector(MODULE_MENU);
    if (container !== null) {
      const menus = container.querySelectorAll("li a:not([xq-widget])");
      for (const menu of menus) {
        menu.addEventListener("click", (event) => {
          event.preventDefault();
          const el = event.currentTarget;
          const target_id = el.getAttribute("href");
          const target_el = document.querySelector(target_id);
          if (target_el?.classList.contains("d-none")) {
            for (const menu2 of menus) {
              if (menu2 !== el) {
                if (!menu2.classList.contains("bg-dark")) {
                  menu2.classList.add("bg-dark");
                }
                if (menu2.classList.contains("bg-primary")) {
                  menu2.classList.remove("bg-primary");
                }
                const menu_target_id = menu2.getAttribute("href");
                const target = document.querySelector(menu_target_id);
                if (!target?.classList.contains("d-none")) {
                  target?.classList.add("d-none");
                }
              } else {
                if (menu2.classList.contains("bg-dark")) {
                  menu2.classList.remove("bg-dark");
                }
                if (!menu2.classList.contains("bg-primary")) {
                  menu2.classList.add("bg-primary");
                }
                const menu_target_id = menu2.getAttribute("href");
                const target = document.querySelector(menu_target_id);
                if (target?.classList.contains("d-none")) {
                  target?.classList.remove("d-none");
                }
              }
            }
          }
        });
      }
    }
  };

  // src/ts/xq-mini-menu.ts
  var bindMiniMenu = () => {
    const btn = document.querySelector(SIDEBAR_MENU_BTN);
    if (btn) {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        const header = document.querySelector(LAYOUT_HEADER);
        if (header) {
          if (header.classList.contains(SIDEBAR_MINI_NAME)) {
            header.classList.remove(SIDEBAR_MINI_NAME);
          } else {
            header.classList.add(SIDEBAR_MINI_NAME);
          }
        }
        const sidebar = document.querySelector(SIDEBAR);
        if (sidebar) {
          if (sidebar.classList.contains(SIDEBAR_MINI_NAME)) {
            sidebar.classList.remove(SIDEBAR_MINI_NAME);
            initScrollbar();
          } else {
            sidebar.classList.add(SIDEBAR_MINI_NAME);
            destroy();
          }
        }
        const content = document.querySelector(LAYOUT_CONTENT);
        if (content) {
          if (content.classList.contains(SIDEBAR_MINI_NAME)) {
            content.classList.remove(SIDEBAR_MINI_NAME);
          } else {
            content.classList.add(SIDEBAR_MINI_NAME);
          }
        }
        const footer = document.querySelector(LAYOUT_FOOTER);
        if (footer) {
          if (footer.classList.contains(SIDEBAR_MINI_NAME)) {
            footer.classList.remove(SIDEBAR_MINI_NAME);
          } else {
            footer.classList.add(SIDEBAR_MINI_NAME);
          }
        }
      });
    }
  };

  // src/ts/tabs/xq-prev-tab.ts
  var getPrevTab = (current) => {
    let prev = null;
    const tab_ul = document.querySelector(TAB_NAV_UL);
    const lis = tab_ul.querySelectorAll("li");
    for (const li of lis) {
      if (li === current) {
        break;
      }
      prev = li;
    }
    return prev;
  };

  // src/ts/tabs/xq-active-tab.ts
  var activeTabById = (id) => {
    const tab_nav = document.querySelector(TAB_NAV_UL);
    const tab_content = document.querySelector(TAB_CONTENT);
    const tab = tab_nav.querySelector("li > a#" + id + "-tab");
    if (tab === null) {
      return;
    }
    const current_tab = tab_nav.querySelector("li > a.active");
    if (current_tab) {
      current_tab.classList.remove("active");
    }
    if (tab) {
      tab.classList.add("active");
    }
    const current_content = tab_content.querySelector("div.active");
    if (current_content) {
      current_content.classList.remove("active");
    }
    const content = tab_content.querySelector("#" + id + "-tab-content");
    if (content) {
      content.classList.add("active");
    }
    scrollTyId(id);
  };
  var scrollTyId = (id) => {
    const tab = document.querySelector(TAB_NAV);
    const tab_ul = document.querySelector(TAB_NAV_UL);
    const first_el = tab_ul.querySelector("li:first-child");
    const margin_left = Number.isNaN(Number.parseInt(first_el.style.marginLeft, 10)) ? 0 : Number.parseInt(first_el.style.marginLeft, 10);
    const abs_left_val = Math.abs(margin_left);
    const tab_all_width = tab_ul.clientWidth + abs_left_val;
    const visibleWidth = tab.clientWidth;
    let scrollVal = 0;
    if (tab_all_width > visibleWidth) {
      const active = tab_ul.querySelector("#" + id + "-tab");
      const lis = tab_ul.querySelectorAll("li>a");
      let preve_width = 0;
      for (const li of lis) {
        preve_width += li.clientWidth;
        if (li === active) {
          break;
        }
      }
      if (margin_left + preve_width > visibleWidth) {
        scrollVal = visibleWidth - preve_width;
        first_el.style.marginLeft = scrollVal < 0 ? scrollVal.toString() + "px" : "0px";
      }
    } else {
      first_el.style.marginLeft = "0px";
    }
  };

  // src/ts/tabs/xq-close.ts
  var bindCloses = () => {
    const closes = document.querySelectorAll(TAB_CLOSE);
    for (const close of closes) {
      bindClose(close);
    }
  };
  var bindClose = (close) => {
    close.addEventListener("click", (event) => {
      event.preventDefault();
      const tab_content = document.querySelector(TAB_CONTENT);
      const target_el = event.currentTarget;
      const a = target_el.parentNode;
      const aria_id = a.getAttribute("id");
      const id = aria_id.replace("-tab", "");
      const li = a?.parentNode;
      if (a.classList.contains("active")) {
        const prev = getPrevTab(li);
        const prevA = prev.querySelector("a");
        const prevId = prevA.getAttribute("id");
        const prev_id = prevId.replace("-tab", "");
        li.remove();
        tab_content.querySelector("#" + id + "-tab-content")?.remove();
        activeTabById(prev_id);
      } else {
        li.remove();
        tab_content.querySelector("#" + id + "-tab-content")?.remove();
        activeTabById(id);
      }
    });
  };

  // src/ts/tabs/xq-switch.ts
  var bindAllSwitch = () => {
    const all_switch = document.querySelectorAll(TAB_ALL_SWITCH);
    for (const el of all_switch) {
      const id = el.getAttribute("id");
      if (id !== null) {
        bindSwitch(id.replace("-tab", ""));
      }
    }
  };
  var bindSwitch = (id) => {
    const tab_nav = document.querySelector(TAB_NAV_UL);
    const tab = tab_nav.querySelector("li > a#" + id + "-tab");
    if (tab) {
      tab.addEventListener("click", (event) => {
        const target_el = event.currentTarget;
        const id2 = target_el.getAttribute("id");
        activeTabById(id2.replace("-tab", ""));
      });
    }
  };

  // src/ts/toolbar/xq-close-tabs.ts
  var closeTabs = (isAll) => {
    if (isAll) {
      const tabs = document.querySelector(TAB_NAV_UL);
      const closes = tabs.querySelectorAll("li a button.close");
      for (const close of closes) {
        close.click();
      }
      const first_li = tabs.querySelector("li:first-child");
      const first_tab = first_li.querySelector("a");
      first_tab?.classList.add("acitve");
      const first_content_id = first_tab?.getAttribute("data-bs-target");
      const first_content = document.querySelector(first_content_id);
      if (first_content) {
        first_content?.classList.add("acitve");
      }
      if (first_li) {
        first_li.style.marginLeft = "0px";
      }
    } else {
      const tabs = document.querySelector(TAB_NAV_UL);
      const closes = tabs.querySelectorAll("li a:not(.active)");
      for (const close of closes) {
        const c = close.querySelector("button.close");
        c.click();
      }
      const tab = document.querySelector(TAB_ACTIVE);
      tab.classList.add("acitve");
      const content_id = tab?.getAttribute("data-bs-target");
      const first_content = document.querySelector(content_id);
      const first_li = tabs.querySelector("li:first-child");
      if (first_content) {
        first_content?.classList.add("acitve");
      }
      if (first_li) {
        first_li.style.marginLeft = "0px";
      }
    }
  };

  // src/ts/toolbar/xq-rightmenu.ts
  var _current_tab = null;
  var bindRightMenu = (li) => {
    li.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const target = event.currentTarget;
      _current_tab = target;
      const pageY = event.pageY;
      const pageX = event.pageX;
      const right_menu = document.querySelector(TAB_RIGT_MENU);
      right_menu.style.top = pageY + "px";
      right_menu.style.left = pageX + "px";
      right_menu.style.display = "block";
    });
  };
  var rightMenu = () => {
    const tab_ul = document.querySelector(TAB_NAV_UL);
    if (tab_ul !== null) {
      const lis = tab_ul.querySelectorAll("li>a");
      for (const li of lis) {
        bindRightMenu(li);
      }
    }
  };
  var closeRightMenu = (e) => {
    const target = e.currentTarget;
    let right_menu = document.querySelector(TAB_RIGT_MENU);
    if (right_menu === null) {
      right_menu = window.parent.document.querySelector(TAB_RIGT_MENU);
    }
    if (right_menu && !right_menu.contains(target)) {
      right_menu.style.display = "none";
    }
  };
  var bindRightMenuOper = () => {
    const refresh_tab = document.querySelector(TAB_REFRESH);
    const tab_close_all = document.querySelector(TAB_CLOSE_ALL);
    const tab_close_other = document.querySelector(TAB_CLOSE_OTHER);
    if (refresh_tab !== null) {
      refresh_tab.addEventListener("click", (event) => {
        event.preventDefault();
        const tab = document.querySelector(TAB_ACTIVE);
        const target_id = tab.getAttribute("data-bs-target");
        if (target_id !== null) {
          const target_el = document.querySelector(target_id);
          if (target_el !== null) {
            const iframe = target_el.querySelector("iframe");
            if (iframe !== null) {
              iframe.contentWindow?.location.reload();
            }
          }
        }
      });
    }
    if (tab_close_all !== null) {
      tab_close_all.addEventListener("click", (event) => {
        event.preventDefault();
        closeTabs(true);
      });
    }
    if (tab_close_other) {
      tab_close_other.addEventListener("click", (event) => {
        event.preventDefault();
        closeTabs(false);
      });
    }
  };

  // src/ts/tabs/xq-add-tab.ts
  var addTab = (id, title, url) => {
    let refresh = false;
    const tab_nav = document.querySelector(TAB_NAV_UL);
    const tab_content = document.querySelector(TAB_CONTENT);
    const tab = tab_nav.querySelector("li > a#" + id + "-tab");
    if (tab === null) {
      let dom_str = '<li class="nav-item" role="presentation"><a class="nav-link" id="' + id + '-tab" data-bs-toggle="tab" data-bs-target="#' + id + '-tab-content" type="button" role="tab" aria-controls="' + id + '-tab-content" aria-selected="false">' + title + '<button type="button" class="close" aria-label="\u5173\u95ED"><span aria-hidden="true">&times;</span></button></a></li>';
      append(tab_nav, dom_str);
      dom_str = '<div class="tab-pane" id="' + id + '-tab-content" role="tabpanel" aria-labelledby="' + id + '-tab" ><iframe src="' + url + '" width="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" ></iframe></div>';
      append(tab_content, dom_str);
      bindSwitch(id);
      activeTabById(id);
      const tab_a = document.querySelector("#" + id + "-tab");
      bindRightMenu(tab_a);
      const close = tab_a.querySelector("button.close");
      bindClose(close);
    } else {
      refresh = true;
    }
    if (refresh) {
      const target_id = tab.getAttribute("aria-controls");
      const target_content = document.querySelector(target_id);
      if (target_content !== null) {
        const iframe = target_content.querySelector("iframe");
        if (iframe !== null) {
          iframe.contentWindow?.location.reload();
        }
      }
      activeTabById(target_id.replace("-tab-content", ""));
    }
  };

  // src/ts/tabs/xq-menus.ts
  var bindClick = (menus) => {
    for (const menu of menus) {
      if (!menu.classList.contains(TAB_MENU_CLASS)) {
        menu.addEventListener("click", (event) => {
          event.preventDefault();
          const target_el = event.currentTarget;
          const navs = document.querySelectorAll(SIDEBAR + " nav");
          for (const nav of navs) {
            const a_el_es = nav.querySelectorAll("a." + SIDERBAR_A_CLASS_ACTIVE);
            if (a_el_es !== null) {
              for (const a_el of a_el_es) {
                const classes = a_el.classList;
                classes.remove(SIDERBAR_A_CLASS_ACTIVE);
                classes.add(SIDERBAR_A_CLASS);
              }
            }
          }
          const url = target_el.getAttribute("href");
          const id = target_el.getAttribute("id");
          const title = target_el.querySelector("p")?.textContent;
          addTab(id, title, url);
          const t_classlist = target_el.classList;
          t_classlist.remove(SIDERBAR_A_CLASS);
          t_classlist.add(SIDERBAR_A_CLASS_ACTIVE);
          const top_parent = parents(target_el, SIDEBAR + " nav>ul>li")[0];
          const parent = target_el.parentElement;
          if (top_parent !== parent) {
            const top_el = top_parent.querySelector("a");
            if (top_el) {
              const top_classlist = top_el.classList;
              top_classlist.remove(SIDERBAR_A_CLASS);
              top_classlist.add(SIDERBAR_A_CLASS_ACTIVE);
            }
          }
        });
      } else {
        menu.addEventListener("click", (event) => {
          event.preventDefault();
          const target_el = event.currentTarget;
          const i_el = target_el.querySelector("i.xq-menu-expand");
          if (i_el !== null) {
            const li = target_el.parentNode;
            if (i_el.classList.contains(MENU_CLOSE_CLASS)) {
              const ul = li.querySelector("ul");
              if (ul !== null) {
                i_el.classList.remove(MENU_CLOSE_CLASS);
                i_el.classList.add(MENU_OPEN_CLASS);
                if (ul.classList.contains("d-none")) {
                  ul.classList.remove("d-none");
                }
                ul.classList.add("d-block");
              } else {
                let url;
                url = target_el.getAttribute("href");
                if (url !== null) {
                  fetch(url).then(async (response) => {
                    return response.json();
                  }).then((data) => {
                    let html;
                    html = "<ul>";
                    for (const menu2 of data) {
                      const url2 = menu2.url;
                      const id = menu2.id;
                      const name = menu2.name;
                      const has_submenu = menu2.has_submenu;
                      if (has_submenu) {
                        html += '<li class="nav-item"><a href="' + url2 + '" class="nav-link xq-menu" id="t_' + id + '">';
                        html += '<i class="nav-icon bi bi-circle"></i><p>' + name + '</p><span class="float-end"><i class="bi xq-menu-expand ' + MENU_CLOSE_CLASS + '"></i></span>';
                        html += "</a></li>";
                      } else {
                        html += '<li class="nav-item"><a href="' + url2 + '" class="nav-link" id="t_' + id + '">';
                        html += '<i class="nav-icon bi bi-record-circle"></i><p>' + name + "</p>";
                        html += "</a></li>";
                      }
                    }
                    html += "</ul>";
                    after(target_el, html);
                    const li2 = target_el.parentNode;
                    const ul2 = li2.querySelector("ul");
                    i_el.classList.remove(MENU_CLOSE_CLASS);
                    i_el.classList.add(MENU_OPEN_CLASS);
                    if (ul2 !== null) {
                      if (ul2.classList.contains("d-none")) {
                        ul2.classList.remove("d-none");
                      }
                      ul2.classList.add("d-block");
                      const links = ul2.querySelectorAll("a");
                      bindClick(links);
                    }
                  }).catch(() => {
                    console.log("url:" + url + ",fetch error");
                  });
                }
              }
            } else if (li !== null) {
              const ul = li.querySelector("ul");
              if (ul !== null) {
                if (ul.classList.contains("d-block")) {
                  ul.classList.remove("d-block");
                }
                ul.classList.add("d-none");
                if (i_el.classList.contains(MENU_OPEN_CLASS)) {
                  i_el.classList.remove(MENU_OPEN_CLASS);
                }
                i_el.classList.add(MENU_CLOSE_CLASS);
              }
            }
          }
        });
      }
    }
  };

  // src/ts/tabs/xq-init.ts
  var tabInit = () => {
    bindCloses();
    bindAllSwitch();
    const menus = document.querySelectorAll(SIDEBAR + " a:not(" + LOGOUT_CLASS + ")");
    bindClick(menus);
    bindLogout();
  };

  // src/ts/toolbar/xq-fullscreen.ts
  var fullscreen = () => {
    const isFullScreen = document.fullscreenElement ?? document.msFullscreenElement ?? document.mozFullScreenElement ?? document.webkitFullscreenElement ?? false;
    if (!isFullScreen) {
      const de = document.documentElement;
      const requestMethod = de.requestFullScreen || de.webkitRequestFullScreen || de.mozRequestFullScreen || de.msRequestFullScreen;
      if (requestMethod) {
        requestMethod.call(de);
      }
    } else {
      const exitMethod = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (exitMethod) {
        exitMethod.call(document);
      }
    }
  };
  var bindFullscreen = () => {
    const fullBtn = document.querySelector(TAB_FULL);
    if (fullBtn !== null) {
      fullBtn.addEventListener("click", (event) => {
        event.preventDefault();
        fullscreen();
      });
    }
  };

  // src/ts/toolbar/xq-scroll-tab.ts
  var activeTab = () => {
    const tab_ul = document.querySelector(TAB_NAV_UL);
    const active = tab_ul.querySelector(".active");
    return active;
  };
  var scrollLeft = () => {
    const tab = document.querySelector(TAB_NAV);
    const tab_ul = document.querySelector(TAB_NAV_UL);
    const first_el = tab_ul.querySelector("li:first-child");
    const abs_left_val = Math.abs(Number.parseInt(first_el.style.marginLeft, 10));
    const margin_left = Number.isNaN(abs_left_val) ? 0 : abs_left_val;
    const tab_all_width = tab_ul.clientWidth + margin_left;
    const visibleWidth = tab.clientWidth;
    let scrollVal = 0;
    if (tab_all_width > visibleWidth) {
      const active = activeTab();
      const lis = tab_ul.querySelectorAll("li>a");
      let preve_width = 0;
      for (const li of lis) {
        if (li === active) {
          break;
        }
        preve_width += li.clientWidth;
      }
      const max_scroll_width = tab_all_width - visibleWidth;
      scrollVal = preve_width > max_scroll_width ? max_scroll_width : preve_width;
      first_el.style.marginLeft = (-scrollVal).toString() + "px";
    } else {
      first_el.style.marginLeft = "0px";
    }
  };
  var scrollRight = () => {
    const tab = document.querySelector(TAB_NAV);
    const tab_ul = document.querySelector(TAB_NAV_UL);
    const first_el = tab_ul.querySelector("li:first-child");
    const margin_left = Number.isNaN(Number.parseInt(first_el.style.marginLeft, 10)) ? 0 : Number.parseInt(first_el.style.marginLeft, 10);
    const abs_left_val = Math.abs(margin_left);
    const tab_all_width = tab_ul.clientWidth + abs_left_val;
    const visibleWidth = tab.clientWidth;
    let scrollVal = 0;
    if (tab_all_width > visibleWidth) {
      const active = activeTab();
      const lis = tab_ul.querySelectorAll("li>a");
      let preve_width = 0;
      for (const li of lis) {
        preve_width += li.clientWidth;
        if (li === active) {
          break;
        }
      }
      if (margin_left < 0) {
        scrollVal = visibleWidth - preve_width;
        first_el.style.marginLeft = scrollVal < 0 ? scrollVal.toString() + "px" : "0px";
      }
    } else {
      first_el.style.marginLeft = "0px";
    }
  };
  var bindScrollLeft = () => {
    const leftBtn = document.querySelector(TAB_LEFT);
    if (leftBtn !== null) {
      leftBtn.addEventListener("click", (event) => {
        event.preventDefault();
        scrollLeft();
      });
    }
  };
  var bindScrollRight = () => {
    const rightBtn = document.querySelector(TAB_RIGHT);
    if (rightBtn !== null) {
      rightBtn.addEventListener("click", (event) => {
        event.preventDefault();
        scrollRight();
      });
    }
  };

  // src/ts/toolbar/xq-init.ts
  var toolbarInit = () => {
    bindFullscreen();
    bindScrollLeft();
    bindScrollRight();
    rightMenu();
    const { body } = document;
    body.addEventListener("click", (event) => {
      closeRightMenu(event);
    });
    bindRightMenuOper();
  };

  // src/ts/xq-postmessage.ts
  var bindMessage = () => {
    window.addEventListener("message", (e) => {
      const message = e.data;
      const callback = message.callback;
      const params = message.params;
      if (Object.hasOwn(window, callback)) {
        const process = window[callback];
        process.apply(null, params);
      }
    });
  };

  // src/ts/index.ts
  var xqAdminLayout = () => {
    bindCaptcha();
    bindFileinput();
    bindLogout();
    initScrollbar();
    bindModuleMenu();
    bindMiniMenu();
    tabInit();
    toolbarInit();
    bindMessage();
  };
  domReady(() => {
    xqAdminLayout();
  });
  window.xqAddTab = addTab;
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
