// Notification Function (without OK button)
function showNotification(message, duration = 3000) {
    const notification = document.getElementById("notification");
    if (notification) {
      notification.textContent = message;
      notification.style.display = "block";
      setTimeout(() => {
        notification.style.display = "none";
      }, duration);
    } else {
      // Fallback to alert if notification element is not found.
      alert(message);
    }
  }
  
  // Gemini API Chatbot Integration
  
  // Gemini API configuration – using your provided key and endpoint.
  const GEMINI_API_KEY = 'AIzaSyAf2aqWrPJ2dJL8SQR5sjOSRpCra1f7MEM';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
  
  // Function to generate a response from the Gemini API
  async function generateResponse(prompt) {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      })
    });
  
    if (!response.ok) {
      throw new Error('Failed to generate response');
    }
  
    const data = await response.json();
    // Adjust extraction as per Gemini API's response structure.
    return data.candidates[0].content.parts[0].text;
  }
  
  // Function to clean up markdown (if needed)
  function cleanMarkdown(text) {
    return text
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  
  // Chatbot UI Functionality (Floating Chat Icon & Window)
  
  // Element references for chat UI.
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const chatIcon = document.getElementById('chatIcon');
  const chatWindowContainer = document.getElementById('chatWindowContainer');
  const closeChatBtn = document.getElementById('closeChat');
  
  // Add a new message to the chat window.
  function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
  
  
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;
  
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Handle user input, get the Gemini response, and display it.
  async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
      addMessage(userMessage, true);
      userInput.value = '';
      sendButton.disabled = true;
      userInput.disabled = true;
      try {
        const botResponse = await generateResponse(userMessage);
        const cleanedResponse = cleanMarkdown(botResponse);
        // Show a notification and immediately display the bot response.
        addMessage(cleanedResponse, false);
      } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, I encountered an error. Please try again.', false);
        showNotification("Error generating response.", 4000);
      } finally {
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
      }
    }
  }
  
  // Event listeners for sending messages.
  sendButton.addEventListener('click', handleUserInput);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserInput();
    }
  });
  
  // Chat Window Toggling (Floating Chat Icon)
  
  // Show chat window when the chat icon is clicked.
  chatIcon.addEventListener("click", () => {
    chatWindowContainer.style.display = "flex";
  });
  
  // Hide chat window when the close button is clicked.
  closeChatBtn.addEventListener("click", () => {
    chatWindowContainer.style.display = "none";
  });
  
  // Additional Bot Welcome Message (only once when opening the chat)
  chatIcon.addEventListener("click", function() {
    chatWindowContainer.style.display = "flex"; 
    if (!chatWindowContainer.dataset.opened) {
      addMessage("Welcome to the Book Chat! How can I help you today?", false);
      chatWindowContainer.dataset.opened = true;
    }
  });