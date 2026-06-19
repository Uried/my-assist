/**
 * Module d'authentification
 * Gestion de la connexion, déconnexion et sessions
 */

const Auth = {
  USER_KEY: 'myassist_users',
  SESSION_KEY: 'myassist_session',

  /**
   * Initialiser l'admin par défaut et les données de démonstration
   */
  async initDefaultAdmin() {
    const users = await Storage.getData(this.USER_KEY);
    
    if (users.length === 0) {
      const admin = {
        id: Storage.generateId(),
        nom: 'Administrateur',
        email: 'admin@myassist.local',
        password: 'Admin123!',
        role: 'admin',
        statut: 'actif',
        createdAt: new Date().toISOString()
      };
      
      await Storage.addItem(this.USER_KEY, admin);
      console.log('Admin par défaut créé');
      
      // Créer automatiquement les données de démonstration
      await App.createDemoData();
    }
  },

  /**
   * Connexion utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object|null>} Utilisateur connecté ou null
   */
  async login(email, password) {
    const users = await Storage.getData(this.USER_KEY);
    const user = users.find(u => u.email === email && u.password === password && u.statut === 'actif');
    
    if (user) {
      const session = {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return session;
    }
    
    return null;
  },

  /**
   * Déconnexion
   */
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    window.location.href = 'login.html';
  },

  /**
   * Récupérer l'utilisateur connecté
   * @returns {Object|null} Session utilisateur ou null
   */
  getCurrentUser() {
    const session = localStorage.getItem(this.SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean} True si connecté
   */
  checkAuth() {
    const user = this.getCurrentUser();
    
    if (!user) {
      window.location.href = 'login.html';
      return false;
    }
    
    return true;
  },

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   * @param {string} role - Rôle à vérifier
   * @returns {boolean} True si l'utilisateur a le rôle
   */
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  /**
   * Vérifier si l'utilisateur est admin
   * @returns {boolean} True si admin
   */
  isAdmin() {
    return this.hasRole('admin');
  }
};
