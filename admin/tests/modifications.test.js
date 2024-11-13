// Test file for src/utils/modifications.js

import { expect, test } from 'vitest';
import {
    objectWithAppliedModifications,
    computeActiveLangs,
    setModification,
    listModifiedLangsFiles,
    generateGitlabActions,
    computeExistingLangs,
} from '../src/utils/modifications';
import { generateLink, generateLinks, generateCard } from './utils.js';

function expectSameForFields(object, result, fields) {
    for (const field of fields) {
        expect(result[field].value).toBe(object[field]);
        expect(result[field].changed).toBe(false);
    }
}

test('objectWithAppliedModifications. Update link status', () => {
    const myLink = generateLink();
    const statusModification = {
        status: 'invalid',
    };

    const result = objectWithAppliedModifications(myLink, statusModification);

    expectSameForFields(myLink, result, ['id', 'fromCardId', 'toCardId', 'langs', 'removed']);

    for (const i18n in result['explanations']) {
        expect(result['explanations'][i18n].value).toBe(myLink['explanations'][i18n]);
        expect(result['explanations'][i18n].changed).toBe(false);
    }

    expect(result.status.value).toBe('invalid');
    expect(result.status.changed).toBe(true);
});

test('objectWithAppliedModifications. Update en-GB', () => {
    const myLink = generateLink();
    const englishModification = {
        explanations: { 'en-GB': 'updated' },
    };

    const result = objectWithAppliedModifications(myLink, englishModification);
    expectSameForFields(myLink, result, ['id', 'fromCardId', 'toCardId', 'langs', 'status', 'removed']);

    expect(result.explanations['en-GB'].value).toBe(englishModification.explanations['en-GB']);
    expect(result.explanations['en-GB'].changed).toBe(true);

    expectSameForFields(myLink['explanations'], result['explanations'], ['fr-FR']);
});

test('objectWithAppliedModifications. Create new en-US lang', () => {
    const myLink = generateLink();

    const mymodif = {
        explanations: { 'en-US': 'enus translation!' },
    };

    const result = objectWithAppliedModifications(myLink, mymodif);
    expectSameForFields(myLink, result, ['id', 'fromCardId', 'toCardId', 'status', 'removed']);
    expectSameForFields(myLink['explanations'], result['explanations'], ['en-GB', 'fr-FR']);

    expect(result.explanations['en-US'].value).toBe(mymodif.explanations['en-US']);
    expect(result.explanations['en-US'].changed).toBe(true);
});

test('objectWithAppliedModifications. Remove fr-FR lang', () => {
    const myLink = generateLink();

    const mymodif = {
        explanations: { 'fr-FR': null },
    };

    const result = objectWithAppliedModifications(myLink, mymodif);
    expectSameForFields(myLink, result, ['id', 'fromCardId', 'toCardId', 'status', 'removed']);
    expectSameForFields(myLink['explanations'], result['explanations'], ['en-GB']);

    expect(result.explanations['fr-FR'].value).toBe(null);
    expect(result.explanations['fr-FR'].changed).toBe(true);
});

test('objectWithAppliedModifications. Create object', () => {
    const myLink = undefined;

    const mymodif = {
        id: '0_1',
        fromCardId: '0',
        toCardId: '1',
        status: 'valid',
        removed: false,
        explanations: { 'fr-FR': null },
    };

    const result = objectWithAppliedModifications(myLink, mymodif);
    expect(result.explanations['fr-FR'].value).toBe(null);
    expect(result.explanations['fr-FR'].changed).toBe(true);
});

test('objectWithAppliedModifications, fresk', () => {
    const myFresk = {
        edges: {},
        nodes: {},
    };

    const modif = {
        edges: {
            '6_12': {
                from: '6',
                to: '12',
                status: 'valid',
                removed: false,
                added: true,
            },
        },
    };

    const result = objectWithAppliedModifications(myFresk, modif);
    expect(result.edges['6_12'].value.from).toBe('6');
});

test('objectWithAppliedModifications, fresk. Delete one node', () => {
    const myFresk = {
        edges: {},
        nodes: {
            10: { cardId: '10' },
        },
    };

    const modif = {
        nodes: {
            10: null,
        },
    };

    const result = objectWithAppliedModifications(myFresk, modif);
    expect(Object.keys(result.nodes).length).toBe(1);
    expect(result.nodes[10].value).toBe(null);
});

test('setModification. Update fromCardId', () => {
    const myLinks = generateLinks();

    const myModifications = {};

    setModification(myLinks, myModifications, 'my_id', undefined, 'fromCardId', '11');
    expect(myModifications['my_id'].fromCardId).toBe('11');
});

test('setModification. Update fromCardId same value', () => {
    const myLinks = generateLinks();

    const myModifications = {};

    setModification(myLinks, myModifications, 'my_id', undefined, 'fromCardId', '10');
    expect(myModifications['my_id'].fromCardId).toBe(undefined);
});

test('setModification. Update fromCardId then undo', () => {
    const myLinks = generateLinks();

    const myModifications = {};

    setModification(myLinks, myModifications, 'my_id', undefined, 'fromCardId', '13');
    expect(myModifications['my_id'].fromCardId).toBe('13');
    setModification(myLinks, myModifications, 'my_id', undefined, 'fromCardId', undefined);
    expect(myModifications['my_id'].fromCardId).toBe(undefined);
});

test('setModification. Create new lang', () => {
    const myLinks = generateLinks();

    const myModifications = {};

    setModification(myLinks, myModifications, 'my_id', 'en-US', 'explanations', 'my text in en-US');
    expect(myModifications['my_id'].explanations['en-US']).toBe('my text in en-US');
});

test('setModification. Remove one lang with null', () => {
    const myLinks = generateLinks();

    const myModifications = {};

    setModification(myLinks, myModifications, 'my_id', 'fr-FR', 'explanations', null);
    expect(myModifications['my_id'].explanations['fr-FR']).toBe(null);
});

test('setModification. With array', () => {
    const myArray = {
        firstarray: [{ hello: 'world' }],
    };

    const myModifications = {};
    setModification(myArray, myModifications, 'firstarray', 'hello', 0, 'you');
    expect(myModifications.firstarray[0].hello).toBe('you');
});

test('setModification. With array, add element', () => {
    const myArray = {
        firstarray: [{ hello: 'world' }],
    };

    const myModifications = {};
    setModification(myArray, myModifications, 'firstarray', undefined, 1, { hello: 'bis' });
    expect(myModifications.firstarray[1].hello).toBe('bis');
    expect(Object.keys(myModifications).length).toBe(1);
});

// Used for pdfformats
test('objectw with applied modifications. With array, add element', () => {
    const myArray = [{ hello: 'world' }];
    const myModifications = { 0: { hello: 'boom' }, 1: { hi: 'you' } };

    const result = objectWithAppliedModifications(myArray, myModifications);

    expect(result[0].hello.value).toBe('boom');
    expect(result[0].hello.changed).toBeTruthy();

    expect(Object.keys(result).length).toBe(2);
    expect(result[1].hi.value).toBe('you');
    expect(result[1].hi.changed).toBeTruthy();
});

test('computeActiveLangs. Update one lang', () => {
    const myLink = generateLink();
    const englishModification = {
        explanations: { 'en-GB': 'updated' },
    };

    const result = computeActiveLangs(objectWithAppliedModifications(myLink, englishModification));
    expect(new Set(result)).toStrictEqual(new Set(['en-GB', 'fr-FR']));
});

test('computeActiveLangs. Creast first lang', () => {
    const myLink = generateLink();
    myLink['explanations'] = {};
    const englishModification = {
        explanations: { 'en-GB': 'updated' },
    };

    const result = computeActiveLangs(objectWithAppliedModifications(myLink, englishModification));
    expect(new Set(result)).toStrictEqual(new Set(['en-GB']));
});

test('computeActiveLangs. Add one lang', () => {
    const myLink = generateLink();
    const englishModification = {
        explanations: { 'en-US': 'new' },
    };

    const result = computeActiveLangs(objectWithAppliedModifications(myLink, englishModification));
    expect(result).toStrictEqual(new Set(['en-GB', 'fr-FR', 'en-US']));
});

test('computeActiveLangs. Remove one lang with null', () => {
    const myLink = generateLink();
    const englishModification = {
        explanations: { 'en-GB': null },
    };

    const result = computeActiveLangs(objectWithAppliedModifications(myLink, englishModification));
    expect(result).toStrictEqual(new Set(['fr-FR']));
});

test('listModifiedLangsFiles. All langs modified', () => {
    const modifications = {
        status: 'xxx',
        explanations: { 'en-GB': null },
    };

    const modifiedObject = objectWithAppliedModifications(generateLink(), modifications);
    expect(listModifiedLangsFiles(modifiedObject)).toStrictEqual(new Set(['fr-FR', 'en-GB']));
});

test('listModifiedLangsFiles. Only fr-FR', () => {
    const modifications = { explanations: { 'fr-FR': 'xx' } };

    const modifiedObject = objectWithAppliedModifications(generateLink(), modifications);
    expect(listModifiedLangsFiles(modifiedObject)).toStrictEqual(new Set(['fr-FR']));
});

test('listModifiedLangsFiles. Remove one lang', () => {
    const modifications = { explanations: { 'fr-FR': null } };

    const modifiedObject = objectWithAppliedModifications(generateLink(), modifications);
    expect(listModifiedLangsFiles(modifiedObject)).toStrictEqual(new Set(['fr-FR']));
});

test('listModifiedLangsFiles. New lang and all modified', () => {
    const modifications = {
        fromCardId: 'xx',
        explanations: { 'en-US': 'in en-US' },
    };

    const modifiedObject = objectWithAppliedModifications(generateLink(), modifications);
    expect(listModifiedLangsFiles(modifiedObject)).toStrictEqual(new Set(['fr-FR', 'en-GB', 'en-US']));
});

test('computeExistingLangs', () => {
    expect(computeExistingLangs(generateLink())).toStrictEqual(new Set(['fr-FR', 'en-GB']));
});

test('gitlabactions. Updated one i18n field', () => {
    const myLink = generateLink();
    const modifiedObject = objectWithAppliedModifications(myLink, { explanations: { 'en-GB': 'inenglish' } });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'explanations',
        ['fromCardId', 'toCardId', 'status', 'toCardId'],
        computeExistingLangs(myLink),
        '10_11',
        [],
    );

    expect(actions.length).toBe(1);
    expect(actions[0].file_path).toBe('10_11en-GB');
    expect(actions[0].action).toBe('update');
});

test('gitlabactions. Updated one non i18n field', () => {
    const myLink = generateLink();
    const modifiedObject = objectWithAppliedModifications(myLink, { status: 'invalid' });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'explanations',
        ['fromCardId', 'toCardId', 'status', 'toCardId'],
        computeExistingLangs(myLink),
        '10_11',
        [],
    );

    expect(actions.length).toBe(2);
    expect(actions[0].action).toBe('update');
    expect(actions[1].action).toBe('update');
});

test('gitlabactions. Updated create one lang', () => {
    const myLink = generateLink();
    const modifiedObject = objectWithAppliedModifications(myLink, { explanations: { 'en-US': 'new english' } });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'explanations',
        ['fromCardId', 'toCardId', 'status', 'toCardId'],
        computeExistingLangs(myLink),
        undefined,
        [],
    );

    expect(actions.length).toBe(1);
    expect(actions[0].action).toBe('create');
    expect(actions[0].file_path).toBe('10_11en-US');
});

test('gitlabactions. Remove one lang', () => {
    const myLink = generateLink();
    const modifiedObject = objectWithAppliedModifications(myLink, { explanations: { 'en-GB': null } });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'explanations',
        ['fromCardId', 'toCardId', 'status', 'toCardId'],
        computeExistingLangs(myLink),
        undefined,
        [],
    );

    expect(actions.length).toBe(1);
    expect(actions[0].action).toBe('delete');
    expect(actions[0].file_path).toBe('10_11en-GB');
});

test('gitlabactions. Remove link', () => {
    const myLink = generateLink();
    const modifiedObject = objectWithAppliedModifications(myLink, { removed: true });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'explanations',
        ['fromCardId', 'toCardId', 'status'],
        computeExistingLangs(myLink),
        undefined,
        [],
    );

    expect(actions.length).toBe(2);
    expect(actions[0].action).toBe('delete');
    expect(actions[1].action).toBe('delete');
});

test('gitlabactions. Remove one lang, add a new one', () => {
    const myLink = generateLink();
    const modifiedObject = objectWithAppliedModifications(myLink, { explanations: { 'en-GB': null, 'en-US': 'enus', 'fr-FR': 'update' } });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'explanations',
        ['fromCardId', 'toCardId', 'status'],
        computeExistingLangs(myLink),
        '10_11',
        [],
    );

    expect(actions.length).toBe(3);
    expect(new Set(actions.map((act) => act.file_path))).toStrictEqual(new Set(['10_11en-GB', '10_11en-US', '10_11fr-FR']));
    for (const action of actions) {
        if (action.file_path === '10_11en-GB') expect(action.action).toBe('delete');
        else if (action.file_path === '10_11fr-FR') expect(action.action).toBe('update');
        else expect(action.action).toBe('create');
    }
});

test('gitlabactions. Remove one lang, update status', () => {
    const myLink = generateLink();
    const modifiedObject = objectWithAppliedModifications(myLink, { explanations: { 'en-GB': null }, status: 'valid' });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'explanations',
        ['fromCardId', 'toCardId', 'status'],
        computeExistingLangs(myLink),
        undefined,
        [],
    );

    expect(actions.length).toBe(2);
    expect(new Set(actions.map((act) => act.file_path))).toStrictEqual(new Set(['10_11en-GB', '10_11fr-FR']));
    for (const action of actions) {
        if (action.file_path === 'en-GB') expect(action.action).toBe('delete');
        else if (action.file_path === 'fr-FR') expect(action.action).toBe('update');
    }
});

test('gitlabactions. With card', () => {
    const myCard = generateCard();
    const modifiedObject = objectWithAppliedModifications(myCard, { lot: '2' });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'cardContent',
        ['id', 'title'],
        computeExistingLangs(myCard),
        'my_id',
        ['lot', 'num'],
    );

    expect(actions.length).toBe(4);
    expect(new Set(actions.map((act) => act.file_path))).toStrictEqual(new Set(['my_id', 'my_iden-GB', 'my_idfr-FR', 'my_iden-US']));
    for (const action of actions) {
        expect(action.action).toBe('update');
    }
});

test('gitlabactions. With card, update one fr-FR only', () => {
    const myCard = generateCard();
    const modifiedObject = objectWithAppliedModifications(myCard, { title: { 'fr-FR': 'maj titre français' } });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'cardContent',
        ['title'],
        computeExistingLangs(myCard),
        'my_id',
        ['lot', 'num'],
    );

    expect(actions.length).toBe(1);
    expect(new Set(actions.map((act) => act.file_path))).toStrictEqual(new Set(['my_idfr-FR']));
    for (const action of actions) {
        expect(action.action).toBe('update');
    }
});

test('gitlabactions. With card, remove fr-FR only', () => {
    const myCard = generateCard();
    const modifiedObject = objectWithAppliedModifications(myCard, { title: { 'fr-FR': null }, cardContent: { 'fr-FR': null } });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'cardContent',
        ['title'],
        computeExistingLangs(myCard),
        'my_id',
        ['lot', 'num'],
    );

    expect(actions.length).toBe(1);
    expect(new Set(actions.map((act) => act.file_path))).toStrictEqual(new Set(['my_idfr-FR']));
    for (const action of actions) {
        expect(action.action).toBe('delete');
    }
});

test('gitlabactions. With card, update fr-FR only', () => {
    const myCard = generateCard();
    const modifiedObject = objectWithAppliedModifications(myCard, { title: { 'fr-FR': null } });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'cardContent',
        ['title'],
        computeExistingLangs(myCard),
        'my_id',
        ['lot', 'num'],
    );

    expect(actions.length).toBe(1);
    expect(new Set(actions.map((act) => act.file_path))).toStrictEqual(new Set(['my_idfr-FR']));
    for (const action of actions) {
        expect(action.action).toBe('update');
    }
});

test('gitlabactions. With card, change id', () => {
    const myCard = generateCard();
    const modifiedObject = objectWithAppliedModifications(myCard, { id: 'nouveau' });

    const actions = generateGitlabActions(
        modifiedObject,
        false,
        (id) => id,
        (id, i18n) => id + i18n,
        'cardContent',
        ['title'],
        computeExistingLangs(myCard),
        'my_id',
        ['lot', 'num'],
    );

    expect(actions.length).toBe(4);
    expect(new Set(actions.map((act) => act.file_path))).toStrictEqual(new Set(['nouveau', 'nouveaufr-FR', 'nouveauen-GB', 'nouveauen-US']));
    expect(new Set(actions.map((act) => act.previous_path))).toStrictEqual(new Set(['my_id', 'my_idfr-FR', 'my_iden-GB', 'my_iden-US']));
    for (const action of actions) {
        expect(action.action).toBe('move');
    }
});
