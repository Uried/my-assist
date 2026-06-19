/**
 * Module de gestion Airtable
 * Remplace le localStorage par une base de données Airtable
 */

const AirtableAPI = {
  // Configuration Airtable
  TOKEN: localStorage.getItem('AIRTABLE_TOKEN') || 'YOUR_AIRTABLE_TOKEN',
  BASE: localStorage.getItem('AIRTABLE_BASE') || 'YOUR_AIRTABLE_BASE',
  
  // Noms des tables (doivent correspondre exactement aux tables créées dans Airtable)
  TABLES: {
    COURRIERS: 'Courriers',
    RENDEZVOUS: 'Rendez-vous',
    CONTACTS: 'Contacts',
    DOCUMENTS: 'Documents',
    USERS: 'Utilisateurs'
  },

  /**
   * Effectuer une requête à l'API Airtable
   * @param {string} tableName - Nom de la table
   * @param {string} method - Méthode HTTP (GET, POST, PATCH, DELETE)
   * @param {string} recordId - ID de l'enregistrement (optionnel)
   * @param {object} data - Données à envoyer (optionnel)
   * @returns {Promise} Réponse de l'API
   */
  async request(tableName, method = 'GET', recordId = null, data = null) {
    const url = recordId 
      ? `https://api.airtable.com/v0/${this.BASE}/${tableName}/${recordId}`
      : `https://api.airtable.com/v0/${this.BASE}/${tableName}`;

    const options = {
      method: method,
      headers: {
        'Authorization': `Bearer ${this.TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = errorText;
        }
        throw new Error(`Airtable API Error ${response.status}: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Airtable request error:', error);
      throw error;
    }
  },

  /**
   * Récupérer tous les enregistrements d'une table
   * @param {string} tableName - Nom de la table
   * @returns {Promise<Array>} Liste des enregistrements
   */
  async getAll(tableName) {
    try {
      const response = await this.request(tableName, 'GET');
      return response.records.map(record => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error(`Error fetching ${tableName}:`, error);
      return [];
    }
  },

  /**
   * Récupérer un enregistrement par son ID
   * @param {string} tableName - Nom de la table
   * @param {string} recordId - ID de l'enregistrement
   * @returns {Promise<object>} Enregistrement
   */
  async getById(tableName, recordId) {
    try {
      const response = await this.request(tableName, 'GET', recordId);
      return {
        id: response.id,
        ...response.fields
      };
    } catch (error) {
      console.error(`Error fetching record ${recordId}:`, error);
      return null;
    }
  },

  /**
   * Créer un nouvel enregistrement
   * @param {string} tableName - Nom de la table
   * @param {object} fields - Champs de l'enregistrement
   * @returns {Promise<object>} Enregistrement créé
   */
  async create(tableName, fields) {
    try {
      const response = await this.request(tableName, 'POST', null, { fields });
      return {
        id: response.id,
        ...response.fields
      };
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error);
      throw error;
    }
  },

  /**
   * Mettre à jour un enregistrement
   * @param {string} tableName - Nom de la table
   * @param {string} recordId - ID de l'enregistrement
   * @param {object} fields - Champs à mettre à jour
   * @returns {Promise<object>} Enregistrement mis à jour
   */
  async update(tableName, recordId, fields) {
    try {
      const response = await this.request(tableName, 'PATCH', recordId, { fields });
      return {
        id: response.id,
        ...response.fields
      };
    } catch (error) {
      console.error(`Error updating record ${recordId}:`, error);
      throw error;
    }
  },

  /**
   * Supprimer un enregistrement
   * @param {string} tableName - Nom de la table
   * @param {string} recordId - ID de l'enregistrement
   * @returns {Promise<boolean>} Succès de la suppression
   */
  async delete(tableName, recordId) {
    try {
      await this.request(tableName, 'DELETE', recordId);
      return true;
    } catch (error) {
      console.error(`Error deleting record ${recordId}:`, error);
      return false;
    }
  },

  /**
   * Filtrer les enregistrements
   * @param {string} tableName - Nom de la table
   * @param {string} filterFormula - Formule de filtre Airtable
   * @returns {Promise<Array>} Enregistrements filtrés
   */
  async filter(tableName, filterFormula) {
    try {
      const url = `https://api.airtable.com/v0/${this.BASE}/${tableName}?filterByFormula=${encodeURIComponent(filterFormula)}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Airtable API Error ${response.status}`);
      }

      const data = await response.json();
      return data.records.map(record => ({
        id: record.id,
        ...record.fields
      }));
    } catch (error) {
      console.error(`Error filtering ${tableName}:`, error);
      return [];
    }
  }
};
