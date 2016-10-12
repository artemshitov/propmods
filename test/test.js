import assert from 'assert';
import _ from 'lodash';

import block from '../src/index';

let eq = (x, y) => (() => assert.equal(x, y));

suite('Propmods', () => {
    let mods1 = {foo: 'bar'};
    let mods2 = {baz: 'quux'};
    let mods3 = {...mods1, ...mods2};
    let mods4 = {a: {b: 'c'}};

    let props1 = {props: mods1};
    let props2 = {props: mods2};
    let props3 = {props: mods3};

    let state1 = {state: mods1};
    let state2 = {state: mods2};
    let state3 = {state: mods3};

    suite('with default options', () => {
        let b = block('Test');

        suite('block', () => {
            test('solo', eq(
                b().className, 'Test'
            ));

            test('with mods', eq(
                b(mods1).className, 'Test Test_foo_bar'
            ));

            test('with multiple mods', eq(
                b(mods3).className, 'Test Test_foo_bar Test_baz_quux'
            ));

            test('with multiple groups of mods', eq(
                b(mods1, mods2).className, 'Test Test_foo_bar Test_baz_quux'
            ));

            test('with duplicate mods', eq(
                b(mods3, mods1, mods2).className, 'Test Test_foo_bar Test_baz_quux'
            ));

            test('with invalid mods', eq(
                b(mods3, mods4).className, 'Test Test_foo_bar Test_baz_quux'
            ));

            test('with multiple arrays of mixins', eq(
                b(mods1, ['foo'], ['bar']).className, 'Test Test_foo_bar foo bar'
            ));

            test('with array of multiple mixins', eq(
                b(mods1, ['foo', 'bar']).className, 'Test Test_foo_bar foo bar'
            ));
        });

        suite('element', () => {
            test('solo', eq(
                b('el', ).className, 'Test__el'
            ));

            test('with mods', eq(
                b('el', mods1).className, 'Test__el Test__el_foo_bar'
            ));

            test('with multiple mods', eq(
                b('el', mods3).className, 'Test__el Test__el_foo_bar Test__el_baz_quux'
            ));

            test('with multiple groups of mods', eq(
                b('el', mods1, mods2).className, 'Test__el Test__el_foo_bar Test__el_baz_quux'
            ));

            test('with duplicate mods', eq(
                b('el', mods3, mods1, mods2).className, 'Test__el Test__el_foo_bar Test__el_baz_quux'
            ));

            test('with invalid mods', eq(
                b('el', mods3, mods4).className, 'Test__el Test__el_foo_bar Test__el_baz_quux'
            ));

            test('with multiple arrays of mixins', eq(
                b('el', mods1, ['foo'], ['bar']).className, 'Test__el Test__el_foo_bar foo bar'
            ));

            test('with array of multiple mixins', eq(
                b('el', mods1, ['foo', 'bar']).className, 'Test__el Test__el_foo_bar foo bar'
            ));
        });
    });

    test('with custom delimiters', () => {
        let b = block('Test', {
            elementDelimiter: '--',
            modDelimiter: '__',
            modValueDelimiter: '_'
        });

        assert.equal(
            b('el', {foo: 'bar'}).className, 'Test--el Test--el__foo_bar'
        );
    });

    suite('with case conversions', () => {
        let mods = {fooBar: 'bazQuux'};

        test('with kebab case', () => {
            let b = block('Test', {
                caseConversion: _.kebabCase
            });
            assert.equal(b('ElEment', mods).className, 'test__el-ement test__el-ement_foo-bar_baz-quux');
        });
    })
});
