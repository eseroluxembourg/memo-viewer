'use strict';
import MarkdownIt from 'markdown-it';
import MarkdownItFootnote from 'markdown-it-footnote';

/**
 * Convert markdown entry to HTML content
 * TODO: MarkdownIt is created on every call, no cache yet :/
 *
 * @param {String} mdContent
 */
export function markdownToHtml(mdContent) {
    const md = MarkdownIt();
    return md.use(MarkdownItFootnote).render(mdContent);
}
