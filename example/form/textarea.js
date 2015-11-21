import $ from 'jquery';

import {ceb, method} from '../../es6/lib/ceb.js';

export default ceb().proto(Object.create(HTMLTextAreaElement.prototype)).extend('textarea').builders(
    method('createdCallback').invoke(el => {
        $(el).addClass('form-control');
    })
).register('wui-textarea');