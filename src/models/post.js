export default class Post {
    constructor(title, img) {
        this.titile = title
        this.date = new Date();
        this.img = img;
    }

    toString () {
        return JSON.stringify({
            titile: this.titile,
            date: this.date.toJSON(),
            img: this.img,
        }, null, 2)
    }

    get uppercaseTitle() {
        return this.titile.toUpperCase();
    }
}