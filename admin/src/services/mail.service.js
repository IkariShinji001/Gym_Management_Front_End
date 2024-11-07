import api from "./api.service";

class MailService {
  constructor() {
    this.path = "/emails";
  }

  async sendMail(emailList) {
    const formData = new FormData();

    formData.append("recipients", JSON.stringify(emailList.recipients));
    formData.append("from", JSON.stringify(emailList.from));
    formData.append("subject", emailList.subject);
    formData.append("html", emailList.html);

    if (emailList.files && emailList.files.length > 0) {
      emailList.files.forEach((file, index) => {
        formData.append(`files`, file);
      });
    }

    return (
      await api.post(`${this.path}/send`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  async sendAllMail(emailList) {
    const formData = new FormData();

    formData.append("recipients", JSON.stringify(emailList.recipients));
    formData.append("from", JSON.stringify(emailList.from));
    formData.append("subject", emailList.subject);
    formData.append("html", emailList.html);

    if (emailList.files && emailList.files.length > 0) {
      emailList.files.forEach((file, index) => {
        formData.append(`files`, file);
      });
    }

    return (
      await api.post(`${this.path}/send-all`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }
}

export default new MailService();
