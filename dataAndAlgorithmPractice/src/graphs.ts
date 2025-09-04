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

function dfsIterative(_graph: Graph, start: string) {

    let stack: string[] = [start];
    let visited = new Set<string>();

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

            console.log('visited: ', visited);

            console.log(`neighbords of ${node}: ${_graph.getNeighbors(node)}`);

            // push neighbors to stack (LIFO)
            for(const neighbor of _graph.getNeighbors(node)) {
                if(!visited.has(neighbor))stack.push(neighbor);
            }
        }

    }


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
