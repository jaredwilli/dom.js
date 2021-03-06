defineLazyProperty(impl, "Leaf", function() {
    // This class defines common functionality for node subtypes that
    // can never have children
    function Leaf() {}

    Leaf.prototype = Object.create(impl.Node.prototype, {
        hasChildNodes: constant(function() { return false; }),
        childNodes: constant([]),
        firstChild: constant(null),
        lastChild: constant(null),
        insertBefore: constant(HierarchyRequestError),
        replaceChild: constant(HierarchyRequestError),
        removeChild: constant(HierarchyRequestError),
        appendChild: constant(HierarchyRequestError),
    });

    return Leaf;
});