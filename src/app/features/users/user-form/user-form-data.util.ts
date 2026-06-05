export interface UserFormValue {
  name: string;
  username: string;
  phoneCountry: string;
  phoneNumber: string;
  photo: File | null;
  password: string;
  passwordConfirmation: string;
  profileIds: string[];
}

// Builds the multipart payload for create/update. On edit it adds `_method=PUT`
// and only sends password/photo when provided.
export function buildUserFormData(value: UserFormValue, mode: 'create' | 'edit'): FormData {
  const form = new FormData();
  if (mode === 'edit') form.append('_method', 'PUT');

  form.append('name', value.name);
  form.append('username', value.username);

  if (value.password) {
    form.append('password', value.password);
    form.append('password_confirmation', value.passwordConfirmation);
  }

  if (value.photo) form.append('profile_photo', value.photo);

  if (value.phoneNumber) {
    form.append('phone[country_code]', value.phoneCountry);
    form.append('phone[number]', value.phoneNumber);
  }

  for (const id of value.profileIds) {
    form.append('profile_ids[]', id);
  }

  return form;
}
