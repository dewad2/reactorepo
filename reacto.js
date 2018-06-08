////Needle in a haystack

//O(n*m) time
function indexOf(needle, haystack) {
  for (let i = 0; i < haystack.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (needle[j] !== haystack[j + i]) break;
      if (j + 1 === needle.length) return i;
    }
  }
  return -1;
}

//// Dictionary

//BINARY SEARCH - time O(m * log n) - m is word length, n is array length.  space O(1)
function definitionOf(word, dict) {
  // initialize indexes at the beginning and end of the dictionary, these define the bounds of our "search window"
  let prevLeft = 0;
  let prevRight = dict.length - 1;
  let index;
  // continue until the index has not changed from the previous cycle
  while (index !== prevLeft && index !== prevRight) {
    // find the middle of the existing search window
    index = Math.floor((prevLeft + prevRight) / 2);
    if (dict[index].startsWith(word + ' - ')) {
      // startsWith is a string comparison, takes O(m) time
      return dict[index].slice(word.length + 3); // "subtract" the word itself (plus the ' - ' part)
    }
    if (word < dict[index]) {
      // "shrink" the right half of the search window
      prevRight = index - 1;
    } else {
      // "shrink" the left half of the search window
      prevLeft = index + 1;
    }
  }
}

//CACHING! - time O(n) first time, O(1) after that. space O(n)

//this cache will hold ALL dictionaries (though we'll only ever have one)
const cache = new Map();

function findOrCreateHashMap(dict) {
  // use the dictionary array object itself as a KEY
  if (cache.has(dict)) return cache.get(dict);
  const hashMap = {};
  dict.forEach(entry => {
    const [word, definition] = entry.split(' - ');
    hashMap[word] = definition;
  });
  cache.set(dict, hashMap);
  return hashMap;
}

function definitionOf(word, dict) {
  const hashMap = findOrCreateHashMap(dict);
  return hashMap[word];
}

////stringPermutations
//for each letter you are on, place it before and after each letter,
//that is then the new string and do the same with next letter.
//deal with copies with a filter
//sort
//O(n!) - nFactorial (length, times each number below it ; if length=3, 3 x 2 x 1)

function stringPermutation(string) {
  var results = [];
  var letters = string.split('');
  results.push([letters.shift()]); //add first letter as an array to results
  while (letters.length) {
    var curLetter = letters.shift();
    var tmpResults = [];
    results.forEach(function(curResult) {
      for (var i = 0; i <= curResult.length; i++) {
        var tmp = curResult.slice(); //make a COPY so we can modify it
        tmp.splice(i, 0, curLetter); //insert the letter at the current position
        tmpResults.push(tmp);
      }
    });
    results = tmpResults; //overwrite the previous results
  }
  results = results.map(function(letterArr) {
    return letterArr.join(''); //make string from letter array
  });
  return results
    .filter(function(el, index) {
      return results.indexOf(el) === index; //filter out non-unique words, indexOf gives you the first index where it is found, so will only give you one.
    })
    .sort();
}

//PRIORITY Q - implement a priority queue with the following methods:

insert(data, priority);
peek();
popMax();

function PriorityQueue() {
  this.first = null;
}

function Node(data, priority) {
  this.data = data;
  this.priority = priority;
  this.next = null;
}

//O(n) for insert

PriorityQueue.prototype.insert = function(data, priority) {
  const newItem = new Node(data, priority);
  if (!this.first || this.first.priority < priority) {
    // First case: Check if the PQ is empty, or newItem's priority > this.first's
    newItem.next = this.first;
    this.first = newItem;
  } else {
    // Second case: Find where to insert newItem
    let currentNode = this.first;
    while (currentNode.next && currentNode.next.priority >= priority) {
      // Traverse queue until it finds a node with priority < search priority
      currentNode = currentNode.next;
    }
    // Here, currentNode is right before where you want to insert newItem. Point
    // newItem.next to currentNode.next, then point currentNode's next to newItem.
    newItem.next = currentNode.next;
    currentNode.next = newItem;
  }
};

PriorityQueue.prototype.peek = function() {
  return this.first.data;
};

PriorityQueue.prototype.popMax = function() {
  const maxVal = this.first;
  this.first = this.first.next;
  return maxVal.data;
};

//optimization - max heap

class HeapPQ {
  constructor() {
    this._items = [];
  }

  _swap(childIdx, parentIdx) {
    //underscores show as private method to the class
    [this._items[childIdx], this._items[parentIdx]] = [
      this._items[parentIdx],
      this._items[childIdx]
    ];
  }

  _parentIdx(childIdx) {
    return Math.floor((childIdx - 1) / 2);
  }

  _childrenIndices(parentIdx) {
    return [parentIdx * 2 + 1, parentIdx * 2 + 2];
  }

  _priority(i) {
    return this._items[i].priority;
  }

  insert(data, priority) {
    this._items.push({
      data,
      priority
    });
    this._heapifyUp();
  }

  _heapifyUp() {
    let currentIdx = this._items.length - 1;
    while (
      currentIdx > 0 &&
      this._items[currentIdx].priority >
        this._items[this._parentIdx(currentIdx)].priority
    ) {
      this._swap(currentIdx, this._parentIdx(currentIdx));
      currentIdx = this._parentIdx(currentIdx);
    }
  }

  //### peek

  peek() {
    return this._items[0].data;
  }

  //### popMax

  popMax() {
    const max = this._items[0];

    // replace the root with the last item in the collection
    this._items[0] = this._items.pop();

    this._heapifyDown();
    return max.data;
  }

  _heapifyDown() {
    let currentIdx = 0;
    let [left, right] = this._childrenIndices(currentIdx);
    let idxLarger;
    const length = this._items.length;
    while (left < length) {
      if (right < length) {
        idxLarger =
          this._priority(left) >= this._priority(right) ? left : right;
      } else idxLarger = left;

      if (this._priority(currentIdx) < this._priority(idxLarger)) {
        this._swap(idxLarger, currentIdx);
        currentIdx = idxLarger;
        [left, right] = this._childrenIndices(currentIdx);
      } else return;
    }
  }
}

//breadthFirst traversal (non binary search tree - unlimited children)
//O(n) - for both, because full tree traversal for both

const breadthFirst = (startingNode, cb) => {
  const queue = [startingNode];
  while (queue.length) {
    const node = queue.shift();
    cb(node.value);
    queue.push(...node.children);
  }
};

const depthFirstPreOrder = (startingNode, cb) => {
  cb(startingNode.value);
  startingNode.children.forEach(function(child) {
    depthFirstPreOrder(child, cb);
  });
};

const depthFirstPostOrder = (startingNode, cb) => {
  startingNode.children.forEach(function(child) {
    depthFirstPostOrder(child, cb);
  });
  cb(startingNode.value);
};

//find words starting with - using tries! - expensive to set up but great for look up after

const tries = {};

function buildTrie(text) {
  const trie = {};
  text = text.toLowerCase();

  for (let i = 0; i < text.length; i++) {
    let node = trie; //so not mutating the original
    const starting = i;

    while (text[i] && text[i] !== ' ' && text[i] !== ',' && text[i] !== '.') {
      const char = text[i]; //set constant char to the letter we are looking at
      node[char] = node[char] || {
        //here, if hasnt seen before it puts {indexes: []} at that letter, otherwise, puts the old index where it was seen into that indexes array.
        indexes: []
      };
      node[char].indexes.push(starting); //push that new index we are on (where the word started) into that indexes array
      node = node[char];
      i++;
    }
  }

  return trie;
}

function findOrCreateTrie(book) {
  //checking with the book id if we already made a trie for it
  if (!tries.hasOwnProperty(book.id)) {
    tries[book.id] = buildTrie(book.text);
  }

  return tries[book.id];
}

function findWordsStartingWith(book, prefix) {
  prefix = prefix.toLowerCase();
  const trie = findOrCreateTrie(book);
  let node = trie;

  for (let i = 0; i < prefix.length; i++) {
    const char = prefix[i];
    node = node[char]; //changing the 'node' we are looking at each time to be the specific character
    if (!node) return [];
  }

  return node.indexes;
}

//run in your console to see a trie!!!!
book = {
  id: 1,
  text: `Once upon a time, there was a book with words.
  The book had not been catalogued, but would catch the
  eyes of onlookers nonetheless.`
};

const tries = {};

function buildTrie(book) {
  const trie = {};
  text = book.text.toLowerCase();

  for (let i = 0; i < text.length; i++) {
    let node = trie;
    const starting = i;

    while (text[i] && text[i] !== ' ' && text[i] !== ',' && text[i] !== '.') {
      const char = text[i];
      node[char] = node[char] || {
        indexes: []
      };
      node[char].indexes.push(starting);
      node = node[char];
      i++;
    }
  }

  return trie;
}

buildTrie(book);

//does path exist - GRAPHS //Big O O(V+ E) where V is number of nodes and E is number of edges. with the visited {} add O(V) space
const graph = {
  a: ['a', 'c'],
  c: ['r', 's'],
  r: ['a'],
  s: []
};

doesPathExist(graph, 'a', 'a'); // true
doesPathExist(graph, 'c', 'c'); // true
doesPathExist(graph, 'r', 's'); // true
doesPathExist(graph, 's', 'a'); // false

const doesPathExist = (graph, start, target, visited = {}) => {
  if (!graph[start]) return false;
  visited[start] = true;

  return graph[start].some(vertex => {
    //some: breaks out and returns true if ever true is found, else returns false
    if (vertex === target) return true;
    if (!visited[vertex]) {
      return doesPathExist(graph, vertex, target, visited);
    } else {
      return false;
    }
  });
};

//also think of adjacency matrix as possibility for dense graph

//INTERSECTION -
//IF SORTED - RATCHETING  O(N + M)
function intersection(arrA, arrB) {
  const shared = [];
  let idxA = 0;
  let idxB = 0;
  while (idxA < arrA.length && idxB < arrB.length) {
    const elemA = arrA[idxA];
    const elemB = arrB[idxB];
    if (elemA == elemB) {
      shared.push(elemA);
    }
    if (elemA <= elemB) {
      idxA++;
    }
    if (elemA >= elemB) {
      idxB++;
    }
  }
  return shared;
}

//IF NOT SORTED - time O(n + m) space O(n)
function intersection(arrA, arrB) {
  //hashmap
  const smaller = arrB.length < arrA.length ? arrB : arrA;
  const larger = arrB.length >= arrA.length ? arrB : arrA;

  const hashSmaller = {};
  smaller.forEach(elem => (hashSmaller[elem] = true));

  return larger.filter(elem => hashSmaller.hasOwnProperty(elem));
}

function intersection(arrA, arrB) {
  //set - has method .has
  const smaller = arrB.length < arrA.length ? arrB : arrA;
  const larger = arrB.length >= arrA.length ? arrB : arrA;

  const setSmaller = new Set(smaller);

  return larger.filter(elem => setSmaller.has(elem));
}

//SUBSET SUM

function subsetSum(target, arr) {
  //double for loop O(n^2)
  let sums = [0];
  for (let i = 0; i < arr.length; i++) {
    let sumsCopy = [...sums]; // NOTE HERE!!!! create a new array to iterate through; iterating through the array that we're mutating will lead to some weird behavior - IT'S BETWEEN THE TWO FOR LOOPS, SO WILL GET THE NEW COPY FROM LINE 420 ON EACH NEW LOOP ITERATION
    for (let j = 0; j < sumsCopy.length; j++) {
      let newSum = sumsCopy[j] + arr[i];
      if (newSum === target) return true;
      else if (newSum < target) sums.push(newSum); //PUSHING TO SUMS IN LINE 420, NOT THE COPY(THE ONE WE ARE DOING OUR INNER LOOP OVER)
    }
  }
  return false;
}

// initialize the index to 0
function subsetSum(target, nums, idx = 0) {
  //recursion O(2^n)
  // if we've hit 0 we're done!
  if (target === 0) return true;
  // stop trying and return false if the target is negative OR if we've reached the end of the array
  if (target < 0 || idx === nums.length) return false;
  const num = nums[idx];
  // capture the boolean result for the possibility of *excluding* the current number from the sum
  // recursively try with the same target, but continue onto the next index
  const whenExcluded = subsetSum(target, nums, idx + 1);
  // capture the boolean result for the possibility of *including* the current number in the sum
  // recursively try with the target minus this number and continue onto the next index
  const whenIncluded = subsetSum(target - num, nums, idx + 1);
  // return whether either possibility came back true
  return whenExcluded || whenIncluded;
}

function subsetSum(target, nums, idx = 0, memo = {}) {
  //MEMOIZATION
  const key = target + '-' + idx;
  // if we've seen this target and already solved for it, return the answer right away
  if (memo.hasOwnProperty(key)) return memo[key];
  // if we've hit 0 we're done!
  if (target === 0) return true;
  // stop trying and return false if the target is negative OR if we've reached the end of the array
  if (target < 0 || idx === nums.length) return false;
  const num = nums[idx];
  // capture the boolean result for the possibility of *excluding* the current number from the sum
  // recursively try with the same target, but continue onto the next index
  const whenExcluded = subsetSum(target, nums, idx + 1, memo);
  // capture the boolean result for the possibility of *including* the current number in the sum
  // recursively try with the target minus this number and continue onto the next index
  const whenIncluded = subsetSum(target - num, nums, idx + 1, memo);
  // determine whether either possibility came back true
  const result = whenExcluded || whenIncluded;
  // cache this answer, associating it with this particular target
  memo[key] = result;
  return result;
}

//LONGEST INCREASING SUBSEQUENCE !! look over this one
//brute force O2^n
function longestIncreasingSubsequence(sequence, idx = 0, base = -Infinity) {
  if (idx === sequence.length) return 0;
  const num = sequence[idx];
  const whenExcluded = longestIncreasingSubsequence(sequence, idx + 1, base);
  if (num <= base) return whenExcluded;
  const whenExcluded = 1 + longestIncreasingSubsequence(sequence, idx + 1, num);
  return Math.max(whenIncluded, whenExcluded);
}

//Time: On^2, O(n) space
function iterativeLIS(sequence) {
  const lengths = new Array(sequence.length).fill(1);

  for (let i = 0; i < sequence.length; i++) {
    for (let j = 0; j < i; j++) {
      //check 1 - are we in an increasing sequence?
      const isIncreasing = sequence[j] < sequence[i];
      const sequenceLength = lengths[j] + 1;

      const isLonger = sequence > lengths[i];

      if (isIncreasing && isLonger) {
        lengths[i] = sequenceLength;
      }
    }
  }
  return Math.max(...lengths);
}

//BINARYTODECIMAL + DECIMALTO BINARY

function binaryToDecimal(num) {
  var arr = num.split('');
  var power = 1;
  var total = 0;
  for (var i = arr.length - 1; i >= 0; i--) {
    total += arr[i] * power;
    power *= 2;
  }
  return total;
}

function decimalToBinary(num) {
  //in this one, putting num % 2 (remainder) at front of string, minusing that from number, and dividing that by two to get the next number you're looking at
  var binaryStr = '';
  while (num) {
    var remainder = num % 2;
    binaryStr = remainder + binaryStr; //remainder first so number gets added to the front
    num = (num - remainder) / 2;
  }
  return binaryStr;
}

//OR

function decimalToBinary(num) {
  //on this one increases what you are % by
  var power = 2;
  var binaryStr = '';
  while (num) {
    var remainder = num % power;
    var digit = remainder ? 1 : 0; //is remainder truthy?
    binaryStr = digit + binaryStr;
    num = num - remainder;
    power *= 2;
  }
  return binaryStr;
}

//SUDOKU VALID SOLUTION (9X9 sudoku board, each column, row and 3 X 3 grid has numbers 1-9)
function validSolution(solution) {
  function check(arr) {
    return (
      arr.sort().filter(function(val, index) {
        return val === index + 1;
      }).length === 9
    );
  }
  for (let i = 0; i < 9; i++) {
    var col = [];
    var row = [];
    var square = [];
    for (var j = 0; j < 9; j++) {
      col.push(solution[j][i]);
      row.push(solution[i][j]);
      square.push(
        solution[Math.floor(j / 3) + (i % 3) * 3][
          (j % 3) + Math.floor(i / 3) * 3
        ]
      );
    }
    if (!check(col) || !check(row) || !check(square)) return false;
  }
  return true;
}

function sudokuValidator(solution) {
  for (var i = 0; i < 9; i++) {
    //check the rows
    var curRow = [];
    for (var j = 0; j < 9; j++) {
      if (curRow.indexOf(solution[i][j]) > -1) return false;
      curRow.push(solution[i][j]);
    }
  }
  for (var k = 0; k < 9; k++) {
    //check the columns
    var curCol = [];
    for (var m = 0; m < 9; m++) {
      if (curCol.indexOf(solution[m][k]) > -1) return false;
      curCol.push(solution[m][k]);
    }
  }
  for (var p = 0; p < 9; p += 3) {
    //jumping 3 each time
    //check the squares
    for (var q = 0; q < 9; q += 3) {
      var curSquare = [];
      for (var l = p; l < p + 3; l++) {
        //checking the inbetween numbers
        for (var n = q; n < q + 3; n++) {
          if (curSquare.indexOf(solution[l][n]) > -1) return false;
          curSquare.push(solution[l][n]);
        }
      }
    }
  }
  return true;
}

//Implement a function that adds two numbers without using + or any other built-in arithmetic operators.
//WHEN YOU USE OPERATORS LIKE & ^ ETC. THE COMPUTER AUTOMATICALLLY CONVERTS TO BINARY FOR YOU.
function add(a, b) {
  while (b !== 0) {
    const uncarried = a ^ b;
    const carries = (a & b) << 1;
    a = uncarried;
    b = carries;
    // ^^ reseting \`a\` and \`b\` like this will ensure we continue XOR and AND ing the new values for the next cycle of the loop
  }
  return a;
}

//10 + 11
//2^4  2^3  2^2  2^1  2^0
//     1     0    1    0       =>10
//     1     0    1    1       =>11
//& (AND) the two rows to get what we are carrying over
//     1     0    1    0       => these are the rows we want to be carrying over so we SHIFT them <<
// 1   0     1    0    0       => THIS IN NOW OUR "SHIFTED ROW" (our new B)
//^ (XOR) the two original rows to handle the numbers we didn't do anything with in the &
//    0     0     0    1      =>(our new A)
//OUR NEW B IS THE SHIFTED ROW OUR NEW A IS THE XOR-ed ROW.... and we start again!
//put in a while loop and keep going until B is 0.

//SPY ON
function spyOn(func) {
  let callCount = 0;
  const calledWith = new Set();
  const returnVals = new Set();

  function spy(...args) {
    const result = func(...args);
    callCount++;
    args.forEach(arg => calledWith.add(arg));
    returnVals.add(result);
    return result;
  }

  spy.getCallCount = function() {
    return callCount;
  };

  spy.wasCalledWith = function(argument) {
    return calledWith.has(argument);
  };

  spy.returned = function(result) {
    return returnVals.has(result);
  };

  return spy;
}

//CURRYING (but actually partial application because the returned function can take any number of arguments)

// Currying is the process by which a function of N arguments is implemented as N single-argument functions such that first of them takes in the first argument and returns a function which takes in the 2nd argument and so on, until the Nth single-argument function finally returns the value of the multi-argument function being implemented.
// ### Your Task:
// Write a function called `curry` that takes a function as an argument, and returns a "curried" version of that function.

// function doSomething (var1, var2, var3, var4) {
//   return var1 + var2 - var3 * var4;
// }
// const curriedDoSomething = curry(doSomething); // a curried function
// const firstReturn = curriedDoSomething(1); // var1 partially applied
// const secondReturn = firstReturn(2); // var2 partially applied
// const thirdReturn = secondReturn(3); // var3 partially applied
// const finalResult = thirdReturn(4); // -9 -> (1 + 2 - 3 * 4)

//!!!use .length on a function to find the 'ARITY' - number of arguments it took.
//!!!! use .bind to apply arguments to a function (null, for the this argument)
const curry = function(fn) {
  return function(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return curry(fn.bind(null, ...args));
    }
  };
};

//fancy
const curry = fn => (...args) =>
  args.length >= fn.length ? fn(...args) : curry(fn.bind(null, ...args));

//IMMUTABLE BINARY SEARCH TREE
//BST--node based structure that has no more than two children nodes, the left node is always less than or equal to it's root, the right is always greater.

function ImmutableBST(value, left, right) {
  this.value = value;
  this.left = left || null;
  this.right = right || null;
  this.size = 1 + ((left && left.size) || 0) + ((right && right.size) || 0);
}
// O(log n) insertion time
ImmutableBST.prototype.insert = function(value) {
  const newValue = this.value;
  let newLeft, newRight;
  if (value <= this.value) {
    newRight = this.right;
    // clone the left node with the value inserted
    // or create a fresh left node if one does not already exist
    newLeft = this.left ? this.left.insert(value) : new ImmutableBST(value);
  } else {
    newLeft = this.left;
    // clone the right node with the value inserted
    // or create a fresh right node if one does not already exist
    newRight = this.right ? this.right.insert(value) : new ImmutableBST(value);
  }
  // clone this node with the same value and either a new left child or a new right child (depending on above)
  return new ImmutableBST(newValue, newLeft, newRight);
};
// O(log n) retrieval time
ImmutableBST.prototype.contains = function(value) {
  if (this.value === value) return true;
  if (value < this.value) {
    return Boolean(this.left) && this.left.contains(value);
  } else {
    return Boolean(this.right) && this.right.contains(value);
  }
};

// O(log n) removal time
ImmutableBST.prototype.remove = function(value) {
  if (this.value === value) {
    // if we have matched, distinguish between three different cases
    if (this.left && this.right) {
      // case 1: the node has both children
      let newValue, newLeft, newRight;
      // remove a value from the "fuller" child
      // we will use that value as the value for our new node
      if (this.left.size > this.right.size) {
        newRight = this.right;
        // get the largest of the smaller child
        newValue = this.left.max();
        newLeft = this.left.remove(newValue);
      } else {
        newLeft = this.left;
        // get the smallest of the larger child
        newValue = this.right.min();
        newRight = this.right.remove(newValue);
      }
      return new ImmutableBST(newValue, newLeft, newRight);
    } else if (!this.left && !this.right) {
      // case 2: the node has no children
      // easy, if a node has no children its parent should replace it with null
      return null;
    } else {
      // case 3: the node has one child
      // also easy, if a node has one child, its parent should replace it with that child
      return this.left || this.right;
    }
  } else {
    // we have not yet found the given value to remove, continue recursing
    const newValue = this.value;
    let newLeft, newRight;
    if (value < this.value) {
      newRight = this.right;
      // clone the left node with the value removed
      // or if there is no left node, stop recursing
      newLeft = this.left ? this.left.remove(value) : null;
    } else {
      newLeft = this.left;
      // clone the right node with the value removed
      // or if there is no right node, stop recursing
      newRight = this.right ? this.right.remove(value) : null;
    }
    // clone this node with the same value and either a new left child or a new right child (depending on above)
    return new ImmutableBST(newValue, newLeft, newRight);
  }
};

//Implement a `maybe` factory or constructor. This function should return values implementing the "Maybe" API. For the purpose of this REACTO, that means Maybes need `value` and `map` methods.

// Maybe is an entity used in many pure functional programming languages to deal with values that may or may not exist. For example, the first element in a list, the row with id 5 in the database, or the property `.name` of an object – each might be nonexistent. Without Maybe, your code needs "null checks" everywhere – `if (whatever) doThing()`. With `Maybe`, you can write a sequence of computations and ignore whether or not the value(s) actually exist until the very last step.

//FUNCTOR - something that can be mapped over

//MONAD - prevents nesting

//FACTORY
const maybe = val => ({
  value: () => val, // returns the closure
  map: fn =>
    val === undefined || val === null
      ? maybe(null) // if the closure is null/undef., do not run `fn`
      : maybe(fn(val)), // if the closure is usable, run `fn` and wrap in Maybe
  flatMap: (
    fn //WOULD ACTUALLY PROBABLY WANT TO CHECK IF IT WAS WRAPPED IN A MAYBE, AND THEN RUN EITHER MAP/FLATMAP ACCORDINGLY
  ) =>
    val === undefined || val === null
      ? maybe(null) // if the closure is null/undef., do not run `fn`
      : fn(val) // if the closure is usable, run `fn` (but do not nest Maybes)
});

//CONSTRUCTOR
class Maybe {
  constructor(val) {
    this.val = val;
  }
  value() {
    return this.val;
  }
  map(fn) {
    if (Maybe.isVal(this.val)) return new Maybe(fn(this.val));
    return this;
  }
  flatMap(fn) {
    if (Maybe.isVal(this.val)) return fn(this.val);
    return this;
  }
  static isVal(val) {
    return !(val === undefined || val === null);
  }
}

//HAS BALANCED BRACKETS - use a STACK - LIFO

const opens = {
  '{': '}',
  '[': ']',
  '(': ')'
};

const closes = {
  '}': '{',
  ']': '[',
  ')': '('
};

function hasBalancedBrackets(str) {
  const opensStack = [];
  for (const ch of str) {
    if (opens.hasOwnProperty(ch)) {
      opensStack.push(ch);
    } else if (closes.hasOwnProperty(ch)) {
      const mostRecentOpen = opensStack.pop();
      const correspondingClose = opens[mostRecentOpen];
      if (ch !== correspondingClose) return false;
    }
  }
  return opensStack.length === 0;
}

//WATER COLLECTOR

//the 'totalVol' function will find the 'peak'
//of the collection array then sum the volume
//at each subsequent level util the 'ground'
//is reached.
function totalVol(blocks) {
  // 'peak' is set to the return of Math.max()
  //  when it is applied to the array with
  // 'null' as the 'this'.
  const peak = Math.max(...blocks);
  // instantiate volume to 0
  let vol = 0;
  // this loop starts at the 'peak' height
  // then decrements the height
  for (let height = peak; height > 0; height--) {
    // 'peaksAtHeightLevel' is set to the return of
    // 'peakIndicesMaker' which is an array of indices
    //  of reservoir walls that exist at that level.
    const peaksAtHeightLevel = peakIndicesMaker(blocks, height);
    // 'vol' is then incremented by the volume that exists
    // at that level.
    vol += volAtLevel(peaksAtHeightLevel);
  }

  // total volume is returned
  return vol;
}

//As demonstrated above this function takes
//the original array as well as the height level
//and returns an array of indices where reservoir
//walls exist
function peakIndicesMaker(blocks, level) {
  // instantiation
  const peakIndices = [];
  // loop over the entire array
  for (let i = 0; i < blocks.length; i++) {
    // if the wall height present at each index
    // is at least the height of the given level
    // then that index is pushed to the output array
    if (blocks[i] >= level) {
      peakIndices.push(i);
    }
  }

  // array of indices is returned
  return peakIndices;
}

//The key point to understand is that the distance between
//the two walls at the same height will also be the
//volume of water held between them.

function volAtLevel(peakIndices) {
  let levelVol = 0;
  if (peakIndices.length === 1) {
    return 0;
  } else {
    // If there is more than one wall of at least the current
    // level being measured then the level volume is incremented
    // for each 'pair' of walls at that level.
    for (let i = 0; i < peakIndices.length - 1; i++) {
      // Instead of summing the difference of the
      // indices we have to remember that the walls have a width of 1
      //so we need to measure the right side of one wall to the
      // left side of its neighbor.  This ensures that a total
      // volume of 0 is added for adjacent walls.
      levelVol += peakIndices[i + 1] - (peakIndices[i] + 1); //looking at next number minus previous
    }
  }
  // the level volume is then returned after all pairs have been summed.
  return levelVol;
}

//RECURSIVE NEAT WAY
function rainCollector(blocks, level = Math.max(...blocks)) {
  if (level < 1) return 0;
  let prevMatch;
  const atThisLevel = blocks.reduce((collected, block, idx) => {
    if (block < level) return collected;
    if (prevMatch) collected += idx - prevMatch - 1;
    prevMatch = idx;
    return collected;
  }, 0);
  return atThisLevel + rainCollector(blocks, level - 1);
}

//IN O(n) time
function rainCollector(blocks) {
  const rightMaxes = [];
  let rightMax = 0;
  for (let i = blocks.length - 1; i >= 0; i--) {
    rightMax = Math.max(rightMax, blocks[i]);
    rightMaxes[i] = rightMax;
  }

  const leftMaxes = [];
  let leftMax = 0;
  for (let i = 0; i < blocks.length; i++) {
    leftMax = Math.max(leftMax, blocks[i]);
    leftMaxes[i] = leftMax;
  }

  return blocks.reduce((waterCollected, block, idx) => {
    const leftMax = leftMaxes[idx];
    const rightMax = rightMaxes[idx];
    return waterCollected + Math.min(leftMax, rightMax) - block;
  }, 0);
}

//STUFF FROM JOHN!!!!!!

// add together any number of args
const add = (...args) => args.reduce((acc, curr) => acc + curr);

// multiply together any number of args
const multiply = (...args) => args.reduce((acc, curr) => acc * curr);

// make a function that takes a func, and returns a new version of that func that can only successfully be called every third time
const everyThirdTime = func => {
  let count = 3;
  return function(...args) {
    if (count === 3) {
      count = 0;
      return func(...args);
    }
    count++;
  };
};

// make a function that takes a func, and returns a new version of that func that can only successfully be called once a 'cooldown' period has elapsed since it was last successfully executed.
const throttle = (func, milliseconds) => {
  let time = Date.now() - milliseconds;
  return function(...args) {
    if (Date.now() - time >= milliseconds) {
      let res = func(...args);
      time = Date.now();
      return res;
    }
  };
};

// make a function that takes a func, and returns a new version of that func that can only successfully be called once. If we call it again with different args, it just returns the same result from the first (and only) successful call
const oneAndDone = func => {
  let res;
  return (...args) => {
    if (!res) res = func(...args);
    return res;
  };
};

// I want to be able to call *multiply* with any number of args. If I call it with fewer than 3 args, it will return a function to me that will accept the remainder of the params. When it has three of more params, it will multiply them together
const partialMultiply = (...args) => {
  if (args.length >= 3) return multiply(...args);
  return partialMultiply.bind(null, ...args);
};

// A more generic way of making partialMultiply. This function accepts a function, and returns a partial application version of it that waits until it has numParams before it actually invokes
const makePartial = (func, numParams) => {
  return function partialFunc(...args) {
    if (args.length >= numParams) return func(...args);
    console.log(args.length);
    return partialFunc.bind(null, ...args);
  };
};

// woah, that kind of sounded complicated, so here are some examples:
myPartialMultiply = makePartial(multiply, 3);
myPartialMultiply(2)(2)(2); //returns the answer
myPartialMultiply(3, 4); // returns a function that accepts the final param

// it's good because now I can use 'makePartial' to make any function use partial application.
myPartialAdd = makePartial(add, 5);

//insert in BST
class BinarySearchTree {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.magnitude = 1;
  }

  insert(value) {
    let direction = value < this.value ? 'left' : 'right';

    if (this[direction]) {
      this[direction].insert(value);
    } else {
      this[direction] = new BinarySearchTree(value);
      this.magnitude++;
    }
  }
}

function stringReverse(string) {
  let newStr = '';
  for (let i = string.length - 1; i >= 0; i--) {
    newStr += string[i];
  }
  return newStr;
}

class BST {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }

  breadthFirst(fn) {
    let queue = [this];
    while (queue.length) {
      const first = queue.shift();
      if (first.left) queue.push(first.left);
      if (first.right) queue.push(first.right);
      fn(first);
    }
  }

  depthFirst(fn, opt = 'in-order') {
    if (opt === 'pre-order') fn(this.value);
    if (this.left) this.left.depthFirst(fn, opt);
    if (opt === 'in-order') fn(this.value);
    if (this.right) this.right.depthFirst(fn, opt);
    if (opt === 'post-order') fn(this.value);
  }
}

//Pre-order traversal while duplicating nodes and values can make a complete duplicate of a binary tree.
// In-order traversal is very commonly used on binary search trees because it returns values from the underlying set in order, according to the comparator that set up the binary search tree (hence the name).
// Post-order traversal while deleting or freeing nodes and values can delete or free an entire binary tree.

function isPalindrome(word) {
  return (
    word
      .split('')
      .reverse()
      .join('') === word
  );
}

isPalindrome('racecar');

function isAnyPermutationPalidrome(word) {
  let obj = {};
  for (let i = 0; i < word.length; i++) {
    if (!obj[word[i]]) {
      obj[word[i]] = 1;
    } else {
      delete obj[word[i]];
    }
  }
  if (Object.keys(obj).length < 2) {
    return true;
  }
  return false;
}

isAnyPermutationPalidrome('racecar');

function LinkedList() {
  this.head = null;
}

LinkedList.prototype.deleteNode = function(val) {
  if (this.head.data === val) {
    this.head = this.head.next;
  } else {
    var previousNode = this.head;
    var currentNode = previousNode.next;
    while (currentNode) {
      if (currentNode.data === val) {
        previousNode.next = currentNode.next;
        currentNode = currentNode.next;
        break;
      } else {
        previousNode = currentNode;
        currentNode = currentNode.next;
      }
    }
  }
};

//INSERTION SORT!! O(n * m) (if partially sorted where m is the sorted range) otherwise O(n^2)
function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let temp = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > temp) {
      //move the value to where i was
      array[j + 1] = array[j];
      j--;
    }
    //replace in the space you are at the original i
    array[j + 1] = temp;
  }
  return array;
}

//selection sort O(n ^2)
function selectionSort(array) {
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    swap(array, minIdx, i);
  }
  return array;
}

function swap(array, i1, i2) {
  let first = array[i1];
  array[i1] = array[i2];
  array[i2] = first;
}

console.log(selectionSort([2, 3, 6, 3, 6, 4]));
