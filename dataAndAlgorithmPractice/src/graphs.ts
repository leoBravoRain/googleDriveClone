class Graph {
    private adjList: Map<string, string[]>;

    constructor() {
        this.adjList = new Map();
    }

    addVertice(vertex: string) {
        this.adjList.set(vertex, []);
    }

    addEdge(v1: string, v2: string) {
        this.adjList.get(v1)?.push(v2);
        this.adjList.get(v2)?.push(v1);
    }

    getNeighbors(v1: string) {
        return this.adjList.get(v1);
    }
}

function dfsRecursive(_graph: Graph, node: string, visited = new Set<string>()): void {

    // check if node was already visited
    if(visited.has(node)) return;

    // visit node
    console.log(node);

    // update visited set
    visited.add(node);

    // console.log('visited: ', visited);

    // console.log(`neighbors of ${node}`, graph.getNeighbors(node));

    // iterate over each neighbor
    for(const neighbor of _graph.getNeighbors(node)) {
        // console.log(`neighbor to visit: ${neighbor}`);
        dfsRecursive(_graph, neighbor, visited);
    }
}

function dfsIterative(_graph: Graph, start: string): number {

    let stack: string[] = [start];
    let visited = new Set<string>();
    let numNodes = 0;

    while(stack.length > 0) {

        console.log('stack: ', stack);

        // remove last elemtn (LIFO)
        let node = stack.pop();

        // skip visited
        if(!visited.has(node)) {

            // visit node
            console.log('visiting: ', node);

            // update visited
            visited.add(node);

            // update nodes counter
            numNodes += 1;

            console.log('visited: ', visited);

            console.log(`neighbords of ${node}: ${_graph.getNeighbors(node)}`);

            // push neighbors to stack (LIFO)
            for(const neighbor of _graph.getNeighbors(node)) {
                if(!visited.has(neighbor))stack.push(neighbor);
            }
        }

    }

    return numNodes


}

function bfsIterative(_graph: Graph, start: string) {

    let queue: string[] = [start];
    let visited = new Set<string>();

    while(queue.length > 0) {

        console.log('queue: ', queue);

        // remove last elemtn (LIFO)
        let node = queue.shift();

        // skip visited
        if(!visited.has(node)) {

            // visit node
            console.log('visiting: ', node);

            // update visited
            visited.add(node);

            console.log('visited: ', visited);

            console.log(`neighbords of ${node}: ${_graph.getNeighbors(node)}`);

            // push neighbors to queue (LIFO)
            for(const neighbor of _graph.getNeighbors(node)) {
                queue.push(neighbor);
            }
        }
    }
}
// A - B
// |   |
// C - D

// {
//     A: [B, C],
//     B: [A, D],
//     C: [A, D],
//     D: [C, B]
// }

let graph = new Graph();
graph.addVertice('A');
graph.addVertice('B');
graph.addVertice('C');
graph.addVertice('D');
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('D', 'C');

console.log('graph: ', graph);
// console.log('dfs recursive: ', dfsRecursive(graph, 'A'));
console.log('dfs iterative: ', dfsIterative(graph, 'A'));
console.log('bfs iterative: ', bfsIterative(graph, 'A'));

// algorithms

// Number of islands
function numIsland(grid: number[][]): number{

    // keep track of island
    let counter = 0;

    const rows = grid.length;
    const cols = grid[0].length;

    // remove island from an specific 1 (from 1 to 0)
    function dfsInternal(r: number, c: number) {

        // console.log(`removing island from index: [${r}, ${c}] `);

        // it's not part of the island
        if (c < 0 || c > cols-1 || r < 0 || r > rows-1 || grid[r][c] === 0) {
            return
        }

        // mark visited node as 0
        grid[r][c] = 0;

        // check all neighbors
        dfsInternal(r, c - 1);
        dfsInternal(r, c + 1);
        dfsInternal(r+1, c);
        dfsInternal(r-1, c);
    }

    // iterate over each element in matrix
    for(let r = 0; r < rows; ++r ) {
        for(let c = 0; c < cols; ++c ) {

            if(grid[r][c] === 1) {

                // remove elements from same island (mark as 0)
                dfsInternal(r, c);

                // update island counter
                ++counter;
            }
        }
    }

    return counter;

}

class NodeValue {
    value: number;
    neighbors: Node[];

    constructor(value: number, neighbors?: NodeValue[]) {
        this.value = value;
        this.neighbors = [];
    }
}

function cloneGraph(node: NodeValue) {

    // visited node (to avoid cycle loop)
    let oldToNew = new Map<NodeValue, NodeValue>();

    // visit each node in graph
    function dfsInternal(_node: NodeValue) {

        // if already visited, then return that node
        if(oldToNew.has(_node)) return oldToNew.get(_node);

        // create copy node iwth value and without neighbors
        let copy = new NodeValue(_node.value);

        // add copy to visited
        oldToNew.set(_node, copy);

        // iterate over each neighbor and create copy
        for(const nei of _node.neighbors) {
            copy.neighbors.push(dfsInternal(nei));
        }

        return copy;

    }

    return dfsInternal(node);
};

let grid = [
    [1, 1, 0, 0],
    [1, 0, 1, 1],
    [0, 0, 1, 1],
    [1, 0, 1, 1]
]

let root = new NodeValue(1, [new NodeValue()])

console.log('num islands: ', numIsland(grid));
