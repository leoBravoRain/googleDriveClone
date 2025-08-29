class Stack<T> {
    private readonly items: T[] = [];

    // add element on top of stack
    push(item: T) {
        this.items.push(item);
    }

    // remove element fro top of stack
    pull(): T | undefined {
        return this.items.pop();
    }

    // see top element
    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

}

class Queue<T> {
    private readonly items: T[] = [];

    // add element to end of array
    enqueue(item: T): void {
        this.items.push(item);
    }

    // remove the first element of array
    dequeue(): void {
        this.items.shift();
    }

    // see peek (front)
    peek(): T | undefined {
        return this.items[0];
    }

    // see rear
    back(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }

}

let stack = new Stack<number>()

stack.push(1);
stack.push(2);
console.log(stack.peek());

let browserHistory = new Stack<string>();

// simulate visit a webpage
browserHistory.push('www.page.com');
console.log(browserHistory.peek())

// simulate another page visit
browserHistory.push('www.page.com/login');
console.log(browserHistory.peek())

// simulate back button action
browserHistory.pull()
console.log(browserHistory.peek())

// craete queue
let queue = new Queue<number>();

queue.enqueue(3);
queue.enqueue(4);
queue.enqueue(5);
console.log(queue.peek())
queue.dequeue()
console.log(queue.peek())

// vlidat parenthesis
function isValidParenthesis(word: string) {

    if(!word) return false;

    // stack to keep track of opening parenthesis
    let parenthesis = new Stack<string>();

    // dict to store parenthesis
    const dictPar: { [key: string]: string } = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    // iterate over character
    for(let i=0; i<=word.length; ++i) {

        let char = word[i];

        // if it's opening parenthesis
        if(char === '(' || char === '{' || char === '['){
            parenthesis.push(char);
        }
        // if it's a closing parenthesis
        else {
            if(parenthesis.pull() !== dictPar[char]) return false
        }
    }

    return parenthesis.isEmpty();

}

console.log(isValidParenthesis('([)]'));
