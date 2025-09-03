class Tree<T> {
    root: TreeNode<T> | null;

    constructor(value: T) {
        this.root = new TreeNode(value);
    }

};

class TreeNode<T> {

    value: T;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;

    constructor(value: T){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

function traversePreOrder<T>(node: TreeNode<T> | null): void {
    if(!node) return;
    console.log(node.value);
    traversePreOrder(node.left);
    traversePreOrder(node.right);
}

// Inorder: Left -> Root -> Right
function inorder<T>(node: TreeNode<T> | null): void {
    if(!node) return;
    inorder(node.left);
    console.log(node.value);
    inorder(node.right);
}

// Postorder: Left -> Right -> Root
function postorder<T>(node: TreeNode<T> | null): void {
    if (!node) return;
    postorder(node.left);
    postorder(node.right);
    console.log(node.value);
}

function bfs<T>(root: TreeNode<T> | null): void {

    console.log('traverse bfs');

    // base case: empty tree
    if (!root) return;

    let queue: (TreeNode<T> | null)[] = [root];

    while (queue.length > 0) {

        // remove and return first element of array
        const node = queue.shift();

        console.log(node?.value);

        if(node?.left) queue.push(node.left);
        if(node?.right) queue.push(node.right);
    }
}

function maxDepthBinaryTree(root: TreeNode<any> | null): number {

    // base case
    if (!root) return 0;

    // recursion asking each child to get the max depth
    return 1 + Math.max(maxDepthBinaryTree(root?.left), maxDepthBinaryTree(root?.right));
}

function isSymmetric(root: TreeNode<any> | null): boolean {
    if (!root) return true;

    function isMirror(t1: TreeNode<any> | null, t2: TreeNode<any> | null) {

        if(!t1 && !t2) return true;
        if (!t1 || !t2) return false;

        return (
            t1.value === t2.value &&
            isMirror(t1.left, t2.right) &&
            isMirror(t1.right, t2.left)
        );

    }

    return isMirror(root.left, root.right);
}

function hasPathSum(root: TreeNode | null, target: number): boolean {
    if(!root) return false;

    // if node is leaf
    if(!root.left && !root.right) {
        return root.value === target;
    }

    // get new target to reach by subtrees (down the current node)
    let newTarget = target - root.value;

    // check if left or right subtrees can reach the new target
    return hasPathSum(root.left, newTarget) || hasPathSum(root.right, newTarget);

}

let root = new TreeNode(1);

root.left = new TreeNode(2);
root.right = new TreeNode(2);

// root.left.left = new TreeNode(4);
// root.left.right = new TreeNode(5);

// let tree = new Tree(1);

console.log(traversePreOrder(root));
console.log(inorder(root));
console.log(postorder(root));
console.log('bfs: ', bfs(root));
console.log('max depth binary tree: ', maxDepthBinaryTree(root));
console.log('is symmetric: ', isSymmetric(root));
console.log('has path sum: ', hasPathSum(root, 3));
