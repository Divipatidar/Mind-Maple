const analysisReportPrompt =
  "Create a wellness and emotional wellbeing summary based on the user's previous chats. Analyze their communication patterns, mood indicators, and general emotional state. Length should be 50 to 150 words approximately. Use English language strictly, not even any words of other language. Provide keypoints [Observations, Potential Underlying Issues, Concerns, Recommendations, Overall]. This is for personal wellness tracking, not medical diagnosis.";

const analysisScorePrompt =
  "Based on the user's chat conversations, provide a wellness indicator score from 1 to 10 where 1 is excellent emotional wellbeing and 10 indicates significant emotional concerns. Consider mood patterns, stress levels, and emotional expressions. Reply with only a single number from 1 to 10, nothing else. You must respond with just one number.";

const analysisKeywordsPrompt =
  "Extract keywords from the previous chats of the user that can define their emotional patterns, concerns, and wellbeing indicators. Focus on feelings, situations, or challenges mentioned. Use English language strictly, not even any words of other language. You are strictly forbidden to use special characters such as asterisk(*), dash(-). List the keywords separated by a newline character (\n). You are strictly forbidden to reply any other thing like word,sentence,character,special characters except keywords. Extract 5 to 10 keywords.";

module.exports = {
  analysisReportPrompt,
  analysisScorePrompt,
  analysisKeywordsPrompt,
};
