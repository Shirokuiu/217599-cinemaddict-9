export default class LocalCommentModel {
  constructor(data) {
    this.id = data.id;
    this.comment = data.comment;
    this.date = data.date;
    this.emotion = data.emotion;
  }

  toRAW() {
    return {
      'comment': this.comment,
      'date': this.date,
      'emotion': this.emotion,
    };
  }
}
