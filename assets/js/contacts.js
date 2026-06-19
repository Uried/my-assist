/**
 * Module de gestion des contacts
 * CRUD operations pour les contacts
 */

const Contacts = {
  KEY: 'myassist_contacts',

  /**
   * Initialiser le module
   */
  async init() {
    await this.ensureDemoData();
    await this.loadContacts();
    this.initFilters();
    this.initForm();
  },

  /**
   * S'assurer que les données de démonstration existent
   */
  async ensureDemoData() {
    const contacts = await Storage.getData(this.KEY);
    if (contacts.length === 0) {
      console.log('Création des données de démonstration pour contacts...');
      App.createDemoData(true);
    }
  },

  /**
   * Charger et afficher les contacts
   */
  async loadContacts() {
    const contacts = await Storage.getData(this.KEY);
    this.renderTable(contacts);
  },

  /**
   * Afficher les contacts dans le tableau
   * @param {Array} contacts - Liste des contacts
   */
  renderTable(contacts) {
    const tbody = document.getElementById('contacts-table-body');
    
    if (contacts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-8 text-center text-gray-500">
            Aucun contact trouvé
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = contacts.map(contact => `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4">
          <div class="text-sm font-medium text-gray-900">${contact.prenom} ${contact.nom}</div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${contact.organisation || '-'}</div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${contact.fonction || '-'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${contact.telephone || '-'}</div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${contact.email || '-'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">${contact.typeContact || '-'}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex space-x-2">
            <button onclick="Contacts.edit('${contact.id}')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Modifier">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button onclick="Contacts.delete('${contact.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">
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

    const filterContacts = async () => {
      let contacts = await Storage.getData(this.KEY);
      
      const searchTerm = searchInput.value.toLowerCase();
      const type = filterType.value;

      contacts = contacts.filter(contact => {
        const matchSearch = !searchTerm || 
          (contact.nom && contact.nom.toLowerCase().includes(searchTerm)) ||
          (contact.prenom && contact.prenom.toLowerCase().includes(searchTerm)) ||
          (contact.organisation && contact.organisation.toLowerCase().includes(searchTerm)) ||
          (contact.email && contact.email.toLowerCase().includes(searchTerm));
        
        const matchType = !type || contact.typeContact === type;

        return matchSearch && matchType;
      });

      this.renderTable(contacts);
    };

    searchInput.addEventListener('input', filterContacts);
    filterType.addEventListener('change', filterContacts);
  },

  /**
   * Initialiser le formulaire
   */
  initForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveContact();
    });
  },

  /**
   * Ouvrir la modal
   */
  openModal() {
    document.getElementById('modal-title').textContent = 'Nouveau contact';
    document.getElementById('contact-form').reset();
    document.getElementById('contact-id').value = '';
    App.openModal('contact-modal');
  },

  /**
   * Fermer la modal
   */
  closeModal() {
    App.closeModal('contact-modal');
  },

  /**
   * Modifier un contact
   * @param {string} id - ID du contact
   */
  async edit(id) {
    const contacts = await Storage.getData(this.KEY);
    const contact = contacts.find(c => c.id === id);
    
    if (contact) {
      document.getElementById('modal-title').textContent = 'Modifier le contact';
      document.getElementById('contact-id').value = contact.id;
      document.getElementById('contact-nom').value = contact.nom;
      document.getElementById('contact-prenom').value = contact.prenom;
      document.getElementById('contact-organisation').value = contact.organisation || '';
      document.getElementById('contact-fonction').value = contact.fonction || '';
      document.getElementById('contact-telephone').value = contact.telephone || '';
      document.getElementById('contact-email').value = contact.email || '';
      document.getElementById('contact-adresse').value = contact.adresse || '';
      document.getElementById('contact-typeContact').value = contact.typeContact;
      document.getElementById('contact-notes').value = contact.notes || '';
      
      App.openModal('contact-modal');
    }
  },

  /**
   * Sauvegarder un contact
   */
  async saveContact() {
    const id = document.getElementById('contact-id').value;
    const contact = {
      nom: document.getElementById('contact-nom').value,
      prenom: document.getElementById('contact-prenom').value,
      organisation: document.getElementById('contact-organisation').value,
      fonction: document.getElementById('contact-fonction').value,
      telephone: document.getElementById('contact-telephone').value,
      email: document.getElementById('contact-email').value,
      adresse: document.getElementById('contact-adresse').value,
      typeContact: document.getElementById('contact-typeContact').value,
      notes: document.getElementById('contact-notes').value
    };

    if (id) {
      await Storage.updateItem(this.KEY, id, contact);
      App.showToast('Contact modifié avec succès', 'success');
    } else {
      await Storage.addItem(this.KEY, contact);
      App.showToast('Contact créé avec succès', 'success');
    }

    this.closeModal();
    await this.loadContacts();
  },

  /**
   * Supprimer un contact
   * @param {string} id - ID du contact
   */
  async delete(id) {
    App.showConfirmModal('Êtes-vous sûr de vouloir supprimer ce contact ?', async () => {
      await Storage.deleteItem(this.KEY, id);
      App.showToast('Contact supprimé avec succès', 'success');
      await this.loadContacts();
    });
  }
};
