/**
 * Module de gestion des rapports et statistiques
 */

const Rapports = {
  COURRIERS_KEY: 'myassist_courriers',
  RENDEZVOUS_KEY: 'myassist_rendezvous',
  CONTACTS_KEY: 'myassist_contacts',
  DOCUMENTS_KEY: 'myassist_documents',

  charts: {}, // Stocker les instances de graphiques

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

    // Graphiques
    this.renderCourriersChart(courriers);
    this.renderRendezvousChart(rendezvous);
    this.renderContactsChart(contacts);
    this.renderDocumentsChart(documents);
  },

  /**
   * Afficher le graphique des courriers par statut
   * @param {Array} courriers - Liste des courriers
   */
  renderCourriersChart(courriers) {
    const ctx = document.getElementById('courriers-chart');
    if (!ctx) return;

    // Détruire le graphique existant s'il y en a un
    if (this.charts.courriers) {
      this.charts.courriers.destroy();
    }

    const stats = {
      'reçu': courriers.filter(c => c.statut === 'reçu').length,
      'en cours': courriers.filter(c => c.statut === 'en cours').length,
      'traité': courriers.filter(c => c.statut === 'traité').length,
      'archivé': courriers.filter(c => c.statut === 'archivé').length
    };

    this.charts.courriers = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(stats),
        datasets: [{
          data: Object.values(stats),
          backgroundColor: [
            '#7C6FF7',
            '#F59E0B',
            '#10B981',
            '#6B7280'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  },

  /**
   * Afficher le graphique des rendez-vous par statut
   * @param {Array} rendezvous - Liste des rendez-vous
   */
  renderRendezvousChart(rendezvous) {
    const ctx = document.getElementById('rendezvous-chart');
    if (!ctx) return;

    // Détruire le graphique existant s'il y en a un
    if (this.charts.rendezvous) {
      this.charts.rendezvous.destroy();
    }

    const stats = {
      'prévu': rendezvous.filter(r => r.statut === 'prévu').length,
      'confirmé': rendezvous.filter(r => r.statut === 'confirmé').length,
      'annulé': rendezvous.filter(r => r.statut === 'annulé').length,
      'terminé': rendezvous.filter(r => r.statut === 'terminé').length
    };

    this.charts.rendezvous = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(stats),
        datasets: [{
          label: 'Nombre de rendez-vous',
          data: Object.values(stats),
          backgroundColor: [
            '#7C6FF7',
            '#10B981',
            '#EF4444',
            '#6B7280'
          ],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  },

  /**
   * Afficher le graphique des contacts par type
   * @param {Array} contacts - Liste des contacts
   */
  renderContactsChart(contacts) {
    const ctx = document.getElementById('contacts-chart');
    if (!ctx) return;

    // Détruire le graphique existant s'il y en a un
    if (this.charts.contacts) {
      this.charts.contacts.destroy();
    }

    const stats = {
      'client': contacts.filter(c => c.typeContact === 'client').length,
      'fournisseur': contacts.filter(c => c.typeContact === 'fournisseur').length,
      'partenaire': contacts.filter(c => c.typeContact === 'partenaire').length,
      'autre': contacts.filter(c => c.typeContact === 'autre').length
    };

    this.charts.contacts = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(stats),
        datasets: [{
          data: Object.values(stats),
          backgroundColor: [
            '#7C6FF7',
            '#F59E0B',
            '#10B981',
            '#6B7280'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  },

  /**
   * Afficher le graphique des documents par catégorie
   * @param {Array} documents - Liste des documents
   */
  renderDocumentsChart(documents) {
    const ctx = document.getElementById('documents-chart');
    if (!ctx) return;

    // Détruire le graphique existant s'il y en a un
    if (this.charts.documents) {
      this.charts.documents.destroy();
    }

    const stats = {
      'Juridique': documents.filter(d => d.categorie === 'Juridique').length,
      'Administratif': documents.filter(d => d.categorie === 'Administratif').length,
      'Commercial': documents.filter(d => d.categorie === 'Commercial').length,
      'Technique': documents.filter(d => d.categorie === 'Technique').length,
      'Autre': documents.filter(d => d.categorie === 'Autre').length
    };

    this.charts.documents = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(stats),
        datasets: [{
          label: 'Nombre de documents',
          data: Object.values(stats),
          backgroundColor: '#7C6FF7',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  },

  /**
   * Exporter les données en format Excel (CSV)
   */
  async exportToExcel() {
    try {
      const courriers = await Storage.getData(this.COURRIERS_KEY);
      const rendezvous = await Storage.getData(this.RENDEZVOUS_KEY);
      const contacts = await Storage.getData(this.CONTACTS_KEY);
      const documents = await Storage.getData(this.DOCUMENTS_KEY);

      // Créer le contenu CSV
      let csvContent = '\uFEFF'; // BOM pour l'encodage UTF-8
      
      // Section Courriers
      csvContent += '=== COURRIERS ===\n';
      csvContent += 'Référence,Type,Objet,Expéditeur,Destinataire,Service,Date,Priorité,Statut,Observations\n';
      courriers.forEach(c => {
        csvContent += `"${c.reference}","${c.type}","${c.objet}","${c.expediteur}","${c.destinataire}","${c.service}","${c.date}","${c.priorite}","${c.statut}","${c.observations}"\n`;
      });
      
      // Section Rendez-vous
      csvContent += '\n=== RENDEZ-VOUS ===\n';
      csvContent += 'Titre,Contact,Date,Heure Début,Heure Fin,Lieu,Motif,Statut,Notes\n';
      rendezvous.forEach(r => {
        csvContent += `"${r.titre}","${r.contact}","${r.date}","${r.heureDebut}","${r.heureFin}","${r.lieu}","${r.motif}","${r.statut}","${r.notes}"\n`;
      });
      
      // Section Contacts
      csvContent += '\n=== CONTACTS ===\n';
      csvContent += 'Nom,Prénom,Organisation,Fonction,Téléphone,Email,Adresse,Type Contact,Notes\n';
      contacts.forEach(c => {
        csvContent += `"${c.nom}","${c.prenom}","${c.organisation}","${c.fonction}","${c.telephone}","${c.email}","${c.adresse}","${c.typeContact}","${c.notes}"\n`;
      });
      
      // Section Documents
      csvContent += '\n=== DOCUMENTS ===\n';
      csvContent += 'Titre,Catégorie,Description,Nom Fichier,Type Fichier,Statut\n';
      documents.forEach(d => {
        csvContent += `"${d.titre}","${d.categorie}","${d.description}","${d.nomFichier}","${d.typeFichier}","${d.statut}"\n`;
      });

      // Créer le blob et télécharger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `myassist_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Afficher un message de succès
      alert('Export réussi ! Le fichier CSV a été téléchargé.');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Erreur lors de l\'export: ' + error.message);
    }
  }
};
