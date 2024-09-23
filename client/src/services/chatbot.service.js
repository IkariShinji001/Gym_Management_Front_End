import api from "./api.service";

class chatbotService {
    async getChatbotResponse(message) {
        return (await api.post(`/chatbot/message`,  message )).data;
    }
}

export default new chatbotService();
