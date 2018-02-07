module.exports = CategorySelectionService;

CategorySelectionService.$inject = ['_'];
function CategorySelectionService(_) {
    let internallyModified = false;
    let scope = {};
    return {
        handleParents: handleParents,
        childrenRemovedResult: childrenRemovedResult,
        parentsAddedResult: parentsAddedResult,
        childrenAllSelectedResult: childrenAllSelectedResult,
        parentsRemovedResult: parentsRemovedResult,
        parentToUnSelect: parentToUnSelect,
        childrenToReSelect: childrenToReSelect,
        allChildrenToUnselect: allChildrenToUnselect,
        isParent: isParent,
        internallyModified: internallyModified
    };
    function handleParents(newSelection, oldSelection, _scope) {
        scope = _scope;
        internallyModified = _scope.internallyModified;
        let result = angular.copy(newSelection);
        if (!internallyModified) {
            // changes when not internally modified AND a child was removed
            result = childrenRemovedResult(newSelection, oldSelection, result);
        }
        if (!internallyModified) {
            // changes when not internally modified AND a parent was removed
            result = parentsRemovedResult(newSelection, oldSelection, result);
        }
        if (!internallyModified) {
            // changes when not internally modified AND a parent was added
            result = parentsAddedResult(newSelection, oldSelection, result);
        }
        if (!internallyModified) {
            // changes when not internally modified AND all children of an unselected parent were selected
            result = childrenAllSelectedResult(newSelection, oldSelection, result);
        }

        return {internallyModified: internallyModified, result: result};
    }

    // unselect parent if child was removed
    function childrenRemovedResult(newSelection, oldSelection, result) {
        const findRemoved = _.difference(oldSelection, newSelection);
        const childRemoved = _.filter(findRemoved, (category) => { // return parents that were removed
            return !isParent(category);
        });
        if (childRemoved.length > 0) {
            result = _.filter(result, (categoryId) => {
                return categoryId !== parentToUnSelect(childRemoved[0]);
            });
            internallyModified = true;
        }
        return result;
    }

    function parentsAddedResult(newSelection, oldSelection, result) {
        const findAdded = _.difference(newSelection, oldSelection);
        if (findAdded.length > 0 && isParent(findAdded[0])) {
            _.each(newSelection, (any) => {
                const toAdd = childrenToReSelect(any);
                if (toAdd.length > 0) {
                    result = _.uniq(result.concat(toAdd));
                    internallyModified = true;
                }
            });
        }
        return result;
    }

    function childrenAllSelectedResult(newSelection, oldSelection, result) {
        const findAdded = _.difference(newSelection, oldSelection);
        if (findAdded.length > 0) {
            // for each parent in scope.parents, check if ALL their children are selected if a parent is unselected
            _.each(scope.parents, (parentCategory) => {
                const findParent = _.find(newSelection, (itm) => itm === parentCategory.id);
                if (!findParent) {
                    const contained = _.every(_.pluck(parentCategory.children, 'id'), (childId) => {
                        return _.find(newSelection, (itm) => itm === childId);
                    });
                    if (contained) {
                        result = _.uniq(result.concat(parentCategory.id));
                        internallyModified = true;
                    }
                }
            });
        }
        return result;
    }

    function parentsRemovedResult(newSelection, oldSelection, result) {
        const findRemoved = _.difference(oldSelection, newSelection);
        const parentsRemoved = _.filter(findRemoved, (category) => { // return parents that were removed
            return isParent(category);
        });
        if (findRemoved.length > 0 && parentsRemoved.length > 0) {
            _.each(parentsRemoved, (parent) => {
                const toReject = allChildrenToUnselect(parent);
                result = _.without(result, ...toReject);
                internallyModified = true;
            });
        }
        return result;
    }

    function parentToUnSelect(childId) {
        const parent = _.filter(scope.parents, (parent) => {
            const childFound = _.find(parent.children, (child) => {
                return child.id === childId;
            });
            return !!childFound;
        });
        return parent ? parent[0].id : null;
    }

    function childrenToReSelect(parentId) {
        const parent = _.find(scope.parents, (category) => {
            return category.id === parentId;
        });
        return parent ? _.pluck(parent.children, 'id') : [];
    }

    function allChildrenToUnselect(parentId) {
        const children = _.find(scope.parents, (category) => {
            return category.id === parentId;
        }).children;
        return _.pluck(children, 'id');
    }

    function isParent(categoryId) {
        const parent = _.find(scope.parents, (category) => {
            return category.id === categoryId;
        });
        return !!parent;
    }
}
