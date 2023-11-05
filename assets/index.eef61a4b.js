var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function noop() {
}
const identity = (x) => x;
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
let src_url_equal_anchor;
function src_url_equal(element_src, url) {
  if (!src_url_equal_anchor) {
    src_url_equal_anchor = document.createElement("a");
  }
  src_url_equal_anchor.href = url;
  return element_src === src_url_equal_anchor.href;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function null_to_empty(value) {
  return value == null ? "" : value;
}
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
function append(target, node) {
  target.appendChild(node);
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && root.host) {
    return root;
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style) {
  append(node.head || node, style);
  return style.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = data;
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList[toggle ? "add" : "remove"](name);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
  );
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active)
      clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active)
      return;
    managed_styles.forEach((info) => {
      const { ownerNode } = info.stylesheet;
      if (ownerNode)
        detach(ownerNode);
    });
    managed_styles.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail, { cancelable });
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
const null_transition = { duration: 0 };
function create_bidirectional_transition(node, fn, params, intro) {
  const options = { direction: "both" };
  let config = fn(node, params, options);
  let t = intro ? 0 : 1;
  let running_program = null;
  let pending_program = null;
  let animation_name = null;
  function clear_animation() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function init2(program, duration) {
    const d = program.b - t;
    duration *= Math.abs(d);
    return {
      a: t,
      b: program.b,
      d,
      duration,
      start: program.start,
      end: program.start + duration,
      group: program.group
    };
  }
  function go(b) {
    const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
    const program = {
      start: now() + delay,
      b
    };
    if (!b) {
      program.group = outros;
      outros.r += 1;
    }
    if (running_program || pending_program) {
      pending_program = program;
    } else {
      if (css) {
        clear_animation();
        animation_name = create_rule(node, t, b, duration, delay, easing, css);
      }
      if (b)
        tick(0, 1);
      running_program = init2(program, duration);
      add_render_callback(() => dispatch(node, b, "start"));
      loop((now2) => {
        if (pending_program && now2 > pending_program.start) {
          running_program = init2(pending_program, duration);
          pending_program = null;
          dispatch(node, running_program.b, "start");
          if (css) {
            clear_animation();
            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
          }
        }
        if (running_program) {
          if (now2 >= running_program.end) {
            tick(t = running_program.b, 1 - t);
            dispatch(node, running_program.b, "end");
            if (!pending_program) {
              if (running_program.b) {
                clear_animation();
              } else {
                if (!--running_program.group.r)
                  run_all(running_program.group.c);
              }
            }
            running_program = null;
          } else if (now2 >= running_program.start) {
            const p = now2 - running_program.start;
            t = running_program.a + running_program.d * easing(p / running_program.duration);
            tick(t, 1 - t);
          }
        }
        return !!(running_program || pending_program);
      });
    }
  }
  return {
    run(b) {
      if (is_function(config)) {
        wait().then(() => {
          config = config(options);
          go(b);
        });
      } else {
        go(b);
      }
    },
    end() {
      clear_animation();
      running_program = pending_program = null;
    }
  };
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n))
          to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2))
      update2[key] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
function useNuiEvent(action, handler) {
  const eventListener = (event) => {
    const { action: eventAction, data } = event.data;
    eventAction === action && handler(data);
  };
  onMount(() => window.addEventListener("message", eventListener));
  onDestroy(() => window.removeEventListener("message", eventListener));
}
const isEnvBrowser = () => !window.invokeNative;
const subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
const visibility = writable(false);
const currentRoute = writable(null);
const currentRouteParams = writable(null);
const deckEditMode = writable(false);
const catalogSearchMode = writable(false);
const Config = writable({
  cards: [],
  abilities: [],
  factions: []
});
const chooseSide = writable(false);
const roomSide = writable(void 0);
const roomFoeSide = writable(void 0);
const room = writable(void 0);
const spectator = writable(false);
const inGame = writable(false);
const waiting = writable(false);
const passing = writable(false);
const medicDiscard = writable(void 0);
const emreis_leader4 = writable(void 0);
const setAgile = writable(void 0);
const setHorn = writable(void 0);
const waitForDecoy = writable(void 0);
const isReDrawing = writable(false);
const hasPlayedCard = writable(false);
const cardPreview = writable(null);
const notificationStyles = {
  success: "#4caf50",
  error: "#f44336",
  warning: "#ff9800",
  info: "#2196f3"
};
const notification = writable(null);
function reset() {
  console.log("Reset UI stores");
  cardPreview.set(null);
  notification.set(null);
  deckEditMode.set(false);
  catalogSearchMode.set(false);
  currentRouteParams.set(null);
  currentRoute.set(null);
  chooseSide.set(false);
  roomSide.set(void 0);
  roomFoeSide.set(void 0);
  room.set(void 0);
  spectator.set(false);
  inGame.set(false);
  waiting.set(false);
  passing.set(false);
  medicDiscard.set(void 0);
  emreis_leader4.set(void 0);
  setAgile.set(void 0);
  setHorn.set(void 0);
  isReDrawing.set(false);
  hasPlayedCard.set(false);
}
function sendNui(eventName, data = {}) {
  if (isEnvBrowser())
    return;
  if (eventName === "close") {
    reset();
  }
  console.log("sendNui", eventName);
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(data)
  };
  const resourceName = window.GetParentResourceName ? window.GetParentResourceName() : "cardgame";
  fetch(`https://${resourceName}/${eventName}`, options).then(() => {
  }).catch((err) => console.error(err));
}
function create_if_block$c(ctx) {
  let current;
  const default_slot_template = ctx[2].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[1], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[1],
            !current ? get_all_dirty_from_scope(ctx2[1]) : get_slot_changes(default_slot_template, ctx2[1], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$u(ctx) {
  let main;
  let current;
  let if_block = ctx[0] && create_if_block$c(ctx);
  return {
    c() {
      main = element("main");
      if (if_block)
        if_block.c();
    },
    m(target, anchor) {
      insert(target, main, anchor);
      if (if_block)
        if_block.m(main, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[0]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$c(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(main, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(main);
      if (if_block)
        if_block.d();
    }
  };
}
function instance$u($$self, $$props, $$invalidate) {
  let $inGame;
  let $catalogSearchMode;
  let $deckEditMode;
  component_subscribe($$self, inGame, ($$value) => $$invalidate(3, $inGame = $$value));
  component_subscribe($$self, catalogSearchMode, ($$value) => $$invalidate(4, $catalogSearchMode = $$value));
  component_subscribe($$self, deckEditMode, ($$value) => $$invalidate(5, $deckEditMode = $$value));
  let { $$slots: slots = {}, $$scope } = $$props;
  let isVisible;
  visibility.subscribe((visible) => {
    $$invalidate(0, isVisible = visible);
  });
  useNuiEvent("open", (data) => {
    visibility.set(true);
    if (data) {
      currentRoute.set(data.route);
      currentRouteParams.set(data.params);
    }
  });
  useNuiEvent("close", () => {
    console.log("closing...");
    visibility.set(false);
    currentRoute.set(null);
    reset();
  });
  onMount(() => {
    const keyHandler = (e) => {
      if (isVisible && ["Escape", "Backspace"].includes(e.code)) {
        if (e.code === "Backspace" && ($deckEditMode || $catalogSearchMode)) {
          return;
        }
        if ($inGame) {
          sendNui("request:leaveRoom");
        }
        currentRoute.set(null);
        currentRouteParams.set(null);
        visibility.set(false);
        sendNui("close");
        reset();
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  });
  $$self.$$set = ($$props2) => {
    if ("$$scope" in $$props2)
      $$invalidate(1, $$scope = $$props2.$$scope);
  };
  return [isVisible, $$scope, slots];
}
class VisibilityProvider extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$u, create_fragment$u, safe_not_equal, {});
  }
}
const debugData = (events, timer = 1e3) => {
  if (isEnvBrowser()) {
    for (const event of events) {
      setTimeout(() => {
        window.dispatchEvent(
          new MessageEvent("message", {
            data: {
              action: event.action,
              data: event.data
            }
          })
        );
      }, timer);
    }
  }
};
var Routes = /* @__PURE__ */ ((Routes2) => {
  Routes2["booster"] = "booster";
  Routes2["deckBuilding"] = "deckBuilding";
  Routes2["catalog"] = "catalog";
  Routes2["leaderboard"] = "leaderboard";
  Routes2["cardDetails"] = "cardDetails";
  Routes2["opponentSelection"] = "opponentSelection";
  Routes2["confirmMatchmaking"] = "confirmMatchmaking";
  Routes2["battle"] = "battle";
  return Routes2;
})(Routes || {});
class CardPreviewHandler {
}
__publicField(CardPreviewHandler, "show", (card) => {
  cardPreview.set(card);
});
__publicField(CardPreviewHandler, "hide", () => {
  cardPreview.set(null);
});
const ContextMenu_svelte_svelte_type_style_lang = "";
const { window: window_1$1 } = globals;
function get_each_context$g(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[9] = list[i];
  return child_ctx;
}
function create_if_block$b(ctx) {
  let nav;
  let div;
  let ul;
  let mounted;
  let dispose;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$g(get_each_context$g(ctx, each_value, i));
  }
  return {
    c() {
      nav = element("nav");
      div = element("div");
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(ul, "class", "svelte-1iyobbn");
      attr(div, "class", "navbar svelte-1iyobbn");
      attr(div, "id", "navbar");
      set_style(nav, "position", "absolute");
      set_style(nav, "top", ctx[1].y + "px");
      set_style(nav, "left", ctx[1].x + "px");
      attr(nav, "class", "svelte-1iyobbn");
    },
    m(target, anchor) {
      insert(target, nav, anchor);
      append(nav, div);
      append(div, ul);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(ul, null);
        }
      }
      if (!mounted) {
        dispose = action_destroyer(ctx[5].call(null, nav));
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & 1) {
        each_value = ctx2[0];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$g(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$g(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(ul, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & 2) {
        set_style(nav, "top", ctx2[1].y + "px");
      }
      if (dirty & 2) {
        set_style(nav, "left", ctx2[1].x + "px");
      }
    },
    d(detaching) {
      if (detaching)
        detach(nav);
      destroy_each(each_blocks, detaching);
      mounted = false;
      dispose();
    }
  };
}
function create_else_block$4(ctx) {
  let li;
  let button;
  let i;
  let i_class_value;
  let t_value = ctx[9].displayText + "";
  let t;
  let mounted;
  let dispose;
  return {
    c() {
      li = element("li");
      button = element("button");
      i = element("i");
      t = text(t_value);
      attr(i, "class", i_class_value = null_to_empty(ctx[9].class) + " svelte-1iyobbn");
      attr(button, "class", "svelte-1iyobbn");
      attr(li, "class", "svelte-1iyobbn");
    },
    m(target, anchor) {
      insert(target, li, anchor);
      append(li, button);
      append(button, i);
      append(button, t);
      if (!mounted) {
        dispose = listen(button, "click", function() {
          if (is_function(ctx[9].onClick))
            ctx[9].onClick.apply(this, arguments);
        });
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 1 && i_class_value !== (i_class_value = null_to_empty(ctx[9].class) + " svelte-1iyobbn")) {
        attr(i, "class", i_class_value);
      }
      if (dirty & 1 && t_value !== (t_value = ctx[9].displayText + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(li);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_1$7(ctx) {
  let hr;
  return {
    c() {
      hr = element("hr");
      attr(hr, "class", "svelte-1iyobbn");
    },
    m(target, anchor) {
      insert(target, hr, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(hr);
    }
  };
}
function create_each_block$g(ctx) {
  let if_block_anchor;
  function select_block_type(ctx2, dirty) {
    if (ctx2[9].name === "hr")
      return create_if_block_1$7;
    return create_else_block$4;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    d(detaching) {
      if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function create_fragment$t(ctx) {
  let if_block_anchor;
  let mounted;
  let dispose;
  let if_block = ctx[2] && create_if_block$b(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      if (!mounted) {
        dispose = [
          listen(window_1$1, "contextmenu", prevent_default(ctx[3])),
          listen(window_1$1, "click", ctx[4])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (ctx2[2]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$b(ctx2);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$t($$self, $$props, $$invalidate) {
  let pos = { x: 0, y: 0 };
  let menu = { h: 0, w: 0 };
  let browser = { w: 0, h: 0 };
  let showMenu = false;
  function rightClickContextMenu(e) {
    onOpenChange(true);
    $$invalidate(2, showMenu = true);
    browser = {
      w: window.innerWidth,
      h: window.innerHeight
    };
    $$invalidate(1, pos = { x: e.clientX, y: e.clientY });
    if (browser.h - pos.y < menu.h)
      $$invalidate(1, pos.y = pos.y - menu.h, pos);
    if (browser.w - pos.x < menu.w)
      $$invalidate(1, pos.x = pos.x - menu.w, pos);
  }
  function onPageClick() {
    $$invalidate(2, showMenu = false);
    onOpenChange(false);
  }
  function getContextMenuDimension(node) {
    let height = node.offsetHeight;
    let width = node.offsetWidth;
    menu = { h: height, w: width };
  }
  let { menuItems = [] } = $$props;
  let { onOpenChange = () => {
  } } = $$props;
  $$self.$$set = ($$props2) => {
    if ("menuItems" in $$props2)
      $$invalidate(0, menuItems = $$props2.menuItems);
    if ("onOpenChange" in $$props2)
      $$invalidate(6, onOpenChange = $$props2.onOpenChange);
  };
  return [
    menuItems,
    pos,
    showMenu,
    rightClickContextMenu,
    onPageClick,
    getContextMenuDimension,
    onOpenChange
  ];
}
class ContextMenu extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$t, create_fragment$t, safe_not_equal, { menuItems: 0, onOpenChange: 6 });
  }
}
const Card_svelte_svelte_type_style_lang = "";
function create_if_block_2$3(ctx) {
  let span1;
  let span0;
  let t_value = ctx[0].power + "";
  let t;
  return {
    c() {
      span1 = element("span");
      span0 = element("span");
      t = text(t_value);
      attr(span1, "class", "card-attr-power");
      toggle_class(span1, "card-attr-positive", ctx[0].diffPos);
    },
    m(target, anchor) {
      insert(target, span1, anchor);
      append(span1, span0);
      append(span0, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t_value !== (t_value = ctx2[0].power + ""))
        set_data(t, t_value);
      if (dirty & 1) {
        toggle_class(span1, "card-attr-positive", ctx2[0].diffPos);
      }
    },
    d(detaching) {
      if (detaching)
        detach(span1);
    }
  };
}
function create_if_block_1$6(ctx) {
  let div;
  let t;
  return {
    c() {
      div = element("div");
      t = text(ctx[5]);
      attr(div, "class", "card-qty-holder svelte-hb0vr");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty & 32)
        set_data(t, ctx2[5]);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_if_block$a(ctx) {
  let contextmenu;
  let current;
  contextmenu = new ContextMenu({
    props: {
      onOpenChange: ctx[7],
      menuItems: ctx[9]
    }
  });
  return {
    c() {
      create_component(contextmenu.$$.fragment);
    },
    m(target, anchor) {
      mount_component(contextmenu, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(contextmenu.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(contextmenu.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(contextmenu, detaching);
    }
  };
}
function create_fragment$s(ctx) {
  let div;
  let img;
  let img_alt_value;
  let img_src_value;
  let t0;
  let t1;
  let i;
  let i_class_value;
  let t2;
  let t3;
  let if_block2_anchor;
  let current;
  let mounted;
  let dispose;
  let if_block0 = ctx[4] && create_if_block_2$3(ctx);
  let if_block1 = ctx[5] && create_if_block_1$6(ctx);
  let if_block2 = ctx[1] && create_if_block$a(ctx);
  return {
    c() {
      div = element("div");
      img = element("img");
      t0 = space();
      if (if_block0)
        if_block0.c();
      t1 = space();
      i = element("i");
      t2 = space();
      if (if_block1)
        if_block1.c();
      t3 = space();
      if (if_block2)
        if_block2.c();
      if_block2_anchor = empty();
      attr(img, "alt", img_alt_value = ctx[0].name);
      if (!src_url_equal(img.src, img_src_value = "assets/cards/" + ctx[0].faction + "/" + ctx[0].img + ".png"))
        attr(img, "src", img_src_value);
      attr(img, "class", "svelte-hb0vr");
      attr(i, "class", i_class_value = "card-sm-" + ctx[0].faction + " card-sm-" + ctx[0].faction + "-" + ctx[0].img + " svelte-hb0vr");
      attr(div, "class", "card svelte-hb0vr");
      toggle_class(div, "active", ctx[6]);
      toggle_class(div, "disabled", ctx[0].disabled);
      toggle_class(div, "highlight", ctx[3]);
      toggle_class(div, "invalid", ctx[2]);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, img);
      append(div, t0);
      if (if_block0)
        if_block0.m(div, null);
      append(div, t1);
      append(div, i);
      append(div, t2);
      if (if_block1)
        if_block1.m(div, null);
      insert(target, t3, anchor);
      if (if_block2)
        if_block2.m(target, anchor);
      insert(target, if_block2_anchor, anchor);
      current = true;
      if (!mounted) {
        dispose = [
          listen(div, "click", ctx[8]),
          listen(div, "focus", ctx[10]),
          listen(div, "keypress", ctx[8]),
          listen(div, "mouseleave", ctx[11]),
          listen(div, "mouseover", ctx[12])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (!current || dirty & 1 && img_alt_value !== (img_alt_value = ctx2[0].name)) {
        attr(img, "alt", img_alt_value);
      }
      if (!current || dirty & 1 && !src_url_equal(img.src, img_src_value = "assets/cards/" + ctx2[0].faction + "/" + ctx2[0].img + ".png")) {
        attr(img, "src", img_src_value);
      }
      if (ctx2[4]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_2$3(ctx2);
          if_block0.c();
          if_block0.m(div, t1);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (!current || dirty & 1 && i_class_value !== (i_class_value = "card-sm-" + ctx2[0].faction + " card-sm-" + ctx2[0].faction + "-" + ctx2[0].img + " svelte-hb0vr")) {
        attr(i, "class", i_class_value);
      }
      if (ctx2[5]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_1$6(ctx2);
          if_block1.c();
          if_block1.m(div, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      if (!current || dirty & 64) {
        toggle_class(div, "active", ctx2[6]);
      }
      if (!current || dirty & 1) {
        toggle_class(div, "disabled", ctx2[0].disabled);
      }
      if (!current || dirty & 8) {
        toggle_class(div, "highlight", ctx2[3]);
      }
      if (!current || dirty & 4) {
        toggle_class(div, "invalid", ctx2[2]);
      }
      if (ctx2[1]) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
          if (dirty & 2) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block$a(ctx2);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block2);
      current = true;
    },
    o(local) {
      transition_out(if_block2);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (detaching)
        detach(t3);
      if (if_block2)
        if_block2.d(detaching);
      if (detaching)
        detach(if_block2_anchor);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$s($$self, $$props, $$invalidate) {
  let { card } = $$props;
  let { contextMenu = false } = $$props;
  let { invalid = false } = $$props;
  let { highlight = false } = $$props;
  let { diff = false } = $$props;
  let { qty = null } = $$props;
  let active2 = false;
  let contextMenuOpen = false;
  const agileUnsubscriber = setAgile.subscribe((agile) => {
    $$invalidate(6, active2 = !!agile && card.key === agile);
  });
  const hornUnsubscriber = setAgile.subscribe((horn) => {
    $$invalidate(6, active2 = !!horn && card.key === horn);
  });
  const decoyUnsubscriber = setAgile.subscribe((decoy) => {
    $$invalidate(6, active2 = !!decoy && card.key === decoy);
  });
  const onContextMenu = (isOpen) => {
    contextMenuOpen = isOpen;
  };
  const onShareCard = () => {
    sendNui("share:card", { key: card.key });
    contextMenuOpen = false;
  };
  const eventDispatcher = createEventDispatcher();
  function onClick() {
    if (contextMenuOpen)
      return;
    eventDispatcher("click", card);
  }
  let contextMenuItems = [
    {
      "name": "Share",
      "onClick": onShareCard,
      "displayText": "Share Card",
      "class": "fa-solid fa-plus"
    }
  ];
  onDestroy(() => {
    agileUnsubscriber();
    hornUnsubscriber();
    decoyUnsubscriber();
  });
  onMount(() => {
  });
  const focus_handler = () => CardPreviewHandler.show(card);
  const mouseleave_handler = () => CardPreviewHandler.hide();
  const mouseover_handler = () => CardPreviewHandler.show(card);
  $$self.$$set = ($$props2) => {
    if ("card" in $$props2)
      $$invalidate(0, card = $$props2.card);
    if ("contextMenu" in $$props2)
      $$invalidate(1, contextMenu = $$props2.contextMenu);
    if ("invalid" in $$props2)
      $$invalidate(2, invalid = $$props2.invalid);
    if ("highlight" in $$props2)
      $$invalidate(3, highlight = $$props2.highlight);
    if ("diff" in $$props2)
      $$invalidate(4, diff = $$props2.diff);
    if ("qty" in $$props2)
      $$invalidate(5, qty = $$props2.qty);
  };
  return [
    card,
    contextMenu,
    invalid,
    highlight,
    diff,
    qty,
    active2,
    onContextMenu,
    onClick,
    contextMenuItems,
    focus_handler,
    mouseleave_handler,
    mouseover_handler
  ];
}
class Card extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$s, create_fragment$s, safe_not_equal, {
      card: 0,
      contextMenu: 1,
      invalid: 2,
      highlight: 3,
      diff: 4,
      qty: 5
    });
  }
}
const _NotificationHandler = class {
  static message(title, message, type, duration) {
    console.log("Notification", title, message, type, duration);
    notification.set({
      title,
      message,
      type,
      duration
    });
  }
};
let NotificationHandler = _NotificationHandler;
__publicField(NotificationHandler, "info", (message, title = "Info", duration = 5e3) => _NotificationHandler.message(title, message, "info", duration));
__publicField(NotificationHandler, "success", (message, title = "Success", duration = 5e3) => _NotificationHandler.message(title, message, "success", duration));
__publicField(NotificationHandler, "warning", (message, title = "Warning", duration = 5e3) => _NotificationHandler.message(title, message, "warning", duration));
__publicField(NotificationHandler, "error", (message, title = "Error", duration = 5e3) => _NotificationHandler.message(title, message, "error", duration));
const Catalog_svelte_svelte_type_style_lang = "";
function get_each_context$f(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[21] = list[i];
  return child_ctx;
}
function get_each_context_1$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[24] = list[i];
  return child_ctx;
}
function get_each_context_2$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[21] = list[i];
  return child_ctx;
}
function create_each_block_2$1(ctx) {
  let card;
  let current;
  function click_handler2() {
    return ctx[8](ctx[21]);
  }
  card = new Card({
    props: {
      card: ctx[21],
      diff: false,
      qty: ctx[21].qty,
      contextMenu: true
    }
  });
  card.$on("click", click_handler2);
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const card_changes = {};
      if (dirty & 2)
        card_changes.card = ctx[21];
      if (dirty & 2)
        card_changes.qty = ctx[21].qty;
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_each_block_1$2(ctx) {
  let button;
  let t_value = ctx[24].label + "";
  let t;
  let mounted;
  let dispose;
  function click_handler_1() {
    return ctx[11](ctx[24]);
  }
  return {
    c() {
      button = element("button");
      t = text(t_value);
      attr(button, "class", "filter-btn svelte-12wuyqv");
      toggle_class(button, "selected", ctx[24].id === ctx[0]);
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, t);
      if (!mounted) {
        dispose = listen(button, "click", click_handler_1);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 8 && t_value !== (t_value = ctx[24].label + ""))
        set_data(t, t_value);
      if (dirty & 9) {
        toggle_class(button, "selected", ctx[24].id === ctx[0]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function create_each_block$f(ctx) {
  let card;
  let current;
  function click_handler_2() {
    return ctx[12](ctx[21]);
  }
  card = new Card({
    props: {
      card: ctx[21],
      diff: false,
      qty: ctx[21].qty,
      contextMenu: true
    }
  });
  card.$on("click", click_handler_2);
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const card_changes = {};
      if (dirty & 4)
        card_changes.card = ctx[21];
      if (dirty & 4)
        card_changes.qty = ctx[21].qty;
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_fragment$r(ctx) {
  let div11;
  let div3;
  let div0;
  let t1;
  let div1;
  let t2;
  let div2;
  let t3;
  let div10;
  let div6;
  let div4;
  let t4;
  let h21;
  let t6;
  let div5;
  let input;
  let t7;
  let div8;
  let div7;
  let t8;
  let div9;
  let current;
  let mounted;
  let dispose;
  let each_value_2 = ctx[1];
  let each_blocks_2 = [];
  for (let i = 0; i < each_value_2.length; i += 1) {
    each_blocks_2[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
  }
  const out = (i) => transition_out(each_blocks_2[i], 1, 1, () => {
    each_blocks_2[i] = null;
  });
  let each_value_1 = ctx[3].factions;
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
  }
  let each_value = ctx[2];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
  }
  const out_1 = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div11 = element("div");
      div3 = element("div");
      div0 = element("div");
      div0.innerHTML = `<h2 class="center svelte-12wuyqv">Inventory</h2>`;
      t1 = space();
      div1 = element("div");
      t2 = space();
      div2 = element("div");
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].c();
      }
      t3 = space();
      div10 = element("div");
      div6 = element("div");
      div4 = element("div");
      t4 = space();
      h21 = element("h2");
      h21.textContent = "Catalog";
      t6 = space();
      div5 = element("div");
      input = element("input");
      t7 = space();
      div8 = element("div");
      div7 = element("div");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t8 = space();
      div9 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "header svelte-12wuyqv");
      attr(div1, "class", "faction-container svelte-12wuyqv");
      attr(div2, "class", "card-list svelte-12wuyqv");
      attr(div2, "data-id", "inventory");
      attr(div2, "id", "inventory");
      attr(div3, "class", "card-list-container svelte-12wuyqv");
      attr(div4, "class", "empty svelte-12wuyqv");
      attr(h21, "class", "center svelte-12wuyqv");
      attr(input, "type", "text");
      attr(input, "placeholder", "Search...");
      attr(input, "class", "svelte-12wuyqv");
      attr(div5, "class", "search-bar svelte-12wuyqv");
      attr(div6, "class", "header svelte-12wuyqv");
      attr(div7, "class", "class-list-filter svelte-12wuyqv");
      attr(div8, "class", "faction-container svelte-12wuyqv");
      attr(div9, "class", "card-list catalog svelte-12wuyqv");
      attr(div9, "id", "catalog");
      attr(div10, "class", "card-list-container svelte-12wuyqv");
      attr(div11, "class", "catalog-container svelte-12wuyqv");
    },
    m(target, anchor) {
      insert(target, div11, anchor);
      append(div11, div3);
      append(div3, div0);
      append(div3, t1);
      append(div3, div1);
      append(div3, t2);
      append(div3, div2);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        if (each_blocks_2[i]) {
          each_blocks_2[i].m(div2, null);
        }
      }
      append(div11, t3);
      append(div11, div10);
      append(div10, div6);
      append(div6, div4);
      append(div6, t4);
      append(div6, h21);
      append(div6, t6);
      append(div6, div5);
      append(div5, input);
      append(div10, t7);
      append(div10, div8);
      append(div8, div7);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div7, null);
        }
      }
      append(div10, t8);
      append(div10, div9);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div9, null);
        }
      }
      current = true;
      if (!mounted) {
        dispose = [
          listen(input, "focusin", ctx[9]),
          listen(input, "focusout", ctx[10]),
          listen(input, "keyup", ctx[7])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 18) {
        each_value_2 = ctx2[1];
        let i;
        for (i = 0; i < each_value_2.length; i += 1) {
          const child_ctx = get_each_context_2$1(ctx2, each_value_2, i);
          if (each_blocks_2[i]) {
            each_blocks_2[i].p(child_ctx, dirty);
            transition_in(each_blocks_2[i], 1);
          } else {
            each_blocks_2[i] = create_each_block_2$1(child_ctx);
            each_blocks_2[i].c();
            transition_in(each_blocks_2[i], 1);
            each_blocks_2[i].m(div2, null);
          }
        }
        group_outros();
        for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (dirty & 41) {
        each_value_1 = ctx2[3].factions;
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1$2(ctx2, each_value_1, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_1$2(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(div7, null);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_1.length;
      }
      if (dirty & 20) {
        each_value = ctx2[2];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$f(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$f(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div9, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out_1(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value_2.length; i += 1) {
        transition_in(each_blocks_2[i]);
      }
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks_2 = each_blocks_2.filter(Boolean);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        transition_out(each_blocks_2[i]);
      }
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div11);
      destroy_each(each_blocks_2, detaching);
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$r($$self, $$props, $$invalidate) {
  let $Config;
  component_subscribe($$self, Config, ($$value) => $$invalidate(3, $Config = $$value));
  let currentFaction = "all";
  let search = "";
  let inventory = [];
  let catalog2 = [];
  let currFactionCards = [];
  useNuiEvent("response:catalog", (data) => {
    const responseCatalog = data.catalog;
    const catalogKeys = Object.keys(responseCatalog);
    catalog2 = $Config.cards.filter((card) => catalogKeys.includes(card.key) && card.key !== "none").map((card) => {
      return {
        ...card,
        qty: responseCatalog[card.key].qty
      };
    });
    filterCardsToDisplay();
  });
  useNuiEvent("response:inventory", (inventoryData) => {
    const cardKeys = inventoryData.inventory.map((card) => card.metadata.card);
    $$invalidate(1, inventory = $Config.cards.filter((card) => cardKeys.includes(card.key) && card.key !== "none").map((card) => {
      var _a;
      const inventoryCard = inventoryData.inventory.find((inventoryCard2) => inventoryCard2.metadata.card === card.key);
      return { ...card, qty: (_a = inventoryCard == null ? void 0 : inventoryCard.count) != null ? _a : 0 };
    }));
  });
  useNuiEvent("confirmUpdate:catalog", (data) => {
    const { err, card, isRemove } = data;
    if (!!err) {
      NotificationHandler.error(err);
      return;
    }
    if (isRemove) {
      const cardIdx = catalog2.findIndex((c) => c.key === card);
      if (cardIdx > -1) {
        addToInventory(cardIdx);
      }
    } else {
      const cardIdx = inventory.findIndex((c) => c.key === card);
      if (cardIdx > -1) {
        addToCatalog(cardIdx);
      }
    }
  });
  const filterCardsToDisplay = () => {
    if (currentFaction === "all") {
      $$invalidate(2, currFactionCards = filterSearchCardList(sortCardList(catalog2)));
    } else {
      $$invalidate(2, currFactionCards = filterSearchCardList(sortCardList(catalog2.filter((c) => c.faction === currentFaction))));
    }
  };
  const sortCardList = (cardList) => {
    return cardList.sort((a, b) => {
      if (a.type !== b.type) {
        return b.type - a.type;
      } else {
        return a.key.localeCompare(b.key);
      }
    });
  };
  const filterSearchCardList = (cardList) => {
    if (search === "") {
      return cardList;
    }
    return cardList.filter((c) => c.name.toLowerCase().includes(search));
  };
  const addToInventory = (cardIdx) => {
    const card = catalog2[cardIdx];
    const invCardIdx = inventory.findIndex((c) => c.key === card.key);
    if (invCardIdx > -1) {
      $$invalidate(1, inventory[invCardIdx].qty++, inventory);
    } else {
      const copiedCard = JSON.parse(JSON.stringify(card));
      copiedCard.qty = 1;
      inventory.push(copiedCard);
    }
    if (card.qty === 1) {
      catalog2.splice(cardIdx, 1);
    } else {
      card.qty--;
    }
    $$invalidate(1, inventory);
    catalog2 = catalog2;
    filterCardsToDisplay();
  };
  const addToCatalog = (cardIdx) => {
    const card = inventory[cardIdx];
    const catalogCardIdx = catalog2.findIndex((c) => c.key === card.key);
    if (catalogCardIdx > -1) {
      catalog2[catalogCardIdx].qty++;
    } else {
      const copiedCard = JSON.parse(JSON.stringify(card));
      copiedCard.qty = 1;
      catalog2.push(copiedCard);
    }
    if (card.qty === 1) {
      inventory.splice(cardIdx, 1);
    } else {
      card.qty--;
    }
    $$invalidate(1, inventory);
    catalog2 = catalog2;
    filterCardsToDisplay();
  };
  const onCardClick = (card, section) => {
    if (section === "catalog") {
      sendNui("update:catalog", { card: card.key, isRemove: true });
      debugData(
        [
          {
            action: "confirmUpdate:catalog",
            data: {
              err: null,
              card: card.key,
              isRemove: true
            }
          }
        ],
        100
      );
    } else if (section === "inventory") {
      sendNui("update:catalog", { card: card.key, isRemove: false });
      debugData(
        [
          {
            action: "confirmUpdate:catalog",
            data: {
              err: null,
              card: card.key,
              isRemove: false
            }
          }
        ],
        100
      );
    }
    filterCardsToDisplay();
  };
  const onFactionChange = (factionId) => {
    const faction = $Config.factions.find((f) => f.id === factionId);
    if (!!faction) {
      $$invalidate(0, currentFaction = factionId);
      filterCardsToDisplay();
    }
  };
  const onSearchFocus = (focus) => {
    catalogSearchMode.set(focus);
  };
  const onSearch = (e) => {
    search = e.target.value.toLowerCase();
    filterCardsToDisplay();
  };
  onMount(() => {
  });
  const click_handler2 = (card) => onCardClick(card, "inventory");
  const focusin_handler = () => onSearchFocus(true);
  const focusout_handler = () => onSearchFocus(false);
  const click_handler_1 = (faction) => onFactionChange(faction.id);
  const click_handler_2 = (card) => onCardClick(card, "catalog");
  return [
    currentFaction,
    inventory,
    currFactionCards,
    $Config,
    onCardClick,
    onFactionChange,
    onSearchFocus,
    onSearch,
    click_handler2,
    focusin_handler,
    focusout_handler,
    click_handler_1,
    click_handler_2
  ];
}
class Catalog extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$r, create_fragment$r, safe_not_equal, {});
  }
}
const DeckBuilder_svelte_svelte_type_style_lang = "";
function get_each_context$e(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[28] = list[i];
  return child_ctx;
}
function get_each_context_1$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[31] = list[i];
  return child_ctx;
}
function get_each_context_2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[28] = list[i];
  return child_ctx;
}
function get_each_context_3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[36] = list[i];
  child_ctx[38] = i;
  return child_ctx;
}
function create_else_block$3(ctx) {
  let span;
  let t0_value = ctx[36].name + "";
  let t0;
  let t1;
  let t2;
  let button;
  let mounted;
  let dispose;
  let if_block = ctx[36].invalid && create_if_block_1$5();
  function click_handler2() {
    return ctx[17](ctx[36]);
  }
  return {
    c() {
      span = element("span");
      t0 = text(t0_value);
      t1 = space();
      if (if_block)
        if_block.c();
      t2 = space();
      button = element("button");
      button.textContent = "...";
      attr(span, "class", "deck-item-title svelte-61jhgw");
      attr(button, "class", "deck-item-edit-btn svelte-61jhgw");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      append(span, t1);
      if (if_block)
        if_block.m(span, null);
      insert(target, t2, anchor);
      insert(target, button, anchor);
      if (!mounted) {
        dispose = listen(button, "click", click_handler2);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 16 && t0_value !== (t0_value = ctx[36].name + ""))
        set_data(t0, t0_value);
      if (ctx[36].invalid) {
        if (if_block)
          ;
        else {
          if_block = create_if_block_1$5();
          if_block.c();
          if_block.m(span, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    d(detaching) {
      if (detaching)
        detach(span);
      if (if_block)
        if_block.d();
      if (detaching)
        detach(t2);
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block$9(ctx) {
  let form;
  let mounted;
  let dispose;
  function submit_handler(...args) {
    return ctx[16](ctx[36], ...args);
  }
  return {
    c() {
      form = element("form");
      form.innerHTML = `<input class="deck-item-title edit-title svelte-61jhgw" name="title" autofocus=""/> 
                                <button type="submit" class="deck-item-edit-btn svelte-61jhgw">\u2713</button>`;
      attr(form, "class", "deck-edit-form svelte-61jhgw");
    },
    m(target, anchor) {
      insert(target, form, anchor);
      if (!mounted) {
        dispose = listen(form, "submit", prevent_default(submit_handler));
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    d(detaching) {
      if (detaching)
        detach(form);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_1$5(ctx) {
  let t;
  return {
    c() {
      t = text("(invalid)");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_each_block_3(ctx) {
  let li;
  let t;
  let mounted;
  let dispose;
  function select_block_type(ctx2, dirty) {
    if (ctx2[38] === ctx2[1])
      return create_if_block$9;
    return create_else_block$3;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  function keypress_handler2() {
    return ctx[18](ctx[36]);
  }
  function click_handler_1() {
    return ctx[19](ctx[36]);
  }
  return {
    c() {
      li = element("li");
      if_block.c();
      t = space();
      attr(li, "class", "deck-list-item svelte-61jhgw");
      toggle_class(li, "selected", ctx[38] === ctx[0]);
    },
    m(target, anchor) {
      insert(target, li, anchor);
      if_block.m(li, null);
      append(li, t);
      if (!mounted) {
        dispose = [
          listen(li, "keypress", keypress_handler2),
          listen(li, "click", click_handler_1)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
        if_block.p(ctx, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx);
        if (if_block) {
          if_block.c();
          if_block.m(li, t);
        }
      }
      if (dirty[0] & 1) {
        toggle_class(li, "selected", ctx[38] === ctx[0]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(li);
      if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_2(ctx) {
  let card;
  let current;
  function click_handler_2() {
    return ctx[20](ctx[28]);
  }
  card = new Card({ props: { card: ctx[28] } });
  card.$on("click", click_handler_2);
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const card_changes = {};
      if (dirty[0] & 17)
        card_changes.card = ctx[28];
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_each_block_1$1(ctx) {
  let button;
  let t_value = ctx[31].label + "";
  let t;
  let mounted;
  let dispose;
  function click_handler_3() {
    return ctx[21](ctx[31]);
  }
  return {
    c() {
      button = element("button");
      t = text(t_value);
      attr(button, "class", "filter-btn svelte-61jhgw");
      toggle_class(button, "selected", ctx[31].id === ctx[2]);
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, t);
      if (!mounted) {
        dispose = listen(button, "click", click_handler_3);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 64 && t_value !== (t_value = ctx[31].label + ""))
        set_data(t, t_value);
      if (dirty[0] & 68) {
        toggle_class(button, "selected", ctx[31].id === ctx[2]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function create_each_block$e(ctx) {
  var _a;
  let card;
  let current;
  function click_handler_4() {
    return ctx[22](ctx[28]);
  }
  card = new Card({
    props: {
      card: ctx[28],
      diff: false,
      invalid: ctx[4][ctx[0]].invalidCards.includes((_a = ctx[28].key) != null ? _a : "")
    }
  });
  card.$on("click", click_handler_4);
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      var _a2;
      ctx = new_ctx;
      const card_changes = {};
      if (dirty[0] & 32)
        card_changes.card = ctx[28];
      if (dirty[0] & 49)
        card_changes.invalid = ctx[4][ctx[0]].invalidCards.includes((_a2 = ctx[28].key) != null ? _a2 : "");
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_fragment$q(ctx) {
  var _a, _b, _c, _d;
  let div11;
  let div9;
  let div0;
  let ul;
  let t0;
  let div8;
  let div4;
  let button0;
  let t2;
  let button1;
  let t4;
  let div3;
  let div1;
  let t5;
  let t6_value = ((_b = (_a = ctx[4][ctx[0]]) == null ? void 0 : _a.cards) != null ? _b : []).length + "";
  let t6;
  let t7;
  let div2;
  let t8;
  let t9_value = ctx[3].count + "";
  let t9;
  let t10;
  let t11_value = ctx[3].max + "";
  let t11;
  let t12;
  let button2;
  let t14;
  let button3;
  let t16;
  let div5;
  let t17;
  let div6;
  let t18;
  let div7;
  let t19;
  let div10;
  let current;
  let mounted;
  let dispose;
  let each_value_3 = ctx[4];
  let each_blocks_3 = [];
  for (let i = 0; i < each_value_3.length; i += 1) {
    each_blocks_3[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
  }
  let each_value_2 = ctx[8]((_d = (_c = ctx[4][ctx[0]]) == null ? void 0 : _c.cards) != null ? _d : []);
  let each_blocks_2 = [];
  for (let i = 0; i < each_value_2.length; i += 1) {
    each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
  }
  const out = (i) => transition_out(each_blocks_2[i], 1, 1, () => {
    each_blocks_2[i] = null;
  });
  let each_value_1 = ctx[6].factions;
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
  }
  let each_value = ctx[5];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
  }
  const out_1 = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div11 = element("div");
      div9 = element("div");
      div0 = element("div");
      ul = element("ul");
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].c();
      }
      t0 = space();
      div8 = element("div");
      div4 = element("div");
      button0 = element("button");
      button0.textContent = "New Deck";
      t2 = space();
      button1 = element("button");
      button1.textContent = "Delete Deck";
      t4 = space();
      div3 = element("div");
      div1 = element("div");
      t5 = text("Nb Cards: ");
      t6 = text(t6_value);
      t7 = space();
      div2 = element("div");
      t8 = text("Score: ");
      t9 = text(t9_value);
      t10 = text(" / ");
      t11 = text(t11_value);
      t12 = space();
      button2 = element("button");
      button2.textContent = "Cancel";
      t14 = space();
      button3 = element("button");
      button3.textContent = "Save";
      t16 = space();
      div5 = element("div");
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].c();
      }
      t17 = space();
      div6 = element("div");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t18 = space();
      div7 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t19 = space();
      div10 = element("div");
      div10.innerHTML = `<h3>Deck Building Rules</h3> 
        <p>- A deck if composed of at least 25 cards.</p> 
        <p>- The total cost of a deck cannot exceed 150 + the bonus given by the leader.</p> 
        <p>- Only one Leader is allowed per deck.</p> 
        <p>- Bronze cards can be added 3 times to a deck.</p> 
        <p>- Gold cards can be only be added 1 time to a deck.</p> 
        <p>- A deck can ony be composed of cards the same faction of the leader + ambarino cards.</p>`;
      attr(ul, "class", "deck-list svelte-61jhgw");
      attr(div0, "class", "deck-list-container svelte-61jhgw");
      attr(button0, "class", "action-btn creator-create-btn svelte-61jhgw");
      attr(button1, "class", "action-btn creator-delete-btn svelte-61jhgw");
      attr(div1, "class", "deck-card-count svelte-61jhgw");
      attr(div2, "class", "deck-score-count svelte-61jhgw");
      attr(div3, "class", "deck-info svelte-61jhgw");
      attr(button2, "class", "action-btn creator-cancel-btn svelte-61jhgw");
      attr(button3, "class", "action-btn creator-save-btn svelte-61jhgw");
      attr(div4, "class", "creator-action-container svelte-61jhgw");
      attr(div5, "class", "card-list card-list-deck svelte-61jhgw");
      attr(div5, "data-id", "deck");
      attr(div6, "class", "class-list-filter svelte-61jhgw");
      attr(div7, "class", "card-list card-list-available svelte-61jhgw");
      attr(div7, "data-id", "catalog");
      attr(div8, "class", "creator-container svelte-61jhgw");
      attr(div9, "class", "container-landing svelte-61jhgw");
      attr(div10, "class", "deck-rules svelte-61jhgw");
      attr(div11, "class", "deck-building-container svelte-61jhgw");
    },
    m(target, anchor) {
      insert(target, div11, anchor);
      append(div11, div9);
      append(div9, div0);
      append(div0, ul);
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        if (each_blocks_3[i]) {
          each_blocks_3[i].m(ul, null);
        }
      }
      append(div9, t0);
      append(div9, div8);
      append(div8, div4);
      append(div4, button0);
      append(div4, t2);
      append(div4, button1);
      append(div4, t4);
      append(div4, div3);
      append(div3, div1);
      append(div1, t5);
      append(div1, t6);
      append(div3, t7);
      append(div3, div2);
      append(div2, t8);
      append(div2, t9);
      append(div2, t10);
      append(div2, t11);
      append(div4, t12);
      append(div4, button2);
      append(div4, t14);
      append(div4, button3);
      append(div8, t16);
      append(div8, div5);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        if (each_blocks_2[i]) {
          each_blocks_2[i].m(div5, null);
        }
      }
      append(div8, t17);
      append(div8, div6);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div6, null);
        }
      }
      append(div8, t18);
      append(div8, div7);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div7, null);
        }
      }
      append(div11, t19);
      append(div11, div10);
      current = true;
      if (!mounted) {
        dispose = [
          listen(button0, "click", ctx[9]),
          listen(button1, "click", ctx[10]),
          listen(button3, "click", ctx[15])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      var _a2, _b2, _c2, _d2;
      if (dirty[0] & 14355) {
        each_value_3 = ctx2[4];
        let i;
        for (i = 0; i < each_value_3.length; i += 1) {
          const child_ctx = get_each_context_3(ctx2, each_value_3, i);
          if (each_blocks_3[i]) {
            each_blocks_3[i].p(child_ctx, dirty);
          } else {
            each_blocks_3[i] = create_each_block_3(child_ctx);
            each_blocks_3[i].c();
            each_blocks_3[i].m(ul, null);
          }
        }
        for (; i < each_blocks_3.length; i += 1) {
          each_blocks_3[i].d(1);
        }
        each_blocks_3.length = each_value_3.length;
      }
      if ((!current || dirty[0] & 17) && t6_value !== (t6_value = ((_b2 = (_a2 = ctx2[4][ctx2[0]]) == null ? void 0 : _a2.cards) != null ? _b2 : []).length + ""))
        set_data(t6, t6_value);
      if ((!current || dirty[0] & 8) && t9_value !== (t9_value = ctx2[3].count + ""))
        set_data(t9, t9_value);
      if ((!current || dirty[0] & 8) && t11_value !== (t11_value = ctx2[3].max + ""))
        set_data(t11, t11_value);
      if (dirty[0] & 401) {
        each_value_2 = ctx2[8]((_d2 = (_c2 = ctx2[4][ctx2[0]]) == null ? void 0 : _c2.cards) != null ? _d2 : []);
        let i;
        for (i = 0; i < each_value_2.length; i += 1) {
          const child_ctx = get_each_context_2(ctx2, each_value_2, i);
          if (each_blocks_2[i]) {
            each_blocks_2[i].p(child_ctx, dirty);
            transition_in(each_blocks_2[i], 1);
          } else {
            each_blocks_2[i] = create_each_block_2(child_ctx);
            each_blocks_2[i].c();
            transition_in(each_blocks_2[i], 1);
            each_blocks_2[i].m(div5, null);
          }
        }
        group_outros();
        for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (dirty[0] & 16452) {
        each_value_1 = ctx2[6].factions;
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1$1(ctx2, each_value_1, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_1$1(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(div6, null);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_1.length;
      }
      if (dirty[0] & 177) {
        each_value = ctx2[5];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$e(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$e(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div7, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out_1(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value_2.length; i += 1) {
        transition_in(each_blocks_2[i]);
      }
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks_2 = each_blocks_2.filter(Boolean);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        transition_out(each_blocks_2[i]);
      }
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div11);
      destroy_each(each_blocks_3, detaching);
      destroy_each(each_blocks_2, detaching);
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$q($$self, $$props, $$invalidate) {
  let $Config;
  component_subscribe($$self, Config, ($$value) => $$invalidate(6, $Config = $$value));
  let currentDeck = 0;
  let editedDeck = null;
  let currentFaction = "ambarino";
  let deckCount = { count: 0, max: 150 };
  let decks = [];
  let catalog2 = $Config.cards;
  let availableCards = [];
  useNuiEvent("response:decks", (data) => {
    const responseDecks = data.decks;
    $$invalidate(4, decks = Object.entries(responseDecks).map((deck) => ({
      ...deck[1],
      cards: deck[1].cards.map((c) => catalog2.find((cc) => cc.key === c)),
      id: deck[0].toString(),
      name: deck[1].name,
      faction: deck[1].faction,
      invalid: !!deck[1].invalidCards && deck[1].invalidCards.length > 0
    })));
    calculateDeckCount();
    filterUnusedCards();
  });
  useNuiEvent("response:catalog", (data) => {
    const responseCatalog = data.catalog;
    const catalogKeys = Object.keys(responseCatalog);
    catalog2 = catalog2.filter((card) => !!card.key && catalogKeys.includes(card.key));
    $$invalidate(4, decks = decks.map((deck) => ({
      ...deck,
      cards: deck.cards.filter((c) => !!c.key && catalogKeys.includes(c.key))
    })));
    calculateDeckCount();
    filterUnusedCards();
  });
  const onCardClick = (card, section) => {
    const deck = decks[currentDeck];
    if (section === "catalog") {
      const newCard = catalog2.find((c) => c.key === card.key);
      if (!!newCard) {
        addCardToDeck(newCard);
      }
    } else if (section === "deck") {
      const foundCard = deck.cards.findIndex((c) => c.key === card.key);
      if (foundCard > -1) {
        deck.cards.splice(foundCard, 1);
      }
    }
    $$invalidate(4, decks);
    calculateDeckCount();
    filterUnusedCards();
  };
  const addCardToDeck = (card) => {
    if (decks[currentDeck] === void 0) {
      return;
    }
    const deck = decks[currentDeck];
    const leaderIdx = deck.cards.findIndex((c) => c.type === 3);
    if (card.type === 3) {
      if (leaderIdx > -1) {
        deck.cards.splice(leaderIdx, 1);
      }
      deck.cards = deck.cards.filter((c) => [card.faction, "ambarino"].includes(c.faction));
      deck.cards.push(card);
      deck.faction = card.faction;
      return;
    }
    if (leaderIdx > -1) {
      const leader = deck.cards[leaderIdx];
      if (card.faction !== "ambarino" && card.faction !== leader.faction) {
        return;
      }
    }
    if (deckCount.count + card.provision_cost > deckCount.max)
      return;
    deck.cards.push(card);
    $$invalidate(4, decks);
  };
  const getFreeDeckId = () => {
    return `tempdeckid${decks.length + 1}`;
  };
  const filterUnusedCards = () => {
    if (decks[currentDeck] === void 0) {
      $$invalidate(5, availableCards = []);
      return;
    }
    const deck = decks[currentDeck];
    let available = catalog2.filter((c) => deck.cards.filter((dc) => dc.key === c.key).length < (c.category === 0 ? 3 : 1));
    $$invalidate(5, availableCards = sortCardList(available.filter((c) => c.faction === currentFaction)));
  };
  const sortCardList = (cardList) => {
    return cardList.sort((a, b) => {
      if (a.type !== b.type) {
        if (a.type === 3) {
          return -1;
        } else if (b.type === 3) {
          return 1;
        }
        return a.type - b.type;
      } else {
        return a.key.localeCompare(b.key);
      }
    });
  };
  const onCreate = () => {
    const newDeckId = getFreeDeckId();
    $$invalidate(0, currentDeck = decks.push({
      id: newDeckId,
      name: `New Deck ${decks.length + 1}`,
      faction: "ambarino",
      invalid: false,
      invalidCards: [],
      cards: []
    }) - 1);
    $$invalidate(4, decks);
    calculateDeckCount();
    filterUnusedCards();
  };
  const onDelete = () => {
    if (decks[currentDeck] === void 0) {
      return;
    }
    $$invalidate(4, decks = decks.filter((d, idx) => idx !== currentDeck));
    $$invalidate(0, currentDeck = currentDeck - 1 < 0 ? 0 : currentDeck - 1);
    calculateDeckCount();
    filterUnusedCards();
  };
  const onDeckChange = (deckId) => {
    const deckIdx = decks.findIndex((d) => d.id === deckId);
    if (editedDeck === deckIdx) {
      return;
    }
    if (deckIdx >= 0) {
      $$invalidate(1, editedDeck = null);
      $$invalidate(0, currentDeck = deckIdx);
    }
    calculateDeckCount();
    filterUnusedCards();
  };
  const onDeckTitleEdit = (deckId) => {
    const deckIdx = decks.findIndex((d) => d.id === deckId);
    if (deckIdx >= 0) {
      $$invalidate(1, editedDeck = editedDeck === deckIdx ? null : deckIdx);
      deckEditMode.set(editedDeck !== null);
    }
  };
  const onDeckTitleChange = (deckId, event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const value = event.target;
    if (editedDeck == null || decks[editedDeck] === void 0) {
      return;
    }
    const deck = decks[editedDeck];
    $$invalidate(1, editedDeck = null);
    if (deck.id !== deckId) {
      return;
    }
    const formData = new FormData(value);
    deck.name = formData.get("title");
    deckEditMode.set(false);
  };
  const onFactionChange = (factionId) => {
    const faction = $Config.factions.find((f) => f.id === factionId);
    if (!!faction) {
      $$invalidate(2, currentFaction = factionId);
      filterUnusedCards();
    }
  };
  const onSave = () => {
    if (decks[currentDeck] === void 0) {
      NotificationHandler.error("Unknown selected Deck.");
      return;
    }
    const deck = decks[currentDeck];
    if (!!deck.invalidCards && deck.invalidCards.length > 0) {
      for (const card of deck.cards) {
        if (deck.invalidCards.includes(card.key)) {
          NotificationHandler.error("The deck contains cards that are not in your catalog.");
          return;
        }
      }
    }
    if (deck.cards.length < 25) {
      NotificationHandler.error("Not enough cards in deck.\nA deck should contain at least 25 cards.");
      return;
    }
    const leaderIdx = deck.cards.findIndex((c) => c.type === 3);
    if (leaderIdx === -1) {
      NotificationHandler.error("Please add a leader to your Deck.");
      return;
    }
    const formattedDeck = {
      ...deck,
      cards: deck.cards.map((c) => c.key)
    };
    sendNui("save:deck", formattedDeck);
    NotificationHandler.success("Saved !");
  };
  const calculateDeckCount = () => {
    if (decks[currentDeck] === void 0) {
      $$invalidate(3, deckCount = { count: 0, max: 150 });
      return;
    }
    const deck = decks[currentDeck];
    const leaderCard = deck.cards.find((c) => c.type === 3);
    const leaderCost = !!leaderCard ? leaderCard.provision_cost : 0;
    const cardCount = deck.cards.reduce(
      (a, b) => {
        return a + b.provision_cost;
      },
      0
    ) - leaderCost;
    $$invalidate(3, deckCount = { count: cardCount, max: 150 + leaderCost });
  };
  onMount(() => {
  });
  const submit_handler = (deck, e) => onDeckTitleChange(deck.id, e);
  const click_handler2 = (deck) => onDeckTitleEdit(deck.id);
  const keypress_handler2 = (deck) => onDeckChange(deck.id);
  const click_handler_1 = (deck) => onDeckChange(deck.id);
  const click_handler_2 = (card) => onCardClick(card, "deck");
  const click_handler_3 = (faction) => onFactionChange(faction.id);
  const click_handler_4 = (card) => onCardClick(card, "catalog");
  return [
    currentDeck,
    editedDeck,
    currentFaction,
    deckCount,
    decks,
    availableCards,
    $Config,
    onCardClick,
    sortCardList,
    onCreate,
    onDelete,
    onDeckChange,
    onDeckTitleEdit,
    onDeckTitleChange,
    onFactionChange,
    onSave,
    submit_handler,
    click_handler2,
    keypress_handler2,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    click_handler_4
  ];
}
class DeckBuilder extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$q, create_fragment$q, safe_not_equal, {}, null, [-1, -1]);
  }
}
const Leaderboard_svelte_svelte_type_style_lang = "";
function get_each_context$d(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[1] = list[i];
  child_ctx[3] = i;
  return child_ctx;
}
function create_each_block$d(ctx) {
  let li;
  let span0;
  let t0_value = ctx[3] + 1 + "";
  let t0;
  let t1;
  let span1;
  let t2_value = ctx[1].name + "";
  let t2;
  let t3;
  let span2;
  let t4_value = ctx[1].score + "";
  let t4;
  let t5;
  return {
    c() {
      li = element("li");
      span0 = element("span");
      t0 = text(t0_value);
      t1 = space();
      span1 = element("span");
      t2 = text(t2_value);
      t3 = space();
      span2 = element("span");
      t4 = text(t4_value);
      t5 = space();
      attr(span0, "class", "rank svelte-iqzzk0");
      attr(span1, "class", "name svelte-iqzzk0");
      attr(span2, "class", "score svelte-iqzzk0");
      attr(li, "class", "player svelte-iqzzk0");
    },
    m(target, anchor) {
      insert(target, li, anchor);
      append(li, span0);
      append(span0, t0);
      append(li, t1);
      append(li, span1);
      append(span1, t2);
      append(li, t3);
      append(li, span2);
      append(span2, t4);
      append(li, t5);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t2_value !== (t2_value = ctx2[1].name + ""))
        set_data(t2, t2_value);
      if (dirty & 1 && t4_value !== (t4_value = ctx2[1].score + ""))
        set_data(t4, t4_value);
    },
    d(detaching) {
      if (detaching)
        detach(li);
    }
  };
}
function create_fragment$p(ctx) {
  let div;
  let ul;
  let li;
  let t5;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
  }
  return {
    c() {
      div = element("div");
      ul = element("ul");
      li = element("li");
      li.innerHTML = `<h3 class="rank svelte-iqzzk0">Rank</h3> 
            <h3 class="name svelte-iqzzk0">Name</h3> 
            <h3 class="score svelte-iqzzk0">Score</h3>`;
      t5 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(li, "class", "player header svelte-iqzzk0");
      attr(ul, "class", "leaderboard-list svelte-iqzzk0");
      attr(div, "class", "leaderboard-container svelte-iqzzk0");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, ul);
      append(ul, li);
      append(ul, t5);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(ul, null);
        }
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1) {
        each_value = ctx2[0];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$d(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$d(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(ul, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
    }
  };
}
function instance$p($$self, $$props, $$invalidate) {
  let players = [];
  useNuiEvent("response:leaderboard", (data) => {
    $$invalidate(0, players = data.leaderboard);
  });
  onMount(() => {
  });
  return [players];
}
class Leaderboard extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$p, create_fragment$p, safe_not_equal, {});
  }
}
const altArts = [
  "swsh12pt5gg-GG35",
  "swsh12pt5gg-GG36",
  "swsh12pt5gg-GG37",
  "swsh12pt5gg-GG38",
  "swsh12pt5gg-GG39",
  "swsh12pt5gg-GG40",
  "swsh12pt5gg-GG41",
  "swsh12pt5gg-GG42",
  "swsh12pt5gg-GG43",
  "swsh12pt5gg-GG44",
  "swsh12pt5gg-GG45",
  "swsh12pt5gg-GG46",
  "swsh12pt5gg-GG47",
  "swsh12pt5gg-GG48",
  "swsh12pt5gg-GG49",
  "swsh12pt5gg-GG50",
  "swsh12pt5gg-GG51",
  "swsh12pt5gg-GG52",
  "swsh12pt5gg-GG53",
  "swsh12pt5gg-GG54",
  "swsh12pt5gg-GG55",
  "swsh12pt5gg-GG56",
  "swsh12-177",
  "swsh12-181",
  "swsh12-184",
  "swsh12-186",
  "swsh12tg-TG12",
  "swsh12tg-TG13",
  "swsh12tg-TG14",
  "swsh12tg-TG15",
  "swsh12tg-TG16",
  "swsh12tg-TG17",
  "swsh12tg-TG18",
  "swsh12tg-TG19",
  "swsh12tg-TG20",
  "swsh12tg-TG21",
  "swsh12tg-TG22",
  "swsh11-177",
  "swsh11-180",
  "swsh11-186",
  "swsh11tg-TG12",
  "swsh11tg-TG13",
  "swsh11tg-TG14",
  "swsh11tg-TG15",
  "swsh11tg-TG16",
  "swsh11tg-TG17",
  "swsh11tg-TG18",
  "swsh11tg-TG19",
  "swsh11tg-TG20",
  "swsh11tg-TG21",
  "swsh11tg-TG22",
  "pgo-72",
  "pgo-74",
  "swsh10-161",
  "swsh10-163",
  "swsh10-167",
  "swsh10-172",
  "swsh10-175",
  "swsh10-177",
  "swsh10tg-TG13",
  "swsh10tg-TG14",
  "swsh10tg-TG15",
  "swsh10tg-TG16",
  "swsh10tg-TG17",
  "swsh10tg-TG18",
  "swsh10tg-TG19",
  "swsh10tg-TG20",
  "swsh10tg-TG21",
  "swsh10tg-TG22",
  "swsh10tg-TG23",
  "swsh9-154",
  "swsh9-156",
  "swsh9-162",
  "swsh9-166",
  "swsh9tg-TG13",
  "swsh9tg-TG14",
  "swsh9tg-TG15",
  "swsh9tg-TG16",
  "swsh9tg-TG17",
  "swsh9tg-TG18",
  "swsh9tg-TG19",
  "swsh9tg-TG20",
  "swsh9tg-TG21",
  "swsh9tg-TG22",
  "swsh9tg-TG23",
  "swsh8-245",
  "swsh8-251",
  "swsh8-252",
  "swsh8-255",
  "swsh8-257",
  "swsh8-266",
  "swsh8-269",
  "swsh8-270",
  "swsh8-271",
  "swsh7-167",
  "swsh7-175",
  "swsh7-180",
  "swsh7-182",
  "swsh7-184",
  "swsh7-186",
  "swsh7-189",
  "swsh7-192",
  "swsh7-194",
  "swsh7-196",
  "swsh7-198",
  "swsh7-205",
  "swsh7-209",
  "swsh7-212",
  "swsh7-215",
  "swsh7-218",
  "swsh7-220",
  "swsh6-164",
  "swsh6-166",
  "swsh6-168",
  "swsh6-170",
  "swsh6-172",
  "swsh6-174",
  "swsh6-177",
  "swsh6-179",
  "swsh6-183",
  "swsh6-185",
  "swsh6-201",
  "swsh6-203",
  "swsh6-205",
  "swsh5-146",
  "swsh5-151",
  "swsh5-153",
  "swsh5-155",
  "swsh5-168",
  "swsh5-170",
  "swshp-SWSH179",
  "swshp-SWSH180",
  "swshp-SWSH181",
  "swshp-SWSH182",
  "swshp-SWSH183",
  "swshp-SWSH184",
  "swshp-SWSH204",
  "swshp-SWSH260",
  "swshp-SWSH261",
  "swshp-SWSH262"
];
const normal = {
  id: "sm10-33",
  set: "sm10",
  name: "Squirtle",
  supertype: "Pok\xE9mon",
  subtypes: [
    "Basic"
  ],
  types: [
    "Water"
  ],
  number: "33",
  rarity: "Common",
  images: {
    small: "https://images.pokemontcg.io/sm10/33.png",
    large: "https://images.pokemontcg.io/sm10/33_hires.png"
  }
};
const ancient_rainbow = {
  id: "swsh12pt5-160",
  set: "swsh12pt5",
  name: "Pikachu",
  supertype: "Pok\xE9mon",
  subtypes: [
    "Basic"
  ],
  types: [
    "Lightning"
  ],
  number: "160",
  rarity: "Rare Secret",
  images: {
    small: "https://images.pokemontcg.io/swsh12pt5/160.png",
    large: "https://images.pokemontcg.io/swsh12pt5/160_hires.png"
  }
};
const red_squares = {
  id: "pgo-11",
  set: "pgo",
  name: "Radiant Charizard",
  supertype: "Pok\xE9mon",
  subtypes: [
    "Basic",
    "Radiant"
  ],
  types: [
    "Fire"
  ],
  number: "11",
  rarity: "Radiant Rare",
  images: {
    small: "https://images.pokemontcg.io/pgo/11.png",
    large: "https://images.pokemontcg.io/pgo/11_hires.png",
    foil: "/img/foils/pgo/foils/011_foil_etched_radiantholo.jpg",
    mask: "/img/foils/pgo/masks/011_foil_etched_radiantholo.png"
  }
};
const purple_squares = {
  id: "swsh12-59",
  set: "swsh12",
  name: "Radiant Alakazam",
  supertype: "Pok\xE9mon",
  subtypes: [
    "Basic",
    "Radiant"
  ],
  types: [
    "Psychic"
  ],
  number: "59",
  rarity: "Radiant Rare",
  images: {
    small: "https://images.pokemontcg.io/swsh12/59.png",
    large: "https://images.pokemontcg.io/swsh12/59_hires.png",
    foil: "/img/foils/swsh12/foils/059_foil_etched_radiantholo.jpg",
    mask: "/img/foils/swsh12/masks/059_foil_etched_radiantholo.png"
  }
};
const green_squares = {
  id: "swsh12-120",
  set: "swsh12",
  name: "Radiant Jirachi",
  supertype: "Pok\xE9mon",
  subtypes: [
    "Basic",
    "Radiant"
  ],
  types: [
    "Metal"
  ],
  number: "120",
  rarity: "Radiant Rare",
  images: {
    small: "https://images.pokemontcg.io/swsh12/120.png",
    large: "https://images.pokemontcg.io/swsh12/120_hires.png",
    foil: "/img/foils/swsh12/foils/120_foil_etched_radiantholo.jpg",
    mask: "/img/foils/swsh12/masks/120_foil_etched_radiantholo.png"
  }
};
const smooth_rainbow = {
  id: "swsh11tg-TG03",
  set: "swsh11tg",
  name: "Charizard",
  supertype: "Pok\xE9mon",
  subtypes: [
    "Stage 2"
  ],
  types: [
    "Fire"
  ],
  number: "TG03",
  rarity: "trainer gallery rare holo",
  images: {
    small: "https://images.pokemontcg.io/swsh11tg/TG03.png",
    large: "https://images.pokemontcg.io/swsh11tg/TG03_hires.png",
    foil: "/img/foils/swsh11/foils/tg03_foil_holo_rainbow.jpg",
    mask: "/img/foils/swsh11/masks/tg03_foil_holo_rainbow.png"
  }
};
const reflect = {
  id: "swsh7-110",
  set: "swsh7",
  name: "Rayquaza V",
  supertype: "Pok\xE9mon",
  subtypes: [
    "Basic",
    "V",
    "Rapid Strike"
  ],
  types: [
    "Dragon"
  ],
  number: "110",
  rarity: "Rare Holo V",
  images: {
    small: "https://images.pokemontcg.io/swsh7/110.png",
    large: "https://images.pokemontcg.io/swsh7/110_hires.png",
    foil: "/img/foils/swsh7/foils/110_foil_holo_sunpillar.jpg",
    mask: "/img/foils/swsh7/masks/110_foil_holo_sunpillar.png"
  }
};
const light_reflect = {
  id: "swsh8-250",
  set: "swsh8",
  name: "Mew V",
  supertype: "Pok\xE9mon",
  subtypes: [
    "Basic",
    "V",
    "Fusion Strike"
  ],
  types: [
    "Psychic"
  ],
  number: "250",
  rarity: "Rare Ultra",
  images: {
    small: "https://images.pokemontcg.io/swsh8/250.png",
    large: "https://images.pokemontcg.io/swsh8/250_hires.png",
    foil: "/img/foils/swsh8/foils/250_foil_etched_sunpillar.jpg",
    mask: "/img/foils/swsh8/masks/250_foil_etched_sunpillar.png"
  }
};
const ancient_reflect = {
  id: "swshp-SWSH180",
  set: "swshp",
  name: "Flareon VMAX",
  supertype: "Pok\xE9mon",
  subtypes: [
    "VMAX",
    "Single Strike"
  ],
  types: [
    "Fire"
  ],
  number: "SWSH180",
  rarity: "Rare Rainbow",
  images: {
    small: "https://images.pokemontcg.io/swshp/SWSH180.png",
    large: "https://images.pokemontcg.io/swshp/SWSH180_hires.png"
  }
};
const light_ancient_reflect = {
  id: "swsh7-29",
  set: "swsh7",
  name: "Gyarados VMAX",
  supertype: "Pok\xE9mon",
  subtypes: [
    "VMAX"
  ],
  types: [
    "Water"
  ],
  number: "29",
  rarity: "Rare Holo VMAX",
  images: {
    small: "https://images.pokemontcg.io/swsh7/29.png",
    large: "https://images.pokemontcg.io/swsh7/29_hires.png",
    foil: "/img/foils/swsh7/foils/029_foil_etched_sunpillar.jpg",
    mask: "/img/foils/swsh7/masks/029_foil_etched_sunpillar.png"
  }
};
const illusion_rainbow = {
  id: "swsh8-270",
  set: "swsh8",
  name: "Espeon VMAX",
  supertype: "Pok\xE9mon",
  subtypes: [
    "VMAX"
  ],
  types: [
    "Psychic"
  ],
  number: "270",
  rarity: "Rare Rainbow",
  images: {
    small: "https://images.pokemontcg.io/swsh8/270.png",
    large: "https://images.pokemontcg.io/swsh8/270_hires.png",
    foil: "/img/foils/swsh8/foils/270_foil_etched_swsecret.jpg",
    mask: "/img/foils/swsh8/masks/270_foil_etched_swsecret.png"
  }
};
const angular_reflect = {
  id: "pgo-31",
  set: "pgo",
  name: "Mewtwo VSTAR",
  supertype: "Pok\xE9mon",
  subtypes: [
    "VSTAR"
  ],
  types: [
    "Psychic"
  ],
  number: "31",
  rarity: "Rare Holo VSTAR",
  images: {
    small: "https://images.pokemontcg.io/pgo/31.png",
    large: "https://images.pokemontcg.io/pgo/31_hires.png",
    foil: "/img/foils/pgo/foils/031_foil_etched_sunpillar.jpg",
    mask: "/img/foils/pgo/masks/031_foil_etched_sunpillar.png"
  }
};
const light_angular_reflect = {
  id: "swsh6-196",
  set: "swsh6",
  name: "Peonia",
  supertype: "Trainer",
  subtypes: [
    "Supporter"
  ],
  number: "196",
  rarity: "Rare Ultra",
  images: {
    small: "https://images.pokemontcg.io/swsh6/196.png",
    large: "https://images.pokemontcg.io/swsh6/196_hires.png",
    foil: "/img/foils/swsh6/foils/196_foil_etched_sunpillar.jpg",
    mask: "/img/foils/swsh6/masks/196_foil_etched_sunpillar.png"
  }
};
const maze = {
  id: "swsh2-209",
  set: "swsh2",
  name: "Twin Energy",
  supertype: "Energy",
  subtypes: [
    "Special"
  ],
  number: "209",
  rarity: "Rare Secret",
  images: {
    small: "https://images.pokemontcg.io/swsh2/209.png",
    large: "https://images.pokemontcg.io/swsh2/209_hires.png",
    foil: "/img/foils/swsh2/foils/209_foil_etched_swsecret.jpg",
    mask: "/img/foils/swsh2/masks/209_foil_etched_swsecret.png"
  }
};
const galaxy = {
  id: "swsh9tg-TG17",
  set: "swsh9tg",
  name: "Mimikyu VMAX",
  supertype: "Pok\xE9mon",
  subtypes: [
    "VMAX"
  ],
  types: [
    "Psychic"
  ],
  number: "TG17",
  rarity: "Rare Holo VMAX",
  images: {
    small: "https://images.pokemontcg.io/swsh9tg/TG17.png",
    large: "https://images.pokemontcg.io/swsh9tg/TG17_hires.png",
    foil: "/img/foils/swsh9/foils/tg17_foil_etched_sunpillar.jpg",
    mask: "/img/foils/swsh9/masks/tg17_foil_etched_sunpillar.png"
  }
};
const cards$1 = {
  normal,
  ancient_rainbow,
  red_squares,
  purple_squares,
  green_squares,
  smooth_rainbow,
  reflect,
  light_reflect,
  ancient_reflect,
  light_ancient_reflect,
  illusion_rainbow,
  angular_reflect,
  light_angular_reflect,
  maze,
  galaxy
};
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function tick_spring(ctx, last_value, current_value, target_value) {
  if (typeof current_value === "number" || is_date(current_value)) {
    const delta = target_value - current_value;
    const velocity = (current_value - last_value) / (ctx.dt || 1 / 60);
    const spring2 = ctx.opts.stiffness * delta;
    const damper = ctx.opts.damping * velocity;
    const acceleration = (spring2 - damper) * ctx.inv_mass;
    const d = (velocity + acceleration) * ctx.dt;
    if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
      return target_value;
    } else {
      ctx.settled = false;
      return is_date(current_value) ? new Date(current_value.getTime() + d) : current_value + d;
    }
  } else if (Array.isArray(current_value)) {
    return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
  } else if (typeof current_value === "object") {
    const next_value = {};
    for (const k in current_value) {
      next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
    }
    return next_value;
  } else {
    throw new Error(`Cannot spring ${typeof current_value} values`);
  }
}
function spring(value, opts = {}) {
  const store = writable(value);
  const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
  let last_time;
  let task;
  let current_token;
  let last_value = value;
  let target_value = value;
  let inv_mass = 1;
  let inv_mass_recovery_rate = 0;
  let cancel_task = false;
  function set(new_value, opts2 = {}) {
    target_value = new_value;
    const token = current_token = {};
    if (value == null || opts2.hard || spring2.stiffness >= 1 && spring2.damping >= 1) {
      cancel_task = true;
      last_time = now();
      last_value = new_value;
      store.set(value = target_value);
      return Promise.resolve();
    } else if (opts2.soft) {
      const rate = opts2.soft === true ? 0.5 : +opts2.soft;
      inv_mass_recovery_rate = 1 / (rate * 60);
      inv_mass = 0;
    }
    if (!task) {
      last_time = now();
      cancel_task = false;
      task = loop((now2) => {
        if (cancel_task) {
          cancel_task = false;
          task = null;
          return false;
        }
        inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
        const ctx = {
          inv_mass,
          opts: spring2,
          settled: true,
          dt: (now2 - last_time) * 60 / 1e3
        };
        const next_value = tick_spring(ctx, last_value, value, target_value);
        last_time = now2;
        last_value = value;
        store.set(value = next_value);
        if (ctx.settled) {
          task = null;
        }
        return !ctx.settled;
      });
    }
    return new Promise((fulfil) => {
      task.promise.then(() => {
        if (token === current_token)
          fulfil();
      });
    });
  }
  const spring2 = {
    set,
    update: (fn, opts2) => set(fn(target_value, value), opts2),
    subscribe: store.subscribe,
    stiffness,
    damping,
    precision
  };
  return spring2;
}
const activeCard = writable(void 0);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const clamp = (value, min = 0, max = 100) => {
  return Math.min(Math.max(value, min), max);
};
const adjust = (value, fromMin, fromMax, toMin, toMax) => {
  return round(toMin + (toMax - toMin) * (value - fromMin) / (fromMax - fromMin));
};
const BigCard_svelte_svelte_type_style_lang = "";
const { window: window_1 } = globals;
function create_if_block$8(ctx) {
  let div0;
  let div0_style_value;
  let t;
  let div1;
  return {
    c() {
      div0 = element("div");
      t = space();
      div1 = element("div");
      attr(div0, "style", div0_style_value = ctx[15] + ctx[13]);
      attr(div0, "class", "big_card__shine");
      attr(div1, "style", ctx[15]);
      attr(div1, "class", "big_card__glare");
    },
    m(target, anchor) {
      insert(target, div0, anchor);
      insert(target, t, anchor);
      insert(target, div1, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 40960 && div0_style_value !== (div0_style_value = ctx2[15] + ctx2[13])) {
        attr(div0, "style", div0_style_value);
      }
      if (dirty[0] & 32768) {
        attr(div1, "style", ctx2[15]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div0);
      if (detaching)
        detach(t);
      if (detaching)
        detach(div1);
    }
  };
}
function create_fragment$o(ctx) {
  let div2;
  let div1;
  let button;
  let img0;
  let img0_src_value;
  let t0;
  let div0;
  let img1;
  let img1_alt_value;
  let img1_src_value;
  let t1;
  let button_aria_label_value;
  let div2_class_value;
  let mounted;
  let dispose;
  let if_block = ctx[3] === "card" && create_if_block$8(ctx);
  return {
    c() {
      div2 = element("div");
      div1 = element("div");
      button = element("button");
      img0 = element("img");
      t0 = space();
      div0 = element("div");
      img1 = element("img");
      t1 = space();
      if (if_block)
        if_block.c();
      attr(img0, "style", ctx[14]);
      attr(img0, "alt", "The back of the Card");
      attr(img0, "class", "big_card__back");
      attr(img0, "loading", "lazy");
      if (!src_url_equal(img0.src, img0_src_value = ctx[17]))
        attr(img0, "src", img0_src_value);
      attr(img1, "style", ctx[15]);
      attr(img1, "alt", img1_alt_value = "Front design of the " + ctx[2] + " Card");
      attr(img1, "loading", "lazy");
      if (!src_url_equal(img1.src, img1_src_value = ctx[6]))
        attr(img1, "src", img1_src_value);
      attr(div0, "class", "big_card__front");
      attr(div0, "style", ctx[25]);
      set_style(button, "box-shadow", ctx[3] === "card" ? "" : "none");
      attr(button, "aria-label", button_aria_label_value = "Expand the Card; " + ctx[2] + ".");
      attr(button, "class", "big_card__rotator");
      attr(button, "tabindex", "0");
      attr(div1, "class", "big_card__translater");
      attr(div2, "class", div2_class_value = "big_card " + ctx[1] + " " + ctx[0] + " / interactive / svelte-15dmsuy");
      attr(div2, "style", ctx[16]);
      toggle_class(div2, "active", ctx[7]);
      toggle_class(div2, "interacting", ctx[8]);
      toggle_class(div2, "loading", ctx[9]);
      toggle_class(div2, "masked", !!ctx[4]);
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div1);
      append(div1, button);
      append(button, img0);
      append(button, t0);
      append(button, div0);
      append(div0, img1);
      append(div0, t1);
      if (if_block)
        if_block.m(div0, null);
      ctx[51](div2);
      if (!mounted) {
        dispose = [
          listen(window_1, "scroll", ctx[24]),
          listen(img1, "load", ctx[26]),
          listen(button, "blur", ctx[23]),
          listen(button, "mouseout", ctx[22]),
          listen(button, "pointermove", ctx[21]),
          listen(div2, "click", ctx[27]),
          listen(div2, "keypress", ctx[27])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & 16384) {
        attr(img0, "style", ctx2[14]);
      }
      if (dirty[0] & 32768) {
        attr(img1, "style", ctx2[15]);
      }
      if (dirty[0] & 4 && img1_alt_value !== (img1_alt_value = "Front design of the " + ctx2[2] + " Card")) {
        attr(img1, "alt", img1_alt_value);
      }
      if (dirty[0] & 64 && !src_url_equal(img1.src, img1_src_value = ctx2[6])) {
        attr(img1, "src", img1_src_value);
      }
      if (ctx2[3] === "card") {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block$8(ctx2);
          if_block.c();
          if_block.m(div0, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty[0] & 8) {
        set_style(button, "box-shadow", ctx2[3] === "card" ? "" : "none");
      }
      if (dirty[0] & 4 && button_aria_label_value !== (button_aria_label_value = "Expand the Card; " + ctx2[2] + ".")) {
        attr(button, "aria-label", button_aria_label_value);
      }
      if (dirty[0] & 3 && div2_class_value !== (div2_class_value = "big_card " + ctx2[1] + " " + ctx2[0] + " / interactive / svelte-15dmsuy")) {
        attr(div2, "class", div2_class_value);
      }
      if (dirty[0] & 65536) {
        attr(div2, "style", ctx2[16]);
      }
      if (dirty[0] & 131) {
        toggle_class(div2, "active", ctx2[7]);
      }
      if (dirty[0] & 259) {
        toggle_class(div2, "interacting", ctx2[8]);
      }
      if (dirty[0] & 515) {
        toggle_class(div2, "loading", ctx2[9]);
      }
      if (dirty[0] & 19) {
        toggle_class(div2, "masked", !!ctx2[4]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div2);
      if (if_block)
        if_block.d();
      ctx[51](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$o($$self, $$props, $$invalidate) {
  let foilStyles;
  let dynamicStyles;
  let cardSizeStyles;
  let cardBackStyles;
  let $activeCard;
  let $springTranslate;
  let $springScale;
  let $springBackground;
  let $springRotateDelta;
  let $springRotate;
  let $springGlare;
  component_subscribe($$self, activeCard, ($$value) => $$invalidate(44, $activeCard = $$value));
  let { id = "" } = $$props;
  let { maskId = "" } = $$props;
  let { foilId = "" } = $$props;
  let { colorId = "" } = $$props;
  let { faction = "" } = $$props;
  let { name = "" } = $$props;
  let { number = "" } = $$props;
  let { set = "" } = $$props;
  let { types = "" } = $$props;
  let { imgType = "card" } = $$props;
  let { subtypes = "basic" } = $$props;
  let { supertype = "pok\xE9mon" } = $$props;
  let { rarity = "common" } = $$props;
  let { revealOnHover = true } = $$props;
  let rotation = revealOnHover ? { x: 180, y: 0 } : { x: 0, y: 0 };
  let { height = 490 } = $$props;
  let width = 529;
  let { img = "" } = $$props;
  let { back = imgType === "card" ? "assets/cards/back.jpg" : `assets/booster/${img}` } = $$props;
  let { foil = "" } = $$props;
  let { mask = "" } = $$props;
  let { showcase = false } = $$props;
  const randomSeed = { x: Math.random(), y: Math.random() };
  const cosmosPosition = {
    x: Math.floor(randomSeed.x * 734),
    y: Math.floor(randomSeed.y * 1280)
  };
  let back_img = back;
  let front_img = "";
  let img_base = imgType === "card" ? `assets/cards/${faction}/` : "assets/booster/";
  let thisCard;
  let repositionTimer;
  let active2 = false;
  let interacting = false;
  let firstPop = true;
  let loading = true;
  let isVisible = document.visibilityState === "visible";
  const springInteractSettings = { stiffness: 0.066, damping: 0.25 };
  const springPopoverSettings = { stiffness: 0.033, damping: 0.45 };
  let springRotate = spring(rotation, springInteractSettings);
  component_subscribe($$self, springRotate, (value) => $$invalidate(49, $springRotate = value));
  let springGlare = spring({ x: 50, y: 50, o: 0 }, springInteractSettings);
  component_subscribe($$self, springGlare, (value) => $$invalidate(50, $springGlare = value));
  let springBackground = spring({ x: 50, y: 50 }, springInteractSettings);
  component_subscribe($$self, springBackground, (value) => $$invalidate(47, $springBackground = value));
  let springRotateDelta = spring({ x: 0, y: 0 }, springPopoverSettings);
  component_subscribe($$self, springRotateDelta, (value) => $$invalidate(48, $springRotateDelta = value));
  let springTranslate = spring({ x: 0, y: 0 }, springPopoverSettings);
  component_subscribe($$self, springTranslate, (value) => $$invalidate(45, $springTranslate = value));
  let springScale = spring(1, springPopoverSettings);
  component_subscribe($$self, springScale, (value) => $$invalidate(46, $springScale = value));
  let showcaseInterval;
  let showcaseTimerStart;
  let showcaseTimerEnd;
  let showcaseRunning = showcase;
  const endShowcase = () => {
    if (showcaseRunning) {
      clearTimeout(showcaseTimerEnd);
      clearTimeout(showcaseTimerStart);
      clearInterval(showcaseInterval);
      showcaseRunning = false;
    }
  };
  const interact = (e) => {
    if (revealOnHover) {
      $$invalidate(33, revealOnHover = false);
      rotation = { x: 0, y: 0 };
      return $$invalidate(8, interacting = false);
    }
    if (!isVisible) {
      return $$invalidate(8, interacting = false);
    }
    if ($activeCard && $activeCard !== thisCard) {
      return $$invalidate(8, interacting = false);
    }
    $$invalidate(8, interacting = true);
    if (e.type === "touchmove") {
      e.clientX = e.touches[0].clientX;
      e.clientY = e.touches[0].clientY;
    }
    const target = e.target;
    const rect = target.getBoundingClientRect();
    const absolute = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    const percent = {
      x: clamp(round(100 / rect.width * absolute.x)),
      y: clamp(round(100 / rect.height * absolute.y))
    };
    const center = { x: percent.x - 50, y: percent.y - 50 };
    updateSprings(
      {
        x: adjust(percent.x, 0, 100, 37, 63),
        y: adjust(percent.y, 0, 100, 33, 67),
        o: 0
      },
      {
        x: rotation.x + round(-(center.x / 3.5)),
        y: rotation.y + round(center.y / 2),
        o: 0
      },
      {
        x: round(percent.x),
        y: round(percent.y),
        o: 1
      }
    );
  };
  const interactEnd = (e, delay = 500) => {
    setTimeout(
      function() {
        const snapStiff = 0.01;
        const snapDamp = 0.06;
        $$invalidate(8, interacting = false);
        $$invalidate(10, springRotate.stiffness = snapStiff, springRotate);
        $$invalidate(10, springRotate.damping = snapDamp, springRotate);
        springRotate.set(rotation, { soft: 1 });
        $$invalidate(11, springGlare.stiffness = snapStiff, springGlare);
        $$invalidate(11, springGlare.damping = snapDamp, springGlare);
        springGlare.set({ x: 50, y: 50, o: 0 }, { soft: 1 });
        $$invalidate(12, springBackground.stiffness = snapStiff, springBackground);
        $$invalidate(12, springBackground.damping = snapDamp, springBackground);
        springBackground.set({ x: 50, y: 50 }, { soft: 1 });
      },
      delay
    );
  };
  const deactivate = (e) => {
    interactEnd();
    set_store_value(activeCard, $activeCard = void 0, $activeCard);
  };
  const reposition = (e) => {
    clearTimeout(repositionTimer);
    repositionTimer = setTimeout(
      () => {
        if ($activeCard && $activeCard === thisCard) {
          setCenter();
        }
      },
      300
    );
  };
  const setCenter = () => {
    const rect = thisCard.getBoundingClientRect();
    const view = document.documentElement;
    const delta = {
      x: round(view.clientWidth / 2 - rect.x - rect.width / 2),
      y: round(view.clientHeight / 2 - rect.y - rect.height / 2)
    };
    springTranslate.set({ x: delta.x, y: delta.y });
  };
  const popover = () => {
    const rect = thisCard.getBoundingClientRect();
    let delay = 100;
    let scaleW = window.innerWidth / rect.width * 0.9;
    let scaleH = window.innerHeight / rect.height * 0.9;
    let scaleF = 1.75;
    setCenter();
    if (firstPop) {
      delay = 1e3;
      springRotateDelta.set({ x: 360, y: 0 });
    }
    firstPop = false;
    springScale.set(Math.min(scaleW, scaleH, scaleF));
    interactEnd(null, delay);
  };
  const retreat = () => {
    springScale.set(1, { soft: true });
    springTranslate.set({ x: 0, y: 0 }, { soft: true });
    springRotateDelta.set({ x: 0, y: 0 }, { soft: true });
    interactEnd(null, 100);
  };
  const reset2 = () => {
    interactEnd(null, 0);
    springScale.set(1, { hard: true });
    springTranslate.set({ x: 0, y: 0 }, { hard: true });
    springRotateDelta.set({ x: 0, y: 0 }, { hard: true });
    springRotate.set(rotation, { hard: true });
  };
  const staticStyles = `
    --seedx: ${randomSeed.x};
    --seedy: ${randomSeed.y};
    --cosmosbg: ${cosmosPosition.x}px ${cosmosPosition.y}px;
    height: 100%;
  `;
  const updateSprings = (background, rotate, glare) => {
    $$invalidate(12, springBackground.stiffness = springInteractSettings.stiffness, springBackground);
    $$invalidate(12, springBackground.damping = springInteractSettings.damping, springBackground);
    $$invalidate(10, springRotate.stiffness = springInteractSettings.stiffness, springRotate);
    $$invalidate(10, springRotate.damping = springInteractSettings.damping, springRotate);
    $$invalidate(11, springGlare.stiffness = springInteractSettings.stiffness, springGlare);
    $$invalidate(11, springGlare.damping = springInteractSettings.damping, springGlare);
    springBackground.set(background);
    springRotate.set(rotate);
    springGlare.set(glare);
  };
  document.addEventListener("visibilitychange", (e) => {
    isVisible = document.visibilityState === "visible";
    endShowcase();
    reset2();
  });
  const imageLoader = (e) => {
    $$invalidate(9, loading = false);
    if (mask || foil) {
      $$invalidate(13, foilStyles = `
    --mask: url(${mask});
    --foil: url(${foil});
      `);
    }
  };
  onMount(() => {
    $$invalidate(6, front_img = img_base + img + (imgType === "card" ? ".png" : ""));
  });
  const eventDispatcher = createEventDispatcher();
  function onClick() {
    eventDispatcher("click", id);
  }
  function div2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      thisCard = $$value;
      $$invalidate(5, thisCard);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("id" in $$props2)
      $$invalidate(34, id = $$props2.id);
    if ("maskId" in $$props2)
      $$invalidate(0, maskId = $$props2.maskId);
    if ("foilId" in $$props2)
      $$invalidate(35, foilId = $$props2.foilId);
    if ("colorId" in $$props2)
      $$invalidate(1, colorId = $$props2.colorId);
    if ("faction" in $$props2)
      $$invalidate(36, faction = $$props2.faction);
    if ("name" in $$props2)
      $$invalidate(2, name = $$props2.name);
    if ("number" in $$props2)
      $$invalidate(28, number = $$props2.number);
    if ("set" in $$props2)
      $$invalidate(37, set = $$props2.set);
    if ("types" in $$props2)
      $$invalidate(29, types = $$props2.types);
    if ("imgType" in $$props2)
      $$invalidate(3, imgType = $$props2.imgType);
    if ("subtypes" in $$props2)
      $$invalidate(30, subtypes = $$props2.subtypes);
    if ("supertype" in $$props2)
      $$invalidate(31, supertype = $$props2.supertype);
    if ("rarity" in $$props2)
      $$invalidate(32, rarity = $$props2.rarity);
    if ("revealOnHover" in $$props2)
      $$invalidate(33, revealOnHover = $$props2.revealOnHover);
    if ("height" in $$props2)
      $$invalidate(38, height = $$props2.height);
    if ("img" in $$props2)
      $$invalidate(39, img = $$props2.img);
    if ("back" in $$props2)
      $$invalidate(40, back = $$props2.back);
    if ("foil" in $$props2)
      $$invalidate(41, foil = $$props2.foil);
    if ("mask" in $$props2)
      $$invalidate(4, mask = $$props2.mask);
    if ("showcase" in $$props2)
      $$invalidate(42, showcase = $$props2.showcase);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & 32 | $$self.$$.dirty[1] & 8192) {
      {
        if ($activeCard && $activeCard === thisCard) {
          popover();
          $$invalidate(7, active2 = true);
        } else {
          retreat();
          $$invalidate(7, active2 = false);
        }
      }
    }
    if ($$self.$$.dirty[1] & 16) {
      $$invalidate(13, foilStyles = `
    --foil: url(${window.location.href}assets/shiny_masks/${foilId}');
    `);
    }
    if ($$self.$$.dirty[1] & 1032192) {
      $$invalidate(16, dynamicStyles = `
    --pointer-x: ${$springGlare.x}%;
    --pointer-y: ${$springGlare.y}%;
    --pointer-from-center: ${clamp(Math.sqrt(($springGlare.y - 50) * ($springGlare.y - 50) + ($springGlare.x - 50) * ($springGlare.x - 50)) / 50, 0, 1)};
    --pointer-from-top: ${$springGlare.y / 100};
    --pointer-from-left: ${$springGlare.x / 100};
    --card-opacity: ${$springGlare.o};
    --rotate-x: ${$springRotate.x + $springRotateDelta.x}deg;
    --rotate-y: ${$springRotate.y + $springRotateDelta.y}deg;
    --background-x: ${$springBackground.x}%;
    --background-y: ${$springBackground.y}%;
    --card-scale: ${$springScale};
    --translate-x: ${$springTranslate.x}px;
    --translate-y: ${$springTranslate.y}px;
	`);
    }
    if ($$self.$$.dirty[0] & 1879048192 | $$self.$$.dirty[1] & 139) {
      {
        $$invalidate(43, width = height * 410 / 775);
        $$invalidate(32, rarity = rarity.toLowerCase());
        $$invalidate(31, supertype = supertype.toLowerCase());
        $$invalidate(28, number = number.toLowerCase());
        !!number.match(/^[tg]g/i) || !!(id === "swshp-SWSH076" || id === "swshp-SWSH077");
        if (Array.isArray(types)) {
          $$invalidate(29, types = types.join(" ").toLowerCase());
        }
        if (Array.isArray(subtypes)) {
          $$invalidate(30, subtypes = subtypes.join(" ").toLowerCase());
        }
      }
    }
    if ($$self.$$.dirty[1] & 4224) {
      $$invalidate(15, cardSizeStyles = `
    height: ${height}px;
    width: ${width}px;
    `);
    }
    if ($$self.$$.dirty[0] & 8 | $$self.$$.dirty[1] & 4224) {
      $$invalidate(14, cardBackStyles = `
    height: ${height}px;
    width: ${width}px;
    ${imgType === "booster" ? "opacity: 0;" : ""}
    `);
    }
    if ($$self.$$.dirty[0] & 32 | $$self.$$.dirty[1] & 8192) {
      {
        if ($activeCard && $activeCard === thisCard) {
          $$invalidate(8, interacting = true);
        }
      }
    }
  };
  return [
    maskId,
    colorId,
    name,
    imgType,
    mask,
    thisCard,
    front_img,
    active2,
    interacting,
    loading,
    springRotate,
    springGlare,
    springBackground,
    foilStyles,
    cardBackStyles,
    cardSizeStyles,
    dynamicStyles,
    back_img,
    springRotateDelta,
    springTranslate,
    springScale,
    interact,
    interactEnd,
    deactivate,
    reposition,
    staticStyles,
    imageLoader,
    onClick,
    number,
    types,
    subtypes,
    supertype,
    rarity,
    revealOnHover,
    id,
    foilId,
    faction,
    set,
    height,
    img,
    back,
    foil,
    showcase,
    width,
    $activeCard,
    $springTranslate,
    $springScale,
    $springBackground,
    $springRotateDelta,
    $springRotate,
    $springGlare,
    div2_binding
  ];
}
class BigCard extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance$o,
      create_fragment$o,
      safe_not_equal,
      {
        id: 34,
        maskId: 0,
        foilId: 35,
        colorId: 1,
        faction: 36,
        name: 2,
        number: 28,
        set: 37,
        types: 29,
        imgType: 3,
        subtypes: 30,
        supertype: 31,
        rarity: 32,
        revealOnHover: 33,
        height: 38,
        img: 39,
        back: 40,
        foil: 41,
        mask: 4,
        showcase: 42
      },
      null,
      [-1, -1, -1]
    );
  }
}
function create_fragment$n(ctx) {
  let card;
  let current;
  const card_spread_levels = [ctx[0]];
  let card_props = {};
  for (let i = 0; i < card_spread_levels.length; i += 1) {
    card_props = assign(card_props, card_spread_levels[i]);
  }
  card = new BigCard({ props: card_props });
  card.$on("click", ctx[1]);
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const card_changes = dirty & 1 ? get_spread_update(card_spread_levels, [get_spread_object(ctx2[0])]) : {};
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function instance$n($$self, $$props, $$invalidate) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  let { shinyId: shinyId2 = "normal" } = $$props;
  let { maskId = void 0 } = $$props;
  let { foilId = void 0 } = $$props;
  let { colorId = void 0 } = $$props;
  let style = cards$1[shinyId2 || "normal"];
  let { id } = $$props;
  let { faction = void 0 } = $$props;
  let { imgType = "card" } = $$props;
  let { isReverse = false } = $$props;
  let { revealOnHover = false } = $$props;
  let { height = 490 } = $$props;
  let { img = void 0 } = $$props;
  let { back = void 0 } = $$props;
  let { showcase = false } = $$props;
  const isShiny = !!style.number && style.number.toLowerCase().startsWith("sv");
  const isGallery = !!style.number && !!style.number.match(/^[tg]g/i);
  !!id && altArts.includes(style.id) && !isShiny && !isGallery;
  const isPromo = !!style.set && style.set === "swshp";
  if (isReverse) {
    style.rarity = style.rarity + " Reverse Holo";
  }
  if (isGallery) {
    if (!!style.rarity && ((_a = style.rarity) == null ? void 0 : _a.startsWith("Trainer Gallery"))) {
      style.rarity = (_b = style.rarity) == null ? void 0 : _b.replace(/Trainer Gallery\s*/, "");
    }
    if (!!style.rarity && ((_c = style.rarity) == null ? void 0 : _c.includes("Rare Holo V")) && !!style.subtypes && ((_d = style.subtypes) == null ? void 0 : _d.includes("VMAX"))) {
      style.rarity = "Rare Holo VMAX";
    }
    if (!!style.rarity && ((_e = style.rarity) == null ? void 0 : _e.includes("Rare Holo V")) && !!style.subtypes && ((_f = style.subtypes) == null ? void 0 : _f.includes("VSTAR"))) {
      style.rarity = "Rare Holo VSTAR";
    }
  }
  if (isPromo) {
    if (style.id === "swshp-SWSH076" || style.id === "swshp-SWSH077") {
      style.rarity = "Rare Secret";
    } else if (!!style.subtypes && ((_g = style.subtypes) == null ? void 0 : _g.includes("V"))) {
      style.rarity = "Rare Holo V";
    } else if (!!style.subtypes && ((_h = style.subtypes) == null ? void 0 : _h.includes("V-UNION"))) {
      style.rarity = "Rare Holo VUNION";
    } else if (!!style.subtypes && ((_i = style.subtypes) == null ? void 0 : _i.includes("VMAX"))) {
      style.rarity = "Rare Holo VMAX";
    } else if (!!style.subtypes && ((_j = style.subtypes) == null ? void 0 : _j.includes("VSTAR"))) {
      style.rarity = "Rare Holo VSTAR";
    } else if (!!style.subtypes && ((_k = style.subtypes) == null ? void 0 : _k.includes("Radiant"))) {
      style.rarity = "Radiant Rare";
    }
  }
  function cardImage() {
    if (!!img) {
      return img;
    }
    return "";
  }
  function refreshProxy() {
    $$invalidate(0, proxy = {
      img: cardImage(),
      back,
      faction,
      imgType,
      showcase,
      revealOnHover,
      height,
      ...style,
      maskId,
      foilId,
      colorId
    });
  }
  let proxy = {};
  onMount(() => {
    refreshProxy();
  });
  const eventDispatcher = createEventDispatcher();
  function onClick() {
    eventDispatcher("click", id);
  }
  $$self.$$set = ($$props2) => {
    if ("shinyId" in $$props2)
      $$invalidate(2, shinyId2 = $$props2.shinyId);
    if ("maskId" in $$props2)
      $$invalidate(3, maskId = $$props2.maskId);
    if ("foilId" in $$props2)
      $$invalidate(4, foilId = $$props2.foilId);
    if ("colorId" in $$props2)
      $$invalidate(5, colorId = $$props2.colorId);
    if ("id" in $$props2)
      $$invalidate(6, id = $$props2.id);
    if ("faction" in $$props2)
      $$invalidate(7, faction = $$props2.faction);
    if ("imgType" in $$props2)
      $$invalidate(8, imgType = $$props2.imgType);
    if ("isReverse" in $$props2)
      $$invalidate(9, isReverse = $$props2.isReverse);
    if ("revealOnHover" in $$props2)
      $$invalidate(10, revealOnHover = $$props2.revealOnHover);
    if ("height" in $$props2)
      $$invalidate(11, height = $$props2.height);
    if ("img" in $$props2)
      $$invalidate(12, img = $$props2.img);
    if ("back" in $$props2)
      $$invalidate(13, back = $$props2.back);
    if ("showcase" in $$props2)
      $$invalidate(14, showcase = $$props2.showcase);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 60) {
      {
        if (shinyId2 || maskId || foilId || colorId) {
          console.log("refreshing proxy");
          style = JSON.parse(JSON.stringify(cards$1[shinyId2]));
          refreshProxy();
        }
      }
    }
  };
  return [
    proxy,
    onClick,
    shinyId2,
    maskId,
    foilId,
    colorId,
    id,
    faction,
    imgType,
    isReverse,
    revealOnHover,
    height,
    img,
    back,
    showcase
  ];
}
class CardProxy extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$n, create_fragment$n, safe_not_equal, {
      shinyId: 2,
      maskId: 3,
      foilId: 4,
      colorId: 5,
      id: 6,
      faction: 7,
      imgType: 8,
      isReverse: 9,
      revealOnHover: 10,
      height: 11,
      img: 12,
      back: 13,
      showcase: 14
    });
  }
}
const Selector_svelte_svelte_type_style_lang = "";
function create_fragment$m(ctx) {
  let div;
  let button0;
  let t1;
  let span0;
  let t2_value = ctx[1] + 1 + "";
  let t2;
  let t3;
  let t4_value = ctx[0].length + "";
  let t4;
  let t5;
  let button1;
  let t7;
  let h3;
  let t8_value = ctx[0][ctx[1]] + "";
  let t8;
  let t9;
  let span1;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      button0 = element("button");
      button0.textContent = "\u2B05\uFE0F";
      t1 = space();
      span0 = element("span");
      t2 = text(t2_value);
      t3 = text(" / ");
      t4 = text(t4_value);
      t5 = space();
      button1 = element("button");
      button1.textContent = "\u27A1\uFE0F";
      t7 = space();
      h3 = element("h3");
      t8 = text(t8_value);
      t9 = space();
      span1 = element("span");
      span1.textContent = `${ctx[2].map(func).join(", ")}`;
      attr(button0, "class", "btn btn-primary svelte-nyr7to");
      attr(span0, "class", "svelte-nyr7to");
      attr(button1, "class", "btn btn-primary svelte-nyr7to");
      attr(div, "class", "style-actions svelte-nyr7to");
      attr(span1, "class", "registered svelte-nyr7to");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, button0);
      append(div, t1);
      append(div, span0);
      append(span0, t2);
      append(span0, t3);
      append(span0, t4);
      append(div, t5);
      append(div, button1);
      append(div, t7);
      append(div, h3);
      append(h3, t8);
      insert(target, t9, anchor);
      insert(target, span1, anchor);
      if (!mounted) {
        dispose = [
          listen(button0, "click", ctx[4]),
          listen(button0, "keydown", ctx[5]),
          listen(button1, "click", ctx[3]),
          listen(button1, "keydown", ctx[5])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 2 && t2_value !== (t2_value = ctx2[1] + 1 + ""))
        set_data(t2, t2_value);
      if (dirty & 1 && t4_value !== (t4_value = ctx2[0].length + ""))
        set_data(t4, t4_value);
      if (dirty & 3 && t8_value !== (t8_value = ctx2[0][ctx2[1]] + ""))
        set_data(t8, t8_value);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      if (detaching)
        detach(t9);
      if (detaching)
        detach(span1);
      mounted = false;
      run_all(dispose);
    }
  };
}
const offset = 1;
const func = (id) => id.toString();
function instance$m($$self, $$props, $$invalidate) {
  let { data = [] } = $$props;
  let { onChange } = $$props;
  let index = 0;
  let validList = [];
  const next = () => {
    $$invalidate(1, index = (index + offset) % data.length);
    onChange(data[index]);
  };
  const prev = () => {
    $$invalidate(1, index = (index - offset + data.length) % data.length);
    onChange(data[index]);
  };
  const handleKey = (event) => {
    switch (event.key) {
      case "ArrowDown":
        console.log("push item");
        break;
      case "ArrowUp":
        break;
      case "ArrowLeft":
        prev();
        break;
      case "ArrowRight":
        next();
        break;
      case "Enter":
        break;
      case "Escape":
        break;
      default:
        return;
    }
  };
  onMount(() => {
  });
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2)
      $$invalidate(0, data = $$props2.data);
    if ("onChange" in $$props2)
      $$invalidate(6, onChange = $$props2.onChange);
  };
  return [data, index, validList, next, prev, handleKey, onChange];
}
class Selector extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$m, create_fragment$m, safe_not_equal, { data: 0, onChange: 6 });
  }
}
const CardDetailed_svelte_svelte_type_style_lang = "";
function create_if_block$7(ctx) {
  let cardproxy;
  let current;
  cardproxy = new CardProxy({
    props: {
      shinyId,
      maskId: ctx[0],
      foilId: ctx[1],
      colorId: ctx[2],
      id: ctx[3].key,
      faction: ctx[3].faction,
      img: ctx[3].img,
      height: 600
    }
  });
  return {
    c() {
      create_component(cardproxy.$$.fragment);
    },
    m(target, anchor) {
      mount_component(cardproxy, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const cardproxy_changes = {};
      if (dirty & 1)
        cardproxy_changes.maskId = ctx2[0];
      if (dirty & 2)
        cardproxy_changes.foilId = ctx2[1];
      if (dirty & 4)
        cardproxy_changes.colorId = ctx2[2];
      if (dirty & 8)
        cardproxy_changes.id = ctx2[3].key;
      if (dirty & 8)
        cardproxy_changes.faction = ctx2[3].faction;
      if (dirty & 8)
        cardproxy_changes.img = ctx2[3].img;
      cardproxy.$set(cardproxy_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(cardproxy.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(cardproxy.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(cardproxy, detaching);
    }
  };
}
function create_fragment$l(ctx) {
  let div0;
  let span0;
  let t1;
  let selector0;
  let t2;
  let span1;
  let t4;
  let selector1;
  let t5;
  let span2;
  let t7;
  let selector2;
  let t8;
  let div1;
  let current;
  selector0 = new Selector({
    props: {
      data: ctx[4],
      onChange: ctx[8]
    }
  });
  selector1 = new Selector({
    props: {
      data: ctx[5],
      onChange: ctx[9]
    }
  });
  selector2 = new Selector({
    props: {
      data: ctx[6],
      onChange: ctx[10]
    }
  });
  let if_block = ctx[3] && create_if_block$7(ctx);
  return {
    c() {
      div0 = element("div");
      span0 = element("span");
      span0.textContent = "Mask";
      t1 = space();
      create_component(selector0.$$.fragment);
      t2 = space();
      span1 = element("span");
      span1.textContent = "Foil";
      t4 = space();
      create_component(selector1.$$.fragment);
      t5 = space();
      span2 = element("span");
      span2.textContent = "Color";
      t7 = space();
      create_component(selector2.$$.fragment);
      t8 = space();
      div1 = element("div");
      if (if_block)
        if_block.c();
      set_style(span0, "color", "black");
      set_style(span1, "color", "black");
      set_style(span2, "color", "black");
      attr(div0, "class", "actions-container svelte-1ghwstu");
      attr(div1, "class", "card-details-container svelte-1ghwstu");
    },
    m(target, anchor) {
      insert(target, div0, anchor);
      append(div0, span0);
      append(div0, t1);
      mount_component(selector0, div0, null);
      append(div0, t2);
      append(div0, span1);
      append(div0, t4);
      mount_component(selector1, div0, null);
      append(div0, t5);
      append(div0, span2);
      append(div0, t7);
      mount_component(selector2, div0, null);
      insert(target, t8, anchor);
      insert(target, div1, anchor);
      if (if_block)
        if_block.m(div1, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      const selector0_changes = {};
      if (dirty & 1)
        selector0_changes.onChange = ctx2[8];
      selector0.$set(selector0_changes);
      const selector1_changes = {};
      if (dirty & 2)
        selector1_changes.onChange = ctx2[9];
      selector1.$set(selector1_changes);
      const selector2_changes = {};
      if (dirty & 4)
        selector2_changes.onChange = ctx2[10];
      selector2.$set(selector2_changes);
      if (ctx2[3]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 8) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$7(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div1, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(selector0.$$.fragment, local);
      transition_in(selector1.$$.fragment, local);
      transition_in(selector2.$$.fragment, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(selector0.$$.fragment, local);
      transition_out(selector1.$$.fragment, local);
      transition_out(selector2.$$.fragment, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div0);
      destroy_component(selector0);
      destroy_component(selector1);
      destroy_component(selector2);
      if (detaching)
        detach(t8);
      if (detaching)
        detach(div1);
      if (if_block)
        if_block.d();
    }
  };
}
let shinyId = "normal";
function instance$l($$self, $$props, $$invalidate) {
  let $Config;
  component_subscribe($$self, Config, ($$value) => $$invalidate(11, $Config = $$value));
  let { cardKey } = $$props;
  let mask = "regular-holo";
  let foil = "cosmos.png";
  let color = "water";
  let card;
  const masks = [
    "trainer-gallery-holo",
    "trainer-gallery-v-regular",
    "shiny-rare",
    "v-star",
    "trainer-full-art",
    "secret-rare",
    "v-max",
    "radiant-holo",
    "shiny-v",
    "cosmos-holo",
    "regular-holo",
    "v-regular",
    "trainer-gallery-v-max",
    "shiny-vmax",
    "v-full-art",
    "trainer-gallery-secret-rare",
    "rainbow-holo",
    "reverse-holo",
    "amazing-rare",
    "rainbow-alt",
    "swsh-pikachu"
  ];
  const foils = [
    "ancient.png",
    "angular.png",
    "cosmos.png",
    "cosmos-bottom.png",
    "cosmos-bottom-trans.png",
    "cosmos-middle.gif",
    "cosmos-middle.png",
    "cosmos-middle-trans.png",
    "cosmos-top.png",
    "cosmos-top-trans.png",
    "crossover.png",
    "galaxy.jpg",
    "galaxy-source.png",
    "geometric.png",
    "glitter.png",
    "grain.webp",
    "illusion.png",
    "illusion2.png",
    "illusion-mask.png",
    "metal.png",
    "rainbow.jpg",
    "stylish.png",
    "stylish2.png",
    "trainerbg.jpg",
    "trainerbg.png",
    "vmaxbg.jpg",
    "wave.png"
  ];
  const colors = [
    "water",
    "fire",
    "grass",
    "lightning",
    "psychic",
    "fighting",
    "darkness",
    "metal",
    "fairy",
    "dragon"
  ];
  onMount(() => {
    $$invalidate(3, card = $Config.cards.find((card2) => card2.key === cardKey));
  });
  const func2 = (e) => $$invalidate(0, mask = e);
  const func_1 = (e) => $$invalidate(1, foil = e);
  const func_2 = (e) => $$invalidate(2, color = e);
  $$self.$$set = ($$props2) => {
    if ("cardKey" in $$props2)
      $$invalidate(7, cardKey = $$props2.cardKey);
  };
  return [mask, foil, color, card, masks, foils, colors, cardKey, func2, func_1, func_2];
}
class CardDetailed extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$l, create_fragment$l, safe_not_equal, { cardKey: 7 });
  }
}
const Booster_svelte_svelte_type_style_lang = "";
function get_each_context$c(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[7] = list[i];
  return child_ctx;
}
function create_if_block$6(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_1$4, create_else_block$2];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[1])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function create_else_block$2(ctx) {
  let cardproxy;
  let current;
  cardproxy = new CardProxy({
    props: {
      id: ctx[3].id,
      img: ctx[0].img,
      name: ctx[3].name,
      number: ctx[3].number || "",
      rarity: ctx[3].rarity,
      set: ctx[3].set,
      subtypes: ctx[3].subtypes,
      supertype: ctx[3].supertype,
      types: ctx[3].types,
      foil: ctx[3].foil,
      mask: ctx[3].mask,
      imgType: "booster",
      height: 500
    }
  });
  cardproxy.$on("click", ctx[4]);
  return {
    c() {
      create_component(cardproxy.$$.fragment);
    },
    m(target, anchor) {
      mount_component(cardproxy, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const cardproxy_changes = {};
      if (dirty & 1)
        cardproxy_changes.img = ctx2[0].img;
      cardproxy.$set(cardproxy_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(cardproxy.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(cardproxy.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(cardproxy, detaching);
    }
  };
}
function create_if_block_1$4(ctx) {
  let div;
  let current;
  let each_value = ctx[2];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "card-loot-container svelte-ps5o0q");
      attr(div, "id", "card-loot-container");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & 12) {
        each_value = ctx2[2];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$c(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$c(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_each_block$c(ctx) {
  let cardproxy;
  let current;
  cardproxy = new CardProxy({
    props: {
      id: ctx[3].id,
      faction: ctx[7].faction,
      img: ctx[7].img,
      name: ctx[3].name,
      number: ctx[3].number || "",
      rarity: ctx[3].rarity,
      set: ctx[3].set,
      subtypes: ctx[3].subtypes,
      supertype: ctx[3].supertype,
      types: ctx[3].types,
      foil: ctx[3].foil,
      mask: ctx[3].mask,
      revealOnHover: true,
      imgType: "card"
    }
  });
  return {
    c() {
      create_component(cardproxy.$$.fragment);
    },
    m(target, anchor) {
      mount_component(cardproxy, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const cardproxy_changes = {};
      if (dirty & 4)
        cardproxy_changes.faction = ctx2[7].faction;
      if (dirty & 4)
        cardproxy_changes.img = ctx2[7].img;
      cardproxy.$set(cardproxy_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(cardproxy.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(cardproxy.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(cardproxy, detaching);
    }
  };
}
function create_fragment$k(ctx) {
  let div;
  let current;
  let if_block = ctx[0] && create_if_block$6(ctx);
  return {
    c() {
      div = element("div");
      if (if_block)
        if_block.c();
      attr(div, "class", "booster-pack-container svelte-ps5o0q");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (if_block)
        if_block.m(div, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[0]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$6(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block)
        if_block.d();
    }
  };
}
function instance$k($$self, $$props, $$invalidate) {
  let $Config;
  component_subscribe($$self, Config, ($$value) => $$invalidate(6, $Config = $$value));
  let { booster } = $$props;
  let requestedOpening = false;
  let opened = false;
  let loot = [];
  let boosterStyle = {
    "id": "swsh45sv-SV076",
    "set": "swsh45sv",
    "name": "Koffing",
    "supertype": "Pok\xE9mon",
    "subtypes": ["Basic"],
    "types": ["Darkness"],
    "number": "SV076",
    "rarity": "Rare Shiny"
  };
  useNuiEvent("response:booster", (data) => {
    $$invalidate(2, loot = data.booster.map((bc) => $Config.cards.find((c) => c.key === bc)));
    $$invalidate(1, opened = true);
  });
  const onBoosterOpen = () => {
    if (requestedOpening)
      return;
    requestedOpening = true;
    sendNui("request:booster", { boosterId: booster.id });
    debugData([
      {
        action: "response:booster",
        data: {
          booster: $Config.cards.slice(0, 5).map((c) => c.key)
        }
      }
    ]);
  };
  onMount(() => {
  });
  $$self.$$set = ($$props2) => {
    if ("booster" in $$props2)
      $$invalidate(0, booster = $$props2.booster);
  };
  return [booster, opened, loot, boosterStyle, onBoosterOpen];
}
class Booster extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$k, create_fragment$k, safe_not_equal, { booster: 0 });
  }
}
const Button_svelte_svelte_type_style_lang = "";
function create_fragment$j(ctx) {
  let button;
  let t;
  let button_class_value;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      t = text(ctx[0]);
      attr(button, "class", button_class_value = "cardgame-btn " + ctx[1] + " svelte-1rb2z28");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, t);
      if (!mounted) {
        dispose = listen(button, "click", ctx[2]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1)
        set_data(t, ctx2[0]);
      if (dirty & 2 && button_class_value !== (button_class_value = "cardgame-btn " + ctx2[1] + " svelte-1rb2z28")) {
        attr(button, "class", button_class_value);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function instance$j($$self, $$props, $$invalidate) {
  let { title } = $$props;
  let { theme = "light" } = $$props;
  const eventDispatcher = createEventDispatcher();
  function onClick(e) {
    eventDispatcher("click", e);
  }
  $$self.$$set = ($$props2) => {
    if ("title" in $$props2)
      $$invalidate(0, title = $$props2.title);
    if ("theme" in $$props2)
      $$invalidate(1, theme = $$props2.theme);
  };
  return [title, theme, onClick];
}
class Button extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$j, create_fragment$j, safe_not_equal, { title: 0, theme: 1 });
  }
}
const Modal_svelte_svelte_type_style_lang = "";
const get_footer_slot_changes = (dirty) => ({});
const get_footer_slot_context = (ctx) => ({});
const get_content_slot_changes = (dirty) => ({});
const get_content_slot_context = (ctx) => ({});
const get_header_slot_changes = (dirty) => ({});
const get_header_slot_context = (ctx) => ({});
function create_if_block$5(ctx) {
  let div4;
  let div3;
  let div0;
  let t0;
  let div1;
  let t1;
  let div2;
  let style_height = `${ctx[1]}px`;
  let style_width = `${ctx[0]}px`;
  let current;
  let mounted;
  let dispose;
  const header_slot_template = ctx[6].header;
  const header_slot = create_slot(header_slot_template, ctx, ctx[5], get_header_slot_context);
  const content_slot_template = ctx[6].content;
  const content_slot = create_slot(content_slot_template, ctx, ctx[5], get_content_slot_context);
  const footer_slot_template = ctx[6].footer;
  const footer_slot = create_slot(footer_slot_template, ctx, ctx[5], get_footer_slot_context);
  return {
    c() {
      div4 = element("div");
      div3 = element("div");
      div0 = element("div");
      if (header_slot)
        header_slot.c();
      t0 = space();
      div1 = element("div");
      if (content_slot)
        content_slot.c();
      t1 = space();
      div2 = element("div");
      if (footer_slot)
        footer_slot.c();
      attr(div0, "class", "modal-header svelte-11azy29");
      attr(div1, "class", "modal-content svelte-11azy29");
      attr(div2, "class", "modal-footer svelte-11azy29");
      attr(div3, "class", "modal svelte-11azy29");
      set_style(div3, "height", style_height);
      set_style(div3, "width", style_width);
      attr(div4, "class", "modal-container svelte-11azy29");
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div3);
      append(div3, div0);
      if (header_slot) {
        header_slot.m(div0, null);
      }
      append(div3, t0);
      append(div3, div1);
      if (content_slot) {
        content_slot.m(div1, null);
      }
      append(div3, t1);
      append(div3, div2);
      if (footer_slot) {
        footer_slot.m(div2, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          listen(div3, "keypress", keypress_handler),
          listen(div3, "click", click_handler),
          listen(div4, "keypress", ctx[3]),
          listen(div4, "click", ctx[3])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (header_slot) {
        if (header_slot.p && (!current || dirty & 32)) {
          update_slot_base(
            header_slot,
            header_slot_template,
            ctx2,
            ctx2[5],
            !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(header_slot_template, ctx2[5], dirty, get_header_slot_changes),
            get_header_slot_context
          );
        }
      }
      if (content_slot) {
        if (content_slot.p && (!current || dirty & 32)) {
          update_slot_base(
            content_slot,
            content_slot_template,
            ctx2,
            ctx2[5],
            !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(content_slot_template, ctx2[5], dirty, get_content_slot_changes),
            get_content_slot_context
          );
        }
      }
      if (footer_slot) {
        if (footer_slot.p && (!current || dirty & 32)) {
          update_slot_base(
            footer_slot,
            footer_slot_template,
            ctx2,
            ctx2[5],
            !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(footer_slot_template, ctx2[5], dirty, get_footer_slot_changes),
            get_footer_slot_context
          );
        }
      }
      if (dirty & 2 && style_height !== (style_height = `${ctx2[1]}px`)) {
        set_style(div3, "height", style_height);
      }
      if (dirty & 1 && style_width !== (style_width = `${ctx2[0]}px`)) {
        set_style(div3, "width", style_width);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(header_slot, local);
      transition_in(content_slot, local);
      transition_in(footer_slot, local);
      current = true;
    },
    o(local) {
      transition_out(header_slot, local);
      transition_out(content_slot, local);
      transition_out(footer_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div4);
      if (header_slot)
        header_slot.d(detaching);
      if (content_slot)
        content_slot.d(detaching);
      if (footer_slot)
        footer_slot.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$i(ctx) {
  let if_block_anchor;
  let current;
  let if_block = ctx[2] && create_if_block$5(ctx);
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[2]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 4) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$5(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
const keypress_handler = (e) => e.stopPropagation();
const click_handler = (e) => e.stopPropagation();
function instance$i($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { width = 600 } = $$props;
  let { height = 500 } = $$props;
  let { closeOnFocusOut = false } = $$props;
  let { visible = true } = $$props;
  const eventDispatcher = createEventDispatcher();
  const onFocusOut = () => {
    if (closeOnFocusOut) {
      eventDispatcher("close");
    }
  };
  onMount(() => {
  });
  $$self.$$set = ($$props2) => {
    if ("width" in $$props2)
      $$invalidate(0, width = $$props2.width);
    if ("height" in $$props2)
      $$invalidate(1, height = $$props2.height);
    if ("closeOnFocusOut" in $$props2)
      $$invalidate(4, closeOnFocusOut = $$props2.closeOnFocusOut);
    if ("visible" in $$props2)
      $$invalidate(2, visible = $$props2.visible);
    if ("$$scope" in $$props2)
      $$invalidate(5, $$scope = $$props2.$$scope);
  };
  return [width, height, visible, onFocusOut, closeOnFocusOut, $$scope, slots];
}
class Modal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$i, create_fragment$i, safe_not_equal, {
      width: 0,
      height: 1,
      closeOnFocusOut: 4,
      visible: 2
    });
  }
}
const QuitModal_svelte_svelte_type_style_lang = "";
function create_header_slot$6(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Are you Sure ?";
      attr(div, "slot", "header");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_content_slot$6(ctx) {
  let div1;
  let p;
  let t1;
  let div0;
  let button0;
  let t2;
  let button1;
  let current;
  button0 = new Button({ props: { theme: "dark", title: "Yes" } });
  button0.$on("click", ctx[2]);
  button1 = new Button({ props: { theme: "dark", title: "No" } });
  button1.$on("click", ctx[3]);
  return {
    c() {
      div1 = element("div");
      p = element("p");
      p.textContent = "Are you sure you want to quit this game?";
      t1 = space();
      div0 = element("div");
      create_component(button0.$$.fragment);
      t2 = space();
      create_component(button1.$$.fragment);
      attr(div0, "class", "action-container svelte-jmuzr3");
      attr(div1, "class", "content svelte-jmuzr3");
      attr(div1, "slot", "content");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, p);
      append(div1, t1);
      append(div1, div0);
      mount_component(button0, div0, null);
      append(div0, t2);
      mount_component(button1, div0, null);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_component(button0);
      destroy_component(button1);
    }
  };
}
function create_footer_slot$6(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "slot", "footer");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_fragment$h(ctx) {
  let modal;
  let current;
  modal = new Modal({
    props: {
      height: 250,
      visible: ctx[0],
      width: 600,
      $$slots: {
        footer: [create_footer_slot$6],
        content: [create_content_slot$6],
        header: [create_header_slot$6]
      },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(modal.$$.fragment);
    },
    m(target, anchor) {
      mount_component(modal, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const modal_changes = {};
      if (dirty & 1)
        modal_changes.visible = ctx2[0];
      if (dirty & 18) {
        modal_changes.$$scope = { dirty, ctx: ctx2 };
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(modal, detaching);
    }
  };
}
function instance$h($$self, $$props, $$invalidate) {
  let { visible } = $$props;
  let { onQuit = () => {
  } } = $$props;
  onMount(() => {
  });
  const click_handler2 = () => onQuit(true);
  const click_handler_1 = () => onQuit(false);
  $$self.$$set = ($$props2) => {
    if ("visible" in $$props2)
      $$invalidate(0, visible = $$props2.visible);
    if ("onQuit" in $$props2)
      $$invalidate(1, onQuit = $$props2.onQuit);
  };
  return [visible, onQuit, click_handler2, click_handler_1];
}
class QuitModal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$h, create_fragment$h, safe_not_equal, { visible: 0, onQuit: 1 });
  }
}
const Profile_svelte_svelte_type_style_lang = "";
function get_each_context$b(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[11] = list[i];
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[11] = list[i];
  return child_ctx;
}
function create_if_block_3$2(ctx) {
  var _a;
  let card;
  let current;
  card = new Card({
    props: {
      card: ctx[1],
      highlight: !ctx[4] && ctx[2] && !ctx[5] && !((_a = ctx[1]) == null ? void 0 : _a.disabled)
    }
  });
  card.$on("click", ctx[6]);
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      var _a2;
      const card_changes = {};
      if (dirty & 2)
        card_changes.card = ctx2[1];
      if (dirty & 54)
        card_changes.highlight = !ctx2[4] && ctx2[2] && !ctx2[5] && !((_a2 = ctx2[1]) == null ? void 0 : _a2.disabled);
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_each_block_1(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      if (!src_url_equal(img.src, img_src_value = "assets/ruby.png"))
        attr(img, "src", img_src_value);
      attr(img, "alt", "heart");
      attr(img, "class", "svelte-12ei2in");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(img);
    }
  };
}
function create_each_block$b(ctx) {
  let img;
  let img_src_value;
  return {
    c() {
      img = element("img");
      if (!src_url_equal(img.src, img_src_value = "assets/ruby-grey.png"))
        attr(img, "src", img_src_value);
      attr(img, "alt", "heart");
      attr(img, "class", "svelte-12ei2in");
    },
    m(target, anchor) {
      insert(target, img, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(img);
    }
  };
}
function create_if_block$4(ctx) {
  let div;
  let t;
  let current_block_type_index;
  let if_block1;
  let current;
  let if_block0 = !ctx[5] && !ctx[4] && create_if_block_2$2(ctx);
  const if_block_creators = [create_if_block_1$3, create_else_block$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (!ctx2[4])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      div = element("div");
      if (if_block0)
        if_block0.c();
      t = space();
      if_block1.c();
      attr(div, "class", "profile-actions svelte-12ei2in");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (if_block0)
        if_block0.m(div, null);
      append(div, t);
      if_blocks[current_block_type_index].m(div, null);
      current = true;
    },
    p(ctx2, dirty) {
      if (!ctx2[5] && !ctx2[4]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & 48) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_2$2(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div, t);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block1 = if_blocks[current_block_type_index];
        if (!if_block1) {
          if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block1.c();
        } else {
          if_block1.p(ctx2, dirty);
        }
        transition_in(if_block1, 1);
        if_block1.m(div, null);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (if_block0)
        if_block0.d();
      if_blocks[current_block_type_index].d();
    }
  };
}
function create_if_block_2$2(ctx) {
  let button;
  let current;
  button = new Button({ props: { title: "Pass" } });
  button.$on("click", ctx[8]);
  return {
    c() {
      create_component(button.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button, detaching);
    }
  };
}
function create_else_block$1(ctx) {
  let button;
  let current;
  button = new Button({ props: { title: "Quit" } });
  button.$on("click", ctx[10]);
  return {
    c() {
      create_component(button.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button, detaching);
    }
  };
}
function create_if_block_1$3(ctx) {
  let button;
  let current;
  button = new Button({ props: { title: "Give Up" } });
  button.$on("click", ctx[9]);
  return {
    c() {
      create_component(button.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button, detaching);
    }
  };
}
function create_fragment$g(ctx) {
  let div5;
  let h2;
  let t0_value = ctx[0].name + "";
  let t0;
  let t1;
  let div4;
  let t2;
  let div3;
  let div0;
  let span0;
  let t4;
  let span1;
  let t5_value = ctx[0].score + "";
  let t5;
  let t6;
  let div1;
  let span2;
  let t8;
  let span3;
  let t9_value = ctx[0].hand + "";
  let t9;
  let t10;
  let div2;
  let t11;
  let t12;
  let t13;
  let quitmodal;
  let current;
  let if_block0 = ctx[1] && create_if_block_3$2(ctx);
  let each_value_1 = Array(ctx[0].lives);
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  let each_value = Array(2 - ctx[0].lives);
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
  }
  let if_block1 = ctx[2] && create_if_block$4(ctx);
  quitmodal = new QuitModal({
    props: {
      onQuit: ctx[7],
      visible: ctx[3]
    }
  });
  return {
    c() {
      div5 = element("div");
      h2 = element("h2");
      t0 = text(t0_value);
      t1 = space();
      div4 = element("div");
      if (if_block0)
        if_block0.c();
      t2 = space();
      div3 = element("div");
      div0 = element("div");
      span0 = element("span");
      span0.textContent = "Points";
      t4 = space();
      span1 = element("span");
      t5 = text(t5_value);
      t6 = space();
      div1 = element("div");
      span2 = element("span");
      span2.textContent = "Hand";
      t8 = space();
      span3 = element("span");
      t9 = text(t9_value);
      t10 = space();
      div2 = element("div");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t11 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t12 = space();
      if (if_block1)
        if_block1.c();
      t13 = space();
      create_component(quitmodal.$$.fragment);
      attr(h2, "class", "player-name svelte-12ei2in");
      attr(div0, "class", "profile-info-stat svelte-12ei2in");
      attr(div1, "class", "profile-info-stat svelte-12ei2in");
      attr(div2, "class", "profile-info-stat health svelte-12ei2in");
      attr(div3, "class", "profile-info-stats svelte-12ei2in");
      attr(div4, "class", "profile-info svelte-12ei2in");
      attr(div5, "class", "profile svelte-12ei2in");
    },
    m(target, anchor) {
      insert(target, div5, anchor);
      append(div5, h2);
      append(h2, t0);
      append(div5, t1);
      append(div5, div4);
      if (if_block0)
        if_block0.m(div4, null);
      append(div4, t2);
      append(div4, div3);
      append(div3, div0);
      append(div0, span0);
      append(div0, t4);
      append(div0, span1);
      append(span1, t5);
      append(div3, t6);
      append(div3, div1);
      append(div1, span2);
      append(div1, t8);
      append(div1, span3);
      append(span3, t9);
      append(div3, t10);
      append(div3, div2);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(div2, null);
        }
      }
      append(div2, t11);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div2, null);
        }
      }
      append(div5, t12);
      if (if_block1)
        if_block1.m(div5, null);
      insert(target, t13, anchor);
      mount_component(quitmodal, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if ((!current || dirty & 1) && t0_value !== (t0_value = ctx2[0].name + ""))
        set_data(t0, t0_value);
      if (ctx2[1]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & 2) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_3$2(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div4, t2);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if ((!current || dirty & 1) && t5_value !== (t5_value = ctx2[0].score + ""))
        set_data(t5, t5_value);
      if ((!current || dirty & 1) && t9_value !== (t9_value = ctx2[0].hand + ""))
        set_data(t9, t9_value);
      if (dirty & 1) {
        each_value_1 = Array(ctx2[0].lives);
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx2, each_value_1, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_1();
            each_blocks_1[i].c();
            each_blocks_1[i].m(div2, t11);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_1.length;
      }
      if (dirty & 1) {
        each_value = Array(2 - ctx2[0].lives);
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$b(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$b();
            each_blocks[i].c();
            each_blocks[i].m(div2, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (ctx2[2]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & 4) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$4(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div5, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      const quitmodal_changes = {};
      if (dirty & 8)
        quitmodal_changes.visible = ctx2[3];
      quitmodal.$set(quitmodal_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(quitmodal.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      transition_out(quitmodal.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div5);
      if (if_block0)
        if_block0.d();
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      if (if_block1)
        if_block1.d();
      if (detaching)
        detach(t13);
      destroy_component(quitmodal, detaching);
    }
  };
}
function instance$g($$self, $$props, $$invalidate) {
  let $spectator;
  let $waiting;
  component_subscribe($$self, spectator, ($$value) => $$invalidate(4, $spectator = $$value));
  component_subscribe($$self, waiting, ($$value) => $$invalidate(5, $waiting = $$value));
  let { info } = $$props;
  let { leader } = $$props;
  let { isPlayer = false } = $$props;
  let quitModelVisible = false;
  const onActivateLeader = () => {
    if ($spectator)
      return;
    if (!isPlayer)
      return;
    if (leader.disabled)
      return;
    console.log("activating leader");
    sendNui("activate:leader");
  };
  const onQuit = (quit) => {
    $$invalidate(3, quitModelVisible = false);
    console.log("quitting. Is Spectator: ", $spectator, " Quit: ", quit);
    if (quit) {
      sendNui("request:leaveRoom");
      sendNui("close");
      reset();
    }
  };
  const onPass = () => {
    if ($spectator)
      return;
    console.log("passing");
    sendNui("set:passing");
  };
  onMount(() => {
  });
  const click_handler2 = () => $$invalidate(3, quitModelVisible = true);
  const click_handler_1 = () => onQuit(true);
  $$self.$$set = ($$props2) => {
    if ("info" in $$props2)
      $$invalidate(0, info = $$props2.info);
    if ("leader" in $$props2)
      $$invalidate(1, leader = $$props2.leader);
    if ("isPlayer" in $$props2)
      $$invalidate(2, isPlayer = $$props2.isPlayer);
  };
  return [
    info,
    leader,
    isPlayer,
    quitModelVisible,
    $spectator,
    $waiting,
    onActivateLeader,
    onQuit,
    onPass,
    click_handler2,
    click_handler_1
  ];
}
class Profile extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$g, create_fragment$g, safe_not_equal, { info: 0, leader: 1, isPlayer: 2 });
  }
}
const FieldRange_svelte_svelte_type_style_lang = "";
function get_each_context$a(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[16] = list[i];
  return child_ctx;
}
function create_if_block$3(ctx) {
  let card;
  let current;
  card = new Card({ props: { card: ctx[2].horn } });
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const card_changes = {};
      if (dirty & 4)
        card_changes.card = ctx2[2].horn;
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_each_block$a(ctx) {
  let card;
  let current;
  function click_handler2() {
    return ctx[12](ctx[16]);
  }
  function keypress_handler2() {
    return ctx[13](ctx[16]);
  }
  card = new Card({
    props: { card: ctx[16], highlight: false }
  });
  card.$on("click", click_handler2);
  card.$on("keypress", keypress_handler2);
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const card_changes = {};
      if (dirty & 4)
        card_changes.card = ctx[16];
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_fragment$f(ctx) {
  let div3;
  let div0;
  let img;
  let img_src_value;
  let t0;
  let t1;
  let div1;
  let t2;
  let div2;
  let t3_value = ctx[2].score + "";
  let t3;
  let div3_class_value;
  let current;
  let mounted;
  let dispose;
  let if_block = ctx[2].horn && create_if_block$3(ctx);
  let each_value = ctx[2].cards;
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div3 = element("div");
      div0 = element("div");
      img = element("img");
      t0 = space();
      if (if_block)
        if_block.c();
      t1 = space();
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t2 = space();
      div2 = element("div");
      t3 = text(t3_value);
      attr(img, "alt", ctx[1]);
      if (!src_url_equal(img.src, img_src_value = ctx[6][ctx[1]].img))
        attr(img, "src", img_src_value);
      attr(img, "class", "svelte-11zphh7");
      attr(div0, "class", "horn svelte-11zphh7");
      attr(div1, "class", "card-list svelte-11zphh7");
      attr(div2, "class", "counter svelte-11zphh7");
      attr(div3, "class", div3_class_value = "field-range " + ctx[1] + " svelte-11zphh7");
      toggle_class(div3, "active", !ctx[5] && ctx[0] && ctx[4]);
      toggle_class(div3, "field-weather", ctx[3]);
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div0);
      append(div0, img);
      append(div0, t0);
      if (if_block)
        if_block.m(div0, null);
      append(div3, t1);
      append(div3, div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      append(div3, t2);
      append(div3, div2);
      append(div2, t3);
      current = true;
      if (!mounted) {
        dispose = [
          listen(div3, "click", ctx[14]),
          listen(div3, "keypress", ctx[15])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (!current || dirty & 2) {
        attr(img, "alt", ctx2[1]);
      }
      if (!current || dirty & 2 && !src_url_equal(img.src, img_src_value = ctx2[6][ctx2[1]].img)) {
        attr(img, "src", img_src_value);
      }
      if (ctx2[2].horn) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 4) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$3(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div0, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (dirty & 132) {
        each_value = ctx2[2].cards;
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$a(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$a(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div1, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if ((!current || dirty & 4) && t3_value !== (t3_value = ctx2[2].score + ""))
        set_data(t3, t3_value);
      if (!current || dirty & 2 && div3_class_value !== (div3_class_value = "field-range " + ctx2[1] + " svelte-11zphh7")) {
        attr(div3, "class", div3_class_value);
      }
      if (!current || dirty & 51) {
        toggle_class(div3, "active", !ctx2[5] && ctx2[0] && ctx2[4]);
      }
      if (!current || dirty & 10) {
        toggle_class(div3, "field-weather", ctx2[3]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      transition_out(if_block);
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div3);
      if (if_block)
        if_block.d();
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$f($$self, $$props, $$invalidate) {
  let $setHorn;
  let $setAgile;
  let $waitForDecoy;
  let $spectator;
  component_subscribe($$self, setHorn, ($$value) => $$invalidate(9, $setHorn = $$value));
  component_subscribe($$self, setAgile, ($$value) => $$invalidate(10, $setAgile = $$value));
  component_subscribe($$self, waitForDecoy, ($$value) => $$invalidate(11, $waitForDecoy = $$value));
  component_subscribe($$self, spectator, ($$value) => $$invalidate(5, $spectator = $$value));
  const rangeDataList = {
    close: {
      img: "assets/close-combat.png",
      weatherCard: "card_bitingfrost"
    },
    ranged: {
      img: "assets/ranged.png",
      weatherCard: "card_impenetrablefog"
    },
    siege: {
      img: "assets/siege.png",
      weatherCard: "card_torrentialrain"
    }
  };
  let { isPlayer } = $$props;
  let { range } = $$props;
  let { field = { cards: [], score: 0, horn: void 0 } } = $$props;
  let { weatherCards = [] } = $$props;
  let isInfluencedByWeather = false;
  let isActive = false;
  const onFieldCLick = (card) => {
    if ($spectator)
      return;
    if (!isPlayer)
      return;
    console.log("Field click.", "Range:", range, "card ?:", card == null ? void 0 : card.key);
    if ($waitForDecoy) {
      console.log("Decoy: replacing with", card == null ? void 0 : card.key);
      sendNui("decoy:replaceWith", { cardID: card == null ? void 0 : card.id });
      waitForDecoy.set(void 0);
      return;
    }
    if ($setAgile) {
      console.log("Agile: setting to", range);
      sendNui("agile:field", { field: range == "close" ? 0 : 1 });
      setAgile.set(void 0);
      return;
    }
    if ($setHorn) {
      console.log("Horn: setting to", range);
      sendNui("horn:field", {
        field: range == "close" ? 0 : range == "ranged" ? 1 : 2
      });
      setHorn.set(void 0);
      return;
    }
  };
  onMount(() => {
  });
  const click_handler2 = (card) => onFieldCLick(card);
  const keypress_handler2 = (card) => onFieldCLick(card);
  const click_handler_1 = () => onFieldCLick();
  const keypress_handler_1 = () => onFieldCLick();
  $$self.$$set = ($$props2) => {
    if ("isPlayer" in $$props2)
      $$invalidate(0, isPlayer = $$props2.isPlayer);
    if ("range" in $$props2)
      $$invalidate(1, range = $$props2.range);
    if ("field" in $$props2)
      $$invalidate(2, field = $$props2.field);
    if ("weatherCards" in $$props2)
      $$invalidate(8, weatherCards = $$props2.weatherCards);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 3842) {
      {
        $$invalidate(3, isInfluencedByWeather = weatherCards.some((card) => card.key === rangeDataList[range].weatherCard));
        $$invalidate(4, isActive = range === "siege" ? !!$waitForDecoy || !!$setHorn : !!$waitForDecoy || !!$setAgile || !!$setHorn);
      }
    }
  };
  return [
    isPlayer,
    range,
    field,
    isInfluencedByWeather,
    isActive,
    $spectator,
    rangeDataList,
    onFieldCLick,
    weatherCards,
    $setHorn,
    $setAgile,
    $waitForDecoy,
    click_handler2,
    keypress_handler2,
    click_handler_1,
    keypress_handler_1
  ];
}
class FieldRange extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$f, create_fragment$f, safe_not_equal, {
      isPlayer: 0,
      range: 1,
      field: 2,
      weatherCards: 8
    });
  }
}
class Serializable {
  fromJson(json) {
    for (const propName in json) {
      const prop = json[propName];
      this[propName] = prop;
    }
    return this;
  }
}
class CardModel extends Serializable {
  constructor(id, key, name, type, changedType, boost, customBoost, power, forcedPower, muster_type, rarity, category, provision_cost, faction, img, qty, shiny, ability = [], disabled = false, diffPos = false) {
    super();
    this.id = id;
    this.key = key;
    this.name = name;
    this.type = type;
    this.changedType = changedType;
    this.boost = boost;
    this.customBoost = customBoost;
    this.power = power;
    this.forcedPower = forcedPower;
    this.muster_type = muster_type;
    this.rarity = rarity;
    this.category = category;
    this.provision_cost = provision_cost;
    this.faction = faction;
    this.img = img;
    this.qty = qty;
    this.shiny = shiny;
    this.ability = ability;
    this.disabled = disabled;
    this.diffPos = diffPos;
  }
  fromJson(json) {
    super.fromJson(json);
    if (json["data"]) {
      const data = json["data"];
      this.key = data["key"];
      this.category = data["category"];
      this.faction = data["faction"];
      this.img = data["img"];
      this.name = data["name"];
      this.power = data["power"];
      this.provision_cost = data["provision_cost"];
      this.rarity = data["rarity"];
      this.type = data["type"];
      this.ability = data["ability"];
      this.muster_type = data["muster_type"];
      this.shiny = data["shiny"];
    }
    return this;
  }
}
class SideField extends Serializable {
  constructor(close = { cards: [], score: 0 }, ranged = { cards: [], score: 0 }, siege = { cards: [], score: 0 }, weather = { cards: [], score: 0 }) {
    super();
    this.close = close;
    this.ranged = ranged;
    this.siege = siege;
    this.weather = weather;
  }
  fromJson(json) {
    super.fromJson(json);
    if (json["close"]) {
      this.close.cards = this.close.cards.map((card) => new CardModel().fromJson(card));
      if (json["close"]["horn"]) {
        this.close.horn = new CardModel().fromJson(json["close"]["horn"]);
      }
    }
    if (json["ranged"]) {
      this.ranged.cards = this.ranged.cards.map((card) => new CardModel().fromJson(card));
      if (json["ranged"]["horn"]) {
        this.ranged.horn = new CardModel().fromJson(json["ranged"]["horn"]);
      }
    }
    if (json["siege"]) {
      this.siege.cards = this.siege.cards.map((card) => new CardModel().fromJson(card));
      if (json["siege"]["horn"]) {
        this.siege.horn = new CardModel().fromJson(json["siege"]["horn"]);
      }
    }
    if (json["weather"]) {
      this.weather.cards = this.weather.cards.map((card) => new CardModel().fromJson(card));
    }
    return this;
  }
}
class SideInfoData extends Serializable {
  constructor(lives = 0, score = 0, deck = 0, hand = 0, passing2 = false, discard = [], name = "") {
    super();
    this.lives = lives;
    this.score = score;
    this.deck = deck;
    this.hand = hand;
    this.passing = passing2;
    this.discard = discard;
    this.name = name;
  }
  fromJson(json) {
    super.fromJson(json);
    if (json["discard"]) {
      const discard = typeof json["discard"] === "string" ? JSON.parse(json["discard"]) : json["discard"];
      this.discard = discard.map((card) => new CardModel().fromJson(card));
    }
    return this;
  }
}
class SideInfo extends Serializable {
  constructor(field = new SideField(), info = new SideInfoData(), leader = new CardModel()) {
    super();
    this.field = field;
    this.info = info;
    this.leader = leader;
  }
  fromJson(json) {
    if (json["field"]) {
      this.field = new SideField().fromJson(json["field"]);
    }
    if (json["info"]) {
      this.info = new SideInfoData().fromJson(json["info"]);
    }
    if (json["leader"]) {
      this.leader = new CardModel().fromJson(json["leader"]);
    }
    return this;
  }
}
const Field_svelte_svelte_type_style_lang = "";
function get_each_context$9(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[3] = list[i];
  return child_ctx;
}
function create_each_block$9(ctx) {
  let fieldrange;
  let current;
  fieldrange = new FieldRange({
    props: {
      range: ctx[3],
      field: ctx[0][ctx[3]],
      weatherCards: ctx[0].weather.cards,
      isPlayer: ctx[1]
    }
  });
  return {
    c() {
      create_component(fieldrange.$$.fragment);
    },
    m(target, anchor) {
      mount_component(fieldrange, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const fieldrange_changes = {};
      if (dirty & 4)
        fieldrange_changes.range = ctx2[3];
      if (dirty & 5)
        fieldrange_changes.field = ctx2[0][ctx2[3]];
      if (dirty & 1)
        fieldrange_changes.weatherCards = ctx2[0].weather.cards;
      if (dirty & 2)
        fieldrange_changes.isPlayer = ctx2[1];
      fieldrange.$set(fieldrange_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(fieldrange.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(fieldrange.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(fieldrange, detaching);
    }
  };
}
function create_fragment$e(ctx) {
  let div;
  let current;
  let each_value = ctx[2];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "field svelte-1x3y50c");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & 7) {
        each_value = ctx2[2];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$9(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$9(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
    }
  };
}
function instance$e($$self, $$props, $$invalidate) {
  let { data = new SideField() } = $$props;
  let { isPlayer = false } = $$props;
  let order = ["close", "ranged", "siege"];
  onMount(() => {
    if (!isPlayer) {
      $$invalidate(2, order = order.reverse());
    }
  });
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2)
      $$invalidate(0, data = $$props2.data);
    if ("isPlayer" in $$props2)
      $$invalidate(1, isPlayer = $$props2.isPlayer);
  };
  return [data, isPlayer, order];
}
class Field extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$e, create_fragment$e, safe_not_equal, { data: 0, isPlayer: 1 });
  }
}
const DiscardModal_svelte_svelte_type_style_lang = "";
function get_each_context$8(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[3] = list[i];
  return child_ctx;
}
function create_header_slot$5(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Discard pile";
      attr(div, "slot", "header");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_each_block$8(ctx) {
  let card;
  let current;
  card = new Card({ props: { card: ctx[3] } });
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const card_changes = {};
      if (dirty & 2)
        card_changes.card = ctx2[3];
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_content_slot$5(ctx) {
  let div1;
  let div0;
  let current;
  let each_value = ctx[1];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "discard svelte-13k82mw");
      attr(div1, "class", "content svelte-13k82mw");
      attr(div1, "slot", "content");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div0, null);
        }
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & 2) {
        each_value = ctx2[1];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$8(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$8(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div0, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_footer_slot$5(ctx) {
  let div;
  let button;
  let current;
  button = new Button({ props: { theme: "dark", title: "Close" } });
  button.$on("click", function() {
    if (is_function(ctx[2]))
      ctx[2].apply(this, arguments);
  });
  return {
    c() {
      div = element("div");
      create_component(button.$$.fragment);
      attr(div, "class", "footer");
      attr(div, "slot", "footer");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(button, div, null);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(button);
    }
  };
}
function create_fragment$d(ctx) {
  let modal;
  let current;
  modal = new Modal({
    props: {
      closeOnFocusOut: true,
      height: 400,
      visible: ctx[0],
      width: 800,
      $$slots: {
        footer: [create_footer_slot$5],
        content: [create_content_slot$5],
        header: [create_header_slot$5]
      },
      $$scope: { ctx }
    }
  });
  modal.$on("close", function() {
    if (is_function(ctx[2]))
      ctx[2].apply(this, arguments);
  });
  return {
    c() {
      create_component(modal.$$.fragment);
    },
    m(target, anchor) {
      mount_component(modal, target, anchor);
      current = true;
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      const modal_changes = {};
      if (dirty & 1)
        modal_changes.visible = ctx[0];
      if (dirty & 70) {
        modal_changes.$$scope = { dirty, ctx };
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(modal, detaching);
    }
  };
}
function instance$d($$self, $$props, $$invalidate) {
  let { visible } = $$props;
  let { discardPile = [] } = $$props;
  let { onClose = () => {
  } } = $$props;
  onMount(() => {
  });
  $$self.$$set = ($$props2) => {
    if ("visible" in $$props2)
      $$invalidate(0, visible = $$props2.visible);
    if ("discardPile" in $$props2)
      $$invalidate(1, discardPile = $$props2.discardPile);
    if ("onClose" in $$props2)
      $$invalidate(2, onClose = $$props2.onClose);
  };
  return [visible, discardPile, onClose];
}
class DiscardModal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$d, create_fragment$d, safe_not_equal, { visible: 0, discardPile: 1, onClose: 2 });
  }
}
const MedicModal_svelte_svelte_type_style_lang = "";
function get_each_context$7(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[6] = list[i];
  return child_ctx;
}
function create_header_slot$4(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Choose one card from your discard pile";
      attr(div, "slot", "header");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_each_block$7(ctx) {
  let card;
  let current;
  function click_handler2() {
    return ctx[5](ctx[6]);
  }
  card = new Card({ props: { card: ctx[6] } });
  card.$on("click", click_handler2);
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const card_changes = {};
      if (dirty & 2)
        card_changes.card = ctx[6];
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_content_slot$4(ctx) {
  let div1;
  let div0;
  let current;
  let each_value = ctx[1];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "discard svelte-13k82mw");
      attr(div1, "class", "content svelte-13k82mw");
      attr(div1, "slot", "content");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div0, null);
        }
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & 6) {
        each_value = ctx2[1];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$7(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$7(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div0, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_footer_slot$4(ctx) {
  let div;
  let button;
  let current;
  button = new Button({ props: { theme: "dark", title: "Close" } });
  button.$on("click", ctx[3]);
  return {
    c() {
      div = element("div");
      create_component(button.$$.fragment);
      attr(div, "class", "footer");
      attr(div, "slot", "footer");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(button, div, null);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(button);
    }
  };
}
function create_fragment$c(ctx) {
  let modal;
  let current;
  modal = new Modal({
    props: {
      height: 400,
      visible: ctx[0],
      width: 800,
      $$slots: {
        footer: [create_footer_slot$4],
        content: [create_content_slot$4],
        header: [create_header_slot$4]
      },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(modal.$$.fragment);
    },
    m(target, anchor) {
      mount_component(modal, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const modal_changes = {};
      if (dirty & 1)
        modal_changes.visible = ctx2[0];
      if (dirty & 514) {
        modal_changes.$$scope = { dirty, ctx: ctx2 };
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(modal, detaching);
    }
  };
}
function instance$c($$self, $$props, $$invalidate) {
  let { visible } = $$props;
  let { discardPile = [] } = $$props;
  let { onClose = () => {
  } } = $$props;
  const onCardClick = (card) => {
    sendNui("medic:chooseCardFromDiscard", { cardID: card.id });
    onClose();
  };
  const onCloseModal = () => {
    sendNui("medic:chooseCardFromDiscard", {});
    onClose();
  };
  onMount(() => {
  });
  const click_handler2 = (card) => onCardClick(card);
  $$self.$$set = ($$props2) => {
    if ("visible" in $$props2)
      $$invalidate(0, visible = $$props2.visible);
    if ("discardPile" in $$props2)
      $$invalidate(1, discardPile = $$props2.discardPile);
    if ("onClose" in $$props2)
      $$invalidate(4, onClose = $$props2.onClose);
  };
  return [visible, discardPile, onCardClick, onCloseModal, onClose, click_handler2];
}
class MedicModal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$c, create_fragment$c, safe_not_equal, { visible: 0, discardPile: 1, onClose: 4 });
  }
}
const ChooseSideModal_svelte_svelte_type_style_lang = "";
function create_header_slot$3(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Choose which side should begin";
      attr(div, "slot", "header");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_content_slot$3(ctx) {
  let div;
  let button0;
  let t;
  let button1;
  let current;
  button0 = new Button({ props: { theme: "dark", title: "You" } });
  button0.$on("click", function() {
    if (is_function(ctx[1]))
      ctx[1].apply(this, arguments);
  });
  button1 = new Button({ props: { theme: "dark", title: "Foe" } });
  button1.$on("click", function() {
    if (is_function(ctx[1]))
      ctx[1].apply(this, arguments);
  });
  return {
    c() {
      div = element("div");
      create_component(button0.$$.fragment);
      t = space();
      create_component(button1.$$.fragment);
      attr(div, "class", "content svelte-1mbiynq");
      attr(div, "slot", "content");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(button0, div, null);
      append(div, t);
      mount_component(button1, div, null);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(button0);
      destroy_component(button1);
    }
  };
}
function create_footer_slot$3(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "slot", "footer");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_fragment$b(ctx) {
  let modal;
  let current;
  modal = new Modal({
    props: {
      height: 250,
      visible: ctx[0],
      width: 600,
      $$slots: {
        footer: [create_footer_slot$3],
        content: [create_content_slot$3],
        header: [create_header_slot$3]
      },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(modal.$$.fragment);
    },
    m(target, anchor) {
      mount_component(modal, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const modal_changes = {};
      if (dirty & 1)
        modal_changes.visible = ctx2[0];
      if (dirty & 6) {
        modal_changes.$$scope = { dirty, ctx: ctx2 };
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(modal, detaching);
    }
  };
}
function instance$b($$self, $$props, $$invalidate) {
  let { visible } = $$props;
  let { onClose } = $$props;
  onMount(() => {
  });
  $$self.$$set = ($$props2) => {
    if ("visible" in $$props2)
      $$invalidate(0, visible = $$props2.visible);
    if ("onClose" in $$props2)
      $$invalidate(1, onClose = $$props2.onClose);
  };
  return [visible, onClose];
}
class ChooseSideModal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$b, create_fragment$b, safe_not_equal, { visible: 0, onClose: 1 });
  }
}
const EmreisLeader4Modal_svelte_svelte_type_style_lang = "";
function get_each_context$6(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[6] = list[i];
  return child_ctx;
}
function create_header_slot$2(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Choose one card from your foes discard pile";
      attr(div, "slot", "header");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_each_block$6(ctx) {
  let card;
  let current;
  function click_handler2() {
    return ctx[5](ctx[6]);
  }
  card = new Card({ props: { card: ctx[6] } });
  card.$on("click", click_handler2);
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const card_changes = {};
      if (dirty & 2)
        card_changes.card = ctx[6];
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_content_slot$2(ctx) {
  let div1;
  let div0;
  let current;
  let each_value = ctx[1];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "discard svelte-13k82mw");
      attr(div1, "class", "content svelte-13k82mw");
      attr(div1, "slot", "content");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div0, null);
        }
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & 6) {
        each_value = ctx2[1];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$6(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$6(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div0, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_footer_slot$2(ctx) {
  let div;
  let button;
  let current;
  button = new Button({ props: { theme: "dark", title: "Close" } });
  button.$on("click", ctx[3]);
  return {
    c() {
      div = element("div");
      create_component(button.$$.fragment);
      attr(div, "class", "footer");
      attr(div, "slot", "footer");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(button, div, null);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(button);
    }
  };
}
function create_fragment$a(ctx) {
  let modal;
  let current;
  modal = new Modal({
    props: {
      height: 400,
      visible: ctx[0],
      width: 800,
      $$slots: {
        footer: [create_footer_slot$2],
        content: [create_content_slot$2],
        header: [create_header_slot$2]
      },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(modal.$$.fragment);
    },
    m(target, anchor) {
      mount_component(modal, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const modal_changes = {};
      if (dirty & 1)
        modal_changes.visible = ctx2[0];
      if (dirty & 514) {
        modal_changes.$$scope = { dirty, ctx: ctx2 };
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(modal, detaching);
    }
  };
}
function instance$a($$self, $$props, $$invalidate) {
  let { visible } = $$props;
  let { discardPile = [] } = $$props;
  let { onClose = () => {
  } } = $$props;
  const onCardClick = (card) => {
    sendNui("emreis_leader4:chooseCardFromDiscard", { cardID: card.id });
    onClose();
  };
  const onCloseModal = () => {
    sendNui("emreis_leader4:chooseCardFromDiscard", {});
    onClose();
  };
  onMount(() => {
  });
  const click_handler2 = (card) => onCardClick(card);
  $$self.$$set = ($$props2) => {
    if ("visible" in $$props2)
      $$invalidate(0, visible = $$props2.visible);
    if ("discardPile" in $$props2)
      $$invalidate(1, discardPile = $$props2.discardPile);
    if ("onClose" in $$props2)
      $$invalidate(4, onClose = $$props2.onClose);
  };
  return [visible, discardPile, onCardClick, onCloseModal, onClose, click_handler2];
}
class EmreisLeader4Modal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$a, safe_not_equal, { visible: 0, discardPile: 1, onClose: 4 });
  }
}
const RedrawModal_svelte_svelte_type_style_lang = "";
function get_each_context$5(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[6] = list[i];
  return child_ctx;
}
function create_header_slot$1(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Choose up to 2 cards you wish to redraw";
      attr(div, "slot", "header");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_each_block$5(ctx) {
  let card;
  let current;
  function click_handler2() {
    return ctx[5](ctx[6]);
  }
  card = new Card({ props: { card: ctx[6] } });
  card.$on("click", click_handler2);
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const card_changes = {};
      if (dirty & 2)
        card_changes.card = ctx[6];
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_content_slot$1(ctx) {
  let div1;
  let div0;
  let current;
  let each_value = ctx[1];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "discard svelte-13k82mw");
      attr(div1, "class", "content svelte-13k82mw");
      attr(div1, "slot", "content");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div0, null);
        }
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & 6) {
        each_value = ctx2[1];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$5(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$5(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div0, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_footer_slot$1(ctx) {
  let div;
  let button;
  let current;
  button = new Button({ props: { theme: "dark", title: "Close" } });
  button.$on("click", ctx[3]);
  return {
    c() {
      div = element("div");
      create_component(button.$$.fragment);
      attr(div, "class", "footer");
      attr(div, "slot", "footer");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(button, div, null);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(button);
    }
  };
}
function create_fragment$9(ctx) {
  let modal;
  let current;
  modal = new Modal({
    props: {
      height: 400,
      visible: ctx[0],
      width: 800,
      $$slots: {
        footer: [create_footer_slot$1],
        content: [create_content_slot$1],
        header: [create_header_slot$1]
      },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(modal.$$.fragment);
    },
    m(target, anchor) {
      mount_component(modal, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const modal_changes = {};
      if (dirty & 1)
        modal_changes.visible = ctx2[0];
      if (dirty & 514) {
        modal_changes.$$scope = { dirty, ctx: ctx2 };
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(modal, detaching);
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let { visible } = $$props;
  let { cardList = [] } = $$props;
  let { onClose = () => {
  } } = $$props;
  const onCardClick = (card) => {
    sendNui("redraw:reDrawCard", { cardID: card.id });
  };
  const onCloseModal = () => {
    sendNui("redraw:close_client");
    onClose();
  };
  onMount(() => {
  });
  const click_handler2 = (card) => onCardClick(card);
  $$self.$$set = ($$props2) => {
    if ("visible" in $$props2)
      $$invalidate(0, visible = $$props2.visible);
    if ("cardList" in $$props2)
      $$invalidate(1, cardList = $$props2.cardList);
    if ("onClose" in $$props2)
      $$invalidate(4, onClose = $$props2.onClose);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 3) {
      {
        if (visible) {
          console.log("Redraw Modal Opened");
          console.log(JSON.stringify(cardList));
        }
      }
    }
  };
  return [visible, cardList, onCardClick, onCloseModal, onClose, click_handler2];
}
class RedrawModal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$9, safe_not_equal, { visible: 0, cardList: 1, onClose: 4 });
  }
}
function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;
  const sd = 1 - start;
  const od = target_opacity * (1 - opacity);
  return {
    delay,
    duration,
    easing,
    css: (_t, u) => `
			transform: ${transform} scale(${1 - sd * u});
			opacity: ${target_opacity - od * u}
		`
  };
}
const BetterHand_svelte_svelte_type_style_lang = "";
function get_each_context$4(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[20] = list[i];
  child_ctx[22] = i;
  return child_ctx;
}
function create_each_block$4(ctx) {
  let div1;
  let div0;
  let card;
  let div0_style_value;
  let div0_transition;
  let t;
  let current;
  let mounted;
  let dispose;
  card = new Card({
    props: {
      card: ctx[20],
      highlight: ctx[20].key === ctx[1]
    }
  });
  function focus_handler() {
    return ctx[8](ctx[20], ctx[22]);
  }
  function mouseover_handler() {
    return ctx[9](ctx[20], ctx[22]);
  }
  function click_handler2() {
    return ctx[11](ctx[20]);
  }
  function keypress_handler2() {
    return ctx[12](ctx[20]);
  }
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      create_component(card.$$.fragment);
      t = space();
      attr(div0, "class", "card-face svelte-3ja8kj");
      attr(div0, "style", div0_style_value = ctx[2][ctx[22]]);
      attr(div1, "class", "card svelte-3ja8kj");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      mount_component(card, div0, null);
      append(div1, t);
      current = true;
      if (!mounted) {
        dispose = [
          listen(div1, "focus", focus_handler),
          listen(div1, "mouseover", mouseover_handler),
          listen(div1, "mouseleave", ctx[10]),
          listen(div1, "click", click_handler2),
          listen(div1, "keypress", keypress_handler2)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const card_changes = {};
      if (dirty & 1)
        card_changes.card = ctx[20];
      if (dirty & 3)
        card_changes.highlight = ctx[20].key === ctx[1];
      card.$set(card_changes);
      if (!current || dirty & 4 && div0_style_value !== (div0_style_value = ctx[2][ctx[22]])) {
        attr(div0, "style", div0_style_value);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      add_render_callback(() => {
        if (!current)
          return;
        if (!div0_transition)
          div0_transition = create_bidirectional_transition(div0, scale, { duration: 300 }, true);
        div0_transition.run(1);
      });
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      if (!div0_transition)
        div0_transition = create_bidirectional_transition(div0, scale, { duration: 300 }, false);
      div0_transition.run(0);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_component(card);
      if (detaching && div0_transition)
        div0_transition.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$8(ctx) {
  let div;
  let current;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "cards svelte-3ja8kj");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & 31) {
        each_value = ctx2[0];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$4(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$4(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let $waitForDecoy;
  let $setHorn;
  let $setAgile;
  let $passing;
  let $waiting;
  component_subscribe($$self, waitForDecoy, ($$value) => $$invalidate(5, $waitForDecoy = $$value));
  component_subscribe($$self, setHorn, ($$value) => $$invalidate(6, $setHorn = $$value));
  component_subscribe($$self, setAgile, ($$value) => $$invalidate(7, $setAgile = $$value));
  component_subscribe($$self, passing, ($$value) => $$invalidate(15, $passing = $$value));
  component_subscribe($$self, waiting, ($$value) => $$invalidate(16, $waiting = $$value));
  let { cardList = [] } = $$props;
  let totalCards = 0;
  let hoverIdx = -1;
  let activeCard2 = void 0;
  let cardStyles = [];
  const getCardStyleProperties = (index) => {
    const rotationRange = 50;
    const rotation = (index - (totalCards - 1) / 2) / (totalCards - 2) * rotationRange;
    const offsetRange = 80;
    const offset2 = Math.abs((index - (totalCards - 1) / 2) / (totalCards - 2) * offsetRange);
    return { rotation, offset: offset2 };
  };
  const getCardStyle = (index) => {
    const { rotation, offset: offset2 } = getCardStyleProperties(index);
    if (index !== hoverIdx) {
      return `
                transform: translateY(${offset2}px) rotate(${rotation}deg);
            `;
    } else {
      return `
                transform: translateY(-100px) rotate(0deg) scale(2);
                transition-duration: 0ms;
                z-index: 5;
            `;
    }
  };
  const computeCardStyles = (cardIndex) => {
    if (cardIndex !== void 0) {
      $$invalidate(2, cardStyles[cardIndex] = getCardStyle(cardIndex), cardStyles);
      return;
    }
    $$invalidate(2, cardStyles = cardList.map((card, index) => {
      return getCardStyle(index);
    }));
  };
  const hoverCard = (card, index) => {
    CardPreviewHandler.show(card);
    const oldIdx = hoverIdx;
    hoverIdx = index;
    computeCardStyles(hoverIdx);
    computeCardStyles(oldIdx);
  };
  const onCardClick = (card) => {
    if ($waiting || $passing)
      return;
    if ($setAgile && card.key === $setAgile) {
      console.log("Cancel Agile", card.key);
      setAgile.set(void 0);
      sendNui("cancel:agile");
      return;
    }
    if ($setHorn && card.key === $setHorn) {
      console.log("Cancel Horn", card.key);
      setHorn.set(void 0);
      sendNui("cancel:horn");
      return;
    }
    if ($waitForDecoy && card.key === $waitForDecoy) {
      console.log("Cancel Decoy", card.key);
      waitForDecoy.set(void 0);
      sendNui("cancel:decoy");
      return;
    }
    console.log("Playing card from hand", card.key);
    sendNui("play:cardFromHand", { id: card.id });
    if (card.key === "decoy") {
      console.log("Waiting for decoy", card.key);
      waitForDecoy.set(card.key);
    }
  };
  onMount(() => {
    computeCardStyles();
  });
  const focus_handler = (card, cardIndex) => hoverCard(card, cardIndex);
  const mouseover_handler = (card, cardIndex) => hoverCard(card, cardIndex);
  const mouseleave_handler = () => hoverCard(null, -1);
  const click_handler2 = (card) => onCardClick(card);
  const keypress_handler2 = (card) => onCardClick(card);
  $$self.$$set = ($$props2) => {
    if ("cardList" in $$props2)
      $$invalidate(0, cardList = $$props2.cardList);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 225) {
      {
        if ($setHorn) {
          $$invalidate(1, activeCard2 = $setHorn);
        } else if ($setAgile) {
          $$invalidate(1, activeCard2 = $setAgile);
        } else if ($waitForDecoy) {
          $$invalidate(1, activeCard2 = $waitForDecoy);
        } else {
          $$invalidate(1, activeCard2 = void 0);
        }
        totalCards = cardList.length;
        computeCardStyles();
      }
    }
  };
  return [
    cardList,
    activeCard2,
    cardStyles,
    hoverCard,
    onCardClick,
    $waitForDecoy,
    $setHorn,
    $setAgile,
    focus_handler,
    mouseover_handler,
    mouseleave_handler,
    click_handler2,
    keypress_handler2
  ];
}
class BetterHand extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$8, safe_not_equal, { cardList: 0 });
  }
}
const WinnerModal_svelte_svelte_type_style_lang = "";
function create_header_slot(ctx) {
  let div;
  let t0;
  let t1;
  return {
    c() {
      div = element("div");
      t0 = text(ctx[0]);
      t1 = text(" wins the match!");
      attr(div, "slot", "header");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t0);
      append(div, t1);
    },
    p(ctx2, dirty) {
      if (dirty & 1)
        set_data(t0, ctx2[0]);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_content_slot(ctx) {
  let div;
  let button;
  let current;
  button = new Button({ props: { theme: "dark", title: "Close" } });
  button.$on("click", function() {
    if (is_function(ctx[2]))
      ctx[2].apply(this, arguments);
  });
  return {
    c() {
      div = element("div");
      create_component(button.$$.fragment);
      attr(div, "class", "content svelte-ju99a7");
      attr(div, "slot", "content");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(button, div, null);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
    },
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(button);
    }
  };
}
function create_footer_slot(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "slot", "footer");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_fragment$7(ctx) {
  let modal;
  let current;
  modal = new Modal({
    props: {
      height: 250,
      visible: ctx[1],
      width: 600,
      $$slots: {
        footer: [create_footer_slot],
        content: [create_content_slot],
        header: [create_header_slot]
      },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(modal.$$.fragment);
    },
    m(target, anchor) {
      mount_component(modal, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const modal_changes = {};
      if (dirty & 2)
        modal_changes.visible = ctx2[1];
      if (dirty & 13) {
        modal_changes.$$scope = { dirty, ctx: ctx2 };
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(modal, detaching);
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  let { winner } = $$props;
  let { visible } = $$props;
  let { onClose } = $$props;
  onMount(() => {
  });
  $$self.$$set = ($$props2) => {
    if ("winner" in $$props2)
      $$invalidate(0, winner = $$props2.winner);
    if ("visible" in $$props2)
      $$invalidate(1, visible = $$props2.visible);
    if ("onClose" in $$props2)
      $$invalidate(2, onClose = $$props2.onClose);
  };
  return [winner, visible, onClose];
}
class WinnerModal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$7, safe_not_equal, { winner: 0, visible: 1, onClose: 2 });
  }
}
const BattleBoard_svelte_svelte_type_style_lang = "";
function get_each_context$3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[26] = list[i];
  return child_ctx;
}
function create_each_block$3(ctx) {
  let card;
  let current;
  card = new Card({ props: { card: ctx[26] } });
  return {
    c() {
      create_component(card.$$.fragment);
    },
    m(target, anchor) {
      mount_component(card, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const card_changes = {};
      if (dirty & 2)
        card_changes.card = ctx2[26];
      card.$set(card_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(card.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(card.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(card, detaching);
    }
  };
}
function create_else_block_1(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Your Turn";
      attr(div, "class", "wait-for-your");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_if_block_4$1(ctx) {
  let div;
  let t0_value = ctx[1].info.name + "";
  let t0;
  let t1;
  return {
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = text("'s Turn");
      attr(div, "class", "wait-as-spectator svelte-zn8suq");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t0);
      append(div, t1);
    },
    p(ctx2, dirty) {
      if (dirty & 2 && t0_value !== (t0_value = ctx2[1].info.name + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_if_block_2$1(ctx) {
  let if_block_anchor;
  function select_block_type_1(ctx2, dirty) {
    if (ctx2[9])
      return create_if_block_3$1;
    return create_else_block;
  }
  let current_block_type = select_block_type_1(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type_1(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    d(detaching) {
      if_block.d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function create_else_block(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      div.textContent = "Opponent's Turn";
      attr(div, "class", "wait-for-foe svelte-zn8suq");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_if_block_3$1(ctx) {
  let div;
  let t0_value = ctx[2].info.name + "";
  let t0;
  let t1;
  return {
    c() {
      div = element("div");
      t0 = text(t0_value);
      t1 = text("'s Turn");
      attr(div, "class", "wait-as-spectator svelte-zn8suq");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t0);
      append(div, t1);
    },
    p(ctx2, dirty) {
      if (dirty & 4 && t0_value !== (t0_value = ctx2[2].info.name + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_if_block_1$2(ctx) {
  let button;
  let current;
  button = new Button({ props: { title: "See Discard" } });
  button.$on("click", ctx[14]);
  return {
    c() {
      create_component(button.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button, detaching);
    }
  };
}
function create_if_block$2(ctx) {
  let betterhand;
  let current;
  betterhand = new BetterHand({
    props: { cardList: ctx[0] }
  });
  return {
    c() {
      create_component(betterhand.$$.fragment);
    },
    m(target, anchor) {
      mount_component(betterhand, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const betterhand_changes = {};
      if (dirty & 1)
        betterhand_changes.cardList = ctx2[0];
      betterhand.$set(betterhand_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(betterhand.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(betterhand.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(betterhand, detaching);
    }
  };
}
function create_fragment$6(ctx) {
  var _a, _b, _c, _d, _e;
  let div4;
  let div1;
  let profile0;
  let t0;
  let div0;
  let t1;
  let profile1;
  let t2;
  let div2;
  let field0;
  let t3;
  let field1;
  let t4;
  let div3;
  let t5;
  let t6;
  let t7;
  let redrawmodal;
  let t8;
  let discardmodal;
  let t9;
  let medicmodal;
  let t10;
  let choosesidemodal;
  let t11;
  let emreisleader4modal;
  let t12;
  let winnermodal;
  let current;
  profile0 = new Profile({
    props: {
      info: ctx[2].info,
      isPlayer: false,
      leader: ctx[2].leader
    }
  });
  let each_value = ctx[1].field.weather.cards;
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  profile1 = new Profile({
    props: {
      info: ctx[1].info,
      isPlayer: true,
      leader: ctx[1].leader
    }
  });
  field0 = new Field({
    props: {
      data: ctx[2].field,
      isPlayer: false
    }
  });
  field1 = new Field({
    props: {
      data: ctx[1].field,
      isPlayer: true
    }
  });
  function select_block_type(ctx2, dirty) {
    if (ctx2[10])
      return create_if_block_2$1;
    if (ctx2[9])
      return create_if_block_4$1;
    return create_else_block_1;
  }
  let current_block_type = select_block_type(ctx);
  let if_block0 = current_block_type(ctx);
  let if_block1 = !ctx[9] && create_if_block_1$2(ctx);
  let if_block2 = !ctx[9] && create_if_block$2(ctx);
  redrawmodal = new RedrawModal({
    props: {
      cardList: ctx[0],
      onClose: ctx[15],
      visible: ctx[3]
    }
  });
  discardmodal = new DiscardModal({
    props: {
      discardPile: ctx[1].info.discard,
      onClose: ctx[16],
      visible: ctx[4]
    }
  });
  medicmodal = new MedicModal({
    props: {
      discardPile: (_b = (_a = ctx[11]) == null ? void 0 : _a.cards) != null ? _b : [],
      onClose: ctx[17],
      visible: ctx[6]
    }
  });
  choosesidemodal = new ChooseSideModal({
    props: {
      onClose: ctx[18],
      visible: ctx[5]
    }
  });
  emreisleader4modal = new EmreisLeader4Modal({
    props: {
      discardPile: (_d = (_c = ctx[12]) == null ? void 0 : _c.cards) != null ? _d : [],
      onClose: ctx[19],
      visible: ctx[7]
    }
  });
  winnermodal = new WinnerModal({
    props: {
      onClose: ctx[13],
      visible: ctx[8] !== null,
      winner: (_e = ctx[8]) != null ? _e : "nobody"
    }
  });
  return {
    c() {
      div4 = element("div");
      div1 = element("div");
      create_component(profile0.$$.fragment);
      t0 = space();
      div0 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t1 = space();
      create_component(profile1.$$.fragment);
      t2 = space();
      div2 = element("div");
      create_component(field0.$$.fragment);
      t3 = space();
      create_component(field1.$$.fragment);
      t4 = space();
      div3 = element("div");
      if_block0.c();
      t5 = space();
      if (if_block1)
        if_block1.c();
      t6 = space();
      if (if_block2)
        if_block2.c();
      t7 = space();
      create_component(redrawmodal.$$.fragment);
      t8 = space();
      create_component(discardmodal.$$.fragment);
      t9 = space();
      create_component(medicmodal.$$.fragment);
      t10 = space();
      create_component(choosesidemodal.$$.fragment);
      t11 = space();
      create_component(emreisleader4modal.$$.fragment);
      t12 = space();
      create_component(winnermodal.$$.fragment);
      attr(div0, "class", "weather-card-list svelte-zn8suq");
      attr(div1, "class", "profile-container svelte-zn8suq");
      attr(div2, "class", "board-container svelte-zn8suq");
      attr(div3, "class", "action-container svelte-zn8suq");
      attr(div4, "class", "battle-container svelte-zn8suq");
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div1);
      mount_component(profile0, div1, null);
      append(div1, t0);
      append(div1, div0);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div0, null);
        }
      }
      append(div1, t1);
      mount_component(profile1, div1, null);
      append(div4, t2);
      append(div4, div2);
      mount_component(field0, div2, null);
      append(div2, t3);
      mount_component(field1, div2, null);
      append(div4, t4);
      append(div4, div3);
      if_block0.m(div3, null);
      append(div3, t5);
      if (if_block1)
        if_block1.m(div3, null);
      insert(target, t6, anchor);
      if (if_block2)
        if_block2.m(target, anchor);
      insert(target, t7, anchor);
      mount_component(redrawmodal, target, anchor);
      insert(target, t8, anchor);
      mount_component(discardmodal, target, anchor);
      insert(target, t9, anchor);
      mount_component(medicmodal, target, anchor);
      insert(target, t10, anchor);
      mount_component(choosesidemodal, target, anchor);
      insert(target, t11, anchor);
      mount_component(emreisleader4modal, target, anchor);
      insert(target, t12, anchor);
      mount_component(winnermodal, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      var _a2, _b2, _c2, _d2, _e2;
      const profile0_changes = {};
      if (dirty & 4)
        profile0_changes.info = ctx2[2].info;
      if (dirty & 4)
        profile0_changes.leader = ctx2[2].leader;
      profile0.$set(profile0_changes);
      if (dirty & 2) {
        each_value = ctx2[1].field.weather.cards;
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$3(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$3(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div0, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      const profile1_changes = {};
      if (dirty & 2)
        profile1_changes.info = ctx2[1].info;
      if (dirty & 2)
        profile1_changes.leader = ctx2[1].leader;
      profile1.$set(profile1_changes);
      const field0_changes = {};
      if (dirty & 4)
        field0_changes.data = ctx2[2].field;
      field0.$set(field0_changes);
      const field1_changes = {};
      if (dirty & 2)
        field1_changes.data = ctx2[1].field;
      field1.$set(field1_changes);
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block0) {
        if_block0.p(ctx2, dirty);
      } else {
        if_block0.d(1);
        if_block0 = current_block_type(ctx2);
        if (if_block0) {
          if_block0.c();
          if_block0.m(div3, t5);
        }
      }
      if (!ctx2[9]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & 512) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_1$2(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div3, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (!ctx2[9]) {
        if (if_block2) {
          if_block2.p(ctx2, dirty);
          if (dirty & 512) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block$2(ctx2);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(t7.parentNode, t7);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
      const redrawmodal_changes = {};
      if (dirty & 1)
        redrawmodal_changes.cardList = ctx2[0];
      if (dirty & 8)
        redrawmodal_changes.onClose = ctx2[15];
      if (dirty & 8)
        redrawmodal_changes.visible = ctx2[3];
      redrawmodal.$set(redrawmodal_changes);
      const discardmodal_changes = {};
      if (dirty & 2)
        discardmodal_changes.discardPile = ctx2[1].info.discard;
      if (dirty & 16)
        discardmodal_changes.onClose = ctx2[16];
      if (dirty & 16)
        discardmodal_changes.visible = ctx2[4];
      discardmodal.$set(discardmodal_changes);
      const medicmodal_changes = {};
      if (dirty & 2048)
        medicmodal_changes.discardPile = (_b2 = (_a2 = ctx2[11]) == null ? void 0 : _a2.cards) != null ? _b2 : [];
      if (dirty & 64)
        medicmodal_changes.onClose = ctx2[17];
      if (dirty & 64)
        medicmodal_changes.visible = ctx2[6];
      medicmodal.$set(medicmodal_changes);
      const choosesidemodal_changes = {};
      if (dirty & 32)
        choosesidemodal_changes.onClose = ctx2[18];
      if (dirty & 32)
        choosesidemodal_changes.visible = ctx2[5];
      choosesidemodal.$set(choosesidemodal_changes);
      const emreisleader4modal_changes = {};
      if (dirty & 4096)
        emreisleader4modal_changes.discardPile = (_d2 = (_c2 = ctx2[12]) == null ? void 0 : _c2.cards) != null ? _d2 : [];
      if (dirty & 128)
        emreisleader4modal_changes.onClose = ctx2[19];
      if (dirty & 128)
        emreisleader4modal_changes.visible = ctx2[7];
      emreisleader4modal.$set(emreisleader4modal_changes);
      const winnermodal_changes = {};
      if (dirty & 256)
        winnermodal_changes.visible = ctx2[8] !== null;
      if (dirty & 256)
        winnermodal_changes.winner = (_e2 = ctx2[8]) != null ? _e2 : "nobody";
      winnermodal.$set(winnermodal_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(profile0.$$.fragment, local);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      transition_in(profile1.$$.fragment, local);
      transition_in(field0.$$.fragment, local);
      transition_in(field1.$$.fragment, local);
      transition_in(if_block1);
      transition_in(if_block2);
      transition_in(redrawmodal.$$.fragment, local);
      transition_in(discardmodal.$$.fragment, local);
      transition_in(medicmodal.$$.fragment, local);
      transition_in(choosesidemodal.$$.fragment, local);
      transition_in(emreisleader4modal.$$.fragment, local);
      transition_in(winnermodal.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(profile0.$$.fragment, local);
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      transition_out(profile1.$$.fragment, local);
      transition_out(field0.$$.fragment, local);
      transition_out(field1.$$.fragment, local);
      transition_out(if_block1);
      transition_out(if_block2);
      transition_out(redrawmodal.$$.fragment, local);
      transition_out(discardmodal.$$.fragment, local);
      transition_out(medicmodal.$$.fragment, local);
      transition_out(choosesidemodal.$$.fragment, local);
      transition_out(emreisleader4modal.$$.fragment, local);
      transition_out(winnermodal.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div4);
      destroy_component(profile0);
      destroy_each(each_blocks, detaching);
      destroy_component(profile1);
      destroy_component(field0);
      destroy_component(field1);
      if_block0.d();
      if (if_block1)
        if_block1.d();
      if (detaching)
        detach(t6);
      if (if_block2)
        if_block2.d(detaching);
      if (detaching)
        detach(t7);
      destroy_component(redrawmodal, detaching);
      if (detaching)
        detach(t8);
      destroy_component(discardmodal, detaching);
      if (detaching)
        detach(t9);
      destroy_component(medicmodal, detaching);
      if (detaching)
        detach(t10);
      destroy_component(choosesidemodal, detaching);
      if (detaching)
        detach(t11);
      destroy_component(emreisleader4modal, detaching);
      if (detaching)
        detach(t12);
      destroy_component(winnermodal, detaching);
    }
  };
}
function instance$6($$self, $$props, $$invalidate) {
  let $room;
  let $spectator;
  let $roomSide;
  let $waiting;
  let $medicDiscard;
  let $emreis_leader4;
  component_subscribe($$self, room, ($$value) => $$invalidate(20, $room = $$value));
  component_subscribe($$self, spectator, ($$value) => $$invalidate(9, $spectator = $$value));
  component_subscribe($$self, roomSide, ($$value) => $$invalidate(21, $roomSide = $$value));
  component_subscribe($$self, waiting, ($$value) => $$invalidate(10, $waiting = $$value));
  component_subscribe($$self, medicDiscard, ($$value) => $$invalidate(11, $medicDiscard = $$value));
  component_subscribe($$self, emreis_leader4, ($$value) => $$invalidate(12, $emreis_leader4 = $$value));
  let handCards = [];
  let yourSide = new SideInfo();
  let otherSide = new SideInfo();
  let redrawVisible = false;
  let discardVisible = false;
  let chooseSideVisible = false;
  let medicVisible = false;
  let emreisLeader4Visible = false;
  let winner = null;
  const redrawingUnsubscribe = isReDrawing.subscribe((value) => {
    $$invalidate(3, redrawVisible = value);
  });
  const chooseSideUnsubscribe = chooseSide.subscribe((value) => {
    $$invalidate(5, chooseSideVisible = value);
  });
  const medicUnsubscribe = medicDiscard.subscribe((value) => {
    $$invalidate(6, medicVisible = !!value);
  });
  const emreisUnsubscribe = emreis_leader4.subscribe((value) => {
    $$invalidate(7, emreisLeader4Visible = !!value);
  });
  useNuiEvent("set:waiting", (data) => {
    console.log("set waiting", data.waiting);
    waiting.set(data.waiting);
  });
  useNuiEvent("set:passing", (data) => {
    console.log("set passing", data.passing);
    passing.set(data.passing);
  });
  useNuiEvent("foe:left", () => {
    NotificationHandler.error("Your opponent has left the game", "Opponent left");
  });
  useNuiEvent("played:medic", (data) => {
    const cards2 = JSON.parse(data.cards).map((card) => new CardModel().fromJson(card));
    console.log("played medic", JSON.stringify(data.cards));
    medicDiscard.set({ cards: cards2 });
  });
  useNuiEvent("played:emreis_leader4", (data) => {
    const cards2 = JSON.parse(data.cards).map((card) => new CardModel().fromJson(card));
    console.log("played emreis leader 4", JSON.stringify(data.cards));
    emreis_leader4.set({ cards: cards2 });
  });
  useNuiEvent("played:agile", (data) => {
    console.log("played agile", data.cardID);
    setAgile.set(data.cardID);
  });
  useNuiEvent("played:horn", (data) => {
    console.log("played horn", data.cardID);
    setHorn.set(data.cardID);
  });
  useNuiEvent("redraw:cards", () => {
    console.log("redraw cards");
    isReDrawing.set(true);
  });
  useNuiEvent("redraw:close", () => {
    console.log("redraw close");
    isReDrawing.set(false);
  });
  useNuiEvent("update:hand", (data) => {
    console.log("update hand");
    if ($roomSide === data.roomSide) {
      $$invalidate(0, handCards = JSON.parse(data.cards).map((card) => new CardModel().fromJson(card)));
    }
  });
  useNuiEvent("update:info", (data) => {
    console.log("update profile info");
    if ($roomSide === data.roomSide) {
      $$invalidate(1, yourSide = new SideInfo().fromJson({
        ...yourSide,
        info: { ...yourSide.info, ...data.info },
        leader: data.leader
      }));
    } else {
      $$invalidate(2, otherSide = new SideInfo().fromJson({
        ...otherSide,
        info: { ...otherSide.info, ...data.info },
        leader: new CardModel().fromJson(data.leader)
      }));
    }
  });
  useNuiEvent("update:fields", (data) => {
    console.log("update fields");
    if ($roomSide === data.roomSide) {
      $$invalidate(1, yourSide = new SideInfo().fromJson({
        ...yourSide,
        field: {
          ...yourSide.field,
          close: data.close,
          ranged: data.ranged,
          siege: data.siege,
          weather: data.weather
        }
      }));
    } else {
      $$invalidate(2, otherSide = new SideInfo().fromJson({
        ...otherSide,
        field: {
          ...otherSide.field,
          close: data.close,
          ranged: data.ranged,
          siege: data.siege,
          weather: data.weather
        }
      }));
    }
  });
  useNuiEvent("gameover", (data) => {
    console.log("gameover", data.winner);
    $$invalidate(8, winner = data.winner);
  });
  const quitGame = () => {
    console.log("quit game from gameover");
    sendNui("request:leaveRoom");
    sendNui("close");
  };
  onMount(() => {
    if (!$spectator) {
      sendNui("request:gameLoaded", { roomID: $room });
    }
  });
  onDestroy(() => {
    redrawingUnsubscribe();
    chooseSideUnsubscribe();
    medicUnsubscribe();
    emreisUnsubscribe();
  });
  const click_handler2 = () => $$invalidate(4, discardVisible = true);
  const func2 = () => $$invalidate(3, redrawVisible = false);
  const func_1 = () => $$invalidate(4, discardVisible = false);
  const func_2 = () => $$invalidate(6, medicVisible = false);
  const func_3 = () => $$invalidate(5, chooseSideVisible = false);
  const func_4 = () => $$invalidate(7, emreisLeader4Visible = false);
  return [
    handCards,
    yourSide,
    otherSide,
    redrawVisible,
    discardVisible,
    chooseSideVisible,
    medicVisible,
    emreisLeader4Visible,
    winner,
    $spectator,
    $waiting,
    $medicDiscard,
    $emreis_leader4,
    quitGame,
    click_handler2,
    func2,
    func_1,
    func_2,
    func_3,
    func_4
  ];
}
class BattleBoard extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, {});
  }
}
const OpponentSelection_svelte_svelte_type_style_lang = "";
function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[5] = list[i];
  return child_ctx;
}
function create_each_block$2(ctx) {
  let li;
  let t0_value = ctx[5].name + "";
  let t0;
  let t1;
  let t2_value = ctx[5].id + "";
  let t2;
  let t3;
  let li_id_value;
  let mounted;
  let dispose;
  function keypress_handler2() {
    return ctx[3](ctx[5]);
  }
  function click_handler2() {
    return ctx[4](ctx[5]);
  }
  return {
    c() {
      li = element("li");
      t0 = text(t0_value);
      t1 = text("\r\n                (");
      t2 = text(t2_value);
      t3 = text(")\r\n            ");
      attr(li, "class", "list-item svelte-bo9ib0");
      attr(li, "id", li_id_value = "character-" + ctx[5].id);
    },
    m(target, anchor) {
      insert(target, li, anchor);
      append(li, t0);
      append(li, t1);
      append(li, t2);
      append(li, t3);
      if (!mounted) {
        dispose = [
          listen(li, "keypress", keypress_handler2),
          listen(li, "click", click_handler2)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 1 && t0_value !== (t0_value = ctx[5].name + ""))
        set_data(t0, t0_value);
      if (dirty & 1 && t2_value !== (t2_value = ctx[5].id + ""))
        set_data(t2, t2_value);
      if (dirty & 1 && li_id_value !== (li_id_value = "character-" + ctx[5].id)) {
        attr(li, "id", li_id_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(li);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$5(ctx) {
  let div;
  let button;
  let t1;
  let h1;
  let t3;
  let ul;
  let mounted;
  let dispose;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  }
  return {
    c() {
      div = element("div");
      button = element("button");
      button.textContent = "X";
      t1 = space();
      h1 = element("h1");
      h1.textContent = "Select an Opponent";
      t3 = space();
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(button, "class", "close-btn svelte-bo9ib0");
      attr(button, "type", "button");
      attr(h1, "class", "title svelte-bo9ib0");
      attr(ul, "id", "character-list");
      attr(ul, "class", "svelte-bo9ib0");
      attr(div, "id", "character-selection");
      attr(div, "class", "svelte-bo9ib0");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, button);
      append(div, t1);
      append(div, h1);
      append(div, t3);
      append(div, ul);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(ul, null);
        }
      }
      if (!mounted) {
        dispose = [
          listen(button, "click", ctx[2]),
          listen(button, "keypress", ctx[2])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 3) {
        each_value = ctx2[0];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$2(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$2(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(ul, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let players = [];
  useNuiEvent("select:players", (data) => {
    data.players.sort((a, b) => a.name.localeCompare(b.name));
    $$invalidate(0, players = data.players);
  });
  const selectOpponent = (id) => {
    sendNui("request:askMatchmaking", { player: id });
  };
  const close = () => {
    sendNui("close");
  };
  onMount(() => {
    sendNui("request:matchmaking");
    const p = { name: "Test", id: 1 };
    debugData([
      {
        action: "select:players",
        data: {
          players: [p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p]
        }
      }
    ]);
  });
  const keypress_handler2 = (player) => selectOpponent(player.id);
  const click_handler2 = (player) => selectOpponent(player.id);
  return [players, selectOpponent, close, keypress_handler2, click_handler2];
}
class OpponentSelection extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {});
  }
}
const ConfirmMatchmaking_svelte_svelte_type_style_lang = "";
function create_fragment$4(ctx) {
  let div1;
  let button0;
  let t1;
  let h1;
  let t3;
  let span1;
  let t4;
  let span0;
  let t5_value = ctx[0].name + "";
  let t5;
  let t6;
  let div0;
  let button1;
  let t7;
  let button2;
  let current;
  let mounted;
  let dispose;
  button1 = new Button({ props: { title: "Refuse" } });
  button1.$on("click", ctx[3]);
  button2 = new Button({ props: { title: "Accept" } });
  button2.$on("click", ctx[4]);
  return {
    c() {
      div1 = element("div");
      button0 = element("button");
      button0.textContent = "X";
      t1 = space();
      h1 = element("h1");
      h1.textContent = "Accept match ?";
      t3 = space();
      span1 = element("span");
      t4 = text("Match against ");
      span0 = element("span");
      t5 = text(t5_value);
      t6 = space();
      div0 = element("div");
      create_component(button1.$$.fragment);
      t7 = space();
      create_component(button2.$$.fragment);
      attr(button0, "class", "close-btn svelte-10zs24d");
      attr(button0, "type", "button");
      attr(h1, "class", "title svelte-10zs24d");
      attr(span0, "id", "opponent");
      attr(span1, "class", "subtitle svelte-10zs24d");
      attr(div0, "class", "recruit-choices-container svelte-10zs24d");
      attr(div1, "id", "recruit-confirmation");
      attr(div1, "class", "svelte-10zs24d");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, button0);
      append(div1, t1);
      append(div1, h1);
      append(div1, t3);
      append(div1, span1);
      append(span1, t4);
      append(span1, span0);
      append(span0, t5);
      append(div1, t6);
      append(div1, div0);
      mount_component(button1, div0, null);
      append(div0, t7);
      mount_component(button2, div0, null);
      current = true;
      if (!mounted) {
        dispose = listen(button0, "click", ctx[2]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if ((!current || dirty & 1) && t5_value !== (t5_value = ctx2[0].name + ""))
        set_data(t5, t5_value);
    },
    i(local) {
      if (current)
        return;
      transition_in(button1.$$.fragment, local);
      transition_in(button2.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button1.$$.fragment, local);
      transition_out(button2.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div1);
      destroy_component(button1);
      destroy_component(button2);
      mounted = false;
      dispose();
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let { opponent = { name: "Opponent" } } = $$props;
  const onSubmit = (res) => {
    sendNui("response:confirmMatchmaking", { res, opponent });
    sendNui("close");
  };
  const close = () => {
    onSubmit("refuse");
  };
  onMount(() => {
  });
  const click_handler2 = () => onSubmit("refuse");
  const click_handler_1 = () => onSubmit("accept");
  $$self.$$set = ($$props2) => {
    if ("opponent" in $$props2)
      $$invalidate(0, opponent = $$props2.opponent);
  };
  return [opponent, onSubmit, close, click_handler2, click_handler_1];
}
class ConfirmMatchmaking extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, { opponent: 0 });
  }
}
const Router_svelte_svelte_type_style_lang = "";
function create_if_block_7(ctx) {
  let battleboard;
  let current;
  battleboard = new BattleBoard({});
  return {
    c() {
      create_component(battleboard.$$.fragment);
    },
    m(target, anchor) {
      mount_component(battleboard, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(battleboard.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(battleboard.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(battleboard, detaching);
    }
  };
}
function create_if_block_6(ctx) {
  var _a;
  let confirmmatchmaking;
  let current;
  confirmmatchmaking = new ConfirmMatchmaking({
    props: {
      opponent: (_a = ctx[1]) == null ? void 0 : _a.opponent
    }
  });
  return {
    c() {
      create_component(confirmmatchmaking.$$.fragment);
    },
    m(target, anchor) {
      mount_component(confirmmatchmaking, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      var _a2;
      const confirmmatchmaking_changes = {};
      if (dirty & 2)
        confirmmatchmaking_changes.opponent = (_a2 = ctx2[1]) == null ? void 0 : _a2.opponent;
      confirmmatchmaking.$set(confirmmatchmaking_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(confirmmatchmaking.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(confirmmatchmaking.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(confirmmatchmaking, detaching);
    }
  };
}
function create_if_block_5(ctx) {
  let opponentselection;
  let current;
  opponentselection = new OpponentSelection({});
  return {
    c() {
      create_component(opponentselection.$$.fragment);
    },
    m(target, anchor) {
      mount_component(opponentselection, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(opponentselection.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(opponentselection.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(opponentselection, detaching);
    }
  };
}
function create_if_block_4(ctx) {
  let deckbuilder;
  let current;
  deckbuilder = new DeckBuilder({});
  return {
    c() {
      create_component(deckbuilder.$$.fragment);
    },
    m(target, anchor) {
      mount_component(deckbuilder, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(deckbuilder.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(deckbuilder.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(deckbuilder, detaching);
    }
  };
}
function create_if_block_3(ctx) {
  let leaderboard2;
  let current;
  leaderboard2 = new Leaderboard({});
  return {
    c() {
      create_component(leaderboard2.$$.fragment);
    },
    m(target, anchor) {
      mount_component(leaderboard2, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(leaderboard2.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(leaderboard2.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(leaderboard2, detaching);
    }
  };
}
function create_if_block_2(ctx) {
  let catalog2;
  let current;
  catalog2 = new Catalog({});
  return {
    c() {
      create_component(catalog2.$$.fragment);
    },
    m(target, anchor) {
      mount_component(catalog2, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(catalog2.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(catalog2.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(catalog2, detaching);
    }
  };
}
function create_if_block_1$1(ctx) {
  var _a;
  let carddetailed;
  let current;
  carddetailed = new CardDetailed({
    props: {
      cardKey: (_a = ctx[1]) == null ? void 0 : _a.cardKey
    }
  });
  return {
    c() {
      create_component(carddetailed.$$.fragment);
    },
    m(target, anchor) {
      mount_component(carddetailed, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      var _a2;
      const carddetailed_changes = {};
      if (dirty & 2)
        carddetailed_changes.cardKey = (_a2 = ctx2[1]) == null ? void 0 : _a2.cardKey;
      carddetailed.$set(carddetailed_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(carddetailed.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(carddetailed.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(carddetailed, detaching);
    }
  };
}
function create_if_block$1(ctx) {
  var _a;
  let booster;
  let current;
  booster = new Booster({
    props: {
      booster: (_a = ctx[1]) == null ? void 0 : _a.booster
    }
  });
  return {
    c() {
      create_component(booster.$$.fragment);
    },
    m(target, anchor) {
      mount_component(booster, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      var _a2;
      const booster_changes = {};
      if (dirty & 2)
        booster_changes.booster = (_a2 = ctx2[1]) == null ? void 0 : _a2.booster;
      booster.$set(booster_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(booster.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(booster.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(booster, detaching);
    }
  };
}
function create_fragment$3(ctx) {
  let div;
  let current_block_type_index;
  let if_block;
  let current;
  const if_block_creators = [
    create_if_block$1,
    create_if_block_1$1,
    create_if_block_2,
    create_if_block_3,
    create_if_block_4,
    create_if_block_5,
    create_if_block_6,
    create_if_block_7
  ];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[0] === Routes.booster)
      return 0;
    if (ctx2[0] === Routes.cardDetails)
      return 1;
    if (ctx2[0] === Routes.catalog)
      return 2;
    if (ctx2[0] === Routes.leaderboard)
      return 3;
    if (ctx2[0] === Routes.deckBuilding)
      return 4;
    if (ctx2[0] === Routes.opponentSelection)
      return 5;
    if (ctx2[0] === Routes.confirmMatchmaking)
      return 6;
    if (ctx2[0] === Routes.battle)
      return 7;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  return {
    c() {
      div = element("div");
      if (if_block)
        if_block.c();
      attr(div, "class", "container svelte-ye9t9l");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(div, null);
        } else {
          if_block = null;
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let $currentRouteParams;
  let $currentRoute;
  component_subscribe($$self, currentRouteParams, ($$value) => $$invalidate(2, $currentRouteParams = $$value));
  component_subscribe($$self, currentRoute, ($$value) => $$invalidate(3, $currentRoute = $$value));
  let currRoute = null;
  let currRouteParams = null;
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 15) {
      {
        $$invalidate(0, currRoute = $currentRoute);
        $$invalidate(1, currRouteParams = $currentRouteParams);
        console.log("updated route:", currRoute);
        console.log("updated params:", currRouteParams);
      }
    }
  };
  return [currRoute, currRouteParams, $currentRouteParams, $currentRoute];
}
class Router extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {});
  }
}
class AbilityModel extends Serializable {
  constructor(id, name, description) {
    super();
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
const NotificationProvider_svelte_svelte_type_style_lang = "";
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[7] = list[i].message;
  child_ctx[8] = list[i].id;
  return child_ctx;
}
function create_each_block$1(ctx) {
  let div3;
  let div2;
  let div0;
  let t0_value = ctx[7].title + "";
  let t0;
  let t1;
  let div1;
  let t2_value = ctx[7].message + "";
  let t2;
  let t3;
  let mounted;
  let dispose;
  function keypress_handler2() {
    return ctx[4](ctx[8]);
  }
  function click_handler2() {
    return ctx[5](ctx[8]);
  }
  return {
    c() {
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      div1 = element("div");
      t2 = text(t2_value);
      t3 = space();
      attr(div0, "class", "notification__title svelte-9almyb");
      attr(div1, "class", "notification__message svelte-9almyb");
      attr(div2, "class", "notification__content svelte-9almyb");
      attr(div3, "class", "notification svelte-9almyb");
      set_style(div3, "background-color", notificationStyles[ctx[7].type]);
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div2);
      append(div2, div0);
      append(div0, t0);
      append(div2, t1);
      append(div2, div1);
      append(div1, t2);
      append(div3, t3);
      if (!mounted) {
        dispose = [
          listen(div3, "keypress", keypress_handler2),
          listen(div3, "click", click_handler2)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 1 && t0_value !== (t0_value = ctx[7].title + ""))
        set_data(t0, t0_value);
      if (dirty & 1 && t2_value !== (t2_value = ctx[7].message + ""))
        set_data(t2, t2_value);
      if (dirty & 1) {
        set_style(div3, "background-color", notificationStyles[ctx[7].type]);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div3);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$2(ctx) {
  let main;
  let div;
  let t;
  let current;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }
  const default_slot_template = ctx[3].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[2], null);
  return {
    c() {
      main = element("main");
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t = space();
      if (default_slot)
        default_slot.c();
      attr(div, "class", "notification-container svelte-9almyb");
    },
    m(target, anchor) {
      insert(target, main, anchor);
      append(main, div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      append(main, t);
      if (default_slot) {
        default_slot.m(main, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & 3) {
        each_value = ctx2[0];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[2],
            !current ? get_all_dirty_from_scope(ctx2[2]) : get_slot_changes(default_slot_template, ctx2[2], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(main);
      destroy_each(each_blocks, detaching);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let notifications = [];
  const unSubscriber = notification.subscribe((newNotification) => {
    if (!newNotification)
      return;
    const id = notifications.push({
      id: notifications.length + 1,
      message: newNotification,
      timeout: setTimeout(
        () => {
          $$invalidate(0, notifications = notifications.filter((n) => n.id !== id));
        },
        newNotification.duration
      )
    });
    $$invalidate(0, notifications = [...notifications]);
  });
  useNuiEvent("notification", (data) => {
    console.log("notification", data.message);
    NotificationHandler.info(data.message);
  });
  const removeNotification = (id) => {
    $$invalidate(0, notifications = notifications.filter((n) => {
      if (n.id === id) {
        clearTimeout(n.timeout);
        return false;
      }
      return true;
    }));
  };
  onDestroy(() => {
    unSubscriber();
  });
  onMount(() => {
  });
  const keypress_handler2 = (id) => removeNotification(id);
  const click_handler2 = (id) => removeNotification(id);
  $$self.$$set = ($$props2) => {
    if ("$$scope" in $$props2)
      $$invalidate(2, $$scope = $$props2.$$scope);
  };
  return [
    notifications,
    removeNotification,
    $$scope,
    slots,
    keypress_handler2,
    click_handler2
  ];
}
class NotificationProvider extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, {});
  }
}
const fakeCards = [
  {
    "key": "card_commandershorn",
    "img": "commandershorn",
    "type": 4,
    "faction": "ambarino"
  },
  {
    "key": "card_osbournepiers",
    "img": "osbournepiers",
    "type": 0,
    "faction": "ambarino"
  },
  {
    "key": "card_garfieldjohnson",
    "img": "garfieldjohnson",
    "type": 0,
    "faction": "ambarino"
  },
  {
    "key": "card_impenetrablefog",
    "img": "impenetrablefog",
    "type": 5,
    "faction": "ambarino"
  },
  {
    "key": "card_bitingfrost",
    "img": "bitingfrost",
    "type": 5,
    "faction": "ambarino"
  },
  {
    "key": "card_scorch",
    "img": "scorch",
    "type": 4,
    "faction": "ambarino"
  },
  {
    "key": "card_edwynaali",
    "img": "edwynaali",
    "type": 0,
    "faction": "ambarino"
  },
  {
    "key": "card_decoy",
    "img": "decoy",
    "type": 4,
    "faction": "ambarino"
  },
  {
    "key": "card_silassilver",
    "img": "silassilver",
    "type": 0,
    "faction": "ambarino"
  },
  {
    "key": "card_clearweather",
    "img": "clearweather",
    "type": 5,
    "faction": "ambarino"
  },
  {
    "key": "card_messiahtimbers",
    "img": "messiahtimbers",
    "type": 0,
    "faction": "ambarino"
  },
  {
    "key": "card_abnerjace",
    "img": "abnerjace",
    "type": 0,
    "faction": "ambarino"
  },
  {
    "key": "card_kenrickberry",
    "img": "kenrickberry",
    "type": 1,
    "faction": "ambarino"
  },
  {
    "key": "card_torrentialrain",
    "img": "torrentialrain",
    "type": 5,
    "faction": "ambarino"
  },
  {
    "key": "card_lindseyron",
    "img": "lindseyron",
    "type": 0,
    "faction": "ambarino"
  },
  {
    "key": "card_kentonflynn",
    "img": "kentonflynn",
    "type": 0,
    "faction": "ambarino"
  },
  {
    "key": "card_holidayranch",
    "img": "holidayranch",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_dorseyconrad",
    "img": "dorseyconrad",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_mounthagan",
    "img": "mounthagan",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_sandfordleo",
    "img": "sandfordleo",
    "type": 2,
    "faction": "lemoyne"
  },
  {
    "key": "card_emeraldranch",
    "img": "emeraldranch",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_donnerfalls",
    "img": "donnerfalls",
    "type": 2,
    "faction": "lemoyne"
  },
  {
    "key": "card_hertlandoilfields",
    "img": "hertlandoilfields",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_mintfordeason",
    "img": "mintfordeason",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_kittymeadows",
    "img": "kittymeadows",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_cotorrasprings",
    "img": "cotorrasprings",
    "type": 2,
    "faction": "lemoyne"
  },
  {
    "key": "card_conniebassett",
    "img": "conniebassett",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_emoryroswell",
    "img": "emoryroswell",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_ethelchambers",
    "img": "ethelchambers",
    "type": 2,
    "faction": "lemoyne"
  },
  {
    "key": "card_jesseglass",
    "img": "jesseglass",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_mountshann",
    "img": "mountshann",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_caligahall",
    "img": "caligahall",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_paytoncalhoun",
    "img": "paytoncalhoun",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_murieldorcia",
    "img": "murieldorcia",
    "type": 2,
    "faction": "lemoyne"
  },
  {
    "key": "card_hazelshaffer",
    "img": "hazelshaffer",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_hayesaric",
    "img": "hayesaric",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_percyball",
    "img": "percyball",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_gordonpaul",
    "img": "gordonpaul",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_janettebreann",
    "img": "janettebreann",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_jaggerelliot",
    "img": "jaggerelliot",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_normajocelyn",
    "img": "normajocelyn",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_charlottesbows",
    "img": "charlottesbows",
    "type": 3,
    "faction": "lemoyne"
  },
  {
    "key": "card_conniescap",
    "img": "conniescap",
    "type": 3,
    "faction": "lemoyne"
  },
  {
    "key": "card_bronsonshalfbrain",
    "img": "bronsonshalfbrain",
    "type": 3,
    "faction": "lemoyne"
  },
  {
    "key": "card_bobgrimes",
    "img": "bobgrimes",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_braithwaitemanor",
    "img": "braithwaitemanor",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_barrowlagoon",
    "img": "barrowlagoon",
    "type": 2,
    "faction": "lemoyne"
  },
  {
    "key": "card_bardscrossing",
    "img": "bardscrossing",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_starlingpreston",
    "img": "starlingpreston",
    "type": 1,
    "faction": "lemoyne"
  },
  {
    "key": "card_barberssociety",
    "img": "barberssociety",
    "type": 3,
    "faction": "lemoyne"
  },
  {
    "key": "card_brocksampson",
    "img": "brocksampson",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_cheryltotty",
    "img": "cheryltotty",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_vinceluke",
    "img": "vinceluke",
    "type": 0,
    "faction": "lemoyne"
  },
  {
    "key": "card_mingzao",
    "img": "mingzao",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_huangjie",
    "img": "huangjie",
    "type": 1,
    "faction": "new_austin"
  },
  {
    "key": "card_bigvalley",
    "img": "bigvalley",
    "type": 1,
    "faction": "new_austin"
  },
  {
    "key": "card_alphonsogerard",
    "img": "alphonsogerard",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_riggsstation",
    "img": "riggsstation",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_hillereason",
    "img": "hillereason",
    "type": 1,
    "faction": "new_austin"
  },
  {
    "key": "card_mcgavinstation",
    "img": "mcgavinstation",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_mantecafalls",
    "img": "mantecafalls",
    "type": 1,
    "faction": "new_austin"
  },
  {
    "key": "card_herbdeon",
    "img": "herbdeon",
    "type": 2,
    "faction": "new_austin"
  },
  {
    "key": "card_talltrees",
    "img": "talltrees",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_thecorinthianclub",
    "img": "thecorinthianclub",
    "type": 2,
    "faction": "new_austin"
  },
  {
    "key": "card_owanjiladam",
    "img": "owanjiladam",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_vanhorn",
    "img": "vanhorn",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_aurorabasin",
    "img": "aurorabasin",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_kolbysunny",
    "img": "kolbysunny",
    "type": 1,
    "faction": "new_austin"
  },
  {
    "key": "card_bacchusstation",
    "img": "bacchusstation",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_baldricpatsy",
    "img": "baldricpatsy",
    "type": 1,
    "faction": "new_austin"
  },
  {
    "key": "card_joshuahumbert",
    "img": "joshuahumbert",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_ardensunny",
    "img": "ardensunny",
    "type": 2,
    "faction": "new_austin"
  },
  {
    "key": "card_littlecreekriver",
    "img": "littlecreekriver",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_thegrandshovel",
    "img": "thegrandshovel",
    "type": 3,
    "faction": "new_austin"
  },
  {
    "key": "card_lawrencebrooks",
    "img": "lawrencebrooks",
    "type": 2,
    "faction": "new_austin"
  },
  {
    "key": "card_petercasimir",
    "img": "petercasimir",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_colinlanford",
    "img": "colinlanford",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_saintdenis",
    "img": "saintdenis",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_doverhill",
    "img": "doverhill",
    "type": 1,
    "faction": "new_austin"
  },
  {
    "key": "card_chassigmund",
    "img": "chassigmund",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_spidergorge",
    "img": "spidergorge",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_doctorssociety",
    "img": "doctorssociety",
    "type": 3,
    "faction": "new_austin"
  },
  {
    "key": "card_docssawedoffs",
    "img": "docssawedoffs",
    "type": 3,
    "faction": "new_austin"
  },
  {
    "key": "card_samuelyaw",
    "img": "samuelyaw",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_dharmakaylan",
    "img": "dharmakaylan",
    "type": 1,
    "faction": "new_austin"
  },
  {
    "key": "card_solomonjenkins",
    "img": "solomonjenkins",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_corettadelight",
    "img": "corettadelight",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_boxingassociation",
    "img": "boxingassociation",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_ruthhelena",
    "img": "ruthhelena",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_fontanatheatre",
    "img": "fontanatheatre",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_rhodes",
    "img": "rhodes",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_thieveslanding",
    "img": "thieveslanding",
    "type": 1,
    "faction": "new_austin"
  },
  {
    "key": "card_ronanethelbert",
    "img": "ronanethelbert",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_everetteblessing",
    "img": "everetteblessing",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_sunyeescane",
    "img": "sunyeescane",
    "type": 3,
    "faction": "new_austin"
  },
  {
    "key": "card_broomhildejennins",
    "img": "broomhildejennins",
    "type": 0,
    "faction": "new_austin"
  },
  {
    "key": "card_sheriffshat",
    "img": "sheriffshat",
    "type": 3,
    "faction": "new_hanover"
  },
  {
    "key": "card_senorbob",
    "img": "senorbob",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_sisika",
    "img": "sisika",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_priestlegend",
    "img": "priestlegend",
    "type": 1,
    "faction": "new_hanover"
  },
  {
    "key": "card_richardswallet",
    "img": "richardswallet",
    "type": 3,
    "faction": "new_hanover"
  },
  {
    "key": "card_robertwilliamson",
    "img": "robertwilliamson",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_oliviataurine",
    "img": "oliviataurine",
    "type": 1,
    "faction": "new_hanover"
  },
  {
    "key": "card_pedrodelarosamaciassanchez",
    "img": "pedrodelarosamaciassanchez",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_newspapersociety",
    "img": "newspapersociety",
    "type": 3,
    "faction": "new_hanover"
  },
  {
    "key": "card_norasbookofmagic",
    "img": "norasbookofmagic",
    "type": 3,
    "faction": "new_hanover"
  },
  {
    "key": "card_theoldtrainbridge",
    "img": "theoldtrainbridge",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_stuartpope",
    "img": "stuartpope",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_vivianwillis",
    "img": "vivianwillis",
    "type": 1,
    "faction": "new_hanover"
  },
  {
    "key": "card_walkerbruce",
    "img": "walkerbruce",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_bigredbarn",
    "img": "bigredbarn",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_callieholmes",
    "img": "callieholmes",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_fortmercer",
    "img": "fortmercer",
    "type": 1,
    "faction": "new_hanover"
  },
  {
    "key": "card_fortlemoyne",
    "img": "fortlemoyne",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_fortarmadillo",
    "img": "fortarmadillo",
    "type": 1,
    "faction": "new_hanover"
  },
  {
    "key": "card_forresthinton",
    "img": "forresthinton",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_fayhenson",
    "img": "fayhenson",
    "type": 1,
    "faction": "new_hanover"
  },
  {
    "key": "card_cesarsoto",
    "img": "cesarsoto",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_docholiday",
    "img": "docholiday",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_dextermcgavin",
    "img": "dextermcgavin",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_countycourthouse",
    "img": "countycourthouse",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_beverlycox",
    "img": "beverlycox",
    "type": 1,
    "faction": "new_hanover"
  },
  {
    "key": "card_lakedonjulio",
    "img": "lakedonjulio",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_alfredjones",
    "img": "alfredjones",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_kohanabravebird",
    "img": "kohanabravebird",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_kirbyosborne",
    "img": "kirbyosborne",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_armadillochurch",
    "img": "armadillochurch",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_leandrovargas",
    "img": "leandrovargas",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_averyboone",
    "img": "averyboone",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_louannaodonnell",
    "img": "louannaodonnell",
    "type": 0,
    "faction": "new_hanover"
  },
  {
    "key": "card_lakeisabella",
    "img": "lakeisabella",
    "type": 2,
    "faction": "new_hanover"
  },
  {
    "key": "card_cincotorres",
    "img": "cincotorres",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_spaldings",
    "img": "spaldings",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_chauncybullock",
    "img": "chauncybullock",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_sladesblackbook",
    "img": "sladesblackbook",
    "type": 3,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_charlottebassett",
    "img": "charlottebassett",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_flatneckstation",
    "img": "flatneckstation",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_stevenkeith",
    "img": "stevenkeith",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_thomasslade",
    "img": "thomasslade",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_armadilliostation",
    "img": "armadilliostation",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_sunyee",
    "img": "sunyee",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_trainsociety",
    "img": "trainsociety",
    "type": 3,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_bendictpointstation",
    "img": "bendictpointstation",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_bastillesaloon",
    "img": "bastillesaloon",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_thetreeofimmortality",
    "img": "thetreeofimmortality",
    "type": 3,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_basilowen",
    "img": "basilowen",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_citadelrock",
    "img": "citadelrock",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_claudebright",
    "img": "claudebright",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_clementinecarter",
    "img": "clementinecarter",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_jackbastille",
    "img": "jackbastille",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_jagercagle",
    "img": "jagercagle",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_melvinondwarf",
    "img": "melvinondwarf",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_jdmcknight",
    "img": "jdmcknight",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_orvilleteague",
    "img": "orvilleteague",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_jimhound",
    "img": "jimhound",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_jonnysteele",
    "img": "jonnysteele",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_nicholaspalmer",
    "img": "nicholaspalmer",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_mrteaguescigars",
    "img": "mrteaguescigars",
    "type": 3,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_hamptonlynn",
    "img": "hamptonlynn",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_guiteausquare",
    "img": "guiteausquare",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_grandkorrigan",
    "img": "grandkorrigan",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_sethwayne",
    "img": "sethwayne",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_courtneyrichmond",
    "img": "courtneyrichmond",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_saintdenistheatre",
    "img": "saintdenistheatre",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_saintdeniscemetary",
    "img": "saintdeniscemetary",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_dustybaker",
    "img": "dustybaker",
    "type": 1,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_sagetaurine",
    "img": "sagetaurine",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_emerygalloway",
    "img": "emerygalloway",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_richardrahl",
    "img": "richardrahl",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_puertomexico",
    "img": "puertomexico",
    "type": 0,
    "faction": "west_elizabeth"
  },
  {
    "key": "card_mcgavinsranch",
    "img": "mcgavinsranch",
    "type": 1,
    "faction": "west_elizabeth"
  }
];
const cards = fakeCards.map((card) => {
  return new CardModel().fromJson({
    key: card.key,
    name: card.key,
    type: card.type,
    boost: 0,
    power: 1,
    rarity: "epic",
    category: 1,
    provision_cost: 3,
    faction: card.faction,
    img: card.img,
    ability: []
  });
});
const catalog = fakeCards.reduce((prev, curr) => {
  prev[curr.key] = {
    qty: Math.floor(Math.random() * 3) + 1
  };
  return prev;
}, {});
const leaderboard = new Array(100).fill(0).map((_, i) => ({
  name: `Player ${i}`,
  score: Math.floor(Math.random() * 100)
}));
const CardPreviewProvider_svelte_svelte_type_style_lang = "";
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[7] = list[i];
  return child_ctx;
}
function create_if_block(ctx) {
  let div2;
  let div1;
  let p;
  let t0_value = ctx[0].name + "";
  let t0;
  let t1;
  let t2;
  let div0;
  let t3;
  let span0;
  let t6;
  let span1;
  let t7;
  let t8_value = ctx[0].category === 0 ? "Bronze" : "Gold";
  let t8;
  let t9;
  let span2;
  let t10;
  let t11_value = ctx[0].power + "";
  let t11;
  let t12;
  let img;
  let img_alt_value;
  let img_src_value;
  let each_value = ctx[1];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  let if_block = ctx[0].muster_type && create_if_block_1(ctx);
  return {
    c() {
      div2 = element("div");
      div1 = element("div");
      p = element("p");
      t0 = text(t0_value);
      t1 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t2 = space();
      div0 = element("div");
      if (if_block)
        if_block.c();
      t3 = space();
      span0 = element("span");
      span0.textContent = `Type: ${ctx[2]()}`;
      t6 = space();
      span1 = element("span");
      t7 = text("Tier: ");
      t8 = text(t8_value);
      t9 = space();
      span2 = element("span");
      t10 = text("Power: ");
      t11 = text(t11_value);
      t12 = space();
      img = element("img");
      attr(div0, "class", "card-deck-data svelte-1e84v0c");
      attr(div1, "class", "preview-description svelte-1e84v0c");
      toggle_class(div1, "preview-b", previewB);
      attr(img, "alt", img_alt_value = ctx[0].name);
      attr(img, "class", "previewed-card svelte-1e84v0c");
      if (!src_url_equal(img.src, img_src_value = "assets/cards/" + ctx[0].faction + "/" + ctx[0].img + ".png"))
        attr(img, "src", img_src_value);
      attr(div2, "class", "card-preview svelte-1e84v0c");
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div1);
      append(div1, p);
      append(p, t0);
      append(div1, t1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      append(div1, t2);
      append(div1, div0);
      if (if_block)
        if_block.m(div0, null);
      append(div0, t3);
      append(div0, span0);
      append(div0, t6);
      append(div0, span1);
      append(span1, t7);
      append(span1, t8);
      append(div0, t9);
      append(div0, span2);
      append(span2, t10);
      append(span2, t11);
      append(div2, t12);
      append(div2, img);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t0_value !== (t0_value = ctx2[0].name + ""))
        set_data(t0, t0_value);
      if (dirty & 2) {
        each_value = ctx2[1];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div1, t2);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (ctx2[0].muster_type) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_1(ctx2);
          if_block.c();
          if_block.m(div0, t3);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty & 1 && t8_value !== (t8_value = ctx2[0].category === 0 ? "Bronze" : "Gold"))
        set_data(t8, t8_value);
      if (dirty & 1 && t11_value !== (t11_value = ctx2[0].power + ""))
        set_data(t11, t11_value);
      if (dirty & 1 && img_alt_value !== (img_alt_value = ctx2[0].name)) {
        attr(img, "alt", img_alt_value);
      }
      if (dirty & 1 && !src_url_equal(img.src, img_src_value = "assets/cards/" + ctx2[0].faction + "/" + ctx2[0].img + ".png")) {
        attr(img, "src", img_src_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      destroy_each(each_blocks, detaching);
      if (if_block)
        if_block.d();
    }
  };
}
function create_each_block(ctx) {
  var _a;
  let p;
  let t_value = ((_a = ctx[7]) == null ? void 0 : _a.description) + "";
  let t;
  return {
    c() {
      p = element("p");
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, p, anchor);
      append(p, t);
    },
    p(ctx2, dirty) {
      var _a2;
      if (dirty & 2 && t_value !== (t_value = ((_a2 = ctx2[7]) == null ? void 0 : _a2.description) + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(p);
    }
  };
}
function create_if_block_1(ctx) {
  let span;
  let t0;
  let t1_value = ctx[0].muster_type + "";
  let t1;
  return {
    c() {
      span = element("span");
      t0 = text("Family: ");
      t1 = text(t1_value);
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      append(span, t1);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t1_value !== (t1_value = ctx2[0].muster_type + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching)
        detach(span);
    }
  };
}
function create_fragment$1(ctx) {
  let main;
  let t;
  let current;
  let if_block = ctx[0] && create_if_block(ctx);
  const default_slot_template = ctx[5].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[4], null);
  return {
    c() {
      main = element("main");
      if (if_block)
        if_block.c();
      t = space();
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      insert(target, main, anchor);
      if (if_block)
        if_block.m(main, null);
      append(main, t);
      if (default_slot) {
        default_slot.m(main, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[0]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          if_block.m(main, t);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 16)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[4],
            !current ? get_all_dirty_from_scope(ctx2[4]) : get_slot_changes(default_slot_template, ctx2[4], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(main);
      if (if_block)
        if_block.d();
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
let previewB = false;
function instance$1($$self, $$props, $$invalidate) {
  let $Config;
  component_subscribe($$self, Config, ($$value) => $$invalidate(3, $Config = $$value));
  let { $$slots: slots = {}, $$scope } = $$props;
  let card;
  let abilities = [];
  const unSubscriber = cardPreview.subscribe((newCardToPreview) => {
    $$invalidate(0, card = newCardToPreview);
  });
  const getCardType = () => {
    if (!card) {
      return "";
    }
    switch (card.type) {
      case 0:
        return "Close";
      case 1:
        return "Ranged";
      case 2:
        return "Siege";
      case 3:
        return "Leader";
      case 4:
        return "Special";
      case 5:
        return "Weather";
      default:
        return "";
    }
  };
  onDestroy(() => {
    unSubscriber();
  });
  onMount(() => {
  });
  $$self.$$set = ($$props2) => {
    if ("$$scope" in $$props2)
      $$invalidate(4, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    var _a;
    if ($$self.$$.dirty & 9) {
      {
        $$invalidate(1, abilities = ((_a = card == null ? void 0 : card.ability) != null ? _a : []).map((ability) => {
          return $Config.abilities.find((abilityData) => abilityData.id === ability);
        }));
      }
    }
  };
  return [card, abilities, getCardType, $Config, $$scope, slots];
}
class CardPreviewProvider extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
  }
}
function orderFactions(factions) {
  const order = ["all", "ambarino", "new_hanover", "lemoyne", "west_elizabeth", "new_austin"];
  return order.map(
    (faction) => ({
      id: faction,
      label: factions[faction]
    })
  ).filter((faction) => faction.label !== void 0);
}
function create_default_slot_2(ctx) {
  let router;
  let current;
  router = new Router({});
  return {
    c() {
      create_component(router.$$.fragment);
    },
    m(target, anchor) {
      mount_component(router, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(router.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(router.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(router, detaching);
    }
  };
}
function create_default_slot_1(ctx) {
  let cardpreviewprovider;
  let current;
  cardpreviewprovider = new CardPreviewProvider({
    props: {
      $$slots: { default: [create_default_slot_2] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(cardpreviewprovider.$$.fragment);
    },
    m(target, anchor) {
      mount_component(cardpreviewprovider, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const cardpreviewprovider_changes = {};
      if (dirty & 2) {
        cardpreviewprovider_changes.$$scope = { dirty, ctx: ctx2 };
      }
      cardpreviewprovider.$set(cardpreviewprovider_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(cardpreviewprovider.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(cardpreviewprovider.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(cardpreviewprovider, detaching);
    }
  };
}
function create_default_slot(ctx) {
  let notificationprovider;
  let current;
  notificationprovider = new NotificationProvider({
    props: {
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(notificationprovider.$$.fragment);
    },
    m(target, anchor) {
      mount_component(notificationprovider, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const notificationprovider_changes = {};
      if (dirty & 2) {
        notificationprovider_changes.$$scope = { dirty, ctx: ctx2 };
      }
      notificationprovider.$set(notificationprovider_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(notificationprovider.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(notificationprovider.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(notificationprovider, detaching);
    }
  };
}
function create_fragment(ctx) {
  let main;
  let visibilityprovider;
  let current;
  visibilityprovider = new VisibilityProvider({
    props: {
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      main = element("main");
      create_component(visibilityprovider.$$.fragment);
    },
    m(target, anchor) {
      insert(target, main, anchor);
      mount_component(visibilityprovider, main, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      const visibilityprovider_changes = {};
      if (dirty & 2) {
        visibilityprovider_changes.$$scope = { dirty, ctx: ctx2 };
      }
      visibilityprovider.$set(visibilityprovider_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(visibilityprovider.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(visibilityprovider.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(main);
      destroy_component(visibilityprovider);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $Config;
  component_subscribe($$self, Config, ($$value) => $$invalidate(0, $Config = $$value));
  debugData([
    {
      action: "config",
      data: {
        config: {
          cardData: cards,
          abilityData: [],
          factions: {
            ambarino: "Neutral",
            new_hanover: "Northern",
            lemoyne: "Nilfgaardian",
            new_austin: "Monsters",
            west_elizabeth: "Scoia'tael"
          }
        }
      }
    },
    {
      action: "open",
      data: {
        route: Routes.cardDetails,
        params: { cardKey: "card_fontanatheatre" }
      }
    },
    {
      action: "response:catalog",
      data: { catalog }
    },
    {
      action: "response:leaderboard",
      data: { leaderboard }
    }
  ]);
  useNuiEvent("config", (data) => {
    const { config } = data;
    if (!!config.cardData) {
      Config.set({
        ...$Config,
        cards: Object.values(config.cardData).map((card) => new CardModel().fromJson(card))
      });
    }
    if (!!config.abilityData) {
      Config.set({
        ...$Config,
        abilities: Object.values(config.abilityData).map((ability) => new AbilityModel().fromJson(ability))
      });
    }
    if (!!config.factions) {
      console.log("adding factions");
      Config.set({
        ...$Config,
        factions: orderFactions(config.factions)
      });
      const allFaction = $Config.factions.find((f) => f.id === "all");
      console.log(allFaction);
      if (allFaction === void 0) {
        console.log("adding all faction");
        Config.set({
          ...$Config,
          factions: [{ id: "all", label: "All" }, ...$Config.factions]
        });
      }
    }
  });
  useNuiEvent("init:battle", (data) => {
    roomSide.set(data.side);
    roomFoeSide.set(data.foeSide);
    currentRouteParams.set({});
    currentRoute.set(Routes.battle);
  });
  useNuiEvent("response:joinRoom", (data) => {
    room.set(data.roomID);
    spectator.set(data.spectate);
    inGame.set(true);
  });
  return [];
}
class App extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
new App({
  target: document.getElementById("app")
});
//# sourceMappingURL=index.eef61a4b.js.map
