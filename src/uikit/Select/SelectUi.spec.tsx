import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { SelectUi } from '@/uikit';

const optionsString = [...new Array(100).keys()].map((value) => ({
    value: `${value}`,
    label: `label ${value}`,
}));

let container: any = null;
beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it('should be defined', () => {
    act(() => {
        render(<SelectUi />, container);
    });
    expect(container).toBeDefined();
});

it('should be defined', () => {
    act(() => {
        render(<SelectUi options={optionsString} />, container);
    });
    expect(container).toBeDefined();
});

it('should have correct invalid', () => {
    act(() => {
        render(<SelectUi isInvalid showError error="error text" options={optionsString} />, container);
    });
    expect(container.querySelector('[data-testid="select-error"]').textContent).toBe('error text');
    expect(container.querySelector('[data-testid="select-error-empty"]')).toEqual(null);
});

it('should have correct label', () => {
    act(() => {
        render(<SelectUi label="label text" options={optionsString} />, container);
    });
    const label = container.querySelector('[data-testid="select-label"]');
    expect(label.textContent).toEqual('label text');
});

it('should have correct tooltip', () => {
    act(() => {
        render(<SelectUi options={optionsString} tooltip="tooltip text" />, container);
    });
    expect(container.querySelector('[data-testid="tooltip-toolbar"]')).toBeDefined();
});
