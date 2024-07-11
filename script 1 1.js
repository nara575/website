document.addEventListener('DOMContentLoaded', function() {
    // Function to update clock
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timeFormatted = `${hours}:${minutes}:${seconds}`;

        document.getElementById('clock').textContent = timeFormatted;
    }

    // Function to update date
    function updateDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const dateFormatted = `${year}-${month}-${day}`;

        document.getElementById('date').textContent = dateFormatted;
    }

    // Update clock and date every second
    setInterval(updateClock, 1000);
    setInterval(updateDate, 1000);

    // Load clothes data from local storage when page loads
    window.addEventListener('load', function() {
        const clothesData = JSON.parse(localStorage.getItem('clothesList')) || [];
        clothesData.forEach(clothes => {
            addClothesToList(clothes.name, clothes.type, clothes.season, clothes.expiry, clothes.imageUrl);
        });
    });

    // Form submit event listener
    document.getElementById('clothes-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form input values
        const clothesName = document.getElementById('clothes-name').value;
        const clothesType = document.getElementById('clothes-type').value;
        const season = document.getElementById('season').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const clothesImage = document.getElementById('clothes-image').files[0];

        // Check for duplicate name in the list
        const clothesList = document.querySelectorAll('.clothes-item h3');
        let isDuplicate = false;
        clothesList.forEach(item => {
            if (item.textContent === clothesName) {
                isDuplicate = true;
                // Display duplicate warning message
                alert('중복되는 옷 이름입니다. 다른 이름을 사용해주세요.');
                return;
            }
        });

        // Check if expiry date is selected
        if (!expiryDate) {
            alert('기한을 선택해주세요.');
            return;
        }

        // If not duplicate and expiry date is selected, proceed to add to list and save to localStorage
        if (!isDuplicate) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                addClothesToList(clothesName, clothesType, season, expiryDate, imageUrl);
                saveClothesToLocalStorage(clothesName, clothesType, season, expiryDate, imageUrl);
            };
            if (clothesImage) {
                reader.readAsDataURL(clothesImage); // Convert file to data URL
            }

            // Reset form after submission
            document.getElementById('clothes-form').reset();

            // Hide preview image
            hidePreviewImage();
        }
    });

    // Function to hide preview image
    function hidePreviewImage() {
        const previewImage = document.getElementById('preview');
        previewImage.style.display = 'none';
        previewImage.setAttribute('src', '#');
    }

    // Function to add clothes item to list
    function addClothesToList(name, type, season, expiry, imageUrl) {
        const list = document.getElementById('list');

        const item = document.createElement('div');
        item.classList.add('clothes-item');

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = name;
        item.appendChild(img);

        const content = document.createElement('div');
        content.classList.add('clothes-item-content');

        const header = document.createElement('div');
        header.classList.add('clothes-header');

        const itemName = document.createElement('h3');
        itemName.textContent = name;
        header.appendChild(itemName);

        const removeButton = document.createElement('button');
        removeButton.textContent = '제거';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', function() {
            removeClothesFromList(item, name);
        });
        header.appendChild(removeButton);

        content.appendChild(header);

        const itemType = document.createElement('p');
        itemType.textContent = `종류: ${type}`;
        content.appendChild(itemType);

        const itemSeason = document.createElement('p');
        itemSeason.textContent = `계절: ${season}`;
        content.appendChild(itemSeason);

        const itemExpiry = document.createElement('p');
        itemExpiry.textContent = `기한: ${expiry}`;
        content.appendChild(itemExpiry);

        item.appendChild(content);

        // Toggle visibility of item details on click
        item.addEventListener('click', function() {
            const itemContent = item.querySelector('.clothes-item-content');
            itemContent.classList.toggle('hidden');
        });

        list.appendChild(item);
    }

    // Function to remove clothes item from list
    function removeClothesFromList(item, name) {
        const list = document.getElementById('list');
        list.removeChild(item);

        // Remove from localStorage
        let clothesData = JSON.parse(localStorage.getItem('clothesList')) || [];
        clothesData = clothesData.filter(clothes => clothes.name !== name);
        localStorage.setItem('clothesList', JSON.stringify(clothesData));
    }

    // Function to save clothes data to localStorage
    function saveClothesToLocalStorage(name, type, season, expiry, imageUrl) {
        const clothesData = JSON.parse(localStorage.getItem('clothesList')) || [];
        clothesData.push({ name, type, season, expiry, imageUrl });
        localStorage.setItem('clothesList', JSON.stringify(clothesData));
    }
});

// Preview image update when file selected
document.getElementById('clothes-image').addEventListener('change', function() {
    const file = this.files[0];
    const previewImage = document.getElementById('preview');
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.style.display = 'block';
            previewImage.setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(file); // Convert file to data URL
    } else {
        previewImage.style.display = 'none';
        previewImage.setAttribute('src', '#');
    }
});
