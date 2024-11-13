'use strict';

/**
 * Return true if it's sure that the list of files have not changed
 * (renamed, deleted, created)
 *
 * @param {Array[
 *  {newPath{str}, OldPath{str},
 *  newFile{bool}, deletedFile{bool}, renamedFile{bool}
 * }]} diff (see tests/utils.js)
 * @param {String} path
 */
export function listFilesStillValid(diffs, path) {
    for (const diff of diffs) {
        // No path changes
        if (!diff.newFile && !diff.deletedFile && !diff.renamedFile && diff.newPath === diff.oldPath) continue;

        if (diff.newPath !== undefined && diff.newPath.startsWith(path)) return false;
        if (diff.oldPath !== undefined && diff.oldPath.startsWith(path)) return false;
    }
    return true;
}

export function fileContentStillValid(diffs, filepath) {
    for (const diff of diffs) {
        if (diff.newPath === filepath || diff.filepath === filepath) return false;
    }
    return true;
}
