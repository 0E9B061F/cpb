
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
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
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
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
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
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
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
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
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
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
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
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
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
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
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Link.svelte generated by Svelte v3.44.3 */
    const file$G = "src/Link.svelte";

    // (83:0) {:else}
    function create_else_block$d(ctx) {
    	let a;
    	let div;
    	let t;
    	let a_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[24].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[23], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			div = element("div");
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "mark");
    			add_location(div, file$G, 84, 4, 2213);
    			attr_dev(a, "href", /*href*/ ctx[4]);
    			attr_dev(a, "title", /*title*/ ctx[0]);
    			attr_dev(a, "class", a_class_value = "cpblink " + /*klass*/ ctx[5] + " svelte-18xa9bp");
    			add_location(a, file$G, 83, 2, 2132);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, div);
    			append_dev(a, t);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(/*clicked*/ ctx[11]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[23], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*href*/ 16) {
    				attr_dev(a, "href", /*href*/ ctx[4]);
    			}

    			if (!current || dirty & /*title*/ 1) {
    				attr_dev(a, "title", /*title*/ ctx[0]);
    			}

    			if (!current || dirty & /*klass*/ 32 && a_class_value !== (a_class_value = "cpblink " + /*klass*/ ctx[5] + " svelte-18xa9bp")) {
    				attr_dev(a, "class", a_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$d.name,
    		type: "else",
    		source: "(83:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (78:35) 
    function create_if_block_1$c(ctx) {
    	let span;
    	let div;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[24].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[23], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			div = element("div");
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "mark");
    			add_location(div, file$G, 79, 4, 2069);
    			attr_dev(span, "class", "cpblink current-link svelte-18xa9bp");
    			attr_dev(span, "title", "you are here");
    			add_location(span, file$G, 78, 2, 2008);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, div);
    			append_dev(span, t);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[23], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$c.name,
    		type: "if",
    		source: "(78:35) ",
    		ctx
    	});

    	return block;
    }

    // (71:0) {#if nolink}
    function create_if_block$p(ctx) {
    	let span;
    	let svg;
    	let circle;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[24].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[23], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(circle, "cx", "3");
    			attr_dev(circle, "cy", "3");
    			attr_dev(circle, "r", "2.5");
    			add_location(circle, file$G, 73, 6, 1899);
    			attr_dev(svg, "class", "mark");
    			attr_dev(svg, "viewBox", "0 0 6 6");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$G, 72, 4, 1821);
    			attr_dev(span, "class", "cpblink nolink svelte-18xa9bp");
    			attr_dev(span, "title", /*title*/ ctx[0]);
    			add_location(span, file$G, 71, 2, 1760);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, svg);
    			append_dev(svg, circle);
    			append_dev(span, t);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*clicked*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[23], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*title*/ 1) {
    				attr_dev(span, "title", /*title*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$p.name,
    		type: "if",
    		source: "(71:0) {#if nolink}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$W(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$p, create_if_block_1$c, create_else_block$d];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*nolink*/ ctx[2]) return 0;
    		if (!/*global*/ ctx[1] && /*$path*/ ctx[3] == /*href*/ ctx[4]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$W.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$W($$self, $$props, $$invalidate) {
    	let klass;
    	let $linkmap;
    	let $links;
    	let $gs;
    	let $path;
    	let $trail;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	const gs = getContext('gs');
    	validate_store(gs, 'gs');
    	component_subscribe($$self, gs, value => $$invalidate(22, $gs = value));
    	const trail = getContext('trail');
    	validate_store(trail, 'trail');
    	component_subscribe($$self, trail, value => $$invalidate(26, $trail = value));
    	const path = getContext('path');
    	validate_store(path, 'path');
    	component_subscribe($$self, path, value => $$invalidate(3, $path = value));
    	const links = getContext('links');
    	validate_store(links, 'links');
    	component_subscribe($$self, links, value => $$invalidate(25, $links = value));
    	const linkmap = getContext('linkmap');
    	validate_store(linkmap, 'linkmap');
    	component_subscribe($$self, linkmap, value => $$invalidate(21, $linkmap = value));
    	let { space = null } = $$props;
    	let { title = null } = $$props;
    	let { nst = null } = $$props;
    	let { uuid = null } = $$props;
    	let { special = null } = $$props;
    	let { cmd = null } = $$props;
    	let { first = null } = $$props;
    	let { global = false } = $$props;
    	let { bounce = false } = $$props;
    	let { nolink = false } = $$props;
    	let { self = false } = $$props;
    	let { decmd = false } = $$props;
    	if (bounce && typeof bounce != 'string') bounce = '/';
    	let href;

    	if (self || decmd || nolink) href = null; else if (bounce) href = $trail[1] || bounce; else if (special) href = `/CPB/${special}`; else if (uuid) href = `/${uuid}`; else if (nst) {
    		const p = nst.split('/');
    		const n = p[0];
    		const t = p[1];
    		space = n || 'main';
    		title = t || 'Home';
    		if (t) href = `/${n}/${t}`; else href = `/${n}`;
    	} else {
    		if (!space) space = 'main';
    		if (!title) title = 'Home';
    		nst = `${space}/${title}`;
    		href = `/${space}/${title}`;
    	}

    	const hash = cmd ? `#${cmd}` : '';

    	const goto = p => {
    		if (!nolink) $gs.goto(href);
    	};

    	const clicked = () => {
    		if (first) first().then(r => goto()); else goto();
    	};

    	const nstc = nst ? nst.replace('/', ':') : null;
    	if (!special) set_store_value(links, $links = [...$links, nstc || uuid], $links);

    	onDestroy(() => {
    		if (!special) {
    			const i = $links.indexOf(nstc || uuid);
    			$links.splice(i, 1);
    			links.set($links);
    		}
    	});

    	const writable_props = [
    		'space',
    		'title',
    		'nst',
    		'uuid',
    		'special',
    		'cmd',
    		'first',
    		'global',
    		'bounce',
    		'nolink',
    		'self',
    		'decmd'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('space' in $$props) $$invalidate(12, space = $$props.space);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('nst' in $$props) $$invalidate(13, nst = $$props.nst);
    		if ('uuid' in $$props) $$invalidate(15, uuid = $$props.uuid);
    		if ('special' in $$props) $$invalidate(16, special = $$props.special);
    		if ('cmd' in $$props) $$invalidate(17, cmd = $$props.cmd);
    		if ('first' in $$props) $$invalidate(18, first = $$props.first);
    		if ('global' in $$props) $$invalidate(1, global = $$props.global);
    		if ('bounce' in $$props) $$invalidate(14, bounce = $$props.bounce);
    		if ('nolink' in $$props) $$invalidate(2, nolink = $$props.nolink);
    		if ('self' in $$props) $$invalidate(19, self = $$props.self);
    		if ('decmd' in $$props) $$invalidate(20, decmd = $$props.decmd);
    		if ('$$scope' in $$props) $$invalidate(23, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		gs,
    		trail,
    		path,
    		links,
    		linkmap,
    		space,
    		title,
    		nst,
    		uuid,
    		special,
    		cmd,
    		first,
    		global,
    		bounce,
    		nolink,
    		self,
    		decmd,
    		href,
    		hash,
    		goto,
    		clicked,
    		nstc,
    		klass,
    		$linkmap,
    		$links,
    		$gs,
    		$path,
    		$trail
    	});

    	$$self.$inject_state = $$props => {
    		if ('space' in $$props) $$invalidate(12, space = $$props.space);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('nst' in $$props) $$invalidate(13, nst = $$props.nst);
    		if ('uuid' in $$props) $$invalidate(15, uuid = $$props.uuid);
    		if ('special' in $$props) $$invalidate(16, special = $$props.special);
    		if ('cmd' in $$props) $$invalidate(17, cmd = $$props.cmd);
    		if ('first' in $$props) $$invalidate(18, first = $$props.first);
    		if ('global' in $$props) $$invalidate(1, global = $$props.global);
    		if ('bounce' in $$props) $$invalidate(14, bounce = $$props.bounce);
    		if ('nolink' in $$props) $$invalidate(2, nolink = $$props.nolink);
    		if ('self' in $$props) $$invalidate(19, self = $$props.self);
    		if ('decmd' in $$props) $$invalidate(20, decmd = $$props.decmd);
    		if ('href' in $$props) $$invalidate(4, href = $$props.href);
    		if ('klass' in $$props) $$invalidate(5, klass = $$props.klass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*self, $gs, $path, decmd, href*/ 5767192) {
    			if (self) $$invalidate(4, href = $gs.bare($path) + hash); else if (decmd) $$invalidate(4, href = $gs.bare($path)); else $$invalidate(4, href += hash);
    		}

    		if ($$self.$$.dirty & /*special, nolink, $linkmap, uuid*/ 2195460) {
    			$$invalidate(5, klass = !special && !nolink && $linkmap[nstc || uuid]
    			? 'missing'
    			: '');
    		}
    	};

    	return [
    		title,
    		global,
    		nolink,
    		$path,
    		href,
    		klass,
    		gs,
    		trail,
    		path,
    		links,
    		linkmap,
    		clicked,
    		space,
    		nst,
    		bounce,
    		uuid,
    		special,
    		cmd,
    		first,
    		self,
    		decmd,
    		$linkmap,
    		$gs,
    		$$scope,
    		slots
    	];
    }

    class Link$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$W, create_fragment$W, safe_not_equal, {
    			space: 12,
    			title: 0,
    			nst: 13,
    			uuid: 15,
    			special: 16,
    			cmd: 17,
    			first: 18,
    			global: 1,
    			bounce: 14,
    			nolink: 2,
    			self: 19,
    			decmd: 20
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$W.name
    		});
    	}

    	get space() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set space(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nst() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nst(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uuid() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uuid(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get special() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set special(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cmd() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cmd(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get first() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set first(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get global() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set global(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bounce() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bounce(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nolink() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nolink(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get self() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set self(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get decmd() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set decmd(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FB.svelte generated by Svelte v3.44.3 */

    const file$F = "src/FB.svelte";

    function create_fragment$V(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "flexbox " + /*cf*/ ctx[0]);
    			add_location(div, file$F, 35, 0, 674);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*cf*/ 1 && div_class_value !== (div_class_value = "flexbox " + /*cf*/ ctx[0])) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$V.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$V($$self, $$props, $$invalidate) {
    	let cf;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FB', slots, ['default']);
    	let { c = [] } = $$props;
    	let { expand = false } = $$props;
    	let { vert = false } = $$props;
    	let { leaf = false } = $$props;
    	let { form = false } = $$props;
    	let { flip = false } = $$props;
    	let { zero = false } = $$props;
    	let { center = false } = $$props;

    	const mkc = cc => {
    		if (typeof cc == 'string') cc = cc.split(' ');
    		if (expand) cc.push('fb-expand');
    		if (vert) cc.push('fb-vert'); else cc.push('fb-hori');
    		if (flip) cc.push('fb-flip'); else cc.push('fb-norm');
    		if (!leaf) cc.push('fb-box');
    		if (form) cc.push('fb-form');
    		if (zero) cc.push('fb-zero'); else cc.push('fb-grid');
    		if (center) cc.push('fb-center');
    		return cc.join(' ');
    	};

    	const writable_props = ['c', 'expand', 'vert', 'leaf', 'form', 'flip', 'zero', 'center'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FB> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('c' in $$props) $$invalidate(1, c = $$props.c);
    		if ('expand' in $$props) $$invalidate(2, expand = $$props.expand);
    		if ('vert' in $$props) $$invalidate(3, vert = $$props.vert);
    		if ('leaf' in $$props) $$invalidate(4, leaf = $$props.leaf);
    		if ('form' in $$props) $$invalidate(5, form = $$props.form);
    		if ('flip' in $$props) $$invalidate(6, flip = $$props.flip);
    		if ('zero' in $$props) $$invalidate(7, zero = $$props.zero);
    		if ('center' in $$props) $$invalidate(8, center = $$props.center);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		c,
    		expand,
    		vert,
    		leaf,
    		form,
    		flip,
    		zero,
    		center,
    		mkc,
    		cf
    	});

    	$$self.$inject_state = $$props => {
    		if ('c' in $$props) $$invalidate(1, c = $$props.c);
    		if ('expand' in $$props) $$invalidate(2, expand = $$props.expand);
    		if ('vert' in $$props) $$invalidate(3, vert = $$props.vert);
    		if ('leaf' in $$props) $$invalidate(4, leaf = $$props.leaf);
    		if ('form' in $$props) $$invalidate(5, form = $$props.form);
    		if ('flip' in $$props) $$invalidate(6, flip = $$props.flip);
    		if ('zero' in $$props) $$invalidate(7, zero = $$props.zero);
    		if ('center' in $$props) $$invalidate(8, center = $$props.center);
    		if ('cf' in $$props) $$invalidate(0, cf = $$props.cf);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*c*/ 2) {
    			$$invalidate(0, cf = mkc(c));
    		}
    	};

    	return [cf, c, expand, vert, leaf, form, flip, zero, center, $$scope, slots];
    }

    class FB extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$V, create_fragment$V, safe_not_equal, {
    			c: 1,
    			expand: 2,
    			vert: 3,
    			leaf: 4,
    			form: 5,
    			flip: 6,
    			zero: 7,
    			center: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FB",
    			options,
    			id: create_fragment$V.name
    		});
    	}

    	get c() {
    		throw new Error("<FB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set c(value) {
    		throw new Error("<FB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expand() {
    		throw new Error("<FB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expand(value) {
    		throw new Error("<FB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vert() {
    		throw new Error("<FB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vert(value) {
    		throw new Error("<FB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get leaf() {
    		throw new Error("<FB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set leaf(value) {
    		throw new Error("<FB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get form() {
    		throw new Error("<FB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set form(value) {
    		throw new Error("<FB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flip() {
    		throw new Error("<FB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error("<FB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zero() {
    		throw new Error("<FB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zero(value) {
    		throw new Error("<FB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<FB>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<FB>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FP.svelte generated by Svelte v3.44.3 */
    const file$E = "src/FP.svelte";

    // (12:2) {#if block}
    function create_if_block$o(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "fp-item");
    			add_location(div, file$E, 11, 13, 247);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$o.name,
    		type: "if",
    		source: "(12:2) {#if block}",
    		ctx
    	});

    	return block_1;
    }

    // (10:0) <FB {c}>
    function create_default_slot$n(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let if_block_anchor;
    	let current;
    	let if_block = /*block*/ ctx[2] && create_if_block$o(ctx);

    	const block_1 = {
    		c: function create() {
    			div = element("div");
    			t0 = text(/*lab*/ ctx[1]);
    			t1 = text(":");
    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(div, "class", "fp-label");
    			add_location(div, file$E, 10, 2, 199);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			insert_dev(target, t2, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*lab*/ 2) set_data_dev(t0, /*lab*/ ctx[1]);

    			if (/*block*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*block*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$o(ctx);
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t2);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_default_slot$n.name,
    		type: "slot",
    		source: "(10:0) <FB {c}>",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$U(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				c: /*c*/ ctx[0],
    				$$slots: { default: [create_default_slot$n] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block_1 = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};
    			if (dirty & /*c*/ 1) fb_changes.c = /*c*/ ctx[0];

    			if (dirty & /*$$scope, block, lab*/ 22) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$U.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$U($$self, $$props, $$invalidate) {
    	let block;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FP', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { lab = '' } = $$props;
    	let { c = [] } = $$props;
    	if (typeof c == 'string') c = c.split(' ');
    	c.push('fp-pair');
    	const writable_props = ['lab', 'c'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FP> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lab' in $$props) $$invalidate(1, lab = $$props.lab);
    		if ('c' in $$props) $$invalidate(0, c = $$props.c);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ FB, lab, c, block });

    	$$self.$inject_state = $$props => {
    		if ('lab' in $$props) $$invalidate(1, lab = $$props.lab);
    		if ('c' in $$props) $$invalidate(0, c = $$props.c);
    		if ('block' in $$props) $$invalidate(2, block = $$props.block);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(2, block = $$slots.default);
    	return [c, lab, block, slots, $$scope];
    }

    class FP extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$U, create_fragment$U, safe_not_equal, { lab: 1, c: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FP",
    			options,
    			id: create_fragment$U.name
    		});
    	}

    	get lab() {
    		throw new Error("<FP>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lab(value) {
    		throw new Error("<FP>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get c() {
    		throw new Error("<FP>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set c(value) {
    		throw new Error("<FP>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/PP.svelte generated by Svelte v3.44.3 */
    const file$D = "src/PP.svelte";

    // (24:0) <FB c={cc}>
    function create_default_slot$m(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let t3_value = JSON.stringify(/*val*/ ctx[1]) + "";
    	let t3;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(/*lab*/ ctx[0]);
    			t1 = text(":");
    			t2 = space();
    			div1 = element("div");
    			t3 = text(t3_value);
    			attr_dev(div0, "class", "fp-label");
    			add_location(div0, file$D, 24, 2, 568);
    			attr_dev(div1, "class", "fp-item");
    			add_location(div1, file$D, 25, 2, 605);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*lab*/ 1) set_data_dev(t0, /*lab*/ ctx[0]);
    			if (dirty & /*val*/ 2 && t3_value !== (t3_value = JSON.stringify(/*val*/ ctx[1]) + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$m.name,
    		type: "slot",
    		source: "(24:0) <FB c={cc}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$T(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				c: /*cc*/ ctx[2],
    				$$slots: { default: [create_default_slot$m] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};
    			if (dirty & /*cc*/ 4) fb_changes.c = /*cc*/ ctx[2];

    			if (dirty & /*$$scope, val, lab*/ 131) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$T.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$T($$self, $$props, $$invalidate) {
    	let state;
    	let cc;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PP', slots, []);
    	let { lab = '' } = $$props;
    	let { t } = $$props;
    	let { val } = $$props;
    	let { c = [] } = $$props;

    	const type = v => {
    		let t;

    		if (typeof v == 'boolean') t = v ? 'true' : 'false'; else if (v === null) t = 'null'; else if (typeof v == 'string') {
    			if (v.length) t = 'string-full'; else t = 'string-empty';
    		} else t = typeof v;

    		return t;
    	};

    	if (typeof c == 'string') c = c.split(' ');
    	c.push('fp-pair');
    	c.push('fp-cond');
    	const writable_props = ['lab', 't', 'val', 'c'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PP> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lab' in $$props) $$invalidate(0, lab = $$props.lab);
    		if ('t' in $$props) $$invalidate(4, t = $$props.t);
    		if ('val' in $$props) $$invalidate(1, val = $$props.val);
    		if ('c' in $$props) $$invalidate(3, c = $$props.c);
    	};

    	$$self.$capture_state = () => ({ FB, lab, t, val, c, type, state, cc });

    	$$self.$inject_state = $$props => {
    		if ('lab' in $$props) $$invalidate(0, lab = $$props.lab);
    		if ('t' in $$props) $$invalidate(4, t = $$props.t);
    		if ('val' in $$props) $$invalidate(1, val = $$props.val);
    		if ('c' in $$props) $$invalidate(3, c = $$props.c);
    		if ('state' in $$props) $$invalidate(5, state = $$props.state);
    		if ('cc' in $$props) $$invalidate(2, cc = $$props.cc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*t, val*/ 18) {
    			$$invalidate(5, state = t ? type(t(val)) : type(val));
    		}

    		if ($$self.$$.dirty & /*c, state*/ 40) {
    			$$invalidate(2, cc = [...c, 'pp-' + state]);
    		}
    	};

    	return [lab, val, cc, c, t, state];
    }

    class PP extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$T, create_fragment$T, safe_not_equal, { lab: 0, t: 4, val: 1, c: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PP",
    			options,
    			id: create_fragment$T.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*t*/ ctx[4] === undefined && !('t' in props)) {
    			console.warn("<PP> was created without expected prop 't'");
    		}

    		if (/*val*/ ctx[1] === undefined && !('val' in props)) {
    			console.warn("<PP> was created without expected prop 'val'");
    		}
    	}

    	get lab() {
    		throw new Error("<PP>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lab(value) {
    		throw new Error("<PP>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get t() {
    		throw new Error("<PP>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set t(value) {
    		throw new Error("<PP>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get val() {
    		throw new Error("<PP>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set val(value) {
    		throw new Error("<PP>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get c() {
    		throw new Error("<PP>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set c(value) {
    		throw new Error("<PP>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FR.svelte generated by Svelte v3.44.3 */

    // (12:2) {#if haslab}
    function create_if_block$n(ctx) {
    	let fp;
    	let current;

    	fp = new FP({
    			props: { c: "fp-metalabel", lab: /*lab*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fp.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fp, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fp_changes = {};
    			if (dirty & /*lab*/ 2) fp_changes.lab = /*lab*/ ctx[1];
    			fp.$set(fp_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fp.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fp.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fp, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$n.name,
    		type: "if",
    		source: "(12:2) {#if haslab}",
    		ctx
    	});

    	return block;
    }

    // (11:0) <FB {c}>
    function create_default_slot$l(ctx) {
    	let t;
    	let current;
    	let if_block = /*haslab*/ ctx[2] && create_if_block$n(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*haslab*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*haslab*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$n(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$l.name,
    		type: "slot",
    		source: "(11:0) <FB {c}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$S(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				c: /*c*/ ctx[0],
    				$$slots: { default: [create_default_slot$l] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};
    			if (dirty & /*c*/ 1) fb_changes.c = /*c*/ ctx[0];

    			if (dirty & /*$$scope, lab, haslab*/ 22) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$S.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$S($$self, $$props, $$invalidate) {
    	let haslab;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FR', slots, ['default']);
    	let { lab = '' } = $$props;
    	let { c = [] } = $$props;
    	if (typeof c == 'string') c = c.split(' ');
    	c.push('fp-run');
    	const writable_props = ['lab', 'c'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FR> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lab' in $$props) $$invalidate(1, lab = $$props.lab);
    		if ('c' in $$props) $$invalidate(0, c = $$props.c);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ FB, FP, lab, c, haslab });

    	$$self.$inject_state = $$props => {
    		if ('lab' in $$props) $$invalidate(1, lab = $$props.lab);
    		if ('c' in $$props) $$invalidate(0, c = $$props.c);
    		if ('haslab' in $$props) $$invalidate(2, haslab = $$props.haslab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*lab*/ 2) {
    			$$invalidate(2, haslab = typeof lab == 'string' && lab.length);
    		}
    	};

    	return [c, lab, haslab, slots, $$scope];
    }

    class FR extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$S, create_fragment$S, safe_not_equal, { lab: 1, c: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FR",
    			options,
    			id: create_fragment$S.name
    		});
    	}

    	get lab() {
    		throw new Error("<FR>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lab(value) {
    		throw new Error("<FR>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get c() {
    		throw new Error("<FR>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set c(value) {
    		throw new Error("<FR>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/FT.svelte generated by Svelte v3.44.3 */

    // (8:0) <FB {c}>
    function create_default_slot$k(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$k.name,
    		type: "slot",
    		source: "(8:0) <FB {c}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$R(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				c: /*c*/ ctx[0],
    				$$slots: { default: [create_default_slot$k] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};
    			if (dirty & /*c*/ 1) fb_changes.c = /*c*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$R.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$R($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FT', slots, ['default']);
    	let { c = [] } = $$props;
    	if (typeof c == 'string') c = c.split(' ');
    	c.push('fp-table');
    	const writable_props = ['c'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FT> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('c' in $$props) $$invalidate(0, c = $$props.c);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ FB, c });

    	$$self.$inject_state = $$props => {
    		if ('c' in $$props) $$invalidate(0, c = $$props.c);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [c, slots, $$scope];
    }

    class FT extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$R, create_fragment$R, safe_not_equal, { c: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FT",
    			options,
    			id: create_fragment$R.name
    		});
    	}

    	get c() {
    		throw new Error("<FT>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set c(value) {
    		throw new Error("<FT>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/LocRO.svelte generated by Svelte v3.44.3 */

    // (9:0) <FR lab="loc">
    function create_default_slot$j(ctx) {
    	let pp0;
    	let t0;
    	let pp1;
    	let t1;
    	let pp2;
    	let t2;
    	let pp3;
    	let t3;
    	let pp4;
    	let current;

    	pp0 = new PP({
    			props: {
    				lab: "space",
    				val: /*$loc*/ ctx[0].namespace
    			},
    			$$inline: true
    		});

    	pp1 = new PP({
    			props: { lab: "title", val: /*$loc*/ ctx[0].title },
    			$$inline: true
    		});

    	pp2 = new PP({
    			props: { lab: "uuid", val: /*$loc*/ ctx[0].uuid },
    			$$inline: true
    		});

    	pp3 = new PP({
    			props: {
    				lab: "special",
    				val: /*$loc*/ ctx[0].special
    			},
    			$$inline: true
    		});

    	pp4 = new PP({
    			props: { lab: "cmd", val: /*$loc*/ ctx[0].cmd },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pp0.$$.fragment);
    			t0 = space();
    			create_component(pp1.$$.fragment);
    			t1 = space();
    			create_component(pp2.$$.fragment);
    			t2 = space();
    			create_component(pp3.$$.fragment);
    			t3 = space();
    			create_component(pp4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pp0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(pp1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(pp2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(pp3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(pp4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pp0_changes = {};
    			if (dirty & /*$loc*/ 1) pp0_changes.val = /*$loc*/ ctx[0].namespace;
    			pp0.$set(pp0_changes);
    			const pp1_changes = {};
    			if (dirty & /*$loc*/ 1) pp1_changes.val = /*$loc*/ ctx[0].title;
    			pp1.$set(pp1_changes);
    			const pp2_changes = {};
    			if (dirty & /*$loc*/ 1) pp2_changes.val = /*$loc*/ ctx[0].uuid;
    			pp2.$set(pp2_changes);
    			const pp3_changes = {};
    			if (dirty & /*$loc*/ 1) pp3_changes.val = /*$loc*/ ctx[0].special;
    			pp3.$set(pp3_changes);
    			const pp4_changes = {};
    			if (dirty & /*$loc*/ 1) pp4_changes.val = /*$loc*/ ctx[0].cmd;
    			pp4.$set(pp4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pp0.$$.fragment, local);
    			transition_in(pp1.$$.fragment, local);
    			transition_in(pp2.$$.fragment, local);
    			transition_in(pp3.$$.fragment, local);
    			transition_in(pp4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pp0.$$.fragment, local);
    			transition_out(pp1.$$.fragment, local);
    			transition_out(pp2.$$.fragment, local);
    			transition_out(pp3.$$.fragment, local);
    			transition_out(pp4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pp0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(pp1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(pp2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(pp3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(pp4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$j.name,
    		type: "slot",
    		source: "(9:0) <FR lab=\\\"loc\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$Q(ctx) {
    	let fr;
    	let current;

    	fr = new FR({
    			props: {
    				lab: "loc",
    				$$slots: { default: [create_default_slot$j] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fr.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fr, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fr_changes = {};

    			if (dirty & /*$$scope, $loc*/ 5) {
    				fr_changes.$$scope = { dirty, ctx };
    			}

    			fr.$set(fr_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fr.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fr.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fr, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Q($$self, $$props, $$invalidate) {
    	let $loc;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LocRO', slots, []);
    	const loc = getContext('loc');
    	validate_store(loc, 'loc');
    	component_subscribe($$self, loc, value => $$invalidate(0, $loc = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LocRO> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ FP, PP, FR, getContext, loc, $loc });
    	return [$loc, loc];
    }

    class LocRO extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$Q, create_fragment$Q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LocRO",
    			options,
    			id: create_fragment$Q.name
    		});
    	}
    }

    /* src/SessRO.svelte generated by Svelte v3.44.3 */

    // (10:0) {#if $hassess}
    function create_if_block$m(ctx) {
    	let fr;
    	let current;

    	fr = new FR({
    			props: {
    				lab: "session",
    				$$slots: { default: [create_default_slot$i] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fr.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fr, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fr_changes = {};

    			if (dirty & /*$$scope, $session*/ 18) {
    				fr_changes.$$scope = { dirty, ctx };
    			}

    			fr.$set(fr_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fr.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fr.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fr, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$m.name,
    		type: "if",
    		source: "(10:0) {#if $hassess}",
    		ctx
    	});

    	return block;
    }

    // (11:0) <FR lab="session">
    function create_default_slot$i(ctx) {
    	let pp0;
    	let t0;
    	let pp1;
    	let t1;
    	let pp2;
    	let current;

    	pp0 = new PP({
    			props: {
    				lab: "uuid",
    				val: /*$session*/ ctx[1].val.uuid
    			},
    			$$inline: true
    		});

    	pp1 = new PP({
    			props: {
    				lab: "login",
    				val: /*$session*/ ctx[1].val.login
    			},
    			$$inline: true
    		});

    	pp2 = new PP({
    			props: {
    				lab: "handle",
    				val: /*$session*/ ctx[1].val.handle
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pp0.$$.fragment);
    			t0 = space();
    			create_component(pp1.$$.fragment);
    			t1 = space();
    			create_component(pp2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pp0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(pp1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(pp2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pp0_changes = {};
    			if (dirty & /*$session*/ 2) pp0_changes.val = /*$session*/ ctx[1].val.uuid;
    			pp0.$set(pp0_changes);
    			const pp1_changes = {};
    			if (dirty & /*$session*/ 2) pp1_changes.val = /*$session*/ ctx[1].val.login;
    			pp1.$set(pp1_changes);
    			const pp2_changes = {};
    			if (dirty & /*$session*/ 2) pp2_changes.val = /*$session*/ ctx[1].val.handle;
    			pp2.$set(pp2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pp0.$$.fragment, local);
    			transition_in(pp1.$$.fragment, local);
    			transition_in(pp2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pp0.$$.fragment, local);
    			transition_out(pp1.$$.fragment, local);
    			transition_out(pp2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pp0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(pp1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(pp2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$i.name,
    		type: "slot",
    		source: "(11:0) <FR lab=\\\"session\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$P(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$hassess*/ ctx[0] && create_if_block$m(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$hassess*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$hassess*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$m(ctx);
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$P.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$P($$self, $$props, $$invalidate) {
    	let $hassess;
    	let $session;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SessRO', slots, []);
    	const hassess = getContext('hassess');
    	validate_store(hassess, 'hassess');
    	component_subscribe($$self, hassess, value => $$invalidate(0, $hassess = value));
    	const session = getContext('session');
    	validate_store(session, 'session');
    	component_subscribe($$self, session, value => $$invalidate(1, $session = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SessRO> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FP,
    		PP,
    		FR,
    		getContext,
    		hassess,
    		session,
    		$hassess,
    		$session
    	});

    	return [$hassess, $session, hassess, session];
    }

    class SessRO extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$P, create_fragment$P, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SessRO",
    			options,
    			id: create_fragment$P.name
    		});
    	}
    }

    /* src/RespRO.svelte generated by Svelte v3.44.3 */

    // (19:0) {:else}
    function create_else_block$c(ctx) {
    	let pp;
    	let current;

    	pp = new PP({
    			props: { lab: /*lab*/ ctx[0], val: /*r*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pp.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pp, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pp_changes = {};
    			if (dirty & /*lab*/ 1) pp_changes.lab = /*lab*/ ctx[0];
    			if (dirty & /*r*/ 4) pp_changes.val = /*r*/ ctx[2];
    			pp.$set(pp_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pp.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pp.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pp, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$c.name,
    		type: "else",
    		source: "(19:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:0) {#if h}
    function create_if_block$l(ctx) {
    	let fr;
    	let current;

    	fr = new FR({
    			props: {
    				lab: /*lab*/ ctx[0],
    				$$slots: { default: [create_default_slot$h] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fr.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fr, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fr_changes = {};
    			if (dirty & /*lab*/ 1) fr_changes.lab = /*lab*/ ctx[0];

    			if (dirty & /*$$scope, r*/ 12) {
    				fr_changes.$$scope = { dirty, ctx };
    			}

    			fr.$set(fr_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fr.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fr.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fr, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$l.name,
    		type: "if",
    		source: "(11:0) {#if h}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#if r.msg}
    function create_if_block_1$b(ctx) {
    	let pp;
    	let current;

    	pp = new PP({
    			props: { lab: "msg", val: /*r*/ ctx[2].msg },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pp.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pp, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pp_changes = {};
    			if (dirty & /*r*/ 4) pp_changes.val = /*r*/ ctx[2].msg;
    			pp.$set(pp_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pp.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pp.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pp, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(14:4) {#if r.msg}",
    		ctx
    	});

    	return block;
    }

    // (12:2) <FR {lab}>
    function create_default_slot$h(ctx) {
    	let pp0;
    	let t0;
    	let t1;
    	let pp1;
    	let current;

    	pp0 = new PP({
    			props: {
    				lab: "err",
    				t: func$1,
    				val: /*r*/ ctx[2].err
    			},
    			$$inline: true
    		});

    	let if_block = /*r*/ ctx[2].msg && create_if_block_1$b(ctx);

    	pp1 = new PP({
    			props: { lab: "val", val: !!/*r*/ ctx[2].val },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pp0.$$.fragment);
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			create_component(pp1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pp0, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(pp1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pp0_changes = {};
    			if (dirty & /*r*/ 4) pp0_changes.val = /*r*/ ctx[2].err;
    			pp0.$set(pp0_changes);

    			if (/*r*/ ctx[2].msg) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*r*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const pp1_changes = {};
    			if (dirty & /*r*/ 4) pp1_changes.val = !!/*r*/ ctx[2].val;
    			pp1.$set(pp1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pp0.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(pp1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pp0.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(pp1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pp0, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(pp1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$h.name,
    		type: "slot",
    		source: "(12:2) <FR {lab}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$O(ctx) {
    	let pp;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	pp = new PP({
    			props: {
    				lab: "has" + /*lab*/ ctx[0],
    				val: /*h*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$l, create_else_block$c];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*h*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(pp.$$.fragment);
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(pp, target, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const pp_changes = {};
    			if (dirty & /*lab*/ 1) pp_changes.lab = "has" + /*lab*/ ctx[0];
    			if (dirty & /*h*/ 2) pp_changes.val = /*h*/ ctx[1];
    			pp.$set(pp_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pp.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pp.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pp, detaching);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$O.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = v => v == 0;

    function instance$O($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RespRO', slots, []);
    	let { lab } = $$props;
    	let { h } = $$props;
    	let { r } = $$props;
    	const writable_props = ['lab', 'h', 'r'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RespRO> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lab' in $$props) $$invalidate(0, lab = $$props.lab);
    		if ('h' in $$props) $$invalidate(1, h = $$props.h);
    		if ('r' in $$props) $$invalidate(2, r = $$props.r);
    	};

    	$$self.$capture_state = () => ({ FP, FR, PP, lab, h, r });

    	$$self.$inject_state = $$props => {
    		if ('lab' in $$props) $$invalidate(0, lab = $$props.lab);
    		if ('h' in $$props) $$invalidate(1, h = $$props.h);
    		if ('r' in $$props) $$invalidate(2, r = $$props.r);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lab, h, r];
    }

    class RespRO extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$O, create_fragment$O, safe_not_equal, { lab: 0, h: 1, r: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RespRO",
    			options,
    			id: create_fragment$O.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*lab*/ ctx[0] === undefined && !('lab' in props)) {
    			console.warn("<RespRO> was created without expected prop 'lab'");
    		}

    		if (/*h*/ ctx[1] === undefined && !('h' in props)) {
    			console.warn("<RespRO> was created without expected prop 'h'");
    		}

    		if (/*r*/ ctx[2] === undefined && !('r' in props)) {
    			console.warn("<RespRO> was created without expected prop 'r'");
    		}
    	}

    	get lab() {
    		throw new Error("<RespRO>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lab(value) {
    		throw new Error("<RespRO>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get h() {
    		throw new Error("<RespRO>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set h(value) {
    		throw new Error("<RespRO>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get r() {
    		throw new Error("<RespRO>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set r(value) {
    		throw new Error("<RespRO>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Debugger.svelte generated by Svelte v3.44.3 */

    // (34:2) <FR lab="message">
    function create_default_slot_1$d(ctx) {
    	let pp0;
    	let t;
    	let pp1;
    	let current;

    	pp0 = new PP({
    			props: {
    				lab: "level",
    				val: /*$message*/ ctx[9].level
    			},
    			$$inline: true
    		});

    	pp1 = new PP({
    			props: {
    				lab: "text",
    				val: /*$message*/ ctx[9].text
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pp0.$$.fragment);
    			t = space();
    			create_component(pp1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pp0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(pp1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pp0_changes = {};
    			if (dirty & /*$message*/ 512) pp0_changes.val = /*$message*/ ctx[9].level;
    			pp0.$set(pp0_changes);
    			const pp1_changes = {};
    			if (dirty & /*$message*/ 512) pp1_changes.val = /*$message*/ ctx[9].text;
    			pp1.$set(pp1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pp0.$$.fragment, local);
    			transition_in(pp1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pp0.$$.fragment, local);
    			transition_out(pp1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pp0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(pp1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$d.name,
    		type: "slot",
    		source: "(34:2) <FR lab=\\\"message\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:0) <FT>
    function create_default_slot$g(ctx) {
    	let pp0;
    	let t0;
    	let locro;
    	let t1;
    	let pp1;
    	let t2;
    	let sessro;
    	let t3;
    	let respro0;
    	let t4;
    	let respro1;
    	let t5;
    	let respro2;
    	let t6;
    	let pp2;
    	let t7;
    	let fr;
    	let t8;
    	let pp3;
    	let t9;
    	let pp4;
    	let t10;
    	let pp5;
    	let current;

    	pp0 = new PP({
    			props: { lab: "path", val: /*$path*/ ctx[0] },
    			$$inline: true
    		});

    	locro = new LocRO({ $$inline: true });

    	pp1 = new PP({
    			props: { lab: "hassess", val: /*$hassess*/ ctx[1] },
    			$$inline: true
    		});

    	sessro = new SessRO({ $$inline: true });

    	respro0 = new RespRO({
    			props: {
    				lab: "page",
    				h: /*$haspage*/ ctx[2],
    				r: /*$page*/ ctx[3]
    			},
    			$$inline: true
    		});

    	respro1 = new RespRO({
    			props: {
    				lab: "user",
    				h: /*$hasuser*/ ctx[4],
    				r: /*$user*/ ctx[5]
    			},
    			$$inline: true
    		});

    	respro2 = new RespRO({
    			props: {
    				lab: "history",
    				h: /*$hashistory*/ ctx[6],
    				r: /*$history*/ ctx[7]
    			},
    			$$inline: true
    		});

    	pp2 = new PP({
    			props: {
    				lab: "AOD",
    				t: func,
    				val: /*$aod*/ ctx[8]
    			},
    			$$inline: true
    		});

    	fr = new FR({
    			props: {
    				lab: "message",
    				$$slots: { default: [create_default_slot_1$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	pp3 = new PP({
    			props: {
    				lab: "loading",
    				t: func_1,
    				val: /*$loading*/ ctx[10]
    			},
    			$$inline: true
    		});

    	pp4 = new PP({
    			props: { lab: "space", val: /*$space*/ ctx[11] },
    			$$inline: true
    		});

    	pp5 = new PP({
    			props: { lab: "title", val: /*$title*/ ctx[12] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pp0.$$.fragment);
    			t0 = space();
    			create_component(locro.$$.fragment);
    			t1 = space();
    			create_component(pp1.$$.fragment);
    			t2 = space();
    			create_component(sessro.$$.fragment);
    			t3 = space();
    			create_component(respro0.$$.fragment);
    			t4 = space();
    			create_component(respro1.$$.fragment);
    			t5 = space();
    			create_component(respro2.$$.fragment);
    			t6 = space();
    			create_component(pp2.$$.fragment);
    			t7 = space();
    			create_component(fr.$$.fragment);
    			t8 = space();
    			create_component(pp3.$$.fragment);
    			t9 = space();
    			create_component(pp4.$$.fragment);
    			t10 = space();
    			create_component(pp5.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pp0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(locro, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(pp1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(sessro, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(respro0, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(respro1, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(respro2, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(pp2, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(fr, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(pp3, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(pp4, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(pp5, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pp0_changes = {};
    			if (dirty & /*$path*/ 1) pp0_changes.val = /*$path*/ ctx[0];
    			pp0.$set(pp0_changes);
    			const pp1_changes = {};
    			if (dirty & /*$hassess*/ 2) pp1_changes.val = /*$hassess*/ ctx[1];
    			pp1.$set(pp1_changes);
    			const respro0_changes = {};
    			if (dirty & /*$haspage*/ 4) respro0_changes.h = /*$haspage*/ ctx[2];
    			if (dirty & /*$page*/ 8) respro0_changes.r = /*$page*/ ctx[3];
    			respro0.$set(respro0_changes);
    			const respro1_changes = {};
    			if (dirty & /*$hasuser*/ 16) respro1_changes.h = /*$hasuser*/ ctx[4];
    			if (dirty & /*$user*/ 32) respro1_changes.r = /*$user*/ ctx[5];
    			respro1.$set(respro1_changes);
    			const respro2_changes = {};
    			if (dirty & /*$hashistory*/ 64) respro2_changes.h = /*$hashistory*/ ctx[6];
    			if (dirty & /*$history*/ 128) respro2_changes.r = /*$history*/ ctx[7];
    			respro2.$set(respro2_changes);
    			const pp2_changes = {};
    			if (dirty & /*$aod*/ 256) pp2_changes.val = /*$aod*/ ctx[8];
    			pp2.$set(pp2_changes);
    			const fr_changes = {};

    			if (dirty & /*$$scope, $message*/ 67109376) {
    				fr_changes.$$scope = { dirty, ctx };
    			}

    			fr.$set(fr_changes);
    			const pp3_changes = {};
    			if (dirty & /*$loading*/ 1024) pp3_changes.val = /*$loading*/ ctx[10];
    			pp3.$set(pp3_changes);
    			const pp4_changes = {};
    			if (dirty & /*$space*/ 2048) pp4_changes.val = /*$space*/ ctx[11];
    			pp4.$set(pp4_changes);
    			const pp5_changes = {};
    			if (dirty & /*$title*/ 4096) pp5_changes.val = /*$title*/ ctx[12];
    			pp5.$set(pp5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pp0.$$.fragment, local);
    			transition_in(locro.$$.fragment, local);
    			transition_in(pp1.$$.fragment, local);
    			transition_in(sessro.$$.fragment, local);
    			transition_in(respro0.$$.fragment, local);
    			transition_in(respro1.$$.fragment, local);
    			transition_in(respro2.$$.fragment, local);
    			transition_in(pp2.$$.fragment, local);
    			transition_in(fr.$$.fragment, local);
    			transition_in(pp3.$$.fragment, local);
    			transition_in(pp4.$$.fragment, local);
    			transition_in(pp5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pp0.$$.fragment, local);
    			transition_out(locro.$$.fragment, local);
    			transition_out(pp1.$$.fragment, local);
    			transition_out(sessro.$$.fragment, local);
    			transition_out(respro0.$$.fragment, local);
    			transition_out(respro1.$$.fragment, local);
    			transition_out(respro2.$$.fragment, local);
    			transition_out(pp2.$$.fragment, local);
    			transition_out(fr.$$.fragment, local);
    			transition_out(pp3.$$.fragment, local);
    			transition_out(pp4.$$.fragment, local);
    			transition_out(pp5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pp0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(locro, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(pp1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(sessro, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(respro0, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(respro1, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(respro2, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(pp2, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(fr, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(pp3, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(pp4, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(pp5, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$g.name,
    		type: "slot",
    		source: "(25:0) <FT>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$N(ctx) {
    	let ft;
    	let current;

    	ft = new FT({
    			props: {
    				$$slots: { default: [create_default_slot$g] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(ft.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(ft, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const ft_changes = {};

    			if (dirty & /*$$scope, $title, $space, $loading, $message, $aod, $hashistory, $history, $hasuser, $user, $haspage, $page, $hassess, $path*/ 67117055) {
    				ft_changes.$$scope = { dirty, ctx };
    			}

    			ft.$set(ft_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ft.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ft.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ft, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = v => v > 0;
    const func_1 = v => !v;

    function instance$N($$self, $$props, $$invalidate) {
    	let $path;
    	let $hassess;
    	let $haspage;
    	let $page;
    	let $hasuser;
    	let $user;
    	let $hashistory;
    	let $history;
    	let $aod;
    	let $message;
    	let $loading;
    	let $space;
    	let $title;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Debugger', slots, []);
    	const path = getContext('path');
    	validate_store(path, 'path');
    	component_subscribe($$self, path, value => $$invalidate(0, $path = value));
    	const hassess = getContext('hassess');
    	validate_store(hassess, 'hassess');
    	component_subscribe($$self, hassess, value => $$invalidate(1, $hassess = value));
    	const haspage = getContext('haspage');
    	validate_store(haspage, 'haspage');
    	component_subscribe($$self, haspage, value => $$invalidate(2, $haspage = value));
    	const hasuser = getContext('hasuser');
    	validate_store(hasuser, 'hasuser');
    	component_subscribe($$self, hasuser, value => $$invalidate(4, $hasuser = value));
    	const hashistory = getContext('hashistory');
    	validate_store(hashistory, 'hashistory');
    	component_subscribe($$self, hashistory, value => $$invalidate(6, $hashistory = value));
    	const page = getContext('page');
    	validate_store(page, 'page');
    	component_subscribe($$self, page, value => $$invalidate(3, $page = value));
    	const user = getContext('user');
    	validate_store(user, 'user');
    	component_subscribe($$self, user, value => $$invalidate(5, $user = value));
    	const history = getContext('history');
    	validate_store(history, 'history');
    	component_subscribe($$self, history, value => $$invalidate(7, $history = value));
    	const aod = getContext('aod');
    	validate_store(aod, 'aod');
    	component_subscribe($$self, aod, value => $$invalidate(8, $aod = value));
    	const message = getContext('message');
    	validate_store(message, 'message');
    	component_subscribe($$self, message, value => $$invalidate(9, $message = value));
    	const loading = getContext('loading');
    	validate_store(loading, 'loading');
    	component_subscribe($$self, loading, value => $$invalidate(10, $loading = value));
    	const space = getContext('space');
    	validate_store(space, 'space');
    	component_subscribe($$self, space, value => $$invalidate(11, $space = value));
    	const title = getContext('title');
    	validate_store(title, 'title');
    	component_subscribe($$self, title, value => $$invalidate(12, $title = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Debugger> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FP,
    		PP,
    		FR,
    		FT,
    		LocRO,
    		SessRO,
    		RespRO,
    		getContext,
    		path,
    		hassess,
    		haspage,
    		hasuser,
    		hashistory,
    		page,
    		user,
    		history,
    		aod,
    		message,
    		loading,
    		space,
    		title,
    		$path,
    		$hassess,
    		$haspage,
    		$page,
    		$hasuser,
    		$user,
    		$hashistory,
    		$history,
    		$aod,
    		$message,
    		$loading,
    		$space,
    		$title
    	});

    	return [
    		$path,
    		$hassess,
    		$haspage,
    		$page,
    		$hasuser,
    		$user,
    		$hashistory,
    		$history,
    		$aod,
    		$message,
    		$loading,
    		$space,
    		$title,
    		path,
    		hassess,
    		haspage,
    		hasuser,
    		hashistory,
    		page,
    		user,
    		history,
    		aod,
    		message,
    		loading,
    		space,
    		title
    	];
    }

    class Debugger extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$N, create_fragment$N, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Debugger",
    			options,
    			id: create_fragment$N.name
    		});
    	}
    }

    // can-promise has a crash in some versions of react native that dont have
    // standard global objects
    // https://github.com/soldair/node-qrcode/issues/157

    var canPromise = function () {
      return typeof Promise === 'function' && Promise.prototype && Promise.prototype.then
    };

    let toSJISFunction;
    const CODEWORDS_COUNT = [
      0, // Not used
      26, 44, 70, 100, 134, 172, 196, 242, 292, 346,
      404, 466, 532, 581, 655, 733, 815, 901, 991, 1085,
      1156, 1258, 1364, 1474, 1588, 1706, 1828, 1921, 2051, 2185,
      2323, 2465, 2611, 2761, 2876, 3034, 3196, 3362, 3532, 3706
    ];

    /**
     * Returns the QR Code size for the specified version
     *
     * @param  {Number} version QR Code version
     * @return {Number}         size of QR code
     */
    var getSymbolSize$1 = function getSymbolSize (version) {
      if (!version) throw new Error('"version" cannot be null or undefined')
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40')
      return version * 4 + 17
    };

    /**
     * Returns the total number of codewords used to store data and EC information.
     *
     * @param  {Number} version QR Code version
     * @return {Number}         Data length in bits
     */
    var getSymbolTotalCodewords = function getSymbolTotalCodewords (version) {
      return CODEWORDS_COUNT[version]
    };

    /**
     * Encode data with Bose-Chaudhuri-Hocquenghem
     *
     * @param  {Number} data Value to encode
     * @return {Number}      Encoded value
     */
    var getBCHDigit = function (data) {
      let digit = 0;

      while (data !== 0) {
        digit++;
        data >>>= 1;
      }

      return digit
    };

    var setToSJISFunction = function setToSJISFunction (f) {
      if (typeof f !== 'function') {
        throw new Error('"toSJISFunc" is not a valid function.')
      }

      toSJISFunction = f;
    };

    var isKanjiModeEnabled = function () {
      return typeof toSJISFunction !== 'undefined'
    };

    var toSJIS = function toSJIS (kanji) {
      return toSJISFunction(kanji)
    };

    var utils$1 = {
    	getSymbolSize: getSymbolSize$1,
    	getSymbolTotalCodewords: getSymbolTotalCodewords,
    	getBCHDigit: getBCHDigit,
    	setToSJISFunction: setToSJISFunction,
    	isKanjiModeEnabled: isKanjiModeEnabled,
    	toSJIS: toSJIS
    };

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var errorCorrectionLevel = createCommonjsModule(function (module, exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };

    function fromString (string) {
      if (typeof string !== 'string') {
        throw new Error('Param is not a string')
      }

      const lcStr = string.toLowerCase();

      switch (lcStr) {
        case 'l':
        case 'low':
          return exports.L

        case 'm':
        case 'medium':
          return exports.M

        case 'q':
        case 'quartile':
          return exports.Q

        case 'h':
        case 'high':
          return exports.H

        default:
          throw new Error('Unknown EC Level: ' + string)
      }
    }

    exports.isValid = function isValid (level) {
      return level && typeof level.bit !== 'undefined' &&
        level.bit >= 0 && level.bit < 4
    };

    exports.from = function from (value, defaultValue) {
      if (exports.isValid(value)) {
        return value
      }

      try {
        return fromString(value)
      } catch (e) {
        return defaultValue
      }
    };
    });

    function BitBuffer () {
      this.buffer = [];
      this.length = 0;
    }

    BitBuffer.prototype = {

      get: function (index) {
        const bufIndex = Math.floor(index / 8);
        return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1
      },

      put: function (num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit(((num >>> (length - i - 1)) & 1) === 1);
        }
      },

      getLengthInBits: function () {
        return this.length
      },

      putBit: function (bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }

        if (bit) {
          this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
        }

        this.length++;
      }
    };

    var bitBuffer = BitBuffer;

    /**
     * Helper class to handle QR Code symbol modules
     *
     * @param {Number} size Symbol size
     */
    function BitMatrix (size) {
      if (!size || size < 1) {
        throw new Error('BitMatrix size must be defined and greater than 0')
      }

      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }

    /**
     * Set bit value at specified location
     * If reserved flag is set, this bit will be ignored during masking process
     *
     * @param {Number}  row
     * @param {Number}  col
     * @param {Boolean} value
     * @param {Boolean} reserved
     */
    BitMatrix.prototype.set = function (row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };

    /**
     * Returns bit value at specified location
     *
     * @param  {Number}  row
     * @param  {Number}  col
     * @return {Boolean}
     */
    BitMatrix.prototype.get = function (row, col) {
      return this.data[row * this.size + col]
    };

    /**
     * Applies xor operator at specified location
     * (used during masking process)
     *
     * @param {Number}  row
     * @param {Number}  col
     * @param {Boolean} value
     */
    BitMatrix.prototype.xor = function (row, col, value) {
      this.data[row * this.size + col] ^= value;
    };

    /**
     * Check if bit at specified location is reserved
     *
     * @param {Number}   row
     * @param {Number}   col
     * @return {Boolean}
     */
    BitMatrix.prototype.isReserved = function (row, col) {
      return this.reservedBit[row * this.size + col]
    };

    var bitMatrix = BitMatrix;

    /**
     * Alignment pattern are fixed reference pattern in defined positions
     * in a matrix symbology, which enables the decode software to re-synchronise
     * the coordinate mapping of the image modules in the event of moderate amounts
     * of distortion of the image.
     *
     * Alignment patterns are present only in QR Code symbols of version 2 or larger
     * and their number depends on the symbol version.
     */

    var alignmentPattern = createCommonjsModule(function (module, exports) {
    const getSymbolSize = utils$1.getSymbolSize;

    /**
     * Calculate the row/column coordinates of the center module of each alignment pattern
     * for the specified QR Code version.
     *
     * The alignment patterns are positioned symmetrically on either side of the diagonal
     * running from the top left corner of the symbol to the bottom right corner.
     *
     * Since positions are simmetrical only half of the coordinates are returned.
     * Each item of the array will represent in turn the x and y coordinate.
     * @see {@link getPositions}
     *
     * @param  {Number} version QR Code version
     * @return {Array}          Array of coordinate
     */
    exports.getRowColCoords = function getRowColCoords (version) {
      if (version === 1) return []

      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7]; // Last coord is always (size - 7)

      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }

      positions.push(6); // First coord is always 6

      return positions.reverse()
    };

    /**
     * Returns an array containing the positions of each alignment pattern.
     * Each array's element represent the center point of the pattern as (x, y) coordinates
     *
     * Coordinates are calculated expanding the row/column coordinates returned by {@link getRowColCoords}
     * and filtering out the items that overlaps with finder pattern
     *
     * @example
     * For a Version 7 symbol {@link getRowColCoords} returns values 6, 22 and 38.
     * The alignment patterns, therefore, are to be centered on (row, column)
     * positions (6,22), (22,6), (22,22), (22,38), (38,22), (38,38).
     * Note that the coordinates (6,6), (6,38), (38,6) are occupied by finder patterns
     * and are not therefore used for alignment patterns.
     *
     * let pos = getPositions(7)
     * // [[6,22], [22,6], [22,22], [22,38], [38,22], [38,38]]
     *
     * @param  {Number} version QR Code version
     * @return {Array}          Array of coordinates
     */
    exports.getPositions = function getPositions (version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;

      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          // Skip if position is occupied by finder patterns
          if ((i === 0 && j === 0) || // top-left
              (i === 0 && j === posLength - 1) || // bottom-left
              (i === posLength - 1 && j === 0)) { // top-right
            continue
          }

          coords.push([pos[i], pos[j]]);
        }
      }

      return coords
    };
    });

    const getSymbolSize = utils$1.getSymbolSize;
    const FINDER_PATTERN_SIZE = 7;

    /**
     * Returns an array containing the positions of each finder pattern.
     * Each array's element represent the top-left point of the pattern as (x, y) coordinates
     *
     * @param  {Number} version QR Code version
     * @return {Array}          Array of coordinates
     */
    var getPositions = function getPositions (version) {
      const size = getSymbolSize(version);

      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ]
    };

    var finderPattern = {
    	getPositions: getPositions
    };

    /**
     * Data mask pattern reference
     * @type {Object}
     */

    var maskPattern = createCommonjsModule(function (module, exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };

    /**
     * Weighted penalty scores for the undesirable features
     * @type {Object}
     */
    const PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };

    /**
     * Check if mask pattern value is valid
     *
     * @param  {Number}  mask    Mask pattern
     * @return {Boolean}         true if valid, false otherwise
     */
    exports.isValid = function isValid (mask) {
      return mask != null && mask !== '' && !isNaN(mask) && mask >= 0 && mask <= 7
    };

    /**
     * Returns mask pattern from a value.
     * If value is not valid, returns undefined
     *
     * @param  {Number|String} value        Mask pattern value
     * @return {Number}                     Valid mask pattern or undefined
     */
    exports.from = function from (value) {
      return exports.isValid(value) ? parseInt(value, 10) : undefined
    };

    /**
    * Find adjacent modules in row/column with the same color
    * and assign a penalty value.
    *
    * Points: N1 + i
    * i is the amount by which the number of adjacent modules of the same color exceeds 5
    */
    exports.getPenaltyN1 = function getPenaltyN1 (data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;

      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;

        for (let col = 0; col < size; col++) {
          let module = data.get(row, col);
          if (module === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module;
            sameCountCol = 1;
          }

          module = data.get(col, row);
          if (module === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module;
            sameCountRow = 1;
          }
        }

        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }

      return points
    };

    /**
     * Find 2x2 blocks with the same color and assign a penalty value
     *
     * Points: N2 * (m - 1) * (n - 1)
     */
    exports.getPenaltyN2 = function getPenaltyN2 (data) {
      const size = data.size;
      let points = 0;

      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) +
            data.get(row, col + 1) +
            data.get(row + 1, col) +
            data.get(row + 1, col + 1);

          if (last === 4 || last === 0) points++;
        }
      }

      return points * PenaltyScores.N2
    };

    /**
     * Find 1:1:3:1:1 ratio (dark:light:dark:light:dark) pattern in row/column,
     * preceded or followed by light area 4 modules wide
     *
     * Points: N3 * number of pattern found
     */
    exports.getPenaltyN3 = function getPenaltyN3 (data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;

      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = ((bitsCol << 1) & 0x7FF) | data.get(row, col);
          if (col >= 10 && (bitsCol === 0x5D0 || bitsCol === 0x05D)) points++;

          bitsRow = ((bitsRow << 1) & 0x7FF) | data.get(col, row);
          if (col >= 10 && (bitsRow === 0x5D0 || bitsRow === 0x05D)) points++;
        }
      }

      return points * PenaltyScores.N3
    };

    /**
     * Calculate proportion of dark modules in entire symbol
     *
     * Points: N4 * k
     *
     * k is the rating of the deviation of the proportion of dark modules
     * in the symbol from 50% in steps of 5%
     */
    exports.getPenaltyN4 = function getPenaltyN4 (data) {
      let darkCount = 0;
      const modulesCount = data.data.length;

      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];

      const k = Math.abs(Math.ceil((darkCount * 100 / modulesCount) / 5) - 10);

      return k * PenaltyScores.N4
    };

    /**
     * Return mask value at given position
     *
     * @param  {Number} maskPattern Pattern reference value
     * @param  {Number} i           Row
     * @param  {Number} j           Column
     * @return {Boolean}            Mask value
     */
    function getMaskAt (maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000: return (i + j) % 2 === 0
        case exports.Patterns.PATTERN001: return i % 2 === 0
        case exports.Patterns.PATTERN010: return j % 3 === 0
        case exports.Patterns.PATTERN011: return (i + j) % 3 === 0
        case exports.Patterns.PATTERN100: return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
        case exports.Patterns.PATTERN101: return (i * j) % 2 + (i * j) % 3 === 0
        case exports.Patterns.PATTERN110: return ((i * j) % 2 + (i * j) % 3) % 2 === 0
        case exports.Patterns.PATTERN111: return ((i * j) % 3 + (i + j) % 2) % 2 === 0

        default: throw new Error('bad maskPattern:' + maskPattern)
      }
    }

    /**
     * Apply a mask pattern to a BitMatrix
     *
     * @param  {Number}    pattern Pattern reference number
     * @param  {BitMatrix} data    BitMatrix data
     */
    exports.applyMask = function applyMask (pattern, data) {
      const size = data.size;

      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };

    /**
     * Returns the best mask pattern for data
     *
     * @param  {BitMatrix} data
     * @return {Number} Mask pattern reference number
     */
    exports.getBestMask = function getBestMask (data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;

      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);

        // Calculate penalty
        const penalty =
          exports.getPenaltyN1(data) +
          exports.getPenaltyN2(data) +
          exports.getPenaltyN3(data) +
          exports.getPenaltyN4(data);

        // Undo previously applied mask
        exports.applyMask(p, data);

        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }

      return bestPattern
    };
    });

    const EC_BLOCKS_TABLE = [
    // L  M  Q  H
      1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1, 2, 2,
      1, 2, 2, 4,
      1, 2, 4, 4,
      2, 4, 4, 4,
      2, 4, 6, 5,
      2, 4, 6, 6,
      2, 5, 8, 8,
      4, 5, 8, 8,
      4, 5, 8, 11,
      4, 8, 10, 11,
      4, 9, 12, 16,
      4, 9, 16, 16,
      6, 10, 12, 18,
      6, 10, 17, 16,
      6, 11, 16, 19,
      6, 13, 18, 21,
      7, 14, 21, 25,
      8, 16, 20, 25,
      8, 17, 23, 25,
      9, 17, 23, 34,
      9, 18, 25, 30,
      10, 20, 27, 32,
      12, 21, 29, 35,
      12, 23, 34, 37,
      12, 25, 34, 40,
      13, 26, 35, 42,
      14, 28, 38, 45,
      15, 29, 40, 48,
      16, 31, 43, 51,
      17, 33, 45, 54,
      18, 35, 48, 57,
      19, 37, 51, 60,
      19, 38, 53, 63,
      20, 40, 56, 66,
      21, 43, 59, 70,
      22, 45, 62, 74,
      24, 47, 65, 77,
      25, 49, 68, 81
    ];

    const EC_CODEWORDS_TABLE = [
    // L  M  Q  H
      7, 10, 13, 17,
      10, 16, 22, 28,
      15, 26, 36, 44,
      20, 36, 52, 64,
      26, 48, 72, 88,
      36, 64, 96, 112,
      40, 72, 108, 130,
      48, 88, 132, 156,
      60, 110, 160, 192,
      72, 130, 192, 224,
      80, 150, 224, 264,
      96, 176, 260, 308,
      104, 198, 288, 352,
      120, 216, 320, 384,
      132, 240, 360, 432,
      144, 280, 408, 480,
      168, 308, 448, 532,
      180, 338, 504, 588,
      196, 364, 546, 650,
      224, 416, 600, 700,
      224, 442, 644, 750,
      252, 476, 690, 816,
      270, 504, 750, 900,
      300, 560, 810, 960,
      312, 588, 870, 1050,
      336, 644, 952, 1110,
      360, 700, 1020, 1200,
      390, 728, 1050, 1260,
      420, 784, 1140, 1350,
      450, 812, 1200, 1440,
      480, 868, 1290, 1530,
      510, 924, 1350, 1620,
      540, 980, 1440, 1710,
      570, 1036, 1530, 1800,
      570, 1064, 1590, 1890,
      600, 1120, 1680, 1980,
      630, 1204, 1770, 2100,
      660, 1260, 1860, 2220,
      720, 1316, 1950, 2310,
      750, 1372, 2040, 2430
    ];

    /**
     * Returns the number of error correction block that the QR Code should contain
     * for the specified version and error correction level.
     *
     * @param  {Number} version              QR Code version
     * @param  {Number} errorCorrectionLevel Error correction level
     * @return {Number}                      Number of error correction blocks
     */
    var getBlocksCount = function getBlocksCount (version, errorCorrectionLevel$1) {
      switch (errorCorrectionLevel$1) {
        case errorCorrectionLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0]
        case errorCorrectionLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1]
        case errorCorrectionLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2]
        case errorCorrectionLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3]
        default:
          return undefined
      }
    };

    /**
     * Returns the number of error correction codewords to use for the specified
     * version and error correction level.
     *
     * @param  {Number} version              QR Code version
     * @param  {Number} errorCorrectionLevel Error correction level
     * @return {Number}                      Number of error correction codewords
     */
    var getTotalCodewordsCount = function getTotalCodewordsCount (version, errorCorrectionLevel$1) {
      switch (errorCorrectionLevel$1) {
        case errorCorrectionLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0]
        case errorCorrectionLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1]
        case errorCorrectionLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2]
        case errorCorrectionLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3]
        default:
          return undefined
      }
    };

    var errorCorrectionCode = {
    	getBlocksCount: getBlocksCount,
    	getTotalCodewordsCount: getTotalCodewordsCount
    };

    const EXP_TABLE = new Uint8Array(512);
    const LOG_TABLE = new Uint8Array(256)
    /**
     * Precompute the log and anti-log tables for faster computation later
     *
     * For each possible value in the galois field 2^8, we will pre-compute
     * the logarithm and anti-logarithm (exponential) of this value
     *
     * ref {@link https://en.wikiversity.org/wiki/Reed%E2%80%93Solomon_codes_for_coders#Introduction_to_mathematical_fields}
     */
    ;(function initTables () {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;

        x <<= 1; // multiply by 2

        // The QR code specification says to use byte-wise modulo 100011101 arithmetic.
        // This means that when a number is 256 or larger, it should be XORed with 0x11D.
        if (x & 0x100) { // similar to x >= 256, but a lot faster (because 0x100 == 256)
          x ^= 0x11D;
        }
      }

      // Optimization: double the size of the anti-log table so that we don't need to mod 255 to
      // stay inside the bounds (because we will mainly use this table for the multiplication of
      // two GF numbers, no more).
      // @see {@link mul}
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    }());

    /**
     * Returns log value of n inside Galois Field
     *
     * @param  {Number} n
     * @return {Number}
     */
    var log = function log (n) {
      if (n < 1) throw new Error('log(' + n + ')')
      return LOG_TABLE[n]
    };

    /**
     * Returns anti-log value of n inside Galois Field
     *
     * @param  {Number} n
     * @return {Number}
     */
    var exp = function exp (n) {
      return EXP_TABLE[n]
    };

    /**
     * Multiplies two number inside Galois Field
     *
     * @param  {Number} x
     * @param  {Number} y
     * @return {Number}
     */
    var mul = function mul (x, y) {
      if (x === 0 || y === 0) return 0

      // should be EXP_TABLE[(LOG_TABLE[x] + LOG_TABLE[y]) % 255] if EXP_TABLE wasn't oversized
      // @see {@link initTables}
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]]
    };

    var galoisField = {
    	log: log,
    	exp: exp,
    	mul: mul
    };

    var polynomial = createCommonjsModule(function (module, exports) {
    /**
     * Multiplies two polynomials inside Galois Field
     *
     * @param  {Uint8Array} p1 Polynomial
     * @param  {Uint8Array} p2 Polynomial
     * @return {Uint8Array}    Product of p1 and p2
     */
    exports.mul = function mul (p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);

      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= galoisField.mul(p1[i], p2[j]);
        }
      }

      return coeff
    };

    /**
     * Calculate the remainder of polynomials division
     *
     * @param  {Uint8Array} divident Polynomial
     * @param  {Uint8Array} divisor  Polynomial
     * @return {Uint8Array}          Remainder
     */
    exports.mod = function mod (divident, divisor) {
      let result = new Uint8Array(divident);

      while ((result.length - divisor.length) >= 0) {
        const coeff = result[0];

        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= galoisField.mul(divisor[i], coeff);
        }

        // remove all zeros from buffer head
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }

      return result
    };

    /**
     * Generate an irreducible generator polynomial of specified degree
     * (used by Reed-Solomon encoder)
     *
     * @param  {Number} degree Degree of the generator polynomial
     * @return {Uint8Array}    Buffer containing polynomial coefficients
     */
    exports.generateECPolynomial = function generateECPolynomial (degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, galoisField.exp(i)]));
      }

      return poly
    };
    });

    function ReedSolomonEncoder (degree) {
      this.genPoly = undefined;
      this.degree = degree;

      if (this.degree) this.initialize(this.degree);
    }

    /**
     * Initialize the encoder.
     * The input param should correspond to the number of error correction codewords.
     *
     * @param  {Number} degree
     */
    ReedSolomonEncoder.prototype.initialize = function initialize (degree) {
      // create an irreducible generator polynomial
      this.degree = degree;
      this.genPoly = polynomial.generateECPolynomial(this.degree);
    };

    /**
     * Encodes a chunk of data
     *
     * @param  {Uint8Array} data Buffer containing input data
     * @return {Uint8Array}      Buffer containing encoded data
     */
    ReedSolomonEncoder.prototype.encode = function encode (data) {
      if (!this.genPoly) {
        throw new Error('Encoder not initialized')
      }

      // Calculate EC for this data block
      // extends data size to data+genPoly size
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);

      // The error correction codewords are the remainder after dividing the data codewords
      // by a generator polynomial
      const remainder = polynomial.mod(paddedData, this.genPoly);

      // return EC data blocks (last n byte, where n is the degree of genPoly)
      // If coefficients number in remainder are less than genPoly degree,
      // pad with 0s to the left to reach the needed number of coefficients
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);

        return buff
      }

      return remainder
    };

    var reedSolomonEncoder = ReedSolomonEncoder;

    /**
     * Check if QR Code version is valid
     *
     * @param  {Number}  version QR Code version
     * @return {Boolean}         true if valid version, false otherwise
     */
    var isValid = function isValid (version) {
      return !isNaN(version) && version >= 1 && version <= 40
    };

    var versionCheck = {
    	isValid: isValid
    };

    const numeric = '[0-9]+';
    const alphanumeric = '[A-Z $%*+\\-./:]+';
    let kanji = '(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|' +
      '[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|' +
      '[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|' +
      '[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+';
    kanji = kanji.replace(/u/g, '\\u');

    const byte = '(?:(?![A-Z0-9 $%*+\\-./:]|' + kanji + ')(?:.|[\r\n]))+';

    var KANJI = new RegExp(kanji, 'g');
    var BYTE_KANJI = new RegExp('[^A-Z0-9 $%*+\\-./:]+', 'g');
    var BYTE = new RegExp(byte, 'g');
    var NUMERIC = new RegExp(numeric, 'g');
    var ALPHANUMERIC = new RegExp(alphanumeric, 'g');

    const TEST_KANJI = new RegExp('^' + kanji + '$');
    const TEST_NUMERIC = new RegExp('^' + numeric + '$');
    const TEST_ALPHANUMERIC = new RegExp('^[A-Z0-9 $%*+\\-./:]+$');

    var testKanji = function testKanji (str) {
      return TEST_KANJI.test(str)
    };

    var testNumeric = function testNumeric (str) {
      return TEST_NUMERIC.test(str)
    };

    var testAlphanumeric = function testAlphanumeric (str) {
      return TEST_ALPHANUMERIC.test(str)
    };

    var regex = {
    	KANJI: KANJI,
    	BYTE_KANJI: BYTE_KANJI,
    	BYTE: BYTE,
    	NUMERIC: NUMERIC,
    	ALPHANUMERIC: ALPHANUMERIC,
    	testKanji: testKanji,
    	testNumeric: testNumeric,
    	testAlphanumeric: testAlphanumeric
    };

    var mode = createCommonjsModule(function (module, exports) {
    /**
     * Numeric mode encodes data from the decimal digit set (0 - 9)
     * (byte values 30HEX to 39HEX).
     * Normally, 3 data characters are represented by 10 bits.
     *
     * @type {Object}
     */
    exports.NUMERIC = {
      id: 'Numeric',
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };

    /**
     * Alphanumeric mode encodes data from a set of 45 characters,
     * i.e. 10 numeric digits (0 - 9),
     *      26 alphabetic characters (A - Z),
     *   and 9 symbols (SP, $, %, *, +, -, ., /, :).
     * Normally, two input characters are represented by 11 bits.
     *
     * @type {Object}
     */
    exports.ALPHANUMERIC = {
      id: 'Alphanumeric',
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };

    /**
     * In byte mode, data is encoded at 8 bits per character.
     *
     * @type {Object}
     */
    exports.BYTE = {
      id: 'Byte',
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };

    /**
     * The Kanji mode efficiently encodes Kanji characters in accordance with
     * the Shift JIS system based on JIS X 0208.
     * The Shift JIS values are shifted from the JIS X 0208 values.
     * JIS X 0208 gives details of the shift coded representation.
     * Each two-byte character value is compacted to a 13-bit binary codeword.
     *
     * @type {Object}
     */
    exports.KANJI = {
      id: 'Kanji',
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };

    /**
     * Mixed mode will contain a sequences of data in a combination of any of
     * the modes described above
     *
     * @type {Object}
     */
    exports.MIXED = {
      bit: -1
    };

    /**
     * Returns the number of bits needed to store the data length
     * according to QR Code specifications.
     *
     * @param  {Mode}   mode    Data mode
     * @param  {Number} version QR Code version
     * @return {Number}         Number of bits
     */
    exports.getCharCountIndicator = function getCharCountIndicator (mode, version) {
      if (!mode.ccBits) throw new Error('Invalid mode: ' + mode)

      if (!versionCheck.isValid(version)) {
        throw new Error('Invalid version: ' + version)
      }

      if (version >= 1 && version < 10) return mode.ccBits[0]
      else if (version < 27) return mode.ccBits[1]
      return mode.ccBits[2]
    };

    /**
     * Returns the most efficient mode to store the specified data
     *
     * @param  {String} dataStr Input data string
     * @return {Mode}           Best mode
     */
    exports.getBestModeForData = function getBestModeForData (dataStr) {
      if (regex.testNumeric(dataStr)) return exports.NUMERIC
      else if (regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC
      else if (regex.testKanji(dataStr)) return exports.KANJI
      else return exports.BYTE
    };

    /**
     * Return mode name as string
     *
     * @param {Mode} mode Mode object
     * @returns {String}  Mode name
     */
    exports.toString = function toString (mode) {
      if (mode && mode.id) return mode.id
      throw new Error('Invalid mode')
    };

    /**
     * Check if input param is a valid mode object
     *
     * @param   {Mode}    mode Mode object
     * @returns {Boolean} True if valid mode, false otherwise
     */
    exports.isValid = function isValid (mode) {
      return mode && mode.bit && mode.ccBits
    };

    /**
     * Get mode object from its name
     *
     * @param   {String} string Mode name
     * @returns {Mode}          Mode object
     */
    function fromString (string) {
      if (typeof string !== 'string') {
        throw new Error('Param is not a string')
      }

      const lcStr = string.toLowerCase();

      switch (lcStr) {
        case 'numeric':
          return exports.NUMERIC
        case 'alphanumeric':
          return exports.ALPHANUMERIC
        case 'kanji':
          return exports.KANJI
        case 'byte':
          return exports.BYTE
        default:
          throw new Error('Unknown mode: ' + string)
      }
    }

    /**
     * Returns mode from a value.
     * If value is not a valid mode, returns defaultValue
     *
     * @param  {Mode|String} value        Encoding mode
     * @param  {Mode}        defaultValue Fallback value
     * @return {Mode}                     Encoding mode
     */
    exports.from = function from (value, defaultValue) {
      if (exports.isValid(value)) {
        return value
      }

      try {
        return fromString(value)
      } catch (e) {
        return defaultValue
      }
    };
    });

    var version = createCommonjsModule(function (module, exports) {
    // Generator polynomial used to encode version information
    const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    const G18_BCH = utils$1.getBCHDigit(G18);

    function getBestVersionForDataLength (mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion
        }
      }

      return undefined
    }

    function getReservedBitsCount (mode$1, version) {
      // Character count indicator + mode indicator bits
      return mode.getCharCountIndicator(mode$1, version) + 4
    }

    function getTotalBitsFromDataArray (segments, version) {
      let totalBits = 0;

      segments.forEach(function (data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });

      return totalBits
    }

    function getBestVersionForMixedData (segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode.MIXED)) {
          return currentVersion
        }
      }

      return undefined
    }

    /**
     * Returns version number from a value.
     * If value is not a valid version, returns defaultValue
     *
     * @param  {Number|String} value        QR Code version
     * @param  {Number}        defaultValue Fallback value
     * @return {Number}                     QR Code version number
     */
    exports.from = function from (value, defaultValue) {
      if (versionCheck.isValid(value)) {
        return parseInt(value, 10)
      }

      return defaultValue
    };

    /**
     * Returns how much data can be stored with the specified QR code version
     * and error correction level
     *
     * @param  {Number} version              QR Code version (1-40)
     * @param  {Number} errorCorrectionLevel Error correction level
     * @param  {Mode}   mode                 Data mode
     * @return {Number}                      Quantity of storable data
     */
    exports.getCapacity = function getCapacity (version, errorCorrectionLevel, mode$1) {
      if (!versionCheck.isValid(version)) {
        throw new Error('Invalid QR Code version')
      }

      // Use Byte mode as default
      if (typeof mode$1 === 'undefined') mode$1 = mode.BYTE;

      // Total codewords for this QR code version (Data + Error correction)
      const totalCodewords = utils$1.getSymbolTotalCodewords(version);

      // Total number of error correction codewords
      const ecTotalCodewords = errorCorrectionCode.getTotalCodewordsCount(version, errorCorrectionLevel);

      // Total number of data codewords
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

      if (mode$1 === mode.MIXED) return dataTotalCodewordsBits

      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode$1, version);

      // Return max number of storable codewords
      switch (mode$1) {
        case mode.NUMERIC:
          return Math.floor((usableBits / 10) * 3)

        case mode.ALPHANUMERIC:
          return Math.floor((usableBits / 11) * 2)

        case mode.KANJI:
          return Math.floor(usableBits / 13)

        case mode.BYTE:
        default:
          return Math.floor(usableBits / 8)
      }
    };

    /**
     * Returns the minimum version needed to contain the amount of data
     *
     * @param  {Segment} data                    Segment of data
     * @param  {Number} [errorCorrectionLevel=H] Error correction level
     * @param  {Mode} mode                       Data mode
     * @return {Number}                          QR Code version
     */
    exports.getBestVersionForData = function getBestVersionForData (data, errorCorrectionLevel$1) {
      let seg;

      const ecl = errorCorrectionLevel.from(errorCorrectionLevel$1, errorCorrectionLevel.M);

      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl)
        }

        if (data.length === 0) {
          return 1
        }

        seg = data[0];
      } else {
        seg = data;
      }

      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl)
    };

    /**
     * Returns version information with relative error correction bits
     *
     * The version information is included in QR Code symbols of version 7 or larger.
     * It consists of an 18-bit sequence containing 6 data bits,
     * with 12 error correction bits calculated using the (18, 6) Golay code.
     *
     * @param  {Number} version QR Code version
     * @return {Number}         Encoded version info bits
     */
    exports.getEncodedBits = function getEncodedBits (version) {
      if (!versionCheck.isValid(version) || version < 7) {
        throw new Error('Invalid QR Code version')
      }

      let d = version << 12;

      while (utils$1.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= (G18 << (utils$1.getBCHDigit(d) - G18_BCH));
      }

      return (version << 12) | d
    };
    });

    const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
    const G15_BCH = utils$1.getBCHDigit(G15);

    /**
     * Returns format information with relative error correction bits
     *
     * The format information is a 15-bit sequence containing 5 data bits,
     * with 10 error correction bits calculated using the (15, 5) BCH code.
     *
     * @param  {Number} errorCorrectionLevel Error correction level
     * @param  {Number} mask                 Mask pattern
     * @return {Number}                      Encoded format information bits
     */
    var getEncodedBits = function getEncodedBits (errorCorrectionLevel, mask) {
      const data = ((errorCorrectionLevel.bit << 3) | mask);
      let d = data << 10;

      while (utils$1.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= (G15 << (utils$1.getBCHDigit(d) - G15_BCH));
      }

      // xor final data with mask pattern in order to ensure that
      // no combination of Error Correction Level and data mask pattern
      // will result in an all-zero data string
      return ((data << 10) | d) ^ G15_MASK
    };

    var formatInfo = {
    	getEncodedBits: getEncodedBits
    };

    function NumericData (data) {
      this.mode = mode.NUMERIC;
      this.data = data.toString();
    }

    NumericData.getBitsLength = function getBitsLength (length) {
      return 10 * Math.floor(length / 3) + ((length % 3) ? ((length % 3) * 3 + 1) : 0)
    };

    NumericData.prototype.getLength = function getLength () {
      return this.data.length
    };

    NumericData.prototype.getBitsLength = function getBitsLength () {
      return NumericData.getBitsLength(this.data.length)
    };

    NumericData.prototype.write = function write (bitBuffer) {
      let i, group, value;

      // The input data string is divided into groups of three digits,
      // and each group is converted to its 10-bit binary equivalent.
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);

        bitBuffer.put(value, 10);
      }

      // If the number of input digits is not an exact multiple of three,
      // the final one or two digits are converted to 4 or 7 bits respectively.
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);

        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };

    var numericData = NumericData;

    /**
     * Array of characters available in alphanumeric mode
     *
     * As per QR Code specification, to each character
     * is assigned a value from 0 to 44 which in this case coincides
     * with the array index
     *
     * @type {Array}
     */
    const ALPHA_NUM_CHARS = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      ' ', '$', '%', '*', '+', '-', '.', '/', ':'
    ];

    function AlphanumericData (data) {
      this.mode = mode.ALPHANUMERIC;
      this.data = data;
    }

    AlphanumericData.getBitsLength = function getBitsLength (length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2)
    };

    AlphanumericData.prototype.getLength = function getLength () {
      return this.data.length
    };

    AlphanumericData.prototype.getBitsLength = function getBitsLength () {
      return AlphanumericData.getBitsLength(this.data.length)
    };

    AlphanumericData.prototype.write = function write (bitBuffer) {
      let i;

      // Input data characters are divided into groups of two characters
      // and encoded as 11-bit binary codes.
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        // The character value of the first character is multiplied by 45
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;

        // The character value of the second digit is added to the product
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);

        // The sum is then stored as 11-bit binary number
        bitBuffer.put(value, 11);
      }

      // If the number of input data characters is not a multiple of two,
      // the character value of the final character is encoded as a 6-bit binary number.
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };

    var alphanumericData = AlphanumericData;

    var encodeUtf8 = function encodeUtf8 (input) {
      var result = [];
      var size = input.length;

      for (var index = 0; index < size; index++) {
        var point = input.charCodeAt(index);

        if (point >= 0xD800 && point <= 0xDBFF && size > index + 1) {
          var second = input.charCodeAt(index + 1);

          if (second >= 0xDC00 && second <= 0xDFFF) {
            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            point = (point - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
            index += 1;
          }
        }

        // US-ASCII
        if (point < 0x80) {
          result.push(point);
          continue
        }

        // 2-byte UTF-8
        if (point < 0x800) {
          result.push((point >> 6) | 192);
          result.push((point & 63) | 128);
          continue
        }

        // 3-byte UTF-8
        if (point < 0xD800 || (point >= 0xE000 && point < 0x10000)) {
          result.push((point >> 12) | 224);
          result.push(((point >> 6) & 63) | 128);
          result.push((point & 63) | 128);
          continue
        }

        // 4-byte UTF-8
        if (point >= 0x10000 && point <= 0x10FFFF) {
          result.push((point >> 18) | 240);
          result.push(((point >> 12) & 63) | 128);
          result.push(((point >> 6) & 63) | 128);
          result.push((point & 63) | 128);
          continue
        }

        // Invalid character
        result.push(0xEF, 0xBF, 0xBD);
      }

      return new Uint8Array(result).buffer
    };

    function ByteData (data) {
      this.mode = mode.BYTE;
      this.data = new Uint8Array(encodeUtf8(data));
    }

    ByteData.getBitsLength = function getBitsLength (length) {
      return length * 8
    };

    ByteData.prototype.getLength = function getLength () {
      return this.data.length
    };

    ByteData.prototype.getBitsLength = function getBitsLength () {
      return ByteData.getBitsLength(this.data.length)
    };

    ByteData.prototype.write = function (bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };

    var byteData = ByteData;

    function KanjiData (data) {
      this.mode = mode.KANJI;
      this.data = data;
    }

    KanjiData.getBitsLength = function getBitsLength (length) {
      return length * 13
    };

    KanjiData.prototype.getLength = function getLength () {
      return this.data.length
    };

    KanjiData.prototype.getBitsLength = function getBitsLength () {
      return KanjiData.getBitsLength(this.data.length)
    };

    KanjiData.prototype.write = function (bitBuffer) {
      let i;

      // In the Shift JIS system, Kanji characters are represented by a two byte combination.
      // These byte values are shifted from the JIS X 0208 values.
      // JIS X 0208 gives details of the shift coded representation.
      for (i = 0; i < this.data.length; i++) {
        let value = utils$1.toSJIS(this.data[i]);

        // For characters with Shift JIS values from 0x8140 to 0x9FFC:
        if (value >= 0x8140 && value <= 0x9FFC) {
          // Subtract 0x8140 from Shift JIS value
          value -= 0x8140;

        // For characters with Shift JIS values from 0xE040 to 0xEBBF
        } else if (value >= 0xE040 && value <= 0xEBBF) {
          // Subtract 0xC140 from Shift JIS value
          value -= 0xC140;
        } else {
          throw new Error(
            'Invalid SJIS character: ' + this.data[i] + '\n' +
            'Make sure your charset is UTF-8')
        }

        // Multiply most significant byte of result by 0xC0
        // and add least significant byte to product
        value = (((value >>> 8) & 0xff) * 0xC0) + (value & 0xff);

        // Convert result to a 13-bit binary string
        bitBuffer.put(value, 13);
      }
    };

    var kanjiData = KanjiData;

    var dijkstra_1 = createCommonjsModule(function (module) {

    /******************************************************************************
     * Created 2008-08-19.
     *
     * Dijkstra path-finding functions. Adapted from the Dijkstar Python project.
     *
     * Copyright (C) 2008
     *   Wyatt Baldwin <self@wyattbaldwin.com>
     *   All rights reserved
     *
     * Licensed under the MIT license.
     *
     *   http://www.opensource.org/licenses/mit-license.php
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     *****************************************************************************/
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        // Predecessor map for each node that has been encountered.
        // node ID => predecessor node ID
        var predecessors = {};

        // Costs of shortest paths from s to all nodes encountered.
        // node ID => cost
        var costs = {};
        costs[s] = 0;

        // Costs of shortest paths from s to all nodes encountered; differs from
        // `costs` in that it provides easy access to the node that currently has
        // the known shortest path from s.
        // XXX: Do we actually need both `costs` and `open`?
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);

        var closest,
            u, v,
            cost_of_s_to_u,
            adjacent_nodes,
            cost_of_e,
            cost_of_s_to_u_plus_cost_of_e,
            cost_of_s_to_v,
            first_visit;
        while (!open.empty()) {
          // In the nodes remaining in graph that have a known cost from s,
          // find the node, u, that currently has the shortest path from s.
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;

          // Get nodes adjacent to u...
          adjacent_nodes = graph[u] || {};

          // ...and explore the edges that connect u to those nodes, updating
          // the cost of the shortest paths to any or all of those nodes as
          // necessary. v is the node across the current edge from u.
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              // Get the cost of the edge running from u to v.
              cost_of_e = adjacent_nodes[v];

              // Cost of s to u plus the cost of u to v across e--this is *a*
              // cost from s to v that may or may not be less than the current
              // known cost to v.
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;

              // If we haven't visited v yet OR if the current known cost from s to
              // v is greater than the new cost we just found (cost of s to u plus
              // cost of u to v across e), update v's cost in the cost list and
              // update v's predecessor in the predecessor list (it's now u).
              cost_of_s_to_v = costs[v];
              first_visit = (typeof costs[v] === 'undefined');
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }

        if (typeof d !== 'undefined' && typeof costs[d] === 'undefined') {
          var msg = ['Could not find a path from ', s, ' to ', d, '.'].join('');
          throw new Error(msg);
        }

        return predecessors;
      },

      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        while (u) {
          nodes.push(u);
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },

      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors, d);
      },

      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function (opts) {
          var T = dijkstra.PriorityQueue,
              t = {},
              key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },

        default_sorter: function (a, b) {
          return a.cost - b.cost;
        },

        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function (value, cost) {
          var item = {value: value, cost: cost};
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },

        /**
         * Return the highest priority element in the queue.
         */
        pop: function () {
          return this.queue.shift();
        },

        empty: function () {
          return this.queue.length === 0;
        }
      }
    };


    // node.js module exports
    {
      module.exports = dijkstra;
    }
    });

    var segments = createCommonjsModule(function (module, exports) {
    /**
     * Returns UTF8 byte length
     *
     * @param  {String} str Input string
     * @return {Number}     Number of byte
     */
    function getStringByteLength (str) {
      return unescape(encodeURIComponent(str)).length
    }

    /**
     * Get a list of segments of the specified mode
     * from a string
     *
     * @param  {Mode}   mode Segment mode
     * @param  {String} str  String to process
     * @return {Array}       Array of object with segments data
     */
    function getSegments (regex, mode, str) {
      const segments = [];
      let result;

      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode: mode,
          length: result[0].length
        });
      }

      return segments
    }

    /**
     * Extracts a series of segments with the appropriate
     * modes from a string
     *
     * @param  {String} dataStr Input string
     * @return {Array}          Array of object with segments data
     */
    function getSegmentsFromString (dataStr) {
      const numSegs = getSegments(regex.NUMERIC, mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(regex.ALPHANUMERIC, mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;

      if (utils$1.isKanjiModeEnabled()) {
        byteSegs = getSegments(regex.BYTE, mode.BYTE, dataStr);
        kanjiSegs = getSegments(regex.KANJI, mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(regex.BYTE_KANJI, mode.BYTE, dataStr);
        kanjiSegs = [];
      }

      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);

      return segs
        .sort(function (s1, s2) {
          return s1.index - s2.index
        })
        .map(function (obj) {
          return {
            data: obj.data,
            mode: obj.mode,
            length: obj.length
          }
        })
    }

    /**
     * Returns how many bits are needed to encode a string of
     * specified length with the specified mode
     *
     * @param  {Number} length String length
     * @param  {Mode} mode     Segment mode
     * @return {Number}        Bit length
     */
    function getSegmentBitsLength (length, mode$1) {
      switch (mode$1) {
        case mode.NUMERIC:
          return numericData.getBitsLength(length)
        case mode.ALPHANUMERIC:
          return alphanumericData.getBitsLength(length)
        case mode.KANJI:
          return kanjiData.getBitsLength(length)
        case mode.BYTE:
          return byteData.getBitsLength(length)
      }
    }

    /**
     * Merges adjacent segments which have the same mode
     *
     * @param  {Array} segs Array of object with segments data
     * @return {Array}      Array of object with segments data
     */
    function mergeSegments (segs) {
      return segs.reduce(function (acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc
        }

        acc.push(curr);
        return acc
      }, [])
    }

    /**
     * Generates a list of all possible nodes combination which
     * will be used to build a segments graph.
     *
     * Nodes are divided by groups. Each group will contain a list of all the modes
     * in which is possible to encode the given text.
     *
     * For example the text '12345' can be encoded as Numeric, Alphanumeric or Byte.
     * The group for '12345' will contain then 3 objects, one for each
     * possible encoding mode.
     *
     * Each node represents a possible segment.
     *
     * @param  {Array} segs Array of object with segments data
     * @return {Array}      Array of object with segments data
     */
    function buildNodes (segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];

        switch (seg.mode) {
          case mode.NUMERIC:
            nodes.push([seg,
              { data: seg.data, mode: mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: mode.BYTE, length: seg.length }
            ]);
            break
          case mode.ALPHANUMERIC:
            nodes.push([seg,
              { data: seg.data, mode: mode.BYTE, length: seg.length }
            ]);
            break
          case mode.KANJI:
            nodes.push([seg,
              { data: seg.data, mode: mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break
          case mode.BYTE:
            nodes.push([
              { data: seg.data, mode: mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }

      return nodes
    }

    /**
     * Builds a graph from a list of nodes.
     * All segments in each node group will be connected with all the segments of
     * the next group and so on.
     *
     * At each connection will be assigned a weight depending on the
     * segment's byte length.
     *
     * @param  {Array} nodes    Array of object with segments data
     * @param  {Number} version QR Code version
     * @return {Object}         Graph of all possible segments
     */
    function buildGraph (nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ['start'];

      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];

        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = '' + i + j;

          currentNodeIds.push(key);
          table[key] = { node: node, lastCount: 0 };
          graph[key] = {};

          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];

            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] =
                getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) -
                getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);

              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;

              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) +
                4 + mode.getCharCountIndicator(node.mode, version); // switch cost
            }
          }
        }

        prevNodeIds = currentNodeIds;
      }

      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }

      return { map: graph, table: table }
    }

    /**
     * Builds a segment from a specified data and mode.
     * If a mode is not specified, the more suitable will be used.
     *
     * @param  {String} data             Input data
     * @param  {Mode | String} modesHint Data mode
     * @return {Segment}                 Segment
     */
    function buildSingleSegment (data, modesHint) {
      let mode$1;
      const bestMode = mode.getBestModeForData(data);

      mode$1 = mode.from(modesHint, bestMode);

      // Make sure data can be encoded
      if (mode$1 !== mode.BYTE && mode$1.bit < bestMode.bit) {
        throw new Error('"' + data + '"' +
          ' cannot be encoded with mode ' + mode.toString(mode$1) +
          '.\n Suggested mode is: ' + mode.toString(bestMode))
      }

      // Use Mode.BYTE if Kanji support is disabled
      if (mode$1 === mode.KANJI && !utils$1.isKanjiModeEnabled()) {
        mode$1 = mode.BYTE;
      }

      switch (mode$1) {
        case mode.NUMERIC:
          return new numericData(data)

        case mode.ALPHANUMERIC:
          return new alphanumericData(data)

        case mode.KANJI:
          return new kanjiData(data)

        case mode.BYTE:
          return new byteData(data)
      }
    }

    /**
     * Builds a list of segments from an array.
     * Array can contain Strings or Objects with segment's info.
     *
     * For each item which is a string, will be generated a segment with the given
     * string and the more appropriate encoding mode.
     *
     * For each item which is an object, will be generated a segment with the given
     * data and mode.
     * Objects must contain at least the property "data".
     * If property "mode" is not present, the more suitable mode will be used.
     *
     * @param  {Array} array Array of objects with segments data
     * @return {Array}       Array of Segments
     */
    exports.fromArray = function fromArray (array) {
      return array.reduce(function (acc, seg) {
        if (typeof seg === 'string') {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }

        return acc
      }, [])
    };

    /**
     * Builds an optimized sequence of segments from a string,
     * which will produce the shortest possible bitstream.
     *
     * @param  {String} data    Input string
     * @param  {Number} version QR Code version
     * @return {Array}          Array of segments
     */
    exports.fromString = function fromString (data, version) {
      const segs = getSegmentsFromString(data);

      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra_1.find_path(graph.map, 'start', 'end');

      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }

      return exports.fromArray(mergeSegments(optimizedSegs))
    };

    /**
     * Splits a string in various segments with the modes which
     * best represent their content.
     * The produced segments are far from being optimized.
     * The output of this function is only used to estimate a QR Code version
     * which may contain the data.
     *
     * @param  {string} data Input string
     * @return {Array}       Array of segments
     */
    exports.rawSplit = function rawSplit (data) {
      return exports.fromArray(
        getSegmentsFromString(data)
      )
    };
    });

    /**
     * QRCode for JavaScript
     *
     * modified by Ryan Day for nodejs support
     * Copyright (c) 2011 Ryan Day
     *
     * Licensed under the MIT license:
     *   http://www.opensource.org/licenses/mit-license.php
     *
    //---------------------------------------------------------------------
    // QRCode for JavaScript
    //
    // Copyright (c) 2009 Kazuhiko Arase
    //
    // URL: http://www.d-project.com/
    //
    // Licensed under the MIT license:
    //   http://www.opensource.org/licenses/mit-license.php
    //
    // The word "QR Code" is registered trademark of
    // DENSO WAVE INCORPORATED
    //   http://www.denso-wave.com/qrcode/faqpatent-e.html
    //
    //---------------------------------------------------------------------
    */

    /**
     * Add finder patterns bits to matrix
     *
     * @param  {BitMatrix} matrix  Modules matrix
     * @param  {Number}    version QR Code version
     */
    function setupFinderPattern (matrix, version) {
      const size = matrix.size;
      const pos = finderPattern.getPositions(version);

      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];

        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue

          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue

            if ((r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
              (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
              (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }

    /**
     * Add timing pattern bits to matrix
     *
     * Note: this function must be called before {@link setupAlignmentPattern}
     *
     * @param  {BitMatrix} matrix Modules matrix
     */
    function setupTimingPattern (matrix) {
      const size = matrix.size;

      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }

    /**
     * Add alignment patterns bits to matrix
     *
     * Note: this function must be called after {@link setupTimingPattern}
     *
     * @param  {BitMatrix} matrix  Modules matrix
     * @param  {Number}    version QR Code version
     */
    function setupAlignmentPattern (matrix, version) {
      const pos = alignmentPattern.getPositions(version);

      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];

        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 ||
              (r === 0 && c === 0)) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }

    /**
     * Add version info bits to matrix
     *
     * @param  {BitMatrix} matrix  Modules matrix
     * @param  {Number}    version QR Code version
     */
    function setupVersionInfo (matrix, version$1) {
      const size = matrix.size;
      const bits = version.getEncodedBits(version$1);
      let row, col, mod;

      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = ((bits >> i) & 1) === 1;

        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }

    /**
     * Add format info bits to matrix
     *
     * @param  {BitMatrix} matrix               Modules matrix
     * @param  {ErrorCorrectionLevel}    errorCorrectionLevel Error correction level
     * @param  {Number}    maskPattern          Mask pattern reference value
     */
    function setupFormatInfo (matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = formatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;

      for (i = 0; i < 15; i++) {
        mod = ((bits >> i) & 1) === 1;

        // vertical
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }

        // horizontal
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }

      // fixed module
      matrix.set(size - 8, 8, 1, true);
    }

    /**
     * Add encoded data bits to matrix
     *
     * @param  {BitMatrix}  matrix Modules matrix
     * @param  {Uint8Array} data   Data codewords
     */
    function setupData (matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;

      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;

        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;

              if (byteIndex < data.length) {
                dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
              }

              matrix.set(row, col - c, dark);
              bitIndex--;

              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break
          }
        }
      }
    }

    /**
     * Create encoded codewords from data input
     *
     * @param  {Number}   version              QR Code version
     * @param  {ErrorCorrectionLevel}   errorCorrectionLevel Error correction level
     * @param  {ByteData} data                 Data input
     * @return {Uint8Array}                    Buffer containing encoded codewords
     */
    function createData (version, errorCorrectionLevel, segments) {
      // Prepare data buffer
      const buffer = new bitBuffer();

      segments.forEach(function (data) {
        // prefix data with mode indicator (4 bits)
        buffer.put(data.mode.bit, 4);

        // Prefix data with character count indicator.
        // The character count indicator is a string of bits that represents the
        // number of characters that are being encoded.
        // The character count indicator must be placed after the mode indicator
        // and must be a certain number of bits long, depending on the QR version
        // and data mode
        // @see {@link Mode.getCharCountIndicator}.
        buffer.put(data.getLength(), mode.getCharCountIndicator(data.mode, version));

        // add binary data sequence to buffer
        data.write(buffer);
      });

      // Calculate required number of bits
      const totalCodewords = utils$1.getSymbolTotalCodewords(version);
      const ecTotalCodewords = errorCorrectionCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

      // Add a terminator.
      // If the bit string is shorter than the total number of required bits,
      // a terminator of up to four 0s must be added to the right side of the string.
      // If the bit string is more than four bits shorter than the required number of bits,
      // add four 0s to the end.
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }

      // If the bit string is fewer than four bits shorter, add only the number of 0s that
      // are needed to reach the required number of bits.

      // After adding the terminator, if the number of bits in the string is not a multiple of 8,
      // pad the string on the right with 0s to make the string's length a multiple of 8.
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }

      // Add pad bytes if the string is still shorter than the total number of required bits.
      // Extend the buffer to fill the data capacity of the symbol corresponding to
      // the Version and Error Correction Level by adding the Pad Codewords 11101100 (0xEC)
      // and 00010001 (0x11) alternately.
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 0x11 : 0xEC, 8);
      }

      return createCodewords(buffer, version, errorCorrectionLevel)
    }

    /**
     * Encode input data with Reed-Solomon and return codewords with
     * relative error correction bits
     *
     * @param  {BitBuffer} bitBuffer            Data to encode
     * @param  {Number}    version              QR Code version
     * @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
     * @return {Uint8Array}                     Buffer containing encoded codewords
     */
    function createCodewords (bitBuffer, version, errorCorrectionLevel) {
      // Total codewords for this QR code version (Data + Error correction)
      const totalCodewords = utils$1.getSymbolTotalCodewords(version);

      // Total number of error correction codewords
      const ecTotalCodewords = errorCorrectionCode.getTotalCodewordsCount(version, errorCorrectionLevel);

      // Total number of data codewords
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;

      // Total number of blocks
      const ecTotalBlocks = errorCorrectionCode.getBlocksCount(version, errorCorrectionLevel);

      // Calculate how many blocks each group should contain
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;

      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);

      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;

      // Number of EC codewords is the same for both groups
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;

      // Initialize a Reed-Solomon encoder with a generator polynomial of degree ecCount
      const rs = new reedSolomonEncoder(ecCount);

      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);

      // Divide the buffer into the required number of blocks
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;

        // extract a block of data from buffer
        dcData[b] = buffer.slice(offset, offset + dataSize);

        // Calculate EC codewords for this data block
        ecData[b] = rs.encode(dcData[b]);

        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }

      // Create final data
      // Interleave the data and error correction codewords from each block
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;

      // Add data codewords
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }

      // Apped EC codewords
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }

      return data
    }

    /**
     * Build QR Code symbol
     *
     * @param  {String} data                 Input string
     * @param  {Number} version              QR Code version
     * @param  {ErrorCorretionLevel} errorCorrectionLevel Error level
     * @param  {MaskPattern} maskPattern     Mask pattern
     * @return {Object}                      Object containing symbol data
     */
    function createSymbol (data, version$1, errorCorrectionLevel, maskPattern$1) {
      let segments$1;

      if (Array.isArray(data)) {
        segments$1 = segments.fromArray(data);
      } else if (typeof data === 'string') {
        let estimatedVersion = version$1;

        if (!estimatedVersion) {
          const rawSegments = segments.rawSplit(data);

          // Estimate best version that can contain raw splitted segments
          estimatedVersion = version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }

        // Build optimized segments
        // If estimated version is undefined, try with the highest version
        segments$1 = segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error('Invalid data')
      }

      // Get the min version that can contain data
      const bestVersion = version.getBestVersionForData(segments$1, errorCorrectionLevel);

      // If no version is found, data cannot be stored
      if (!bestVersion) {
        throw new Error('The amount of data is too big to be stored in a QR Code')
      }

      // If not specified, use min version as default
      if (!version$1) {
        version$1 = bestVersion;

      // Check if the specified version can contain the data
      } else if (version$1 < bestVersion) {
        throw new Error('\n' +
          'The chosen QR Code version cannot contain this amount of data.\n' +
          'Minimum version required to store current data is: ' + bestVersion + '.\n'
        )
      }

      const dataBits = createData(version$1, errorCorrectionLevel, segments$1);

      // Allocate matrix buffer
      const moduleCount = utils$1.getSymbolSize(version$1);
      const modules = new bitMatrix(moduleCount);

      // Add function modules
      setupFinderPattern(modules, version$1);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version$1);

      // Add temporary dummy bits for format info just to set them as reserved.
      // This is needed to prevent these bits from being masked by {@link MaskPattern.applyMask}
      // since the masking operation must be performed only on the encoding region.
      // These blocks will be replaced with correct values later in code.
      setupFormatInfo(modules, errorCorrectionLevel, 0);

      if (version$1 >= 7) {
        setupVersionInfo(modules, version$1);
      }

      // Add data codewords
      setupData(modules, dataBits);

      if (isNaN(maskPattern$1)) {
        // Find best mask pattern
        maskPattern$1 = maskPattern.getBestMask(modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel));
      }

      // Apply mask pattern
      maskPattern.applyMask(maskPattern$1, modules);

      // Replace format info bits with correct values
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern$1);

      return {
        modules: modules,
        version: version$1,
        errorCorrectionLevel: errorCorrectionLevel,
        maskPattern: maskPattern$1,
        segments: segments$1
      }
    }

    /**
     * QR Code
     *
     * @param {String | Array} data                 Input data
     * @param {Object} options                      Optional configurations
     * @param {Number} options.version              QR Code version
     * @param {String} options.errorCorrectionLevel Error correction level
     * @param {Function} options.toSJISFunc         Helper func to convert utf8 to sjis
     */
    var create$1 = function create (data, options) {
      if (typeof data === 'undefined' || data === '') {
        throw new Error('No input text')
      }

      let errorCorrectionLevel$1 = errorCorrectionLevel.M;
      let version$1;
      let mask;

      if (typeof options !== 'undefined') {
        // Use higher error correction level as default
        errorCorrectionLevel$1 = errorCorrectionLevel.from(options.errorCorrectionLevel, errorCorrectionLevel.M);
        version$1 = version.from(options.version);
        mask = maskPattern.from(options.maskPattern);

        if (options.toSJISFunc) {
          utils$1.setToSJISFunction(options.toSJISFunc);
        }
      }

      return createSymbol(data, version$1, errorCorrectionLevel$1, mask)
    };

    var qrcode = {
    	create: create$1
    };

    var utils = createCommonjsModule(function (module, exports) {
    function hex2rgba (hex) {
      if (typeof hex === 'number') {
        hex = hex.toString();
      }

      if (typeof hex !== 'string') {
        throw new Error('Color should be defined as hex string')
      }

      let hexCode = hex.slice().replace('#', '').split('');
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error('Invalid hex color: ' + hex)
      }

      // Convert from short to long form (fff -> ffffff)
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function (c) {
          return [c, c]
        }));
      }

      // Add default alpha value
      if (hexCode.length === 6) hexCode.push('F', 'F');

      const hexValue = parseInt(hexCode.join(''), 16);

      return {
        r: (hexValue >> 24) & 255,
        g: (hexValue >> 16) & 255,
        b: (hexValue >> 8) & 255,
        a: hexValue & 255,
        hex: '#' + hexCode.slice(0, 6).join('')
      }
    }

    exports.getOptions = function getOptions (options) {
      if (!options) options = {};
      if (!options.color) options.color = {};

      const margin = typeof options.margin === 'undefined' ||
        options.margin === null ||
        options.margin < 0
        ? 4
        : options.margin;

      const width = options.width && options.width >= 21 ? options.width : undefined;
      const scale = options.scale || 4;

      return {
        width: width,
        scale: width ? 4 : scale,
        margin: margin,
        color: {
          dark: hex2rgba(options.color.dark || '#000000ff'),
          light: hex2rgba(options.color.light || '#ffffffff')
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      }
    };

    exports.getScale = function getScale (qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2
        ? opts.width / (qrSize + opts.margin * 2)
        : opts.scale
    };

    exports.getImageWidth = function getImageWidth (qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale)
    };

    exports.qrToImageData = function qrToImageData (imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];

      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;

          if (i >= scaledMargin && j >= scaledMargin &&
            i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }

          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
    });

    var canvas = createCommonjsModule(function (module, exports) {
    function clearCanvas (ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + 'px';
      canvas.style.width = size + 'px';
    }

    function getCanvasElement () {
      try {
        return document.createElement('canvas')
      } catch (e) {
        throw new Error('You need to specify a canvas element')
      }
    }

    exports.render = function render (qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;

      if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = undefined;
      }

      if (!canvas) {
        canvasEl = getCanvasElement();
      }

      opts = utils.getOptions(opts);
      const size = utils.getImageWidth(qrData.modules.size, opts);

      const ctx = canvasEl.getContext('2d');
      const image = ctx.createImageData(size, size);
      utils.qrToImageData(image.data, qrData, opts);

      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);

      return canvasEl
    };

    exports.renderToDataURL = function renderToDataURL (qrData, canvas, options) {
      let opts = options;

      if (typeof opts === 'undefined' && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = undefined;
      }

      if (!opts) opts = {};

      const canvasEl = exports.render(qrData, canvas, opts);

      const type = opts.type || 'image/png';
      const rendererOpts = opts.rendererOpts || {};

      return canvasEl.toDataURL(type, rendererOpts.quality)
    };
    });

    function getColorAttrib (color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';

      return alpha < 1
        ? str + ' ' + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"'
        : str
    }

    function svgCmd (cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== 'undefined') str += ' ' + y;

      return str
    }

    function qrToPath (data, size, margin) {
      let path = '';
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;

      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);

        if (!col && !newRow) newRow = true;

        if (data[i]) {
          lineLength++;

          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow
              ? svgCmd('M', col + margin, 0.5 + row + margin)
              : svgCmd('m', moveBy, 0);

            moveBy = 0;
            newRow = false;
          }

          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd('h', lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }

      return path
    }

    var render = function render (qrData, options, cb) {
      const opts = utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;

      const bg = !opts.color.light.a
        ? ''
        : '<path ' + getColorAttrib(opts.color.light, 'fill') +
          ' d="M0 0h' + qrcodesize + 'v' + qrcodesize + 'H0z"/>';

      const path =
        '<path ' + getColorAttrib(opts.color.dark, 'stroke') +
        ' d="' + qrToPath(data, size, opts.margin) + '"/>';

      const viewBox = 'viewBox="' + '0 0 ' + qrcodesize + ' ' + qrcodesize + '"';

      const width = !opts.width ? '' : 'width="' + opts.width + '" height="' + opts.width + '" ';

      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + '</svg>\n';

      if (typeof cb === 'function') {
        cb(null, svgTag);
      }

      return svgTag
    };

    var svgTag = {
    	render: render
    };

    function renderCanvas (renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === 'function';

      if (!isLastArgCb && !canPromise()) {
        throw new Error('Callback required as last argument')
      }

      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error('Too few arguments provided')
        }

        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = undefined;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === 'undefined') {
            cb = opts;
            opts = undefined;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = undefined;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error('Too few arguments provided')
        }

        if (argsNum === 1) {
          text = canvas;
          canvas = opts = undefined;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = undefined;
        }

        return new Promise(function (resolve, reject) {
          try {
            const data = qrcode.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        })
      }

      try {
        const data = qrcode.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }

    var create = qrcode.create;
    var toCanvas = renderCanvas.bind(null, canvas.render);
    var toDataURL = renderCanvas.bind(null, canvas.renderToDataURL);

    // only svg for now.
    var toString = renderCanvas.bind(null, function (data, _, opts) {
      return svgTag.render(data, opts)
    });

    var browser = {
    	create: create,
    	toCanvas: toCanvas,
    	toDataURL: toDataURL,
    	toString: toString
    };

    /* src/QR.svelte generated by Svelte v3.44.3 */
    const file$C = "src/QR.svelte";

    // (30:0) {:else}
    function create_else_block$b(ctx) {
    	let canvas_1;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "title", /*title*/ ctx[0]);
    			add_location(canvas_1, file$C, 30, 2, 660);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding_1*/ ctx[6](canvas_1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) {
    				attr_dev(canvas_1, "title", /*title*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding_1*/ ctx[6](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$b.name,
    		type: "else",
    		source: "(30:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (28:0) {#if href}
    function create_if_block$k(ctx) {
    	let a;
    	let canvas_1;

    	const block = {
    		c: function create() {
    			a = element("a");
    			canvas_1 = element("canvas");
    			add_location(canvas_1, file$C, 28, 20, 609);
    			attr_dev(a, "href", /*href*/ ctx[1]);
    			attr_dev(a, "title", /*title*/ ctx[0]);
    			add_location(a, file$C, 28, 2, 591);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, canvas_1);
    			/*canvas_1_binding*/ ctx[5](canvas_1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*href*/ 2) {
    				attr_dev(a, "href", /*href*/ ctx[1]);
    			}

    			if (dirty & /*title*/ 1) {
    				attr_dev(a, "title", /*title*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			/*canvas_1_binding*/ ctx[5](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(28:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$M(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[1]) return create_if_block$k;
    		return create_else_block$b;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QR', slots, []);
    	const gs = getContext('gs');
    	let { data } = $$props;
    	let { title } = $$props;
    	let { href } = $$props;
    	let { scale = 3 } = $$props;
    	let canvas;

    	const generate = data => {
    		data = data.toUpperCase();

    		browser.toCanvas(canvas, data, {
    			errorCorrectionLevel: 'L',
    			margin: 1,
    			scale,
    			color: { dark: '#353535ff', light: '#ffffff00' }
    		});
    	};

    	onMount(() => generate(data));
    	const writable_props = ['data', 'title', 'href', 'scale'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QR> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(2, canvas);
    		});
    	}

    	function canvas_1_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(2, canvas);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(3, data = $$props.data);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('href' in $$props) $$invalidate(1, href = $$props.href);
    		if ('scale' in $$props) $$invalidate(4, scale = $$props.scale);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		gs,
    		onMount,
    		QRCode: browser,
    		data,
    		title,
    		href,
    		scale,
    		canvas,
    		generate
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(3, data = $$props.data);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('href' in $$props) $$invalidate(1, href = $$props.href);
    		if ('scale' in $$props) $$invalidate(4, scale = $$props.scale);
    		if ('canvas' in $$props) $$invalidate(2, canvas = $$props.canvas);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data, href*/ 10) {
    			if (!data) $$invalidate(3, data = href);
    		}

    		if ($$self.$$.dirty & /*canvas, data*/ 12) {
    			if (canvas) generate(data);
    		}
    	};

    	return [title, href, canvas, data, scale, canvas_1_binding, canvas_1_binding_1];
    }

    class QR extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$M, create_fragment$M, safe_not_equal, { data: 3, title: 0, href: 1, scale: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QR",
    			options,
    			id: create_fragment$M.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[3] === undefined && !('data' in props)) {
    			console.warn("<QR> was created without expected prop 'data'");
    		}

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<QR> was created without expected prop 'title'");
    		}

    		if (/*href*/ ctx[1] === undefined && !('href' in props)) {
    			console.warn("<QR> was created without expected prop 'href'");
    		}
    	}

    	get data() {
    		throw new Error("<QR>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<QR>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<QR>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<QR>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<QR>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<QR>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error("<QR>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error("<QR>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Logo.svelte generated by Svelte v3.44.3 */

    const file$B = "src/Logo.svelte";

    function create_fragment$L(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "0x2764";
    			attr_dev(div, "class", "logo svelte-qq597r");
    			add_location(div, file$B, 2, 0, 19);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$L($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$L, create_fragment$L, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$L.name
    		});
    	}
    }

    /* src/Search.svelte generated by Svelte v3.44.3 */
    const file$A = "src/Search.svelte";

    // (12:2) <Link nolink>
    function create_default_slot_3$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SEARCH");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$6.name,
    		type: "slot",
    		source: "(12:2) <Link nolink>",
    		ctx
    	});

    	return block;
    }

    // (15:2) {:else}
    function create_else_block$a(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				nolink: true,
    				$$slots: { default: [create_default_slot_2$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(15:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (13:2) {#if exists}
    function create_if_block$j(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				nolink: true,
    				$$slots: { default: [create_default_slot_1$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(13:2) {#if exists}",
    		ctx
    	});

    	return block;
    }

    // (16:4) <Link nolink>
    function create_default_slot_2$b(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("CREATE");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$b.name,
    		type: "slot",
    		source: "(16:4) <Link nolink>",
    		ctx
    	});

    	return block;
    }

    // (14:4) <Link nolink>
    function create_default_slot_1$c(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("GO");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$c.name,
    		type: "slot",
    		source: "(14:4) <Link nolink>",
    		ctx
    	});

    	return block;
    }

    // (10:0) <FB form>
    function create_default_slot$f(ctx) {
    	let input;
    	let t0;
    	let link;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	link = new Link$1({
    			props: {
    				nolink: true,
    				$$slots: { default: [create_default_slot_3$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$j, create_else_block$a];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*exists*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			create_component(link.$$.fragment);
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-1c3u3vk");
    			add_location(input, file$A, 10, 2, 217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(link, target, anchor);
    			insert_dev(target, t1, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			destroy_component(link, detaching);
    			if (detaching) detach_dev(t1);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$f.name,
    		type: "slot",
    		source: "(10:0) <FB form>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$K(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				form: true,
    				$$slots: { default: [create_default_slot$f] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	const gs = getContext('gs');
    	const path = getContext('path');
    	let exists = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ FB, Link: Link$1, getContext, gs, path, exists });

    	$$self.$inject_state = $$props => {
    		if ('exists' in $$props) $$invalidate(0, exists = $$props.exists);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [exists];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$K, create_fragment$K, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$K.name
    		});
    	}
    }

    /* src/Bookmarks.svelte generated by Svelte v3.44.3 */

    // (7:0) <Link nst="main">
    function create_default_slot_5$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("HOME");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(7:0) <Link nst=\\\"main\\\">",
    		ctx
    	});

    	return block;
    }

    // (8:0) <Link nst="main/foo">
    function create_default_slot_4$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("foo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$4.name,
    		type: "slot",
    		source: "(8:0) <Link nst=\\\"main/foo\\\">",
    		ctx
    	});

    	return block;
    }

    // (9:0) <Link nst="main/bar">
    function create_default_slot_3$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("bar");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(9:0) <Link nst=\\\"main/bar\\\">",
    		ctx
    	});

    	return block;
    }

    // (10:0) <Link nst="main/Home">
    function create_default_slot_2$a(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("HOME 2");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$a.name,
    		type: "slot",
    		source: "(10:0) <Link nst=\\\"main/Home\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:0) <Link nst="main/FAKE">
    function create_default_slot_1$b(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("RED LINK");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$b.name,
    		type: "slot",
    		source: "(11:0) <Link nst=\\\"main/FAKE\\\">",
    		ctx
    	});

    	return block;
    }

    // (6:0) <FB>
    function create_default_slot$e(ctx) {
    	let link0;
    	let t0;
    	let link1;
    	let t1;
    	let link2;
    	let t2;
    	let link3;
    	let t3;
    	let link4;
    	let current;

    	link0 = new Link$1({
    			props: {
    				nst: "main",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				nst: "main/foo",
    				$$slots: { default: [create_default_slot_4$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				nst: "main/bar",
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				nst: "main/Home",
    				$$slots: { default: [create_default_slot_2$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				nst: "main/FAKE",
    				$$slots: { default: [create_default_slot_1$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link0.$$.fragment);
    			t0 = space();
    			create_component(link1.$$.fragment);
    			t1 = space();
    			create_component(link2.$$.fragment);
    			t2 = space();
    			create_component(link3.$$.fragment);
    			t3 = space();
    			create_component(link4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(link1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(link2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(link3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(link4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(link1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(link2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(link3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(link4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(6:0) <FB>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$J(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$J($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Bookmarks', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bookmarks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1, FB });
    	return [];
    }

    class Bookmarks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$J, create_fragment$J, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bookmarks",
    			options,
    			id: create_fragment$J.name
    		});
    	}
    }

    /* src/UserBar.svelte generated by Svelte v3.44.3 */
    const file$z = "src/UserBar.svelte";

    // (10:2) {#if $hassess}
    function create_if_block_1$a(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$6, create_else_block_1$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$session*/ ctx[1].val.login) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(10:2) {#if $hassess}",
    		ctx
    	});

    	return block;
    }

    // (13:4) {:else}
    function create_else_block_1$3(ctx) {
    	let span;
    	let t_value = /*$session*/ ctx[1].val.handle + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$z, 13, 6, 354);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$session*/ 2 && t_value !== (t_value = /*$session*/ ctx[1].val.handle + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$3.name,
    		type: "else",
    		source: "(13:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:4) {#if $session.val.login}
    function create_if_block_2$6(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				special: "user",
    				$$slots: { default: [create_default_slot_2$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope, $session*/ 34) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(11:4) {#if $session.val.login}",
    		ctx
    	});

    	return block;
    }

    // (12:6) <Link special="user">
    function create_default_slot_2$9(ctx) {
    	let t_value = /*$session*/ ctx[1].val.handle + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$session*/ 2 && t_value !== (t_value = /*$session*/ ctx[1].val.handle + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$9.name,
    		type: "slot",
    		source: "(12:6) <Link special=\\\"user\\\">",
    		ctx
    	});

    	return block;
    }

    // (19:2) {:else}
    function create_else_block$9(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				special: "login",
    				$$slots: { default: [create_default_slot_1$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(19:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:2) {#if $hassess && $session.val.login}
    function create_if_block$i(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				first: /*logout*/ ctx[4],
    				global: true,
    				nolink: true,
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(17:2) {#if $hassess && $session.val.login}",
    		ctx
    	});

    	return block;
    }

    // (20:4) <Link special="login">
    function create_default_slot_1$a(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("LOGIN / REGISTER");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$a.name,
    		type: "slot",
    		source: "(20:4) <Link special=\\\"login\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:4) <Link first={logout} global nolink>
    function create_default_slot$d(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("LOGOUT");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(18:4) <Link first={logout} global nolink>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$I(ctx) {
    	let div;
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let current;
    	let if_block0 = /*$hassess*/ ctx[0] && create_if_block_1$a(ctx);
    	const if_block_creators = [create_if_block$i, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$hassess*/ ctx[0] && /*$session*/ ctx[1].val.login) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			attr_dev(div, "class", "user-bar svelte-ftc4qu");
    			add_location(div, file$z, 8, 0, 211);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$hassess*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$hassess*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$a(ctx);
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
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
    	let $hassess;
    	let $session;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserBar', slots, []);
    	const session = getContext('session');
    	validate_store(session, 'session');
    	component_subscribe($$self, session, value => $$invalidate(1, $session = value));
    	const hassess = getContext('hassess');
    	validate_store(hassess, 'hassess');
    	component_subscribe($$self, hassess, value => $$invalidate(0, $hassess = value));
    	const logout = getContext('logout');
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		getContext,
    		session,
    		hassess,
    		logout,
    		$hassess,
    		$session
    	});

    	return [$hassess, $session, session, hassess, logout];
    }

    class UserBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$I, create_fragment$I, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserBar",
    			options,
    			id: create_fragment$I.name
    		});
    	}
    }

    /* src/Headframe.svelte generated by Svelte v3.44.3 */
    const file$y = "src/Headframe.svelte";

    // (17:2) <FB vert expand>
    function create_default_slot_5$1(ctx) {
    	let search;
    	let t;
    	let bookmarks;
    	let current;
    	search = new Search({ $$inline: true });
    	bookmarks = new Bookmarks({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(search.$$.fragment);
    			t = space();
    			create_component(bookmarks.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(search, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(bookmarks, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			transition_in(bookmarks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);
    			transition_out(bookmarks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(search, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(bookmarks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(17:2) <FB vert expand>",
    		ctx
    	});

    	return block;
    }

    // (23:4) {#if $hassess}
    function create_if_block_1$9(ctx) {
    	let div;
    	let t_value = /*$session*/ ctx[1].val.uuid + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "suuid uuid svelte-xyzsi5");
    			add_location(div, file$y, 23, 6, 518);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$session*/ 2 && t_value !== (t_value = /*$session*/ ctx[1].val.uuid + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(23:4) {#if $hassess}",
    		ctx
    	});

    	return block;
    }

    // (29:8) <FB leaf expand>
    function create_default_slot_4$3(ctx) {
    	let userbar;
    	let current;
    	userbar = new UserBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(userbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(userbar, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(userbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(userbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(userbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(29:8) <FB leaf expand>",
    		ctx
    	});

    	return block;
    }

    // (28:6) <FB expand vert zero>
    function create_default_slot_3$4(ctx) {
    	let fb;
    	let t;
    	let logo;
    	let current;

    	fb = new FB({
    			props: {
    				leaf: true,
    				expand: true,
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	logo = new Logo({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    			t = space();
    			create_component(logo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(logo, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fb_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			transition_in(logo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			transition_out(logo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(logo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(28:6) <FB expand vert zero>",
    		ctx
    	});

    	return block;
    }

    // (32:6) {#if $hassess}
    function create_if_block$h(ctx) {
    	let qr;
    	let current;

    	qr = new QR({
    			props: {
    				data: /*$session*/ ctx[1].val.uuid,
    				title: "Session UUID",
    				scale: 2
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(qr.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(qr, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const qr_changes = {};
    			if (dirty & /*$session*/ 2) qr_changes.data = /*$session*/ ctx[1].val.uuid;
    			qr.$set(qr_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(qr.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(qr.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(qr, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(32:6) {#if $hassess}",
    		ctx
    	});

    	return block;
    }

    // (27:4) <FB>
    function create_default_slot_2$8(ctx) {
    	let fb;
    	let t;
    	let if_block_anchor;
    	let current;

    	fb = new FB({
    			props: {
    				expand: true,
    				vert: true,
    				zero: true,
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*$hassess*/ ctx[0] && create_if_block$h(ctx);

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fb_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);

    			if (/*$hassess*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$hassess*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$h(ctx);
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$8.name,
    		type: "slot",
    		source: "(27:4) <FB>",
    		ctx
    	});

    	return block;
    }

    // (22:2) <FB vert>
    function create_default_slot_1$9(ctx) {
    	let t;
    	let fb;
    	let current;
    	let if_block = /*$hassess*/ ctx[0] && create_if_block_1$9(ctx);

    	fb = new FB({
    			props: {
    				$$slots: { default: [create_default_slot_2$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(fb.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$hassess*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$9(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const fb_changes = {};

    			if (dirty & /*$$scope, $session, $hassess*/ 67) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(22:2) <FB vert>",
    		ctx
    	});

    	return block;
    }

    // (15:0) <FB>
    function create_default_slot$c(ctx) {
    	let fb0;
    	let t;
    	let fb1;
    	let current;

    	fb0 = new FB({
    			props: {
    				vert: true,
    				expand: true,
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fb1 = new FB({
    			props: {
    				vert: true,
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb0.$$.fragment);
    			t = space();
    			create_component(fb1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(fb1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fb0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				fb0_changes.$$scope = { dirty, ctx };
    			}

    			fb0.$set(fb0_changes);
    			const fb1_changes = {};

    			if (dirty & /*$$scope, $session, $hassess*/ 67) {
    				fb1_changes.$$scope = { dirty, ctx };
    			}

    			fb1.$set(fb1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb0.$$.fragment, local);
    			transition_in(fb1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb0.$$.fragment, local);
    			transition_out(fb1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(fb1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(15:0) <FB>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$H(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};

    			if (dirty & /*$$scope, $session, $hassess*/ 67) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
    	let $hassess;
    	let $session;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Headframe', slots, []);
    	const gs = getContext('gs');
    	const path = getContext('path');
    	const session = getContext('session');
    	validate_store(session, 'session');
    	component_subscribe($$self, session, value => $$invalidate(1, $session = value));
    	const hassess = getContext('hassess');
    	validate_store(hassess, 'hassess');
    	component_subscribe($$self, hassess, value => $$invalidate(0, $hassess = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Headframe> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		QR,
    		FB,
    		Logo,
    		Search,
    		Bookmarks,
    		UserBar,
    		getContext,
    		gs,
    		path,
    		session,
    		hassess,
    		$hassess,
    		$session
    	});

    	return [$hassess, $session, session, hassess];
    }

    class Headframe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$H, create_fragment$H, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Headframe",
    			options,
    			id: create_fragment$H.name
    		});
    	}
    }

    /* src/TitleBar.svelte generated by Svelte v3.44.3 */
    const file$x = "src/TitleBar.svelte";

    // (8:0) <FB vert expand zero c="title">
    function create_default_slot$b(ctx) {
    	let fb;
    	let t0;
    	let div0;
    	let t1;
    	let t2;
    	let t3;
    	let div1;
    	let t4;
    	let current;
    	fb = new FB({ props: { expand: true }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = text("NAMESPACE: ");
    			t2 = text(/*$space*/ ctx[0]);
    			t3 = space();
    			div1 = element("div");
    			t4 = text(/*$title*/ ctx[1]);
    			attr_dev(div0, "class", "title-sub");
    			add_location(div0, file$x, 9, 2, 212);
    			attr_dev(div1, "class", "title-main");
    			add_location(div1, file$x, 10, 2, 263);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$space*/ 1) set_data_dev(t2, /*$space*/ ctx[0]);
    			if (!current || dirty & /*$title*/ 2) set_data_dev(t4, /*$title*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(8:0) <FB vert expand zero c=\\\"title\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$G(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				vert: true,
    				expand: true,
    				zero: true,
    				c: "title",
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};

    			if (dirty & /*$$scope, $title, $space*/ 19) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props, $$invalidate) {
    	let $space;
    	let $title;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TitleBar', slots, []);
    	const space = getContext('space');
    	validate_store(space, 'space');
    	component_subscribe($$self, space, value => $$invalidate(0, $space = value));
    	const title = getContext('title');
    	validate_store(title, 'title');
    	component_subscribe($$self, title, value => $$invalidate(1, $title = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TitleBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FB,
    		getContext,
    		space,
    		title,
    		$space,
    		$title
    	});

    	return [$space, $title, space, title];
    }

    class TitleBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TitleBar",
    			options,
    			id: create_fragment$G.name
    		});
    	}
    }

    /* src/TitleControls.svelte generated by Svelte v3.44.3 */

    // (13:0) {#if $hassess && $haspage && !$page.val.historical}
    function create_if_block_2$5(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				self: true,
    				cmd: "edit",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(13:0) {#if $hassess && $haspage && !$page.val.historical}",
    		ctx
    	});

    	return block;
    }

    // (14:2) <Link self cmd="edit">
    function create_default_slot_4$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("EDIT");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(14:2) <Link self cmd=\\\"edit\\\">",
    		ctx
    	});

    	return block;
    }

    // (16:0) <Link self cmd="history">
    function create_default_slot_3$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("HISTORY");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(16:0) <Link self cmd=\\\"history\\\">",
    		ctx
    	});

    	return block;
    }

    // (17:0) {#if $haspage && !$page.val.historical}
    function create_if_block_1$8(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				uuid: /*$page*/ ctx[2].uuid,
    				$$slots: { default: [create_default_slot_2$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*$page*/ 4) link_changes.uuid = /*$page*/ ctx[2].uuid;

    			if (dirty & /*$$scope*/ 512) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(17:0) {#if $haspage && !$page.val.historical}",
    		ctx
    	});

    	return block;
    }

    // (18:2) <Link uuid={$page.uuid}>
    function create_default_slot_2$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("HEAD");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$7.name,
    		type: "slot",
    		source: "(18:2) <Link uuid={$page.uuid}>",
    		ctx
    	});

    	return block;
    }

    // (20:0) {#if $loc.uuid && $haspage && !$page.val.historical}
    function create_if_block$g(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				space: /*$page*/ ctx[2].namespace,
    				title: /*$page*/ ctx[2].title,
    				$$slots: { default: [create_default_slot_1$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*$page*/ 4) link_changes.space = /*$page*/ ctx[2].namespace;
    			if (dirty & /*$page*/ 4) link_changes.title = /*$page*/ ctx[2].title;

    			if (dirty & /*$$scope*/ 512) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(20:0) {#if $loc.uuid && $haspage && !$page.val.historical}",
    		ctx
    	});

    	return block;
    }

    // (21:2) <Link space={$page.namespace} title={$page.title}>
    function create_default_slot_1$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("ANCHOR");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(21:2) <Link space={$page.namespace} title={$page.title}>",
    		ctx
    	});

    	return block;
    }

    // (12:0) <FB>
    function create_default_slot$a(ctx) {
    	let t0;
    	let link;
    	let t1;
    	let t2;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*$hassess*/ ctx[0] && /*$haspage*/ ctx[1] && !/*$page*/ ctx[2].val.historical && create_if_block_2$5(ctx);

    	link = new Link$1({
    			props: {
    				self: true,
    				cmd: "history",
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = /*$haspage*/ ctx[1] && !/*$page*/ ctx[2].val.historical && create_if_block_1$8(ctx);
    	let if_block2 = /*$loc*/ ctx[3].uuid && /*$haspage*/ ctx[1] && !/*$page*/ ctx[2].val.historical && create_if_block$g(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(link.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(link, target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$hassess*/ ctx[0] && /*$haspage*/ ctx[1] && !/*$page*/ ctx[2].val.historical) {
    				if (if_block0) {
    					if (dirty & /*$hassess, $haspage, $page*/ 7) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const link_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);

    			if (/*$haspage*/ ctx[1] && !/*$page*/ ctx[2].val.historical) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$haspage, $page*/ 6) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$8(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t2.parentNode, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*$loc*/ ctx[3].uuid && /*$haspage*/ ctx[1] && !/*$page*/ ctx[2].val.historical) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*$loc, $haspage, $page*/ 14) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$g(ctx);
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(link.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(link.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(link, detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(12:0) <FB>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$F(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};

    			if (dirty & /*$$scope, $page, $loc, $haspage, $hassess*/ 527) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
    	let $hassess;
    	let $haspage;
    	let $page;
    	let $loc;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TitleControls', slots, []);
    	const session = getContext('session');
    	const hassess = getContext('hassess');
    	validate_store(hassess, 'hassess');
    	component_subscribe($$self, hassess, value => $$invalidate(0, $hassess = value));
    	const page = getContext('page');
    	validate_store(page, 'page');
    	component_subscribe($$self, page, value => $$invalidate(2, $page = value));
    	const haspage = getContext('haspage');
    	validate_store(haspage, 'haspage');
    	component_subscribe($$self, haspage, value => $$invalidate(1, $haspage = value));
    	const loc = getContext('loc');
    	validate_store(loc, 'loc');
    	component_subscribe($$self, loc, value => $$invalidate(3, $loc = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TitleControls> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FB,
    		Link: Link$1,
    		getContext,
    		session,
    		hassess,
    		page,
    		haspage,
    		loc,
    		$hassess,
    		$haspage,
    		$page,
    		$loc
    	});

    	return [$hassess, $haspage, $page, $loc, hassess, page, haspage, loc];
    }

    class TitleControls extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TitleControls",
    			options,
    			id: create_fragment$F.name
    		});
    	}
    }

    /* src/Titleframe.svelte generated by Svelte v3.44.3 */

    // (25:4) <FB expand>
    function create_default_slot_2$6(ctx) {
    	let titlebar;
    	let current;
    	titlebar = new TitleBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(titlebar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(titlebar, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(titlebar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(titlebar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(titlebar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(25:4) <FB expand>",
    		ctx
    	});

    	return block;
    }

    // (23:2) <FB vert expand zero>
    function create_default_slot_1$7(ctx) {
    	let titlecontrols;
    	let t;
    	let fb;
    	let current;
    	titlecontrols = new TitleControls({ $$inline: true });

    	fb = new FB({
    			props: {
    				expand: true,
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(titlecontrols.$$.fragment);
    			t = space();
    			create_component(fb.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(titlecontrols, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fb_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(titlecontrols.$$.fragment, local);
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(titlecontrols.$$.fragment, local);
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(titlecontrols, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(23:2) <FB vert expand zero>",
    		ctx
    	});

    	return block;
    }

    // (27:1) {#if $haspage}
    function create_if_block_1$7(ctx) {
    	let qr;
    	let current;

    	qr = new QR({
    			props: {
    				data: /*permac*/ ctx[3],
    				href: /*perma*/ ctx[0],
    				title: "Page Permalink"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(qr.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(qr, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const qr_changes = {};
    			if (dirty & /*permac*/ 8) qr_changes.data = /*permac*/ ctx[3];
    			if (dirty & /*perma*/ 1) qr_changes.href = /*perma*/ ctx[0];
    			qr.$set(qr_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(qr.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(qr.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(qr, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(27:1) {#if $haspage}",
    		ctx
    	});

    	return block;
    }

    // (28:1) {#if $haspage}
    function create_if_block$f(ctx) {
    	let qr;
    	let current;

    	qr = new QR({
    			props: {
    				data: /*vpermac*/ ctx[4],
    				href: /*vperma*/ ctx[1],
    				title: "Version Permalink"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(qr.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(qr, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const qr_changes = {};
    			if (dirty & /*vpermac*/ 16) qr_changes.data = /*vpermac*/ ctx[4];
    			if (dirty & /*vperma*/ 2) qr_changes.href = /*vperma*/ ctx[1];
    			qr.$set(qr_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(qr.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(qr.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(qr, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(28:1) {#if $haspage}",
    		ctx
    	});

    	return block;
    }

    // (22:0) <FB>
    function create_default_slot$9(ctx) {
    	let fb;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;

    	fb = new FB({
    			props: {
    				vert: true,
    				expand: true,
    				zero: true,
    				$$slots: { default: [create_default_slot_1$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*$haspage*/ ctx[2] && create_if_block_1$7(ctx);
    	let if_block1 = /*$haspage*/ ctx[2] && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fb_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);

    			if (/*$haspage*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$haspage*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$7(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$haspage*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$haspage*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$f(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(22:0) <FB>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$E(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};

    			if (dirty & /*$$scope, vpermac, vperma, $haspage, permac, perma*/ 2079) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
    	let $page;
    	let $gs;
    	let $haspage;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Titleframe', slots, []);
    	const gs = getContext('gs');
    	validate_store(gs, 'gs');
    	component_subscribe($$self, gs, value => $$invalidate(9, $gs = value));
    	const page = getContext('page');
    	validate_store(page, 'page');
    	component_subscribe($$self, page, value => $$invalidate(8, $page = value));
    	const haspage = getContext('haspage');
    	validate_store(haspage, 'haspage');
    	component_subscribe($$self, haspage, value => $$invalidate(2, $haspage = value));
    	const crop = u => u.match(/.*?\/\/(.*)/)[1];
    	let perma, vperma, permac, vpermac;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Titleframe> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FB,
    		QR,
    		TitleBar,
    		TitleControls,
    		getContext,
    		gs,
    		page,
    		haspage,
    		crop,
    		perma,
    		vperma,
    		permac,
    		vpermac,
    		$page,
    		$gs,
    		$haspage
    	});

    	$$self.$inject_state = $$props => {
    		if ('perma' in $$props) $$invalidate(0, perma = $$props.perma);
    		if ('vperma' in $$props) $$invalidate(1, vperma = $$props.vperma);
    		if ('permac' in $$props) $$invalidate(3, permac = $$props.permac);
    		if ('vpermac' in $$props) $$invalidate(4, vpermac = $$props.vpermac);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$haspage, $gs, $page, perma, vperma*/ 775) {
    			if ($haspage) {
    				$$invalidate(0, perma = $gs.full($page.val.uuid));
    				$$invalidate(1, vperma = $gs.full($page.val.vuuid));
    				$$invalidate(3, permac = crop(perma));
    				$$invalidate(4, vpermac = crop(vperma));
    			}
    		}
    	};

    	return [perma, vperma, $haspage, permac, vpermac, gs, page, haspage, $page, $gs];
    }

    class Titleframe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$E, create_fragment$E, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Titleframe",
    			options,
    			id: create_fragment$E.name
    		});
    	}
    }

    /* src/Login.svelte generated by Svelte v3.44.3 */
    const file$w = "src/Login.svelte";

    // (14:0) <Link first={logw} global bounce>
    function create_default_slot_1$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("LOGIN");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(14:0) <Link first={logw} global bounce>",
    		ctx
    	});

    	return block;
    }

    // (15:0) <Link first={regw} global bounce>
    function create_default_slot$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("REGISTER");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(15:0) <Link first={regw} global bounce>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$D(ctx) {
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let link0;
    	let t2;
    	let link1;
    	let current;
    	let mounted;
    	let dispose;

    	link0 = new Link$1({
    			props: {
    				first: /*logw*/ ctx[2],
    				global: true,
    				bounce: true,
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				first: /*regw*/ ctx[3],
    				global: true,
    				bounce: true,
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			create_component(link0.$$.fragment);
    			t2 = space();
    			create_component(link1.$$.fragment);
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$w, 11, 0, 280);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$w, 12, 0, 322);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*handle*/ ctx[0]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*pass*/ ctx[1]);
    			insert_dev(target, t1, anchor);
    			mount_component(link0, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(link1, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*handle*/ 1 && input0.value !== /*handle*/ ctx[0]) {
    				set_input_value(input0, /*handle*/ ctx[0]);
    			}

    			if (dirty & /*pass*/ 2 && input1.value !== /*pass*/ ctx[1]) {
    				set_input_value(input1, /*pass*/ ctx[1]);
    			}

    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t1);
    			destroy_component(link0, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(link1, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	const login = getContext('login');
    	const register = getContext('register');
    	let handle;
    	let pass;
    	const logw = () => login({ handle, pass });
    	const regw = () => register({ handle, pass });
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		handle = this.value;
    		$$invalidate(0, handle);
    	}

    	function input1_input_handler() {
    		pass = this.value;
    		$$invalidate(1, pass);
    	}

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		getContext,
    		login,
    		register,
    		handle,
    		pass,
    		logw,
    		regw
    	});

    	$$self.$inject_state = $$props => {
    		if ('handle' in $$props) $$invalidate(0, handle = $$props.handle);
    		if ('pass' in $$props) $$invalidate(1, pass = $$props.pass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handle, pass, logw, regw, input0_input_handler, input1_input_handler];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    /* src/User.svelte generated by Svelte v3.44.3 */
    const file$v = "src/User.svelte";

    // (7:0) {#if $hasuser}
    function create_if_block$e(ctx) {
    	let h1;
    	let t0_value = /*$user*/ ctx[1].val.handle + "";
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3_value = /*$user*/ ctx[1].val.createdAt + "";
    	let t3;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text("Circa ");
    			t3 = text(t3_value);
    			add_location(h1, file$v, 7, 2, 149);
    			add_location(p, file$v, 8, 2, 179);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$user*/ 2 && t0_value !== (t0_value = /*$user*/ ctx[1].val.handle + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$user*/ 2 && t3_value !== (t3_value = /*$user*/ ctx[1].val.createdAt + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(7:0) {#if $hasuser}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let if_block_anchor;
    	let if_block = /*$hasuser*/ ctx[0] && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$hasuser*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$e(ctx);
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
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let $hasuser;
    	let $user;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('User', slots, []);
    	const hasuser = getContext('hasuser');
    	validate_store(hasuser, 'hasuser');
    	component_subscribe($$self, hasuser, value => $$invalidate(0, $hasuser = value));
    	const user = getContext('user');
    	validate_store(user, 'user');
    	component_subscribe($$self, user, value => $$invalidate(1, $user = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<User> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getContext,
    		hasuser,
    		user,
    		$hasuser,
    		$user
    	});

    	return [$hasuser, $user, hasuser, user];
    }

    class User extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "User",
    			options,
    			id: create_fragment$C.name
    		});
    	}
    }

    /* src/E404.svelte generated by Svelte v3.44.3 */

    const file$u = "src/E404.svelte";

    function create_fragment$B(ctx) {
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "404";
    			t1 = space();
    			p = element("p");
    			p.textContent = "404 not found";
    			add_location(h1, file$u, 0, 0, 0);
    			add_location(p, file$u, 1, 0, 13);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('E404', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<E404> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class E404 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "E404",
    			options,
    			id: create_fragment$B.name
    		});
    	}
    }

    /* src/E500.svelte generated by Svelte v3.44.3 */

    const file$t = "src/E500.svelte";

    function create_fragment$A(ctx) {
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "500";
    			t1 = space();
    			p = element("p");
    			p.textContent = "500 internal error";
    			add_location(h1, file$t, 0, 0, 0);
    			add_location(p, file$t, 1, 0, 13);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('E500', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<E500> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class E500 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "E500",
    			options,
    			id: create_fragment$A.name
    		});
    	}
    }

    /* src/UUID.svelte generated by Svelte v3.44.3 */

    const file$s = "src/UUID.svelte";

    function create_fragment$z(ctx) {
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "uuid");
    			add_location(span, file$s, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UUID', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UUID> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class UUID extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UUID",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    /* src/Pipe.svelte generated by Svelte v3.44.3 */
    const file$r = "src/Pipe.svelte";

    // (21:2) {#if a}
    function create_if_block_3$4(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				c: "fb-pipe-exp",
    				expand: true,
    				leaf: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(21:2) {#if a}",
    		ctx
    	});

    	return block;
    }

    // (28:2) {:else}
    function create_else_block_1$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$2.name,
    		type: "else",
    		source: "(28:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:2) {#if pipe}
    function create_if_block_1$6(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (!/*vert*/ ctx[0]) return create_if_block_2$4;
    		return create_else_block$8;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(22:2) {#if pipe}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {:else}
    function create_else_block$8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "v-pipe");
    			add_location(div, file$r, 25, 6, 548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(25:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:4) {#if !vert}
    function create_if_block_2$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "h-pipe");
    			add_location(div, file$r, 23, 6, 503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(23:4) {#if !vert}",
    		ctx
    	});

    	return block;
    }

    // (31:2) {#if b}
    function create_if_block$d(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				c: "fb-pipe-exp",
    				expand: true,
    				leaf: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(31:2) {#if b}",
    		ctx
    	});

    	return block;
    }

    // (20:0) <FB c="fb-pipe" {expand} vert={!vert} zero>
    function create_default_slot$7(ctx) {
    	let t0;
    	let current_block_type_index;
    	let if_block1;
    	let t1;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*a*/ ctx[2] && create_if_block_3$4(ctx);
    	const if_block_creators = [create_if_block_1$6, create_else_block_1$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*pipe*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block2 = /*b*/ ctx[3] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*a*/ ctx[2]) {
    				if (if_block0) {
    					if (dirty & /*a*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if_block1.p(ctx, dirty);

    			if (/*b*/ ctx[3]) {
    				if (if_block2) {
    					if (dirty & /*b*/ 8) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$d(ctx);
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(20:0) <FB c=\\\"fb-pipe\\\" {expand} vert={!vert} zero>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				c: "fb-pipe",
    				expand: /*expand*/ ctx[1],
    				vert: !/*vert*/ ctx[0],
    				zero: true,
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};
    			if (dirty & /*expand*/ 2) fb_changes.expand = /*expand*/ ctx[1];
    			if (dirty & /*vert*/ 1) fb_changes.vert = !/*vert*/ ctx[0];

    			if (dirty & /*$$scope, b, vert, a*/ 525) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pipe', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { left } = $$props;
    	let { right } = $$props;
    	let { center } = $$props;
    	let { vert = false } = $$props;
    	let { expand = false } = $$props;
    	let a = false;
    	let b = false;
    	let pipe = !$$slots.default;
    	const writable_props = ['left', 'right', 'center', 'vert', 'expand'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pipe> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('left' in $$props) $$invalidate(6, left = $$props.left);
    		if ('right' in $$props) $$invalidate(7, right = $$props.right);
    		if ('center' in $$props) $$invalidate(5, center = $$props.center);
    		if ('vert' in $$props) $$invalidate(0, vert = $$props.vert);
    		if ('expand' in $$props) $$invalidate(1, expand = $$props.expand);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		FB,
    		left,
    		right,
    		center,
    		vert,
    		expand,
    		a,
    		b,
    		pipe
    	});

    	$$self.$inject_state = $$props => {
    		if ('left' in $$props) $$invalidate(6, left = $$props.left);
    		if ('right' in $$props) $$invalidate(7, right = $$props.right);
    		if ('center' in $$props) $$invalidate(5, center = $$props.center);
    		if ('vert' in $$props) $$invalidate(0, vert = $$props.vert);
    		if ('expand' in $$props) $$invalidate(1, expand = $$props.expand);
    		if ('a' in $$props) $$invalidate(2, a = $$props.a);
    		if ('b' in $$props) $$invalidate(3, b = $$props.b);
    		if ('pipe' in $$props) $$invalidate(4, pipe = $$props.pipe);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*left, right, center*/ 224) {
    			if (!left && !right && !center) $$invalidate(5, center = true);
    		}

    		if ($$self.$$.dirty & /*left, right, center*/ 224) {
    			if (left) $$invalidate(3, b = true); else if (right) $$invalidate(2, a = true); else if (center) {
    				$$invalidate(2, a = true);
    				$$invalidate(3, b = true);
    			}
    		}
    	};

    	return [vert, expand, a, b, pipe, center, left, right, slots, $$scope];
    }

    class Pipe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {
    			left: 6,
    			right: 7,
    			center: 5,
    			vert: 0,
    			expand: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pipe",
    			options,
    			id: create_fragment$y.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*left*/ ctx[6] === undefined && !('left' in props)) {
    			console.warn("<Pipe> was created without expected prop 'left'");
    		}

    		if (/*right*/ ctx[7] === undefined && !('right' in props)) {
    			console.warn("<Pipe> was created without expected prop 'right'");
    		}

    		if (/*center*/ ctx[5] === undefined && !('center' in props)) {
    			console.warn("<Pipe> was created without expected prop 'center'");
    		}
    	}

    	get left() {
    		throw new Error("<Pipe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<Pipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<Pipe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<Pipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Pipe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Pipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vert() {
    		throw new Error("<Pipe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vert(value) {
    		throw new Error("<Pipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expand() {
    		throw new Error("<Pipe>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expand(value) {
    		throw new Error("<Pipe>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Balance.svelte generated by Svelte v3.44.3 */
    const file$q = "src/Balance.svelte";

    // (28:2) {#if a}
    function create_if_block_1$5(ctx) {
    	let pipe;
    	let current;

    	pipe = new Pipe({
    			props: { expand: true, vert: /*vert*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pipe.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pipe, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pipe_changes = {};
    			if (dirty & /*vert*/ 2) pipe_changes.vert = /*vert*/ ctx[1];
    			pipe.$set(pipe_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pipe.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pipe.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pipe, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(28:2) {#if a}",
    		ctx
    	});

    	return block;
    }

    // (30:2) {#if b}
    function create_if_block$c(ctx) {
    	let pipe;
    	let current;

    	pipe = new Pipe({
    			props: { expand: true, vert: /*vert*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pipe.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pipe, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pipe_changes = {};
    			if (dirty & /*vert*/ 2) pipe_changes.vert = /*vert*/ ctx[1];
    			pipe.$set(pipe_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pipe.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pipe.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pipe, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(30:2) {#if b}",
    		ctx
    	});

    	return block;
    }

    // (27:0) <FB {expand} {vert} zero>
    function create_default_slot$6(ctx) {
    	let t0;
    	let div;
    	let t1;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*a*/ ctx[2] && create_if_block_1$5(ctx);
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let if_block1 = /*b*/ ctx[3] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr_dev(div, "class", /*c*/ ctx[4]);
    			add_location(div, file$q, 28, 2, 544);
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*a*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*a*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*c*/ 16) {
    				attr_dev(div, "class", /*c*/ ctx[4]);
    			}

    			if (/*b*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*b*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$c(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(default_slot, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(default_slot, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(27:0) <FB {expand} {vert} zero>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				expand: /*expand*/ ctx[0],
    				vert: /*vert*/ ctx[1],
    				zero: true,
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};
    			if (dirty & /*expand*/ 1) fb_changes.expand = /*expand*/ ctx[0];
    			if (dirty & /*vert*/ 2) fb_changes.vert = /*vert*/ ctx[1];

    			if (dirty & /*$$scope, vert, b, c, a*/ 542) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Balance', slots, ['default']);
    	let { left } = $$props;
    	let { right } = $$props;
    	let { center } = $$props;
    	let { expand = false } = $$props;
    	let { vert = false } = $$props;
    	let a = false;
    	let b = false;
    	let c = '';
    	const writable_props = ['left', 'right', 'center', 'expand', 'vert'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Balance> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('left' in $$props) $$invalidate(6, left = $$props.left);
    		if ('right' in $$props) $$invalidate(7, right = $$props.right);
    		if ('center' in $$props) $$invalidate(5, center = $$props.center);
    		if ('expand' in $$props) $$invalidate(0, expand = $$props.expand);
    		if ('vert' in $$props) $$invalidate(1, vert = $$props.vert);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		FB,
    		Pipe,
    		left,
    		right,
    		center,
    		expand,
    		vert,
    		a,
    		b,
    		c
    	});

    	$$self.$inject_state = $$props => {
    		if ('left' in $$props) $$invalidate(6, left = $$props.left);
    		if ('right' in $$props) $$invalidate(7, right = $$props.right);
    		if ('center' in $$props) $$invalidate(5, center = $$props.center);
    		if ('expand' in $$props) $$invalidate(0, expand = $$props.expand);
    		if ('vert' in $$props) $$invalidate(1, vert = $$props.vert);
    		if ('a' in $$props) $$invalidate(2, a = $$props.a);
    		if ('b' in $$props) $$invalidate(3, b = $$props.b);
    		if ('c' in $$props) $$invalidate(4, c = $$props.c);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*left, right, center*/ 224) {
    			if (!left && !right && !center) $$invalidate(5, center = true);
    		}

    		if ($$self.$$.dirty & /*left, right, center, a, c, b*/ 252) {
    			{
    				$$invalidate(4, c = []);

    				if (left) $$invalidate(3, b = true); else if (right) $$invalidate(2, a = true); else if (center) {
    					$$invalidate(2, a = true);
    					$$invalidate(3, b = true);
    				}

    				if (a) c.push('balance-left');
    				if (b) c.push('balance-right');
    				$$invalidate(4, c = c.join(' '));
    			}
    		}
    	};

    	return [expand, vert, a, b, c, center, left, right, slots, $$scope];
    }

    class Balance extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {
    			left: 6,
    			right: 7,
    			center: 5,
    			expand: 0,
    			vert: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Balance",
    			options,
    			id: create_fragment$x.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*left*/ ctx[6] === undefined && !('left' in props)) {
    			console.warn("<Balance> was created without expected prop 'left'");
    		}

    		if (/*right*/ ctx[7] === undefined && !('right' in props)) {
    			console.warn("<Balance> was created without expected prop 'right'");
    		}

    		if (/*center*/ ctx[5] === undefined && !('center' in props)) {
    			console.warn("<Balance> was created without expected prop 'center'");
    		}
    	}

    	get left() {
    		throw new Error("<Balance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<Balance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<Balance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<Balance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get center() {
    		throw new Error("<Balance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set center(value) {
    		throw new Error("<Balance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expand() {
    		throw new Error("<Balance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expand(value) {
    		throw new Error("<Balance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vert() {
    		throw new Error("<Balance>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vert(value) {
    		throw new Error("<Balance>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/HistoryItem.svelte generated by Svelte v3.44.3 */
    const file$p = "src/HistoryItem.svelte";

    // (14:43) <UUID>
    function create_default_slot_2$5(ctx) {
    	let t_value = /*item*/ ctx[0].vuuid + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 1 && t_value !== (t_value = /*item*/ ctx[0].vuuid + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(14:43) <UUID>",
    		ctx
    	});

    	return block;
    }

    // (14:19) <Link uuid={item.vuuid}>
    function create_default_slot_1$5(ctx) {
    	let uuid;
    	let current;

    	uuid = new UUID({
    			props: {
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(uuid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(uuid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const uuid_changes = {};

    			if (dirty & /*$$scope, item*/ 5) {
    				uuid_changes.$$scope = { dirty, ctx };
    			}

    			uuid.$set(uuid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(uuid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(uuid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(uuid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(14:19) <Link uuid={item.vuuid}>",
    		ctx
    	});

    	return block;
    }

    // (14:4) <Balance right>
    function create_default_slot$5(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				uuid: /*item*/ ctx[0].vuuid,
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*item*/ 1) link_changes.uuid = /*item*/ ctx[0].vuuid;

    			if (dirty & /*$$scope, item*/ 5) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(14:4) <Balance right>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*item*/ ctx[0].vnum + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*item*/ ctx[0].title + "";
    	let t2;
    	let t3;
    	let td2;
    	let balance;
    	let current;

    	balance = new Balance({
    			props: {
    				right: true,
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			create_component(balance.$$.fragment);
    			attr_dev(td0, "class", "history-num");
    			add_location(td0, file$p, 10, 2, 245);
    			attr_dev(td1, "class", "history-title");
    			add_location(td1, file$p, 11, 2, 288);
    			attr_dev(td2, "class", "history-vuuid");
    			add_location(td2, file$p, 12, 2, 334);
    			attr_dev(tr, "class", "history-item");
    			add_location(tr, file$p, 9, 0, 217);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			mount_component(balance, td2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*item*/ 1) && t0_value !== (t0_value = /*item*/ ctx[0].vnum + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*item*/ 1) && t2_value !== (t2_value = /*item*/ ctx[0].title + "")) set_data_dev(t2, t2_value);
    			const balance_changes = {};

    			if (dirty & /*$$scope, item*/ 5) {
    				balance_changes.$$scope = { dirty, ctx };
    			}

    			balance.$set(balance_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(balance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(balance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(balance);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HistoryItem', slots, []);
    	const gs = getContext('gs');
    	let { item } = $$props;
    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HistoryItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		UUID,
    		Balance,
    		getContext,
    		gs,
    		item
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item];
    }

    class HistoryItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HistoryItem",
    			options,
    			id: create_fragment$w.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<HistoryItem> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<HistoryItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<HistoryItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/History.svelte generated by Svelte v3.44.3 */
    const file$o = "src/History.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (8:0) {#if $hashistory}
    function create_if_block$b(ctx) {
    	let table;
    	let current;
    	let each_value = /*$history*/ ctx[1].val;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			table = element("table");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(table, "class", "history-items");
    			add_location(table, file$o, 8, 2, 213);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$history*/ 2) {
    				each_value = /*$history*/ ctx[1].val;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(table, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(8:0) {#if $hashistory}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#each $history.val as item}
    function create_each_block$1(ctx) {
    	let historyitem;
    	let current;

    	historyitem = new HistoryItem({
    			props: { item: /*item*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(historyitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(historyitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const historyitem_changes = {};
    			if (dirty & /*$history*/ 2) historyitem_changes.item = /*item*/ ctx[4];
    			historyitem.$set(historyitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(historyitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(historyitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(historyitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(10:2) {#each $history.val as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$hashistory*/ ctx[0] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$hashistory*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$hashistory*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let $hashistory;
    	let $history;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('History', slots, []);
    	const history = getContext('history');
    	validate_store(history, 'history');
    	component_subscribe($$self, history, value => $$invalidate(1, $history = value));
    	const hashistory = getContext('hashistory');
    	validate_store(hashistory, 'hashistory');
    	component_subscribe($$self, hashistory, value => $$invalidate(0, $hashistory = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<History> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		HistoryItem,
    		getContext,
    		history,
    		hashistory,
    		$hashistory,
    		$history
    	});

    	return [$hashistory, $history, history, hashistory];
    }

    class History extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "History",
    			options,
    			id: create_fragment$v.name
    		});
    	}
    }

    /* src/PageForm.svelte generated by Svelte v3.44.3 */
    const file$n = "src/PageForm.svelte";

    // (28:4) {:else}
    function create_else_block$7(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				self: true,
    				global: true,
    				first: /*save*/ ctx[4],
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(28:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (25:4) {#if editing}
    function create_if_block$a(ctx) {
    	let link0;
    	let t;
    	let link1;
    	let current;

    	link0 = new Link$1({
    			props: {
    				decmd: true,
    				first: /*save*/ ctx[4],
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				decmd: true,
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link0.$$.fragment);
    			t = space();
    			create_component(link1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(link1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(link1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(25:4) {#if editing}",
    		ctx
    	});

    	return block;
    }

    // (29:6) <Link self global first={save}>
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SAVE");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(29:6) <Link self global first={save}>",
    		ctx
    	});

    	return block;
    }

    // (26:6) <Link decmd first={save}>
    function create_default_slot_3$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("SAVE");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(26:6) <Link decmd first={save}>",
    		ctx
    	});

    	return block;
    }

    // (27:6) <Link decmd>
    function create_default_slot_2$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("CANCEL");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(27:6) <Link decmd>",
    		ctx
    	});

    	return block;
    }

    // (24:2) <FB flip>
    function create_default_slot_1$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*editing*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(24:2) <FB flip>",
    		ctx
    	});

    	return block;
    }

    // (22:0) <FB vert form>
    function create_default_slot$4(ctx) {
    	let textarea;
    	let t;
    	let fb;
    	let current;
    	let mounted;
    	let dispose;

    	fb = new FB({
    			props: {
    				flip: true,
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			t = space();
    			create_component(fb.$$.fragment);
    			attr_dev(textarea, "class", "main-editor svelte-1s0jrh4");
    			add_location(textarea, file$n, 22, 2, 616);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*body*/ ctx[1]);
    			insert_dev(target, t, anchor);
    			mount_component(fb, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*body*/ 2) {
    				set_input_value(textarea, /*body*/ ctx[1]);
    			}

    			const fb_changes = {};

    			if (dirty & /*$$scope, editing*/ 4097) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			if (detaching) detach_dev(t);
    			destroy_component(fb, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(22:0) <FB vert form>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				vert: true,
    				form: true,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};

    			if (dirty & /*$$scope, editing, body*/ 4099) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let $page;
    	let $loc;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PageForm', slots, []);
    	const page = getContext('page');
    	validate_store(page, 'page');
    	component_subscribe($$self, page, value => $$invalidate(6, $page = value));
    	const updatepage = getContext('updatepage');
    	const postpage = getContext('postpage');
    	const loc = getContext('loc');
    	validate_store(loc, 'loc');
    	component_subscribe($$self, loc, value => $$invalidate(7, $loc = value));
    	let { editing = false } = $$props;
    	let namespace = $page.val ? $page.val.namespace : $loc.namespace;
    	let title = $page.val ? $page.val.title : $loc.title;
    	let body = $page.val ? $page.val.body : '';

    	const save = () => {
    		const data = { namespace, title, body };
    		return editing ? updatepage(data) : postpage(data);
    	};

    	const writable_props = ['editing'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PageForm> was created with unknown prop '${key}'`);
    	});

    	function textarea_input_handler() {
    		body = this.value;
    		$$invalidate(1, body);
    	}

    	$$self.$$set = $$props => {
    		if ('editing' in $$props) $$invalidate(0, editing = $$props.editing);
    	};

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		FB,
    		getContext,
    		page,
    		updatepage,
    		postpage,
    		loc,
    		editing,
    		namespace,
    		title,
    		body,
    		save,
    		$page,
    		$loc
    	});

    	$$self.$inject_state = $$props => {
    		if ('editing' in $$props) $$invalidate(0, editing = $$props.editing);
    		if ('namespace' in $$props) namespace = $$props.namespace;
    		if ('title' in $$props) title = $$props.title;
    		if ('body' in $$props) $$invalidate(1, body = $$props.body);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [editing, body, page, loc, save, textarea_input_handler];
    }

    class PageForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { editing: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PageForm",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get editing() {
    		throw new Error("<PageForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editing(value) {
    		throw new Error("<PageForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/Parser.svelte generated by Svelte v3.44.3 */

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (15:2) {#if renderers[type]}
    function create_if_block_1$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$3, create_if_block_3$3, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*type*/ ctx[0] === 'table') return 0;
    		if (/*type*/ ctx[0] === 'list') return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(15:2) {#if renderers[type]}",
    		ctx
    	});

    	return block;
    }

    // (10:0) {#if !type}
    function create_if_block$9(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*tokens*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tokens, renderers*/ 34) {
    				each_value = /*tokens*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(10:0) {#if !type}",
    		ctx
    	});

    	return block;
    }

    // (65:4) {:else}
    function create_else_block_1$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*$$restProps*/ ctx[6]];
    	var switch_value = /*renderers*/ ctx[5][/*type*/ ctx[0]];

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_11] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$$restProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*$$restProps*/ ctx[6])])
    			: {};

    			if (dirty & /*$$scope, tokens, renderers, $$restProps*/ 8388706) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5][/*type*/ ctx[0]])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(65:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:30) 
    function create_if_block_3$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_4$2, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*ordered*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(47:30) ",
    		ctx
    	});

    	return block;
    }

    // (16:4) {#if type === 'table'}
    function create_if_block_2$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].table;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*$$scope, renderers, rows, $$restProps, header*/ 8388716) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].table)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(16:4) {#if type === 'table'}",
    		ctx
    	});

    	return block;
    }

    // (69:8) {:else}
    function create_else_block_2$1(ctx) {
    	let t_value = /*$$restProps*/ ctx[6].raw + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$$restProps*/ 64 && t_value !== (t_value = /*$$restProps*/ ctx[6].raw + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2$1.name,
    		type: "else",
    		source: "(69:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (67:8) {#if tokens}
    function create_if_block_5$1(ctx) {
    	let parser;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*tokens*/ ctx[1],
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*tokens*/ 2) parser_changes.tokens = /*tokens*/ ctx[1];
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(67:8) {#if tokens}",
    		ctx
    	});

    	return block;
    }

    // (66:6) <svelte:component this={renderers[type]} {...$$restProps}>
    function create_default_slot_11(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_5$1, create_else_block_2$1];
    	const if_blocks = [];

    	function select_block_type_3(ctx, dirty) {
    		if (/*tokens*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_3(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_3(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(66:6) <svelte:component this={renderers[type]} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    // (56:6) {:else}
    function create_else_block$6(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ ordered: /*ordered*/ ctx[4] }, /*$$restProps*/ ctx[6]];
    	var switch_value = /*renderers*/ ctx[5].list;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_9] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*ordered, $$restProps*/ 80)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*ordered*/ 16 && { ordered: /*ordered*/ ctx[4] },
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].list)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(56:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:6) {#if ordered}
    function create_if_block_4$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ ordered: /*ordered*/ ctx[4] }, /*$$restProps*/ ctx[6]];
    	var switch_value = /*renderers*/ ctx[5].list;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_7] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*ordered, $$restProps*/ 80)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*ordered*/ 16 && { ordered: /*ordered*/ ctx[4] },
    					dirty & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[6])
    				])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].list)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(48:6) {#if ordered}",
    		ctx
    	});

    	return block;
    }

    // (59:12) <svelte:component this={renderers.unorderedlistitem || renderers.listitem} {...item}>
    function create_default_slot_10(ctx) {
    	let parser;
    	let t;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*item*/ ctx[18].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*$$restProps*/ 64) parser_changes.tokens = /*item*/ ctx[18].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(59:12) <svelte:component this={renderers.unorderedlistitem || renderers.listitem} {...item}>",
    		ctx
    	});

    	return block;
    }

    // (58:10) {#each $$restProps.items as item}
    function create_each_block_5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*item*/ ctx[18]];
    	var switch_value = /*renderers*/ ctx[5].unorderedlistitem || /*renderers*/ ctx[5].listitem;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_10] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$$restProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*item*/ ctx[18])])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].unorderedlistitem || /*renderers*/ ctx[5].listitem)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(58:10) {#each $$restProps.items as item}",
    		ctx
    	});

    	return block;
    }

    // (57:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>
    function create_default_slot_9(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_5 = /*$$restProps*/ ctx[6].items;
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps*/ 96) {
    				each_value_5 = /*$$restProps*/ ctx[6].items;
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_5.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_5.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(57:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    // (51:12) <svelte:component this={renderers.orderedlistitem || renderers.listitem} {...item}>
    function create_default_slot_8(ctx) {
    	let parser;
    	let t;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*item*/ ctx[18].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*$$restProps*/ 64) parser_changes.tokens = /*item*/ ctx[18].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(51:12) <svelte:component this={renderers.orderedlistitem || renderers.listitem} {...item}>",
    		ctx
    	});

    	return block;
    }

    // (50:10) {#each $$restProps.items as item}
    function create_each_block_4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*item*/ ctx[18]];
    	var switch_value = /*renderers*/ ctx[5].orderedlistitem || /*renderers*/ ctx[5].listitem;

    	function switch_props(ctx) {
    		let switch_instance_props = {
    			$$slots: { default: [create_default_slot_8] },
    			$$scope: { ctx }
    		};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$$restProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*item*/ ctx[18])])
    			: {};

    			if (dirty & /*$$scope, $$restProps, renderers*/ 8388704) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].orderedlistitem || /*renderers*/ ctx[5].listitem)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(50:10) {#each $$restProps.items as item}",
    		ctx
    	});

    	return block;
    }

    // (49:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>
    function create_default_slot_7(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_4 = /*$$restProps*/ ctx[6].items;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps*/ 96) {
    				each_value_4 = /*$$restProps*/ ctx[6].items;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_4.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_4.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(49:8) <svelte:component this={renderers.list} {ordered} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    // (21:14) <svelte:component                 this={renderers.tablecell}                 header={true}                 align={$$restProps.align[i] || 'center'}                 >
    function create_default_slot_6(ctx) {
    	let parser;
    	let t;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*headerItem*/ ctx[16].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*header*/ 4) parser_changes.tokens = /*headerItem*/ ctx[16].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(21:14) <svelte:component                 this={renderers.tablecell}                 header={true}                 align={$$restProps.align[i] || 'center'}                 >",
    		ctx
    	});

    	return block;
    }

    // (20:12) {#each header as headerItem, i}
    function create_each_block_3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablecell;

    	function switch_props(ctx) {
    		return {
    			props: {
    				header: true,
    				align: /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center',
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*$$restProps*/ 64) switch_instance_changes.align = /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center';

    			if (dirty & /*$$scope, header, renderers*/ 8388644) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablecell)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(20:12) {#each header as headerItem, i}",
    		ctx
    	});

    	return block;
    }

    // (19:10) <svelte:component this={renderers.tablerow}>
    function create_default_slot_5(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_3 = /*header*/ ctx[2];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps, header*/ 100) {
    				each_value_3 = /*header*/ ctx[2];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(19:10) <svelte:component this={renderers.tablerow}>",
    		ctx
    	});

    	return block;
    }

    // (18:8) <svelte:component this={renderers.tablehead}>
    function create_default_slot_4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablerow;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*$$scope, header, renderers, $$restProps*/ 8388708) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablerow)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(18:8) <svelte:component this={renderers.tablehead}>",
    		ctx
    	});

    	return block;
    }

    // (35:16) <svelte:component                   this={renderers.tablecell}                   header={false}                   align={$$restProps.align[i] || 'center'}                   >
    function create_default_slot_3$1(ctx) {
    	let parser;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*cells*/ ctx[13].tokens,
    				renderers: /*renderers*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = {};
    			if (dirty & /*rows*/ 8) parser_changes.tokens = /*cells*/ ctx[13].tokens;
    			if (dirty & /*renderers*/ 32) parser_changes.renderers = /*renderers*/ ctx[5];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(35:16) <svelte:component                   this={renderers.tablecell}                   header={false}                   align={$$restProps.align[i] || 'center'}                   >",
    		ctx
    	});

    	return block;
    }

    // (34:14) {#each row as cells, i}
    function create_each_block_2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablecell;

    	function switch_props(ctx) {
    		return {
    			props: {
    				header: false,
    				align: /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center',
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*$$restProps*/ 64) switch_instance_changes.align = /*$$restProps*/ ctx[6].align[/*i*/ ctx[15]] || 'center';

    			if (dirty & /*$$scope, rows, renderers*/ 8388648) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablecell)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(34:14) {#each row as cells, i}",
    		ctx
    	});

    	return block;
    }

    // (33:12) <svelte:component this={renderers.tablerow}>
    function create_default_slot_2$3(ctx) {
    	let t;
    	let current;
    	let each_value_2 = /*row*/ ctx[10];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, $$restProps, rows*/ 104) {
    				each_value_2 = /*row*/ ctx[10];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(33:12) <svelte:component this={renderers.tablerow}>",
    		ctx
    	});

    	return block;
    }

    // (32:10) {#each rows as row}
    function create_each_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablerow;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*$$scope, rows, renderers, $$restProps*/ 8388712) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablerow)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(32:10) {#each rows as row}",
    		ctx
    	});

    	return block;
    }

    // (31:8) <svelte:component this={renderers.tablebody}>
    function create_default_slot_1$3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*rows*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*renderers, rows, $$restProps*/ 104) {
    				each_value_1 = /*rows*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(31:8) <svelte:component this={renderers.tablebody}>",
    		ctx
    	});

    	return block;
    }

    // (17:6) <svelte:component this={renderers.table}>
    function create_default_slot$3(ctx) {
    	let switch_instance0;
    	let t;
    	let switch_instance1;
    	let switch_instance1_anchor;
    	let current;
    	var switch_value = /*renderers*/ ctx[5].tablehead;

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance0 = new switch_value(switch_props(ctx));
    	}

    	var switch_value_1 = /*renderers*/ ctx[5].tablebody;

    	function switch_props_1(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value_1) {
    		switch_instance1 = new switch_value_1(switch_props_1(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance0) create_component(switch_instance0.$$.fragment);
    			t = space();
    			if (switch_instance1) create_component(switch_instance1.$$.fragment);
    			switch_instance1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance0) {
    				mount_component(switch_instance0, target, anchor);
    			}

    			insert_dev(target, t, anchor);

    			if (switch_instance1) {
    				mount_component(switch_instance1, target, anchor);
    			}

    			insert_dev(target, switch_instance1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance0_changes = {};

    			if (dirty & /*$$scope, renderers, header, $$restProps*/ 8388708) {
    				switch_instance0_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*renderers*/ ctx[5].tablehead)) {
    				if (switch_instance0) {
    					group_outros();
    					const old_component = switch_instance0;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance0 = new switch_value(switch_props(ctx));
    					create_component(switch_instance0.$$.fragment);
    					transition_in(switch_instance0.$$.fragment, 1);
    					mount_component(switch_instance0, t.parentNode, t);
    				} else {
    					switch_instance0 = null;
    				}
    			} else if (switch_value) {
    				switch_instance0.$set(switch_instance0_changes);
    			}

    			const switch_instance1_changes = {};

    			if (dirty & /*$$scope, rows, renderers, $$restProps*/ 8388712) {
    				switch_instance1_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value_1 !== (switch_value_1 = /*renderers*/ ctx[5].tablebody)) {
    				if (switch_instance1) {
    					group_outros();
    					const old_component = switch_instance1;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value_1) {
    					switch_instance1 = new switch_value_1(switch_props_1(ctx));
    					create_component(switch_instance1.$$.fragment);
    					transition_in(switch_instance1.$$.fragment, 1);
    					mount_component(switch_instance1, switch_instance1_anchor.parentNode, switch_instance1_anchor);
    				} else {
    					switch_instance1 = null;
    				}
    			} else if (switch_value_1) {
    				switch_instance1.$set(switch_instance1_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance0) transition_in(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_in(switch_instance1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance0) transition_out(switch_instance0.$$.fragment, local);
    			if (switch_instance1) transition_out(switch_instance1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance0) destroy_component(switch_instance0, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(switch_instance1_anchor);
    			if (switch_instance1) destroy_component(switch_instance1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(17:6) <svelte:component this={renderers.table}>",
    		ctx
    	});

    	return block;
    }

    // (11:2) {#each tokens as token}
    function create_each_block(ctx) {
    	let parser;
    	let current;
    	const parser_spread_levels = [/*token*/ ctx[7], { renderers: /*renderers*/ ctx[5] }];
    	let parser_props = {};

    	for (let i = 0; i < parser_spread_levels.length; i += 1) {
    		parser_props = assign(parser_props, parser_spread_levels[i]);
    	}

    	parser = new Parser$1({ props: parser_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const parser_changes = (dirty & /*tokens, renderers*/ 34)
    			? get_spread_update(parser_spread_levels, [
    					dirty & /*tokens*/ 2 && get_spread_object(/*token*/ ctx[7]),
    					dirty & /*renderers*/ 32 && { renderers: /*renderers*/ ctx[5] }
    				])
    			: {};

    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(11:2) {#each tokens as token}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_if_block_1$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*type*/ ctx[0]) return 0;
    		if (/*renderers*/ ctx[5][/*type*/ ctx[0]]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
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
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	const omit_props_names = ["type","tokens","header","rows","ordered","renderers"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Parser', slots, []);
    	let { type = undefined } = $$props;
    	let { tokens = undefined } = $$props;
    	let { header = undefined } = $$props;
    	let { rows = undefined } = $$props;
    	let { ordered = false } = $$props;
    	let { renderers } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('type' in $$new_props) $$invalidate(0, type = $$new_props.type);
    		if ('tokens' in $$new_props) $$invalidate(1, tokens = $$new_props.tokens);
    		if ('header' in $$new_props) $$invalidate(2, header = $$new_props.header);
    		if ('rows' in $$new_props) $$invalidate(3, rows = $$new_props.rows);
    		if ('ordered' in $$new_props) $$invalidate(4, ordered = $$new_props.ordered);
    		if ('renderers' in $$new_props) $$invalidate(5, renderers = $$new_props.renderers);
    	};

    	$$self.$capture_state = () => ({
    		type,
    		tokens,
    		header,
    		rows,
    		ordered,
    		renderers
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('type' in $$props) $$invalidate(0, type = $$new_props.type);
    		if ('tokens' in $$props) $$invalidate(1, tokens = $$new_props.tokens);
    		if ('header' in $$props) $$invalidate(2, header = $$new_props.header);
    		if ('rows' in $$props) $$invalidate(3, rows = $$new_props.rows);
    		if ('ordered' in $$props) $$invalidate(4, ordered = $$new_props.ordered);
    		if ('renderers' in $$props) $$invalidate(5, renderers = $$new_props.renderers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, tokens, header, rows, ordered, renderers, $$restProps];
    }

    class Parser$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			type: 0,
    			tokens: 1,
    			header: 2,
    			rows: 3,
    			ordered: 4,
    			renderers: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Parser",
    			options,
    			id: create_fragment$t.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*renderers*/ ctx[5] === undefined && !('renderers' in props)) {
    			console.warn("<Parser> was created without expected prop 'renderers'");
    		}
    	}

    	get type() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tokens() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tokens(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get header() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ordered() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ordered(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderers() {
    		throw new Error("<Parser>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderers(value) {
    		throw new Error("<Parser>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * marked - a markdown parser
     * Copyright (c) 2011-2021, Christopher Jeffrey. (MIT Licensed)
     * https://github.com/markedjs/marked
     */

    /**
     * DO NOT EDIT THIS FILE
     * The code in this file is generated from files in ./src/
     */

    function getDefaults() {
      return {
        baseUrl: null,
        breaks: false,
        extensions: null,
        gfm: true,
        headerIds: true,
        headerPrefix: '',
        highlight: null,
        langPrefix: 'language-',
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        tokenizer: null,
        walkTokens: null,
        xhtml: false
      };
    }

    let defaults$1 = getDefaults();

    /**
     * Helpers
     */
    const escapeTest = /[&<>"']/;
    const escapeReplace = /[&<>"']/g;
    const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
    const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
    const escapeReplacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    const getEscapeReplacement = (ch) => escapeReplacements[ch];
    function escape(html, encode) {
      if (encode) {
        if (escapeTest.test(html)) {
          return html.replace(escapeReplace, getEscapeReplacement);
        }
      } else {
        if (escapeTestNoEncode.test(html)) {
          return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
        }
      }

      return html;
    }

    const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

    function unescape$1(html) {
      // explicitly match decimal, hex, and named HTML entities
      return html.replace(unescapeTest, (_, n) => {
        n = n.toLowerCase();
        if (n === 'colon') return ':';
        if (n.charAt(0) === '#') {
          return n.charAt(1) === 'x'
            ? String.fromCharCode(parseInt(n.substring(2), 16))
            : String.fromCharCode(+n.substring(1));
        }
        return '';
      });
    }

    const caret = /(^|[^\[])\^/g;
    function edit(regex, opt) {
      regex = regex.source || regex;
      opt = opt || '';
      const obj = {
        replace: (name, val) => {
          val = val.source || val;
          val = val.replace(caret, '$1');
          regex = regex.replace(name, val);
          return obj;
        },
        getRegex: () => {
          return new RegExp(regex, opt);
        }
      };
      return obj;
    }

    const nonWordAndColonTest = /[^\w:]/g;
    const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
    function cleanUrl(sanitize, base, href) {
      if (sanitize) {
        let prot;
        try {
          prot = decodeURIComponent(unescape$1(href))
            .replace(nonWordAndColonTest, '')
            .toLowerCase();
        } catch (e) {
          return null;
        }
        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
          return null;
        }
      }
      if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
      }
      try {
        href = encodeURI(href).replace(/%25/g, '%');
      } catch (e) {
        return null;
      }
      return href;
    }

    const baseUrls = {};
    const justDomain = /^[^:]+:\/*[^/]*$/;
    const protocol = /^([^:]+:)[\s\S]*$/;
    const domain$1 = /^([^:]+:\/*[^/]*)[\s\S]*$/;

    function resolveUrl(base, href) {
      if (!baseUrls[' ' + base]) {
        // we can ignore everything in base after the last slash of its path component,
        // but we might need to add _that_
        // https://tools.ietf.org/html/rfc3986#section-3
        if (justDomain.test(base)) {
          baseUrls[' ' + base] = base + '/';
        } else {
          baseUrls[' ' + base] = rtrim(base, '/', true);
        }
      }
      base = baseUrls[' ' + base];
      const relativeBase = base.indexOf(':') === -1;

      if (href.substring(0, 2) === '//') {
        if (relativeBase) {
          return href;
        }
        return base.replace(protocol, '$1') + href;
      } else if (href.charAt(0) === '/') {
        if (relativeBase) {
          return href;
        }
        return base.replace(domain$1, '$1') + href;
      } else {
        return base + href;
      }
    }

    const noopTest = { exec: function noopTest() {} };

    function merge(obj) {
      let i = 1,
        target,
        key;

      for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
          if (Object.prototype.hasOwnProperty.call(target, key)) {
            obj[key] = target[key];
          }
        }
      }

      return obj;
    }

    function splitCells(tableRow, count) {
      // ensure that every cell-delimiting pipe has a space
      // before it to distinguish it from an escaped pipe
      const row = tableRow.replace(/\|/g, (match, offset, str) => {
          let escaped = false,
            curr = offset;
          while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
        cells = row.split(/ \|/);
      let i = 0;

      // First/last cell in a row cannot be empty if it has no leading/trailing pipe
      if (!cells[0].trim()) { cells.shift(); }
      if (!cells[cells.length - 1].trim()) { cells.pop(); }

      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) cells.push('');
      }

      for (; i < cells.length; i++) {
        // leading or trailing whitespace is ignored per the gfm spec
        cells[i] = cells[i].trim().replace(/\\\|/g, '|');
      }
      return cells;
    }

    // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
    // /c*$/ is vulnerable to REDOS.
    // invert: Remove suffix of non-c chars instead. Default falsey.
    function rtrim(str, c, invert) {
      const l = str.length;
      if (l === 0) {
        return '';
      }

      // Length of suffix matching the invert condition.
      let suffLen = 0;

      // Step left until we fail to match the invert condition.
      while (suffLen < l) {
        const currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && !invert) {
          suffLen++;
        } else if (currChar !== c && invert) {
          suffLen++;
        } else {
          break;
        }
      }

      return str.substr(0, l - suffLen);
    }

    function findClosingBracket(str, b) {
      if (str.indexOf(b[1]) === -1) {
        return -1;
      }
      const l = str.length;
      let level = 0,
        i = 0;
      for (; i < l; i++) {
        if (str[i] === '\\') {
          i++;
        } else if (str[i] === b[0]) {
          level++;
        } else if (str[i] === b[1]) {
          level--;
          if (level < 0) {
            return i;
          }
        }
      }
      return -1;
    }

    // copied from https://stackoverflow.com/a/5450113/806777
    function repeatString(pattern, count) {
      if (count < 1) {
        return '';
      }
      let result = '';
      while (count > 1) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result + pattern;
    }

    function outputLink(cap, link, raw, lexer) {
      const href = link.href;
      const title = link.title ? escape(link.title) : null;
      const text = cap[1].replace(/\\([\[\]])/g, '$1');

      if (cap[0].charAt(0) !== '!') {
        lexer.state.inLink = true;
        const token = {
          type: 'link',
          raw,
          href,
          title,
          text,
          tokens: lexer.inlineTokens(text, [])
        };
        lexer.state.inLink = false;
        return token;
      } else {
        return {
          type: 'image',
          raw,
          href,
          title,
          text: escape(text)
        };
      }
    }

    function indentCodeCompensation(raw, text) {
      const matchIndentToCode = raw.match(/^(\s+)(?:```)/);

      if (matchIndentToCode === null) {
        return text;
      }

      const indentToCode = matchIndentToCode[1];

      return text
        .split('\n')
        .map(node => {
          const matchIndentInNode = node.match(/^\s+/);
          if (matchIndentInNode === null) {
            return node;
          }

          const [indentInNode] = matchIndentInNode;

          if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
          }

          return node;
        })
        .join('\n');
    }

    /**
     * Tokenizer
     */
    class Tokenizer {
      constructor(options) {
        this.options = options || defaults$1;
      }

      space(src) {
        const cap = this.rules.block.newline.exec(src);
        if (cap) {
          if (cap[0].length > 1) {
            return {
              type: 'space',
              raw: cap[0]
            };
          }
          return { raw: '\n' };
        }
      }

      code(src) {
        const cap = this.rules.block.code.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ {1,4}/gm, '');
          return {
            type: 'code',
            raw: cap[0],
            codeBlockStyle: 'indented',
            text: !this.options.pedantic
              ? rtrim(text, '\n')
              : text
          };
        }
      }

      fences(src) {
        const cap = this.rules.block.fences.exec(src);
        if (cap) {
          const raw = cap[0];
          const text = indentCodeCompensation(raw, cap[3] || '');

          return {
            type: 'code',
            raw,
            lang: cap[2] ? cap[2].trim() : cap[2],
            text
          };
        }
      }

      heading(src) {
        const cap = this.rules.block.heading.exec(src);
        if (cap) {
          let text = cap[2].trim();

          // remove trailing #s
          if (/#$/.test(text)) {
            const trimmed = rtrim(text, '#');
            if (this.options.pedantic) {
              text = trimmed.trim();
            } else if (!trimmed || / $/.test(trimmed)) {
              // CommonMark requires space before trailing #s
              text = trimmed.trim();
            }
          }

          const token = {
            type: 'heading',
            raw: cap[0],
            depth: cap[1].length,
            text: text,
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      hr(src) {
        const cap = this.rules.block.hr.exec(src);
        if (cap) {
          return {
            type: 'hr',
            raw: cap[0]
          };
        }
      }

      blockquote(src) {
        const cap = this.rules.block.blockquote.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ *> ?/gm, '');

          return {
            type: 'blockquote',
            raw: cap[0],
            tokens: this.lexer.blockTokens(text, []),
            text
          };
        }
      }

      list(src) {
        let cap = this.rules.block.list.exec(src);
        if (cap) {
          let raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine,
            line, nextLine, rawLine, itemContents, endEarly;

          let bull = cap[1].trim();
          const isordered = bull.length > 1;

          const list = {
            type: 'list',
            raw: '',
            ordered: isordered,
            start: isordered ? +bull.slice(0, -1) : '',
            loose: false,
            items: []
          };

          bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;

          if (this.options.pedantic) {
            bull = isordered ? bull : '[*+-]';
          }

          // Get next list item
          const itemRegex = new RegExp(`^( {0,3}${bull})((?: [^\\n]*)?(?:\\n|$))`);

          // Check if current bullet point can start a new List Item
          while (src) {
            endEarly = false;
            if (!(cap = itemRegex.exec(src))) {
              break;
            }

            if (this.rules.block.hr.test(src)) { // End list if bullet was actually HR (possibly move into itemRegex?)
              break;
            }

            raw = cap[0];
            src = src.substring(raw.length);

            line = cap[2].split('\n', 1)[0];
            nextLine = src.split('\n', 1)[0];

            if (this.options.pedantic) {
              indent = 2;
              itemContents = line.trimLeft();
            } else {
              indent = cap[2].search(/[^ ]/); // Find first non-space char
              indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
              itemContents = line.slice(indent);
              indent += cap[1].length;
            }

            blankLine = false;

            if (!line && /^ *$/.test(nextLine)) { // Items begin with at most one blank line
              raw += nextLine + '\n';
              src = src.substring(nextLine.length + 1);
              endEarly = true;
            }

            if (!endEarly) {
              const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])`);

              // Check if following lines should be included in List Item
              while (src) {
                rawLine = src.split('\n', 1)[0];
                line = rawLine;

                // Re-align to follow commonmark nesting rules
                if (this.options.pedantic) {
                  line = line.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ');
                }

                // End list item if found start of new bullet
                if (nextBulletRegex.test(line)) {
                  break;
                }

                if (line.search(/[^ ]/) >= indent || !line.trim()) { // Dedent if possible
                  itemContents += '\n' + line.slice(indent);
                } else if (!blankLine) { // Until blank line, item doesn't need indentation
                  itemContents += '\n' + line;
                } else { // Otherwise, improper indentation ends this item
                  break;
                }

                if (!blankLine && !line.trim()) { // Check if current line is blank
                  blankLine = true;
                }

                raw += rawLine + '\n';
                src = src.substring(rawLine.length + 1);
              }
            }

            if (!list.loose) {
              // If the previous item ended with a blank line, the list is loose
              if (endsWithBlankLine) {
                list.loose = true;
              } else if (/\n *\n *$/.test(raw)) {
                endsWithBlankLine = true;
              }
            }

            // Check for task list items
            if (this.options.gfm) {
              istask = /^\[[ xX]\] /.exec(itemContents);
              if (istask) {
                ischecked = istask[0] !== '[ ] ';
                itemContents = itemContents.replace(/^\[[ xX]\] +/, '');
              }
            }

            list.items.push({
              type: 'list_item',
              raw: raw,
              task: !!istask,
              checked: ischecked,
              loose: false,
              text: itemContents
            });

            list.raw += raw;
          }

          // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
          list.items[list.items.length - 1].raw = raw.trimRight();
          list.items[list.items.length - 1].text = itemContents.trimRight();
          list.raw = list.raw.trimRight();

          const l = list.items.length;

          // Item child tokens handled here at end because we needed to have the final item to trim it first
          for (i = 0; i < l; i++) {
            this.lexer.state.top = false;
            list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);
            if (!list.loose && list.items[i].tokens.some(t => t.type === 'space')) {
              list.loose = true;
              list.items[i].loose = true;
            }
          }

          return list;
        }
      }

      html(src) {
        const cap = this.rules.block.html.exec(src);
        if (cap) {
          const token = {
            type: 'html',
            raw: cap[0],
            pre: !this.options.sanitizer
              && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
            text: cap[0]
          };
          if (this.options.sanitize) {
            token.type = 'paragraph';
            token.text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
            token.tokens = [];
            this.lexer.inline(token.text, token.tokens);
          }
          return token;
        }
      }

      def(src) {
        const cap = this.rules.block.def.exec(src);
        if (cap) {
          if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
          const tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
          return {
            type: 'def',
            tag,
            raw: cap[0],
            href: cap[2],
            title: cap[3]
          };
        }
      }

      table(src) {
        const cap = this.rules.block.table.exec(src);
        if (cap) {
          const item = {
            type: 'table',
            header: splitCells(cap[1]).map(c => { return { text: c }; }),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            rows: cap[3] ? cap[3].replace(/\n[ \t]*$/, '').split('\n') : []
          };

          if (item.header.length === item.align.length) {
            item.raw = cap[0];

            let l = item.align.length;
            let i, j, k, row;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            l = item.rows.length;
            for (i = 0; i < l; i++) {
              item.rows[i] = splitCells(item.rows[i], item.header.length).map(c => { return { text: c }; });
            }

            // parse child tokens inside headers and cells

            // header child tokens
            l = item.header.length;
            for (j = 0; j < l; j++) {
              item.header[j].tokens = [];
              this.lexer.inlineTokens(item.header[j].text, item.header[j].tokens);
            }

            // cell child tokens
            l = item.rows.length;
            for (j = 0; j < l; j++) {
              row = item.rows[j];
              for (k = 0; k < row.length; k++) {
                row[k].tokens = [];
                this.lexer.inlineTokens(row[k].text, row[k].tokens);
              }
            }

            return item;
          }
        }
      }

      lheading(src) {
        const cap = this.rules.block.lheading.exec(src);
        if (cap) {
          const token = {
            type: 'heading',
            raw: cap[0],
            depth: cap[2].charAt(0) === '=' ? 1 : 2,
            text: cap[1],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      paragraph(src) {
        const cap = this.rules.block.paragraph.exec(src);
        if (cap) {
          const token = {
            type: 'paragraph',
            raw: cap[0],
            text: cap[1].charAt(cap[1].length - 1) === '\n'
              ? cap[1].slice(0, -1)
              : cap[1],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      text(src) {
        const cap = this.rules.block.text.exec(src);
        if (cap) {
          const token = {
            type: 'text',
            raw: cap[0],
            text: cap[0],
            tokens: []
          };
          this.lexer.inline(token.text, token.tokens);
          return token;
        }
      }

      escape(src) {
        const cap = this.rules.inline.escape.exec(src);
        if (cap) {
          return {
            type: 'escape',
            raw: cap[0],
            text: escape(cap[1])
          };
        }
      }

      tag(src) {
        const cap = this.rules.inline.tag.exec(src);
        if (cap) {
          if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
            this.lexer.state.inLink = true;
          } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
            this.lexer.state.inLink = false;
          }
          if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.lexer.state.inRawBlock = true;
          } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.lexer.state.inRawBlock = false;
          }

          return {
            type: this.options.sanitize
              ? 'text'
              : 'html',
            raw: cap[0],
            inLink: this.lexer.state.inLink,
            inRawBlock: this.lexer.state.inRawBlock,
            text: this.options.sanitize
              ? (this.options.sanitizer
                ? this.options.sanitizer(cap[0])
                : escape(cap[0]))
              : cap[0]
          };
        }
      }

      link(src) {
        const cap = this.rules.inline.link.exec(src);
        if (cap) {
          const trimmedUrl = cap[2].trim();
          if (!this.options.pedantic && /^</.test(trimmedUrl)) {
            // commonmark requires matching angle brackets
            if (!(/>$/.test(trimmedUrl))) {
              return;
            }

            // ending angle bracket cannot be escaped
            const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
            if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
              return;
            }
          } else {
            // find closing parenthesis
            const lastParenIndex = findClosingBracket(cap[2], '()');
            if (lastParenIndex > -1) {
              const start = cap[0].indexOf('!') === 0 ? 5 : 4;
              const linkLen = start + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = '';
            }
          }
          let href = cap[2];
          let title = '';
          if (this.options.pedantic) {
            // split pedantic href and title
            const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

            if (link) {
              href = link[1];
              title = link[3];
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : '';
          }

          href = href.trim();
          if (/^</.test(href)) {
            if (this.options.pedantic && !(/>$/.test(trimmedUrl))) {
              // pedantic allows starting angle bracket without ending angle bracket
              href = href.slice(1);
            } else {
              href = href.slice(1, -1);
            }
          }
          return outputLink(cap, {
            href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
            title: title ? title.replace(this.rules.inline._escapes, '$1') : title
          }, cap[0], this.lexer);
        }
      }

      reflink(src, links) {
        let cap;
        if ((cap = this.rules.inline.reflink.exec(src))
            || (cap = this.rules.inline.nolink.exec(src))) {
          let link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
          link = links[link.toLowerCase()];
          if (!link || !link.href) {
            const text = cap[0].charAt(0);
            return {
              type: 'text',
              raw: text,
              text
            };
          }
          return outputLink(cap, link, cap[0], this.lexer);
        }
      }

      emStrong(src, maskedSrc, prevChar = '') {
        let match = this.rules.inline.emStrong.lDelim.exec(src);
        if (!match) return;

        // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
        if (match[3] && prevChar.match(/[\p{L}\p{N}]/u)) return;

        const nextChar = match[1] || match[2] || '';

        if (!nextChar || (nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))) {
          const lLength = match[0].length - 1;
          let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;

          const endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
          endReg.lastIndex = 0;

          // Clip maskedSrc to same section of string as src (move to lexer?)
          maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

          while ((match = endReg.exec(maskedSrc)) != null) {
            rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];

            if (!rDelim) continue; // skip single * in __abc*abc__

            rLength = rDelim.length;

            if (match[3] || match[4]) { // found another Left Delim
              delimTotal += rLength;
              continue;
            } else if (match[5] || match[6]) { // either Left or Right Delim
              if (lLength % 3 && !((lLength + rLength) % 3)) {
                midDelimTotal += rLength;
                continue; // CommonMark Emphasis Rules 9-10
              }
            }

            delimTotal -= rLength;

            if (delimTotal > 0) continue; // Haven't found enough closing delimiters

            // Remove extra characters. *a*** -> *a*
            rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);

            // Create `em` if smallest delimiter has odd char count. *a***
            if (Math.min(lLength, rLength) % 2) {
              const text = src.slice(1, lLength + match.index + rLength);
              return {
                type: 'em',
                raw: src.slice(0, lLength + match.index + rLength + 1),
                text,
                tokens: this.lexer.inlineTokens(text, [])
              };
            }

            // Create 'strong' if smallest delimiter has even char count. **a***
            const text = src.slice(2, lLength + match.index + rLength - 1);
            return {
              type: 'strong',
              raw: src.slice(0, lLength + match.index + rLength + 1),
              text,
              tokens: this.lexer.inlineTokens(text, [])
            };
          }
        }
      }

      codespan(src) {
        const cap = this.rules.inline.code.exec(src);
        if (cap) {
          let text = cap[2].replace(/\n/g, ' ');
          const hasNonSpaceChars = /[^ ]/.test(text);
          const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
          if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
            text = text.substring(1, text.length - 1);
          }
          text = escape(text, true);
          return {
            type: 'codespan',
            raw: cap[0],
            text
          };
        }
      }

      br(src) {
        const cap = this.rules.inline.br.exec(src);
        if (cap) {
          return {
            type: 'br',
            raw: cap[0]
          };
        }
      }

      del(src) {
        const cap = this.rules.inline.del.exec(src);
        if (cap) {
          return {
            type: 'del',
            raw: cap[0],
            text: cap[2],
            tokens: this.lexer.inlineTokens(cap[2], [])
          };
        }
      }

      autolink(src, mangle) {
        const cap = this.rules.inline.autolink.exec(src);
        if (cap) {
          let text, href;
          if (cap[2] === '@') {
            text = escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
            href = 'mailto:' + text;
          } else {
            text = escape(cap[1]);
            href = text;
          }

          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      url(src, mangle) {
        let cap;
        if (cap = this.rules.inline.url.exec(src)) {
          let text, href;
          if (cap[2] === '@') {
            text = escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
            href = 'mailto:' + text;
          } else {
            // do extended autolink path validation
            let prevCapZero;
            do {
              prevCapZero = cap[0];
              cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);
            text = escape(cap[0]);
            if (cap[1] === 'www.') {
              href = 'http://' + text;
            } else {
              href = text;
            }
          }
          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      inlineText(src, smartypants) {
        const cap = this.rules.inline.text.exec(src);
        if (cap) {
          let text;
          if (this.lexer.state.inRawBlock) {
            text = this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0];
          } else {
            text = escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
          }
          return {
            type: 'text',
            raw: cap[0],
            text
          };
        }
      }
    }

    /**
     * Block-Level Grammar
     */
    const block = {
      newline: /^(?: *(?:\n|$))+/,
      code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
      hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3}bull)( [^\n]+?)?(?:\n|$)/,
      html: '^ {0,3}(?:' // optional indentation
        + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
        + '|comment[^\\n]*(\\n+|$)' // (2)
        + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
        + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
        + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
        + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (6)
        + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) open tag
        + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) closing tag
        + ')',
      def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
      table: noopTest,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      // regex template, placeholders will be replaced according to different paragraph
      // interruption rules of commonmark and the original markdown spec:
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
      text: /^[^\n]+/
    };

    block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
    block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
    block.def = edit(block.def)
      .replace('label', block._label)
      .replace('title', block._title)
      .getRegex();

    block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
    block.listItemStart = edit(/^( *)(bull) */)
      .replace('bull', block.bullet)
      .getRegex();

    block.list = edit(block.list)
      .replace(/bull/g, block.bullet)
      .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
      .replace('def', '\\n+(?=' + block.def.source + ')')
      .getRegex();

    block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
      + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
      + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
      + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
      + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
      + '|track|ul';
    block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
    block.html = edit(block.html, 'i')
      .replace('comment', block._comment)
      .replace('tag', block._tag)
      .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
      .getRegex();

    block.paragraph = edit(block._paragraph)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('|table', '')
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();

    block.blockquote = edit(block.blockquote)
      .replace('paragraph', block.paragraph)
      .getRegex();

    /**
     * Normal Block Grammar
     */

    block.normal = merge({}, block);

    /**
     * GFM Block Grammar
     */

    block.gfm = merge({}, block.normal, {
      table: '^ *([^\\n ].*\\|.*)\\n' // Header
        + ' {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?' // Align
        + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells
    });

    block.gfm.table = edit(block.gfm.table)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('blockquote', ' {0,3}>')
      .replace('code', ' {4}[^\\n]')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();

    block.gfm.paragraph = edit(block._paragraph)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('table', block.gfm.table) // interrupt paragraphs with table
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();
    /**
     * Pedantic grammar (original John Gruber's loose markdown specification)
     */

    block.pedantic = merge({}, block.normal, {
      html: edit(
        '^ *(?:comment *(?:\\n|\\s*$)'
        + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
        + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
        .replace('comment', block._comment)
        .replace(/tag/g, '(?!(?:'
          + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
          + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
          + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
        .getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: noopTest, // fences not supported
      paragraph: edit(block.normal._paragraph)
        .replace('hr', block.hr)
        .replace('heading', ' *#{1,6} *[^\n]')
        .replace('lheading', block.lheading)
        .replace('blockquote', ' {0,3}>')
        .replace('|fences', '')
        .replace('|list', '')
        .replace('|html', '')
        .getRegex()
    });

    /**
     * Inline-Level Grammar
     */
    const inline = {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: noopTest,
      tag: '^comment'
        + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
        + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
        + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
        + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
        + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
      nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
      reflinkSearch: 'reflink|nolink(?!\\()',
      emStrong: {
        lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
        //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
        //        () Skip orphan delim inside strong    (1) #***                (2) a***#, a***                   (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
        rDelimAst: /^[^_*]*?\_\_[^_*]*?\*[^_*]*?(?=\_\_)|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
        rDelimUnd: /^[^_*]*?\*\*[^_*]*?\_[^_*]*?(?=\*\*)|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _
      },
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: noopTest,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
      punctuation: /^([\spunctuation])/
    };

    // list of punctuation marks from CommonMark spec
    // without * and _ to handle the different emphasis markers * and _
    inline._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
    inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();

    // sequences em should skip over [title](link), `code`, <html>
    inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
    inline.escapedEmSt = /\\\*|\\_/g;

    inline._comment = edit(block._comment).replace('(?:-->|$)', '-->').getRegex();

    inline.emStrong.lDelim = edit(inline.emStrong.lDelim)
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

    inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
    inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
    inline.autolink = edit(inline.autolink)
      .replace('scheme', inline._scheme)
      .replace('email', inline._email)
      .getRegex();

    inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

    inline.tag = edit(inline.tag)
      .replace('comment', inline._comment)
      .replace('attribute', inline._attribute)
      .getRegex();

    inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
    inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

    inline.link = edit(inline.link)
      .replace('label', inline._label)
      .replace('href', inline._href)
      .replace('title', inline._title)
      .getRegex();

    inline.reflink = edit(inline.reflink)
      .replace('label', inline._label)
      .getRegex();

    inline.reflinkSearch = edit(inline.reflinkSearch, 'g')
      .replace('reflink', inline.reflink)
      .replace('nolink', inline.nolink)
      .getRegex();

    /**
     * Normal Inline Grammar
     */

    inline.normal = merge({}, inline);

    /**
     * Pedantic Inline Grammar
     */

    inline.pedantic = merge({}, inline.normal, {
      strong: {
        start: /^__|\*\*/,
        middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        endAst: /\*\*(?!\*)/g,
        endUnd: /__(?!_)/g
      },
      em: {
        start: /^_|\*/,
        middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
        endAst: /\*(?!\*)/g,
        endUnd: /_(?!_)/g
      },
      link: edit(/^!?\[(label)\]\((.*?)\)/)
        .replace('label', inline._label)
        .getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace('label', inline._label)
        .getRegex()
    });

    /**
     * GFM Inline Grammar
     */

    inline.gfm = merge({}, inline.normal, {
      escape: edit(inline.escape).replace('])', '~|])').getRegex(),
      _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
      url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
      _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
    });

    inline.gfm.url = edit(inline.gfm.url, 'i')
      .replace('email', inline.gfm._extended_email)
      .getRegex();
    /**
     * GFM + Line Breaks Inline Grammar
     */

    inline.breaks = merge({}, inline.gfm, {
      br: edit(inline.br).replace('{2,}', '*').getRegex(),
      text: edit(inline.gfm.text)
        .replace('\\b_', '\\b_| {2,}\\n')
        .replace(/\{2,\}/g, '*')
        .getRegex()
    });

    /**
     * smartypants text replacement
     */
    function smartypants(text) {
      return text
        // em-dashes
        .replace(/---/g, '\u2014')
        // en-dashes
        .replace(/--/g, '\u2013')
        // opening singles
        .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
        // closing singles & apostrophes
        .replace(/'/g, '\u2019')
        // opening doubles
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
        // closing doubles
        .replace(/"/g, '\u201d')
        // ellipses
        .replace(/\.{3}/g, '\u2026');
    }

    /**
     * mangle email addresses
     */
    function mangle(text) {
      let out = '',
        i,
        ch;

      const l = text.length;
      for (i = 0; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
          ch = 'x' + ch.toString(16);
        }
        out += '&#' + ch + ';';
      }

      return out;
    }

    /**
     * Block Lexer
     */
    class Lexer {
      constructor(options) {
        this.tokens = [];
        this.tokens.links = Object.create(null);
        this.options = options || defaults$1;
        this.options.tokenizer = this.options.tokenizer || new Tokenizer();
        this.tokenizer = this.options.tokenizer;
        this.tokenizer.options = this.options;
        this.tokenizer.lexer = this;
        this.inlineQueue = [];
        this.state = {
          inLink: false,
          inRawBlock: false,
          top: true
        };

        const rules = {
          block: block.normal,
          inline: inline.normal
        };

        if (this.options.pedantic) {
          rules.block = block.pedantic;
          rules.inline = inline.pedantic;
        } else if (this.options.gfm) {
          rules.block = block.gfm;
          if (this.options.breaks) {
            rules.inline = inline.breaks;
          } else {
            rules.inline = inline.gfm;
          }
        }
        this.tokenizer.rules = rules;
      }

      /**
       * Expose Rules
       */
      static get rules() {
        return {
          block,
          inline
        };
      }

      /**
       * Static Lex Method
       */
      static lex(src, options) {
        const lexer = new Lexer(options);
        return lexer.lex(src);
      }

      /**
       * Static Lex Inline Method
       */
      static lexInline(src, options) {
        const lexer = new Lexer(options);
        return lexer.inlineTokens(src);
      }

      /**
       * Preprocessing
       */
      lex(src) {
        src = src
          .replace(/\r\n|\r/g, '\n')
          .replace(/\t/g, '    ');

        this.blockTokens(src, this.tokens);

        let next;
        while (next = this.inlineQueue.shift()) {
          this.inlineTokens(next.src, next.tokens);
        }

        return this.tokens;
      }

      /**
       * Lexing
       */
      blockTokens(src, tokens = []) {
        if (this.options.pedantic) {
          src = src.replace(/^ +$/gm, '');
        }
        let token, lastToken, cutSrc, lastParagraphClipped;

        while (src) {
          if (this.options.extensions
            && this.options.extensions.block
            && this.options.extensions.block.some((extTokenizer) => {
              if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // newline
          if (token = this.tokenizer.space(src)) {
            src = src.substring(token.raw.length);
            if (token.type) {
              tokens.push(token);
            }
            continue;
          }

          // code
          if (token = this.tokenizer.code(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            // An indented code block cannot interrupt a paragraph.
            if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // fences
          if (token = this.tokenizer.fences(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // heading
          if (token = this.tokenizer.heading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // hr
          if (token = this.tokenizer.hr(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // blockquote
          if (token = this.tokenizer.blockquote(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // list
          if (token = this.tokenizer.list(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // html
          if (token = this.tokenizer.html(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // def
          if (token = this.tokenizer.def(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.raw;
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else if (!this.tokens.links[token.tag]) {
              this.tokens.links[token.tag] = {
                href: token.href,
                title: token.title
              };
            }
            continue;
          }

          // table (gfm)
          if (token = this.tokenizer.table(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // lheading
          if (token = this.tokenizer.lheading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // top-level paragraph
          // prevent paragraph consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startBlock) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startBlock.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
            lastToken = tokens[tokens.length - 1];
            if (lastParagraphClipped && lastToken.type === 'paragraph') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            lastParagraphClipped = (cutSrc.length !== src.length);
            src = src.substring(token.raw.length);
            continue;
          }

          // text
          if (token = this.tokenizer.text(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        this.state.top = true;
        return tokens;
      }

      inline(src, tokens) {
        this.inlineQueue.push({ src, tokens });
      }

      /**
       * Lexing/Compiling
       */
      inlineTokens(src, tokens = []) {
        let token, lastToken, cutSrc;

        // String with links masked to avoid interference with em and strong
        let maskedSrc = src;
        let match;
        let keepPrevChar, prevChar;

        // Mask out reflinks
        if (this.tokens.links) {
          const links = Object.keys(this.tokens.links);
          if (links.length > 0) {
            while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
              if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
              }
            }
          }
        }
        // Mask out other blocks
        while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }

        // Mask out escaped em & strong delimiters
        while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
        }

        while (src) {
          if (!keepPrevChar) {
            prevChar = '';
          }
          keepPrevChar = false;

          // extensions
          if (this.options.extensions
            && this.options.extensions.inline
            && this.options.extensions.inline.some((extTokenizer) => {
              if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // escape
          if (token = this.tokenizer.escape(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // tag
          if (token = this.tokenizer.tag(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // link
          if (token = this.tokenizer.link(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // reflink, nolink
          if (token = this.tokenizer.reflink(src, this.tokens.links)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // em & strong
          if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // code
          if (token = this.tokenizer.codespan(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // br
          if (token = this.tokenizer.br(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // del (gfm)
          if (token = this.tokenizer.del(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // autolink
          if (token = this.tokenizer.autolink(src, mangle)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // url (gfm)
          if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // text
          // prevent inlineText consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startInline) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startInline.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
            src = src.substring(token.raw.length);
            if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
              prevChar = token.raw.slice(-1);
            }
            keepPrevChar = true;
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        return tokens;
      }
    }

    /**
     * Renderer
     */
    class Renderer {
      constructor(options) {
        this.options = options || defaults$1;
      }

      code(code, infostring, escaped) {
        const lang = (infostring || '').match(/\S*/)[0];
        if (this.options.highlight) {
          const out = this.options.highlight(code, lang);
          if (out != null && out !== code) {
            escaped = true;
            code = out;
          }
        }

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
          return '<pre><code>'
            + (escaped ? code : escape(code, true))
            + '</code></pre>\n';
        }

        return '<pre><code class="'
          + this.options.langPrefix
          + escape(lang, true)
          + '">'
          + (escaped ? code : escape(code, true))
          + '</code></pre>\n';
      }

      blockquote(quote) {
        return '<blockquote>\n' + quote + '</blockquote>\n';
      }

      html(html) {
        return html;
      }

      heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          return '<h'
            + level
            + ' id="'
            + this.options.headerPrefix
            + slugger.slug(raw)
            + '">'
            + text
            + '</h'
            + level
            + '>\n';
        }
        // ignore IDs
        return '<h' + level + '>' + text + '</h' + level + '>\n';
      }

      hr() {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
      }

      list(body, ordered, start) {
        const type = ordered ? 'ol' : 'ul',
          startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
      }

      listitem(text) {
        return '<li>' + text + '</li>\n';
      }

      checkbox(checked) {
        return '<input '
          + (checked ? 'checked="" ' : '')
          + 'disabled="" type="checkbox"'
          + (this.options.xhtml ? ' /' : '')
          + '> ';
      }

      paragraph(text) {
        return '<p>' + text + '</p>\n';
      }

      table(header, body) {
        if (body) body = '<tbody>' + body + '</tbody>';

        return '<table>\n'
          + '<thead>\n'
          + header
          + '</thead>\n'
          + body
          + '</table>\n';
      }

      tablerow(content) {
        return '<tr>\n' + content + '</tr>\n';
      }

      tablecell(content, flags) {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
          ? '<' + type + ' align="' + flags.align + '">'
          : '<' + type + '>';
        return tag + content + '</' + type + '>\n';
      }

      // span level renderer
      strong(text) {
        return '<strong>' + text + '</strong>';
      }

      em(text) {
        return '<em>' + text + '</em>';
      }

      codespan(text) {
        return '<code>' + text + '</code>';
      }

      br() {
        return this.options.xhtml ? '<br/>' : '<br>';
      }

      del(text) {
        return '<del>' + text + '</del>';
      }

      link(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        let out = '<a href="' + escape(href) + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
      }

      image(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }

        let out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
      }

      text(text) {
        return text;
      }
    }

    /**
     * TextRenderer
     * returns only the textual part of the token
     */
    class TextRenderer {
      // no need for block level renderers
      strong(text) {
        return text;
      }

      em(text) {
        return text;
      }

      codespan(text) {
        return text;
      }

      del(text) {
        return text;
      }

      html(text) {
        return text;
      }

      text(text) {
        return text;
      }

      link(href, title, text) {
        return '' + text;
      }

      image(href, title, text) {
        return '' + text;
      }

      br() {
        return '';
      }
    }

    /**
     * Slugger generates header id
     */
    class Slugger {
      constructor() {
        this.seen = {};
      }

      serialize(value) {
        return value
          .toLowerCase()
          .trim()
          // remove html tags
          .replace(/<[!\/a-z].*?>/ig, '')
          // remove unwanted chars
          .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
          .replace(/\s/g, '-');
      }

      /**
       * Finds the next safe (unique) slug to use
       */
      getNextSafeSlug(originalSlug, isDryRun) {
        let slug = originalSlug;
        let occurenceAccumulator = 0;
        if (this.seen.hasOwnProperty(slug)) {
          occurenceAccumulator = this.seen[originalSlug];
          do {
            occurenceAccumulator++;
            slug = originalSlug + '-' + occurenceAccumulator;
          } while (this.seen.hasOwnProperty(slug));
        }
        if (!isDryRun) {
          this.seen[originalSlug] = occurenceAccumulator;
          this.seen[slug] = 0;
        }
        return slug;
      }

      /**
       * Convert string to unique id
       * @param {object} options
       * @param {boolean} options.dryrun Generates the next unique slug without updating the internal accumulator.
       */
      slug(value, options = {}) {
        const slug = this.serialize(value);
        return this.getNextSafeSlug(slug, options.dryrun);
      }
    }

    /**
     * Parsing & Compiling
     */
    class Parser {
      constructor(options) {
        this.options = options || defaults$1;
        this.options.renderer = this.options.renderer || new Renderer();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
        this.textRenderer = new TextRenderer();
        this.slugger = new Slugger();
      }

      /**
       * Static Parse Method
       */
      static parse(tokens, options) {
        const parser = new Parser(options);
        return parser.parse(tokens);
      }

      /**
       * Static Parse Inline Method
       */
      static parseInline(tokens, options) {
        const parser = new Parser(options);
        return parser.parseInline(tokens);
      }

      /**
       * Parse Loop
       */
      parse(tokens, top = true) {
        let out = '',
          i,
          j,
          k,
          l2,
          l3,
          row,
          cell,
          header,
          body,
          token,
          ordered,
          start,
          loose,
          itemBody,
          item,
          checked,
          task,
          checkbox,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
            if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'space': {
              continue;
            }
            case 'hr': {
              out += this.renderer.hr();
              continue;
            }
            case 'heading': {
              out += this.renderer.heading(
                this.parseInline(token.tokens),
                token.depth,
                unescape$1(this.parseInline(token.tokens, this.textRenderer)),
                this.slugger);
              continue;
            }
            case 'code': {
              out += this.renderer.code(token.text,
                token.lang,
                token.escaped);
              continue;
            }
            case 'table': {
              header = '';

              // header
              cell = '';
              l2 = token.header.length;
              for (j = 0; j < l2; j++) {
                cell += this.renderer.tablecell(
                  this.parseInline(token.header[j].tokens),
                  { header: true, align: token.align[j] }
                );
              }
              header += this.renderer.tablerow(cell);

              body = '';
              l2 = token.rows.length;
              for (j = 0; j < l2; j++) {
                row = token.rows[j];

                cell = '';
                l3 = row.length;
                for (k = 0; k < l3; k++) {
                  cell += this.renderer.tablecell(
                    this.parseInline(row[k].tokens),
                    { header: false, align: token.align[k] }
                  );
                }

                body += this.renderer.tablerow(cell);
              }
              out += this.renderer.table(header, body);
              continue;
            }
            case 'blockquote': {
              body = this.parse(token.tokens);
              out += this.renderer.blockquote(body);
              continue;
            }
            case 'list': {
              ordered = token.ordered;
              start = token.start;
              loose = token.loose;
              l2 = token.items.length;

              body = '';
              for (j = 0; j < l2; j++) {
                item = token.items[j];
                checked = item.checked;
                task = item.task;

                itemBody = '';
                if (item.task) {
                  checkbox = this.renderer.checkbox(checked);
                  if (loose) {
                    if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
                      item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                      if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                        item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                      }
                    } else {
                      item.tokens.unshift({
                        type: 'text',
                        text: checkbox
                      });
                    }
                  } else {
                    itemBody += checkbox;
                  }
                }

                itemBody += this.parse(item.tokens, loose);
                body += this.renderer.listitem(itemBody, task, checked);
              }

              out += this.renderer.list(body, ordered, start);
              continue;
            }
            case 'html': {
              // TODO parse inline content if parameter markdown=1
              out += this.renderer.html(token.text);
              continue;
            }
            case 'paragraph': {
              out += this.renderer.paragraph(this.parseInline(token.tokens));
              continue;
            }
            case 'text': {
              body = token.tokens ? this.parseInline(token.tokens) : token.text;
              while (i + 1 < l && tokens[i + 1].type === 'text') {
                token = tokens[++i];
                body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
              }
              out += top ? this.renderer.paragraph(body) : body;
              continue;
            }

            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }

        return out;
      }

      /**
       * Parse Inline Tokens
       */
      parseInline(tokens, renderer) {
        renderer = renderer || this.renderer;
        let out = '',
          i,
          token,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
            if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'escape': {
              out += renderer.text(token.text);
              break;
            }
            case 'html': {
              out += renderer.html(token.text);
              break;
            }
            case 'link': {
              out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
              break;
            }
            case 'image': {
              out += renderer.image(token.href, token.title, token.text);
              break;
            }
            case 'strong': {
              out += renderer.strong(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'em': {
              out += renderer.em(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'codespan': {
              out += renderer.codespan(token.text);
              break;
            }
            case 'br': {
              out += renderer.br();
              break;
            }
            case 'del': {
              out += renderer.del(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'text': {
              out += renderer.text(token.text);
              break;
            }
            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      }
    }
    Parser.parse;
    Lexer.lex;

    const key = {};

    /* node_modules/svelte-markdown/src/renderers/Heading.svelte generated by Svelte v3.44.3 */
    const file$m = "node_modules/svelte-markdown/src/renderers/Heading.svelte";

    // (28:0) {:else}
    function create_else_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*raw*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*raw*/ 2) set_data_dev(t, /*raw*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(28:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:22) 
    function create_if_block_5(ctx) {
    	let h6;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			if (default_slot) default_slot.c();
    			attr_dev(h6, "id", /*id*/ ctx[2]);
    			add_location(h6, file$m, 26, 2, 596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);

    			if (default_slot) {
    				default_slot.m(h6, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h6, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(26:22) ",
    		ctx
    	});

    	return block;
    }

    // (24:22) 
    function create_if_block_4$1(ctx) {
    	let h5;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			if (default_slot) default_slot.c();
    			attr_dev(h5, "id", /*id*/ ctx[2]);
    			add_location(h5, file$m, 24, 2, 543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);

    			if (default_slot) {
    				default_slot.m(h5, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h5, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(24:22) ",
    		ctx
    	});

    	return block;
    }

    // (22:22) 
    function create_if_block_3$2(ctx) {
    	let h4;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			if (default_slot) default_slot.c();
    			attr_dev(h4, "id", /*id*/ ctx[2]);
    			add_location(h4, file$m, 22, 2, 490);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);

    			if (default_slot) {
    				default_slot.m(h4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h4, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(22:22) ",
    		ctx
    	});

    	return block;
    }

    // (20:22) 
    function create_if_block_2$2(ctx) {
    	let h3;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			if (default_slot) default_slot.c();
    			attr_dev(h3, "id", /*id*/ ctx[2]);
    			add_location(h3, file$m, 20, 2, 437);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);

    			if (default_slot) {
    				default_slot.m(h3, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h3, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(20:22) ",
    		ctx
    	});

    	return block;
    }

    // (18:22) 
    function create_if_block_1$3(ctx) {
    	let h2;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			if (default_slot) default_slot.c();
    			attr_dev(h2, "id", /*id*/ ctx[2]);
    			add_location(h2, file$m, 18, 2, 384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);

    			if (default_slot) {
    				default_slot.m(h2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h2, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(18:22) ",
    		ctx
    	});

    	return block;
    }

    // (16:0) {#if depth === 1}
    function create_if_block$8(ctx) {
    	let h1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			if (default_slot) default_slot.c();
    			attr_dev(h1, "id", /*id*/ ctx[2]);
    			add_location(h1, file$m, 16, 2, 331);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);

    			if (default_slot) {
    				default_slot.m(h1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 4) {
    				attr_dev(h1, "id", /*id*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(16:0) {#if depth === 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block$8,
    		create_if_block_1$3,
    		create_if_block_2$2,
    		create_if_block_3$2,
    		create_if_block_4$1,
    		create_if_block_5,
    		create_else_block$5
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*depth*/ ctx[0] === 1) return 0;
    		if (/*depth*/ ctx[0] === 2) return 1;
    		if (/*depth*/ ctx[0] === 3) return 2;
    		if (/*depth*/ ctx[0] === 4) return 3;
    		if (/*depth*/ ctx[0] === 5) return 4;
    		if (/*depth*/ ctx[0] === 6) return 5;
    		return 6;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let id;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Heading', slots, ['default']);
    	let { depth } = $$props;
    	let { raw } = $$props;
    	let { text } = $$props;
    	const { slug, getOptions } = getContext(key);
    	const options = getOptions();
    	const writable_props = ['depth', 'raw', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Heading> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('depth' in $$props) $$invalidate(0, depth = $$props.depth);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		key,
    		depth,
    		raw,
    		text,
    		slug,
    		getOptions,
    		options,
    		id
    	});

    	$$self.$inject_state = $$props => {
    		if ('depth' in $$props) $$invalidate(0, depth = $$props.depth);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*text*/ 8) {
    			$$invalidate(2, id = options.headerIds
    			? options.headerPrefix + slug(text)
    			: undefined);
    		}
    	};

    	return [depth, raw, id, text, $$scope, slots];
    }

    class Heading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { depth: 0, raw: 1, text: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Heading",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*depth*/ ctx[0] === undefined && !('depth' in props)) {
    			console.warn("<Heading> was created without expected prop 'depth'");
    		}

    		if (/*raw*/ ctx[1] === undefined && !('raw' in props)) {
    			console.warn("<Heading> was created without expected prop 'raw'");
    		}

    		if (/*text*/ ctx[3] === undefined && !('text' in props)) {
    			console.warn("<Heading> was created without expected prop 'text'");
    		}
    	}

    	get depth() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set depth(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get raw() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set raw(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Paragraph.svelte generated by Svelte v3.44.3 */

    const file$l = "node_modules/svelte-markdown/src/renderers/Paragraph.svelte";

    function create_fragment$r(ctx) {
    	let p;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			p = element("p");
    			if (default_slot) default_slot.c();
    			add_location(p, file$l, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Paragraph', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Paragraph> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Paragraph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paragraph",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Text.svelte generated by Svelte v3.44.3 */

    function create_fragment$q(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text', slots, ['default']);
    	let { text } = $$props;
    	let { raw } = $$props;
    	const writable_props = ['text', 'raw'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ text, raw });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('raw' in $$props) $$invalidate(1, raw = $$props.raw);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, raw, $$scope, slots];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { text: 0, raw: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Text> was created without expected prop 'text'");
    		}

    		if (/*raw*/ ctx[1] === undefined && !('raw' in props)) {
    			console.warn("<Text> was created without expected prop 'raw'");
    		}
    	}

    	get text() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get raw() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set raw(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Image.svelte generated by Svelte v3.44.3 */

    const file$k = "node_modules/svelte-markdown/src/renderers/Image.svelte";

    function create_fragment$p(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*href*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "title", /*title*/ ctx[1]);
    			attr_dev(img, "alt", /*text*/ ctx[2]);
    			add_location(img, file$k, 6, 0, 97);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*href*/ 1 && !src_url_equal(img.src, img_src_value = /*href*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*title*/ 2) {
    				attr_dev(img, "title", /*title*/ ctx[1]);
    			}

    			if (dirty & /*text*/ 4) {
    				attr_dev(img, "alt", /*text*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	let { href = '' } = $$props;
    	let { title = undefined } = $$props;
    	let { text = '' } = $$props;
    	const writable_props = ['href', 'title', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ href, title, text });

    	$$self.$inject_state = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('text' in $$props) $$invalidate(2, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [href, title, text];
    }

    class Image extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { href: 0, title: 1, text: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get href() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Link.svelte generated by Svelte v3.44.3 */

    const file$j = "node_modules/svelte-markdown/src/renderers/Link.svelte";

    function create_fragment$o(ctx) {
    	let a;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*href*/ ctx[0]);
    			attr_dev(a, "title", /*title*/ ctx[1]);
    			add_location(a, file$j, 5, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*href*/ 1) {
    				attr_dev(a, "href", /*href*/ ctx[0]);
    			}

    			if (!current || dirty & /*title*/ 2) {
    				attr_dev(a, "title", /*title*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { href = '' } = $$props;
    	let { title = undefined } = $$props;
    	const writable_props = ['href', 'title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ href, title });

    	$$self.$inject_state = $$props => {
    		if ('href' in $$props) $$invalidate(0, href = $$props.href);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [href, title, $$scope, slots];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { href: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get href() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Em.svelte generated by Svelte v3.44.3 */

    const file$i = "node_modules/svelte-markdown/src/renderers/Em.svelte";

    function create_fragment$n(ctx) {
    	let em;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			em = element("em");
    			if (default_slot) default_slot.c();
    			add_location(em, file$i, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, em, anchor);

    			if (default_slot) {
    				default_slot.m(em, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(em);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Em', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Em> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Em extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Em",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Del.svelte generated by Svelte v3.44.3 */

    const file$h = "node_modules/svelte-markdown/src/renderers/Del.svelte";

    function create_fragment$m(ctx) {
    	let del;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			del = element("del");
    			if (default_slot) default_slot.c();
    			add_location(del, file$h, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, del, anchor);

    			if (default_slot) {
    				default_slot.m(del, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(del);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Del', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Del> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Del extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Del",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Codespan.svelte generated by Svelte v3.44.3 */

    const file$g = "node_modules/svelte-markdown/src/renderers/Codespan.svelte";

    function create_fragment$l(ctx) {
    	let code;
    	let t_value = /*raw*/ ctx[0].replace(/`/g, '') + "";
    	let t;

    	const block = {
    		c: function create() {
    			code = element("code");
    			t = text(t_value);
    			add_location(code, file$g, 4, 0, 37);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, code, anchor);
    			append_dev(code, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*raw*/ 1 && t_value !== (t_value = /*raw*/ ctx[0].replace(/`/g, '') + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(code);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Codespan', slots, []);
    	let { raw } = $$props;
    	const writable_props = ['raw'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Codespan> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('raw' in $$props) $$invalidate(0, raw = $$props.raw);
    	};

    	$$self.$capture_state = () => ({ raw });

    	$$self.$inject_state = $$props => {
    		if ('raw' in $$props) $$invalidate(0, raw = $$props.raw);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [raw];
    }

    class Codespan extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { raw: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Codespan",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*raw*/ ctx[0] === undefined && !('raw' in props)) {
    			console.warn("<Codespan> was created without expected prop 'raw'");
    		}
    	}

    	get raw() {
    		throw new Error("<Codespan>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set raw(value) {
    		throw new Error("<Codespan>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Strong.svelte generated by Svelte v3.44.3 */

    const file$f = "node_modules/svelte-markdown/src/renderers/Strong.svelte";

    function create_fragment$k(ctx) {
    	let strong;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			if (default_slot) default_slot.c();
    			add_location(strong, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, strong, anchor);

    			if (default_slot) {
    				default_slot.m(strong, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(strong);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Strong', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Strong> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Strong extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Strong",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Table.svelte generated by Svelte v3.44.3 */

    const file$e = "node_modules/svelte-markdown/src/renderers/Table.svelte";

    function create_fragment$j(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			add_location(table, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/TableHead.svelte generated by Svelte v3.44.3 */

    const file$d = "node_modules/svelte-markdown/src/renderers/TableHead.svelte";

    function create_fragment$i(ctx) {
    	let thead;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			if (default_slot) default_slot.c();
    			add_location(thead, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);

    			if (default_slot) {
    				default_slot.m(thead, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableHead', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableHead> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TableHead extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHead",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/TableBody.svelte generated by Svelte v3.44.3 */

    const file$c = "node_modules/svelte-markdown/src/renderers/TableBody.svelte";

    function create_fragment$h(ctx) {
    	let tbody;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			tbody = element("tbody");
    			if (default_slot) default_slot.c();
    			add_location(tbody, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			if (default_slot) {
    				default_slot.m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableBody', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableBody> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TableBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableBody",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/TableRow.svelte generated by Svelte v3.44.3 */

    const file$b = "node_modules/svelte-markdown/src/renderers/TableRow.svelte";

    function create_fragment$g(ctx) {
    	let tr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			add_location(tr, file$b, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableRow', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableRow> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class TableRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableRow",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/TableCell.svelte generated by Svelte v3.44.3 */

    const file$a = "node_modules/svelte-markdown/src/renderers/TableCell.svelte";

    // (8:0) {:else}
    function create_else_block$4(ctx) {
    	let td;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (default_slot) default_slot.c();
    			attr_dev(td, "align", /*align*/ ctx[1]);
    			add_location(td, file$a, 8, 2, 115);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			if (default_slot) {
    				default_slot.m(td, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*align*/ 2) {
    				attr_dev(td, "align", /*align*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(8:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if header}
    function create_if_block$7(ctx) {
    	let th;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			th = element("th");
    			if (default_slot) default_slot.c();
    			attr_dev(th, "align", /*align*/ ctx[1]);
    			add_location(th, file$a, 6, 2, 74);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);

    			if (default_slot) {
    				default_slot.m(th, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*align*/ 2) {
    				attr_dev(th, "align", /*align*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(6:0) {#if header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*header*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableCell', slots, ['default']);
    	let { header } = $$props;
    	let { align } = $$props;
    	const writable_props = ['header', 'align'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableCell> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('header' in $$props) $$invalidate(0, header = $$props.header);
    		if ('align' in $$props) $$invalidate(1, align = $$props.align);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ header, align });

    	$$self.$inject_state = $$props => {
    		if ('header' in $$props) $$invalidate(0, header = $$props.header);
    		if ('align' in $$props) $$invalidate(1, align = $$props.align);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [header, align, $$scope, slots];
    }

    class TableCell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { header: 0, align: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableCell",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*header*/ ctx[0] === undefined && !('header' in props)) {
    			console.warn("<TableCell> was created without expected prop 'header'");
    		}

    		if (/*align*/ ctx[1] === undefined && !('align' in props)) {
    			console.warn("<TableCell> was created without expected prop 'align'");
    		}
    	}

    	get header() {
    		throw new Error("<TableCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<TableCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<TableCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<TableCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/List.svelte generated by Svelte v3.44.3 */

    const file$9 = "node_modules/svelte-markdown/src/renderers/List.svelte";

    // (8:0) {:else}
    function create_else_block$3(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			add_location(ul, file$9, 8, 2, 117);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(8:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if ordered}
    function create_if_block$6(ctx) {
    	let ol;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			ol = element("ol");
    			if (default_slot) default_slot.c();
    			attr_dev(ol, "start", /*start*/ ctx[1]);
    			add_location(ol, file$9, 6, 2, 76);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ol, anchor);

    			if (default_slot) {
    				default_slot.m(ol, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*start*/ 2) {
    				attr_dev(ol, "start", /*start*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ol);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(6:0) {#if ordered}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*ordered*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, ['default']);
    	let { ordered } = $$props;
    	let { start } = $$props;
    	const writable_props = ['ordered', 'start'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ordered' in $$props) $$invalidate(0, ordered = $$props.ordered);
    		if ('start' in $$props) $$invalidate(1, start = $$props.start);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ ordered, start });

    	$$self.$inject_state = $$props => {
    		if ('ordered' in $$props) $$invalidate(0, ordered = $$props.ordered);
    		if ('start' in $$props) $$invalidate(1, start = $$props.start);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ordered, start, $$scope, slots];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { ordered: 0, start: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*ordered*/ ctx[0] === undefined && !('ordered' in props)) {
    			console.warn("<List> was created without expected prop 'ordered'");
    		}

    		if (/*start*/ ctx[1] === undefined && !('start' in props)) {
    			console.warn("<List> was created without expected prop 'start'");
    		}
    	}

    	get ordered() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ordered(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/ListItem.svelte generated by Svelte v3.44.3 */

    const file$8 = "node_modules/svelte-markdown/src/renderers/ListItem.svelte";

    function create_fragment$d(ctx) {
    	let li;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			add_location(li, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListItem', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ListItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class ListItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListItem",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Hr.svelte generated by Svelte v3.44.3 */

    const file$7 = "node_modules/svelte-markdown/src/renderers/Hr.svelte";

    function create_fragment$c(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			add_location(hr, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Hr', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Hr> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Hr extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hr",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Html.svelte generated by Svelte v3.44.3 */

    function create_fragment$b(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*text*/ ctx[0], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) html_tag.p(/*text*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Html', slots, []);
    	let { text } = $$props;
    	const writable_props = ['text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Html> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ text });

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text];
    }

    class Html extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { text: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Html",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !('text' in props)) {
    			console.warn("<Html> was created without expected prop 'text'");
    		}
    	}

    	get text() {
    		throw new Error("<Html>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Html>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Blockquote.svelte generated by Svelte v3.44.3 */

    const file$6 = "node_modules/svelte-markdown/src/renderers/Blockquote.svelte";

    function create_fragment$a(ctx) {
    	let blockquote;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			blockquote = element("blockquote");
    			if (default_slot) default_slot.c();
    			add_location(blockquote, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, blockquote, anchor);

    			if (default_slot) {
    				default_slot.m(blockquote, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(blockquote);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blockquote', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Blockquote> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Blockquote extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blockquote",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Code.svelte generated by Svelte v3.44.3 */

    const file$5 = "node_modules/svelte-markdown/src/renderers/Code.svelte";

    function create_fragment$9(ctx) {
    	let pre;
    	let code;
    	let t;

    	const block = {
    		c: function create() {
    			pre = element("pre");
    			code = element("code");
    			t = text(/*text*/ ctx[1]);
    			add_location(code, file$5, 5, 18, 74);
    			attr_dev(pre, "class", /*lang*/ ctx[0]);
    			add_location(pre, file$5, 5, 0, 56);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);
    			append_dev(pre, code);
    			append_dev(code, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);

    			if (dirty & /*lang*/ 1) {
    				attr_dev(pre, "class", /*lang*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Code', slots, []);
    	let { lang } = $$props;
    	let { text } = $$props;
    	const writable_props = ['lang', 'text'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Code> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	$$self.$capture_state = () => ({ lang, text });

    	$$self.$inject_state = $$props => {
    		if ('lang' in $$props) $$invalidate(0, lang = $$props.lang);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lang, text];
    }

    class Code extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { lang: 0, text: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Code",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*lang*/ ctx[0] === undefined && !('lang' in props)) {
    			console.warn("<Code> was created without expected prop 'lang'");
    		}

    		if (/*text*/ ctx[1] === undefined && !('text' in props)) {
    			console.warn("<Code> was created without expected prop 'text'");
    		}
    	}

    	get lang() {
    		throw new Error("<Code>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lang(value) {
    		throw new Error("<Code>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Code>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Code>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-markdown/src/renderers/Br.svelte generated by Svelte v3.44.3 */

    const file$4 = "node_modules/svelte-markdown/src/renderers/Br.svelte";

    function create_fragment$8(ctx) {
    	let br;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			br = element("br");
    			if (default_slot) default_slot.c();
    			add_location(br, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Br', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Br> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Br extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Br",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    const defaultRenderers = {
      heading: Heading,
      paragraph: Paragraph,
      text: Text,
      image: Image,
      link: Link,
      em: Em,
      strong: Strong,
      codespan: Codespan,
      del: Del,
      table: Table,
      tablehead: TableHead,
      tablebody: TableBody,
      tablerow: TableRow,
      tablecell: TableCell,
      list: List,
      orderedlistitem: null,
      unorderedlistitem: null,
      listitem: ListItem,
      hr: Hr,
      html: Html,
      blockquote: Blockquote,
      code: Code,
      br: Br,
    };
    const defaultOptions = {
      baseUrl: null,
      breaks: false,
      gfm: true,
      headerIds: true,
      headerPrefix: '',
      highlight: null,
      langPrefix: 'language-',
      mangle: true,
      pedantic: false,
      renderer: null,
      sanitize: false,
      sanitizer: null,
      silent: false,
      smartLists: false,
      smartypants: false,
      tokenizer: null,
      xhtml: false,
    };

    /* node_modules/svelte-markdown/src/SvelteMarkdown.svelte generated by Svelte v3.44.3 */

    function create_fragment$7(ctx) {
    	let parser;
    	let current;

    	parser = new Parser$1({
    			props: {
    				tokens: /*tokens*/ ctx[0],
    				renderers: /*combinedRenderers*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(parser.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(parser, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const parser_changes = {};
    			if (dirty & /*tokens*/ 1) parser_changes.tokens = /*tokens*/ ctx[0];
    			if (dirty & /*combinedRenderers*/ 2) parser_changes.renderers = /*combinedRenderers*/ ctx[1];
    			parser.$set(parser_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(parser.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(parser.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(parser, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let slugger;
    	let combinedOptions;
    	let combinedRenderers;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteMarkdown', slots, []);
    	let { source = '' } = $$props;
    	let { renderers = {} } = $$props;
    	let { options = {} } = $$props;
    	let { isInline = false } = $$props;
    	const dispatch = createEventDispatcher();
    	let tokens;
    	let lexer;
    	let mounted;

    	setContext(key, {
    		slug: val => slugger ? slugger.slug(val) : '',
    		getOptions: () => combinedOptions
    	});

    	onMount(() => {
    		$$invalidate(7, mounted = true);
    	});

    	const writable_props = ['source', 'renderers', 'options', 'isInline'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvelteMarkdown> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('source' in $$props) $$invalidate(2, source = $$props.source);
    		if ('renderers' in $$props) $$invalidate(3, renderers = $$props.renderers);
    		if ('options' in $$props) $$invalidate(4, options = $$props.options);
    		if ('isInline' in $$props) $$invalidate(5, isInline = $$props.isInline);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		createEventDispatcher,
    		onMount,
    		Parser: Parser$1,
    		Lexer,
    		Slugger,
    		defaultOptions,
    		defaultRenderers,
    		key,
    		source,
    		renderers,
    		options,
    		isInline,
    		dispatch,
    		tokens,
    		lexer,
    		mounted,
    		combinedOptions,
    		slugger,
    		combinedRenderers
    	});

    	$$self.$inject_state = $$props => {
    		if ('source' in $$props) $$invalidate(2, source = $$props.source);
    		if ('renderers' in $$props) $$invalidate(3, renderers = $$props.renderers);
    		if ('options' in $$props) $$invalidate(4, options = $$props.options);
    		if ('isInline' in $$props) $$invalidate(5, isInline = $$props.isInline);
    		if ('tokens' in $$props) $$invalidate(0, tokens = $$props.tokens);
    		if ('lexer' in $$props) $$invalidate(6, lexer = $$props.lexer);
    		if ('mounted' in $$props) $$invalidate(7, mounted = $$props.mounted);
    		if ('combinedOptions' in $$props) $$invalidate(8, combinedOptions = $$props.combinedOptions);
    		if ('slugger' in $$props) slugger = $$props.slugger;
    		if ('combinedRenderers' in $$props) $$invalidate(1, combinedRenderers = $$props.combinedRenderers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*source*/ 4) {
    			slugger = source ? new Slugger() : undefined;
    		}

    		if ($$self.$$.dirty & /*options*/ 16) {
    			$$invalidate(8, combinedOptions = { ...defaultOptions, ...options });
    		}

    		if ($$self.$$.dirty & /*combinedOptions, isInline, lexer, source, tokens*/ 357) {
    			{
    				$$invalidate(6, lexer = new Lexer(combinedOptions));

    				$$invalidate(0, tokens = isInline
    				? lexer.inlineTokens(source)
    				: lexer.lex(source));

    				dispatch('parsed', { tokens });
    			}
    		}

    		if ($$self.$$.dirty & /*renderers*/ 8) {
    			$$invalidate(1, combinedRenderers = { ...defaultRenderers, ...renderers });
    		}

    		if ($$self.$$.dirty & /*mounted, tokens*/ 129) {
    			mounted && dispatch('parsed', { tokens });
    		}
    	};

    	return [
    		tokens,
    		combinedRenderers,
    		source,
    		renderers,
    		options,
    		isInline,
    		lexer,
    		mounted,
    		combinedOptions
    	];
    }

    class SvelteMarkdown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			source: 2,
    			renderers: 3,
    			options: 4,
    			isInline: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteMarkdown",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get source() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set source(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderers() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderers(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInline() {
    		throw new Error("<SvelteMarkdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInline(value) {
    		throw new Error("<SvelteMarkdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Viewer.svelte generated by Svelte v3.44.3 */
    const file$3 = "src/Viewer.svelte";

    // (10:0) {#if $page.val}
    function create_if_block$5(ctx) {
    	let sveltemarkdown;
    	let t0;
    	let p;
    	let t1;
    	let t2_value = /*$page*/ ctx[0].val.vnum + "";
    	let t2;
    	let current;

    	sveltemarkdown = new SvelteMarkdown({
    			props: {
    				source: /*$page*/ ctx[0].val.body,
    				renderers: /*renderers*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(sveltemarkdown.$$.fragment);
    			t0 = space();
    			p = element("p");
    			t1 = text("vnum: ");
    			t2 = text(t2_value);
    			add_location(p, file$3, 11, 2, 285);
    		},
    		m: function mount(target, anchor) {
    			mount_component(sveltemarkdown, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const sveltemarkdown_changes = {};
    			if (dirty & /*$page*/ 1) sveltemarkdown_changes.source = /*$page*/ ctx[0].val.body;
    			sveltemarkdown.$set(sveltemarkdown_changes);
    			if ((!current || dirty & /*$page*/ 1) && t2_value !== (t2_value = /*$page*/ ctx[0].val.vnum + "")) set_data_dev(t2, t2_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sveltemarkdown.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sveltemarkdown.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(sveltemarkdown, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(10:0) {#if $page.val}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$page*/ ctx[0].val && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$page*/ ctx[0].val) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$page*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $page;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Viewer', slots, []);
    	const page = getContext('page');
    	validate_store(page, 'page');
    	component_subscribe($$self, page, value => $$invalidate(0, $page = value));
    	const renderers = { link: Link$1 };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Viewer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		getContext,
    		page,
    		SvelteMarkdown,
    		renderers,
    		$page
    	});

    	return [$page, page, renderers];
    }

    class Viewer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Viewer",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Content.svelte generated by Svelte v3.44.3 */
    const file$2 = "src/Content.svelte";

    // (29:0) {:else}
    function create_else_block_2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "ERROR";
    			add_location(p, file$2, 29, 2, 725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(29:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:36) 
    function create_if_block_3$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_4, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*$hassess*/ ctx[3] && /*$session*/ ctx[4].val.login) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(23:36) ",
    		ctx
    	});

    	return block;
    }

    // (17:19) 
    function create_if_block_1$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$1, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$loc*/ ctx[0].cmd == 'edit') return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(17:19) ",
    		ctx
    	});

    	return block;
    }

    // (15:0) {#if $loc.cmd == 'history'}
    function create_if_block$4(ctx) {
    	let history;
    	let current;
    	history = new History({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(history.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(history, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(history.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(history.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(history, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(15:0) {#if $loc.cmd == 'history'}",
    		ctx
    	});

    	return block;
    }

    // (26:2) {:else}
    function create_else_block_1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "no page here. please log in to edit";
    			add_location(p, file$2, 26, 4, 664);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(26:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (24:2) {#if $hassess && $session.val.login}
    function create_if_block_4(ctx) {
    	let pageform;
    	let current;
    	pageform = new PageForm({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(pageform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pageform, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pageform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pageform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pageform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(24:2) {#if $hassess && $session.val.login}",
    		ctx
    	});

    	return block;
    }

    // (20:2) {:else}
    function create_else_block$2(ctx) {
    	let viewer;
    	let current;
    	viewer = new Viewer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(viewer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(viewer, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(viewer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(viewer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(viewer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(20:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:2) {#if $loc.cmd == 'edit'}
    function create_if_block_2$1(ctx) {
    	let pageform;
    	let current;
    	pageform = new PageForm({ props: { editing: true }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(pageform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pageform, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pageform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pageform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pageform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(18:2) {#if $loc.cmd == 'edit'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_if_block_1$2, create_if_block_3$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$loc*/ ctx[0].cmd == 'history') return 0;
    		if (/*$haspage*/ ctx[1]) return 1;
    		if (!!/*$page*/ ctx[2] && /*$page*/ ctx[2].err == 1) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $loc;
    	let $haspage;
    	let $page;
    	let $hassess;
    	let $session;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, []);
    	const session = getContext('session');
    	validate_store(session, 'session');
    	component_subscribe($$self, session, value => $$invalidate(4, $session = value));
    	const page = getContext('page');
    	validate_store(page, 'page');
    	component_subscribe($$self, page, value => $$invalidate(2, $page = value));
    	const haspage = getContext('haspage');
    	validate_store(haspage, 'haspage');
    	component_subscribe($$self, haspage, value => $$invalidate(1, $haspage = value));
    	const hashistory = getContext('hashistory');
    	const hassess = getContext('hassess');
    	validate_store(hassess, 'hassess');
    	component_subscribe($$self, hassess, value => $$invalidate(3, $hassess = value));
    	const loc = getContext('loc');
    	validate_store(loc, 'loc');
    	component_subscribe($$self, loc, value => $$invalidate(0, $loc = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Content> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		History,
    		PageForm,
    		Viewer,
    		getContext,
    		session,
    		page,
    		haspage,
    		hashistory,
    		hassess,
    		loc,
    		$loc,
    		$haspage,
    		$page,
    		$hassess,
    		$session
    	});

    	return [
    		$loc,
    		$haspage,
    		$page,
    		$hassess,
    		$session,
    		session,
    		page,
    		haspage,
    		hassess,
    		loc
    	];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Bodyframe.svelte generated by Svelte v3.44.3 */

    // (20:0) {:else}
    function create_else_block$1(ctx) {
    	let e500;
    	let current;
    	e500 = new E500({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(e500.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(e500, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(e500.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(e500.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(e500, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(20:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:33) 
    function create_if_block_3(ctx) {
    	let e404;
    	let current;
    	e404 = new E404({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(e404.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(e404, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(e404.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(e404.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(e404, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(18:33) ",
    		ctx
    	});

    	return block;
    }

    // (16:33) 
    function create_if_block_2(ctx) {
    	let user;
    	let current;
    	user = new User({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(user.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(user, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(user.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(user.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(user, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(16:33) ",
    		ctx
    	});

    	return block;
    }

    // (14:34) 
    function create_if_block_1$1(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(14:34) ",
    		ctx
    	});

    	return block;
    }

    // (12:0) {#if $loc.special == 'content'}
    function create_if_block$3(ctx) {
    	let content;
    	let current;
    	content = new Content({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(content.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(12:0) {#if $loc.special == 'content'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block$3,
    		create_if_block_1$1,
    		create_if_block_2,
    		create_if_block_3,
    		create_else_block$1
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$loc*/ ctx[0].special == 'content') return 0;
    		if (/*$loc*/ ctx[0].special == 'login') return 1;
    		if (/*$loc*/ ctx[0].special == 'user') return 2;
    		if (/*$loc*/ ctx[0].special == 'e404') return 3;
    		return 4;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $loc;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Bodyframe', slots, []);
    	const loc = getContext('loc');
    	validate_store(loc, 'loc');
    	component_subscribe($$self, loc, value => $$invalidate(0, $loc = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Bodyframe> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Login,
    		User,
    		E404,
    		E500,
    		Content,
    		getContext,
    		loc,
    		$loc
    	});

    	return [$loc, loc];
    }

    class Bodyframe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bodyframe",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const hex = '[a-fA-F0-9]';

    const isuu =s=> {
      if (typeof(s) != 'string') return false
      return !!s.match(`^${hex}{8}-(${hex}{4}-){3}${hex}{12}$`)
    };


    var util = { isuu };

    /* src/MaybeUUID.svelte generated by Svelte v3.44.3 */

    // (13:0) {:else}
    function create_else_block(ctx) {
    	let balance;
    	let current;

    	balance = new Balance({
    			props: {
    				left: /*left*/ ctx[0],
    				right: /*right*/ ctx[1],
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(balance.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(balance, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const balance_changes = {};
    			if (dirty & /*left*/ 1) balance_changes.left = /*left*/ ctx[0];
    			if (dirty & /*right*/ 2) balance_changes.right = /*right*/ ctx[1];

    			if (dirty & /*$$scope, uuid*/ 20) {
    				balance_changes.$$scope = { dirty, ctx };
    			}

    			balance.$set(balance_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(balance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(balance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(balance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(13:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:0) {#if valid}
    function create_if_block$2(ctx) {
    	let uuid_1;
    	let current;

    	uuid_1 = new UUID({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(uuid_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(uuid_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const uuid_1_changes = {};

    			if (dirty & /*$$scope, uuid*/ 20) {
    				uuid_1_changes.$$scope = { dirty, ctx };
    			}

    			uuid_1.$set(uuid_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(uuid_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(uuid_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(uuid_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(11:0) {#if valid}",
    		ctx
    	});

    	return block;
    }

    // (14:26) <UUID>
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*uuid*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*uuid*/ 4) set_data_dev(t, /*uuid*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(14:26) <UUID>",
    		ctx
    	});

    	return block;
    }

    // (14:2) <Balance {left} {right}>
    function create_default_slot_1$2(ctx) {
    	let uuid_1;
    	let current;

    	uuid_1 = new UUID({
    			props: {
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(uuid_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(uuid_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const uuid_1_changes = {};

    			if (dirty & /*$$scope, uuid*/ 20) {
    				uuid_1_changes.$$scope = { dirty, ctx };
    			}

    			uuid_1.$set(uuid_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(uuid_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(uuid_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(uuid_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(14:2) <Balance {left} {right}>",
    		ctx
    	});

    	return block;
    }

    // (12:2) <UUID>
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*uuid*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*uuid*/ 4) set_data_dev(t, /*uuid*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(12:2) <UUID>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*valid*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let valid;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MaybeUUID', slots, []);
    	let { left = false } = $$props;
    	let { right = false } = $$props;
    	let { uuid } = $$props;
    	const writable_props = ['left', 'right', 'uuid'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MaybeUUID> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('left' in $$props) $$invalidate(0, left = $$props.left);
    		if ('right' in $$props) $$invalidate(1, right = $$props.right);
    		if ('uuid' in $$props) $$invalidate(2, uuid = $$props.uuid);
    	};

    	$$self.$capture_state = () => ({
    		UUID,
    		Balance,
    		isuu: util.isuu,
    		left,
    		right,
    		uuid,
    		valid
    	});

    	$$self.$inject_state = $$props => {
    		if ('left' in $$props) $$invalidate(0, left = $$props.left);
    		if ('right' in $$props) $$invalidate(1, right = $$props.right);
    		if ('uuid' in $$props) $$invalidate(2, uuid = $$props.uuid);
    		if ('valid' in $$props) $$invalidate(3, valid = $$props.valid);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*uuid*/ 4) {
    			$$invalidate(3, valid = util.isuu(uuid));
    		}
    	};

    	return [left, right, uuid, valid];
    }

    class MaybeUUID extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { left: 0, right: 1, uuid: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MaybeUUID",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*uuid*/ ctx[2] === undefined && !('uuid' in props)) {
    			console.warn("<MaybeUUID> was created without expected prop 'uuid'");
    		}
    	}

    	get left() {
    		throw new Error("<MaybeUUID>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<MaybeUUID>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get right() {
    		throw new Error("<MaybeUUID>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set right(value) {
    		throw new Error("<MaybeUUID>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uuid() {
    		throw new Error("<MaybeUUID>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uuid(value) {
    		throw new Error("<MaybeUUID>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Footer.svelte generated by Svelte v3.44.3 */
    const file$1 = "src/Footer.svelte";

    // (14:2) {#if $haspage}
    function create_if_block_1(ctx) {
    	let maybeuuid0;
    	let t;
    	let maybeuuid1;
    	let current;

    	maybeuuid0 = new MaybeUUID({
    			props: {
    				right: true,
    				uuid: /*$page*/ ctx[1].val.uuid
    			},
    			$$inline: true
    		});

    	maybeuuid1 = new MaybeUUID({
    			props: {
    				right: true,
    				uuid: /*$page*/ ctx[1].val.parentVuuid
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(maybeuuid0.$$.fragment);
    			t = space();
    			create_component(maybeuuid1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(maybeuuid0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(maybeuuid1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const maybeuuid0_changes = {};
    			if (dirty & /*$page*/ 2) maybeuuid0_changes.uuid = /*$page*/ ctx[1].val.uuid;
    			maybeuuid0.$set(maybeuuid0_changes);
    			const maybeuuid1_changes = {};
    			if (dirty & /*$page*/ 2) maybeuuid1_changes.uuid = /*$page*/ ctx[1].val.parentVuuid;
    			maybeuuid1.$set(maybeuuid1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(maybeuuid0.$$.fragment, local);
    			transition_in(maybeuuid1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(maybeuuid0.$$.fragment, local);
    			transition_out(maybeuuid1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(maybeuuid0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(maybeuuid1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(14:2) {#if $haspage}",
    		ctx
    	});

    	return block;
    }

    // (13:2) <FB vert>
    function create_default_slot_3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$haspage*/ ctx[0] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$haspage*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$haspage*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(13:2) <FB vert>",
    		ctx
    	});

    	return block;
    }

    // (19:2) <FB expand vert center>
    function create_default_slot_2$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "❤";
    			attr_dev(div, "class", "heartmark");
    			add_location(div, file$1, 19, 4, 498);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(19:2) <FB expand vert center>",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if $haspage}
    function create_if_block$1(ctx) {
    	let maybeuuid0;
    	let t;
    	let maybeuuid1;
    	let current;

    	maybeuuid0 = new MaybeUUID({
    			props: {
    				left: true,
    				uuid: /*$page*/ ctx[1].val.vuuid
    			},
    			$$inline: true
    		});

    	maybeuuid1 = new MaybeUUID({
    			props: {
    				left: true,
    				uuid: /*$page*/ ctx[1].val.childVuuid
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(maybeuuid0.$$.fragment);
    			t = space();
    			create_component(maybeuuid1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(maybeuuid0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(maybeuuid1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const maybeuuid0_changes = {};
    			if (dirty & /*$page*/ 2) maybeuuid0_changes.uuid = /*$page*/ ctx[1].val.vuuid;
    			maybeuuid0.$set(maybeuuid0_changes);
    			const maybeuuid1_changes = {};
    			if (dirty & /*$page*/ 2) maybeuuid1_changes.uuid = /*$page*/ ctx[1].val.childVuuid;
    			maybeuuid1.$set(maybeuuid1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(maybeuuid0.$$.fragment, local);
    			transition_in(maybeuuid1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(maybeuuid0.$$.fragment, local);
    			transition_out(maybeuuid1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(maybeuuid0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(maybeuuid1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(23:2) {#if $haspage}",
    		ctx
    	});

    	return block;
    }

    // (22:2) <FB vert>
    function create_default_slot_1$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$haspage*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$haspage*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$haspage*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
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
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(22:2) <FB vert>",
    		ctx
    	});

    	return block;
    }

    // (12:0) <FB c="footer">
    function create_default_slot$1(ctx) {
    	let fb0;
    	let t0;
    	let fb1;
    	let t1;
    	let fb2;
    	let current;

    	fb0 = new FB({
    			props: {
    				vert: true,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fb1 = new FB({
    			props: {
    				expand: true,
    				vert: true,
    				center: true,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fb2 = new FB({
    			props: {
    				vert: true,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb0.$$.fragment);
    			t0 = space();
    			create_component(fb1.$$.fragment);
    			t1 = space();
    			create_component(fb2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(fb1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(fb2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fb0_changes = {};

    			if (dirty & /*$$scope, $page, $haspage*/ 19) {
    				fb0_changes.$$scope = { dirty, ctx };
    			}

    			fb0.$set(fb0_changes);
    			const fb1_changes = {};

    			if (dirty & /*$$scope*/ 16) {
    				fb1_changes.$$scope = { dirty, ctx };
    			}

    			fb1.$set(fb1_changes);
    			const fb2_changes = {};

    			if (dirty & /*$$scope, $page, $haspage*/ 19) {
    				fb2_changes.$$scope = { dirty, ctx };
    			}

    			fb2.$set(fb2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb0.$$.fragment, local);
    			transition_in(fb1.$$.fragment, local);
    			transition_in(fb2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb0.$$.fragment, local);
    			transition_out(fb1.$$.fragment, local);
    			transition_out(fb2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(fb1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(fb2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(12:0) <FB c=\\\"footer\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				c: "footer",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const fb_changes = {};

    			if (dirty & /*$$scope, $page, $haspage*/ 19) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $haspage;
    	let $page;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const page = getContext('page');
    	validate_store(page, 'page');
    	component_subscribe($$self, page, value => $$invalidate(1, $page = value));
    	const haspage = getContext('haspage');
    	validate_store(haspage, 'haspage');
    	component_subscribe($$self, haspage, value => $$invalidate(0, $haspage = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		FB,
    		Pipe,
    		Balance,
    		MaybeUUID,
    		UUID,
    		getContext,
    		page,
    		haspage,
    		$haspage,
    		$page
    	});

    	return [$haspage, $page, page, haspage];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Messenger.svelte generated by Svelte v3.44.3 */
    const file = "src/Messenger.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let span;
    	let t_value = /*$message*/ ctx[0].text + "";
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", span_class_value = "message level-" + /*$message*/ ctx[0].level + " svelte-35uciw");
    			add_location(span, file, 6, 0, 122);
    			attr_dev(div, "class", "messenger");
    			add_location(div, file, 5, 0, 98);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$message*/ 1 && t_value !== (t_value = /*$message*/ ctx[0].text + "")) set_data_dev(t, t_value);

    			if (dirty & /*$message*/ 1 && span_class_value !== (span_class_value = "message level-" + /*$message*/ ctx[0].level + " svelte-35uciw")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $message;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Messenger', slots, []);
    	const message = getContext('message');
    	validate_store(message, 'message');
    	component_subscribe($$self, message, value => $$invalidate(0, $message = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Messenger> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getContext, message, $message });
    	return [$message, message];
    }

    class Messenger extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Messenger",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
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
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    var syskey = "CPB";
    var proto = "http";
    var domain = "localhost";
    var port = 3000;
    var defns = "main";
    var defapi = "api";
    var deftitle = "Home";
    var deflogin = "login";
    var defuser = "user";
    var secret$1 = "oed und leer";
    var defaults = {
    	syskey: syskey,
    	proto: proto,
    	domain: domain,
    	port: port,
    	defns: defns,
    	defapi: defapi,
    	deftitle: deftitle,
    	deflogin: deflogin,
    	defuser: defuser,
    	secret: secret$1
    };

    var secret = "Et j'ai deux fois vainqueur traverse l'Acheron";
    var user = {
    	secret: secret
    };

    var rc = Object.assign({}, defaults, user);

    /* src/Main.svelte generated by Svelte v3.44.3 */

    const { console: console_1, window: window_1 } = globals;

    // (338:2) {#if $debug}
    function create_if_block(ctx) {
    	let debugger_1;
    	let current;
    	debugger_1 = new Debugger({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(debugger_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(debugger_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(debugger_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(debugger_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(debugger_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(338:2) {#if $debug}",
    		ctx
    	});

    	return block;
    }

    // (342:3) <FB expand leaf>
    function create_default_slot_2(ctx) {
    	let bodyframe;
    	let current;
    	bodyframe = new Bodyframe({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(bodyframe.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bodyframe, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bodyframe.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bodyframe.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bodyframe, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(342:3) <FB expand leaf>",
    		ctx
    	});

    	return block;
    }

    // (337:1) <FB vert c="cpb-main">
    function create_default_slot_1(ctx) {
    	let t0;
    	let headframe;
    	let t1;
    	let titleframe;
    	let t2;
    	let messenger;
    	let t3;
    	let fb;
    	let t4;
    	let footer;
    	let current;
    	let if_block = /*$debug*/ ctx[0] && create_if_block(ctx);
    	headframe = new Headframe({ $$inline: true });
    	titleframe = new Titleframe({ $$inline: true });
    	messenger = new Messenger({ $$inline: true });

    	fb = new FB({
    			props: {
    				expand: true,
    				leaf: true,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(headframe.$$.fragment);
    			t1 = space();
    			create_component(titleframe.$$.fragment);
    			t2 = space();
    			create_component(messenger.$$.fragment);
    			t3 = space();
    			create_component(fb.$$.fragment);
    			t4 = space();
    			create_component(footer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(headframe, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(titleframe, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(messenger, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(fb, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$debug*/ ctx[0]) {
    				if (if_block) {
    					if (dirty[0] & /*$debug*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const fb_changes = {};

    			if (dirty[2] & /*$$scope*/ 64) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(headframe.$$.fragment, local);
    			transition_in(titleframe.$$.fragment, local);
    			transition_in(messenger.$$.fragment, local);
    			transition_in(fb.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(headframe.$$.fragment, local);
    			transition_out(titleframe.$$.fragment, local);
    			transition_out(messenger.$$.fragment, local);
    			transition_out(fb.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(headframe, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(titleframe, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(messenger, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(fb, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(337:1) <FB vert c=\\\"cpb-main\\\">",
    		ctx
    	});

    	return block;
    }

    // (336:0) <FB center c="cpb-ui">
    function create_default_slot(ctx) {
    	let fb;
    	let current;

    	fb = new FB({
    			props: {
    				vert: true,
    				c: "cpb-main",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fb_changes = {};

    			if (dirty[0] & /*$debug*/ 1 | dirty[2] & /*$$scope*/ 64) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(336:0) <FB center c=\\\"cpb-ui\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let fb;
    	let current;
    	let mounted;
    	let dispose;

    	fb = new FB({
    			props: {
    				center: true,
    				c: "cpb-ui",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fb.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fb, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "keydown", /*controls*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const fb_changes = {};

    			if (dirty[0] & /*$debug*/ 1 | dirty[2] & /*$$scope*/ 64) {
    				fb_changes.$$scope = { dirty, ctx };
    			}

    			fb.$set(fb_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fb.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fb.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fb, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $path;
    	let $links;
    	let $loc;
    	let $linkmap;
    	let $title;
    	let $space;
    	let $page;
    	let $haspage;
    	let $rc;
    	let $hassess;
    	let $loading;
    	let $session;
    	let $hashistory;
    	let $hasuser;
    	let $history;
    	let $user;
    	let $message;
    	let $gs;
    	let $aod;
    	let $trail;
    	let $debug;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	let lut;
    	let rc$1 = writable(rc);
    	validate_store(rc$1, 'rc');
    	component_subscribe($$self, rc$1, value => $$invalidate(33, $rc = value));
    	let aod = writable(0);
    	validate_store(aod, 'aod');
    	component_subscribe($$self, aod, value => $$invalidate(43, $aod = value));
    	let links = writable([]);
    	validate_store(links, 'links');
    	component_subscribe($$self, links, value => $$invalidate(24, $links = value));
    	let linkmap = writable({});
    	validate_store(linkmap, 'linkmap');
    	component_subscribe($$self, linkmap, value => $$invalidate(28, $linkmap = value));
    	let path = writable(window.location.pathname + window.location.hash);
    	validate_store(path, 'path');
    	component_subscribe($$self, path, value => $$invalidate(23, $path = value));
    	let loc = writable({});
    	validate_store(loc, 'loc');
    	component_subscribe($$self, loc, value => $$invalidate(27, $loc = value));
    	let session = writable({});
    	validate_store(session, 'session');
    	component_subscribe($$self, session, value => $$invalidate(36, $session = value));
    	let message = writable({});
    	validate_store(message, 'message');
    	component_subscribe($$self, message, value => $$invalidate(41, $message = value));
    	let loading = writable(true);
    	validate_store(loading, 'loading');
    	component_subscribe($$self, loading, value => $$invalidate(35, $loading = value));
    	let debug = writable(true);
    	validate_store(debug, 'debug');
    	component_subscribe($$self, debug, value => $$invalidate(0, $debug = value));
    	let space = writable('');
    	validate_store(space, 'space');
    	component_subscribe($$self, space, value => $$invalidate(30, $space = value));
    	let title = writable('');
    	validate_store(title, 'title');
    	component_subscribe($$self, title, value => $$invalidate(29, $title = value));
    	let page = writable(null);
    	validate_store(page, 'page');
    	component_subscribe($$self, page, value => $$invalidate(31, $page = value));
    	let user = writable(null);
    	validate_store(user, 'user');
    	component_subscribe($$self, user, value => $$invalidate(40, $user = value));
    	let history = writable(null);
    	validate_store(history, 'history');
    	component_subscribe($$self, history, value => $$invalidate(39, $history = value));
    	let trail = writable([]);
    	validate_store(trail, 'trail');
    	component_subscribe($$self, trail, value => $$invalidate(25, $trail = value));
    	let haspage = writable(false);
    	validate_store(haspage, 'haspage');
    	component_subscribe($$self, haspage, value => $$invalidate(32, $haspage = value));
    	let hashistory = writable(false);
    	validate_store(hashistory, 'hashistory');
    	component_subscribe($$self, hashistory, value => $$invalidate(37, $hashistory = value));
    	let hasuser = writable(false);
    	validate_store(hasuser, 'hasuser');
    	component_subscribe($$self, hasuser, value => $$invalidate(38, $hasuser = value));
    	let hassess = writable(null);
    	validate_store(hassess, 'hassess');
    	component_subscribe($$self, hassess, value => $$invalidate(34, $hassess = value));
    	setContext('rc', rc$1);
    	setContext('aod', aod);
    	setContext('links', links);
    	setContext('linkmap', linkmap);
    	setContext('path', path);
    	setContext('loc', loc);
    	setContext('session', session);
    	setContext('message', message);
    	setContext('loading', loading);
    	setContext('debug', debug);
    	setContext('space', space);
    	setContext('title', title);
    	setContext('page', page);
    	setContext('user', user);
    	setContext('history', history);
    	setContext('trail', trail);
    	setContext('haspage', haspage);
    	setContext('hashistory', hashistory);
    	setContext('hasuser', hasuser);
    	setContext('hassess', hassess);
    	const burl = () => `${$rc.proto}://${$rc.domain}${$rc.port ? ':' + $rc.port : ''}`;
    	const surl = () => `${burl()}/${$rc.syskey}`;
    	const aurl = () => `${surl()}/${$rc.defapi}`;

    	const cmdu = (c, ...a) => {
    		a = a.length ? `/${a.join('/')}` : '';
    		return `${aurl()}/${c}${a}`;
    	};

    	const grab = (...a) => {
    		return fetch(cmdu(...a)).then(res => res.json());
    	};

    	// post('update', ns, t, {title, body})
    	const post = (...a) => {
    		const body = a.pop();

    		return fetch(cmdu(...a), {
    			method: 'POST',
    			body: JSON.stringify(body),
    			headers: { 'Content-Type': 'application/json' }
    		}).then(res => res.json());
    	};

    	const postpage = b => {
    		const a = $loc.uuid ? [$loc.uuid] : [$loc.namespace, $loc.title];

    		post('get', ...a, b).then(res => {
    			set_store_value(aod, $aod = Date.now(), $aod);
    			msg(`Created '${$gs.tag()}'`);
    		}).catch(e => console.log('ERROR!!!'));
    	};

    	const updatepage = b => {
    		const a = $loc.uuid ? [$loc.uuid] : [$loc.namespace, $loc.title];

    		post('update', ...a, b).then(res => {
    			msg(`Saved changes to '${$gs.tag()}'`);
    		}).catch(e => console.log('ERROR!!!'));
    	};

    	const postuser = b => {
    		post('register', b).then(res => {
    			msg(`Created user '${b.handle}'`);
    		}).catch(e => console.log('ERROR!!!'));
    	};

    	setContext('postpage', postpage);
    	setContext('updatepage', updatepage);
    	setContext('postuser', postuser);

    	const login = b => {
    		return post('login', b).then(res => {
    			getsession().then(s => {
    				if ($hassess) msg(`Logged in as '${$session.val.handle}'`);
    			});
    		}).catch(e => console.log('ERR!!'));
    	};

    	const register = b => {
    		return post('register', b).then(res => {
    			getsession().then(s => {
    				if ($hassess) msg(`Registered as '${$session.val.handle}'`);
    			});
    		}).catch(e => console.log('ERR!!'));
    	};

    	const logout = () => {
    		return post('logout', {}).then(r => {
    			getsession().then(s => {
    				if ($hassess) msg(`Logged out`);
    			});
    		});
    	};

    	setContext('login', login);
    	setContext('register', register);
    	setContext('logout', logout);

    	const msg = (text = '', level = 0) => {
    		set_store_value(message, $message = { text, level }, $message);
    	};

    	setContext('msg', msg);

    	const getsession = () => {
    		return grab('session').then(ses => {
    			set_store_value(session, $session = ses, $session);
    			set_store_value(hassess, $hassess = !!$session && $session.err == 0 && !!$session.val, $hassess);
    			console.log(`LAUNCH: Got session (${$hassess}) ${$session.val.uuid}`);
    		});
    	};

    	const cleardata = (to = {}) => {
    		if (to.user) set_store_value(user, $user = to.user, $user); else if ($user) set_store_value(user, $user = null, $user);
    		if (to.page) set_store_value(page, $page = to.page, $page); else if ($page) set_store_value(page, $page = null, $page);
    		if (to.history) set_store_value(history, $history = to.history, $history); else if ($history) set_store_value(history, $history = null, $history);
    	};

    	const checkresp = r => !!r && r.err == 0 && !!r.val;

    	const checkdata = () => {
    		set_store_value(hasuser, $hasuser = checkresp($user), $hasuser);
    		set_store_value(haspage, $haspage = checkresp($page), $haspage);
    		set_store_value(hashistory, $hashistory = checkresp($history), $hashistory);
    		console.log(`LAUNCH: Data check - user: ${$hasuser} - page: ${$haspage} - hist: ${$hashistory}`);
    	};

    	const load = p => {
    		set_store_value(loading, $loading = true, $loading);
    		set_store_value(loc, $loc = parseloc(p), $loc);
    		let after = false;

    		if ($loc.special == 'user') {
    			after = grab('user', $session.val.handle).then(user => {
    				cleardata({ user });
    				set_store_value(loading, $loading = false, $loading);
    			});
    		} else if ($loc.cmd == 'history') {
    			const a = $loc.uuid ? [$loc.uuid] : [$loc.namespace, $loc.title];

    			after = grab('history', ...a).then(history => {
    				cleardata({ history });
    				set_store_value(loading, $loading = false, $loading);
    			});
    		} else if ($loc.uuid || $loc.namespace) {
    			const a = $loc.uuid
    			? ['uuid', $loc.uuid]
    			: ['get', $loc.namespace, $loc.title];

    			after = grab(...a).then(page => {
    				if (page.val) page.val.historical = !!page.val.childVuuid;
    				console.log(page);
    				cleardata({ page });
    				set_store_value(loading, $loading = false, $loading);
    			});
    		} else {
    			cleardata();
    			set_store_value(loading, $loading = false, $loading);
    		}

    		if (after) {
    			after.then(r => {
    				checkdata();
    				parsenst();
    			}).catch(e => console.log('ERR!'));
    		} else {
    			checkdata();
    			parsenst();
    		}
    	};

    	const launch = p => {
    		console.log('COMMONPLACE BOOK: LAUNCH');
    		console.log(`LAUNCH: ${JSON.stringify($rc)}`);
    		if ($hassess) load($path); else getsession().then(s => load($path));
    	};

    	const parseloc = p => {
    		const loc = {
    			namespace: null,
    			title: null,
    			uuid: null,
    			special: null,
    			cmd: null
    		};

    		p = p.split('#');
    		if (p[1]) loc.cmd = p[1];
    		p = p[0];
    		if (p[0] == '/') p = p.slice(1);
    		p = p.split('/');
    		const ns = p[0];
    		const t = p[1];
    		console.log(ns, t);
    		const hex = '[a-fA-F0-9]';

    		if (ns == $rc.syskey) {
    			console.log('in sys space');

    			if (t == $rc.deflogin) {
    				loc.special = 'login';
    			} else if (t == $rc.defuser) {
    				loc.special = 'user';
    			} else {
    				loc.special = 'e404';
    			}
    		} else {
    			console.log('in content space');
    			loc.special = 'content';

    			if (ns.match(`${hex}{8}-(${hex}{4}-){3}${hex}{12}`)) {
    				loc.uuid = ns;
    			} else if (ns == '') {
    				loc.namespace = $rc.defns;
    				loc.title = $rc.deftitle;
    			} else if (!t) {
    				loc.namespace = ns;
    				loc.title = $rc.deftitle;
    			} else {
    				loc.namespace = ns;
    				loc.title = t;
    			}
    		}

    		return loc;
    	};

    	const parsenst = () => {
    		let ns, t;

    		if ($haspage) {
    			ns = $page.val.namespace;
    			t = $page.val.title;
    		} else if ($loc.uuid) {
    			ns = 'ID';
    			t = $loc.uuid;
    		} else if ($loc.namespace || $loc.title) {
    			ns = $loc.namespace || '';
    			t = $loc.title || '';
    		} else {
    			ns = 'SPECIAL';
    			t = $loc.special;
    		}

    		set_store_value(space, $space = ns, $space);
    		set_store_value(title, $title = t, $title);
    	};

    	const linkupdate = links => {
    		const titles = [...new Set(links)].join('+');
    		grab('missing', titles).then(res => set_store_value(linkmap, $linkmap = res, $linkmap)).catch(e => console.log('ERROR!!!'));
    	};

    	const mklut = links => {
    		if (lut) clearTimeout(lut);
    		lut = setTimeout(linkupdate, 200, links);
    	};

    	const onpop = e => {
    		set_store_value(path, $path = window.location.pathname, $path);
    	};

    	const controls = e => {
    		if (event.keyCode == 8) {
    			console.log('backspace');
    		}
    	};

    	let gs = writable({
    		full: p => `${burl()}/${p}`,
    		goto: p => {
    			set_store_value(path, $path = p, $path);
    			window.history.pushState({}, $path, $path);
    		},
    		bounce: (d = '/') => {
    			set_store_value(path, $path = trail[1] ? trail[1] : d, $path);
    			window.history.pushState({}, $path, $path);
    		},
    		tag: () => {
    			return `${$loc.namespace}:${$loc.title}`;
    		},
    		bare: () => $path.split('#')[0],
    		cur: () => `${burl()}/${$path}`
    	});

    	validate_store(gs, 'gs');
    	component_subscribe($$self, gs, value => $$invalidate(42, $gs = value));
    	setContext('gs', gs);
    	window.onpopstate = onpop;
    	msg();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		FB,
    		Debugger,
    		Headframe,
    		Titleframe,
    		Bodyframe,
    		Footer,
    		Messenger,
    		setContext,
    		writable,
    		rco: rc,
    		lut,
    		rc: rc$1,
    		aod,
    		links,
    		linkmap,
    		path,
    		loc,
    		session,
    		message,
    		loading,
    		debug,
    		space,
    		title,
    		page,
    		user,
    		history,
    		trail,
    		haspage,
    		hashistory,
    		hasuser,
    		hassess,
    		burl,
    		surl,
    		aurl,
    		cmdu,
    		grab,
    		post,
    		postpage,
    		updatepage,
    		postuser,
    		login,
    		register,
    		logout,
    		msg,
    		getsession,
    		cleardata,
    		checkresp,
    		checkdata,
    		load,
    		launch,
    		parseloc,
    		parsenst,
    		linkupdate,
    		mklut,
    		onpop,
    		controls,
    		gs,
    		$path,
    		$links,
    		$loc,
    		$linkmap,
    		$title,
    		$space,
    		$page,
    		$haspage,
    		$rc,
    		$hassess,
    		$loading,
    		$session,
    		$hashistory,
    		$hasuser,
    		$history,
    		$user,
    		$message,
    		$gs,
    		$aod,
    		$trail,
    		$debug
    	});

    	$$self.$inject_state = $$props => {
    		if ('lut' in $$props) lut = $$props.lut;
    		if ('rc' in $$props) $$invalidate(1, rc$1 = $$props.rc);
    		if ('aod' in $$props) $$invalidate(2, aod = $$props.aod);
    		if ('links' in $$props) $$invalidate(3, links = $$props.links);
    		if ('linkmap' in $$props) $$invalidate(4, linkmap = $$props.linkmap);
    		if ('path' in $$props) $$invalidate(5, path = $$props.path);
    		if ('loc' in $$props) $$invalidate(6, loc = $$props.loc);
    		if ('session' in $$props) $$invalidate(7, session = $$props.session);
    		if ('message' in $$props) $$invalidate(8, message = $$props.message);
    		if ('loading' in $$props) $$invalidate(9, loading = $$props.loading);
    		if ('debug' in $$props) $$invalidate(10, debug = $$props.debug);
    		if ('space' in $$props) $$invalidate(11, space = $$props.space);
    		if ('title' in $$props) $$invalidate(12, title = $$props.title);
    		if ('page' in $$props) $$invalidate(13, page = $$props.page);
    		if ('user' in $$props) $$invalidate(14, user = $$props.user);
    		if ('history' in $$props) $$invalidate(15, history = $$props.history);
    		if ('trail' in $$props) $$invalidate(16, trail = $$props.trail);
    		if ('haspage' in $$props) $$invalidate(17, haspage = $$props.haspage);
    		if ('hashistory' in $$props) $$invalidate(18, hashistory = $$props.hashistory);
    		if ('hasuser' in $$props) $$invalidate(19, hasuser = $$props.hasuser);
    		if ('hassess' in $$props) $$invalidate(20, hassess = $$props.hassess);
    		if ('gs' in $$props) $$invalidate(22, gs = $$props.gs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$path, $trail*/ 41943040) {
    			if ($path != $trail[0]) $trail.unshift($path);
    		}

    		if ($$self.$$.dirty[0] & /*$links*/ 16777216) {
    			mklut($links);
    		}

    		if ($$self.$$.dirty[0] & /*$path*/ 8388608) {
    			launch();
    		}
    	};

    	return [
    		$debug,
    		rc$1,
    		aod,
    		links,
    		linkmap,
    		path,
    		loc,
    		session,
    		message,
    		loading,
    		debug,
    		space,
    		title,
    		page,
    		user,
    		history,
    		trail,
    		haspage,
    		hashistory,
    		hasuser,
    		hassess,
    		controls,
    		gs,
    		$path,
    		$links,
    		$trail
    	];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new Main({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=cpb.js.map
