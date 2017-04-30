import { Component } from 'react';
import { assign, pickBy } from './util';

export interface Options {
    elementDelimiter: string;
    modDelimiter: string;
    modValueDelimiter: string;
    caseConversion: (str: string) => string;
}

export interface BEMEntity {
    base: string;
    mods: Mods;
    mix: string[];
}

export type Mods = { [key: string]: ModValue };
export type ModValue = string | boolean;
type ClassNameProp = { className: string; }
type ClassesArg = string[] | Component<any, any> | Mods;

const defaultOptions: Options = {
    elementDelimiter: '__',
    modDelimiter: '_',
    modValueDelimiter: '_',
    caseConversion: (str: string) => str
};

const isValidClassName = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;

export function withOptions(opts: Partial<Options> = {}) {
    return function (block: string) {
        return propmods(block, opts);
    }
}

export default function propmods(block: string, options: Partial<Options> = {}) {
    const opts: Options = assign({}, defaultOptions, options);
    block = opts.caseConversion(block);

    return function (el: string | ClassesArg, ...rest: ClassesArg[]): ClassNameProp {
        let base = block;
        let mods, mix;

        if (typeof el === 'string') {
            base += opts.elementDelimiter + opts.caseConversion(el);
            [mods, mix] = parseArgs(rest);
        } else {
            [mods, mix] = parseArgs([el as ClassesArg, ...rest]);
        }

        return toClassName({ base, mods, mix }, opts);
    };
}

function pickMods(target: object): Mods {
    return pickBy(target as Mods, (v, k) =>
        typeof v === 'boolean' ||
        typeof v === 'string' && isValidClassName.test(k + v)
    );
}

function parseArgs(args: ClassesArg[]): [Mods, string[]] {
    let mods = {};
    const mix: string[] = [];

    args.forEach(x => {
        if (x instanceof Component) {
            assign(mods, pickMods(x.props || {}));
            assign(mods, pickMods(x.state || {}));
            return;
        }

        if (Array.isArray(x)) {
            [].push.apply(mix, x);
            return;
        }

        assign(mods, pickMods(x));
    });

    return [mods, mix];
}

function toClassName(source: BEMEntity, opts: Options): ClassNameProp {
    const { base, mods, mix } = source;
    const modClasses = Object.keys(mods)
        .map(key => {
            const name = opts.caseConversion(key);
            const value = mods[key];

            const mod = typeof value === 'string' ?
                name + opts.modValueDelimiter + opts.caseConversion(value) :
                name;

            return base + opts.modDelimiter + mod;
        });
    const classes = [base, ...modClasses, ...mix];
    return {
        className: classes.join(' ')
    };
}