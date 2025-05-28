export const getResponseForInput = (input: string): string => {
  const normalizedInput = input.toLowerCase();
  
  if (normalizedInput.includes('hello') || normalizedInput.includes('hi')) {
    return 'Hello! I can help you explore Seattle neighborhood demographics. What would you like to know?';
  }
  
  if (normalizedInput.includes('population')) {
    return 'Seattle has diverse neighborhoods with varying population sizes. The largest concentrations are in urban areas like Capitol Hill and Ballard.';
  }
  
  return "I can help you understand Seattle's neighborhood demographics. Feel free to ask about specific areas or demographics!";
};