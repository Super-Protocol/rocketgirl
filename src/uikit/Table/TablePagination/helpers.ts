export const getPagesGroups = (currentPage: number, totalPages: number, isUseCursor: boolean): (number[] | null)[] => {
    if (isUseCursor) return [[currentPage]];
    const pages: number[] = [...Array(totalPages).keys()].map((item) => (item + 1));
    const pg: (number[] | null)[] = [];
    const groupSize = 5;

    if (totalPages <= groupSize + 2) {
        pg.push(pages);
    } else if (currentPage < groupSize) {
        pg.push(
            pages.slice(0, groupSize),
            null,
            pages.splice(totalPages - 1),
        );
    } else if (currentPage > (pages.length - groupSize + 1)) {
        pg.push(
            pages.slice(0, 1),
            null,
            pages.splice(totalPages - groupSize),
        );
    } else {
        pg.push(
            pages.slice(0, 1),
            null,
            pages.slice(
                Math.trunc(currentPage - groupSize / 2),
                Math.trunc(currentPage + groupSize / 2),
            ),
            null,
            pages.splice(totalPages - 1),
        );
    }
    return pg;
};

export const getActiveIndexes = (pageSize: number, pageIndex: number): number[] => Array
    .from(Array(pageSize).keys())
    .map((index) => index + pageIndex * pageSize);
