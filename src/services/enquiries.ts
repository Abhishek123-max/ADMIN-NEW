import { api } from '../lib/api';

export interface EnquiryPayload {
  property_id: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface SellEnquiryPayload {
  name: string;
  phone: string;
  location: string;
  message: string;
}

export interface ContactEnquiryPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export async function createEnquiry(payload: EnquiryPayload) {
  await api.post('/enquiries', payload);
}

export async function createContactEnquiry(payload: ContactEnquiryPayload) {
  await api.post('/admin/contact-enquiries', payload);
}

export async function createSellEnquiry(payload: SellEnquiryPayload) {
  await api.post('/admin/sell-enquiries', payload);
}

