:
#include <stdio.h
void convertNumber(int decimal) {
printf("Decimal: %d\n", decimal);
printf("Binary: ");
for (int i = 31; i >= 0; i--) {
int bit = (decimal >> i) & 1; // Extract each bit
printf("%d", bit);
if (i % 4 == 0 && i != 0) // Add a space for readability every 4 bits
printf(" ");
}
printf("\nOctal: %o\n", decimal);
printf("Hexadecimal: %X\n", decimal);
}
int main() {
int decimal;
printf("Enter a decimal number: ");
scanf("%d", &decimal);
convertNumber(decimal);
return 0;
}