// custom fetch upload
// https://github.com/jaydenseric/apollo-upload-client/issues/88#issuecomment-468318261

const parseHeaders = (rawHeaders: string): Headers => {
    const headers: Headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    const preProcessedHeaders: string = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach((line) => {
        const parts: string[] = line.split(':');
        const key: string = (parts.shift() || '').trim();
        if (key) {
            const value = parts.join(':').trim();
            headers.append(key, value);
        }
    });
    return headers;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const uploadFetch = (url: string, options: any): Promise<Response> => new Promise((resolve, reject) => {
    const xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.onload = (): void => {
        const opts: any = {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: parseHeaders(xhr.getAllResponseHeaders() || ''),
        };
        opts.url = 'responseURL' in xhr
            ? xhr.responseURL
            : opts.headers.get('X-Request-URL');
        const body: string = 'response' in xhr ? xhr.response : xhr!.responseText;
        resolve(new Response(body, opts));
    };
    xhr.onerror = () => {
        reject(new TypeError('Network request failed'));
    };
    xhr.ontimeout = () => {
        reject(new TypeError('Network request failed'));
    };
    xhr.open(options.method, url, true);

    Object.keys(options.headers).forEach((key) => {
        xhr.setRequestHeader(key, options.headers[key]);
    });

    if (xhr.upload) {
        xhr.upload.onprogress = options.onProgress;
    }

    if (options && typeof options.onAbortPossible === 'function') {
        options.onAbortPossible(() => {
            xhr.abort();
        });
    }

    xhr.send(options.body);
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const fetchUpload = (uri: string, options: any): Promise<Response> => {
    if (options.useUpload) {
        return uploadFetch(uri, options);
    }
    return fetch(uri, options);
};

export default fetchUpload;
