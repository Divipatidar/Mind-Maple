const cheerio = require('cheerio');

function welcomeEmail(score, analysis, articles) {
    const email = `
<html>
    Hi,
    Thank you for Analysing your Mental Health on <b>Mind Maple </b>.
    We hope you are doing better than before.
    Here is your Mental health report:
    <b> </b>
    <b> </b>

        Score  : ${score} <br/>
        <br/>

        Analysis : ${analysis}
        <br/>
        <br/>
    Here Are Some Articles we suggest you go through; these are compiled articles for you which can help you to improve your Mental health
    ${articles}
</html>
    `;
    const $ = cheerio.load(email);

    const updatedEmailHTML = $.html();

    return updatedEmailHTML;
}

module.exports = {
    welcomeEmail
};
