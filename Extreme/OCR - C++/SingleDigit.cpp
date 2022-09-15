using namespace std;
//Convert a hex array to a static binary array that's readable
vector<vector<int>> hextobinarr(unsigned int w, unsigned int h, vector<unsigned> px){
  vector<vector<int>> ret = {};
  for(unsigned int i = 0;i < h;i++){
    vector<int> topush = {};
    for(unsigned int g = 0;g < w;g++){
      topush.push_back(px[w * i + g] == 0x0 ? 1 : 0);
    }
    ret.push_back(topush);
  }
  return ret;
}
//Expand an array by a multiple
vector<vector<int>> blowuparr(unsigned int m_w,unsigned int m_h, vector<vector<int>> input){
  vector<vector<int>> ret = {};
  for(unsigned int i = 0;i < size(input);i++){
    vector<int> topush = {};
    for(unsigned int g = 0;g < size(input[i]);g++){
      vector<int> multiadd(m_w,input[i][g]);
      topush.insert(topush.end(),multiadd.begin(),multiadd.end());
    }
    for(unsigned int i = 0;i < m_h;i++){
      ret.push_back(topush);
    }
  }
  return ret;
}
//Cuts up an image into sections. In the event I add multi-digit, this is designed to be modular for multiple cutouts as a return.
vector<vector<vector<int>>> cutupimg(vector<vector<int>> input){
  vector<vector<vector<int>>> ret = {};
  vector<vector<int>> inputclone = input;
  struct {
    int up = -1;
    int down = -1;
    int left = -1;
    int right = -1;
  } bounds;
  while (size(inputclone) > 0){
    for(unsigned int g = 0;g < size(inputclone[0]);g++){
      vector<int> column = {};
      for(unsigned int i = 0;i < size(inputclone);i++){
        column.push_back(inputclone[i][g]);
      }
      if(bounds.left == -1 && find(column.begin(),column.end(),1) != column.end()){
        bounds.left = g;
        continue;
      }
      if(bounds.left != -1 && bounds.right == -1 && find(column.begin(),column.end(),1) == column.end()){
        bounds.right = g - 1;
        break;
      }
    }
    bounds.left = bounds.left == -1 ? 0 : bounds.left;
    bounds.right = bounds.right == -1 ? size(inputclone[0]) - 1 : bounds.right;
    for(unsigned int i = 0;i < size(inputclone);i++){
      if(bounds.up == -1 && find(inputclone[i].begin() + bounds.left,inputclone[i].end() + bounds.right,1) != inputclone[i].end() + bounds.right){
        bounds.up = i + 1;
        continue;
      }
      if(bounds.down == -1 && bounds.up != -1 && find(inputclone[i].begin() + bounds.left,inputclone[i].end() + bounds.right,1) == inputclone[i].end() + bounds.right){
        bounds.down = i - 1;
        break;
      }
    }
    bounds.up = bounds.up == -1 ? 0 : bounds.up;
    bounds.down = bounds.down == -1 ? size(inputclone) - 1 : bounds.down;
    vector<vector<int>> addtoret = {};
    for(int i = bounds.up;i < bounds.down + 1;i++){
      vector<int> topush = {};
      for(int g = bounds.left;g < bounds.right + 1;g++){
        topush.push_back(inputclone[i][g]);
      }
      addtoret.push_back(topush);
    }
    ret.push_back(addtoret);
    for(unsigned int i = 0;i < size(inputclone);i++){
      
    }
    break;
  }
  cout << bounds.up << "|" << bounds.down << endl;
  cout << bounds.left << "|" << bounds.right << endl;
  cout << "# of cut numbers: " << size(ret) << endl;
  return ret;
};
//Compare the similarity between two arrays. Only compares the overlap in colored pixels (1s) and not 'whitespace'.
int comparearrs(vector<vector<int>> arr1, vector<vector<int>> arr2){
  int ret = 0;
  for(unsigned int i = 0;i < size(arr1);i++){
    for(unsigned int g = 0;g < size(arr1[i]);g++){
      if(arr1[i][g] != 0 && arr1[i][g] == arr2[i][g]){
        ret += 1;
      }
    }
  }
  return ret;
}
string ocr(const Image &image)
{
  string ret = "";
  const vector<vector<vector<int>>> chars = {
    {
      {1,1,1,1,1},
      {1,0,0,0,1},
      {1,0,0,0,1},
      {1,0,0,0,1},
      {1,0,0,0,1},
      {1,0,0,0,1},
      {1,1,1,1,1}
    },//#0
    {
      {1,1,1,0,0},
      {0,0,1,0,0},
      {0,0,1,0,0},
      {0,0,1,0,0},
      {0,0,1,0,1},
      {0,0,1,0,1},
      {1,1,1,1,1}
    },//#1
    {
      {1,1,1,1,1},
      {0,0,0,0,1},
      {0,0,0,0,1},
      {1,1,1,1,1},
      {1,0,0,0,0},
      {1,0,0,0,0},
      {1,1,1,1,1}
    },//#2
    {
      {1,1,1,1,1},
      {0,0,0,0,1},
      {0,0,0,0,1},
      {0,1,1,1,1},
      {0,0,0,0,1},
      {0,0,0,0,1},
      {1,1,1,1,1}
    },//#3
    {
      {1,0,0,0,0},
      {1,0,0,1,0},
      {1,0,0,1,0},
      {1,0,0,1,0},
      {1,1,1,1,1},
      {0,0,0,1,0},
      {0,0,0,1,0}
    },//#4
    {
      {0,1,1,1,1},
      {0,1,0,0,0},
      {0,1,0,0,0},
      {0,1,1,1,1},
      {0,0,0,0,1},
      {0,0,0,0,1},
      {1,1,1,1,1}
    },//#5
    {
      {1,0,0,0,0},
      {1,0,0,0,0},
      {1,0,0,0,0},
      {1,1,1,1,1},
      {1,0,0,0,1},
      {1,0,0,0,1},
      {1,1,1,1,1}
    },//#6
    {
      {1,1,1,1,1},
      {0,0,0,0,1},
      {0,0,0,0,1},
      {0,0,0,1,0},
      {0,0,1,0,0},
      {0,0,1,0,0},
      {0,0,1,0,0}
    },//#7
    {
      {0,1,1,1,0},
      {0,1,0,1,0},
      {0,1,0,1,0},
      {1,1,1,1,1},
      {1,0,0,0,1},
      {1,0,0,0,1},
      {1,1,1,1,1}
    },//#8
    {
      {1,1,1,1,1},
      {1,0,0,0,1},
      {1,1,1,1,1},
      {0,0,0,0,1},
      {0,0,0,0,1},
      {0,0,0,0,1},
      {0,0,0,0,1}
    },//#9
  };
  vector<vector<int>> img = hextobinarr(image.width,image.height,image.pixels);
  vector<vector<vector<int>>> toprocess = cutupimg(img);
  cout << "Original: " << endl;
  for(unsigned long i = 0;i < size(img);i++){
    for(unsigned long g = 0;g < size(img[i]);g++){
      cout << img[i][g];
    }
    cout << endl;
  }
  
  for(unsigned int ind = 0;ind < size(toprocess);ind++){
    cout << "Cut up: " << ind << endl;
    for(unsigned long i = 0;i < size(toprocess[ind]);i++){
      for(unsigned long g = 0;g < size(toprocess[ind][i]);g++){
        cout << toprocess[ind][i][g];
      }
      cout << endl;
    }
  } 
  
  for(unsigned int ind = 0;ind < size(toprocess);ind++){
    vector<vector<int>> bloatedimg = blowuparr(5,7,toprocess[ind]);
    int bestmatch = -1;
    int bestnum = -1; 
    for(unsigned int i = 0;i < size(chars);i++){
      vector<vector<int>> rescaled = blowuparr(size(toprocess[ind][0]),size(toprocess[ind]),chars[i]);
      int similarity = comparearrs(bloatedimg,rescaled);
      if(similarity > bestmatch){
        bestmatch = similarity;
        bestnum = i;
      }
      cout << i << "'s similarity: " << similarity << endl;
    }
    cout << endl << "Most similar to: " << bestnum << endl;
    ret+= to_string(bestnum);
  }
  return ret;
}
