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

    concatenate(listToConcatenate: LinkedList) {
        let current: ListNode | null = this.head;

        // traverse until end of list
        while(current?.next) {
            current = current.next;
        }

        // update next current ot head of listToConcatenate
        if (current) {
            current.next = listToConcatenate.head;
        }
        else {
            this.head = listToConcatenate.head;
        }
    }

    mergeSorted(listToMerge: LinkedList) {

        // get head of 2 lists
        let l1 : ListNode | null = this.head;
        let l2 : ListNode | null = listToMerge.head;

        // new list
        let newList = new LinkedList();

        while(l1 || l2) {
            // if l1 < l2 OR l1 is defined but l2 is null
            if((l1 && l2 && (l1?.value <= l2?.value) || (l1 && !l2))){
                // set node as l1
                newList.append(l1.value)
                // update l1
                l1 = l1.next;
            }
            // if l1 > l2 OR l1 is null and l2 is defined
            else if((l1 && l2 && (l1?.value > l2?.value)) || (!l1 && l2)) {
                // set node as l2
                newList.append(l2.value);
                // update l2
                l2 = l2?.next
            }
        }

        // update head
        this.head = newList.head;
    }

    mergeSorted2(listToMerge: LinkedList) {
        // to simplify the first element (at the end it returns dummy.next)
        let dummy: ListNode = new ListNode(-1);

        // get current iterator
        let current: ListNode = dummy;

        let l1: ListNode | null = this.head;
        let l2: ListNode | null = listToMerge.head;

        while(l1 !== null && l2 !== null) {
            if(l1.value <= l2.value) {
                current.next = l1;
                l1 = l1.next;
            }
            else {
                current.next = l2;
                l2 = l2.next;
            }

            current = current.next;
        }

        if(l1 === null) current.next = l2;
        if(l2 === null) current.next = l1;

        return dummy.next;
    }

    removeLastElement():void {
        let current: ListNode | null = this.head;
        let prev: ListNode | null = null;
        while(current?.next) {
            prev = current;
            current = current.next;
        }

        // when reach the last node, update next of prev to null
        if(prev) {prev.next = null}
    }

    removeElementFromEnd(n = number) {

        const dummy = new ListNode(0);
        dummy.next = this.head;

        let slow: ListNode | null = dummy;
        let fast: ListNode | null = dummy;

        // Move fast pointer n+1 steps ahead
        for (let i = 0; i <= n; i++) {
            if (fast) fast = fast.next;
        }

        // Move both pointers until fast reaches the end
        while (fast) {
            slow = slow!.next;
            fast = fast.next;
        }

        // Remove the node
        if (slow && slow.next) {
            slow.next = slow.next.next;
        }

        // Update head in case first node was removed
        this.head = dummy.next;

    }

}

let list1 = new LinkedList();
list1.append(1);
// list1.append(2);
list1.append(3);
// list1.append(4);
// list1.append(5);

let list2 = new LinkedList();
list2.append(2);
list2.append(7);

// execute test
assertEquals(list1.traverse(), [1,2, 3, 4, 5], 'shuold be [1,2] when adding 2 elements');

// test reverse
// list1.reverse()
// assertEquals(list1.traverse(), [5, 4, 3,2,1], 'shuold be [2,1] when calling reverse()');

// test is cycle
assertEquals(list1.isCycle(), false, 'shuold not be cycle when list is not cycled');
// // convert to cycle
// list1.setLastAsLink()
// assertEquals(list1.isCycle(), true, 'shuold be cycle when list is closed');
// assertEquals(list1.isCycleFloidAlgorithm(), true, 'should be cycle when list is closed (floid algorithm)');

// test find middle node
assertEquals(list1.findMiddleNode()?.value, 3, 'should return the middle node when running method');

// test concatenate
// list1.concatenate(list2)
// assertEquals(list1.traverse(), [5,4,3,2,1,6,7], 'should concatenate lists when executing concatenate()')

list1.mergeSorted2(list2)
assertEquals(list1.traverse(), [1, 2, 3, 7], 'should sort the list when running mergeSeorted()');

console.log(list1.traverse())
list1.removeLastElement()
console.log(list1.traverse())
