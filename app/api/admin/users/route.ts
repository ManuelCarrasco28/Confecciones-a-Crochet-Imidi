import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createRouteClient } from '@/lib/supabase/server';

type UserRole = 'admin' | 'cliente';

type CreateUserBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
  role?: unknown;
};

const OWNER_EMAIL = 'josemanuelcarrascomillan@gmail.com';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PERU_MOBILE_PATTERN = /^9\d{8}$/;

export const runtime = 'nodejs';

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizePeruMobile(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('51') && digits.length === 11 ? digits.slice(2) : digits;
}

function readRole(value: unknown): UserRole {
  return value === 'admin' ? 'admin' : 'cliente';
}

async function readRequester(request: Request, supabaseUrl: string, supabaseAnonKey: string) {
  const authHeader = request.headers.get('authorization');

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    const authClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    const { data, error } = await authClient.auth.getUser(token);

    if (!error && data.user) {
      return {
        id: data.user.id,
        email: data.user.email?.toLowerCase() || '',
      };
    }
  }

  const routeClient = await createRouteClient();
  const { data } = await routeClient.auth.getUser();

  return {
    id: data.user?.id || '',
    email: data.user?.email?.toLowerCase() || '',
  };
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { error: 'Falta configurar Supabase para crear usuarios desde el panel admin.' },
      { status: 500 }
    );
  }

  const adminClient = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const requester = await readRequester(request, supabaseUrl, supabaseAnonKey);

  if (!requester.id && requester.email !== OWNER_EMAIL) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const { data: requesterProfile } = requester.id
    ? await adminClient
        .from('profiles')
        .select('role')
        .eq('id', requester.id)
        .maybeSingle()
    : { data: null };

  const isAllowedAdmin =
    requester.email === OWNER_EMAIL || requesterProfile?.role === 'admin';

  if (!isAllowedAdmin) {
    return NextResponse.json({ error: 'No tienes permisos para crear usuarios.' }, { status: 403 });
  }

  let body: CreateUserBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Datos invalidos.' }, { status: 400 });
  }

  const name = readString(body.name);
  const email = readString(body.email).toLowerCase();
  const phone = normalizePeruMobile(readString(body.phone));
  const password = readString(body.password);
  const role = readRole(body.role);

  if (name.length < 3) {
    return NextResponse.json({ error: 'El nombre debe tener al menos 3 caracteres.' }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'Correo electronico invalido.' }, { status: 400 });
  }

  if (!PERU_MOBILE_PATTERN.test(phone)) {
    return NextResponse.json(
      { error: 'El celular debe tener 9 digitos y empezar con 9.' },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'La contrasena debe tener al menos 8 caracteres.' },
      { status: 400 }
    );
  }

  const { data: createdData, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: name,
      phone,
      role,
    },
  });

  if (createError) {
    return NextResponse.json(
      { error: createError.message || 'No se pudo crear el usuario.' },
      { status: 400 }
    );
  }

  const createdUser = createdData.user;

  if (!createdUser) {
    return NextResponse.json({ error: 'Supabase no devolvio el usuario creado.' }, { status: 500 });
  }

  const { error: profileError } = await adminClient.from('profiles').upsert(
    {
      id: createdUser.id,
      full_name: name,
      email,
      phone,
      role,
    },
    { onConflict: 'id' }
  );

  if (profileError) {
    await adminClient.auth.admin.deleteUser(createdUser.id);
    return NextResponse.json(
      { error: profileError.message || 'No se pudo guardar el perfil del usuario.' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    user: {
      id: createdUser.id,
      name,
      email,
      phone,
      role,
      createdAt: createdUser.created_at,
    },
  });
}
