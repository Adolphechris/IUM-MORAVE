const { initDatabase } = require('../../../shared/db');

function getDb() {
  const db = initDatabase();
  if (!db) {
    throw new Error('Database not available');
  }
  return db;
}

async function blacklistToken(token, expiresAt) {
  try {
    const db = getDb();
    await db.from('token_blacklist').insert({
      token,
      expires_at: expiresAt || new Date(Date.now() + 3600000).toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('[auth-service] Failed to blacklist token:', error);
    return { success: false, error };
  }
}

async function isTokenBlacklisted(token) {
  try {
    const db = getDb();
    const { data } = await db.from('token_blacklist')
      .select('token')
      .eq('token', token)
      .lt('expires_at', new Date().toISOString())
      .maybeSingle();
    return !!data;
  } catch (error) {
    console.error('[auth-service] Failed to check token blacklist:', error);
    return false;
  }
}

async function cleanExpiredTokens() {
  try {
    const db = getDb();
    await db.from('token_blacklist')
      .delete()
      .lt('expires_at', new Date().toISOString());
  } catch (error) {
    console.error('[auth-service] Failed to clean expired tokens:', error);
  }
}

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
  cleanExpiredTokens
};
