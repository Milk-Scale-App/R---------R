document.addEventListener('DOMContentLoaded', loadUsers);

function loadUsers() {
    const userListContainer = document.getElementById('user-list-container');
    const noUsersMessage = document.getElementById('no-users');
    userListContainer.innerHTML = '';
    
    // localStorage से सभी keys निकालें
    const localStorageKeys = Object.keys(localStorage);
    
    // फ़िल्टर करें और केवल वह keys रखें जो यूज़र डेटा स्टोर करती हैं
    // (हम मान रहे हैं कि contact/email ही key है)
    const userKeys = localStorageKeys.filter(key => {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            return data && data.name && data.contact && typeof data.balance === 'number';
        } catch (e) {
            return false;
        }
    });

    if (userKeys.length === 0) {
        noUsersMessage.classList.remove('hidden');
        return;
    }
    
    noUsersMessage.classList.add('hidden');

    // टेबल हैडर बनाएं
    let tableHTML = `
        <table class="user-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Contact (Email/Phone)</th>
                    <th>Current Balance (Rs)</th>
                    <th>Update Balance</th>
                </tr>
            </thead>
            <tbody>
    `;

    // प्रत्येक यूज़र के लिए रो (row) बनाएं
    userKeys.forEach(key => {
        const user = JSON.parse(localStorage.getItem(key));
        
        tableHTML += `
            <tr id="row-${user.contact}">
                <td>${user.name}</td>
                <td>${user.contact}</td>
                <td id="balance-${user.contact}">${user.balance.toFixed(2)}</td>
                <td>
                    <div class="balance-controls">
                        <input type="number" id="input-${user.contact}" placeholder="New Amount" step="0.01">
                        <button onclick="updateUserBalance('${user.contact}')">Update</button>
                    </div>
                </td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    userListContainer.innerHTML = tableHTML;
}

function updateUserBalance(contact) {
    const inputElement = document.getElementById(`input-${contact}`);
    const newBalanceText = inputElement.value;
    const newBalance = parseFloat(newBalanceText);

    if (isNaN(newBalance) || newBalance < 0) {
        alert("Invalid or negative balance amount entered."); // यहाँ alert का उपयोग एडमिन के लिए है
        return;
    }
    
    // 2 दशमलव स्थानों तक सीमित करें
    const finalBalance = parseFloat(newBalance.toFixed(2));
    
    try {
        // localStorage से यूज़र डेटा लोड करें
        const storedUser = localStorage.getItem(contact);
        if (!storedUser) {
            alert("Error: User not found in storage.");
            return;
        }

        let user = JSON.parse(storedUser);
        
        // बैलेंस अपडेट करें
        user.balance = finalBalance;
        
        // localStorage में वापस सेव करें
        localStorage.setItem(contact, JSON.stringify(user));

        // UI को अपडेट करें
        document.getElementById(`balance-${contact}`).textContent = finalBalance.toFixed(2);
        inputElement.value = ''; // इनपुट साफ़ करें
        
        alert(`Successfully updated ${user.name}'s balance to ${finalBalance.toFixed(2)} Rs.`);

    } catch (e) {
        alert("An error occurred while updating data.");
        console.error("Update Error:", e);
    }
}
