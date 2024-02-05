var expect = require('expect.js');
var ia = require('../../dist/ia.js');

describe('Universe', function() {

	describe('constructor', function() {
		it("should be a subclass of Node", function() {
			var u = new ia.Universe();
			expect(u).to.be.a(ia.Node);
		});
	});

	describe('constructor', function() {
		it("should initialize with an empty list of children", function() {
			var u = new ia.Universe();
			expect(u.children.length).to.equal(0);
		});
	});

	describe('#sitemap', function() {
		it("empty Universe should have sitemap with one element", function() {
			var u = new ia.Universe();
			expect(u.sitemap().length).to.equal(1);
		});
	});

});

describe('Node', function() {

	describe('#normalizeName', function() {
		it("should reject empty name", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			expect(n.normalizeName.bind(this)).withArgs('').to.throwError();
		});

		it("should reject name with slashes", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			expect(n.normalizeName.bind(this)).withArgs('name/with/slashes').to.throwError();
		});

		it("should accept name with legal characters (no modifier)", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			var name = '_name-09.3';
			expect(n.normalizeName(name)).to.equal(name);
		});

		it("should default to lowercase", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			expect(n.normalizeName('Upper')).to.equal('upper');
		});

		it("should not lowercase in case-sensitive universe", function() {
			var u = new ia.Universe();
			u.caseSensitive = true;
			var n = new ia.Node(u);
			expect(n.normalizeName('Upper')).to.equal('Upper');
		});

		it("should allow name with * modifier", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			var name = "*test";
			expect(n.normalizeName(name)).to.equal(name);
		});

		it("should allow name with & modifier", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			var name = "&test";
			expect(n.normalizeName(name)).to.equal(name);
		});
	});

	describe('#normalizePath', function() {
		it("should reject empty path", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			expect(n.normalizeName.bind(this)).withArgs('').to.throwError();
		});

		it("should allow root path", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			expect(n.normalizePath('/')).to.equal('/');
		});

		it("should allow relative path (direct child)", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			expect(n.normalizePath('name')).to.equal('name');
		});

		it("should allow relative path", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			expect(n.normalizePath('a/b')).to.equal('a/b');
		});

		it("should allow absolute path", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			expect(n.normalizePath('/a/b')).to.equal('/a/b');
		});

		it("should remove trailing slash", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			expect(n.normalizePath('/a/b/')).to.equal('/a/b');
		});
	});

	describe('#insertChild', function() {
		it("should return Node", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			expect(n.insertChild("child")).to.be.a(ia.Node);
		});

		it("should increase children count by 1", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			n.insertChild("child");
			expect(n.children.length).to.be(1);
		});

		it("should add entry in childrenMap", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			n.insertChild("child");
			expect(n.childrenMap["child"]).to.be.a(ia.Node);
		});

		it("should return Node with correct payload", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			var payload = {};
			expect(n.insertChild("child", ia.INSERT_LAST_CHILD, payload).payload).to.equal(payload);
		});

		it("should return Node with correct parent", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			var payload = {};
			expect(n.insertChild("child").parent).to.equal(n);
		});

		it("should throw error on name collision", function() {
			var u = new ia.Universe();
			var n = new ia.Node(u);
			n.insertChild("child");
			expect(n.insertChild.bind(n)).withArgs("child").to.throwError();
		});
	});

	describe('#insertSibling', function() {
		it("should return Node", function() {
			var u = new ia.Universe();
			var parent = new ia.Node(u);
			var child = parent.insertChild("child");
			expect(child.insertSibling("sibling")).to.be.a(ia.Node);
		});

		it("should not increase children count", function() {
			var u = new ia.Universe();
			var parent = new ia.Node(u);
			var child = parent.insertChild("child");
			expect(child.insertSibling("sibling").children.length).to.be(0);
		});

		it("should increase parent children count", function() {
			var u = new ia.Universe();
			var parent = new ia.Node(u);
			var child = parent.insertChild("child");
			child.insertSibling("sibling");
			expect(parent.children.length).to.be(2);
		});

		it("should return Node with correct parent", function() {
			var u = new ia.Universe();
			var parent = new ia.Node(u);
			var child = parent.insertChild("child");
			expect(child.insertSibling("sibling").parent).to.be(parent);
		});

		it("should return Node with correct payload", function() {
			var u = new ia.Universe();
			var parent = new ia.Node(u);
			var payload = {};
			var child = parent.insertChild("child");
			expect(child.insertSibling("sibling", ia.INSERT_BEFORE, payload).payload).to.be(payload);
		});

		it("should throw error on name collision", function() {
			var u = new ia.Universe();
			var parent = new ia.Node(u);
			var child = parent.insertChild("child");
			child.insertSibling("sibling");
			expect(child.insertSibling.bind(child)).withArgs("sibling").to.throwError();
		});
	});

});