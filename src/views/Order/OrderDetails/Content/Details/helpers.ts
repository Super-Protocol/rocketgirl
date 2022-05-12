const info = [
    {
        key: 'Id',
        value: '',
    }, {
        key: 'File',
        value: 'Name, 14TAR',
    }, {
        key: 'Total Deposit',
        value: 400,
    }, {
        key: 'Unspent Deposit',
        value: 240,
    }, {
        key: 'Status',
        value: 'Done',
    }, {
        key: 'Status information',
        value: 'Link',
    }, {
        key: 'Modified Date',
        value: '14.12.2020 13:30',
    },
];

const tee = [
    {
        key: 'Id',
        value: '',
    }, {
        key: 'Provider',
        value: 'Provider 1',
    }, {
        key: 'Name',
        value: 'Confirmations',
    }, {
        key: 'Description',
        value: '132 Bloаhfuk2353rjkshdjcsdfq23...',
    }, {
        key: 'Estimated cost',
        value: 12,
    }, {
        key: 'Actual cost:',
        value: 130,
    },
];

export const getOrderInfo = (id: string) => {
    return info.map((item) => {
        if (item.key === 'Id') {
            return { ...item, value: id };
        }
        return item;
    });
};

export const getOrderTee = (id: string) => {
    return tee.map((item) => {
        if (item.key === 'Id') {
            return { ...item, value: id };
        }
        return item;
    });
};
