const fetchArticleFromKeywords = async (req, res) => {
  try {
    if (req.userId === undefined) {
      // throw an error or handle the case
      return;
    }
  } catch (error) {
    // handle the error appropriately
  }
};

module.exports = {
  fetchArticleFromKeywords
};
