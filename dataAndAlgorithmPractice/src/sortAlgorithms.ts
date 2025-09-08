function assertEquals(actual: any, expected: any, testName: string) {
    if(JSON.stringify(actual) === JSON.stringify(expected)){
        console.log(`Test ${testName} passed ✅`);
    }
    else {
        console.log(`Test ${testName} failed ❌`);
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

let array = [5,4,3,2,1];
let sortedArray = [1,2,3,4,5];

assertEquals(bubbleSort(array), sortedArray, 'should be sorted when calling bubbleSort over array');
