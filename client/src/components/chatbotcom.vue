<template>
  <div>
    <!-- Nút để mở chatbot -->
    <button id="chatbot-icon" @click="toggleChatbot" class="chatbot-icon">💬</button>

    <!-- Container chatbot -->
    <div id="chatbot-container" v-show="isChatbotVisible" class="chatbot-container">
      <h5 class="chatbot-header">HỎI ĐÁP CÙNG 4GYM</h5>
      <div class="message-container" id="messageContainer">
        <div v-for="(msg, index) in messages" :key="index" :class="msg.sender === 'user' ? 'user-message' : 'bot-message'">
          {{ msg.message }}
        </div>
      </div>
      <form @submit.prevent="sendMessage" class="chatbot-form">
        <div class="input-row">
          <textarea 
            v-model="messageInput" 
            rows="1" 
            placeholder="Soạn tin nhắn..." 
            class="message-input" 
            @keydown.enter="sendMessage">
          </textarea>
          <button type="submit" class="send-btn">Gửi</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import chatbotService from '../services/chatbot.service';

export default {
  data() {
    return {
      isChatbotVisible: false,
      isWelcomeMessageSent: false,
      messageInput: '',
      messages: [],
    };
  },
  methods: {
    toggleChatbot() {
      if (!this.isWelcomeMessageSent) {
        this.addMessageToChat('bot', 'Gym xin chào bạn, mình có thể giúp gì cho bạn?');
        this.isWelcomeMessageSent = true;
      }
      this.isChatbotVisible = !this.isChatbotVisible;
    },
    async sendMessage() {
      if (this.messageInput.trim() !== '') {
        this.addMessageToChat('user', this.messageInput);

        try {
          const response = await chatbotService.getChatbotResponse({
            sender: 'user',
            message: this.messageInput,
          });
          if (Array.isArray(response) && response.length > 0) {
            const botMessage = response[0].text;
            this.addMessageToChat('bot', botMessage);
          } else {
            console.error('Invalid response format:', response);
          }
          this.messageInput = '';
        } catch (error) {
          console.error('Error:', error);
        }
      }
    },
    addMessageToChat(sender, message) {
      this.messages.push({ sender, message });
      this.$nextTick(() => {
        const messageContainer = this.$refs.messageContainer;
        // Scroll tự động tới tin nhắn mới nhất
        messageContainer.scrollTop = messageContainer.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
/* Nút chatbot */
.chatbot-icon {
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: #EF233C;
  border: none;
  border-radius: 50%;
  color: white;
  padding: 15px;
  font-size: 20px;
  cursor: pointer;
  z-index: 1000;
}

.chatbot-icon:hover {
  background-color: #D90429;
}

/* Container chatbot */
.chatbot-container {
  /* position: fixed; */
  bottom: 80px;
  right: 20px;
  width: 100%;
  max-width: 400px;
  min-height: 700px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 3001;
}

/* Header chatbot */
.chatbot-header {
  background-color: #D90429;
  color: white;
  padding: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  text-align: center;
  font-weight: bold;
}
/* Container tin nhắn */
.message-container {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
  
}

/* Tin nhắn người dùng (căn phải) */
.user-message {
  background-color: #d90429; /* Đỏ tươi */
  color: white;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 8px;
  align-self: flex-end; /* Căn về bên phải */
  max-width: 70%;
}

/* Tin nhắn bot (căn trái) */
.bot-message {
  background-color: #e0e0e0; 
  color: #000;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 8px;
  align-self: flex-start; /* Căn về bên trái */
  max-width: 70%;
}


/* Form nhập tin nhắn */
.chatbot-form {
  padding: 10px;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  padding-bottom: 10px ;
}

.input-row {
  display: flex;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  resize: none;
  outline: none;
}

.send-btn {
  background-color: #EF233C;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px 12px;
  margin-left: 10px;
  cursor: pointer;
}

.send-btn:hover {
  background-color: #D90429;
}

@media (max-width: 600px) {
  .chatbot-container {
    width: 100%;
    bottom: 0;
    right: 0;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
    z-index: 9999;
  }

  .message-input {
    font-size: 14px;
  }

  .send-btn {
    padding: 8px 10px;
  }
}
</style>
