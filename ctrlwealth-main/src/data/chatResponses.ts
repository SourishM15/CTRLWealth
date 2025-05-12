// Pre-defined responses for the chat interface

interface ResponseTemplate {
  keywords: string[];
  response: string;
}

export const generalResponses: ResponseTemplate[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: 'Hello! I can help you explore inequality data for the US and Washington State. What would you like to know?'
  },
  {
    keywords: ['help', 'how', 'use', 'guide'],
    response: 'You can ask me about inequality metrics, compare US and Washington data, or inquire about specific trends. You can also use the filter panel to customize the visualizations.'
  }
];

export const metricResponses: ResponseTemplate[] = [
  {
    keywords: ['gini', 'coefficient'],
    response: 'The Gini coefficient measures income inequality on a scale from 0 to 1. A value of 0 represents perfect equality (everyone has the same income), while 1 represents perfect inequality (one person has all the income).'
  },
  {
    keywords: ['income', 'ratio', 'top', 'bottom'],
    response: 'The Income Ratio compares the average income of the top 10% of earners to the bottom 50%. A higher ratio indicates greater income inequality.'
  },
  {
    keywords: ['poverty', 'rate'],
    response: 'The Poverty Rate represents the percentage of the population living below the federal poverty line. Lower values indicate fewer people living in poverty.'
  },
  {
    keywords: ['wealth', 'share', 'top 1%', 'richest'],
    response: 'The Wealth Share metric shows what percentage of total wealth is owned by the top 1% of the population. A higher percentage indicates more concentrated wealth.'
  }
];

export const forecastResponses: ResponseTemplate[] = [
  {
    keywords: ['forecast', 'future', 'predict', 'projection'],
    response: 'Our forecasts are based on historical trends and economic models. They project potential future scenarios but should be interpreted with caution as actual outcomes may vary based on policy changes and economic events.'
  },
  {
    keywords: ['increase', 'rise', 'growing', 'worse'],
    response: 'Several inequality metrics show increasing trends in our forecast, particularly wealth concentration. However, policy interventions could alter these trajectories.'
  },
  {
    keywords: ['decrease', 'fall', 'shrink', 'better', 'improve'],
    response: 'Some metrics, like poverty rates, show potential decreases in our forecasts, though progress may be uneven across different regions and demographics.'
  }
];

export const comparisonResponses: ResponseTemplate[] = [
  {
    keywords: ['compare', 'washington', 'difference', 'versus', 'vs'],
    response: 'Washington State generally shows slightly lower income inequality compared to the national average, with a lower Gini coefficient and poverty rate. However, wealth concentration follows similar patterns to the national trend.'
  },
  {
    keywords: ['better', 'worse', 'higher', 'lower'],
    response: 'Washington State has historically maintained somewhat better inequality metrics than the US average, particularly in poverty rates. However, recent trends show the gap narrowing in some areas.'
  }
];

export const getResponseForInput = (input: string): string => {
  // Normalize input
  const normalizedInput = input.toLowerCase();
  
  // Check all response templates
  const allTemplates = [
    ...generalResponses, 
    ...metricResponses, 
    ...forecastResponses, 
    ...comparisonResponses
  ];
  
  for (const template of allTemplates) {
    if (template.keywords.some(keyword => normalizedInput.includes(keyword))) {
      return template.response;
    }
  }
  
  // Default response if no match found
  return "I'm not sure about that specific question. You can ask me about inequality metrics like the Gini coefficient, income ratios, poverty rates, or wealth distribution in the US and Washington State.";
};