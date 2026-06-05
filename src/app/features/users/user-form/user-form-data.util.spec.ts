import { describe, it, expect } from 'vitest';
import { buildUserFormData, UserFormValue } from './user-form-data.util';

const base: UserFormValue = {
  name: 'Jorge Torres',
  username: 'jorge@tap.com',
  phoneCountry: '+52',
  phoneNumber: '',
  photo: null,
  password: '',
  passwordConfirmation: '',
  profileIds: ['p1', 'p2'],
};

describe('buildUserFormData', () => {
  it('sends required fields and repeats profile_ids[]', () => {
    const fd = buildUserFormData({ ...base, password: 'Secret123', passwordConfirmation: 'Secret123' }, 'create');
    expect(fd.get('name')).toBe('Jorge Torres');
    expect(fd.get('username')).toBe('jorge@tap.com');
    expect(fd.get('password')).toBe('Secret123');
    expect(fd.getAll('profile_ids[]')).toEqual(['p1', 'p2']);
    expect(fd.has('_method')).toBe(false);
  });

  it('adds _method=PUT on edit and omits empty password', () => {
    const fd = buildUserFormData(base, 'edit');
    expect(fd.get('_method')).toBe('PUT');
    expect(fd.has('password')).toBe(false);
  });

  it('includes phone only when a number is present', () => {
    const without = buildUserFormData(base, 'create');
    expect(without.has('phone[number]')).toBe(false);

    const withPhone = buildUserFormData({ ...base, phoneNumber: '3141234567' }, 'create');
    expect(withPhone.get('phone[country_code]')).toBe('+52');
    expect(withPhone.get('phone[number]')).toBe('3141234567');
  });
});
