/**
 * Module de gestion des paramètres
 */

const Settings = {
  /**
   * Initialiser le module
   */
  init() {
    this.displayCurrentUser();
  },

  /**
   * Afficher les informations de l'utilisateur connecté
   */
  displayCurrentUser() {
    const user = Auth.getCurrentUser();
    
    if (user) {
      document.getElementById('current-user-nom').value = user.nom;
      document.getElementById('current-user-email').value = user.email;
      document.getElementById('current-user-role').value = user.role;
    }
  },

  /**
   * Réinitialiser toutes les données
   */
  resetAllData() {
    App.showConfirmModal('Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.', () => {
      App.showConfirmModal('Cette action va supprimer TOUTES les données. Confirmer ?', () => {
        Storage.clearAll();
        App.showToast('Toutes les données ont été réinitialisées', 'success');
        
        // Recréer l'admin par défaut
        setTimeout(() => {
          Auth.initDefaultAdmin();
          window.location.href = 'login.html';
        }, 1000);
      }, 'Confirmation finale');
    }, 'Réinitialiser les données');
  }
};
