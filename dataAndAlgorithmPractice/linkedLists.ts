function assertEquals(actual: any, expected: any, testName: string) {
    if(JSON.stringify(actual) === JSON.stringify(expected)){
        console.log(`Test ${testName} passed ✅`);
    }
    else {
        console.log(`Test ${testName} failed ❌`);
    }
}

class ListNode {
    value: number;
    next: ListNode | null;
    constructor(value: number) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    head: ListNode | null = null;

    traverse(): number[] {
        let values: number[] = [];

        let current: ListNode | null = this.head;

        while(current) {
            values.push(current.value);
            current = current.next;
        }

        return values;
    }

    append(value: number): void {
        const newNode: ListNode = new ListNode(value);

        if (!this.head) {
            this.head = newNode;
        } else {
            let current: ListNode = this.head;

            // traverse until last node
            while(current.next) {
                current = current.next;
            }

            current.next = newNode;
        }

    }

    reverse(): void {
        let prev: ListNode | null = null;
        let current: ListNode | null = this.head;
        let next: ListNode | null = null;

        while (current) {
            // Store the next node
            next = current.next;

            // Reverse the link
            current.next = prev;

            // Move prev and current one step forward
            prev = current;
            current = next;
        }

        // Update the head to point to the new first node
        this.head = prev;
    }

    setLastAsLink() {
        let current: ListNode | null = this.head;
        let prev: ListNode | null = null;

        while(current?.next){
            prev = current;
            current = current.next;
        }

        // link last to prev
        if (current) {
            current.next = prev;
        }
    }

    isCycle(): boolean {
        let current: ListNode | null = this.head;
        let prev: ListNode | null = null;
        let isCycle: boolean = false;

        while(current && !isCycle) {
            if(prev !== null && current.next !== null && current.next === prev) {
                isCycle = true;
            }
            prev = current;
            current = current.next;
        }

        return isCycle
    }

    // O(n)
    // Tortoise (current.next) and Hale (current.next.next) algorithm.
    isCycleFloidAlgorithm() {
        let slow: ListNode | null | undefined = this.head;
        let fast: ListNode | null | undefined = this.head;
        let isCycle: boolean = false;

        while(fast && !isCycle){

            // update slow and fast
            slow = slow?.next;
            fast = fast?.next?.next;

            // fast reach slow (cycle)
            if (fast === slow) {
                isCycle = true;
            }
        }

        return isCycle;
    }

    findMiddleNode() {
        let slow: ListNode | null | undefined = this.head;
        let fast: ListNode | null | undefined = this.head;

        // TODO: check if it's not cycle
        while(fast) {

            // update fast and slow
            slow = slow?.next;
            fast = fast?.next?.next;

            // fast has reached the end
            if(fast?.next === null) {
                return slow;
            }

        }
    }

}

let list1 = new LinkedList();
list1.append(1);
list1.append(2);
list1.append(3);
list1.append(4);
list1.append(5);

// execute test
assertEquals(list1.traverse(), [1,2, 3, 4, 5], 'shuold be [1,2] when adding 2 elements');

// test reverse
list1.reverse()
assertEquals(list1.traverse(), [5, 4, 3,2,1], 'shuold be [2,1] when calling reverse()');

// test is cycle
assertEquals(list1.isCycle(), false, 'shuold not be cycle when list is not cycled');
// // convert to cycle
// list1.setLastAsLink()
// assertEquals(list1.isCycle(), true, 'shuold be cycle when list is closed');
// assertEquals(list1.isCycleFloidAlgorithm(), true, 'should be cycle when list is closed (floid algorithm)');

// test find middle node
assertEquals(list1.findMiddleNode()?.value, 3, 'should return the middle node when running method');
