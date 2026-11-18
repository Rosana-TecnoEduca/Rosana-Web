/**
 * ===================================================================
 * CLIENTE Y SERVICIOS SUPABASE - TECNOEDUCA / PROF. ROSANA
 * ===================================================================
 * Conexión centralizada a la base de datos Supabase en la nube.
 * Mantiene sincronización bidireccional inteligente con LocalStorage
 * para máxima velocidad, funcionamiento offline y persistencia real.
 */

const SUPABASE_CONFIG = {
  url: 'https://gzpbqtajawakaeufvxat.supabase.co',
  anonKey: 'sb_publishable_99seo5jqMjSqe9ua1aRTrA_UOOkFIQX'
};

// Inicialización del cliente Supabase
let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      console.log('⚡ Cliente Supabase conectado.');
    } catch (err) {
      console.warn('⚠️ Error al crear cliente Supabase:', err);
    }
  }
  return supabaseClient;
}

// Intentar inicialización inmediata
getSupabaseClient();

const supabaseDB = {
  get client() {
    return getSupabaseClient();
  },
  isAvailable: () => !!getSupabaseClient(),

  // ================================================================
  // VERIFICACIÓN DE CONEXIÓN
  // ================================================================
  async checkConnection() {
    const client = getSupabaseClient();
    if (!client) {
      return {
        ok: false,
        success: false,
        error: { message: 'La librería Supabase no se cargó todavía o no hay conexión a internet.' }
      };
    }
    try {
      const { data, error } = await client.from('settings').select('id').limit(1);
      if (error) {
        console.warn('Supabase checkConnection error:', error);
        return { ok: false, success: false, error };
      }
      return { ok: true, success: true, data };
    } catch (err) {
      console.warn('Supabase checkConnection catch:', err);
      return { ok: false, success: false, error: err };
    }
  },

  // ================================================================
  // ARTÍCULOS DE BLOG
  // ================================================================
  async getArticles() {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        localStorage.setItem('tecnoeduca_articles', JSON.stringify(data));
        return data;
      }
      return [];
    } catch (err) {
      console.warn('⚠️ Supabase getArticles fallback a local:', err.message);
      return null;
    }
  },

  // ================================================================
  // LIBROS Y APUNTES (BIBLIOTECA)
  // ================================================================
  async getBooks() {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const books = data || [];
      localStorage.setItem('tecnoeduca_books', JSON.stringify(books));
      return books;
    } catch (err) {
      console.warn('⚠️ Supabase getBooks fallback a local:', err.message);
      return null;
    }
  },

  // ================================================================
  // BANCO DE RECURSOS
  // ================================================================
  async getResources() {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        localStorage.setItem('tecnoeduca_resources', JSON.stringify(data));
        return data;
      }
      return [];
    } catch (err) {
      console.warn('⚠️ Supabase getResources fallback a local:', err.message);
      return null;
    }
  },

  // ================================================================
  // MENSAJES DE CONTACTO
  // ================================================================
  async insertMessage(msg) {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error('Cliente Supabase no disponible. Verificá la conexión e intentá nuevamente.');
    }
    try {
      const { error } = await client
        .from('messages')
        .insert({
          id: msg.id || 'msg-' + Date.now(),
          name: msg.name,
          email: msg.email,
          phone: msg.phone || '',
          subject: msg.subject || '',
          message: msg.message,
          date: msg.date || new Date().toLocaleString('es-AR'),
          read: !!msg.read
        });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('❌ Error al enviar mensaje a Supabase:', err.message);
      throw err;
    }
  },

  // ================================================================
  // CONFIGURACIÓN GENERAL Y REDES
  // ================================================================
  async getSettings() {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('settings')
        .select('id,email,phone,whatsapp,phoneClean,whatsappMsg,address,bio,cvAlternative,cvUrl,canvaLink,canvaUrl,cvFileName,cvFileData,cvFileType,facebook,facebookPersonal,instagram,instagramPersonal,tiktok,telegram,discord,linkedin,github,githubOrg,youtube,threads,threadsPersonal,substack,updated_at')
        .eq('id', 'general')
        .maybeSingle();
      if (error) throw error;
      if (data) {
        const settings = Object.fromEntries(
          Object.entries(data).filter(([, value]) => value !== null)
        );
        localStorage.setItem('tecnoeduca_settings', JSON.stringify(settings));
        return settings;
      }
      return null;
    } catch (err) {
      console.warn('⚠️ Supabase getSettings fallback a local:', err.message);
      return null;
    }
  },

};

window.supabaseDB = supabaseDB;

