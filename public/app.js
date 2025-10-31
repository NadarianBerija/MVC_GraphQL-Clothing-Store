document.addEventListener('DOMContentLoaded', () => {

    const clothList = document.getElementById('cloth-list');
    const addClothForm = document.getElementById('add-cloth-form');
    const editModal = document.getElementById('edit-modal');
    const editClothForm = document.getElementById('edit-cloth-form');
    const closeModalButton = document.querySelector('.close-button');

    // --- Функция для выполнения GraphQL запросов --- //
    const graphqlQuery = async (query, variables = {}) => {
        const response = await fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        });
        return await response.json();
    };

    // --- Функция для отображения игрушек --- //
    const displayClothes = (clothes) => {
        clothList.innerHTML = '';
        clothes.forEach(cloth => {
            const clothCard = `
            <div class="cloth-card" data-id="${cloth.id}">
                <img src="${cloth.image}" alt="${cloth.name}">
                <div class="cloth-card-content">
                    <h3>${cloth.name}</h3>
                    <p>${cloth.category}</p>
                    <p>${cloth.description}</p>
                    <div class="price">$${cloth.price.toFixed(2)}</div>
                </div>
                <div class="cloth-card-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
            `;
            clothList.innerHTML += clothCard;
        });
    };

    // --- Функция для загрузки одежды с сервера --- //
    const fetchClothes = async () => {
        const query = `
            query {
                clothes {
                    id
                    name
                    description
                    price
                    category
                    image
                }
            }
        `;
        const data = await graphqlQuery(query);
        if (data.data && data.data.clothes) {
            displayClothes(data.data.clothes);
        }
    };

    // --- Обработчик отправки формы добавления одежды --- //
    addClothForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = parseFloat(document.getElementById('price').value);
        const category = document.getElementById('category').value;
        let image = document.getElementById('image').value;
        if (!image) {
            image = '/img/no_image.jpg';
        }
        

        // Формируем GraphQL мутацию для добавления одежды
        const mutation = `
            mutation AddCloth($name: String!, $description: String!, $price: Float!, $category: String!, $image: String!) {
                addCloth(name: $name, description: $description, price: $price, category: $category, image: $image) {
                    id
                    name
                }    
            }
        `;

        const variables = { name, description, price, category, image };

        // Отправляем мутацию на сервер
        const data = await graphqlQuery(mutation, variables);

        if (data.data && data.data.addCloth) {
            console.log('Игрушка успешно добавлена:', data.data.addCloth);
            fetchClothes(); 
            addClothForm.reset();
        } else {
            console.error('Ошибка добавления игрушки:', data.errors);
        }
    });

    // --- Обработчики кнопок редактирования и удаления --- //
    clothList.addEventListener('click', (e) => {
        const target = e.target;
        const clothCard = target.closest('.cloth-card');
        const clothId = clothCard.dataset.id;

        if (target.classList.contains('edit-btn')) {
            openEditModal(clothId);
        } else if (target.classList.contains('delete-btn')) {
            deleteCloth(clothId);
        }
    });

    // --- Функция модального окна редактирования --- //
    const openEditModal = async (clothId) => {
        const query = `
            query GetCloth($id: ID!) {
                cloth(id: $id) {
                    name
                    description
                    price
                    category 
                    image   
                }    
            }
        `;
        const variables = { id: clothId };
        const data = await graphqlQuery(query, variables);

        if (data.data && data.data.cloth) {
            const cloth = data.data.cloth;
            document.getElementById('edit-cloth-id').value = clothId;
            document.getElementById('edit-name').value = cloth.name;
            document.getElementById('edit-description').value = cloth.description;
            document.getElementById('edit-price').value = cloth.price;
            document.getElementById('edit-category').value = cloth.category;
            document.getElementById('edit-image').value = cloth.image;
            editModal.style.display = 'block';
        }
    };

    const closeEditModal = () => {
        editModal.style.display = 'none';
    };

    closeModalButton.addEventListener('click', closeEditModal);
    window.addEventListener('click', (e) => {
        if (e.target == editModal) {
            closeEditModal();
        }
    });

    // --- Обработчик отправки формы редактирования --- //
    editClothForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('edit-cloth-id').value;
        const name = document.getElementById('edit-name').value;
        const description = document.getElementById('edit-description').value;
        const price = parseFloat(document.getElementById('edit-price').value);
        const category = document.getElementById('edit-category').value;
        let image = document.getElementById('edit-image').value;
        if (!image) {
            image = '/img/no_image.jpg';
        }

        const mutation = `
            mutation UpdateToy($id: ID!, $name: String, $description: String, $price: Float, $category: String, $image: String) {
                updateCloth(id: $id, name: $name, description: $description, price: $price, category: $category, image: $image){
                    id
                }    
            }
        `;

        const variables = { id, name, description, price, category, image };

        const data = await graphqlQuery(mutation, variables);

        if (data.data && data.data.updateCloth) {
            console.log('Одежда успешно обновлена');
            closeEditModal();
            fetchClothes();
        } else {
            console.error('Ошибка обновления одежды:', data.errors);
        }
    });

    // --- Функция удаления одежды --- //
    const deleteCloth = async (clothId) => {
        if (!confirm('Вы уверены, что хотите удалить эту одежду?')) {
            return;
        }

        const mutation = `
            mutation DeleteCloth($id: ID!) {
                deleteCloth(id: $id) {
                    id
                }    
            }
        `;

        const variables = { id: clothId };

        const data = await graphqlQuery(mutation, variables);

        if (data.data && data.data.deleteCloth) {
            console.log('Одежда успешно удалена');
            fetchClothes();
        } else {
            console.error('Ошибка удаелния одежды:', data.errors);
        }
    };

    fetchClothes();
});