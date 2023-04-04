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
  const TEMPLATE_PATH: Buffer = await fs.readFile(path.join(__dirname, './templates/default.ejs'));

  const inputpath = process.argv[2];
  const outputpath = process.argv[3];

  const md: MarkdownIt = new MarkdownIt({
    html: false,
    xhtmlOut: false,
    breaks: false,
    langPrefix: 'language-',
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
    highlight: (str, language) => {
      if (language && highlightJs.getLanguage(language)) {
        return `<pre class="hljs"><code>${highlightJs.highlight(str, { language, ignoreIllegals: true }).value}</code></pre>`;
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

    const markdown = (await fs.readFile(inputpath)).toString();
    const html = md.render(markdown);

    const document: Document = { title: markdown.match(/^#\s.*/)[0].replace(/^#\s/, ''), html };

    fs.writeFile(outputpath, ejs.render(String(TEMPLATE_PATH), { document }));
})();


