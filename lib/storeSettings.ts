import { createClient } from './supabase/client';

export interface BusinessConfig {
  name: string;
  phone: string;
  email: string;
  facebook: string;
  address: string;
  schedule: string;
}

export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
  name: 'Confecciones a Crochet Imidi',
  phone: '935240485',
  email: 'josemanuelcarrascomillan@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=100054925651425',
  address: 'Jaén, Perú',
  schedule: 'Lunes a Sábado: 8:00 am - 8:00 pm',
};

export async function fetchBusinessConfig(): Promise<BusinessConfig> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('business_config')
    .select('name, phone, email, facebook, address, schedule')
    .eq('id', 1)
    .maybeSingle();

  if (error) throw error;
  return data ? { ...DEFAULT_BUSINESS_CONFIG, ...data } : DEFAULT_BUSINESS_CONFIG;
}

export async function saveBusinessConfig(config: BusinessConfig): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('business_config').upsert({
    id: 1,
    ...config,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export function toPeruWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('51') ? digits : `51${digits}`;
}
