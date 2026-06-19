/**
 * Module global de l'application
 * Fonctions UI communes à toutes les pages
 */

const App = {
  /**
   * Initialiser l'application
   */
  init() {
    this.initSidebar();
    this.initMobileMenu();
    this.displayUserName();
    this.initLogout();
  },

  /**
   * Initialiser la sidebar - lien actif
   */
  initSidebar() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('bg-primary-600', 'text-white');
        link.classList.remove('text-gray-300', 'hover:bg-gray-700');
      } else {
        link.classList.remove('bg-primary-600', 'text-white');
        link.classList.add('text-gray-300', 'hover:bg-gray-700');
      }
    });
  },

  /**
   * Initialiser le menu mobile
   */
  initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  },

  /**
   * Afficher le nom de l'utilisateur connecté
   */
  displayUserName() {
    const user = Auth.getCurrentUser();
    const userNameElements = document.querySelectorAll('.user-name');
    
    userNameElements.forEach(element => {
      if (user) {
        element.textContent = user.nom;
      }
    });
  },

  /**
   * Initialiser le bouton de déconnexion
   */
  initLogout() {
    const logoutButtons = document.querySelectorAll('.logout-button');
    
    logoutButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
      });
    });
  },

  /**
   * Afficher une notification toast
   * @param {string} message - Message à afficher
   * @param {string} type - Type de notification (success, error, warning, info)
   */
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };
    
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  /**
   * Formater une date
   * @param {string} dateString - Date au format ISO
   * @returns {string} Date formatée
   */
  formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  },

  /**
   * Formater une date et heure
   * @param {string} dateString - Date au format ISO
   * @returns {string} Date et heure formatées
   */
  formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Créer un badge de statut
   * @param {string} status - Statut
   * @returns {string} HTML du badge
   */
  getStatusBadge(status) {
    const badges = {
      'reçu': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Reçu</span>',
      'en cours': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">En cours</span>',
      'traité': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Traité</span>',
      'archivé': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Archivé</span>',
      'prévu': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Prévu</span>',
      'confirmé': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Confirmé</span>',
      'annulé': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Annulé</span>',
      'terminé': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Terminé</span>',
      'actif': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Actif</span>',
      'désactivé': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Désactivé</span>',
      'corbeille': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Corbeille</span>',
      'basse': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Basse</span>',
      'normale': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Normale</span>',
      'haute': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">Haute</span>',
      'urgente': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Urgente</span>',
      'entrant': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">Entrant</span>',
      'sortant': '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Sortant</span>'
    };
    
    return badges[status.toLowerCase()] || `<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">${status}</span>`;
  },

  /**
   * Ouvrir une modal
   * @param {string} modalId - ID de la modal
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
    }
  },

  /**
   * Fermer une modal
   * @param {string} modalId - ID de la modal
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
    }
  },

  /**
   * Afficher une modal de confirmation
   * @param {string} message - Message de confirmation
   * @param {Function} onConfirm - Callback si confirmé
   * @param {string} title - Titre de la modal (optionnel)
   */
  showConfirmModal(message, onConfirm, title = 'Confirmation') {
    // Créer la modal si elle n'existe pas
    let modal = document.getElementById('confirm-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'confirm-modal';
      modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
      modal.innerHTML = `
        <div class="bg-white rounded-[26px] shadow-dark w-full max-w-md">
          <div class="p-6">
            <h3 id="confirm-modal-title" class="text-xl font-bold text-[#1A1A2E] mb-4">Confirmation</h3>
            <p id="confirm-modal-message" class="text-[#3D3D5C] mb-6"></p>
            <div class="flex justify-end space-x-4">
              <button id="confirm-modal-cancel" class="px-6 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-[#F5F5FA] transition-colors">
                Annuler
              </button>
              <button id="confirm-modal-confirm" class="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 focus:ring-4 focus:ring-red-200 transition-colors">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Gérer les boutons
      document.getElementById('confirm-modal-cancel').addEventListener('click', () => {
        modal.classList.add('hidden');
      });

      document.getElementById('confirm-modal-confirm').addEventListener('click', () => {
        modal.classList.add('hidden');
        if (this._confirmCallback) {
          this._confirmCallback();
          this._confirmCallback = null;
        }
      });
    }

    // Configurer la modal
    document.getElementById('confirm-modal-title').textContent = title;
    document.getElementById('confirm-modal-message').textContent = message;
    this._confirmCallback = onConfirm;

    // Afficher la modal
    modal.classList.remove('hidden');
  },

  /**
   * Créer des données de démonstration
   * @param {boolean} force - Force la création même si des données existent
   */
  async createDemoData(force = false) {
    // Vérifier si les données existent déjà
    const existingCourriers = await Storage.getData('myassist_courriers');
    const existingRendezvous = await Storage.getData('myassist_rendezvous');
    const existingContacts = await Storage.getData('myassist_contacts');
    const existingDocuments = await Storage.getData('myassist_documents');
    const existingUsers = await Storage.getData('myassist_users');

    // Si pas forcé et qu'il y a déjà des données, ne pas écraser
    if (!force && (existingCourriers.length > 0 || existingRendezvous.length > 0 || 
                   existingContacts.length > 0 || existingDocuments.length > 0 || existingUsers.length > 0)) {
      console.log('Données de démonstration déjà existantes');
      return;
    }

    // Courriers de démonstration
    const courriers = [
      {
        id: Storage.generateId(),
        reference: 'COUR-2026-0001',
        type: 'entrant',
        objet: 'Demande de rendez-vous client',
        expediteur: 'Jean Dupont',
        destinataire: 'Direction',
        service: 'Commercial',
        date: '2026-01-15',
        priorite: 'haute',
        statut: 'en cours',
        observations: 'Client important',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        reference: 'COUR-2026-0002',
        type: 'sortant',
        objet: 'Confirmation de commande',
        expediteur: 'Direction',
        destinataire: 'Fournisseur ABC',
        service: 'Achats',
        date: '2026-01-16',
        priorite: 'normale',
        statut: 'traité',
        observations: '',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        reference: 'COUR-2026-0003',
        type: 'entrant',
        objet: 'Facture n°2026-001',
        expediteur: 'Fournisseur XYZ',
        destinataire: 'Comptabilité',
        service: 'Finance',
        date: '2026-01-17',
        priorite: 'urgente',
        statut: 'reçu',
        observations: 'Échéance 30 jours',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        reference: 'COUR-2026-0004',
        type: 'sortant',
        objet: 'Devis projet Alpha',
        expediteur: 'Direction',
        destinataire: 'Client Beta',
        service: 'Commercial',
        date: '2026-01-18',
        priorite: 'haute',
        statut: 'en cours',
        observations: 'En attente de validation',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        reference: 'COUR-2026-0005',
        type: 'entrant',
        objet: 'Plainte client',
        expediteur: 'Marie Martin',
        destinataire: 'Service Client',
        service: 'Support',
        date: '2026-01-19',
        priorite: 'haute',
        statut: 'en cours',
        observations: 'À traiter en priorité',
        createdAt: new Date().toISOString()
      }
    ];
    
    await Storage.saveData('myassist_courriers', courriers);

    // Rendez-vous de démonstration
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const rendezvous = [
      {
        id: Storage.generateId(),
        titre: 'Réunion équipe',
        contact: 'Équipe commerciale',
        date: today.toISOString().split('T')[0],
        heureDebut: '10:00',
        heureFin: '11:00',
        lieu: 'Salle de réunion A',
        motif: 'Point hebdomadaire',
        statut: 'confirmé',
        notes: '',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        titre: 'Présentation projet',
        contact: 'Client TechCorp',
        date: tomorrow.toISOString().split('T')[0],
        heureDebut: '14:00',
        heureFin: '15:30',
        lieu: 'Bureau client',
        motif: 'Présentation commerciale',
        statut: 'confirmé',
        notes: 'Préparer la présentation',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        titre: 'Entretien candidat',
        contact: 'Pierre Durand',
        date: nextWeek.toISOString().split('T')[0],
        heureDebut: '09:00',
        heureFin: '10:00',
        lieu: 'Salle de réunion B',
        motif: 'Recrutement',
        statut: 'prévu',
        notes: 'CV à vérifier',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        titre: 'Réunion partenaires',
        contact: 'Partenaires stratégiques',
        date: nextWeek.toISOString().split('T')[0],
        heureDebut: '16:00',
        heureFin: '17:30',
        lieu: 'Salle de conférence',
        motif: 'Partenariat',
        statut: 'prévu',
        notes: '',
        createdAt: new Date().toISOString()
      }
    ];
    
    await Storage.saveData('myassist_rendezvous', rendezvous);

    // Contacts de démonstration
    const contacts = [
      {
        id: Storage.generateId(),
        nom: 'Dupont',
        prenom: 'Jean',
        organisation: 'Client XYZ',
        fonction: 'Directeur',
        telephone: '0123456789',
        email: 'jean.dupont@example.com',
        adresse: '123 Rue de Paris',
        typeContact: 'client',
        notes: 'Client fidèle depuis 2020'
      },
      {
        id: Storage.generateId(),
        nom: 'Martin',
        prenom: 'Marie',
        organisation: 'TechCorp',
        fonction: 'Responsable Achats',
        telephone: '0987654321',
        email: 'marie.martin@techcorp.com',
        adresse: '456 Avenue de Lyon',
        typeContact: 'fournisseur',
        notes: ''
      },
      {
        id: Storage.generateId(),
        nom: 'Durand',
        prenom: 'Pierre',
        organisation: '',
        fonction: 'Candidat',
        telephone: '0612345678',
        email: 'pierre.durand@gmail.com',
        adresse: '789 Boulevard Marseille',
        typeContact: 'autre',
        notes: 'Candidature poste développeur'
      },
      {
        id: Storage.generateId(),
        nom: 'Bernard',
        prenom: 'Sophie',
        organisation: 'Partenaire Stratégique',
        fonction: 'Directrice',
        telephone: '0712345678',
        email: 'sophie.bernard@partner.com',
        adresse: '321 Rue de Bordeaux',
        typeContact: 'partenaire',
        notes: 'Accord cadre en cours'
      },
      {
        id: Storage.generateId(),
        nom: 'Lefebvre',
        prenom: 'Lucas',
        organisation: 'Fournisseur ABC',
        fonction: 'Commercial',
        telephone: '0623456789',
        email: 'lucas.lefebvre@fournisseur.com',
        adresse: '654 Rue de Nantes',
        typeContact: 'fournisseur',
        notes: ''
      }
    ];
    
    await Storage.saveData('myassist_contacts', contacts);

    // Documents de démonstration
    const documents = [
      {
        id: Storage.generateId(),
        titre: 'Contrat type',
        categorie: 'Juridique',
        description: 'Modèle de contrat client',
        nomFichier: 'contrat_type.pdf',
        typeFichier: 'pdf',
        statut: 'actif',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        titre: 'Devis standard',
        categorie: 'Commercial',
        description: 'Modèle de devis pour les clients',
        nomFichier: 'devis_standard.docx',
        typeFichier: 'docx',
        statut: 'actif',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        titre: 'Procédure interne',
        categorie: 'Administratif',
        description: 'Procédures internes de l\'entreprise',
        nomFichier: 'procedure_interne.pdf',
        typeFichier: 'pdf',
        statut: 'actif',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        titre: 'Présentation société',
        categorie: 'Marketing',
        description: 'Présentation PowerPoint de l\'entreprise',
        nomFichier: 'presentation.pptx',
        typeFichier: 'pptx',
        statut: 'actif',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        titre: 'Fiche client type',
        categorie: 'Commercial',
        description: 'Modèle de fiche client',
        nomFichier: 'fiche_client.xlsx',
        typeFichier: 'xlsx',
        statut: 'actif',
        createdAt: new Date().toISOString()
      }
    ];
    
    await Storage.saveData('myassist_documents', documents);

    // Utilisateurs de démonstration
    const users = [
      {
        id: Storage.generateId(),
        nom: 'Admin',
        email: 'admin@myassist.local',
        password: 'Admin123!',
        role: 'admin',
        statut: 'actif',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        nom: 'Assistante',
        email: 'assistante@myassist.local',
        password: 'Assist123!',
        role: 'assistante',
        statut: 'actif',
        createdAt: new Date().toISOString()
      },
      {
        id: Storage.generateId(),
        nom: 'Directeur',
        email: 'directeur@myassist.local',
        password: 'Direct123!',
        role: 'directeur',
        statut: 'actif',
        createdAt: new Date().toISOString()
      }
    ];
    
    await Storage.saveData('myassist_users', users);

    this.showToast('Données de démonstration créées avec succès', 'success');
  }
};
