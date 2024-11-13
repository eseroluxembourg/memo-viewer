// Test file for src/utils/incrementalcommit

import { expect, test } from 'vitest';

import { listFilesStillValid, fileContentStillValid } from '../src/utils/incrementalcommit.js';

test('listfilesstill valid, only text update', () => {
    const diff = [
        {
            newPath: '_links/10_11/en-GB/index.md',
            oldPath: '_links/10_11/en-GB/index.md',
            newFile: false,
            deletedFile: false,
            renamedFile: false,
        },
    ];

    expect(listFilesStillValid(diff, '_links')).toEqual(true);
    expect(listFilesStillValid(diff, '_cards')).toEqual(true);
});

test('listfilesstill valid, deleted links', () => {
    const diff = [
        {
            newPath: '_links/10_11/en-GB/index.md',
            oldPath: '_links/10_11/en-GB/index.md',
            newFile: false,
            deletedFile: true,
            renamedFile: false,
        },
    ];

    expect(listFilesStillValid(diff, '_links')).toEqual(false);
    expect(listFilesStillValid(diff, '_cards')).toEqual(true);
});

test('listfilesstill valid, renamed links', () => {
    const diff = [
        {
            newPath: '_links/10_12/en-GB/index.md',
            oldPath: '_links/10_11/en-GB/index.md',
            newFile: false,
            deletedFile: false,
            renamedFile: true,
        },
    ];

    expect(listFilesStillValid(diff, '_links')).toEqual(false);
    expect(listFilesStillValid(diff, '_cards')).toEqual(true);
});

test('listfilesstill valid, new links', () => {
    const diff = [
        {
            newPath: '_links/10_12/en-GB/index.md',
            oldPath: undefined,
            newFile: true,
            deletedFile: false,
            renamedFile: false,
        },
    ];

    expect(listFilesStillValid(diff, '_links')).toEqual(false);
    expect(listFilesStillValid(diff, '_cards')).toEqual(true);
});

test('filecontentstillvalid valid, new links', () => {
    const diff = [
        {
            newPath: '_links/10_12/en-GB/index.md',
            oldPath: '_links/10_12/en-GB/index.md',
            newFile: true,
            deletedFile: false,
            renamedFile: false,
        },
    ];

    expect(fileContentStillValid(diff, '_links/10_12/en-GB/index.md')).toEqual(false);
    expect(fileContentStillValid(diff, '_links/13_12/en-GB/index.md')).toEqual(true);
});
