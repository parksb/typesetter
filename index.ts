import * as ejs from 'ejs';
import { promises as fs } from 'fs';
import * as path from 'path';

import MarkdownIt from 'markdown-it';
import * as katex from 'katex';
import highlightJs from 'highlight.js';
import mdFootnote from 'markdown-it-footnote';
import mdTex from 'markdown-it-texmath';
import mdAnchor from 'markdown-it-anchor';
import mdInlineComment from 'markdown-it-inline-comments';
import mdEmoji from 'markdown-it-emoji';
import mdMermaid from 'markdown-it-mermaid';

interface Document {
  title: string;
  html: string;
}

(async () => {
  const filename = process.argv.slice(2)[0];

  const MARKDOWN_DIRECTORY_PATH: string = path.join(__dirname, './md');
  const DIST_DIRECTORY_PATH: string = path.join(__dirname, './html');
  const TEMPLATE_FILE_PATH: Buffer = await fs.readFile(path.join(__dirname, './templates/default.ejs'));

  const md: MarkdownIt = new MarkdownIt({
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
    highlight: (str, lang) => {
      if (lang && highlightJs.getLanguage(lang)) {
        return `<pre class="hljs"><code>${highlightJs.highlight(lang, str, true).value}</code></pre>`;
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    },
  }).use(mdFootnote)
    .use(mdInlineComment)
    .use(mdMermaid)
    .use(mdEmoji)
    .use(mdTex, {
      engine: katex,
      delimiters: 'dollars',
      macros: { '\\RR': '\\mathbb{R}' },
    })
    .use(mdAnchor);

    const markdown = (await fs.readFile(`${MARKDOWN_DIRECTORY_PATH}/${filename}.md`)).toString();
    const html = md.render(markdown);

    const document: Document = { title: markdown.match(/^#\s.*/)[0].replace(/^#\s/, ''), html };

    fs.writeFile(`${DIST_DIRECTORY_PATH}/${filename}.html`, ejs.render(String(TEMPLATE_FILE_PATH), { document }));
})();


