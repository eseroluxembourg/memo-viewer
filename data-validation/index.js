'use strict';

import Ajv from 'ajv';

import freskSchema from './schemas/fresk.json';
import cardSchema from './schemas/card.json';
import linkSchema from './schemas/link.json';
import variantsSchema from './schemas/variants.json';
import settingsSchema from './schemas/settings.json';
import cardLangSchema from './schemas/cardlang.json';
import linksStyleSchema from './schemas/linksStyle.json';

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

export const validateFresk = ajv.compile(freskSchema);
export const validateCard = ajv.compile(cardSchema);
export const validateLink = ajv.compile(linkSchema);
export const validateVariants = ajv.compile(variantsSchema);
export const validateSettings = ajv.compile(settingsSchema);
export const validateCardLangs = ajv.compile(cardLangSchema);
export const validateLinksStyle = ajv.compile(linksStyleSchema);

// const valid = validate(data)
// if (!valid) console.log(validate.errors)
