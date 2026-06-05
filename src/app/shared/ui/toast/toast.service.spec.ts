import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let svc: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    svc = TestBed.inject(ToastService);
  });

  it('queues a toast and auto-dismisses after the timeout', () => {
    vi.useFakeTimers();
    svc.show('hola', 'success', 1000);
    expect(svc.toasts().length).toBe(1);
    expect(svc.toasts()[0].kind).toBe('success');
    vi.advanceTimersByTime(1000);
    expect(svc.toasts().length).toBe(0);
    vi.useRealTimers();
  });

  it('dismiss removes a toast by id', () => {
    svc.show('a');
    const id = svc.toasts()[0].id;
    svc.dismiss(id);
    expect(svc.toasts().length).toBe(0);
  });

  it('error() uses the error kind', () => {
    svc.error('boom');
    expect(svc.toasts()[0].kind).toBe('error');
  });
});
