function assertEquals(actual: any, expected: any, testName: string) {
    if(JSON.stringify(actual) === JSON.stringify(expected)){
        console.log(`Test: ${testName} -> passed ✅`);
    }
    else {
        console.log(`Test: ${testName} -> failed ❌`);
    }
}

// O(log n)
function binarySearch(nums: number[], target: number): number {

    let left = 0;
    let right = nums.length - 1;

    // iterate over array
    while(left <= right) {

        const mid = Math.floor((right + left)/2);

        // if target was found
        if (target === nums[mid]) {
            return mid;
        }

        // if target is smaller than mid
        else if (target < nums[mid]) {
            right = mid-1;
        }
        // if target is greater than mid
        else {
            left = mid + 1;
        }
    }

    // target not found
    return -1;
}

assertEquals(binarySearch([1,2,3,4,5], 4), 3, 'should return index if binarySearch was called');
assertEquals(binarySearch([1,2,3,4,5], 0), -1, 'should return -1 (not found) if binarySearch was called without target in array');
