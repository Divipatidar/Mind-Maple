import markdownit from 'markdown-it';

const md = markdownit()
export function renderMarkdown(data){
    return md.render(data)
}

