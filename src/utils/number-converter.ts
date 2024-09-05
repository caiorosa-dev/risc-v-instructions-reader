export function convertHexToBinary(hex: string): string {
  const allChars = hex.split('');

  const binaryString = allChars.map((char) => {
    const binaryChar = parseInt(char, 16).toString(2);

    return binaryChar.padStart(4, '0');
  });

  return binaryString.join('');
}

export function convertBinaryToDecimal(binary: string): number {
  return parseInt(binary, 2);
}
