import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'abortcontroller-polyfill';
import 'core-js/features/string/repeat';
import cssVars from 'css-vars-ponyfill';
import svg4everybody from 'svg4everybody';

svg4everybody();
cssVars({
    include: 'style',
    watch: true,
});
