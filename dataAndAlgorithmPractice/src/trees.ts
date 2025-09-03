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

let root = new TreeNode(1);

root.left = new TreeNode(2);
root.right = new TreeNode(3);

root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

let tree = new Tree(1);

console.log(traversePreOrder(root));
console.log(inorder(root));
console.log(postorder(root));
