import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { InputUi } from '@/uikit';

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
        render(<InputUi />, container);
    });
    expect(container).toBeDefined();
});

it('should have correct placeholder', () => {
    act(() => {
        render(<InputUi placeholder="placeholder text" />, container);
    });
    const { placeholder } = container?.querySelector('[data-testid="input"]');
    expect(placeholder).toBe('placeholder text');
});

it('should have correct label', () => {
    act(() => {
        render(<InputUi label="label text" />, container);
    });
    const element = container.querySelector('[data-testid="input-label"]');
    expect(element.textContent).toBe('label text');
});

it('should have correct tooltip', () => {
    act(() => {
        render(<InputUi prepend="prepend text" tooltip="tooltip text" label="label text" />, container);
    });
    expect(container.querySelector('[data-testid="tooltip-toolbar"]')).toBeDefined();
});

it('should have correct invalid', () => {
    act(() => {
        render(<InputUi isInvalid showError error="error text" />, container);
    });
    expect(container.querySelector('[data-testid="input-error"]').textContent).toBe('error text');
    expect(container.querySelector('[data-testid="input-error-empty"]')).toBe(null);
});

it('should have correct callbacks props', () => {
    const [onChange, onKeyDown, onFocus, onBlur] = new Array(4).fill(jest.fn());
    act(() => {
        render(<InputUi onChange={onChange} onKeyDown={onKeyDown} onFocus={onFocus} onBlur={onBlur} />, container);
    });
    const input = container.querySelector('[data-testid="input"]');
    Simulate.focus(input);
    Simulate.keyDown(input);
    Simulate.blur(input);
    expect(onKeyDown).toHaveBeenCalledWith(expect.anything());
    expect(onFocus).toHaveBeenCalledWith(expect.anything());
    expect(onBlur).toHaveBeenCalledWith(expect.anything());
});

it('should correct min number', () => {
    const onChange = jest.fn();
    act(() => {
        render(<InputUi min={100} value={1} isNumber onChange={onChange} />, container);
    });
    const input = container.querySelector('[data-testid="input"]');
    Simulate.change(input, { target: { value: '1' } } as any);
    expect(onChange).toHaveBeenCalledWith(100, expect.anything());
    expect(input.value).toEqual('100');
});

it('should correct max number', () => {
    const onChange = jest.fn();
    act(() => {
        render(<InputUi max={100} value={100000} isNumber onChange={onChange} />, container);
    });
    const input = container.querySelector('[data-testid="input"]');
    Simulate.change(input, { target: { value: '432423423213' } } as any);
    expect(onChange).toHaveBeenCalledWith(100, expect.anything());
    expect(input.value).toEqual('100');
});

it('should correct min float', () => {
    const onChange = jest.fn();
    act(() => {
        render(<InputUi min={100.123} value={1} isFloat onChange={onChange} />, container);
    });
    const input = container.querySelector('[data-testid="input"]');
    Simulate.change(input, { target: { value: '1' } } as any);
    expect(onChange).toHaveBeenCalledWith(100.123, expect.anything());
    expect(input.value).toEqual('100.123');
});

it('should correct max float', () => {
    const onChange = jest.fn();
    act(() => {
        render(<InputUi max={123.456} value={12345678} isFloat onChange={onChange} />, container);
    });
    const input = container.querySelector('[data-testid="input"]');
    Simulate.change(input, { target: { value: '432423423213' } } as any);
    expect(onChange).toHaveBeenCalledWith(123.456, expect.anything());
    expect(input.value).toEqual('123.456');
});

it('should correct keydown number increase', () => {
    const onChange = jest.fn();
    act(() => {
        render(<InputUi value={10} isNumber onChange={onChange} />, container);
    });
    const input = container.querySelector('[data-testid="input"]');
    Simulate.keyDown(input, { keyCode: 38 });
    expect(onChange).toHaveBeenCalledWith(11, expect.anything());
    Simulate.keyDown(input, { keyCode: 40 });
    expect(onChange).toHaveBeenCalledWith(10, expect.anything());
});

it('should correct keydown float increase', () => {
    const onChange = jest.fn();
    act(() => {
        render(<InputUi value={10.1} isFloat onChange={onChange} />, container);
    });
    const input = container.querySelector('[data-testid="input"]');
    Simulate.keyDown(input, { keyCode: 38 });
    expect(onChange).toHaveBeenCalledWith(11.1, expect.anything());
    Simulate.keyDown(input, { keyCode: 40 });
    expect(onChange).toHaveBeenCalledWith(10.1, expect.anything());
});
