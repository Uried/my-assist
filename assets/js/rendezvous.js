/**
 * Module de gestion des rendez-vous
 * CRUD operations pour les rendez-vous
 */

const Rendezvous = {
  KEY: 'myassist_rendezvous',

  /**
   * Initialiser le module
   */
  async init() {
    await this.ensureDemoData();
    await this.loadRendezvous();
    this.initFilters();
    this.initForm();
  },

  /**
   * Charger les contacts dans le dropdown
   */
  async loadContactsDropdown() {
    const contacts = await Storage.getData('myassist_contacts');
    const select = document.getElementById('rendezvous-contact');
    
    // Garder l'option par défaut
    select.innerHTML = '<option value="">Sélectionner un contact</option>';
    
    // Ajouter les contacts
    contacts.forEach(contact => {
      const option = document.createElement('option');
      option.value = `${contact.prenom} ${contact.nom}`;
      option.textContent = `${contact.prenom} ${contact.nom} ${contact.organisation ? `(${contact.organisation})` : ''}`;
      select.appendChild(option);
    });
  },

  /**
   * S'assurer que les données de démonstration existent
   */
  async ensureDemoData() {
    const rendezvous = await Storage.getData(this.KEY);
    if (rendezvous.length === 0) {
      console.log('Création des données de démonstration pour rendez-vous...');
      App.createDemoData(true);
    }
  },

  /**
   * Charger et afficher les rendez-vous
   */
  async loadRendezvous() {
    const rendezvous = await Storage.getData(this.KEY);
    this.renderTable(rendezvous);
  },

  /**
   * Afficher les rendez-vous dans le tableau
   * @param {Array} rendezvous - Liste des rendez-vous
   */
  renderTable(rendezvous) {
    const tbody = document.getElementById('rendezvous-table-body');
    
    if (rendezvous.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-8 text-center text-gray-500">
            Aucun rendez-vous trouvé
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = rendezvous.map(rdv => `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4">
          <div class="text-sm font-medium text-gray-900">${rdv.titre}</div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${rdv.contact}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${App.formatDate(rdv.date)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${rdv.heureDebut} - ${rdv.heureFin}</div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${rdv.lieu || '-'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${App.getStatusBadge(rdv.statut)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex space-x-2">
            <button onclick="Rendezvous.edit('${rdv.id}')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Modifier">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button onclick="Rendezvous.delete('${rdv.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">
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
    const filterStatut = document.getElementById('filter-statut');
    const filterDate = document.getElementById('filter-date');

    const filterRendezvous = async () => {
      let rendezvous = await Storage.getData(this.KEY);
      
      const searchTerm = searchInput.value.toLowerCase();
      const statut = filterStatut.value;
      const date = filterDate.value;

      rendezvous = rendezvous.filter(rdv => {
        const matchSearch = !searchTerm || 
          (rdv.titre && rdv.titre.toLowerCase().includes(searchTerm)) ||
          (rdv.contact && rdv.contact.toLowerCase().includes(searchTerm));
        
        const matchStatut = !statut || rdv.statut === statut;
        const matchDate = !date || rdv.date === date;

        return matchSearch && matchStatut && matchDate;
      });

      this.renderTable(rendezvous);
    };

    searchInput.addEventListener('input', filterRendezvous);
    filterStatut.addEventListener('change', filterRendezvous);
    filterDate.addEventListener('change', filterRendezvous);
  },

  /**
   * Initialiser le formulaire
   */
  initForm() {
    const form = document.getElementById('rendezvous-form');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveRendezvous();
    });
  },

  /**
   * Ouvrir la modal
   */
  async openModal() {
    document.getElementById('modal-title').textContent = 'Nouveau rendez-vous';
    document.getElementById('rendezvous-form').reset();
    document.getElementById('rendezvous-id').value = '';
    document.getElementById('rendezvous-date').value = new Date().toISOString().split('T')[0];
    await this.loadContactsDropdown();
    App.openModal('rendezvous-modal');
  },

  /**
   * Fermer la modal
   */
  closeModal() {
    App.closeModal('rendezvous-modal');
  },

  /**
   * Modifier un rendez-vous
   * @param {string} id - ID du rendez-vous
   */
  async edit(id) {
    const rendezvous = await Storage.getData(this.KEY);
    const rdv = rendezvous.find(r => r.id === id);
    
    if (rdv) {
      document.getElementById('modal-title').textContent = 'Modifier le rendez-vous';
      document.getElementById('rendezvous-id').value = rdv.id;
      document.getElementById('rendezvous-titre').value = rdv.titre;
      await this.loadContactsDropdown();
      document.getElementById('rendezvous-contact').value = rdv.contact;
      document.getElementById('rendezvous-date').value = rdv.date;
      document.getElementById('rendezvous-statut').value = rdv.statut;
      document.getElementById('rendezvous-heureDebut').value = rdv.heureDebut;
      document.getElementById('rendezvous-heureFin').value = rdv.heureFin;
      document.getElementById('rendezvous-lieu').value = rdv.lieu || '';
      document.getElementById('rendezvous-motif').value = rdv.motif || '';
      document.getElementById('rendezvous-notes').value = rdv.notes || '';
      
      App.openModal('rendezvous-modal');
    }
  },

  /**
   * Sauvegarder un rendez-vous
   */
  async saveRendezvous() {
    const id = document.getElementById('rendezvous-id').value;
    const rdv = {
      titre: document.getElementById('rendezvous-titre').value,
      contact: document.getElementById('rendezvous-contact').value,
      date: document.getElementById('rendezvous-date').value,
      statut: document.getElementById('rendezvous-statut').value,
      heureDebut: document.getElementById('rendezvous-heureDebut').value,
      heureFin: document.getElementById('rendezvous-heureFin').value,
      lieu: document.getElementById('rendezvous-lieu').value,
      motif: document.getElementById('rendezvous-motif').value,
      notes: document.getElementById('rendezvous-notes').value
    };

    // Vérifier les chevauchements
    if (!(await this.checkOverlap(rdv, id))) {
      App.showToast('Ce créneau horaire est déjà occupé', 'error');
      return;
    }

    if (id) {
      await Storage.updateItem(this.KEY, id, rdv);
      App.showToast('Rendez-vous modifié avec succès', 'success');
    } else {
      await Storage.addItem(this.KEY, rdv);
      App.showToast('Rendez-vous créé avec succès', 'success');
    }

    this.closeModal();
    await this.loadRendezvous();
  },

  /**
   * Vérifier les chevauchements de rendez-vous
   * @param {Object} rdv - Rendez-vous à vérifier
   * @param {string} excludeId - ID à exclure de la vérification
   * @returns {Promise<boolean>} True si pas de chevauchement
   */
  async checkOverlap(rdv, excludeId) {
    const rendezvous = await Storage.getData(this.KEY);
    
    for (const existing of rendezvous) {
      if (excludeId && existing.id === excludeId) continue;
      if (existing.date !== rdv.date) continue;
      if (existing.statut === 'annulé') continue;

      const existingStart = existing.heureDebut;
      const existingEnd = existing.heureFin;
      const newStart = rdv.heureDebut;
      const newEnd = rdv.heureFin;

      if (newStart < existingEnd && newEnd > existingStart) {
        return false;
      }
    }
    
    return true;
  },

  /**
   * Supprimer un rendez-vous
   * @param {string} id - ID du rendez-vous
   */
  async delete(id) {
    App.showConfirmModal('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?', async () => {
      await Storage.deleteItem(this.KEY, id);
      App.showToast('Rendez-vous supprimé avec succès', 'success');
      await this.loadRendezvous();
    });
  }
};
