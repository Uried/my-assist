/**
 * Module de gestion des documents
 * CRUD operations pour les documents
 */

const Documents = {
  KEY: 'myassist_documents',

  /**
   * Initialiser le module
   */
  async init() {
    await this.ensureDemoData();
    await this.loadDocuments();
    this.initFilters();
    this.initForm();
  },

  /**
   * S'assurer que les données de démonstration existent
   */
  async ensureDemoData() {
    const documents = await Storage.getData(this.KEY);
    if (documents.length === 0) {
      console.log('Création des données de démonstration pour documents...');
      App.createDemoData(true);
    }
  },

  /**
   * Charger et afficher les documents
   */
  async loadDocuments() {
    const documents = await Storage.getData(this.KEY);
    this.renderTable(documents);
  },

  /**
   * Afficher les documents dans le tableau
   * @param {Array} documents - Liste des documents
   */
  renderTable(documents) {
    const tbody = document.getElementById('documents-table-body');
    
    if (documents.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-8 text-center text-gray-500">
            Aucun document trouvé
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = documents.map(doc => `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4">
          <div class="text-sm font-medium text-gray-900">${doc.titre}</div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${doc.categorie || '-'}</div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${doc.nomFichier || '-'}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">${doc.typeFichier || '-'}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${App.getStatusBadge(doc.statut)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex space-x-2">
            <button onclick="Documents.edit('${doc.id}')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Modifier">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button onclick="Documents.delete('${doc.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">
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
    const filterCategorie = document.getElementById('filter-categorie');
    const filterStatut = document.getElementById('filter-statut');

    const filterDocuments = async () => {
      let documents = await Storage.getData(this.KEY);
      
      const searchTerm = searchInput.value.toLowerCase();
      const categorie = filterCategorie.value;
      const statut = filterStatut.value;

      documents = documents.filter(doc => {
        const matchSearch = !searchTerm || 
          (doc.titre && doc.titre.toLowerCase().includes(searchTerm)) ||
          (doc.description && doc.description.toLowerCase().includes(searchTerm)) ||
          (doc.nomFichier && doc.nomFichier.toLowerCase().includes(searchTerm));
        
        const matchCategorie = !categorie || doc.categorie === categorie;
        const matchStatut = !statut || doc.statut === statut;

        return matchSearch && matchCategorie && matchStatut;
      });

      this.renderTable(documents);
    };

    searchInput.addEventListener('input', filterDocuments);
    filterCategorie.addEventListener('change', filterDocuments);
    filterStatut.addEventListener('change', filterDocuments);
  },

  /**
   * Initialiser le formulaire
   */
  initForm() {
    const form = document.getElementById('document-form');
    const fileInput = document.getElementById('document-fichier');
    
    // Gérer la sélection de fichier
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // Remplir automatiquement le nom du fichier
        document.getElementById('document-nomFichier').value = file.name;
        
        // Détecter automatiquement le type de fichier
        const extension = file.name.split('.').pop().toLowerCase();
        const typeSelect = document.getElementById('document-typeFichier');
        
        // Mapper l'extension au type
        const typeMap = {
          'pdf': 'pdf',
          'doc': 'doc',
          'docx': 'docx',
          'xls': 'xls',
          'xlsx': 'xlsx',
          'ppt': 'ppt',
          'pptx': 'pptx',
          'jpg': 'jpg',
          'jpeg': 'jpeg',
          'png': 'png',
          'gif': 'gif'
        };
        
        if (typeMap[extension]) {
          typeSelect.value = typeMap[extension];
        } else {
          typeSelect.value = 'autre';
        }
      }
    });
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveDocument();
    });
  },

  /**
   * Ouvrir la modal
   */
  openModal() {
    document.getElementById('modal-title').textContent = 'Nouveau document';
    document.getElementById('document-form').reset();
    document.getElementById('document-id').value = '';
    App.openModal('document-modal');
  },

  /**
   * Fermer la modal
   */
  closeModal() {
    App.closeModal('document-modal');
  },

  /**
   * Modifier un document
   * @param {string} id - ID du document
   */
  async edit(id) {
    const documents = await Storage.getData(this.KEY);
    const doc = documents.find(d => d.id === id);
    
    if (doc) {
      document.getElementById('modal-title').textContent = 'Modifier le document';
      document.getElementById('document-id').value = doc.id;
      document.getElementById('document-titre').value = doc.titre;
      document.getElementById('document-categorie').value = doc.categorie;
      document.getElementById('document-description').value = doc.description || '';
      document.getElementById('document-nomFichier').value = doc.nomFichier || '';
      document.getElementById('document-typeFichier').value = doc.typeFichier || '';
      document.getElementById('document-statut').value = doc.statut;
      
      App.openModal('document-modal');
    }
  },

  /**
   * Sauvegarder un document
   */
  async saveDocument() {
    const id = document.getElementById('document-id').value;
    const doc = {
      titre: document.getElementById('document-titre').value,
      categorie: document.getElementById('document-categorie').value,
      description: document.getElementById('document-description').value,
      nomFichier: document.getElementById('document-nomFichier').value,
      typeFichier: document.getElementById('document-typeFichier').value,
      statut: document.getElementById('document-statut').value
    };

    if (id) {
      await Storage.updateItem(this.KEY, id, doc);
      App.showToast('Document modifié avec succès', 'success');
    } else {
      await Storage.addItem(this.KEY, doc);
      App.showToast('Document créé avec succès', 'success');
    }

    this.closeModal();
    await this.loadDocuments();
  },

  /**
   * Supprimer un document
   * @param {string} id - ID du document
   */
  async delete(id) {
    App.showConfirmModal('Êtes-vous sûr de vouloir supprimer ce document ?', async () => {
      await Storage.deleteItem(this.KEY, id);
      App.showToast('Document supprimé avec succès', 'success');
      await this.loadDocuments();
    });
  }
};
