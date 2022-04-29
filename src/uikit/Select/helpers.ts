const fontSize = '14px';

export const styles = {
    control: (styles: object): object => ({
        ...styles,
        backgroundColor: 'white',
        fontSize,
    }),
    container: (styles: object): object => ({
        ...styles,
        fontSize,
    }),
    menu: (styles: object): object => ({
        ...styles,
        zIndex: 9999,
        backgroundColor: ' #fff',
        fontSize,
    }),
    multiValue: (styles: object): object => ({
        ...styles,
        color: '#fff',
        backgroundColor: ' #242C37',
        fontSize,
    }),
    multiValueLabel: (styles: object): object => ({
        ...styles,
        color: '#fff',
        fontSize,
    }),
    option: (styles: object, { isDisabled, isFocused, isSelected }): object => ({
        ...styles,
        backgroundColor: isDisabled
            ? null
            : isSelected
                ? '#F9FAFB'
                : isFocused
                    ? '#fff'
                    : null,
        color: isDisabled ? '#ccc' : isSelected ? '#242C37' : '#242C37',
        cursor: isDisabled ? 'not-allowed' : 'default',
        ':active': {
            ...styles[':active'],
            backgroundColor: !isDisabled && isSelected ? '#F9FAFB' : '#F9FAFB',
        },
        fontSize,
    }),
};
