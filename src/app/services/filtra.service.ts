import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltraService {

  constructor(){}

  trimString(s) {
    var l=0, r=s.length -1;
    while(l < s.length && s[l] == ' ') l++;
    while(r > l && s[r] == ' ') r-=1;
    return s.substring(l, r+1);
  }
  compareObjects(o1, o2) {
    var k = '';
    for(k in o1) if(o1[k] != o2[k]) return false;
    for(k in o2) if(o1[k] != o2[k]) return false;
    return true;
  }
  itemExists(haystack, needle) {
    for(var i=0; i<haystack.length; i++) if(this.compareObjects(haystack[i], needle)) return true;
    return false;
  }
  searchFor(object,toSearch){
    var results = [];
    toSearch = this.trimString(toSearch);
    for(var i=0; i<object.length; i++){
     if(object[i]["descricao"].indexOf(toSearch)!=-1) {
        if(!this.itemExists(results, object[i])) results.push(object[i]);
     }
    }
    return results;
  }

}
