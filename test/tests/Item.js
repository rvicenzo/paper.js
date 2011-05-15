module('Item');

test('copyTo(document)', function() {
	var doc = paper.document;
	var path = new Path();
	var secondDoc = new Document();
	var copy = path.copyTo(secondDoc);
	equals(function() {
		return secondDoc.activeLayer.children.indexOf(copy) != -1;
	}, true);
	equals(function() {
		return doc.activeLayer.children.indexOf(copy) == -1;
	}, true);
	equals(function() {
		return copy != path;
	}, true);
});

test('copyTo(layer)', function() {
	var doc = paper.document;
	var path = new Path();

	var layer = new Layer();
	var copy = path.copyTo(layer);
	equals(function() {
		return layer.children.indexOf(copy) != -1;
	}, true);
	equals(function() {
		return doc.layers[0].children.indexOf(copy) == -1;
	}, true);
});

test('clone()', function() {
	var doc = paper.document;
	var path = new Path();
	var copy = path.clone();
	equals(function() {
		return doc.activeLayer.children.length;
	}, 2);
	equals(function() {
		return path != copy;
	}, true);
});

test('appendChild(item)', function() {
	var doc = paper.document;
	var path = new Path();
	doc.activeLayer.appendChild(path);
	equals(function() {
		return doc.activeLayer.children.length;
	},  1);
});

test('item.parent / item.isChild / item.isParent', function() {
	var doc = paper.document;
	var secondDoc = new Document();
	var path = new Path();
	doc.activeLayer.appendChild(path);
	equals(function() {
		return doc.activeLayer.children.indexOf(path) != -1;
	}, true);
	secondDoc.activeLayer.appendTop(path);
	equals(function() {
		return doc.activeLayer.isChild(path);
	}, false);
	equals(function() {
		return path.isParent(doc.activeLayer);
	}, false);
	equals(function() {
		return secondDoc.activeLayer.isChild(path);
	}, true);
	equals(function() {
		return path.isParent(secondDoc.activeLayer);
	}, true);
	equals(function() {
		return doc.activeLayer.children.indexOf(path) == -1;
	}, true);
	equals(function() {
		return secondDoc.activeLayer.children.indexOf(path) == 0;
	}, true);
});

test('item.lastChild / item.firstChild', function() {
	var doc = paper.document;
	var path = new Path();
	var secondPath = new Path();
	equals(function() {
		return doc.activeLayer.firstChild == path;
	}, true);
	equals(function() {
		return doc.activeLayer.lastChild == secondPath;
	}, true);
});

test('appendBottom(item)', function() {
	var doc = paper.document;
	var path = new Path();
	var secondPath = new Path();
	doc.activeLayer.appendBottom(secondPath);
	equals(function() {
		return secondPath.index < path.index;
	}, true);
});

test('moveAbove(item)', function() {
	var doc = paper.document;
	var path = new Path();
	var secondPath = new Path();
	path.moveAbove(secondPath);
	equals(function() {
		return doc.activeLayer.lastChild == path;
	}, true);
});

test('moveBelow(item)', function() {
	var doc = paper.document;
	var firstPath = new Path();
	var secondPath = new Path();
	equals(function() {
		return secondPath.index > firstPath.index;
	}, true);
	secondPath.moveBelow(firstPath);
	equals(function() {
		return secondPath.index < firstPath.index;
	}, true);
});

test('isDescendant(item) / isAncestor(item)', function() {
	var doc = paper.document;
	var path = new Path();
	equals(function() {
		return path.isDescendant(doc.activeLayer);
	}, true);
	equals(function() {
		return doc.activeLayer.isDescendant(path);
	}, false);
	equals(function() {
		return path.isAncestor(doc.activeLayer);
	}, false);
	equals(function() {
		return doc.activeLayer.isAncestor(path);
	}, true);
	
	// an item can't be its own descendant:
	equals(function() {
		return doc.activeLayer.isDescendant(doc.activeLayer);
	}, false);
	// an item can't be its own ancestor:
	equals(function() {
		return doc.activeLayer.isAncestor(doc.activeLayer);
	}, false);
});

test('isGroupedWith', function() {
	var doc = paper.document;
	var path = new Path();
	var secondPath = new Path();
	var group = new Group([path]);
	var secondGroup = new Group([secondPath]);
	
	equals(function() {
		return path.isGroupedWith(secondPath);
	}, false);
	secondGroup.appendTop(path);
	equals(function() {
		return path.isGroupedWith(secondPath);
	}, true);
	equals(function() {
		return path.isGroupedWith(group);
	}, false);
	equals(function() {
		return path.isDescendant(secondGroup);
	}, true);
	equals(function() {
		return secondGroup.isDescendant(path);
	}, false);
	equals(function() {
		return secondGroup.isDescendant(secondGroup);
	}, false);
	equals(function() {
		return path.isGroupedWith(secondGroup);
	}, false);
	paper.document.activeLayer.appendTop(path);
	equals(function() {
		return path.isGroupedWith(secondPath);
	}, false);
	paper.document.activeLayer.appendTop(secondPath);
	equals(function() {
		return path.isGroupedWith(secondPath);
	}, false);
});

test('getPreviousSibling() / getNextSibling()', function() {
	var firstPath = new Path();
	var secondPath = new Path();
	equals(function() {
		return firstPath.nextSibling == secondPath;
	}, true);
	equals(function() {
		return secondPath.previousSibling == firstPath;
	}, true);
	equals(function() {
		return secondPath.nextSibling == null;
	}, true);
});

test('reverseChildren()', function() {
	var doc = paper.document;
	var path = new Path();
	var secondPath = new Path();
	var thirdPath = new Path();
	equals(function() {
		return doc.activeLayer.firstChild == path;
	}, true);
	doc.activeLayer.reverseChildren();
	equals(function() {
		return doc.activeLayer.firstChild == path;
	}, false);
	equals(function() {
		return doc.activeLayer.firstChild == thirdPath;
	}, true);
	equals(function() {
		return doc.activeLayer.lastChild == path;
	}, true);
});

test('Check item#document when moving items across documents', function() {
	var doc = paper.document;
	var doc1 = new Document();
	var path = new Path();
	var group = new Group();
	group.appendTop(new Path());
	
	equals(function() {
		return path.document == doc1;
	}, true);
	var doc2 = new Document();
	doc2.activeLayer.appendTop(path);
	equals(function() {
		return path.document == doc2;
	}, true);
	
	doc2.activeLayer.appendTop(group);
	equals(function() {
		return group.children[0].document == doc2;
	}, true);
});

test('group.selected', function() {
	var path = new Path([0, 0]);
	var path2 = new Path([0, 0]);
	var group = new Group([path, path2]);
	path.selected = true;
	equals(function() {
		return group.selected;
	}, true);
	
	path.selected = false;
	equals(function() {
		return group.selected;
	}, false);
	
	group.selected = true;
	equals(function() {
		return path.selected;
	}, true);
	equals(function() {
		return path2.selected;
	}, true);
	
	group.selected = false;
	equals(function() {
		return path.selected;
	}, false);
	equals(function() {
		return path2.selected;
	}, false);
});

test('Check parent children object for named item', function() {
	var path = new Path();
	path.name = 'test';
	equals(function() {
		return paper.document.activeLayer.children['test'] == path;
	}, true);
	
	var path2 = new Path();
	path2.name = 'test';
	
	equals(function() {
		return paper.document.activeLayer.children['test'] == path2;
	}, true);
	
	path2.remove();
	
	equals(function() {
		return paper.document.activeLayer.children['test'] == path;
	}, true);
	
	path.remove();
	
	equals(function() {
		return !paper.document.activeLayer.children['test'];
	}, true);
});

test('Named child access', function() {
	var path = new Path();
	path.name = 'test';

	var path2 = new Path();
	path2.name = 'test';
	
	path.remove();
	
	equals(function() {
		return paper.document.activeLayer.children['test'] == path2;
	}, true);
});

test('Named child access 2', function() {
	var path = new Path();
	path.name = 'test';

	var path2 = new Path();
	path2.name = 'test';
	
	path.remove();
	
	equals(function() {
		return paper.document.activeLayer.children['test'] == path2;
	}, true);
	
	equals(function() {
		return paper.document.activeLayer._namedChildren['test'].length == 1;
	}, true);
	
	path2.remove();

	equals(function() {
		return !paper.document.activeLayer._namedChildren['test'];
	}, true);
	
	equals(function() {
		return paper.document.activeLayer.children['test'] === undefined;
	}, true);
});

test('Named child access 2', function() {
	var path = new Path();
	path.name = 'test';

	var path2 = new Path();
	path2.name = 'test';
	
	var group = new Group();
	
	group.appendTop(path2);
	
	equals(function() {
		return paper.document.activeLayer.children['test'] == path;
	}, true);
	
	equals(function() {
		return paper.document.activeLayer._namedChildren['test'].length == 1;
	}, true);

	equals(function() {
		return group.children['test'] == path2;
	}, true);
	
	equals(function() {
		return group._namedChildren['test'].length == 1;
	}, true);
	
	paper.document.activeLayer.appendTop(path2);

	equals(function() {
		return group._namedChildren['test'] === undefined;
	}, true);
	
	equals(function() {
		return paper.document.activeLayer._namedChildren['test'].length == 2;
	}, true);
});

test('Setting name of child back to null', function() {
	var path = new Path();
	path.name = 'test';

	var path2 = new Path();
	path2.name = 'test';

	equals(function() {
		return paper.document.activeLayer.children['test'] == path2;
	}, true);

	path2.name = null;

	equals(function() {
		return paper.document.activeLayer.children['test'] == path;
	}, true);
	
	path.name = null;
	
	equals(function() {
		return paper.document.activeLayer.children['test'] === undefined;
	}, true);
});

test('Renaming item', function() {
	var path = new Path();
	path.name = 'test';
	
	path.name = 'test2';
	
	equals(function() {
		return paper.document.activeLayer.children['test'] === undefined;
	}, true);
	
	equals(function() {
		return paper.document.activeLayer.children['test2'] == path;
	}, true);
});
