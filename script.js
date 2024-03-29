// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC-Ov584BuloOkErobWOKuDCtFgNPrI4JU",
    authDomain: "listecourses-607b6.firebaseapp.com",
    projectId: "listecourses-607b6",
    storageBucket: "listecourses-607b6.appspot.com",
    messagingSenderId: "818706547838",
    appId: "1:818706547838:web:5c363f01f457ed5c19842f"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Référence à la collection "shoppingList" dans Firestore
const db = firebase.firestore();
const shoppingListRef = db.collection('shoppingList').doc('list');

// Fonction pour ajouter un élément à la liste actuelle
function addItem() {
    let newItem = document.getElementById('item').value.trim();
    if (newItem !== '') {
        shoppingListRef.set({}, { merge: true }).then(() => {
            shoppingListRef.update({
                items: firebase.firestore.FieldValue.arrayUnion({ name: newItem, completed: false })
            });
        });
    }
}

// Observer les changements dans la liste Firestore
shoppingListRef.onSnapshot((doc) => {
    const data = doc.data();
    if (data) {
        displayList(data.items || []);
    }
});

// Fonction pour afficher une liste
function displayList(list) {
    let listElement = document.getElementById('list');
    listElement.innerHTML = '';
    list.forEach((item, index) => {
        let li = document.createElement('li');
        li.textContent = item.name;
        if (item.completed) {
            li.classList.add('completed');
        }
        li.addEventListener('click', () => {
            toggleComplete(item);
        });
        listElement.appendChild(li);
    });
}

// Fonction pour basculer l'état complet d'un élément de la liste
function toggleComplete(item) {
    shoppingListRef.update({
        items: firebase.firestore.FieldValue.arrayRemove(item),
        items: firebase.firestore.FieldValue.arrayUnion({ name: item.name, completed: !item.completed })
    });
}

// Sélectionner le bouton "Ajouter"
const addItemBtn = document.getElementById('addItemBtn');

// Ajouter un événement au bouton "Ajouter"
addItemBtn.addEventListener('click', addItem);
