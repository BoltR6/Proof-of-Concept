/**
2021
  Proof of concept for input filtration and advanced numerical logic.
  If you've never seen this challenge before, it's extremely fun and not challenging so I recommend attempting it!
**/
function parseInt(string) {
  var ret = 0;
  var nums = [['zero',0],['one',1],['two',2],['three',3],['four',4],['five',5],['six',6],['seven',7],['eight',8],['nine',9],['ten',10],['eleven',11],['twelve',12],['thirteen',13],['fourteen',14],['fifteen',15],['sixteen',16],['seventeen',17],['eighteen',18],['nineteen',19],['twenty',20],['thirty',30],['forty',40],['fifty',50],['sixty',60],['seventy',70],['eighty',80],['ninety',90]];
  var gaming = string.split(/ |-/).map(item => {return (nums.findIndex(x => x[0] == item) !== -1) ? nums[nums.findIndex(x => x[0] == item)][1] : item});
  var onnum = 0;
  gaming.forEach((item,ind) => {
    var splits = ['hundred','thousand','ten thousand','hundred thousand','million'];
    if(Number.isInteger(item) || splits.includes(item)){
      if(!splits.includes(item)){
        onnum += item;
        if(ind == gaming.length-1){
          ret += onnum;
        }
      }else{
        if(item !== 'hundred'){
          ret += onnum * (10**(splits.indexOf(item)+2));
          onnum = 0;
        }else{
          onnum *= 100;
          if(ind == gaming.length-1){
            ret += onnum;
          }
        }
      }
    }
  });
  console.log(gaming)
  return ret;
}
