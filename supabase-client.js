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
      if (data && data.length > 0) {
        localStorage.setItem('tecnoeduca_articles', JSON.stringify(data));
        return data;
      }
      return null;
    } catch (err) {
      console.warn('⚠️ Supabase getArticles fallback a local:', err.message);
      return null;
    }
  },

  async upsertArticle(article) {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('articles')
        .upsert({
          id: article.id,
          title: article.title,
          category: article.category,
          date: article.date,
          scheduledDate: article.scheduledDate,
          scheduledTime: article.scheduledTime,
          scheduledAt: article.scheduledAt,
          publishStatus: article.publishStatus || 'published',
          readTime: article.readTime,
          excerpt: article.excerpt,
          body: article.body,
          videoUrl: article.videoUrl || '',
          downloadUrl: article.downloadUrl || '',
          comments: article.comments || [],
          updated_at: new Date().toISOString()
        })
        .select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('❌ Error al guardar artículo en Supabase:', err.message);
      throw err;
    }
  },

  async deleteArticle(id) {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client
        .from('articles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('❌ Error al eliminar artículo en Supabase:', err.message);
      throw err;
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
      if (data && data.length > 0) {
        localStorage.setItem('tecnoeduca_books', JSON.stringify(data));
        return data;
      }
      return null;
    } catch (err) {
      console.warn('⚠️ Supabase getBooks fallback a local:', err.message);
      return null;
    }
  },

  async upsertBook(book) {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('books')
        .upsert({
          id: book.id,
          title: book.title,
          author: book.author,
          category: book.category,
          year: book.year,
          pages: book.pages,
          excerpt: book.excerpt,
          driveUrl: book.driveUrl,
          accessType: book.accessType || 'free',
          date: book.date
        })
        .select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('❌ Error al guardar libro en Supabase:', err.message);
      throw err;
    }
  },

  async deleteBook(id) {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client
        .from('books')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('❌ Error al eliminar libro en Supabase:', err.message);
      throw err;
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
      if (data && data.length > 0) {
        localStorage.setItem('tecnoeduca_resources', JSON.stringify(data));
        return data;
      }
      return null;
    } catch (err) {
      console.warn('⚠️ Supabase getResources fallback a local:', err.message);
      return null;
    }
  },

  async upsertResource(res) {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('resources')
        .upsert({
          id: res.id,
          title: res.title,
          category: res.category,
          categoryLabel: res.categoryLabel,
          format: res.format,
          formatIcon: res.formatIcon,
          software: res.software,
          description: res.description,
          previewIcon: res.previewIcon,
          previewColor: res.previewColor,
          url: res.url,
          fileType: res.fileType || 'download',
          authorCredit: res.authorCredit,
          license: res.license,
          licenseType: res.licenseType,
          date: res.date
        })
        .select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('❌ Error al guardar recurso en Supabase:', err.message);
      throw err;
    }
  },

  async deleteResource(id) {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client
        .from('resources')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('❌ Error al eliminar recurso en Supabase:', err.message);
      throw err;
    }
  },

  // ================================================================
  // MENSAJES DE CONTACTO
  // ================================================================
  async getMessages() {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        localStorage.setItem('tecnoeduca_messages', JSON.stringify(data));
        return data;
      }
      return null;
    } catch (err) {
      console.warn('⚠️ Supabase getMessages fallback a local:', err.message);
      return null;
    }
  },

  async insertMessage(msg) {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
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
        })
        .select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('❌ Error al enviar mensaje a Supabase:', err.message);
      throw err;
    }
  },

  async markMessageRead(id, readStatus = true) {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client
        .from('messages')
        .update({ read: readStatus })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('❌ Error al actualizar estado de mensaje en Supabase:', err.message);
      throw err;
    }
  },

  async deleteMessage(id) {
    const client = getSupabaseClient();
    if (!client) return false;
    try {
      const { error } = await client
        .from('messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('❌ Error al eliminar mensaje en Supabase:', err.message);
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
        .select('*')
        .eq('id', 'general')
        .maybeSingle();
      if (error) throw error;
      if (data) {
        localStorage.setItem('tecnoeduca_settings', JSON.stringify(data));
        return data;
      }
      return null;
    } catch (err) {
      console.warn('⚠️ Supabase getSettings fallback a local:', err.message);
      return null;
    }
  },

  async upsertSettings(settings) {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data, error } = await client
        .from('settings')
        .upsert({
          id: 'general',
          email: settings.email || 'tecnoeduca81@gmail.com',
          phone: settings.phoneClean || settings.phone || '',
          whatsappMsg: settings.whatsappMsg || 'Hola Rosana! Quisiera coordinar una clase.',
          address: settings.address || 'Luján, Buenos Aires, Argentina',
          bio: settings.bio || '',
          cvAlternative: settings.cvUrl || settings.cvAlternative || '',
          canvaLink: settings.canvaUrl || settings.canvaLink || '',
          cvFileName: settings.cvFileName || '',
          cvFileData: settings.cvFileData || '',
          facebook: settings.facebook || '',
          instagram: settings.instagram || '',
          instagramPersonal: settings.instagramPersonal || '',
          tiktok: settings.tiktok || '',
          telegram: settings.telegram || '',
          discord: settings.discord || '',
          linkedin: settings.linkedin || '',
          adminPass: settings.adminPass || 'tecnoeduca2026',
          updated_at: new Date().toISOString()
        })
        .select();
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('❌ Error al guardar settings en Supabase:', err.message || err);
      throw err;
    }
  },

  // ================================================================
  // SINCRONIZACIÓN COMPLETA (LOCAL A NUBE)
  // ================================================================
  async syncAllLocalToSupabase() {
    const client = getSupabaseClient();
    if (!client) throw new Error('Cliente Supabase no conectado. Verificá tu conexión a internet.');

    const results = { articles: 0, books: 0, resources: 0, settings: false };
    const errors = [];

    // 1. Artículos
    try {
      let articles = JSON.parse(localStorage.getItem('tecnoeduca_articles') || '[]');
      if ((!articles || articles.length === 0)) {
        if (typeof DEFAULT_ARTICLES !== 'undefined') articles = DEFAULT_ARTICLES;
        else if (typeof DEFAULT_BLOG_POSTS !== 'undefined') articles = DEFAULT_BLOG_POSTS;
      }
      for (const art of articles) {
        await this.upsertArticle(art);
        results.articles++;
      }
    } catch (err) {
      console.error('Error sincronizando artículos:', err);
      errors.push({ modulo: 'Artículos del Blog', detalle: err.message || (typeof err === 'string' ? err : JSON.stringify(err)) });
    }

    // 2. Libros
    try {
      let books = JSON.parse(localStorage.getItem('tecnoeduca_books') || '[]');
      if ((!books || books.length === 0) && typeof DEFAULT_BOOKS !== 'undefined') {
        books = DEFAULT_BOOKS;
      }
      for (const b of books) {
        await this.upsertBook(b);
        results.books++;
      }
    } catch (err) {
      console.error('Error sincronizando libros:', err);
      errors.push({ modulo: 'Libros de Biblioteca', detalle: err.message || (typeof err === 'string' ? err : JSON.stringify(err)) });
    }

    // 3. Recursos
    try {
      let resources = JSON.parse(localStorage.getItem('tecnoeduca_resources') || '[]');
      if ((!resources || resources.length === 0) && typeof DEFAULT_RESOURCES !== 'undefined') {
        resources = DEFAULT_RESOURCES;
      }
      for (const r of resources) {
        await this.upsertResource(r);
        results.resources++;
      }
    } catch (err) {
      console.error('Error sincronizando recursos:', err);
      errors.push({ modulo: 'Banco de Recursos', detalle: err.message || (typeof err === 'string' ? err : JSON.stringify(err)) });
    }

    // 4. Settings
    try {
      let settings = JSON.parse(localStorage.getItem('tecnoeduca_settings') || '{}');
      if ((!settings || Object.keys(settings).length === 0) && typeof DEFAULT_SETTINGS !== 'undefined') {
        settings = DEFAULT_SETTINGS;
      }
      if (settings && Object.keys(settings).length > 0) {
        await this.upsertSettings(settings);
        results.settings = true;
      }
    } catch (err) {
      console.error('Error sincronizando ajustes:', err);
      errors.push({ modulo: 'Ajustes y Redes Sociales', detalle: err.message || (typeof err === 'string' ? err : JSON.stringify(err)) });
    }

    if (errors.length > 0) {
      return { ok: false, success: false, ...results, errors };
    }

    return { ok: true, success: true, ...results, errors: [] };
  }
};

window.supabaseDB = supabaseDB;

