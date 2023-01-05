#include <iostream>
#include <string.h>
#include <math.h>
using namespace std;
double hexToDec(string input){
	double total = 0;
	string digits = "123456789ABCDEF";
	cout << input<< endl;
	for(int i = 0; i < input.length();i++){
		int value = digits.find(input[i]) + 1;
		int place = (input.length() - i) - 1;
		int converted = value * pow(16, place);
		cout << input[i] << "|"<< value << "|" << place << "|" << converted << endl;
		total += converted;
	}
	return total;
};
int main() {
	cout << hexToDec("CCB12");
} 
