'use strict';

let WF_RET = Object.freeze({"EXACT_MATCH":1, "START_WITH":2, "CONTAINS_SUBSTRING":4, "CONTAINS_SEQUNCE":8})

const meta = ['\\','!','$','&','?','^','+','*','(',')','[',']','{','}','.','|','<','>','-'];

function WordFilter(opt) {
    this.source = opt.source;
    this.source_field = opt.source_field || function(item){return item};
    this.search_results = opt.search_results;
    this.max_output = (opt.max_output > 0) ? opt.max_output : -1;
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
    let tot = 0;
    this.source.some(function (item,i) {
        let text = self.source_field(item);
        if( (self.search_results & WF_RET.EXACT_MATCH ) && text.match(reg_1)){
            ret['1'].push(item);
            tot++;
        } else if( (self.search_results & WF_RET.START_WITH ) && text.match(reg_2)){
            ret['2'].push(item);
            tot++;
        } else if( (self.search_results & WF_RET.CONTAINS_SUBSTRING ) && text.match(reg_3)){
            ret['3'].push(item);
            tot++;
        } else if( (self.search_results & WF_RET.CONTAINS_SEQUNCE ) && text.match(reg_4)){
            ret['4'].push(item);
            tot++;
        }
        if(tot == self.max_output){
            return true;
        }
    });
    return ret;
};
