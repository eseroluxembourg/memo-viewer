import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import MarkdownItFootnote from 'markdown-it-footnote';

const markdownCardPlugin = () => ({
    name: 'vite-plugin-markdown',
    transform(code, id) {
        if (!id.endsWith('.md')) return null;

        const fm = matter(code);

        let result = '';
        result += `const attributes = ${JSON.stringify(fm.data)};\n`;
        const html = MarkdownIt().use(MarkdownItFootnote).render(fm.content);
        result += `const html = ${JSON.stringify(html)};\n`;

        result += 'export { attributes, html };\n';
        return {
            code: result,
        };
    },
});

export default markdownCardPlugin;
