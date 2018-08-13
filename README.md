# What Word filter is

Word filter is a javascript based library to filter words. Word filter take a string as input and returns matching words.

# Matching criterion

Word filter has four kind of matching criterion:

- words that match exactly the input string
- words that start with the input string
- words that contains input string as substring
- words that contains ordered characters sequence of the input string

# Returned structure

Word filter returns an Object with four keys, each for a different search criterion. Keys are numbered from 1 to 4 and their associated structure are array containig the matched dictionary elements divided by search criterion.

```js
{
    1: [], //exactly match
    2: [], //start with
    3: [], //contains substring
    4: []  //contain sequence
}
```

# Example

Suppose to have following dictionary

```js
dict = [
    "differed",
    "differen",
    "difference",
    "differ",
    "indifference",
    "indifferent",
    "indifferently",
    "diffeomorphic"
]
```

and word `differ` as input string, the search result will be

```js
{
    1: ["differ"], //exactly match
    2: ["differed","differen","difference",], //start with
    3: ["indifference","indifferent","indifferently",], //contains substring
    4: ["diffeomorphic"]  //contain sequence
}
```

# Usage

Initialize a Word filter instance in that manner

```js
let wf = new WordFilter({
        source: elements,
        searchField: function (item) {
            return item.innerText;
        },
        maxOutput: 10,
        searchMask: WF_RET.EXACT_MATCH | WF_RET.START_WITH | WF_RET.CONTAINS_SUBSTRING | WF_RET.CONTAINS_SEQUNCE
    });

```

where:  
**source**: is an array of homogeneous elements  
**searchField**: is a function that specify the manner for access the value of the elements on wich execute searches  
**maxOutput**: specify the max number of elements that have to be returned (**read "Output Limit" section**)  
**searchMask**: specify wich search subset have to be returner or ignored

after initialization start a serach calling

```js
    //let result = wf.search("string to search");
    let result = wf.search("differ");
```

# Output Limit

Output limitation does not only affect the size of results, but even its content.

Suppose to have source below 

```js
dict = [
    "diffeomorphic",
    "differed",
    "differen",
    "difference",
    "differ",
    "indifference",
    "indifferent",
    "indifferently"
]
```

the `maxOutput` field set to 2 and `differ` as searching string.

During the search, source array is scanned from position 0 to length - 1, and in this configuration the first two words will come into result structure immediatly reaching the output limit. The word "differ" that matches exaclty the input string will not be in result object. To avoid this situation if `maxOutput` is specified WordFilter assign a priority to matches.

`the lower the value of the key of the returned array inside the output object the higher priority is`

in the above example "differ" is and exact match but the output limit is reached before reach it, so WordFilter will search an element to delete starting from lower priority returned array and higher priority word will be included.