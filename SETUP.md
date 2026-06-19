# Configuration MyAssist

## Configuration Airtable

Pour utiliser MyAssist avec Airtable, vous devez configurer vos credentials dans le localStorage de votre navigateur.

### Étapes de configuration

1. Ouvrez la console de votre navigateur (F12)
2. Exécutez les commandes suivantes dans la console :

```javascript
localStorage.setItem('AIRTABLE_TOKEN', 'votre_token_airtable');
localStorage.setItem('AIRTABLE_BASE', 'votre_base_id');
```

3. Remplacez `votre_token_airtable` par votre Personal Access Token Airtable
4. Remplacez `votre_base_id` par l'ID de votre base Airtable

### Création des tables

1. Ouvrez `setup-airtable.html` dans votre navigateur
2. Cliquez sur "🚀 Créer les tables automatiquement"
3. Les tables suivantes seront créées :
   - Courriers
   - Rendez-vous
   - Contacts
   - Documents
   - Utilisateurs

### Obtenir vos credentials Airtable

1. Allez sur https://airtable.com/create/tokens
2. Créez un nouveau Personal Access Token
3. Sélectionnez les scopes nécessaires :
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
   - `schema.bases:write`
4. Copiez le token généré

5. Pour obtenir votre Base ID :
   - Ouvrez votre base Airtable
   - L'ID se trouve dans l'URL : `https://airtable.com/app[YOUR_BASE_ID]/...`

### Utilisation

Une fois configuré, l'application utilisera Airtable comme stockage principal. Si Airtable n'est pas disponible, elle utilisera localStorage comme solution de repli.
