import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import './toastr.scss';

const toastrProxy = (method: any, message: any): void => {
    toastr.options = {
        positionClass: 'toast-top-right',
        closeButton: false,
        hideDuration: 1000,
        timeOut: 15000,
        showDuration: 300,
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
        hideEasing: 'linear',
        closeEasing: 'swing',
        preventDuplicates: true,
        progressBar: true,
        newestOnTop: false,
        escapeHtml: false,
    };
    toastr[method](message);
};

const methods = ['success', 'info', 'warning', 'error'] as const;
type Methods = typeof methods[number];
type Toastr = { [key in Methods]: Function };

const obj: Toastr = Object.values(methods).reduce((acc, method: string) => {
    acc[method] = toastrProxy.bind(null, method);
    return acc;
}, {} as Toastr);

export default obj;
