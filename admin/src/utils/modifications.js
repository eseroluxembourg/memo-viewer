'use strict';

import * as matter from 'gray-matter';

/**
 *
 * @param {Object} object
 * @param {Object} modifiedObject
 * @returns Array[{ id, subfield, field, oldValue, newValue }]
 */
export function listModifications(elementId, object, modifications) {
    const allModifications = [];

    if (object === undefined || object == null) {
        for (const field in modifications) {
            if (modifications[field] === undefined) continue;
            if (typeof modifications[field] === 'object') {
                for (const subfield in modifications[field]) {
                    if (modifications[field][subfield] === undefined) continue;
                    allModifications.push({
                        id: elementId,
                        subfield: subfield,
                        field: field,
                        oldValue: undefined,
                        newValue: modifications[field][subfield],
                    });
                }
            } else {
                allModifications.push({
                    id: elementId,
                    subfield: undefined,
                    field: field,
                    oldValue: undefined,
                    newValue: modifications[field],
                });
            }
        }
        return allModifications;
    }

    if (modifications === undefined) return allModifications;

    for (const field in object) {
        if (modifications[field] === undefined) continue;

        if (typeof object[field] === 'object' && object[field].constructor.name != 'Array') {
            for (const subfield in modifications[field]) {
                if (modifications[field][subfield] === undefined) continue;
                allModifications.push({
                    id: elementId,
                    subfield: subfield,
                    field: field,
                    oldValue: object[field][subfield],
                    newValue: modifications[field][subfield],
                });
            }
        } else {
            allModifications.push({
                id: elementId,
                subfield: undefined,
                field: field,
                oldValue: object[field],
                newValue: modifications[field],
            });
        }
    }

    for (const field in modifications) {
        if (object[field] !== undefined) continue;

        if (typeof modifications[field] === 'object' && modifications[field].constructor.name != 'Array') {
            for (const subfield in modifications[field]) {
                if (modifications[field][subfield] === undefined) continue;
                allModifications.push({
                    id: elementId,
                    subfield: subfield,
                    field: field,
                    oldValue: undefined,
                    newValue: modifications[field][subfield],
                });
            }
        } else {
            allModifications.push({
                id: elementId,
                subfield: undefined,
                field: field,
                oldValue: undefined,
                newValue: modifications[field],
            });
        }
    }

    return allModifications;
}

/**
 *
 * Takes an { key: value } object and a list
 * of modifications and return a modified object
 * where values are the one from the modifications if
 * exists
 *
 * @param {Object} object
 * @param {*} modifications
 * @returns
 */
export function objectWithAppliedModifications(object, modifications) {
    const result = {};
    if (object === undefined || object == null) {
        for (const field in modifications) {
            if (typeof modifications[field] === 'object' && modifications[field].constructor.name != 'Array') {
                result[field] = {};

                for (const i18n in modifications[field]) {
                    if (i18n === undefined) continue;

                    result[field][i18n] = {
                        changed: true,
                        value: modifications[field][i18n],
                    };
                }
            } else {
                // if (modifications[field] === undefined) continue;
                result[field] = {
                    changed: true,
                    value: modifications[field],
                };
            }
        }
        return result;
    }

    for (const field in object) {
        const fieldChanged = modifications !== undefined && modifications[field] !== undefined;

        if (typeof object[field] === 'object' && object[field].constructor.name != 'Array') {
            if (object[field] == {}) continue;
            result[field] = {};

            for (const subfield in object[field]) {
                if (subfield === undefined) continue;
                const subfieldChanged = fieldChanged && modifications[field][subfield] !== undefined;

                result[field][subfield] = {
                    changed: subfieldChanged,
                    value: subfieldChanged ? modifications[field][subfield] : object[field][subfield],
                };
            }

            if (modifications !== undefined && modifications[field] !== undefined) {
                for (const subfield in modifications[field]) {
                    if (subfield === undefined) continue;
                    // already visited in the previous loop
                    if (object[field][subfield] !== undefined) continue;

                    result[field][subfield] = {
                        changed: true,
                        value: modifications[field][subfield],
                    };
                }
            }
        } else {
            if (object[field] === undefined) continue;
            result[field] = {
                changed: fieldChanged,
                value: fieldChanged ? modifications[field] : object[field],
            };
        }
    }

    for (const field in modifications) {
        if (result[field] !== undefined) continue;

        if (typeof modifications[field] === 'object' && modifications[field].constructor.name != 'Array') {
            result[field] = {};

            for (const subfield in modifications[field]) {
                if (subfield === undefined) continue;
                result[field][subfield] = {
                    changed: true,
                    value: modifications[field][subfield],
                };
            }
        } else {
            result[field] = {
                value: modifications[field],
                changed: true,
            };
        }
    }
    return result;
}

/**
 * Compute all the langs files required to create/update/remove
 *
 *  @return { Set }
 */
export function listModifiedLangsFiles(modifiedObject) {
    let returnAllLangs = false;
    const allLangs = new Set();
    const changedLangs = new Set();

    for (const field in modifiedObject) {
        if (
            typeof modifiedObject[field] === 'object' &&
            modifiedObject[field].constructor.name != 'Array' &&
            modifiedObject[field]['changed'] === undefined &&
            modifiedObject[field]['value'] === undefined
        ) {
            for (const i18n in modifiedObject[field]) {
                allLangs.add(i18n);
                if (modifiedObject[field][i18n].changed) changedLangs.add(i18n);
            }
            // TODO: remove this hack
        } else if (modifiedObject[field].changed) {
            returnAllLangs = true;
        }
    }
    return returnAllLangs ? allLangs : changedLangs;
}

/**
 * Currently only for testing
 */
export function computeExistingLangs(object) {
    return computeActiveLangs(objectWithAppliedModifications(object, undefined));
}

/**
 *  @returns { Set } a set of langs files for this object
 */
export function computeActiveLangs(modifiedObject) {
    const langs = new Set();
    for (const field in modifiedObject) {
        if (typeof modifiedObject[field] === 'object' && modifiedObject[field].constructor.name != 'Array') {
            if (modifiedObject[field]['changed'] !== undefined || modifiedObject[field]['value'] !== undefined) continue;

            for (const i18n in modifiedObject[field]) {
                if (modifiedObject[field][i18n].value === null) continue;
                langs.add(i18n);
            }
        }
    }

    return langs;
}

export function setModification(objects, modifications, objectId, subfield, field, value) {
    if (field === undefined && subfield === undefined && value === undefined) {
        delete modifications[objectId];
        return;
    }

    if (modifications[objectId] == undefined) {
        modifications[objectId] = {};
    }

    if (value === undefined && objects[objectId] === undefined) {
        console.warn(`Impossible to undo a field for the new object ${objectId}`);
        return;
    }

    if (subfield === undefined) {
        if (objects[objectId] !== undefined && objects[objectId][field] == value) value = undefined;

        if (value === undefined) delete modifications[objectId][field];
        else modifications[objectId][field] = value;
    } else {
        if (value === '') value = undefined;
        if (
            objects[objectId] !== undefined &&
            objects[objectId][field] !== undefined &&
            objects[objectId][field][subfield] !== undefined &&
            objects[objectId][field][subfield] == value
        )
            value = undefined;

        if (modifications[objectId][field] === undefined) modifications[objectId][field] = {};

        if (value === undefined) delete modifications[objectId][field][subfield];
        else modifications[objectId][field][subfield] = value;

        // TODO keept it somewhere
        // modifications[objectId].langs = computeActiveLangs(objectWithAppliedModifications(objects[objectId], modifications[objectId]));
    }
}

export function generateGitlabActions(
    modifiedObject,
    isNew,
    filepathBuilder,
    i18nFilepathBuilder,
    mainField,
    secondariesFields,
    existingLangs,
    oldId,
    nonI18nSecondariesFields,
) {
    const activeLangs = computeActiveLangs(modifiedObject);
    const modifiedLangs = listModifiedLangsFiles(modifiedObject);

    const newLangs = new Set([...modifiedLangs].filter((x) => !existingLangs.has(x)));
    let removedLangs = new Set([...modifiedLangs].filter((x) => !activeLangs.has(x)));
    const files = [];

    if (modifiedObject.removed !== undefined && modifiedObject.removed.value) {
        removedLangs = existingLangs;
    }
    const newId = modifiedObject.id.value;
    if (nonI18nSecondariesFields.length > 0) {
        let changed = isNew || newId !== oldId;
        const frontMatter = {};
        for (const field of nonI18nSecondariesFields) {
            const fieldValue = modifiedObject[field];
            if (fieldValue.value === undefined) continue;
            frontMatter[field] = fieldValue.value;
            changed |= fieldValue.changed;
        }
        const fileContent = matter.stringify('', frontMatter);
        if (changed) {
            files.push({
                action: isNew ? 'create' : newId === oldId ? 'update' : 'move',
                file_path: filepathBuilder(newId),
                previous_path: filepathBuilder(oldId),
                content: fileContent,
            });
        }
    }

    for (const i18n of modifiedLangs) {
        if (removedLangs.has(i18n)) continue;

        const fieldValue =
            modifiedObject[mainField] !== undefined && modifiedObject[mainField][i18n] !== undefined
                ? modifiedObject[mainField][i18n]
                : modifiedObject[mainField];
        const content = fieldValue === undefined || fieldValue.value === undefined ? '' : fieldValue.value;

        const frontMatter = {};
        for (const field of secondariesFields) {
            if (modifiedObject[field] === undefined) continue;
            const fieldValue = modifiedObject[field][i18n] !== undefined ? modifiedObject[field][i18n] : modifiedObject[field];
            if (fieldValue.value === undefined) continue;
            frontMatter[field] = fieldValue.value;
        }
        const fileContent = matter.stringify(content, frontMatter);

        files.push({
            action: isNew || newLangs.has(i18n) ? 'create' : newId === oldId ? 'update' : 'move',
            file_path: i18nFilepathBuilder(newId, i18n),
            previous_path: i18nFilepathBuilder(oldId, i18n),
            content: fileContent,
        });
    }

    for (const i18n of removedLangs) {
        files.push({
            action: 'delete',
            file_path: i18nFilepathBuilder(newId, i18n),
        });
    }
    return files;
}
