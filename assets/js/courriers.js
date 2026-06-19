/**
 * Module de gestion des courriers
 * CRUD operations pour les courriers
 */

const Courriers = {
  KEY: 'myassist_courriers',

  /**
   * Initialiser le module
   */
  async init() {
    await this.ensureDemoData();
    await this.loadCourriers();
    this.initFilters();
    this.initForm();
  },

  /**
   * S'assurer que les données de démonstration existent
   */
  async ensureDemoData() {
    const courriers = await Storage.getData(this.KEY);
    if (courriers.length === 0) {
      console.log('Création des données de démonstration pour courriers...');
      await App.createDemoData(true);
    }
  },

  /**
   * Charger et afficher les courriers
   */
  async loadCourriers() {
    const courriers = await Storage.getData(this.KEY);
    this.renderTable(courriers);
  },

  /**
   * Afficher les courriers dans le tableau
   * @param {Array} courriers - Liste des courriers
   */
  renderTable(courriers) {
    const tbody = document.getElementById('courriers-table-body');
    
    if (courriers.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="px-6 py-8 text-center text-gray-500">
            Aucun courrier trouvé
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = courriers.map(courrier => `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="font-medium text-gray-900">${courrier.reference || '-'}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${App.getStatusBadge(courrier.type)}
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${courrier.objet}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${courrier.expediteur}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${courrier.destinataire}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${App.formatDate(courrier.date)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${App.getStatusBadge(courrier.priorite)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${App.getStatusBadge(courrier.statut)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex space-x-2">
            <button onclick="Courriers.edit('${courrier.id}')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Modifier">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button onclick="Courriers.delete('${courrier.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Initialiser les filtres
   */
  initFilters() {
    const searchInput = document.getElementById('search-input');
    const filterType = document.getElementById('filter-type');
    const filterPriorite = document.getElementById('filter-priorite');
    const filterStatut = document.getElementById('filter-statut');

    const filterCourriers = async () => {
      let courriers = await Storage.getData(this.KEY);
      
      const searchTerm = searchInput.value.toLowerCase();
      const type = filterType.value;
      const priorite = filterPriorite.value;
      const statut = filterStatut.value;

      courriers = courriers.filter(courrier => {
        const matchSearch = !searchTerm || 
          (courrier.reference && courrier.reference.toLowerCase().includes(searchTerm)) ||
          (courrier.objet && courrier.objet.toLowerCase().includes(searchTerm)) ||
          (courrier.expediteur && courrier.expediteur.toLowerCase().includes(searchTerm)) ||
          (courrier.destinataire && courrier.destinataire.toLowerCase().includes(searchTerm));
        
        const matchType = !type || courrier.type === type;
        const matchPriorite = !priorite || courrier.priorite === priorite;
        const matchStatut = !statut || courrier.statut === statut;

        return matchSearch && matchType && matchPriorite && matchStatut;
      });

      this.renderTable(courriers);
    };

    searchInput.addEventListener('input', filterCourriers);
    filterType.addEventListener('change', filterCourriers);
    filterPriorite.addEventListener('change', filterCourriers);
    filterStatut.addEventListener('change', filterCourriers);
  },

  /**
   * Initialiser le formulaire
   */
  initForm() {
    const form = document.getElementById('courrier-form');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveCourrier();
    });
  },

  /**
   * Ouvrir la modal
   */
  openModal() {
    document.getElementById('modal-title').textContent = 'Nouveau courrier';
    document.getElementById('courrier-form').reset();
    document.getElementById('courrier-id').value = '';
    document.getElementById('courrier-date').value = new Date().toISOString().split('T')[0];
    App.openModal('courrier-modal');
  },

  /**
   * Fermer la modal
   */
  closeModal() {
    App.closeModal('courrier-modal');
  },

  /**
   * Modifier un courrier
   * @param {string} id - ID du courrier
   */
  async edit(id) {
    const courriers = await Storage.getData(this.KEY);
    const courrier = courriers.find(c => c.id === id);
    
    if (courrier) {
      document.getElementById('modal-title').textContent = 'Modifier le courrier';
      document.getElementById('courrier-id').value = courrier.id;
      document.getElementById('courrier-type').value = courrier.type;
      document.getElementById('courrier-date').value = courrier.date;
      document.getElementById('courrier-objet').value = courrier.objet;
      document.getElementById('courrier-expediteur').value = courrier.expediteur;
      document.getElementById('courrier-destinataire').value = courrier.destinataire;
      document.getElementById('courrier-service').value = courrier.service || '';
      document.getElementById('courrier-priorite').value = courrier.priorite;
      document.getElementById('courrier-statut').value = courrier.statut;
      document.getElementById('courrier-observations').value = courrier.observations || '';
      
      App.openModal('courrier-modal');
    }
  },

  /**
   * Sauvegarder un courrier
   */
  async saveCourrier() {
    const id = document.getElementById('courrier-id').value;
    const courrier = {
      type: document.getElementById('courrier-type').value,
      date: document.getElementById('courrier-date').value,
      objet: document.getElementById('courrier-objet').value,
      expediteur: document.getElementById('courrier-expediteur').value,
      destinataire: document.getElementById('courrier-destinataire').value,
      service: document.getElementById('courrier-service').value,
      priorite: document.getElementById('courrier-priorite').value,
      statut: document.getElementById('courrier-statut').value,
      observations: document.getElementById('courrier-observations').value
    };

    if (id) {
      // Modification
      await Storage.updateItem(this.KEY, id, courrier);
      App.showToast('Courrier modifié avec succès', 'success');
    } else {
      // Création
      courrier.reference = await Storage.generateReference('COUR', this.KEY);
      await Storage.addItem(this.KEY, courrier);
      App.showToast('Courrier créé avec succès', 'success');
    }

    this.closeModal();
    await this.loadCourriers();
  },

  /**
   * Supprimer un courrier
   * @param {string} id - ID du courrier
   */
  async delete(id) {
    App.showConfirmModal('Êtes-vous sûr de vouloir supprimer ce courrier ?', async () => {
      await Storage.deleteItem(this.KEY, id);
      App.showToast('Courrier supprimé avec succès', 'success');
      await this.loadCourriers();
    });
  }
};
