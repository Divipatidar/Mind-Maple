import { load } from 'cheerio';

export function welcomeEmail(score, analysis,articles){
const email =  `
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
    Here Are Some Article we suggest you to go through,these are compiled Articles for you which can help you to improve your Mental health
    ${articles}
</html>
`
const $ = load(email);

    const updatedEmailHTML = $.html();
    

    return updatedEmailHTML ;
}

