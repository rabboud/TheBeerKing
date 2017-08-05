// import React from 'react';
// import TestUtils from 'react-addons-test-utils';
//
// import {Navbar} from '../components';
//
// var shallowRenderer = TestUtils.createRenderer();
//
// shallowRenderer.render(
//     <Navbar brandName={'Teste'} navLinks={[{
//         to: '/teste',
//         label: 'Teste'
//     }]} />
// );
//
// var result = shallowRenderer.getRenderOutput();
//
// describe('Navbar', () => {
//     it('deve ser nav', () => {
//         expect(result.type).toBe('nav');
//     });
//
//     it('deve ter classes bootstrap', () => {
//         expect(result.props.className).toBe('navbar navbar-inverse navbar-fixed-top');
//     });
// });
//
// describe('Navbar children', () => {
//     it('deve ter classe container', () => {
//         expect(result.props.children.props.className).toBe('container');
//     });
// });
//
// describe('Navbar header', () => {
//     it('deve ter multiplos childrens', () => {
//         expect(result.props.children.props.children.length).not.toBeUndefined();
//     });
//
//     it('deve ter navbar-header', () => {
//         expect(result.props.children.props.children[0].props.className).toBe('navbar-header');
//     });
//
//     it('deve ter navbar-brand Teste', () => {
//         expect(result.props.children.props.children[0].props.children.props.to).toBe('/');
//         expect(result.props.children.props.children[0].props.children.props.className).toBe('navbar-brand');
//         expect(result.props.children.props.children[0].props.children.props.children).toBe('Teste');
//     });
//
//     it('deve ter navbar-nav', () => {
//         expect(result.props.children.props.children[1].props.className).toBe('nav navbar-nav');
//     });
//
//     it('deve ter Link no navbar-nav', () => {
//         expect(result.props.children.props.children[1].props.children.length).toBe(1);
//         expect(result.props.children.props.children[1].props.children[0].props.to).toBe('/teste');
//         expect(result.props.children.props.children[1].props.children[0].props.children).toBe('Teste');
//     });
// });
