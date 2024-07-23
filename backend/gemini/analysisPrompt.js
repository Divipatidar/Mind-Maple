const analysisReportPrompt = 
  "Make a report or gist of the mental health of the user based on their previous chats. Its length should be approximately 50 to 150 words. Use English language strictly; do not include words from any other language. Provide key points: Observations, Potential Underlying Issues, Concerns, Recommendations, Overall.";

const analysisScorePrompt = 
  "Rate the mental health of the user on a scale of 1 to 10, where 1 is the best and 10 is the worst, based on their previous chats. Respond with only the number on the scale from 1 to 10. Do not include any other text.";

const analysisKeywordsPrompt = 
  "Extract keywords from the previous chats of the user that define their ongoing difficulties and mental health. Use English language strictly; do not include words from any other language. Avoid special characters such as asterisks (*) or dashes (-). List the keywords separated by a newline character (\\n). Provide only the keywords and avoid any other text, sentences, characters, or special characters. Extract 5 to 10 keywords.";

module.exports = {
  analysisReportPrompt,
  analysisScorePrompt,
  analysisKeywordsPrompt
};
