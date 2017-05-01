const assert = require('assert');
const React = require('react');

const block = require('../lib/index').default;

let eq = (x, y) => (() => assert.equal(x, y));

suite('Propmods', () => {
    let mods1 = {foo: 'bar'};
    let mods2 = {baz: 'quux'};
    let mods3 = Object.assign({}, mods1, mods2);
    let mods4 = {a: {b: 'c'}};

    class TestComponent extends React.Component {}

    let component1 = new TestComponent(mods1);

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

            test('with mods in props', eq(
                b(component1).className, 'Test Test_foo_bar'
            ));

            test('with empty array in props', eq(
                b({foo: []}).className, 'Test'
            ));
        });

        suite('element', () => {
            test('solo', eq(
                b('el').className, 'Test__el'
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

            test('with empty array in props', eq(
                b('el', {foo: []}).className, 'Test__el'
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
        let mods = {fooBar: 'baz-quux'};

        test('with kebab case', () => {
            let b = block('Test', {
                transformKeys: (str) => str.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
            });
            assert.equal(b('element', mods).className, 'Test__element Test__element_foo-bar_baz-quux');
        });
    })
});
