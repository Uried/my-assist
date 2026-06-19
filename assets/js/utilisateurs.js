/**
 * Module de gestion des utilisateurs
 * CRUD operations pour les utilisateurs
 */

const Users = {
  KEY: 'myassist_users',

  /**
   * Initialiser le module
   */
  async init() {
    await this.ensureDemoData();
    await this.loadUsers();
    this.initForm();
  },

  /**
   * S'assurer que les données de démonstration existent
   */
  async ensureDemoData() {
    const users = await Storage.getData(this.KEY);
    if (users.length === 0) {
      console.log('Création des données de démonstration pour utilisateurs...');
      App.createDemoData(true);
    }
  },

  /**
   * Charger et afficher les utilisateurs
   */
  async loadUsers() {
    const users = await Storage.getData(this.KEY);
    this.renderTable(users);
  },

  /**
   * Afficher les utilisateurs dans le tableau
   * @param {Array} users - Liste des utilisateurs
   */
  renderTable(users) {
    const tbody = document.getElementById('users-table-body');
    
    if (users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-8 text-center text-gray-500">
            Aucun utilisateur trouvé
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = users.map(user => `
      <tr class="hover:bg-gray-50">
        <td class="px-6 py-4">
          <div class="text-sm font-medium text-gray-900">${user.nom}</div>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-900">${user.email}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}">${user.role}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          ${App.getStatusBadge(user.statut)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm text-gray-900">${App.formatDate(user.createdAt)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex space-x-2">
            <button onclick="Users.edit('${user.id}')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Modifier">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button onclick="Users.toggleStatus('${user.id}')" class="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg" title="${user.statut === 'actif' ? 'Désactiver' : 'Activer'}">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
              </svg>
            </button>
            <button onclick="Users.delete('${user.id}')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">
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
   * Initialiser le formulaire
   */
  initForm() {
    const form = document.getElementById('user-form');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveUser();
    });
  },

  /**
   * Ouvrir la modal
   */
  openModal() {
    document.getElementById('modal-title').textContent = 'Nouvel utilisateur';
    document.getElementById('user-form').reset();
    document.getElementById('user-id').value = '';
    document.getElementById('user-password').required = true;
    App.openModal('user-modal');
  },

  /**
   * Fermer la modal
   */
  closeModal() {
    App.closeModal('user-modal');
  },

  /**
   * Modifier un utilisateur
   * @param {string} id - ID de l'utilisateur
   */
  async edit(id) {
    const users = await Storage.getData(this.KEY);
    const user = users.find(u => u.id === id);
    
    if (user) {
      document.getElementById('modal-title').textContent = 'Modifier l\'utilisateur';
      document.getElementById('user-id').value = user.id;
      document.getElementById('user-nom').value = user.nom;
      document.getElementById('user-email').value = user.email;
      document.getElementById('user-password').value = '';
      document.getElementById('user-password').required = false;
      document.getElementById('user-role').value = user.role;
      document.getElementById('user-statut').value = user.statut;
      
      App.openModal('user-modal');
    }
  },

  /**
   * Sauvegarder un utilisateur
   */
  async saveUser() {
    const id = document.getElementById('user-id').value;
    const user = {
      nom: document.getElementById('user-nom').value,
      email: document.getElementById('user-email').value,
      role: document.getElementById('user-role').value,
      statut: document.getElementById('user-statut').value
    };

    const password = document.getElementById('user-password').value;
    if (password) {
      user.password = password;
    }

    if (id) {
      // Modification - ne pas écraser le mot de passe si non fourni
      const existingUsers = await Storage.getData(this.KEY);
      const existingUser = existingUsers.find(u => u.id === id);
      if (existingUser && !password) {
        user.password = existingUser.password;
      }
      await Storage.updateItem(this.KEY, id, user);
      App.showToast('Utilisateur modifié avec succès', 'success');
    } else {
      // Création - mot de passe requis
      if (!password) {
        App.showToast('Le mot de passe est requis pour un nouvel utilisateur', 'error');
        return;
      }
      await Storage.addItem(this.KEY, user);
      App.showToast('Utilisateur créé avec succès', 'success');
    }

    this.closeModal();
    await this.loadUsers();
  },

  /**
   * Basculer le statut d'un utilisateur
   * @param {string} id - ID de l'utilisateur
   */
  async toggleStatus(id) {
    const users = await Storage.getData(this.KEY);
    const user = users.find(u => u.id === id);
    
    if (user) {
      const newStatus = user.statut === 'actif' ? 'désactivé' : 'actif';
      await Storage.updateItem(this.KEY, id, { statut: newStatus });
      App.showToast(`Utilisateur ${newStatus === 'actif' ? 'activé' : 'désactivé'} avec succès`, 'success');
      await this.loadUsers();
    }
  },

  /**
   * Supprimer un utilisateur
   * @param {string} id - ID de l'utilisateur
   */
  async delete(id) {
    const currentUser = Auth.getCurrentUser();
    
    // Empêcher la suppression de l'utilisateur connecté
    if (currentUser && currentUser.id === id) {
      App.showToast('Vous ne pouvez pas supprimer votre propre compte', 'error');
      return;
    }

    App.showConfirmModal('Êtes-vous sûr de vouloir supprimer cet utilisateur ?', async () => {
      await Storage.deleteItem(this.KEY, id);
      App.showToast('Utilisateur supprimé avec succès', 'success');
      await this.loadUsers();
    });
  }
};
