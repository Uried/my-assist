/**
 * Module du dashboard
 * Statistiques et affichage des données récentes
 */

const Dashboard = {
  COURRIERS_KEY: 'myassist_courriers',
  RENDEZVOUS_KEY: 'myassist_rendezvous',
  DOCUMENTS_KEY: 'myassist_documents',

  /**
   * Initialiser le dashboard
   */
  async init() {
    // Créer les données de démonstration si elles n'existent pas
    await this.ensureDemoData();
    await this.loadStats();
    await this.loadRecentCourriers();
    await this.loadUpcomingRendezvous();
    await this.loadRecentActivity();
  },

  /**
   * S'assurer que les données de démonstration existent
   */
  async ensureDemoData() {
    const courriers = await Storage.getData(this.COURRIERS_KEY);
    const rendezvous = await Storage.getData(this.RENDEZVOUS_KEY);
    const contacts = await Storage.getData('myassist_contacts');
    const documents = await Storage.getData(this.DOCUMENTS_KEY);

    // Créer les données si toutes les listes sont vides
    if (courriers.length === 0 && rendezvous.length === 0 && contacts.length === 0 && documents.length === 0) {
      console.log('Création des données de démonstration...');
      await App.createDemoData(true);
    }
  },

  /**
   * Charger les statistiques
   */
  async loadStats() {
    const courriers = await Storage.getData(this.COURRIERS_KEY);
    const rendezvous = await Storage.getData(this.RENDEZVOUS_KEY);
    const documents = await Storage.getData(this.DOCUMENTS_KEY);

    const today = new Date().toISOString().split('T')[0];

    // Courriers entrants
    const courriersEntrants = courriers.filter(c => c.type === 'entrant').length;
    document.getElementById('stat-courriers-entrants').textContent = courriersEntrants;

    // Courriers sortants
    const courriersSortants = courriers.filter(c => c.type === 'sortant').length;
    document.getElementById('stat-courriers-sortants').textContent = courriersSortants;

    // Rendez-vous du jour
    const rendezvousJour = rendezvous.filter(r => r.date === today).length;
    document.getElementById('stat-rendezvous-jour').textContent = rendezvousJour;

    // Documents archivés
    const documentsActifs = documents.filter(d => d.statut === 'actif').length;
    document.getElementById('stat-documents').textContent = documentsActifs;
  },

  /**
   * Charger les derniers courriers
   */
  async loadRecentCourriers() {
    const courriers = await Storage.getData(this.COURRIERS_KEY);
    const container = document.getElementById('recent-courriers');

    if (courriers.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">Aucun courrier</p>';
      return;
    }

    const recentCourriers = courriers
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    container.innerHTML = recentCourriers.map(courrier => `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            ${App.getStatusBadge(courrier.type)}
            <span class="font-medium text-gray-800">${courrier.reference || '-'}</span>
          </div>
          <p class="text-sm text-gray-600 mt-1">${courrier.objet}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500">${App.formatDate(courrier.date)}</p>
          ${App.getStatusBadge(courrier.statut)}
        </div>
      </div>
    `).join('');
  },

  /**
   * Charger les prochains rendez-vous
   */
  async loadUpcomingRendezvous() {
    const rendezvous = await Storage.getData(this.RENDEZVOUS_KEY);
    const container = document.getElementById('upcoming-rendezvous');

    if (rendezvous.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">Aucun rendez-vous</p>';
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const upcomingRendezvous = rendezvous
      .filter(r => r.date >= today && r.statut !== 'annulé')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);

    if (upcomingRendezvous.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">Aucun rendez-vous à venir</p>';
      return;
    }

    container.innerHTML = upcomingRendezvous.map(rdv => `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex-1">
          <p class="font-medium text-gray-800">${rdv.titre}</p>
          <p class="text-sm text-gray-600 mt-1">${rdv.contact}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500">${App.formatDate(rdv.date)}</p>
          <p class="text-sm text-gray-500">${rdv.heureDebut} - ${rdv.heureFin}</p>
        </div>
      </div>
    `).join('');
  },

  /**
   * Charger l'activité récente
   */
  async loadRecentActivity() {
    const container = document.getElementById('recent-activity');
    
    // Récupérer toutes les données avec dates
    const courriers = (await Storage.getData(this.COURRIERS_KEY)).map(c => ({
      type: 'courrier',
      action: c.createdAt === c.updatedAt ? 'Créé' : 'Modifié',
      title: `Courrier: ${c.objet}`,
      date: c.updatedAt || c.createdAt
    }));

    const rendezvous = (await Storage.getData(this.RENDEZVOUS_KEY)).map(r => ({
      type: 'rendezvous',
      action: 'Créé',
      title: `Rendez-vous: ${r.titre}`,
      date: r.createdAt
    }));

    const contacts = (await Storage.getData('myassist_contacts')).map(c => ({
      type: 'contact',
      action: 'Créé',
      title: `Contact: ${c.prenom} ${c.nom}`,
      date: c.createdAt
    }));

    const documents = (await Storage.getData(this.DOCUMENTS_KEY)).map(d => ({
      type: 'document',
      action: 'Créé',
      title: `Document: ${d.titre}`,
      date: d.createdAt
    }));

    const allActivities = [...courriers, ...rendezvous, ...contacts, ...documents]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    if (allActivities.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">Aucune activité récente</p>';
      return;
    }

    container.innerHTML = allActivities.map(activity => `
      <div class="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-800">${activity.title}</p>
          <p class="text-xs text-gray-500">${activity.action} - ${App.formatDateTime(activity.date)}</p>
        </div>
      </div>
    `).join('');
  }
};
