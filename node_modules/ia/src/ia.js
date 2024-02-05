var debug = require('debug')('ia');

var INSERT_BEFORE = 'insert_before',
	INSERT_AFTER = 'insert_after',
	INSERT_FIRST_CHILD = 'insert_first_child',
	INSERT_LAST_CHILD = 'insert_last_child';

class Node {

	constructor(universe, name, payload, parent) {
		this.parent = parent;
		this.payload = payload;
		this.name = name;
		this.universe = universe;
		this.children = [];
		this.childrenMap = {};
	}

	normalizeName(name) {
		if(typeof name !== 'string' || name === '') throw new Error("Node name non-string or empty");
		if(!/^[*$]?[\w\d_-]+$/) throw new Error(`invalid Node name: ${name}`);
		return this.universe.caseSensitive ? name : name.toLowerCase();
	}

	normalizePath(path) {
		if(typeof path !== 'string') throw new Error(`invalid path: ${path}`);
		if(path === '/') return '/';	// special case for root
		return (path[0] === '/' ? '/' : '') + path.replace(/^\/|\/$/g, '').split('/').map(this.normalizeName, this).join('/');
	}

	insertChild(insertionPoint, insertionType, payload) {
		if(typeof insertionType === 'undefined') insertionType = INSERT_LAST_CHILD;
		if(insertionType !== INSERT_FIRST_CHILD && insertionType !== INSERT_LAST_CHILD) throw new Error("insertion type mus be one of ia.INSERT_FIRST_CHILD or ia.INSERT_LAST_CHILD");
		let name = this.normalizeName(insertionPoint);
		if(this.childrenMap[name]) throw new Error(`name collision: ${name}`);
		let n = new Node(this.universe, name, payload, this);
		this.children[insertionType === INSERT_FIRST_CHILD ? 'unshift' : 'push'](n);
		this.childrenMap[name] = n;
		return n;
	}

	insertDescendent(insertionPoint, insertionType, payload) {
	}

	insertSibling(insertionPoint, insertionType, payload) {
		if(typeof insertionType === 'undefined') insertionType = INSERT_AFTER;
		if(insertionType !== INSERT_BEFORE && insertionType !== INSERT_AFTER) throw new Error("insertion type mus be one of ia.INSERT_BEFORE or ia.INSERT_AFTER");
		let name = this.normalizeName(insertionPoint);
		if(!this.parent) throw new Error("can't insert sibling of Node with no parent");
		if(this.parent.children[name]) throw new Error(`name collision: ${name}`);
		let idx = this.parent.children.indexOf(this);
		let n = new Node(this.parent.universe, name, payload, this.parent);
		this.parent.children.splice(idx + (insertionType === INSERT_BEFORE ? 0 : 1), 0, n);
		this.parent.children[name] = n;
		return n;
	}

	insertDescendentSibling(insertionPoint, insertionType, payload) {
	}

	toNodeArray() {
		return [this];
	}
}

class Universe extends Node {
	constructor() {
		super();
	}

	sitemap() {
		return this.toNodeArray();
	}
}

module.exports = { 
	Node, 
	Universe,
	INSERT_BEFORE,
	INSERT_AFTER,
	INSERT_FIRST_CHILD,
	INSERT_LAST_CHILD,
};
