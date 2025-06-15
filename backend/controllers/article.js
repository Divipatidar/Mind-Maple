const fetchArticleFromKeywords = async (req, res) => {
  try {
    if (req.userId === undefined) {
      return;
    }
  } catch (error) {
  }
};

module.exports = {
  fetchArticleFromKeywords
};
