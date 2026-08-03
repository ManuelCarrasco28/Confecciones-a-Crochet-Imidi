'use client';

import React, { useState } from 'react';
import { X, LogIn, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UserAccount } from '@/lib/types';
import {
  isValidPeruPhone,
  isValidFullName,
  isValidEmail,
  isValidPassword,
  normalizePeruPhone,
  normalizeEmail,
} from '@/lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  // Regla de Hooks de React: Declarar Hooks SIEMPRE en la parte superior
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Campos del Formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!isValidEmail(email)) {
      setErrorMsg('Por favor ingresa un correo electrónico válido (ej. usuario@gmail.com).');
      setLoading(false);
      return;
    }

    if (mode === 'register') {
      if (!isValidFullName(fullName)) {
        setErrorMsg('Por favor ingresa tu nombre y apellido completos (ej. María Carrasco).');
        setLoading(false);
        return;
      }

      if (phone && !isValidPeruPhone(phone)) {
        setErrorMsg('El celular debe tener 9 dígitos y comenzar con 9 (ej. 935240485).');
        setLoading(false);
        return;
      }

      if (!isValidPassword(password)) {
        setErrorMsg('La contraseña debe tener al menos 8 caracteres e incluir letras y números.');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('Las contraseñas no coinciden. Por favor verifícalas.');
        setLoading(false);
        return;
      }
    }

    try {
      const supabase = createClient();
      const cleanEmail = normalizeEmail(email);
      const cleanPhone = phone ? normalizePeruPhone(phone) : '';

      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          setErrorMsg(error.message || 'Error al iniciar sesión. Revisa tu correo y contraseña.');
          setLoading(false);
          return;
        }

        if (data.user) {
          const userMetaRole = data.user.user_metadata?.role || 
            (data.user.email?.toLowerCase() === 'josemanuelcarrascomillan@gmail.com' ? 'admin' : 'cliente');

          const userData: UserAccount = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            email: data.user.email || cleanEmail,
            role: userMetaRole,
          };

          onLoginSuccess(userData);
          setSuccessMsg('¡Bienvenido(a) a Confecciones Imidi!');
          setTimeout(() => {
            onClose();
          }, 600);
        }
      } else {
        // Registro
        const isAdmin = cleanEmail === 'josemanuelcarrascomillan@gmail.com';
        const assignedRole: 'admin' | 'cliente' = isAdmin ? 'admin' : 'cliente';

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: cleanPhone,
              role: assignedRole,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message || 'Error al crear la cuenta. Inténtalo nuevamente.');
          setLoading(false);
          return;
        }

        const userData: UserAccount = {
          id: data?.user?.id,
          name: fullName.trim() || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: cleanPhone,
          role: assignedRole,
        };

        onLoginSuccess(userData);
        setSuccessMsg('¡Registro exitoso! Tu cuenta está activa.');
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Error inesperado de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-[#C4D8D9] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-[#213B3E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón X Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F8F5EF] hover:bg-[#E2ECEC] text-[#213B3E] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado con Logo */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-full border-2 border-[#437579] p-0.5 overflow-hidden mx-auto bg-white shadow-md">
            <img src="/img/logo.png" alt="Confecciones Imidi Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#213B3E]">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta de Cliente'}
          </h2>
          <p className="text-xs text-[#597477]">
            {mode === 'login'
              ? 'Accede a tu cuenta para gestionar tus encargos'
              : 'Regístrate como cliente para solicitar confecciones y arreglos'}
          </p>
        </div>

        {/* Selector entre Iniciar Sesión / Registro */}
        <div className="flex bg-[#F8F5EF] p-1 rounded-2xl border border-[#C4D8D9] mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-[#437579] text-white shadow-sm'
                : 'text-[#597477] hover:text-[#213B3E]'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-[#437579] text-white shadow-sm'
                : 'text-[#597477] hover:text-[#213B3E]'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Mensajes de Alerta */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center space-x-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {mode === 'register' && (
            <>
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-medium focus:outline-none focus:border-[#437579] focus:bg-white transition-all shadow-sm"
                />
                <label
                  htmlFor="fullName"
                  className="absolute left-4 top-2 text-[10px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
                >
                  Nombre Completo
                </label>
              </div>

              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder=" "
                  className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-medium focus:outline-none focus:border-[#437579] focus:bg-white transition-all shadow-sm"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-4 top-2 text-[10px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
                >
                  Teléfono / WhatsApp
                </label>
              </div>
            </>
          )}

          <div className="relative">
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-medium focus:outline-none focus:border-[#437579] focus:bg-white transition-all shadow-sm"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-[10px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
            >
              Correo Electrónico
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-medium focus:outline-none focus:border-[#437579] focus:bg-white transition-all shadow-sm"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-[10px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
            >
              Contraseña
            </label>
          </div>

          {mode === 'register' && (
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
                className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-medium focus:outline-none focus:border-[#437579] focus:bg-white transition-all shadow-sm"
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-4 top-2 text-[10px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
              >
                Confirmar Contraseña
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-[#437579] hover:bg-[#335C60] text-white font-bold py-3.5 rounded-2xl shadow-md transition-all uppercase tracking-wider text-xs mt-2"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creando...' : 'Crear mi Cuenta de Cliente'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E2ECEC] text-center text-xs text-[#597477]">
          {mode === 'login' ? (
            <p>
              ¿No tienes cuenta aún?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#437579] font-bold hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#437579] font-bold hover:underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
