/**
2022
  PoC I completed for Lambda, Capture Clauses and Recursion in C++.
**/
using namespace std;
vector<string> get_pins(string observed) {
  vector<string> possible = {"08","124","1235","236","1457","24568","3569","478","57890","689"};//Based on the number (index) of this array, all possible inputs
  vector<string> ret = {};//Return array
  function<void (unsigned long ind, string combine)> run = [=, &ret, &run](auto i, auto com){
    if(i == observed.length()){
      ret.push_back(com);                                               //If at the end of the possibilities, add to the return value
    }else{
      for(unsigned long g = 0;g < size(possible[observed[i]-'0']);g++){ //Branch onto all options previously provide
        run(i + 1, com + possible[observed[i]-'0'][g]);                 //Continue onto next number
      }
    }
  };
  run(0,"");
  return ret;
}
