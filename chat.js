async function sendMessage(message) {
    const endpoint = CONFIG.ENDPOINT || CONFIG.FLOW_ID;
    const apiUrl = `${CONFIG.BASE_API_URL}/lf/${CONFIG.LANGFLOW_ID}/api/v1/run/${endpoint}`;

    const token = sessionStorage.getItem('applicationToken');
    if (!token) {
        throw new Error('Application token not found');
    }

    const payload = {
        input_value: message,
        output_type: "chat",
        input_type: "chat",
        tweaks: CONFIG.TWEAKS
    };

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Add these functions to handle token storage and retrieval
function saveToken() {
    const token = document.getElementById('applicationToken').value;
    sessionStorage.setItem('applicationToken', token);
    // Optionally clear the input or show success message
    document.getElementById('applicationToken').value = '';
    alert('Token saved successfully!');
}

// Update handleChatSubmission to get message from input and display messages
async function handleChatSubmission() {
    const messageInput = document.getElementById('userInput');
    const message = messageInput.value.trim();
    
    if (!message) return; // Don't send empty messages
    
    // Display user message
    displayMessage('user', message);
    
    // Clear input
    messageInput.value = '';
    
    const token = sessionStorage.getItem('applicationToken');
    if (!token) {
        alert('Please enter an application token first');
        return;
    }
    
    // Show loading state
    displayMessage('system', 'Loading...');
    
    const response = await sendMessage(message);
    
    // Remove loading message
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.removeChild(chatMessages.lastChild);
    
    if (response && response.result) {
        displayMessage('bot', response.result);
    } else {
        displayMessage('system', 'Error: Failed to get response');
    }
}

// Function to display messages in the chat
function displayMessage(type, content) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add event listener for Enter key
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleChatSubmission();
    }
});

// ... rest of the code remains the same ... 