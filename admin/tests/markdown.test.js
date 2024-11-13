// Test utils/markdown.js

import { markdownToHtml } from '../src/utils/markdown';
import { expect, test } from 'vitest';

test('test bold', () => {
    const input = 'my **bold text**';
    const output = markdownToHtml(input);

    expect(output).toBe('<p>my <strong>bold text</strong></p>\n');
});
