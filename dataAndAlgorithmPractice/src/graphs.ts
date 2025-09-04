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
        return this.adjList.get('A');
    }
}

function dfs(_graph: Graph, node: string, visited = new Set<string>()): void {

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
        dfs(_graph, neighbor, visited);
    }
}

function dfsRecursive(graph: Graph, start: string, visited = new Set<string>()) {
    if (visited.has(start)) return;
    console.log(start);
    visited.add(start);

    for (const neighbor of graph.getNeighbors(start)) {
      dfsRecursive(graph, neighbor, visited);
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

console.log(graph);
console.log(dfs(graph, 'A'));
console.log(dfsRecursive(graph, 'A'));
