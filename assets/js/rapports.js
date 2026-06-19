/**
 * Module de gestion des rapports et statistiques
 */

const Rapports = {
  COURRIERS_KEY: 'myassist_courriers',
  RENDEZVOUS_KEY: 'myassist_rendezvous',
  CONTACTS_KEY: 'myassist_contacts',
  DOCUMENTS_KEY: 'myassist_documents',

  /**
   * Initialiser le module
   */
  async init() {
    await this.ensureDemoData();
    await this.loadStats();
  },

  /**
   * S'assurer que les données de démonstration existent
   */
  async ensureDemoData() {
    const courriers = await Storage.getData(this.COURRIERS_KEY);
    const rendezvous = await Storage.getData(this.RENDEZVOUS_KEY);
    const contacts = await Storage.getData(this.CONTACTS_KEY);
    const documents = await Storage.getData(this.DOCUMENTS_KEY);

    if (courriers.length === 0 && rendezvous.length === 0 && contacts.length === 0 && documents.length === 0) {
      console.log('Création des données de démonstration pour rapports...');
      App.createDemoData(true);
    }
  },

  /**
   * Charger les statistiques
   */
  async loadStats() {
    const courriers = await Storage.getData(this.COURRIERS_KEY);
    const rendezvous = await Storage.getData(this.RENDEZVOUS_KEY);
    const contacts = await Storage.getData(this.CONTACTS_KEY);
    const documents = await Storage.getData(this.DOCUMENTS_KEY);

    // Totals
    document.getElementById('stat-total-courriers').textContent = courriers.length;
    document.getElementById('stat-total-rendezvous').textContent = rendezvous.length;
    document.getElementById('stat-total-contacts').textContent = contacts.length;
    document.getElementById('stat-total-documents').textContent = documents.length;

    // Courriers par statut
    this.renderCourriersByStatut(courriers);

    // Rendez-vous par statut
    this.renderRendezvousByStatut(rendezvous);
  },

  /**
   * Afficher les courriers par statut
   * @param {Array} courriers - Liste des courriers
   */
  renderCourriersByStatut(courriers) {
    const container = document.getElementById('courriers-by-statut');
    
    const stats = {
      'reçu': courriers.filter(c => c.statut === 'reçu').length,
      'en cours': courriers.filter(c => c.statut === 'en cours').length,
      'traité': courriers.filter(c => c.statut === 'traité').length,
      'archivé': courriers.filter(c => c.statut === 'archivé').length
    };

    if (courriers.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">Aucune donnée</p>';
      return;
    }

    container.innerHTML = Object.entries(stats).map(([statut, count]) => `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          ${App.getStatusBadge(statut)}
          <span class="text-sm text-gray-700 capitalize">${statut}</span>
        </div>
        <span class="text-sm font-semibold text-gray-900">${count}</span>
      </div>
    `).join('');
  },

  /**
   * Afficher les rendez-vous par statut
   * @param {Array} rendezvous - Liste des rendez-vous
   */
  renderRendezvousByStatut(rendezvous) {
    const container = document.getElementById('rendezvous-by-statut');
    
    const stats = {
      'prévu': rendezvous.filter(r => r.statut === 'prévu').length,
      'confirmé': rendezvous.filter(r => r.statut === 'confirmé').length,
      'annulé': rendezvous.filter(r => r.statut === 'annulé').length,
      'terminé': rendezvous.filter(r => r.statut === 'terminé').length
    };

    if (rendezvous.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">Aucune donnée</p>';
      return;
    }

    container.innerHTML = Object.entries(stats).map(([statut, count]) => `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          ${App.getStatusBadge(statut)}
          <span class="text-sm text-gray-700 capitalize">${statut}</span>
        </div>
        <span class="text-sm font-semibold text-gray-900">${count}</span>
      </div>
    `).join('');
  }
};
