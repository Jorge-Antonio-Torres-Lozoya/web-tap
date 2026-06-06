import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiSelectComponent } from './multi-select.component';

describe('MultiSelectComponent', () => {
  let fixture: ComponentFixture<MultiSelectComponent>;
  let comp: MultiSelectComponent;
  let emitted: string[][];

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectComponent);
    comp = fixture.componentInstance;
    fixture.componentRef.setInput('options', [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ]);
    emitted = [];
    comp.registerOnChange((v) => emitted.push(v));
  });

  it('reflects the written value', () => {
    comp.writeValue(['a']);
    expect(comp.isSelected('a')).toBe(true);
    expect(comp.isSelected('b')).toBe(false);
  });

  it('toggles selection and emits the new value', () => {
    comp.writeValue(['a']);
    comp.toggle('b');
    expect(emitted.at(-1)).toEqual(['a', 'b']);
    comp.toggle('a');
    expect(emitted.at(-1)).toEqual(['b']);
  });

  it('does not toggle a locked (disabled) option', () => {
    fixture.componentRef.setInput('options', [
      { value: 'profiles', label: 'Perfiles' },
      { value: 'users', label: 'Usuarios', disabled: true },
    ]);
    comp.toggle('users');
    expect(comp.isSelected('users')).toBe(false);
    expect(emitted.length).toBe(0);
  });
});
