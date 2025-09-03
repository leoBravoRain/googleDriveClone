function assertEquals(actual: any, expected: any, testName: string) {
    if(JSON.stringify(actual) === JSON.stringify(expected)){
        console.log(`Test ${testName} passed ✅`);
    }
    else {
        console.log(`Test ${testName} failed ❌`);
    }
}

const map = new Map<string, number>();

map.set('apple', 2);
map.set('apple2', 2);

for(const [key, value] of map) {
    console.log(key, value)
}

function countCharacters(word: string): Map<string, number> {

    let counter = new Map<string, number>();

    for(let i = 0; i<word.length; ++i) {
        let char = word[i];

        console.log(char);

        if(!(char in counter)) {
            // counter.set(char, 0);
            counter[char] = 0;
        }

        // counter.set(char, (counter.get(char) ?? 0) + 1);
        counter[char] = counter[char] + 1;

    }

    return counter;
}

function twoSumHashMap(nums: number[], target: number) {

    let map = new Map<number, number>();

    for (let i = 0; i < nums.length; ++i) {
        let compliment = target - nums[i];

        // if compliment exists in map, so the number (compliment) was found
        if(map.has(compliment)) {

            // return compliement's index, index
            return [map.get(compliment), i];
        }

        // if not found, then add value -> index (to check if it can be useful by other number in the next iterarions)
        map.set(nums[i], i);
    }
    return [];
}

function containsDuplicate(nums: number[]): boolean {
    let set = new Set<number>(nums);

    return set.size !== nums.length;
}

function groupAnagrams(words: string[]): string[][] {

    let anagrams = new Map<string, string[]>();

    for(let i = 0; i<words.length; ++i) {

        let word = words[i];

        // get cannonical key
        let cannonicalKey = word.split('').sort().join('');

        // if not in map, then add it as key, [] (empty array)
        if(!anagrams.has(cannonicalKey)) {
            anagrams.set(cannonicalKey, []);
        }

        // add word to cannonical key
        // anagrams.set(cannonicalKey, anagrams.get(cannonicalKey)?.push(words[i]));
        anagrams.get(cannonicalKey)!.push(word);
    }

    return Array.from(anagrams.values());
}

// [1,2,3] ; target = 3 -> [1,2], [3] = 2

// test for two sum
console.log(assertEquals(twoSumHashMap([1, 3, 6, 2], 5), [1, 3], 'should return expected when target is 5'));
console.log(assertEquals(containsDuplicate([1,2]), false, 'should return true when there is duplicated elements' ));
console.log(assertEquals(groupAnagrams(["eat","tea","tan","ate","nat","bat"]), [["eat","tea","ate"],["tan","nat"],["bat"]], 'testing group anagrams'));


const set = new Set<string>;

set.add('apple');
set.add('pineApple');

console.log(set);

console.log('counting characteres: ', JSON.stringify(countCharacters('eliana')));

for(let value of set){
    console.log(value);
}
