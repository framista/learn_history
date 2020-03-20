export default class Question {
    constructor(event, date, step = -1, userPosition = 0){
        this.event = event;
        this.date = date;
        this.step = step;
        this.userPosition = userPosition;
    }
}