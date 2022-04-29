export const setCaretPosition = (
    element: HTMLInputElement & { createTextRange?(): Range & { moveEnd, moveStart, select } },
    start: number | null,
    end = start,
): void => {
    if (element.setSelectionRange) {
        element.setSelectionRange(start, end);
    } else if (element.selectionStart) {
        element.setSelectionRange(start, end);
    } else if (element.createTextRange) {
        const range = element.createTextRange();
        range.collapse(true);
        range.moveEnd('character', start);
        range.moveStart('character', end);
        range.select();
    }
};

export const getCaretPosition = (element: HTMLInputElement): number | null => element.selectionStart;
