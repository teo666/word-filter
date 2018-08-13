'use strict';

let WF_RET = Object.freeze({"EXACT_MATCH":1, "START_WITH":2, "CONTAINS_SUBSTRING":4, "CONTAINS_SEQUNCE":8})

const meta = ['\\','!','$','&','?','^','+','*','(',')','[',']','{','}','.','|','<','>','-'];

function WordFilter(opt) {
    this.setSource(opt.source);
    this.setSearchField(opt.searchField);
    this.setSearchMask(opt.searchMask)
    this.setMaxOutput(opt.maxOutput);
    this.tot_el = 0;
}

WordFilter.prototype.setSource = function(s){
    if(Array.isArray(s)){
        this.source = s;
    } else {
        throw "WordFilter : Sources is not an array";
    }
}

WordFilter.prototype.setSearchField = function(f){
    if(f === undefined){
        this.searchField = function(item){return item};
        return;
    } else if((typeof f).toLowerCase() == 'function'){
        this.searchField = f;
    } else {
        throw "WordFilter : searchField is not a function";
    }
}

WordFilter.prototype.setMaxOutput = function(n){
    if(Number.isInteger(n) && n > 0){
        this.maxOutput = n;
    } else {
        this.maxOutput = -1;
    }
}

WordFilter.prototype.setSearchMask = function(n){
    if(Number.isInteger(n) && n >= 0){
        this.searchResult = n;
    } else {
        throw "WordFilter : searchMask is not an integer";
    }
    
}

WordFilter.prototype.add = function(arr, word, pos){
    if(this.tot_el == this.maxOutput){
        let pos_w = 4;
        let ret;
        while ( pos_w > pos && !(ret = arr[pos_w].pop()) ){
            pos_w--;
        }
        if(ret){
            this.tot_el--;
        } else {
            return;
        }    
    }
    arr[pos].push(word);
    this.tot_el++;
}

WordFilter.prototype.search = function (val) {
    let self = this;
    let ret = {
        1 : [],
        2 : [],
        3 : [],
        4 : [],
    };
    if(val === ""){
        return ret;
    }
    let _reg_1 = '^';
    let _reg_2 = '^';
    let _reg_3 = '';
    let _reg_4 = '';
    for (let i = 0; i < val.length; i++) {
        let char = val.charAt(i);
        if(meta.includes(char)){
            char = '\\' + char;
        }
        _reg_1 += char; //quelli che matchano esattamente
        _reg_2 += char; //quelli che iniziano con quella striga
        _reg_3 += char; //quelli che contengono la sottostringa
        _reg_4 += (char + '.*'); //quelli che contengono i caratteri in sequenza
    }
    let reg_1 = new RegExp(_reg_1 + '$','ig');
    let reg_2 = new RegExp(_reg_2,'ig');
    let reg_3 = new RegExp(_reg_3,'ig');
    let reg_4 = new RegExp(_reg_4,'ig');

    this.tot_el = 0;

    this.source.some(function (item,i) {
        let text = self.searchField(item);
        if( (self.searchResult & WF_RET.EXACT_MATCH ) && text.match(reg_1)){
            self.add(ret, item, 1);
        } else if( (self.searchResult & WF_RET.START_WITH ) && text.match(reg_2)){
            self.add(ret, item, 2);
        } else if( (self.searchResult & WF_RET.CONTAINS_SUBSTRING ) && text.match(reg_3)){
            self.add(ret, item, 3);
        } else if( (self.searchResult & WF_RET.CONTAINS_SEQUNCE ) && text.match(reg_4)){
            self.add(ret, item, 4);
        }
    });
    return ret;
};
