/**
 * Module de gestion du stockage (Airtable + localStorage fallback)
 * Fonctions génériques pour la persistance des données
 */

const Storage = {
  // Mapping des clés localStorage vers les tables Airtable
  TABLE_MAPPING: {
    'myassist_courriers': 'Courriers',
    'myassist_rendezvous': 'Rendez-vous',
    'myassist_contacts': 'Contacts',
    'myassist_documents': 'Documents',
    'myassist_users': 'Utilisateurs'
  },

  /**
   * Obtenir le nom de la table Airtable à partir de la clé
   * @param {string} key - Clé de stockage
   * @returns {string} Nom de la table Airtable
   */
  getTableName(key) {
    return this.TABLE_MAPPING[key] || null;
  },

  /**
   * Récupérer des données depuis Airtable (ou localStorage en fallback)
   * @param {string} key - Clé de stockage
   * @returns {Promise<Array>} Données stockées ou tableau vide
   */
  async getData(key) {
    const tableName = this.getTableName(key);
    
    if (tableName && typeof AirtableAPI !== 'undefined') {
      try {
        Loader.show('Chargement des données...');
        const data = await AirtableAPI.getAll(tableName);
        Loader.hide();
        return data;
      } catch (error) {
        Loader.hide();
        console.error('Error fetching from Airtable, falling back to localStorage:', error);
        // Fallback vers localStorage
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
      }
    }
    
    // Fallback localStorage si pas de table Airtable
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Sauvegarder des données dans Airtable (ou localStorage en fallback)
   * @param {string} key - Clé de stockage
   * @param {Array} data - Données à stocker
   */
  async saveData(key, data) {
    const tableName = this.getTableName(key);
    
    if (tableName && typeof AirtableAPI !== 'undefined') {
      try {
        // Pour Airtable, on ne peut pas remplacer toutes les données en une seule requête
        // On utilise localStorage comme cache et synchronisation sera gérée différemment
        localStorage.setItem(key, JSON.stringify(data));
        return;
      } catch (error) {
        console.error('Error saving to Airtable, falling back to localStorage:', error);
      }
    }
    
    localStorage.setItem(key, JSON.stringify(data));
  },

  /**
   * Ajouter un élément
   * @param {string} key - Clé de stockage
   * @param {Object} item - Élément à ajouter
   * @returns {Promise<Object>} Élément ajouté avec ID
   */
  async addItem(key, item) {
    const tableName = this.getTableName(key);
    
    if (tableName && typeof AirtableAPI !== 'undefined') {
      try {
        Loader.show('Enregistrement...');
        // Retirer le champ 'id' car Airtable le génère automatiquement
        const { id, ...airtableItem } = item;
        airtableItem.createdAt = new Date().toISOString();
        const created = await AirtableAPI.create(tableName, airtableItem);
        Loader.hide();
        // Retourner l'item avec l'ID généré par Airtable
        return { ...item, id: created.id };
      } catch (error) {
        Loader.hide();
        console.error('Error adding to Airtable, falling back to localStorage:', error);
      }
    }
    
    // Fallback localStorage
    const data = await this.getData(key);
    item.id = this.generateId();
    item.createdAt = new Date().toISOString();
    data.push(item);
    await this.saveData(key, data);
    return item;
  },

  /**
   * Mettre à jour un élément
   * @param {string} key - Clé de stockage
   * @param {string} id - ID de l'élément
   * @param {Object} newData - Nouvelles données
   * @returns {Promise<Object|null>} Élément mis à jour ou null
   */
  async updateItem(key, id, newData) {
    const tableName = this.getTableName(key);
    
    if (tableName && typeof AirtableAPI !== 'undefined') {
      try {
        const updated = await AirtableAPI.update(tableName, id, newData);
        return updated;
      } catch (error) {
        console.error('Error updating in Airtable, falling back to localStorage:', error);
      }
    }
    
    // Fallback localStorage
    const data = await this.getData(key);
    const index = data.findIndex(item => item.id === id);
    
    if (index !== -1) {
      data[index] = { ...data[index], ...newData, updatedAt: new Date().toISOString() };
      await this.saveData(key, data);
      return data[index];
    }
    
    return null;
  },

  /**
   * Supprimer un élément
   * @param {string} key - Clé de stockage
   * @param {string} id - ID de l'élément
   * @returns {Promise<boolean>} True si supprimé, false sinon
   */
  async deleteItem(key, id) {
    const tableName = this.getTableName(key);
    
    if (tableName && typeof AirtableAPI !== 'undefined') {
      try {
        const deleted = await AirtableAPI.delete(tableName, id);
        return deleted;
      } catch (error) {
        console.error('Error deleting from Airtable, falling back to localStorage:', error);
      }
    }
    
    // Fallback localStorage
    const data = await this.getData(key);
    const filteredData = data.filter(item => item.id !== id);
    
    if (filteredData.length !== data.length) {
      await this.saveData(key, filteredData);
      return true;
    }
    
    return false;
  },

  /**
   * Générer un ID unique
   * @returns {string} ID unique
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Générer une référence avec préfixe
   * @param {string} prefix - Préfixe de la référence
   * @param {string} key - Clé de stockage pour compter les éléments
   * @returns {Promise<string>} Référence générée
   */
  async generateReference(prefix, key) {
    const data = await this.getData(key);
    const year = new Date().getFullYear();
    const number = (data.length + 1).toString().padStart(4, '0');
    return `${prefix}-${year}-${number}`;
  },

  /**
   * Réinitialiser toutes les données
   */
  clearAll() {
    localStorage.clear();
  },

  /**
   * Réinitialiser une clé spécifique
   * @param {string} key - Clé à réinitialiser
   */
  clearKey(key) {
    localStorage.removeItem(key);
  }
};
