
const ones = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const tens = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

const scales = ['', 'thousand', 'million', 'billion', 'trillion'];

function convertHundreds(num: number): string {
  let result = '';
  
  if (num > 99) {
    result += ones[Math.floor(num / 100)] + ' hundred ';
    num %= 100;
  }
  
  if (num > 19) {
    result += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  }
  
  if (num > 0) {
    result += ones[num] + ' ';
  }
  
  return result.trim();
}

export function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  
  // Handle negative numbers
  if (num < 0) return 'minus ' + numberToWords(-num);
  
  // Round to 2 decimal places and convert to integer (paise)
  const totalPaise = Math.round(num * 100);
  const rupees = Math.floor(totalPaise / 100);
  const paise = totalPaise % 100;
  
  let result = '';
  
  if (rupees === 0) {
    result = 'zero';
  } else {
    let scaleIndex = 0;
    let tempNum = rupees;
    const parts = [];
    
    while (tempNum > 0) {
      const chunk = tempNum % 1000;
      if (chunk !== 0) {
        const chunkWords = convertHundreds(chunk);
        if (scaleIndex > 0) {
          parts.unshift(chunkWords + ' ' + scales[scaleIndex]);
        } else {
          parts.unshift(chunkWords);
        }
      }
      tempNum = Math.floor(tempNum / 1000);
      scaleIndex++;
    }
    
    result = parts.join(' ');
  }
  
  // Add paise if present
  if (paise > 0) {
    result += ' and ' + convertHundreds(paise) + ' paise';
  }
  
  return result.trim();
}
