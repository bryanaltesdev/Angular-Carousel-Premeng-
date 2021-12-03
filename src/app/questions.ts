export const lokTystrcs = [
    {name: 'New York', typstrcDesc: 'NY'},
    {name: 'Rome', typstrcDesc: 'RM'},
    {name: 'London', typstrcDesc: 'LDN'},
    {name: 'Istanbul', typstrcDesc: 'IST'},
    {name: 'Paris', typstrcDesc: 'PRS'}
];
export const hometypes = [
    {name: '1', code: 'NY'},
    {name: '2', code: 'RM'},
    {name: '3', code: 'LDN'},
    {name: '4', code: 'IST'},
    {name: '5', code: 'PRS'}
];
export const questions = [{
    control: 'respondentInfoForGroup',
    button: 'visible',
    content1s: [],
    title11: '',
    title12: '',
    contents2: [],
    title21: '',
    title22: ''
}, {
    control: 'sdefvd',
    button: 'hidden',
    contents1: lokTystrcs,
    title11: 'city',
    title12: 'state',
    contents2: [],
    title21: '',
    title22: ''
}, {
    control: 'wrapUpScreen',
    button: 'hidden',
    contents1: [],
    title11: '',
    title12: '',
    contents2: hometypes,
    title21: 'Hometype',
    title22: 'bedroom cnt'
}];