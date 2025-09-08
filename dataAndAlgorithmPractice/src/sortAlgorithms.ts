function assertEquals(actual: any, expected: any, testName: string) {
    if(JSON.stringify(actual) === JSON.stringify(expected)){
        console.log(`Test: ${testName} -> passed ✅`);
    }
    else {
        console.log(`Test: ${testName} -> failed ❌`);
    }
}

function bubbleSort(array: number[]): number[] {

    const n = array.length;
    let swipped = false;

    for(var i = 0; i < n; ++i) {
        // bubble j-element until end
        for(let j = 0; j < n - i; ++j) {
            if(array[j] > array[j+1]) {
                // swipe element moving greather to the end
                [array[j], array[j+1]] = [array[j+1], array[j]];

                swipped = true;
            }
        }

        if(!swipped) {
            console.log("no swipe, array already sorted");
            break
        };
    }

    return array;
}

function merge(left: number[], right: number[]): number[] {

    let i = 0, j = 0;
    let result: number[] = [];

    while(i < left.length && j < right.length) {
        if(left[i] < right[j]) {
            result.push(left[i]);
            ++i;
        } else {
            result.push(right[j]);
            ++j;
        }
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSort(nums: number[]): number[] {

    // base case: when array has 0 or 1 element
    if(nums.length <= 1) return nums;
    // divide
    const mid = Math.floor(nums.length/2);

    const left = mergeSort(nums.slice(0, mid));
    const right = mergeSort(nums.slice(mid));

    return merge(left, right);
}

let array = [5,4,3,2,1];
let sortedArray = [1,2,3,4,5];

// assertEquals(bubbleSort(array), sortedArray, 'should be sorted when calling bubbleSort over array');
assertEquals(mergeSort(array), sortedArray, 'should be sorted when calling mergeSort over array');
